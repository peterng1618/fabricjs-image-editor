import {
  ActiveSelection,
  Canvas,
  Point,
  Transform
} from 'fabric/es'
import {
  applyFixedWidthShapeTextLayout,
  applyShapeTextLayout
} from '../layout/shape-layout'
import {
  ShapeGroup,
  ShapeHorizontalAlign,
  ShapePadding,
  ShapeScalingState,
  ShapeNode,
  ShapeTextNode,
  ShapeTextWrapPolicy,
  ShapeVerticalAlign
} from '../types'
import {
  getShapeNodes
} from '../domain/shape-nodes'
import {
  isShapeGroup
} from '../domain/shape-reference'
import {
  SHAPE_DEFAULT_HORIZONTAL_ALIGN,
  SHAPE_DEFAULT_VERTICAL_ALIGN
} from '../domain/shape-presets'
import {
  isShapeTransformCornerChanged,
  isShapeTransformOriginChanged
} from './shape-scaling-transform'
import {
  resolveCurrentShapeDragScales,
  storeShapeScaleDirectionsForCurrentTransform
} from './shape-scaling-drag-boundary'
import { applyShapeScalingPreviewLayout } from './shape-scaling-preview'
import {
  resolveShapeCanvasMove
} from './shape-scaling-canvas-move'
import type {
  ShapeCanvasMoveAppliedResolution,
  ShapeCanvasMoveContext
} from './shape-scaling-canvas-move'
import {
  resolveShapeScalingCommitPlan,
  resolveShapeScalingCommitStartSize
} from './shape-scaling-commit-plan'
import type {
  ShapeScalingCommitPlan,
  ShapeScalingCommitStartSize
} from './shape-scaling-commit-plan'
import ShapeActiveSelectionScalingController from './active-selection-scaling-controller'
import type {
  ActiveSelectionCommittedScale
} from './active-selection-scaling-controller'
import ShapeActiveSelectionScaleDomainSource from './active-selection-scale-domain-source'
import type {
  CanvasWithCurrentTransform,
  ShapeModifiedEvent,
  ShapeScalingDecision,
  ShapeScalingEvent
} from './shape-scaling-types'
import {
  commitResolvedShapeScalingLayout,
  ensureShapeScalingState,
  resolveShapeScalingConstraintPadding,
  resolveShapeScalingConstraintState,
  resolveShapeScalingInternalTextInset,
  resolveShapeScalingPreviewDimensions,
  resolveShapeScalingPreviewLayout,
  resolveShapeScalingTextWrapPolicy,
  resolveShapeScalingUserPadding,
  type ShapeScalingConstraintState,
  SHAPE_SCALING_MIN_SIZE as MIN_SIZE,
  SHAPE_SCALING_SCALE_EPSILON as SCALE_EPSILON
} from './shape-scaling-layout'

/** Масштаб верхнеуровневого шейпа по двум осям. */
type ShapeScale = Readonly<{
  scaleX: number
  scaleY: number
}>

/** Положение и отражение шейпа до применения текущего шага скейлинга. */
type ShapeScalingStepSnapshot = Readonly<{
  flipX: boolean
  flipY: boolean
  left: number
  top: number
}>

/** Ограничения и сессионное состояние текущего шага скейлинга. */
type PreparedShapeScalingStep = Readonly<{
  constraintPadding: ShapePadding
  state: ShapeScalingState
}>

/** Компоновка, которую нужно вернуть при завершении скейлинга без изменения размеров. */
type ShapeStateRestoreLayout = Readonly<{
  alignH: ShapeHorizontalAlign
  alignV: ShapeVerticalAlign
  height: number
  internalShapeTextInset: ShapePadding
  isFixedWidthVerticalScaling: boolean
  width: number
  wrapPolicy: ShapeTextWrapPolicy | undefined
}>

