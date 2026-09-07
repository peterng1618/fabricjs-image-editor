import {
  ActiveSelection,
  Canvas,
  Transform
} from 'fabric'
import type {
  RectangularScaleGestureMode,
  RectangularScaleMultipliers
} from '../../snapping-manager/scaling/rectangular-scale-gesture-projection'
import type {
  ActiveSelectionScaleDomainChildMeasurement,
  ActiveSelectionScaleDomainMeasurement,
  ActiveSelectionScaleFrame
} from '../../selection-manager/scaling/active-selection-scale-domain-source'
import {
  resolveMinimumShapeWidthForText
} from '../layout/shape-layout'
import {
  SHAPE_DEFAULT_HORIZONTAL_ALIGN
} from '../domain/shape-presets'
import {
  getShapeNodes
} from '../domain/shape-nodes'
import {
  isShapeGroup
} from '../domain/shape-reference'
import type {
  ShapeGroup,
  ShapeNode,
  ShapePadding,
  ShapeScalingState,
  ShapeTextNode,
  ShapeTransformOriginX,
  ShapeTransformOriginY
} from '../types'
import { applyShapeScalingPreviewLayout } from './shape-scaling-preview'
import {
  applyActiveSelectionScale,
  applyRotatedActiveSelectionShapeGeometry,
  captureRotatedActiveSelectionShapeGeometry,
  mergeActiveSelectionLocalBounds,
  positionActiveSelectionShape,
  resolveActiveSelectionObjectLocalBounds,
  resolveActiveSelectionOriginOffset,
  resolveActiveSelectionVerticalAttachment,
  type ActiveSelectionLocalBounds,
  type ActiveSelectionVerticalAttachment,
  type RotatedActiveSelectionShapeGeometry
} from './active-selection-geometry'
import {
  resolveScaleLocalPointerForTransform,
  resolveShapeScaleActionAxes,
  resolveShapeTransformOriginXValue,
  resolveShapeTransformOriginYValue
} from './shape-scaling-transform'
import {
  ensureShapeScalingState,
  resolveMinimumProportionalShapeScale,
  resolveMinimumTextFitHeight,
  resolveShapeScalingConstraintPadding,
  resolveShapeScalingPreviewDimensions,
  resolveShapeScalingPreviewLayout,
  resolveShapeScalingTextWrapPolicy,
  SHAPE_SCALING_MIN_SIZE as MIN_SIZE,
  SHAPE_SCALING_SCALE_EPSILON as SCALE_EPSILON
} from './shape-scaling-layout'
import type { ShapeScalingPointerEvent } from './shape-scaling-layout'
import {
  commitActiveSelectionShapeGroupScaling,
  type ActiveSelectionShapeLayoutScale
} from './active-selection-scale-commit'
import {
  applyActiveSelectionShapeDomainChild,
  createActiveSelectionShapeDomainChildMeasurement
} from './active-selection-scale-domain-geometry'
import {
  resolveActiveSelectionShapeScaleConstraint,
  resolveMinimumSelectionScaleForSize,
  resolveProportionalSelectionScale,
  resolveSelectionAvailableHeight,
  resolveSelectionAvailableWidth
} from './active-selection-scale-constraints'

/**
 * Shape-группа и её узлы, участвующие в текущем scaling active selection.
 */
type ActiveSelectionShapeScalingItem = {
  group: ShapeGroup
  shape: ShapeNode
  text: ShapeTextNode
  constraintPadding: ShapePadding
  state: ShapeScalingState
}

/**
 * Minimum layout-ограничение одной shape-группы при пропорциональном scaling.
 */
type ActiveSelectionProportionalLayoutResult = {
  minimumScale: number
  minimumHeight: number
}

/**
 * Minimum layout-ограничения shape-групп внутри active selection.
 */
type ActiveSelectionProportionalLayoutResults = Map<
  ShapeGroup,
  ActiveSelectionProportionalLayoutResult
>

/**
 * Фактически применённый scale для active selection после перерасчёта shape layout.
 */
export type ActiveSelectionAppliedScale = {
  scaleX: number
  scaleY: number
}

/** Scale и способ фиксации, выбранные для завершения текущей сессии общего выделения. */
export type ActiveSelectionCommittedScale = {
  preserveSceneGeometryOnCommit: boolean
  scaleX: number
  scaleY: number
}

/**
 * Снимок одной shape-группы внутри scaling session active selection.
 */
type ActiveSelectionShapeScalingSessionItem = {
  bounds: ActiveSelectionLocalBounds
  rotatedGeometry: RotatedActiveSelectionShapeGeometry | null
  transformOriginX: ShapeTransformOriginX
  transformOriginPointX: number
  verticalAttachment: ActiveSelectionVerticalAttachment
}

/** Размеры и масштаб компоновки одного шейпа на текущем кадре. */
type ActiveSelectionShapePreviewDimensions = {
  layoutScale: ActiveSelectionShapeLayoutScale
  minimumHeight: number
}

/**
 * Состояние scaling session для active selection.
 */
type ActiveSelectionScalingSession = {
  bounds: ActiveSelectionLocalBounds
  fixedAnchor: Readonly<{ x: number; y: number }>
  items: Map<ShapeGroup, ActiveSelectionShapeScalingSessionItem>
}

