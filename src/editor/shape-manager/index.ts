import {
  ActiveSelection,
  type FabricObject,
  type Transform
} from 'fabric/es'
import type { ImageEditor } from '../index'
import type { ObjectPlacement } from '../canvas-manager'
import type {
  ActiveSelectionScaleDomainSource
} from '../selection-manager/scaling/active-selection-scale-domain-source'
import {
  DEFAULT_SHAPE_PRESET_KEY,
  getShapePreset
} from './domain/shape-presets'
import ShapeGroupFactory from './creation/shape-group-factory'
import ShapeScalingController from './scaling/shape-scaling-controller'
import type {
  ActiveSelectionShapeScaleCommit
} from './scaling/active-selection-scale-commit'
import type { ActiveSelectionAppliedScale } from './scaling/active-selection-scaling-controller'
import type { ShapeScalingPointerEvent } from './scaling/shape-scaling-layout'
import {
  captureShapeScalingGeometry,
  restoreShapeScalingSnapshots
} from './scaling/shape-scaling-geometry-snapshot'
import {
  isShapeCornerScaleControl,
  resolveShapeCornerScaleMode,
  type ShapeCornerScaleMode
} from './scaling/shape-controls'
import ShapeEditingController from './editing/shape-editing-controller'
import ShapeEventController from './events/shape-event-controller'
import ShapeLayoutController from './layout/shape-layout-controller'
import ShapeLifecycleController from './lifecycle/shape-lifecycle-controller'
import ShapeMutationController from './mutation/shape-mutation-controller'
import ShapeTextNodeController from './text/shape-text-node-controller'
import {
  registerShapeGroup
} from './domain/shape-group'
import {
  getShapeNodes
} from './domain/shape-nodes'
import {
  isShapeGroup,
  resolveShapeGroup
} from './domain/shape-reference'
import type {
  ShapeAddedPayload,
  ShapeAddOptions,
  ShapeGroup,
  ShapeReference,
  ShapeStrokeOptions,
  ShapeTextAlignOptions,
  ShapeTextStyleOptions,
  ShapeTextNode,
  ShapeUpdateOptions
} from './types'

/** Допуск проверки канонического состояния шейпов в общем выделении. */
const ACTIVE_SELECTION_SHAPE_STATE_EPSILON = 0.000000001

/** Проверяет состояния шейпа, которые пока остаются на прежнем пути скейлинга. */
function hasUnsupportedActiveSelectionShapeState({
  group
}: {
  group: ShapeGroup
}): boolean {
  const blockedState = [
    group.flipX,
    group.flipY,
    group.locked,
    group.lockScalingX,
    group.lockScalingY
  ].some(Boolean)
  if (blockedState) return true

  const values = [
    group.width,
    group.height,
    group.scaleX,
    group.scaleY,
    group.angle ?? 0,
    group.skewX ?? 0,
    group.skewY ?? 0
  ]

  return !values.every(Number.isFinite)
    || group.width <= 0
    || group.height <= 0
    || group.scaleX <= 0
    || group.scaleY <= 0
    || Math.abs(group.scaleX - 1) > ACTIVE_SELECTION_SHAPE_STATE_EPSILON
    || Math.abs(group.scaleY - 1) > ACTIVE_SELECTION_SHAPE_STATE_EPSILON
    || Math.abs(group.angle ?? 0) > ACTIVE_SELECTION_SHAPE_STATE_EPSILON
    || Math.abs(group.skewX ?? 0) > ACTIVE_SELECTION_SHAPE_STATE_EPSILON
    || Math.abs(group.skewY ?? 0) > ACTIVE_SELECTION_SHAPE_STATE_EPSILON
}

/** Возвращает все поддерживаемые шейпы из прямых детей общего выделения. */
function resolveSupportedActiveSelectionShapeChildren({
  selection
}: {
  selection: ActiveSelection
}): ShapeGroup[] | null {
  const groups: ShapeGroup[] = []

  for (const object of selection.getObjects()) {
    if (!isShapeGroup(object)) continue
    if (object.parent) return null
    if (hasUnsupportedActiveSelectionShapeState({ group: object })) return null

    const { shape, text } = getShapeNodes({ group: object })
    if (!shape || !text) return null

    groups.push(object)
  }

  return groups.length > 0 ? groups : null
}

/** Возвращает шейпы только для полностью поддерживаемого однородного состава. */
function resolveSupportedActiveSelectionShapes({
  selection
}: {
  selection: ActiveSelection
}): ShapeGroup[] | null {
  const groups = resolveSupportedActiveSelectionShapeChildren({ selection })
  const objects = selection.getObjects()

  return groups && groups.length >= 2 && groups.length === objects.length
    ? groups
    : null
}