/** Проверяет, пересёк ли текущий жест исходную неподвижную точку. */
function didShapeScalingCrossOppositeCorner({
  group,
  state,
  transform
}: {
  group: ShapeGroup
  state: ShapeScalingState
  transform?: Transform | null
}): boolean {
  const hasNegativeScale = (state.canScaleWidth && (group.scaleX ?? 1) < 0)
    || (state.canScaleHeight && (group.scaleY ?? 1) < 0)

  return hasNegativeScale
    || isShapeTransformOriginChanged({ state, transform })
    || isShapeTransformCornerChanged({ state, transform })
}

/** Выбирает масштаб, который разрешено применить по итогам проверки ограничений. */
function resolveAllowedShapeScaling({
  constraintState,
  scaleX,
  scaleY,
  state
}: {
  constraintState: ShapeScalingConstraintState
  scaleX: number
  scaleY: number
  state: ShapeScalingState
}): ShapeScale {
  if (constraintState.shouldHandleAsNoop) {
    return { scaleX: state.startScaleX, scaleY: state.startScaleY }
  }
  if (constraintState.shouldRestoreLastAllowedTransform) {
    return { scaleX: state.lastAllowedScaleX, scaleY: state.lastAllowedScaleY }
  }

  return {
    scaleX: constraintState.clampedScaleX ?? scaleX,
    scaleY: constraintState.clampedScaleY ?? scaleY
  }
}

/** Возвращает минимальную высоту для предварительного расчёта текущего шага. */
function resolveShapeScalingPreviewMinimumHeight({
  constraintState,
  state
}: {
  constraintState: ShapeScalingConstraintState
  state: ShapeScalingState
}): number | null | undefined {
  if (constraintState.shouldHandleAsNoop) return state.startHeight
  if (constraintState.resolvedMinimumHeight !== null
    && constraintState.resolvedMinimumHeight !== undefined) {
    return constraintState.resolvedMinimumHeight
  }

  return !state.canScaleWidth && state.canScaleHeight
    ? state.fixedWidthMinimumTextFitHeight
    : null
}

/** Рассчитывает исходную компоновку для завершённого жеста без изменения размеров. */
function resolveShapeStateRestoreLayout({
  alignH,
  alignV,
  group,
  startHeight,
  startWidth,
  state
}: {
  alignH: ShapeGroup['shapeAlignHorizontal']
  alignV: ShapeGroup['shapeAlignVertical']
  group: ShapeGroup
  startHeight: number
  startWidth: number
  state: ShapeScalingState
}): ShapeStateRestoreLayout {
  const width = Math.max(MIN_SIZE, group.shapeBaseWidth ?? group.width ?? startWidth)
  const height = Math.max(MIN_SIZE, group.shapeBaseHeight ?? group.height ?? startHeight)

  return {
    alignH: alignH ?? SHAPE_DEFAULT_HORIZONTAL_ALIGN,
    alignV: alignV ?? SHAPE_DEFAULT_VERTICAL_ALIGN,
    height,
    internalShapeTextInset: resolveShapeScalingInternalTextInset({ group, width, height }),
    isFixedWidthVerticalScaling: !state.canScaleWidth && state.canScaleHeight,
    width,
    wrapPolicy: resolveShapeScalingTextWrapPolicy({
      isProportionalScaling: state.isProportionalScaling,
      startTextSplitByGrapheme: state.startTextSplitByGrapheme
    })
  }
}

/** Применяет рассчитанную исходную компоновку к шейпу и его тексту. */
function applyShapeStateRestoreLayout({
  group,
  layout,
  shape,
  text,
  userPadding
}: {
  group: ShapeGroup
  layout: ShapeStateRestoreLayout
  shape: ShapeNode
  text: ShapeTextNode
  userPadding: ShapePadding
}): void {
  const params = {
    group,
    shape,
    text,
    width: layout.width,
    height: layout.height,
    alignH: layout.alignH,
    alignV: layout.alignV,
    padding: userPadding,
    wrapPolicy: layout.wrapPolicy,
    internalShapeTextInset: layout.internalShapeTextInset,
    resolveInternalShapeTextInset: ({ width, height }: { width: number; height: number }) => {
      return resolveShapeScalingInternalTextInset({ group, width, height })
    }
  }

  if (layout.isFixedWidthVerticalScaling) {
    applyFixedWidthShapeTextLayout(params)
    return
  }

  applyShapeTextLayout(params)
}