/** Данные одного кадра скейлинга общего выделения после применения ограничений. */
type ActiveSelectionScalingPreview = {
  isProportionalCornerScale: boolean
  items: ActiveSelectionShapeScalingItem[]
  proportionalLayoutResults: ActiveSelectionProportionalLayoutResults | null
  selectionScale: ActiveSelectionAppliedScale
  session: ActiveSelectionScalingSession
}

/** Рассчитанная компоновка одного шейпа до изменения живого объекта. */
type ActiveSelectionShapeDomainChildPlan = Readonly<{
  isProportionalScaling: boolean
  item: ActiveSelectionShapeScalingItem
  layout: ReturnType<typeof resolveShapeScalingPreviewLayout>
  layoutScale: ActiveSelectionShapeLayoutScale
}>

/** Внутренний план, соответствующий опубликованному доменному измерению. */
type ActiveSelectionShapeDomainPlan = Readonly<{
  children: readonly ActiveSelectionShapeDomainChildPlan[]
  preview: ActiveSelectionScalingPreview
}>

/** Объединяет локальные границы всех детей исходного общего выделения. */
function resolveSelectionLocalBounds({
  selection
}: {
  selection: ActiveSelection
}): ActiveSelectionLocalBounds {
  const [first, ...rest] = selection.getObjects()
  if (!first) throw new Error('Сессия скейлинга шейпов требует непустое общее выделение')

  let bounds = resolveActiveSelectionObjectLocalBounds({ target: first })
  for (const object of rest) {
    bounds = mergeActiveSelectionLocalBounds({
      current: bounds,
      next: resolveActiveSelectionObjectLocalBounds({ target: object })
    })
  }

  return bounds
}

/** Создаёт неизменяемые привязки шейпов к исходной рамке общего выделения. */
function createSelectionSessionItems({
  items,
  selection,
  selectionBounds,
  transformOriginX,
  transformOriginY
}: {
  items: readonly ActiveSelectionShapeScalingItem[]
  selection: ActiveSelection
  selectionBounds: ActiveSelectionLocalBounds
  transformOriginX: ShapeTransformOriginX
  transformOriginY: ShapeTransformOriginY
}): Map<ShapeGroup, ActiveSelectionShapeScalingSessionItem> {
  const sessionItems = new Map<ShapeGroup, ActiveSelectionShapeScalingSessionItem>()

  for (const { group } of items) {
    const bounds = resolveActiveSelectionObjectLocalBounds({ target: group })
    const transformOriginPoint = group.getPositionByOrigin(transformOriginX, transformOriginY)

    sessionItems.set(group, {
      bounds,
      rotatedGeometry: captureRotatedActiveSelectionShapeGeometry({ group, selection }),
      transformOriginX,
      transformOriginPointX: transformOriginPoint.x,
      verticalAttachment: resolveActiveSelectionVerticalAttachment({
        selectionBounds,
        shapeBounds: bounds
      })
    })
  }

  return sessionItems
}

/** Возвращает неподвижную точку исходной рамки для выбранной точки преобразования. */
function resolveSelectionFixedAnchor({
  bounds,
  transformOriginX,
  transformOriginY
}: {
  bounds: ActiveSelectionLocalBounds
  transformOriginX: ShapeTransformOriginX
  transformOriginY: ShapeTransformOriginY
}): Readonly<{ x: number; y: number }> {
  return Object.freeze({
    x: ((bounds.left + bounds.right) / 2)
      + (resolveActiveSelectionOriginOffset({ origin: transformOriginX }) * (bounds.right - bounds.left)),
    y: ((bounds.top + bounds.bottom) / 2)
      + (resolveActiveSelectionOriginOffset({ origin: transformOriginY }) * (bounds.bottom - bounds.top))
  })
}

/**
 * Контроллер масштабирования shape-групп внутри ActiveSelection.
 */
export default class ShapeActiveSelectionScalingController {
  /**
   * Fabric canvas редактора.
   */
  private canvas: Canvas

  /**
   * Внешнее live scaling state shape-групп.
   */
  private shapeScalingState: WeakMap<ShapeGroup, ShapeScalingState>

  /**
   * Применённый scale для active selection после layout clamp.
   */
  private scalingState: WeakMap<ActiveSelection, ActiveSelectionAppliedScale>

  /**
   * Снимки bounds и origin для текущего scaling active selection.
   */
  private scalingSessions: WeakMap<ActiveSelection, ActiveSelectionScalingSession>

  /**
   * Layout scale каждой shape-группы после перерасчёта active selection.
   */
  private groupLayoutScales: WeakMap<ShapeGroup, ActiveSelectionShapeLayoutScale>

  /** Планы доменной компоновки, ожидающие единственного применения к живым объектам. */
  private domainPlans: WeakMap<ActiveSelectionScaleDomainMeasurement, ActiveSelectionShapeDomainPlan>

  /**
   * Инициализирует controller скейлинга shape-групп внутри active selection.
   */
  constructor({
    canvas,
    shapeScalingState
  }: {
    canvas: Canvas
    shapeScalingState: WeakMap<ShapeGroup, ShapeScalingState>
  }) {
    this.canvas = canvas
    this.shapeScalingState = shapeScalingState
    this.scalingState = new WeakMap()
    this.scalingSessions = new WeakMap()
    this.groupLayoutScales = new WeakMap()
    this.domainPlans = new WeakMap()
  }