/** Проверяет результат компоновки перед возвратом общему владельцу жеста. */
function isPositiveFiniteScale({
  scaleX,
  scaleY
}: ActiveSelectionAppliedScale): boolean {
  return Number.isFinite(scaleX)
    && Number.isFinite(scaleY)
    && scaleX > 0
    && scaleY > 0
}

/**
 * Менеджер фигур и композитных объектов "фигура + текст".
 */
export default class ShapeManager {
  /**
   * Ссылка на редактор.
   */
  public editor: ImageEditor

  /**
   * Контроллер масштабирования shape-групп.
   */
  private scalingController: ShapeScalingController

  /**
   * Контроллер редактирования текста в shape-группах.
   */
  private editingController: ShapeEditingController

  /**
   * Placement shape-групп на время редактирования текста.
   */
  private editingPlacements: WeakMap<ShapeGroup, ObjectPlacement>

  /**
   * Контроллер lifecycle-событий shape-композиций.
   */
  private lifecycleController: ShapeLifecycleController

  /**
   * Контроллер layout- и размерной логики shape-композиций.
   */
  private layoutController: ShapeLayoutController

  /**
   * Контроллер публичных мутаций shape-композиций.
   */
  private mutationController: ShapeMutationController

  /**
   * Контроллер canvas-событий и editing/scaling lifecycle для shape-композиций.
   */
  private eventController: ShapeEventController

  /**
   * Адаптер TextManager для текстовых узлов внутри shape-групп.
   */
  private textNodeController: ShapeTextNodeController

  /**
   * Factory полностью materialized off-canvas shape-групп для add().
   */
  private groupFactory: ShapeGroupFactory

  /**
   * Инициализирует manager и связывает фасад с lifecycle/layout/mutation контроллерами.
   */
  constructor({ editor }: { editor: ImageEditor }) {
    this.editor = editor
    registerShapeGroup()
    this.scalingController = new ShapeScalingController({
      canvas: editor.canvas
    })
    this.editingController = new ShapeEditingController({
      canvas: editor.canvas
    })
    this.editingPlacements = new WeakMap()
    this.lifecycleController = new ShapeLifecycleController({
      canvas: editor.canvas
    })
    this.layoutController = new ShapeLayoutController({
      editor: this.editor
    })
    this.textNodeController = new ShapeTextNodeController({
      resolveTextManager: () => this.editor.textManager
    })
    this.groupFactory = new ShapeGroupFactory({
      layoutController: this.layoutController,
      textNodeController: this.textNodeController
    })
    this.mutationController = new ShapeMutationController({
      dependencies: {
        canvas: this.editor.canvas,
        canvasManager: this.editor.canvasManager,
        historyManager: this.editor.historyManager,
        lifecycleController: this.lifecycleController,
        layoutController: this.layoutController,
        textNodeController: this.textNodeController,
        editingPlacements: this.editingPlacements
      }
    })
    this.eventController = new ShapeEventController({
      dependencies: {
        editor: this.editor,
        scalingController: this.scalingController,
        editingController: this.editingController,
        lifecycleController: this.lifecycleController,
        layoutController: this.layoutController,
        textNodeController: this.textNodeController,
        editingPlacements: this.editingPlacements
      }
    })

    this.eventController.bind()
  }