/**
 * Контроллер масштабирования shape-группы без изменения размера шрифта.
 */
export default class ShapeScalingController {
  /**
   * Fabric canvas редактора.
   */
  private canvas: Canvas

  /**
   * Временное состояние масштабирования для активных shape-групп.
   */
  private scalingState: WeakMap<ShapeGroup, ShapeScalingState>

  /**
   * Контроллер масштабирования shape-групп внутри ActiveSelection.
   */
  private activeSelectionScalingController: ShapeActiveSelectionScalingController

  /** Инициализирует контроллер скейлинга групп шейпов на холсте. */
  constructor({ canvas }: { canvas: Canvas }) {
    this.canvas = canvas
    this.scalingState = new WeakMap()
    this.activeSelectionScalingController = new ShapeActiveSelectionScalingController({
      canvas,
      shapeScalingState: this.scalingState
    })
  }

  /**
   * Обрабатывает процесс масштабирования shape-группы.
   */
  public handleObjectScaling = (
    event: ShapeScalingEvent
  ): void => {
    const {
      target,
      transform
    } = event
    if (target instanceof ActiveSelection) {
      this.activeSelectionScalingController.handleScalingPreview({
        selection: target,
        transform,
        event: event.e
      })
      return
    }

    if (!isShapeGroup(target)) return

    const group = target
    const {
      shape,
      text
    } = getShapeNodes({ group })

    if (!shape || !text) return

    this._handleShapeScalingStep({ event, group, shape, text })
  }

  /** Рассчитывает и применяет один шаг скейлинга верхнеуровневого шейпа. */
  private _handleShapeScalingStep({
    event,
    group,
    shape,
    text
  }: {
    event: ShapeScalingEvent
    group: ShapeGroup
    shape: ShapeNode
    text: ShapeTextNode
  }): void {
    const { transform } = event
    const { constraintPadding, state } = this._prepareShapeScalingStep({ event, group, text })
    const snapshot = Object.freeze({
      flipX: Boolean(group.flipX),
      flipY: Boolean(group.flipY),
      left: group.left ?? 0,
      top: group.top ?? 0
    })
    const scalingDecision = this._resolveScalingDecision({
      group,
      text,
      constraintPadding,
      state,
      transform
    })

    if (scalingDecision.shouldHandleAsNoop) {
      this._restoreBlockedScalingAttempt({
        group,
        shape,
        text,
        state
      })
      return
    }

    this._applyShapeScalingDecision({
      group,
      scalingDecision,
      shape,
      state,
      text
    })
    this._finishShapeScalingStep({ group, scalingDecision, snapshot, state })
  }

  /** Инициализирует ограничения и временное состояние текущего шага до расчёта размеров. */
  private _prepareShapeScalingStep({
    event,
    group,
    text
  }: {
    event: ShapeScalingEvent
    group: ShapeGroup
    text: ShapeTextNode
  }): PreparedShapeScalingStep {
    group.set({ centeredScaling: false, lockScalingFlip: true })

    const constraintPadding = resolveShapeScalingConstraintPadding({ group })
    const state = ensureShapeScalingState({
      constraintPadding,
      group,
      scalingState: this.scalingState,
      text,
      transform: event.transform
    })
    const isCornerScaleAction = state.canScaleWidth && state.canScaleHeight
    const isShiftPressed = Boolean(event.e && 'shiftKey' in event.e && event.e.shiftKey)

    state.isProportionalScaling = isCornerScaleAction && !isShiftPressed
    storeShapeScaleDirectionsForCurrentTransform({
      canvas: this.canvas,
      event: event.e,
      group,
      state,
      transform: event.transform
    })

    return { constraintPadding, state }
  }