  /**
   * Применяет live-preview по правилам шейпов внутри ActiveSelection.
   */
  public handleScalingPreview({
    selection,
    transform,
    event
  }: {
    selection: ActiveSelection
    transform?: Transform | null
    event?: ShapeScalingPointerEvent
  }): void {
    if (!transform) return

    const {
      canScaleWidth,
      canScaleHeight
    } = resolveShapeScaleActionAxes({
      transform
    })
    if (!canScaleWidth && !canScaleHeight) return

    const items = this._collectPreviewItems({
      selection,
      transform
    })

    if (!items.length) return

    const preview = this._resolveScalingPreview({
      event,
      items,
      selection,
      transform
    })

    applyActiveSelectionScale({
      selection,
      transform,
      scaleX: preview.selectionScale.scaleX,
      scaleY: preview.selectionScale.scaleY
    })
    this.scalingState.set(selection, preview.selectionScale)

    for (const item of preview.items) {
      this._applyShapeScalingPreviewItem({
        item,
        preview,
        selection
      })
    }

    selection.setCoords()
    this.canvas.requestRenderAll()
  }

  /** Фиксирует исходное состояние шейпов смешанного выделения до первой мутации Fabric. */
  public beginDomainScaling({
    selection,
    transform
  }: {
    selection: ActiveSelection
    transform: Transform
  }): boolean {
    const items = this._collectPreviewItems({ selection, transform })
    if (items.length === 0) return false

    this._ensureScalingSession({ items, selection, transform })

    return true
  }

  /** Рассчитывает фактическую геометрию шейпов без изменения живых объектов и общей рамки. */
  public measureDomainScale({
    mode,
    multipliers,
    selection,
    transform
  }: {
    mode: RectangularScaleGestureMode
    multipliers: RectangularScaleMultipliers
    selection: ActiveSelection
    transform: Transform
  }): ActiveSelectionScaleDomainMeasurement {
    const items = this._collectPreviewItems({ selection, transform })
    if (items.length === 0) throw new Error('Доменное измерение требует хотя бы один шейп')

    const preview = this._resolveScalingPreview({ items, mode, multipliers, selection, transform })
    const children = Object.freeze(items.map((item) => {
      return this._resolveDomainChildPlan({ item, preview })
    }))
    const measurement = Object.freeze({
      children: Object.freeze(children.map((child) => {
        return this._createDomainChildMeasurement({ child, preview })
      })),
      multipliers: Object.freeze({
        x: preview.selectionScale.scaleX,
        y: preview.selectionScale.scaleY
      })
    })

    this.domainPlans.set(measurement, Object.freeze({ children, preview }))

    return measurement
  }

  /** Применяет один рассчитанный план шейпов с компенсацией фактической общей рамки. */
  public applyDomainScale({
    children,
    frame,
    measurement,
    selection
  }: {
    children: readonly ActiveSelectionScaleDomainChildMeasurement[]
    frame: ActiveSelectionScaleFrame
    measurement: ActiveSelectionScaleDomainMeasurement
    selection: ActiveSelection
  }): void {
    const plan = this._getDomainPlan({ measurement, selection })
    if (children.length !== plan.children.length) {
      throw new Error('Применение должно содержать все измеренные шейпы')
    }

    const applications = plan.children.map((childPlan, index) => {
      const child = children[index]
      if (!child || child.target !== childPlan.item.group) {
        throw new Error('Порядок применяемых шейпов должен совпадать с измерением')
      }

      return { child, childPlan }
    })

    applications.forEach(({ child, childPlan }) => {
      this._applyDomainChildPlan({ child, childPlan, frame, measurement })
    })
  }

  /** Восстанавливает внутренние масштабы фиксации для уже подтверждённого измерения. */
  public confirmDomainScale({
    measurement,
    selection
  }: {
    measurement: ActiveSelectionScaleDomainMeasurement
    selection: ActiveSelection
  }): void {
    const plan = this._getDomainPlan({ measurement, selection })

    this._confirmDomainPlan({ measurement, plan, selection })
  }

  /** Рассчитывает общий масштаб и ограничения одного кадра скейлинга. */
  private _resolveScalingPreview({
    event,
    items,
    mode,
    multipliers,
    selection,
    transform
  }: {
    event?: ShapeScalingPointerEvent
    items: ActiveSelectionShapeScalingItem[]
    mode?: RectangularScaleGestureMode
    multipliers?: RectangularScaleMultipliers
    selection: ActiveSelection
    transform: Transform
  }): ActiveSelectionScalingPreview {
    const session = this._ensureScalingSession({ selection, transform, items })
    const { isCornerScaleAction } = resolveShapeScaleActionAxes({ transform })
    const isShiftPressed = Boolean(event && 'shiftKey' in event && event.shiftKey)
    const isProportionalCornerScale = mode
      ? mode === 'uniform'
      : isCornerScaleAction && !isShiftPressed
    const scaleX = multipliers?.x ?? (Math.abs(selection.scaleX ?? 1) || 1)
    const scaleY = multipliers?.y ?? (Math.abs(selection.scaleY ?? 1) || 1)
    const needsProportionalLayout = isProportionalCornerScale
      && (scaleX < 1 - SCALE_EPSILON || scaleY < 1 - SCALE_EPSILON)
    const proportionalLayoutResults = needsProportionalLayout
      ? this._resolveProportionalLayoutResults({ items })
      : null
    const requestedScale = this._resolveSelectionScale({
      items,
      isProportionalCornerScale,
      proportionalLayoutResults,
      scaleX,
      scaleY,
      session,
      transform
    })
    const selectionScale = this._resolveSelectionScaleAtPointerBoundary({
      event,
      isProportionalCornerScale,
      items,
      selection,
      selectionScale: requestedScale,
      session,
      transform
    })

    return {
      isProportionalCornerScale,
      items,
      proportionalLayoutResults,
      selectionScale,
      session
    }
  }