  /**
   * Добавляет shape-композицию (фигура + текст) по presetKey.
   * По умолчанию width/height трактуются как точный итоговый размер фигуры
   * и могут растянуть preset относительно его исходных пропорций.
   * `preserveAspectRatio=true` переключает add-path в режим fit по пропорциям preset:
   * одна переданная ось остаётся точной, а вторая вычисляется из aspect ratio;
   * если переданы обе оси, фигура вписывается в этот box с сохранением пропорций.
   * Если при этом включен shapeTextAutoExpand и тексту нужно больше места,
   * финальный размер может вырасти относительно переданного box.
   * При shapeTextAutoExpand=true ручная базовая ширина остается нижней границей,
   * но текущий размер может стать больше неё, если этого требует текст.
   * Если `left/top` не переданы, объект визуально центрируется в монтажной области.
   * Если координаты переданы, placement трактуется через `left/top + originX/originY`.
   * @fires editor:shape-added
   */
  public async add({
    presetKey = DEFAULT_SHAPE_PRESET_KEY,
    options = {}
  }: {
    presetKey?: string
    options?: ShapeAddOptions
  } = {}): Promise<ShapeGroup | null> {
    const basePreset = getShapePreset({ presetKey })
    if (!basePreset) return null

    const {
      left,
      top,
      originX,
      originY,
      withoutAdding,
      withoutSelection,
      withoutSave
    } = options

    const group = await this.groupFactory.createForAdd({
      basePreset,
      options
    })
    const addedPayload: ShapeAddedPayload = {
      shape: group,
      presetKey: group.shapePresetKey ?? basePreset.key,
      options
    }

    if (left === undefined && top === undefined) {
      this.editor.canvasManager.centerObjectToMontageArea({ object: group })
    } else {
      const placement = this.editor.canvasManager.resolveObjectPlacement({
        object: group,
        left,
        top,
        originX,
        originY,
        fallbackPoint: this.editor.canvasManager.getMontageAreaSceneCenter()
      })

      this.editor.canvasManager.applyObjectPlacement({
        object: group,
        placement
      })
    }

    if (withoutAdding) {
      this.editor.canvas.fire('editor:shape-added', addedPayload)
      return group
    }

    this._beginMutation()

    try {
      this.editor.canvas.add(group)

      if (!withoutSelection) {
        this.editor.canvas.setActiveObject(group)
      }

      this.editor.canvas.requestRenderAll()
    } finally {
      this._endMutation({ withoutSave })
    }

    this.editor.canvas.fire('editor:shape-added', addedPayload)

    return group
  }

  /**
   * Обновляет пресет фигуры у существующей shape-группы с сохранением текста и трансформаций.
   * При shapeTextAutoExpand=true явная width обновляет ручную базовую ширину,
   * а текущая ширина сразу пересчитывается по тексту относительно этой базы.
   * При replace с новым presetKey по умолчанию не сохраняет текущий aspect ratio группы:
   * новая фигура вписывается в текущий replacement box и дальше получает итоговый размер
   * через общий layout с пропорциями своего пресета. При выключенном
   * shapeTextAutoExpand текст может переноситься, но итоговый размер всё равно
   * сохраняет эти пропорции. Этот итоговый размер становится новой базой фигуры
   * для последующих text-layout перерасчётов.
   * `preserveCurrentAspectRatio=true` оставляет текущее поведение без такого пересчета.
   * Если переданы `left/top/originX/originY`, они становятся новым placement-контрактом группы.
   * Сохраняет тот же instance группы и при необходимости заменяет только внутренний shape-узел.
   * @fires editor:before:shape-updated
   * @fires editor:shape-updated
   */
  public async update({
    target,
    presetKey,
    options = {}
  }: {
    target?: ShapeReference
    presetKey?: string
    options?: ShapeUpdateOptions
  } = {}): Promise<ShapeGroup | null> {
    return this.mutationController.update({
      target,
      presetKey,
      options
    })
  }

  /**
   * Удаляет shape-группу, если target существует и не заблокирован.
   */
  public remove({
    target,
    withoutSave
  }: {
    target?: ShapeReference
    withoutSave?: boolean
  } = {}): boolean {
    return this.mutationController.remove({
      target,
      withoutSave
    })
  }

  /**
   * Обновляет заливку shape-узла у выбранной группы.
   */
  public setFill({
    target,
    fill,
    withoutSave
  }: {
    target?: ShapeReference
    fill: string
    withoutSave?: boolean
  }): ShapeGroup | null {
    return this.mutationController.setFill({
      target,
      fill,
      withoutSave
    })
  }

  /**
   * Обновляет stroke-параметры фигуры у выбранной группы.
   */
  public setStroke({
    target,
    stroke,
    strokeWidth,
    dash,
    withoutSave
  }: {
    target?: ShapeReference
  } & ShapeStrokeOptions): ShapeGroup | null {
    return this.mutationController.setStroke({
      target,
      stroke,
      strokeWidth,
      dash,
      withoutSave
    })
  }

  /**
   * Обновляет opacity фигуры и, при необходимости, вложенного текста.
   */
  public setOpacity({
    target,
    opacity,
    applyToText = true,
    withoutSave
  }: {
    target?: ShapeReference
    opacity: number
    applyToText?: boolean
    withoutSave?: boolean
  }): ShapeGroup | null {
    return this.mutationController.setOpacity({
      target,
      opacity,
      applyToText,
      withoutSave
    })
  }

  /**
   * Возвращает текстовый узел выбранной shape-группы.
   */
  public getTextNode({
    target
  }: {
    target?: ShapeReference
  } = {}): ShapeTextNode | null {
    const group = resolveShapeGroup({
      canvas: this.editor.canvas,
      target
    })
    if (!group) return null

    const { text } = getShapeNodes({ group })
    if (!text) return null

    return text
  }