  /** Применяет рассчитанный масштаб, внутреннюю компоновку и нормализацию преобразования Fabric. */
  private _applyShapeScalingDecision({
    forceTransform = false,
    group,
    scalingDecision,
    shape,
    state,
    text
  }: {
    forceTransform?: boolean
    group: ShapeGroup
    scalingDecision: ShapeScalingDecision
    shape: ShapeNode
    state: ShapeScalingState
    text: ShapeTextNode
  }): void {
    const previewLayout = resolveShapeScalingPreviewLayout({
      group,
      text,
      state,
      appliedScaleX: scalingDecision.appliedScaleX,
      appliedScaleY: scalingDecision.appliedScaleY,
      minimumHeight: scalingDecision.previewHeight
    })
    const currentScaleX = Math.abs(group.scaleX ?? state.startScaleX) || state.startScaleX
    const currentScaleY = Math.abs(group.scaleY ?? state.startScaleY) || state.startScaleY
    const shouldApplyResolvedTransform = forceTransform
      || scalingDecision.shouldRestoreLastAllowedTransform
      || Math.abs(scalingDecision.appliedScaleX - currentScaleX) > SCALE_EPSILON
      || Math.abs(scalingDecision.appliedScaleY - currentScaleY) > SCALE_EPSILON

    if (shouldApplyResolvedTransform) {
      this._applyResolvedScalingState({
        group,
        state,
        shouldHandleAsNoop: false,
        scaleX: scalingDecision.appliedScaleX,
        scaleY: scalingDecision.appliedScaleY
      })
    }

    applyShapeScalingPreviewLayout({
      group,
      shape,
      text,
      layout: previewLayout,
      alignH: group.shapeAlignHorizontal ?? SHAPE_DEFAULT_HORIZONTAL_ALIGN,
      scaleX: scalingDecision.appliedScaleX,
      scaleY: scalingDecision.appliedScaleY,
      minSize: MIN_SIZE,
      scaleEpsilon: SCALE_EPSILON
    })
  }

  /** Восстанавливает привязку, сохраняет допустимый шаг и запрашивает отрисовку. */
  private _finishShapeScalingStep({
    group,
    scalingDecision,
    snapshot,
    state
  }: {
    group: ShapeGroup
    scalingDecision: ShapeScalingDecision
    snapshot: ShapeScalingStepSnapshot
    state: ShapeScalingState
  }): void {
    this._restoreScalingAnchorPosition({
      group,
      state
    })

    if (!scalingDecision.shouldHandleAsNoop && !scalingDecision.shouldRestoreLastAllowedTransform) {
      this._storeLastAllowedTransform({
        group,
        state,
        scaleX: scalingDecision.appliedScaleX,
        scaleY: scalingDecision.appliedScaleY,
        currentLeft: snapshot.left,
        currentTop: snapshot.top,
        currentFlipX: snapshot.flipX,
        currentFlipY: snapshot.flipY
      })
    }

    this.canvas.requestRenderAll()
  }

  /**
   * Вычисляет итоговое решение для текущего шага scaling: блокировку, preview-размеры и применённый scale.
   */
  private _resolveScalingDecision({
    group,
    text,
    constraintPadding,
    state,
    transform
  }: {
    group: ShapeGroup
    text: ShapeTextNode
    constraintPadding: ShapePadding
    state: ShapeScalingState
    transform?: Transform | null
  }): ShapeScalingDecision {
    const {
      scaleX,
      scaleY
    } = resolveCurrentShapeDragScales({
      group,
      state
    })
    if (didShapeScalingCrossOppositeCorner({ group, state, transform })) {
      state.crossedOppositeCorner = true
    }

    const constraintState = resolveShapeScalingConstraintState({
      group,
      text,
      constraintPadding,
      state,
      scaleX,
      scaleY
    })
    const allowed = resolveAllowedShapeScaling({ constraintState, scaleX, scaleY, state })

    const { previewHeight } = resolveShapeScalingPreviewDimensions({
      group,
      text,
      constraintPadding,
      startDimensions: state,
      appliedScaleX: allowed.scaleX,
      appliedScaleY: allowed.scaleY,
      minimumHeight: resolveShapeScalingPreviewMinimumHeight({ constraintState, state }),
      measurementCache: state.previewTextMeasurementCache
    })

    return {
      appliedScaleX: allowed.scaleX,
      appliedScaleY: allowed.scaleY,
      previewHeight,
      shouldHandleAsNoop: constraintState.shouldHandleAsNoop,
      shouldRestoreLastAllowedTransform: constraintState.shouldRestoreLastAllowedTransform
    }
  }