  /** Применяет рассчитанную компоновку к одному шейпу общего выделения. */
  private _applyShapeScalingPreviewItem({
    item,
    preview,
    selection
  }: {
    item: ActiveSelectionShapeScalingItem
    preview: ActiveSelectionScalingPreview
    selection: ActiveSelection
  }): void {
    const { group, shape, state, text } = item
    const sessionItem = preview.session.items.get(group)
    if (!sessionItem) throw new Error('Для шейпа должно существовать состояние текущей сессии скейлинга')

    state.isProportionalScaling = preview.isProportionalCornerScale
    const { layoutScale, minimumHeight } = this._resolveShapePreviewDimensions({
      item,
      preview
    })
    const previewLayout = resolveShapeScalingPreviewLayout({
      appliedScaleX: layoutScale.scaleX,
      appliedScaleY: layoutScale.scaleY,
      group,
      minimumHeight,
      state,
      text
    })

    applyShapeScalingPreviewLayout({
      alignH: group.shapeAlignHorizontal ?? SHAPE_DEFAULT_HORIZONTAL_ALIGN,
      group,
      layout: previewLayout,
      minSize: MIN_SIZE,
      scaleEpsilon: SCALE_EPSILON,
      scaleX: sessionItem.rotatedGeometry ? 1 : preview.selectionScale.scaleX,
      scaleY: sessionItem.rotatedGeometry ? 1 : preview.selectionScale.scaleY,
      shape,
      text
    })

    this.groupLayoutScales.set(group, layoutScale)
    this._positionShapeInSelection({ group, selection, sessionItem })
    group.setCoords()
  }

  /** Рассчитывает размеры компоновки одного шейпа на текущем кадре. */
  private _resolveShapePreviewDimensions({
    item,
    preview
  }: {
    item: ActiveSelectionShapeScalingItem
    preview: ActiveSelectionScalingPreview
  }): ActiveSelectionShapePreviewDimensions {
    const { constraintPadding, group, state, text } = item
    const proportionalLayout = preview.proportionalLayoutResults?.get(group)

    if (proportionalLayout) {
      const proportionalScale = Math.max(
        preview.selectionScale.scaleX,
        proportionalLayout.minimumScale
      )

      return {
        layoutScale: {
          scaleX: state.canScaleWidth ? proportionalScale : 1,
          scaleY: state.canScaleHeight ? proportionalScale : 1
        },
        minimumHeight: proportionalLayout.minimumHeight
      }
    }

    const layoutScale = this._resolveShapeLayoutScale({
      item,
      selectionScale: preview.selectionScale
    })
    const dimensions = resolveShapeScalingPreviewDimensions({
      appliedScaleX: layoutScale.scaleX,
      appliedScaleY: layoutScale.scaleY,
      constraintPadding,
      group,
      measurementCache: state.previewTextMeasurementCache,
      startDimensions: state,
      text,
      wrapPolicy: resolveShapeScalingTextWrapPolicy({
        isProportionalScaling: state.isProportionalScaling,
        startTextSplitByGrapheme: state.startTextSplitByGrapheme
      })
    })

    return {
      layoutScale,
      minimumHeight: dimensions.previewHeight
    }
  }

  /** Рассчитывает внутреннюю компоновку одного шейпа для доменного измерения. */
  private _resolveDomainChildPlan({
    item,
    preview
  }: {
    item: ActiveSelectionShapeScalingItem
    preview: ActiveSelectionScalingPreview
  }): ActiveSelectionShapeDomainChildPlan {
    const measurementItem = {
      ...item,
      state: {
        ...item.state,
        isProportionalScaling: preview.isProportionalCornerScale
      }
    }
    const { layoutScale, minimumHeight } = this._resolveShapePreviewDimensions({
      item: measurementItem,
      preview
    })
    const layout = resolveShapeScalingPreviewLayout({
      appliedScaleX: layoutScale.scaleX,
      appliedScaleY: layoutScale.scaleY,
      group: measurementItem.group,
      minimumHeight,
      state: measurementItem.state,
      text: measurementItem.text
    })

    return Object.freeze({
      isProportionalScaling: preview.isProportionalCornerScale,
      item,
      layout,
      layoutScale
    })
  }

  /** Переводит план шейпа в фактические границы неизменяемой локальной плоскости. */
  private _createDomainChildMeasurement({
    child,
    preview
  }: {
    child: ActiveSelectionShapeDomainChildPlan
    preview: ActiveSelectionScalingPreview
  }): ActiveSelectionScaleDomainChildMeasurement {
    const sessionItem = preview.session.items.get(child.item.group)
    if (!sessionItem || sessionItem.rotatedGeometry) {
      throw new Error('Смешанное измерение поддерживает только прямой канонический шейп')
    }

    return createActiveSelectionShapeDomainChildMeasurement({
      ...sessionItem,
      fixedAnchor: preview.session.fixedAnchor,
      layout: child.layout,
      multipliers: {
        x: preview.selectionScale.scaleX,
        y: preview.selectionScale.scaleY
      },
      target: child.item.group
    })
  }