  /**
   * Обновляет стиль текста внутри shape-группы без смены shape-параметров.
   */
  public updateTextStyle({
    target,
    style = {},
    withoutSave
  }: {
    target?: ShapeReference
    style?: ShapeTextStyleOptions
    withoutSave?: boolean
  } = {}): ShapeGroup | null {
    return this.mutationController.updateTextStyle({
      target,
      style,
      withoutSave
    })
  }

  /**
   * Обновляет горизонтальное и вертикальное выравнивание текста внутри фигуры.
   */
  public setTextAlign({
    target,
    horizontal,
    vertical,
    withoutSave
  }: {
    target?: ShapeReference
  } & ShapeTextAlignOptions): ShapeGroup | null {
    return this.mutationController.setTextAlign({
      target,
      horizontal,
      vertical,
      withoutSave
    })
  }

  /**
   * Нормализует rounding и делегирует изменение в общий update path.
   */
  public async setRounding({
    target,
    rounding,
    withoutSave
  }: {
    target?: ShapeReference
    rounding: number
    withoutSave?: boolean
  }): Promise<ShapeGroup | null> {
    return this.mutationController.setRounding({
      target,
      rounding,
      withoutSave
    })
  }

  /**
   * Материализует rehydrated shape-группу и пересчитывает auto-expand только для изменённых входов.
   */
  public commitRehydratedShapeLayout({
    target,
    textScale = 1,
    shapeTextAutoExpand
  }: {
    target?: ShapeReference
    textScale?: number
    shapeTextAutoExpand?: boolean
  }): boolean {
    return this.mutationController.commitRehydratedShapeLayout({
      target,
      textScale,
      shapeTextAutoExpand
    })
  }

  /**
   * Проверяет, что временное выделение целиком состоит из шейпов,
   * которые ShapeManager может безопасно пересчитать во время общего скейлинга.
   */
  public supportsActiveSelectionScaling({
    selection
  }: {
    selection: ActiveSelection
  }): boolean {
    return resolveSupportedActiveSelectionShapes({ selection }) !== null
  }

  /** Возвращает поддерживаемые шейпы смешанного выделения без принятия остальных типов объектов. */
  public resolveSupportedActiveSelectionShapeChildren({
    selection
  }: {
    selection: ActiveSelection
  }): readonly ShapeGroup[] | null {
    return resolveSupportedActiveSelectionShapeChildren({ selection })
  }

  /** Создаёт источник фактической геометрии шейпов для общей смешанной сессии. */
  public createActiveSelectionScaleDomainSource({
    selection,
    transform
  }: {
    selection: ActiveSelection
    transform: Transform
  }): ActiveSelectionScaleDomainSource | null {
    const targets = resolveSupportedActiveSelectionShapeChildren({ selection })
    if (!targets || transform.target !== selection) return null

    try {
      targets.forEach((group) => this.lifecycleController.beginResize({ group }))

      return this.scalingController.createActiveSelectionScaleDomainSource({
        selection,
        targets,
        transform
      })
    } catch (error) {
      this.clearActiveSelectionScalePreviewState({ children: targets, selection })
      throw error
    }
  }

  /**
   * Возвращает режим угловой ручки уже проверенного общего выделения с шейпами.
   * Повторная проверка дочерних объектов здесь запрещена: временная компоновка меняет их масштаб.
   */
  public resolveActiveSelectionScaleControlMode({
    selection,
    transform,
    event
  }: {
    selection: ActiveSelection
    transform: Transform
    event?: ShapeScalingPointerEvent | null
  }): ShapeCornerScaleMode | null {
    if (transform.target !== selection) return null
    if (!isShapeCornerScaleControl({ target: selection, transform })) return null

    return resolveShapeCornerScaleMode({
      shiftKey: Boolean(event && 'shiftKey' in event && event.shiftKey)
    })
  }

  /**
   * Один раз применяет ограничения и компоновку шейпов во время движения ручки
   * к уже рассчитанному масштабу временного выделения.
   */
  public applyActiveSelectionScalePreview({
    selection,
    transform,
    event
  }: {
    selection: ActiveSelection
    transform: Transform
    event?: ShapeScalingPointerEvent
  }): ActiveSelectionAppliedScale | null {
    const groups = resolveSupportedActiveSelectionShapes({ selection })
    if (!groups || transform.target !== selection) return null

    for (const group of groups) {
      this.lifecycleController.beginResize({ group })
    }

    this.scalingController.handleObjectScaling({
      target: selection,
      transform,
      e: event
    })

    const appliedScale = this.scalingController.resolveActiveSelectionCommittedScale({ selection })
    if (!isPositiveFiniteScale(appliedScale)) {
      throw new Error('ShapeManager должен применить положительный конечный масштаб общего выделения')
    }

    transform.scaleX = selection.scaleX
    transform.scaleY = selection.scaleY

    return appliedScale
  }