  /**
   * Восстанавливает начальное состояние, когда текущий жест заблокирован минимальным размером.
   */
  private _restoreBlockedScalingAttempt({
    group,
    shape,
    text,
    state
  }: {
    group: ShapeGroup
    shape: ShapeNode
    text: ShapeTextNode
    state: ShapeScalingState
  }): void {
    const alignH = group.shapeAlignHorizontal ?? SHAPE_DEFAULT_HORIZONTAL_ALIGN

    this._applyResolvedScalingState({
      group,
      state,
      shouldHandleAsNoop: true,
      scaleX: state.startScaleX,
      scaleY: state.startScaleY
    })

    const previewLayout = resolveShapeScalingPreviewLayout({
      group,
      text,
      state,
      appliedScaleX: state.startScaleX,
      appliedScaleY: state.startScaleY,
      minimumHeight: state.startHeight
    })

    applyShapeScalingPreviewLayout({
      group,
      shape,
      text,
      layout: previewLayout,
      alignH,
      scaleX: state.startScaleX,
      scaleY: state.startScaleY,
      minSize: MIN_SIZE,
      scaleEpsilon: SCALE_EPSILON
    })

    this._restoreScalingAnchorPosition({
      group,
      state
    })

    this.canvas.requestRenderAll()
  }

  /**
   * Применяет скорректированное преобразование, когда текущий жест нужно ограничить или откатить.
   */
  private _applyResolvedScalingState({
    group,
    state,
    shouldHandleAsNoop,
    scaleX,
    scaleY
  }: {
    group: ShapeGroup
    state: ShapeScalingState
    shouldHandleAsNoop: boolean
    scaleX: number
    scaleY: number
  }): void {
    state.blockedScaleAttempt = shouldHandleAsNoop
    group.shapeScalingNoopTransform = shouldHandleAsNoop

    const nextScaleX = shouldHandleAsNoop ? state.startScaleX : scaleX
    const nextScaleY = shouldHandleAsNoop ? state.startScaleY : scaleY
    const nextLeft = shouldHandleAsNoop ? state.startLeft : state.lastAllowedLeft
    const nextTop = shouldHandleAsNoop ? state.startTop : state.lastAllowedTop

    if (shouldHandleAsNoop) {
      state.lastAllowedScaleX = state.startScaleX
      state.lastAllowedScaleY = state.startScaleY
      state.lastAllowedLeft = state.startLeft
      state.lastAllowedTop = state.startTop
    }

    group.set({
      flipX: state.lastAllowedFlipX,
      flipY: state.lastAllowedFlipY,
      scaleX: nextScaleX,
      scaleY: nextScaleY,
      left: nextLeft,
      top: nextTop
    })

    this._restoreScalingAnchorPosition({
      group,
      state
    })
  }