  /** Применяет измеренную компоновку одного шейпа к общей производной рамке. */
  private _applyDomainChildPlan({
    child,
    childPlan,
    frame,
    measurement
  }: {
    child: ActiveSelectionScaleDomainChildMeasurement
    childPlan: ActiveSelectionShapeDomainChildPlan
    frame: ActiveSelectionScaleFrame
    measurement: ActiveSelectionScaleDomainMeasurement
  }): void {
    const { group, shape, text } = childPlan.item
    applyActiveSelectionShapeDomainChild({
      child,
      frame,
      group,
      layout: childPlan.layout,
      measurement,
      shape,
      text
    })
  }

  /** Возвращает план, принадлежащий текущей доменной сессии общего выделения. */
  private _getDomainPlan({
    measurement,
    selection
  }: {
    measurement: ActiveSelectionScaleDomainMeasurement
    selection: ActiveSelection
  }): ActiveSelectionShapeDomainPlan {
    const plan = this.domainPlans.get(measurement)
    if (!plan || plan.preview.session !== this.scalingSessions.get(selection)) {
      throw new Error('Применению шейпов должно предшествовать измерение той же сессии')
    }

    return plan
  }

  /** Сохраняет внутреннее состояние только после полного применения доменного плана. */
  private _confirmDomainPlan({
    measurement,
    plan,
    selection
  }: {
    measurement: ActiveSelectionScaleDomainMeasurement
    plan: ActiveSelectionShapeDomainPlan
    selection: ActiveSelection
  }): void {
    for (const childPlan of plan.children) {
      childPlan.item.state.isProportionalScaling = childPlan.isProportionalScaling
      this.groupLayoutScales.set(childPlan.item.group, childPlan.layoutScale)
    }

    this.scalingState.set(selection, {
      scaleX: measurement.multipliers.x,
      scaleY: measurement.multipliers.y
    })
  }

  /**
   * Фиксирует resize дочерней shape-группы после масштабирования ActiveSelection.
   */
  public commitGroupScaling({
    group,
    scaleX,
    scaleY,
    transform
  }: {
    group: ShapeGroup
    scaleX: number
    scaleY: number
    transform?: Transform | null
  }): boolean {
    const didCommit = this.materializeGroupScaling({
      group,
      scaleX,
      scaleY,
      transform
    })

    this._clearGroupScalingState({ group })

    return didCommit
  }

  /** Переносит временный масштаб шейпа в размеры, сохраняя состояние общей транзакции. */
  public materializeGroupScaling({
    group,
    scaleX,
    scaleY,
    transform
  }: {
    group: ShapeGroup
    scaleX: number
    scaleY: number
    transform?: Transform | null
  }): boolean {
    return commitActiveSelectionShapeGroupScaling({
      group,
      layoutScale: this.groupLayoutScales.get(group),
      scaleX,
      scaleY,
      state: this.shapeScalingState.get(group),
      transform
    })
  }

  /** Очищает временное состояние одного шейпа после фиксации или отмены. */
  private _clearGroupScalingState({ group }: { group: ShapeGroup }): void {
    this.shapeScalingState.delete(group)
    this.groupLayoutScales.delete(group)
    group.shapeScalingNoopTransform = false
  }

  /** Возвращает применённый масштаб и способ сохранения геометрии после завершения жеста. */
  public resolveCommittedScale({
    selection
  }: {
    selection: ActiveSelection
  }): ActiveSelectionCommittedScale {
    const appliedScale = this.scalingState.get(selection)
    const session = this.scalingSessions.get(selection)
    const preserveSceneGeometryOnCommit = Boolean(session && Array.from(session.items.values()).some((item) => {
      return Boolean(item.rotatedGeometry)
    }))

    if (appliedScale) {
      return {
        preserveSceneGeometryOnCommit,
        scaleX: appliedScale.scaleX,
        scaleY: appliedScale.scaleY
      }
    }

    return {
      preserveSceneGeometryOnCommit,
      scaleX: Math.abs(selection.scaleX ?? 1) || 1,
      scaleY: Math.abs(selection.scaleY ?? 1) || 1
    }
  }

  /**
   * Очищает состояние масштабирования для переданного ActiveSelection.
   */
  public clearState({ selection }: { selection: ActiveSelection }): void {
    const session = this.scalingSessions.get(selection)
    if (session) {
      for (const group of session.items.keys()) {
        this.groupLayoutScales.delete(group)
      }
    }

    this.scalingSessions.delete(selection)
    this.scalingState.delete(selection)
  }

  /**
   * Собирает shape-группы общего выделения вместе с их стартовым состоянием для текущего drag.
   */
  private _collectPreviewItems({
    selection,
    transform
  }: {
    selection: ActiveSelection
    transform: Transform
  }): ActiveSelectionShapeScalingItem[] {
    const items: ActiveSelectionShapeScalingItem[] = []

    for (const object of selection.getObjects()) {
      if (!isShapeGroup(object)) continue

      const {
        shape,
        text
      } = getShapeNodes({ group: object })

      if (!shape || !text) continue

      const constraintPadding = resolveShapeScalingConstraintPadding({
        group: object
      })
      const state = ensureShapeScalingState({
        scalingState: this.shapeScalingState,
        group: object,
        text,
        constraintPadding,
        transform
      })

      items.push({
        group: object,
        shape,
        text,
        constraintPadding,
        state
      })
    }

    return items
  }

