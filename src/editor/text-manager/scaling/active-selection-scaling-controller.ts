import {
  ActiveSelection,
  FabricImage,
  type Canvas,
  type FabricObject,
  type Transform
} from 'fabric/es'
import type CanvasManager from '../../canvas-manager'
import type {
  RectangularScaleGestureMode,
  RectangularScaleGestureProjection,
  RectangularScaleMultipliers
} from '../../snapping-manager/scaling/rectangular-scale-gesture-projection'
import type { ScaleSnapPlan } from '../../snapping-manager/scaling/scale-snapping-resolver'
import type { EditorTextbox } from '../types'
import type {
  ActiveSelectionScaleDomainSource
} from '../../selection-manager/scaling/active-selection-scale-domain-source'
import { resolveCanonicalActiveSelectionTexts } from './active-selection-text-children'
import ActiveSelectionTextScaleMeasurer, {
  type ActiveSelectionTextScaleMeasurement
} from './active-selection-scale-measurer'
import {
  resolveActiveSelectionTextScaleStep,
  type ResolvedActiveSelectionTextScaleStep
} from './active-selection-scale-plan'

/** Ручки, которые действительно отображаются для общего выделения с текстом. */
const ACTIVE_SELECTION_TEXT_SCALE_CONTROLS = Object.freeze(new Set([
  'tl',
  'tr',
  'bl',
  'br',
  'ml',
  'mr'
]))

/** Допуск проверки канонического состояния текста и рамки. */
const ACTIVE_SELECTION_TEXT_SCALE_STATE_EPSILON = 0.000000001

/** Временное состояние одного поддерживаемого жеста выделения с текстами. */
type ActiveSelectionTextScalingSession = Readonly<{
  children: readonly FabricObject[]
  measurer: ActiveSelectionTextScaleMeasurer
  selection: ActiveSelection
  texts: readonly EditorTextbox[]
  transform: Transform
}>

/** Поддерживаемые дети общего выделения, в котором текст задаёт нелинейную геометрию. */
type ActiveSelectionTextScalingContent = Readonly<{
  affineChildren: readonly FabricImage[]
  children: readonly FabricObject[]
  texts: readonly EditorTextbox[]
}>

/** Проверяет, что число совпадает с ожидаемым каноническим значением. */
function isNear({ actual, expected }: { actual: number; expected: number }): boolean {
  return Number.isFinite(actual)
    && Number.isFinite(expected)
    && Math.abs(actual - expected) <= ACTIVE_SELECTION_TEXT_SCALE_STATE_EPSILON
}

/** Возвращает каноническое изображение, которое может линейно меняться вместе с общей рамкой. */
function resolveSupportedAffineImage({
  selection,
  target
}: {
  selection: ActiveSelection
  target: FabricObject
}): FabricImage | null {
  if (!(target instanceof FabricImage)) return null
  if (target.group !== selection) return null

  const protectedState = [
    target.parent,
    target.flipX,
    target.flipY,
    target.locked,
    target.lockScalingX,
    target.lockScalingY
  ]
  if (protectedState.some(Boolean)) return null

  const dimensions = [
    target.width,
    target.height,
    target.scaleX,
    target.scaleY
  ]
  if (!dimensions.every(Number.isFinite) || Math.min(...dimensions) <= 0) return null

  const transformValues = [
    target.angle ?? 0,
    target.skewX ?? 0,
    target.skewY ?? 0,
    target.strokeWidth ?? 0
  ]
  const isCanonical = transformValues.every((actual) => isNear({ actual, expected: 0 }))

  return isCanonical ? target : null
}