  /**
   * Удерживает шейп на минимальной границе, когда Fabric перестал отправлять `object:scaling`.
   */
  public handleCanvasMouseMove = (event: ShapeModifiedEvent): void => {
    const canvas = this.canvas as CanvasWithCurrentTransform
    const transform = canvas._currentTransform
    if (!transform) return

    const { target } = transform
    if (target instanceof ActiveSelection) {
      this.activeSelectionScalingController.handleScalingPreview({
        selection: target,
        transform,
        event: event.e
      })
      return
    }

    if (!isShapeGroup(target)) return

    const group = target
    const state = this.scalingState.get(group)
    if (!state) return

    const {
      shape,
      text
    } = getShapeNodes({ group })

    if (!shape || !text) return
    const constraintPadding = resolveShapeScalingConstraintPadding({ group })
    if (!state.canScaleWidth && !state.canScaleHeight) return

    const context = {
      constraintPadding,
      event: { ...event, transform },
      group,
      shape,
      state,
      text
    }
    const resolution = resolveShapeCanvasMove({ canvas: this.canvas, context })

    if (resolution.action === 'ignore') return
    if (resolution.action === 'restore-blocked') {
      this._restoreBlockedScalingAttempt({ group, shape, text, state })
      return
    }

    this._applyCanvasMoveResolution({ context, resolution })
  }

  /** Применяет рассчитанное состояние и сохраняет его как последний допустимый кадр. */
  private _applyCanvasMoveResolution({
    context,
    resolution
  }: {
    context: ShapeCanvasMoveContext
    resolution: ShapeCanvasMoveAppliedResolution
  }): void {
    const { constraintPadding, group, shape, state, text } = context
    const fixedWidthMinimumHeight = !state.canScaleWidth && state.canScaleHeight
      ? state.fixedWidthMinimumTextFitHeight
      : null
    const minimumHeight = resolution.didClampWidth
      ? null
      : resolution.minimumHeight ?? fixedWidthMinimumHeight
    const { previewHeight } = resolveShapeScalingPreviewDimensions({
      group,
      text,
      constraintPadding,
      startDimensions: state,
      appliedScaleX: resolution.scale.scaleX,
      appliedScaleY: resolution.scale.scaleY,
      minimumHeight,
      measurementCache: state.previewTextMeasurementCache
    })
    const scalingDecision = {
      appliedScaleX: resolution.scale.scaleX,
      appliedScaleY: resolution.scale.scaleY,
      previewHeight,
      shouldHandleAsNoop: false,
      shouldRestoreLastAllowedTransform: false
    }

    this._applyShapeScalingDecision({
      forceTransform: true,
      group,
      scalingDecision,
      shape,
      state,
      text
    })
    this._finishShapeScalingStep({
      group,
      scalingDecision,
      state,
      snapshot: {
        flipX: state.lastAllowedFlipX,
        flipY: state.lastAllowedFlipY,
        left: state.lastAllowedLeft,
        top: state.lastAllowedTop
      }
    })
  }

  /**
   * Сохраняет последнюю допустимую трансформацию текущего drag, к которой можно безопасно вернуться.
   */
  private _storeLastAllowedTransform({
    group,
    state,
    scaleX,
    scaleY,
    currentLeft,
    currentTop,
    currentFlipX,
    currentFlipY
  }: {
    group: ShapeGroup
    state: ShapeScalingState
    scaleX: number
    scaleY: number
    currentLeft: number
    currentTop: number
    currentFlipX: boolean
    currentFlipY: boolean
  }): void {
    state.blockedScaleAttempt = false
    group.shapeScalingNoopTransform = false
    state.lastAllowedScaleX = Math.abs(scaleX) || 1
    state.lastAllowedScaleY = Math.abs(scaleY) || 1
    state.lastAllowedLeft = group.left ?? currentLeft
    state.lastAllowedTop = group.top ?? currentTop
    state.lastAllowedFlipX = currentFlipX
    state.lastAllowedFlipY = currentFlipY
  }