  /**
   * Возвращает runtime-сессию текущего drag в локальной плоскости ActiveSelection.
   */
  private _ensureScalingSession({
    selection,
    transform,
    items
  }: {
    selection: ActiveSelection
    transform: Transform
    items: ActiveSelectionShapeScalingItem[]
  }): ActiveSelectionScalingSession {
    const existingSession = this.scalingSessions.get(selection)
    if (existingSession) return existingSession

    const transformOriginX = resolveShapeTransformOriginXValue({
      value: transform.originX
    }) ?? 'center'
    const transformOriginY = resolveShapeTransformOriginYValue({
      value: transform.originY
    }) ?? 'center'
    const selectionBounds = resolveSelectionLocalBounds({ selection })

    const session = {
      bounds: selectionBounds,
      fixedAnchor: resolveSelectionFixedAnchor({
        bounds: selectionBounds,
        transformOriginX,
        transformOriginY
      }),
      items: createSelectionSessionItems({
        items,
        selection,
        selectionBounds,
        transformOriginX,
        transformOriginY
      })
    }

    this.scalingSessions.set(selection, session)

    return session
  }

  /**
   * Возвращает scale общего выделения, ограниченный bounds каждой shape-группы внутри ActiveSelection.
   */
  private _resolveSelectionScale({
    items,
    isProportionalCornerScale,
    session,
    transform,
    proportionalLayoutResults,
    scaleX,
    scaleY
  }: {
    items: ActiveSelectionShapeScalingItem[]
    isProportionalCornerScale: boolean
    session: ActiveSelectionScalingSession
    transform: Transform
    proportionalLayoutResults: ActiveSelectionProportionalLayoutResults | null
    scaleX: number
    scaleY: number
  }): ActiveSelectionAppliedScale {
    const {
      canScaleWidth,
      canScaleHeight
    } = resolveShapeScaleActionAxes({
      transform
    })

    if (isProportionalCornerScale) {
      const proportionalScale = Math.max(scaleX, scaleY)

      if (!proportionalLayoutResults) {
        return {
          scaleX: proportionalScale,
          scaleY: proportionalScale
        }
      }

      const resolvedProportionalScale = this._resolveProportionalSelectionScale({
        items,
        session,
        proportionalLayoutResults,
        scale: proportionalScale,
        allowGrowthX: canScaleHeight,
        allowGrowthY: canScaleWidth
      })

      return {
        scaleX: resolvedProportionalScale,
        scaleY: resolvedProportionalScale
      }
    }

    return this._resolveFreeSelectionScale({
      canScaleHeight,
      canScaleWidth,
      items,
      scaleX,
      scaleY,
      session
    })
  }

  /** Последовательно применяет ограничения обеих осей свободного скейлинга. */
  private _resolveFreeSelectionScale({
    canScaleHeight,
    canScaleWidth,
    items,
    scaleX,
    scaleY,
    session
  }: {
    canScaleHeight: boolean
    canScaleWidth: boolean
    items: ActiveSelectionShapeScalingItem[]
    scaleX: number
    scaleY: number
    session: ActiveSelectionScalingSession
  }): ActiveSelectionAppliedScale {
    let appliedScaleX = scaleX
    let appliedScaleY = scaleY

    if (canScaleWidth) {
      appliedScaleX = this._resolveSelectionScaleX({
        items,
        session,
        scaleX,
        scaleY: appliedScaleY,
        allowGrowth: canScaleHeight
      })
    }

    if (canScaleHeight) {
      appliedScaleY = this._resolveSelectionScaleY({
        items,
        session,
        scaleX: appliedScaleX,
        scaleY,
        allowGrowth: canScaleWidth
      })
    }

    if (canScaleWidth && canScaleHeight) {
      appliedScaleX = this._resolveSelectionScaleX({
        items,
        session,
        scaleX,
        scaleY: appliedScaleY,
        allowGrowth: canScaleHeight
      })
      appliedScaleY = this._resolveSelectionScaleY({
        items,
        session,
        scaleX: appliedScaleX,
        scaleY,
        allowGrowth: canScaleWidth
      })
    }

    return {
      scaleX: appliedScaleX,
      scaleY: appliedScaleY
    }
  }

  /**
   * Возвращает scale active selection, достаточный для всех proportional layout ограничений.
   */
  private _resolveProportionalSelectionScale({
    items,
    session,
    proportionalLayoutResults,
    scale,
    allowGrowthX,
    allowGrowthY
  }: {
    items: ActiveSelectionShapeScalingItem[]
    session: ActiveSelectionScalingSession
    proportionalLayoutResults: ActiveSelectionProportionalLayoutResults
    scale: number
    allowGrowthX: boolean
    allowGrowthY: boolean
  }): number {
    const constraints = items.map((item) => {
      const sessionItem = session.items.get(item.group)
      const layoutResult = proportionalLayoutResults.get(item.group)
      if (!sessionItem || !layoutResult) {
        throw new Error('Для шейпа должны быть рассчитаны ограничения текущей сессии')
      }

      return resolveActiveSelectionShapeScaleConstraint({
        layoutMinimumScale: layoutResult.minimumScale,
        limits: item.state,
        selectionBounds: session.bounds,
        shapeBounds: sessionItem.bounds,
        transformOriginX: sessionItem.transformOriginX,
        verticalAttachment: sessionItem.verticalAttachment
      })
    })

    return resolveProportionalSelectionScale({
      allowGrowthX,
      allowGrowthY,
      constraints,
      requestedScale: scale
    })
  }