/** Возвращает поддерживаемые тексты, изображения и явно переданные доменные объекты. */
function resolveSupportedSelectionContent({
  domainTargets = [],
  selection
}: {
  domainTargets?: readonly FabricObject[]
  selection: ActiveSelection
}): ActiveSelectionTextScalingContent | null {
  if (!isNear({ actual: selection.scaleX ?? 1, expected: 1 })) return null
  if (!isNear({ actual: selection.scaleY ?? 1, expected: 1 })) return null

  const objects = selection.getObjects()
  if (objects.length < 2) return null

  const texts = resolveCanonicalActiveSelectionTexts({ selection })
  if (!texts) return null
  const textSet = new Set<FabricObject>(texts)
  const domainTargetSet = new Set(domainTargets)
  if (domainTargetSet.size !== domainTargets.length) return null
  if (domainTargets.some((target) => target.group !== selection || textSet.has(target))) return null
  const affineChildren: FabricImage[] = []
  for (const object of objects) {
    if (textSet.has(object) || domainTargetSet.has(object)) continue

    const image = resolveSupportedAffineImage({ selection, target: object })
    if (!image) return null
    affineChildren.push(image)
  }
  if (domainTargets.some((target) => !objects.includes(target))) return null

  return Object.freeze({
    affineChildren: Object.freeze(affineChildren),
    children: Object.freeze([...objects]),
    texts
  })
}

/** Управляет общим выделением, в котором тексты задают нелинейную геометрию. */
export default class TextActiveSelectionScalingController {
  /** Fabric canvas редактора. */
  private readonly canvas: Canvas

  /** Менеджер холста, используемый при переносе рассчитанных размеров в свойства текста. */
  private readonly canvasManager: CanvasManager

  /** Единственная активная сессия текущего временного выделения. */
  private session: ActiveSelectionTextScalingSession | null = null

  /** Создаёт владельца текстовой части скейлинга общего выделения. */
  constructor({
    canvas,
    canvasManager
  }: {
    canvas: Canvas
    canvasManager: CanvasManager
  }) {
    this.canvas = canvas
    this.canvasManager = canvasManager
  }

  /** Проверяет канонический состав из текстов, изображений и необязательных доменных объектов. */
  public supportsScaling({
    domainTargets,
    selection
  }: {
    domainTargets?: readonly FabricObject[]
    selection: ActiveSelection
  }): boolean {
    return resolveSupportedSelectionContent({ domainTargets, selection }) !== null
  }

  /** Фиксирует неизменяемое начало поддерживаемого жеста до первой мутации Fabric. */
  public beginScaling({
    domainSource,
    projection,
    selection,
    transform
  }: {
    domainSource?: ActiveSelectionScaleDomainSource | null
    projection: RectangularScaleGestureProjection
    selection: ActiveSelection
    transform: Transform
  }): boolean {
    const content = resolveSupportedSelectionContent({
      domainTargets: domainSource?.targets,
      selection
    })
    if (!content || transform.target !== selection) return false
    if (!ACTIVE_SELECTION_TEXT_SCALE_CONTROLS.has(transform.corner)) return false
    if (this.session) throw new Error('Сессия скейлинга выделения с текстом уже начата')

    const measurer = new ActiveSelectionTextScaleMeasurer({
      affineChildren: content.affineChildren,
      canvasManager: this.canvasManager,
      children: content.texts,
      domainSource,
      projection,
      selection,
      transform
    })
    this.session = Object.freeze({
      children: content.children,
      measurer,
      selection,
      texts: content.texts,
      transform
    })

    return true
  }

  /** Измеряет каноническую геометрию по текущему положению указателя. */
  public measureScale({
    mode,
    multipliers,
    selection
  }: {
    mode: RectangularScaleGestureMode
    multipliers: RectangularScaleMultipliers
    selection: ActiveSelection
  }): ActiveSelectionTextScaleMeasurement {
    return this._getSession({ selection }).measurer.measure({ mode, multipliers })
  }

  /** Уточняет общий план по фактическим границам и переносу строк всех текстов. */
  public resolveScaleStep({
    mode,
    plan,
    pointerMeasurement,
    selection
  }: {
    mode: RectangularScaleGestureMode
    plan: ScaleSnapPlan
    pointerMeasurement: ActiveSelectionTextScaleMeasurement
    selection: ActiveSelection
  }): ResolvedActiveSelectionTextScaleStep {
    const { measurer } = this._getSession({ selection })

    return resolveActiveSelectionTextScaleStep({
      measurer,
      mode,
      plan,
      pointerMeasurement
    })
  }