  /**
   * Завершает масштабирование и "запекает" размеры в геометрию shape-группы.
   */
  public handleObjectModified = (event: ShapeModifiedEvent): void => {
    const { target } = event
    if (!isShapeGroup(target)) return

    const group = target
    const state = this.scalingState.get(group)
    const scaleX = Math.abs(group.scaleX ?? 1) || 1
    const scaleY = Math.abs(group.scaleY ?? 1) || 1
    const hasScaleChange = Math.abs(scaleX - 1) > SCALE_EPSILON
      || Math.abs(scaleY - 1) > SCALE_EPSILON
    const hasScalingState = Boolean(state)

    if (!hasScaleChange && !hasScalingState) return

    const startSize = resolveShapeScalingCommitStartSize({ group, state })
    const {
      shape,
      text
    } = getShapeNodes({ group })

    if (!shape || !text) {
      if (state?.blockedScaleAttempt) group.shapeScalingNoopTransform = false
      this.scalingState.delete(group)
      return
    }

    if (state?.blockedScaleAttempt) {
      this._restoreBlockedShapeScaling({ group, shape, startSize, state, text })
      return
    }

    const plan = resolveShapeScalingCommitPlan({
      canvas: this.canvas,
      event,
      group,
      scale: { scaleX, scaleY },
      startSize,
      state,
      text
    })

    if (!plan.dimensions.hasDimensionChange && state) {
      this._restoreUnchangedShapeScaling({ group, plan, shape, state, text })
      return
    }

    this._applyShapeScalingCommit({ group, plan, shape, state, text })
  }

  /** Восстанавливает заблокированный жест без фиксации новых размеров. */
  private _restoreBlockedShapeScaling({
    group,
    shape,
    startSize,
    state,
    text
  }: {
    group: ShapeGroup
    shape: ShapeNode
    startSize: ShapeScalingCommitStartSize
    state: ShapeScalingState
    text: ShapeTextNode
  }): void {
    this._restoreShapeStateWithoutResize({
      group,
      shape,
      text,
      state,
      startWidth: startSize.width,
      startHeight: startSize.height,
      alignH: group.shapeAlignHorizontal,
      alignV: group.shapeAlignVertical,
      userPadding: resolveShapeScalingUserPadding({ group })
    })

    group.shapeScalingNoopTransform = false
    this.scalingState.delete(group)
    this.canvas.requestRenderAll()
  }

  /** Восстанавливает исходную компоновку, когда жест не изменил канонические размеры. */
  private _restoreUnchangedShapeScaling({
    group,
    plan,
    shape,
    state,
    text
  }: {
    group: ShapeGroup
    plan: ShapeScalingCommitPlan
    shape: ShapeNode
    state: ShapeScalingState
    text: ShapeTextNode
  }): void {
    this._restoreShapeStateWithoutResize({
      group,
      shape,
      text,
      state,
      startWidth: plan.startDimensions.startWidth,
      startHeight: plan.startDimensions.startHeight,
      alignH: plan.alignH,
      alignV: plan.alignV,
      userPadding: resolveShapeScalingUserPadding({ group })
    })

    this.scalingState.delete(group)
    this.canvas.requestRenderAll()
  }

  /** Применяет рассчитанную компоновку и завершает временную сессию скейлинга. */
  private _applyShapeScalingCommit({
    group,
    plan,
    shape,
    state,
    text
  }: {
    group: ShapeGroup
    plan: ShapeScalingCommitPlan
    shape: ShapeNode
    state?: ShapeScalingState
    text: ShapeTextNode
  }): void {
    if (state) group.set({ left: state.lastAllowedLeft, top: state.lastAllowedTop })

    commitResolvedShapeScalingLayout({
      group,
      shape,
      text,
      width: plan.dimensions.width,
      height: plan.dimensions.height,
      alignH: plan.alignH,
      alignV: plan.alignV,
      startManualBaseWidth: plan.startDimensions.startManualBaseWidth,
      startManualBaseHeight: plan.startDimensions.startManualBaseHeight,
      canScaleWidth: plan.startDimensions.canScaleWidth,
      canScaleHeight: plan.startDimensions.canScaleHeight,
      hasWidthChange: plan.dimensions.hasWidthChange,
      wrapPolicy: plan.wrapPolicy
    })

    if (state) this._restoreScalingAnchorPosition({ group, state })

    group.setCoords()
    text.setCoords()
    shape.setCoords()
    this.scalingState.delete(group)
    group.shapeScalingNoopTransform = false
    this.canvas.requestRenderAll()
  }