  /**
   * Доводит ActiveSelection до minimum boundary на mousemove-кадрах,
   * где Fabric уже перестал обновлять scale после быстрого движения pointer.
   */
  private _resolveSelectionScaleAtPointerBoundary({
    isProportionalCornerScale,
    selection,
    items,
    session,
    transform,
    selectionScale,
    event
  }: {
    isProportionalCornerScale: boolean
    selection: ActiveSelection
    items: ActiveSelectionShapeScalingItem[]
    session: ActiveSelectionScalingSession
    transform: Transform
    selectionScale: ActiveSelectionAppliedScale
    event?: ShapeScalingPointerEvent
  }): ActiveSelectionAppliedScale {
    const { canScaleWidth, canScaleHeight } = resolveShapeScaleActionAxes({
      transform
    })

    if (isProportionalCornerScale) return selectionScale

    const pointerReachedOrPassedOriginX = canScaleWidth && this._hasPointerReachedSelectionScaleOrigin({
      selection,
      transform,
      event,
      axis: 'x'
    })
    const pointerReachedOrPassedOriginY = canScaleHeight && this._hasPointerReachedSelectionScaleOrigin({
      selection,
      transform,
      event,
      axis: 'y'
    })

    if (!pointerReachedOrPassedOriginX && !pointerReachedOrPassedOriginY) return selectionScale

    let nextScaleX = selectionScale.scaleX
    let nextScaleY = selectionScale.scaleY

    if (pointerReachedOrPassedOriginX) {
      nextScaleX = 0
    }
    if (pointerReachedOrPassedOriginY) {
      nextScaleY = 0
    }

    return this._resolveSelectionScale({
      items,
      isProportionalCornerScale,
      session,
      transform,
      proportionalLayoutResults: null,
      scaleX: nextScaleX,
      scaleY: nextScaleY
    })
  }

  /**
   * Возвращает scaleX рамки ActiveSelection, при котором все shape-группы остаются внутри bounds выделения.
   */
  private _resolveSelectionScaleX({
    items,
    session,
    scaleX,
    scaleY,
    allowGrowth
  }: {
    items: ActiveSelectionShapeScalingItem[]
    session: ActiveSelectionScalingSession
    scaleX: number
    scaleY: number
    allowGrowth: boolean
  }): number {
    let appliedScaleX = scaleX

    for (const item of items) {
      const sessionItem = session.items.get(item.group) as ActiveSelectionShapeScalingSessionItem
      const minimumWidth = this._resolveMinimumShapeWidth({
        item,
        scaleY
      })
      const availableWidth = resolveSelectionAvailableWidth({
        selectionBounds: session.bounds,
        shapeBounds: sessionItem.bounds,
        originX: sessionItem.transformOriginX
      })
      const minimumSelectionScaleX = resolveMinimumSelectionScaleForSize({
        minimumSize: minimumWidth,
        startSize: availableWidth,
        allowGrowth
      })

      appliedScaleX = Math.max(appliedScaleX, minimumSelectionScaleX)
    }

    return appliedScaleX
  }

  /**
   * Возвращает scaleY рамки ActiveSelection, при котором все shape-группы остаются внутри bounds выделения.
   */
  private _resolveSelectionScaleY({
    items,
    session,
    scaleX,
    scaleY,
    allowGrowth
  }: {
    items: ActiveSelectionShapeScalingItem[]
    session: ActiveSelectionScalingSession
    scaleX: number
    scaleY: number
    allowGrowth: boolean
  }): number {
    let appliedScaleY = scaleY

    for (const item of items) {
      const sessionItem = session.items.get(item.group) as ActiveSelectionShapeScalingSessionItem
      const layoutScaleX = this._resolveShapeLayoutScaleX({
        item,
        selectionScaleX: scaleX,
        selectionScaleY: scaleY
      })
      const minimumHeight = this._resolveMinimumShapeHeight({
        item,
        scaleX: layoutScaleX
      })
      const availableHeight = resolveSelectionAvailableHeight({
        selectionBounds: session.bounds,
        shapeBounds: sessionItem.bounds,
        verticalAttachment: sessionItem.verticalAttachment
      })
      const minimumSelectionScaleY = resolveMinimumSelectionScaleForSize({
        minimumSize: minimumHeight,
        startSize: availableHeight,
        allowGrowth
      })

      appliedScaleY = Math.max(appliedScaleY, minimumSelectionScaleY)
    }

    return appliedScaleY
  }

  /**
   * Возвращает layout scale конкретной shape-группы для непропорционального scaling по осям.
   * При proportional scaling по диагонали minimum считается один раз на кадр в handleScalingPreview.
   */
  private _resolveShapeLayoutScale({
    item,
    selectionScale
  }: {
    item: ActiveSelectionShapeScalingItem
    selectionScale: ActiveSelectionAppliedScale
  }): ActiveSelectionShapeLayoutScale {
    let scaleX = this._resolveShapeLayoutScaleX({
      item,
      selectionScaleX: selectionScale.scaleX,
      selectionScaleY: selectionScale.scaleY
    })
    let scaleY = this._resolveShapeLayoutScaleY({
      item,
      scaleX,
      selectionScaleY: selectionScale.scaleY
    })
    scaleX = this._resolveShapeLayoutScaleX({
      item,
      selectionScaleX: selectionScale.scaleX,
      selectionScaleY: scaleY
    })
    scaleY = this._resolveShapeLayoutScaleY({
      item,
      scaleX,
      selectionScaleY: selectionScale.scaleY
    })

    return {
      scaleX,
      scaleY
    }
  }