  /** Один раз применяет измеренное состояние к дочерним объектам и общей рамке. */
  public applyScalePreview({
    measurement,
    selection
  }: {
    measurement: ActiveSelectionTextScaleMeasurement
    selection: ActiveSelection
  }): RectangularScaleMultipliers {
    const { measurer } = this._getSession({ selection })
    measurer.apply({ measurement })
    this.canvas.requestRenderAll()

    return measurement.multipliers
  }

  /** Подтверждает применённый шаг после общей проверки фактической геометрии. */
  public confirmScalePreview({ selection }: { selection: ActiveSelection }): boolean {
    const { measurer } = this._getSession({ selection })

    return measurer.confirmAppliedMeasurement()
  }

  /** Проверяет рассчитанную геометрию детей, сохраняя снимок до завершения общей фиксации. */
  public commitScaling({
    selection
  }: {
    selection: ActiveSelection
  }): boolean {
    const { session } = this
    if (!session || session.selection !== selection) return false
    if (!session.measurer.hasConfirmedMeasurement()) {
      throw new Error('Фиксации выделения с текстами должно предшествовать подтверждённое состояние')
    }

    const failures: unknown[] = []
    try {
      if (this.canvas.getActiveObject() === selection) {
        throw new Error('SelectionManager должен снять временную рамку до фиксации текстов')
      }
      this._assertCommittedTexts({ texts: session.texts })
    } catch (error) {
      failures.push(error)
    }

    for (const child of session.children) {
      try {
        child.setCoords()
      } catch (error) {
        failures.push(error)
      }
    }
    const [firstFailure] = failures
    if (failures.length > 0) throw firstFailure

    return true
  }

  /** Очищает измерения прерванного или завершённого жеста. */
  public clearScaling({ selection }: { selection: ActiveSelection }): boolean {
    if (this.session?.selection !== selection) return false

    this._clearSession({ selection })

    return true
  }

  /** Проверяет, что текущая сессия уже подтвердила рассчитанную геометрию. */
  public hasConfirmedScalePreview({ selection }: { selection: ActiveSelection }): boolean {
    if (this.session?.selection !== selection) return false

    return this.session.measurer.hasConfirmedMeasurement()
  }

  /** Восстанавливает последнее подтверждённое или исходное состояние текущего жеста. */
  public restoreScalePreview({ selection }: { selection: ActiveSelection }): boolean {
    if (this.session?.selection !== selection) return false

    const restored = this.session.measurer.restoreConfirmedMeasurement()
    if (restored) this.canvas.requestRenderAll()

    return restored
  }

  /** Освобождает измеритель при уничтожении TextManager. */
  public destroy(): void {
    if (!this.session) return

    this._clearSession({ selection: this.session.selection })
  }

  /** Возвращает обязательную активную сессию переданного выделения. */
  private _getSession({ selection }: { selection: ActiveSelection }): ActiveSelectionTextScalingSession {
    const { session } = this
    if (!session || session.selection !== selection) {
      throw new Error('Скейлинг выделения с текстом должен начинаться с исходной сессии')
    }

    return session
  }

  /** Проверяет, что масштаб временной рамки полностью перенесён в канонические свойства текстов. */
  private _assertCommittedTexts({ texts }: { texts: readonly EditorTextbox[] }): void {
    for (const child of texts) {
      const affineValues = [
        (child.scaleX ?? 1) - 1,
        (child.scaleY ?? 1) - 1,
        child.angle ?? 0,
        child.skewX ?? 0,
        child.skewY ?? 0
      ]
      if (!affineValues.every((value) => isNear({ actual: value, expected: 0 }))) {
        throw new Error('После фиксации каждый текст должен иметь каноническое преобразование')
      }
    }
  }

  /** Освобождает измеритель и удаляет сессию переданного выделения. */
  private _clearSession({ selection }: { selection: ActiveSelection }): void {
    const { session } = this
    if (!session || session.selection !== selection) return

    session.measurer.dispose()
    this.session = null
  }
}