  /**
   * Фиксирует resize дочерней shape-группы после масштабирования ActiveSelection.
   */
  public commitActiveSelectionGroupScaling({
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
    return this.activeSelectionScalingController.commitGroupScaling({
      group,
      scaleX,
      scaleY,
      transform
    })
  }

  /** Переносит масштаб дочернего шейпа в размеры без очистки общей сессии. */
  public materializeActiveSelectionGroupScaling({
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
    return this.activeSelectionScalingController.materializeGroupScaling({
      group,
      scaleX,
      scaleY,
      transform
    })
  }

  /** Создаёт сессионный источник фактической геометрии шейпов смешанного выделения. */
  public createActiveSelectionScaleDomainSource({
    selection,
    targets,
    transform
  }: {
    selection: ActiveSelection
    targets: readonly ShapeGroup[]
    transform: Transform
  }): ShapeActiveSelectionScaleDomainSource {
    return new ShapeActiveSelectionScaleDomainSource({
      controller: this.activeSelectionScalingController,
      selection,
      targets,
      transform
    })
  }

  /**
   * Очищает состояние масштабирования для переданной shape-группы.
   */
  public clearState({ group }: { group: ShapeGroup }): void {
    this.scalingState.delete(group)
    group.shapeScalingNoopTransform = false
  }

  /** Возвращает применённый масштаб и способ сохранения геометрии после завершения жеста. */
  public resolveActiveSelectionCommittedScale({
    selection
  }: {
    selection: ActiveSelection
  }): ActiveSelectionCommittedScale {
    return this.activeSelectionScalingController.resolveCommittedScale({
      selection
    })
  }

  /**
   * Очищает состояние масштабирования для переданного ActiveSelection.
   */
  public clearActiveSelectionState({ selection }: { selection: ActiveSelection }): void {
    this.activeSelectionScalingController.clearState({
      selection
    })
  }

  /**
   * Возвращает группу в сохраненную anchor-позицию для текущего drag.
   */
  private _restoreScalingAnchorPosition({
    group,
    state
  }: {
    group: ShapeGroup
    state: ShapeScalingState
  }): void {
    const {
      scalingAnchorX,
      scalingAnchorY,
      scalingAnchorOriginX,
      scalingAnchorOriginY
    } = state

    if (
      scalingAnchorX === null
      || scalingAnchorY === null
      || scalingAnchorOriginX === null
      || scalingAnchorOriginY === null
    ) {
      group.setCoords()
      return
    }

    group.setPositionByOrigin(
      new Point(scalingAnchorX, scalingAnchorY),
      scalingAnchorOriginX,
      scalingAnchorOriginY
    )
    group.setCoords()
  }

  /**
   * Восстанавливает стабильное состояние объекта, когда масштабирование не привело к изменению ручных размеров,
   * сохраняя текущий laid-out размер shape по тому же layout-контракту, что и финальный commit-path scaling.
   */
  private _restoreShapeStateWithoutResize({
    group,
    shape,
    text,
    state,
    startWidth,
    startHeight,
    alignH,
    alignV,
    userPadding
  }: {
    group: ShapeGroup
    shape: ShapeNode
    text: ShapeTextNode
    state: ShapeScalingState
    startWidth: number
    startHeight: number
    alignH: ShapeGroup['shapeAlignHorizontal']
    alignV: ShapeGroup['shapeAlignVertical']
    userPadding: ShapePadding
  }): void {
    const layout = resolveShapeStateRestoreLayout({
      alignH,
      alignV,
      group,
      startHeight,
      startWidth,
      state
    })

    applyShapeStateRestoreLayout({ group, layout, shape, text, userPadding })

    group.set({
      left: state.lastAllowedLeft,
      top: state.lastAllowedTop,
      flipX: state.lastAllowedFlipX,
      flipY: state.lastAllowedFlipY,
      scaleX: 1,
      scaleY: 1
    })

    this._restoreScalingAnchorPosition({
      group,
      state
    })
  }
}