  /**
   * Возвращает layout scaleX shape-группы с учётом минимальной ширины текста.
   */
  private _resolveShapeLayoutScaleX({
    item,
    selectionScaleX,
    selectionScaleY
  }: {
    item: ActiveSelectionShapeScalingItem
    selectionScaleX: number
    selectionScaleY: number
  }): number {
    const { state } = item
    if (!state.canScaleWidth) return 1

    const minimumWidth = this._resolveMinimumShapeWidth({
      item,
      scaleY: selectionScaleY
    })
    const minimumScaleX = resolveMinimumSelectionScaleForSize({
      minimumSize: minimumWidth,
      startSize: state.startWidth,
      allowGrowth: state.canScaleHeight
    })

    return Math.max(selectionScaleX, minimumScaleX)
  }

  /**
   * Возвращает layout scaleY shape-группы с учётом минимальной высоты текста.
   */
  private _resolveShapeLayoutScaleY({
    item,
    scaleX,
    selectionScaleY
  }: {
    item: ActiveSelectionShapeScalingItem
    scaleX: number
    selectionScaleY: number
  }): number {
    const { state } = item
    if (!state.canScaleHeight) return 1

    const minimumHeight = this._resolveMinimumShapeHeight({
      item,
      scaleX
    })
    const minimumScaleY = resolveMinimumSelectionScaleForSize({
      minimumSize: minimumHeight,
      startSize: state.startHeight,
      allowGrowth: state.canScaleWidth
    })

    return Math.max(selectionScaleY, minimumScaleY)
  }

  /**
   * Собирает minimum layout-ограничения для proportional scaling по диагонали один раз на текущий preview-кадр.
   */
  private _resolveProportionalLayoutResults({
    items
  }: {
    items: ActiveSelectionShapeScalingItem[]
  }): ActiveSelectionProportionalLayoutResults {
    const results: ActiveSelectionProportionalLayoutResults = new Map()

    for (const item of items) {
      const proportionalMinimum = resolveMinimumProportionalShapeScale({
        group: item.group,
        text: item.text,
        state: item.state
      })

      results.set(item.group, {
        minimumScale: proportionalMinimum.scale,
        minimumHeight: proportionalMinimum.minimumHeight
      })
    }

    return results
  }

  /**
   * Возвращает минимальную ширину shape-группы для текущего vertical scale.
   */
  private _resolveMinimumShapeWidth({
    item,
    scaleY
  }: {
    item: ActiveSelectionShapeScalingItem
    scaleY: number
  }): number {
    const {
      group,
      text,
      constraintPadding,
      state
    } = item
    const attemptedHeight = Math.max(MIN_SIZE, state.startHeight * scaleY)

    return resolveMinimumShapeWidthForText({
      text,
      padding: constraintPadding,
      measurementCache: state.previewTextMeasurementCache ?? undefined,
      resolvePaddingForWidth: ({ width }) => resolveShapeScalingConstraintPadding({
        group,
        width,
        height: attemptedHeight
      })
    })
  }

  /**
   * Возвращает минимальную высоту shape-группы для текущего horizontal scale.
   */
  private _resolveMinimumShapeHeight({
    item,
    scaleX
  }: {
    item: ActiveSelectionShapeScalingItem
    scaleX: number
  }): number {
    const {
      group,
      text,
      constraintPadding,
      state
    } = item
    const attemptedWidth = Math.max(MIN_SIZE, state.startWidth * scaleX)

    return resolveMinimumTextFitHeight({
      group,
      text,
      width: attemptedWidth,
      padding: constraintPadding,
      measurementCache: state.previewTextMeasurementCache
    })
  }

  /**
   * Позиционирует shape по тому же vertical attachment, по которому считается clamp рамки.
   * Координаты остаются в стартовой плоскости объектов; текущий transform ActiveSelection переводит их в preview.
   */
  private _positionShapeInSelection({
    group,
    selection,
    sessionItem
  }: {
    group: ShapeGroup
    selection: ActiveSelection
    sessionItem: ActiveSelectionShapeScalingSessionItem
  }): void {
    const {
      bounds,
      rotatedGeometry,
      transformOriginX,
      transformOriginPointX,
      verticalAttachment
    } = sessionItem

    if (rotatedGeometry) {
      applyRotatedActiveSelectionShapeGeometry({
        geometry: rotatedGeometry,
        group,
        selection
      })
      return
    }

    positionActiveSelectionShape({
      bounds,
      group,
      transformOriginPointX,
      transformOriginX,
      verticalAttachment
    })
  }

  /**
   * Возвращает true, если pointer уже дошёл до origin активного scale-transform по переданной оси.
   */
  private _hasPointerReachedSelectionScaleOrigin({
    selection,
    transform,
    event,
    axis
  }: {
    selection: ActiveSelection
    transform: Transform
    event?: ShapeScalingPointerEvent
    axis: 'x' | 'y'
  }): boolean {
    const transformWithSign = transform as Transform & {
      signX?: number
      signY?: number
    }
    const sign = axis === 'x'
      ? transformWithSign.signX
      : transformWithSign.signY

    if (typeof sign !== 'number' || !Number.isFinite(sign)) return false

    const localPoint = resolveScaleLocalPointerForTransform({
      target: selection,
      transform,
      event,
      canvas: this.canvas
    })
    if (!localPoint) return false

    const pointCoordinate = axis === 'x'
      ? localPoint.x
      : localPoint.y

    return (pointCoordinate * sign) <= 0
  }
}