  /** Очищает оставшееся временное состояние скейлинга общего выделения. */
  public clearActiveSelectionScalePreviewState({
    selection,
    children
  }: {
    selection: ActiveSelection
    children: readonly FabricObject[]
  }): void {
    if (children.length < 1) {
      throw new Error('Для очистки общего скейлинга нужен хотя бы один дочерний шейп')
    }

    const groups: ShapeGroup[] = []

    for (const child of children) {
      if (!isShapeGroup(child)) {
        throw new Error('Доменную сессию шейпов можно очистить только для shape-групп')
      }

      groups.push(child)
    }

    this.scalingController.clearActiveSelectionState({ selection })

    for (const group of groups) {
      this.scalingController.clearState({ group })
      this.lifecycleController.cancelResize({ group })
    }
  }

  /**
   * Переносит масштаб шейпов в канонические размеры без завершения общей транзакции.
   */
  public prepareActiveSelectionScaleCommit({
    children,
    selection,
    transform
  }: {
    children: readonly FabricObject[]
    selection: ActiveSelection
    transform?: Transform | null
  }): ActiveSelectionShapeScaleCommit {
    const groups = children.map((child) => {
      if (!isShapeGroup(child)) throw new Error('Фиксация смешанного состава принимает только шейпы')

      return child
    })
    if (groups.length === 0) throw new Error('Фиксация смешанного состава требует хотя бы один шейп')

    const beforeSnapshots = groups.map((group) => captureShapeScalingGeometry({ group }))
    const { scaleX, scaleY } = this.scalingController.resolveActiveSelectionCommittedScale({ selection })

    try {
      this._materializeActiveSelectionShapeGroups({ groups, scaleX, scaleY, transform })

      return Object.freeze({
        groups: Object.freeze([...groups]),
        selection
      })
    } catch (error) {
      try {
        restoreShapeScalingSnapshots({ snapshots: beforeSnapshots })
      } catch {
        // Ошибка фиксации остаётся основной после попытки восстановить каждый шейп.
      }

      throw error
    }
  }

  /** Очищает временное состояние и публикует подготовленные изменения шейпов. */
  public finishActiveSelectionScaleCommit({
    commit
  }: {
    commit: ActiveSelectionShapeScaleCommit
  }): void {
    const failures: unknown[] = []

    try {
      this.scalingController.clearActiveSelectionState({ selection: commit.selection })
    } catch (error) {
      failures.push(error)
    }

    for (const group of commit.groups) {
      try {
        this.scalingController.clearState({ group })
      } catch (error) {
        failures.push(error)
      }
      try {
        this.lifecycleController.finishResize({ group })
      } catch (error) {
        failures.push(error)
      }
    }

    const [firstFailure] = failures
    if (failures.length > 0) throw firstFailure
  }

  /** Фиксирует каноническую геометрию всех шейпов, сохраняя состояние общей сессии. */
  private _materializeActiveSelectionShapeGroups({
    groups,
    scaleX,
    scaleY,
    transform
  }: {
    groups: readonly ShapeGroup[]
    scaleX: number
    scaleY: number
    transform?: Transform | null
  }): void {
    for (const group of groups) {
      const placement = this.editor.canvasManager.getObjectPlacement({ object: group })
      const committed = this.scalingController.materializeActiveSelectionGroupScaling({
        group,
        scaleX,
        scaleY,
        transform
      })
      if (!committed) throw new Error('Каждый измеренный шейп должен зафиксировать рассчитанные размеры')

      this.editor.canvasManager.applyObjectPlacement({ object: group, placement })
      group.setCoords()
    }
  }

  /**
   * Снимает подписки ShapeManager на canvas-события.
   */
  public destroy(): void {
    this.eventController.destroy()
  }

  /**
   * Начинает мутацию canvas с временным отключением history.
   */
  private _beginMutation(): void {
    this.editor.historyManager.suspendHistory()
  }

  /**
   * Завершает мутацию canvas и при необходимости сохраняет state.
   */
  private _endMutation({ withoutSave }: { withoutSave?: boolean }): void {
    this.editor.historyManager.resumeHistory()

    if (!withoutSave) {
      this.editor.historyManager.saveState()
    }
  }
}
