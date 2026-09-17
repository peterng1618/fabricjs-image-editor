import type { Canvas } from 'fabric/es'

import { resolveMinimumShapeWidthForText } from '../layout/shape-layout'
import type {
  ShapeGroup,
  ShapeNode,
  ShapePadding,
  ShapeScalingState,
  ShapeTextNode
} from '../types'
import {
  hasShapePointerReachedScaleOrigin,
  resolveCurrentShapeDragScales
} from './shape-scaling-drag-boundary'
import {
  resolveMinimumProportionalShapeScale,
  resolveMinimumTextFitHeight,
  resolveShapeScalingConstraintPadding,
  SHAPE_SCALING_MIN_SIZE,
  SHAPE_SCALING_SCALE_EPSILON
} from './shape-scaling-layout'
import type { ShapeModifiedEvent } from './shape-scaling-types'

/** Масштаб шейпа по двум осям. */
type ShapeScale = Readonly<{
  scaleX: number
  scaleY: number
}>

/** Данные шейпа для движения указателя, дополняющего пропущенное событие `object:scaling`. */
export type ShapeCanvasMoveContext = Readonly<{
  constraintPadding: ShapePadding
  event: ShapeModifiedEvent
  group: ShapeGroup
  shape: ShapeNode
  state: ShapeScalingState
  text: ShapeTextNode
}>

/** Изменение масштаба, которое нужно применить на дополнительном движении указателя. */
export type ShapeCanvasMoveAppliedResolution = Readonly<{
  action: 'apply'
  didClampWidth: boolean
  minimumHeight: number | null
  scale: ShapeScale
}>

/** Результат расчёта дополнительного движения указателя. */
type ShapeCanvasMoveResolution = ShapeCanvasMoveAppliedResolution
  | Readonly<{ action: 'ignore' }>
  | Readonly<{ action: 'restore-blocked' }>

/** Результат проверки минимальной высоты на дополнительном кадре. */
type ShapeCanvasMoveHeightResolution = Readonly<{
  didClamp: boolean
  minimumHeight: number | null
  scaleY: number
  shouldRestoreBlockedAttempt: boolean
}>

/** Ограничивает ширину после пересечения указателем исходной неподвижной точки. */
function resolveCanvasMoveWidth({
  canvas,
  context,
  currentScale
}: {
  canvas: Canvas
  context: ShapeCanvasMoveContext
  currentScale: ShapeScale
}): Readonly<{ didClamp: boolean; scaleX: number }> {
  const { constraintPadding, event, group, state, text } = context
  const reachedOrigin = state.canScaleWidth && hasShapePointerReachedScaleOrigin({
    canvas,
    event,
    group,
    state,
    axis: 'x'
  })
  if (!reachedOrigin) return { didClamp: false, scaleX: currentScale.scaleX }

  const minimumWidth = resolveMinimumShapeWidthForText({
    text,
    padding: constraintPadding,
    resolvePaddingForWidth: ({ width }) => resolveShapeScalingConstraintPadding({
      group,
      width,
      height: Math.max(SHAPE_SCALING_MIN_SIZE, state.startHeight * currentScale.scaleY)
    })
  })
  const minimumScaleX = Math.max(
    SHAPE_SCALING_MIN_SIZE / state.startWidth,
    minimumWidth / state.startWidth
  )
  const didClamp = state.lastAllowedScaleX > minimumScaleX + SHAPE_SCALING_SCALE_EPSILON

  return { didClamp, scaleX: didClamp ? minimumScaleX : currentScale.scaleX }
}

/** Ограничивает высоту после пересечения указателем исходной неподвижной точки. */
function resolveCanvasMoveHeight({
  canvas,
  context,
  scaleX,
  scaleY
}: {
  canvas: Canvas
  context: ShapeCanvasMoveContext
  scaleX: number
  scaleY: number
}): ShapeCanvasMoveHeightResolution {
  const { constraintPadding, event, group, state, text } = context
  const reachedOrigin = state.canScaleHeight && hasShapePointerReachedScaleOrigin({
    canvas,
    event,
    group,
    state,
    axis: 'y'
  })
  if (!reachedOrigin) {
    return { didClamp: false, minimumHeight: null, scaleY, shouldRestoreBlockedAttempt: false }
  }
  if (!state.canScaleWidth && state.cannotScaleDownAtStart) {
    return { didClamp: false, minimumHeight: null, scaleY, shouldRestoreBlockedAttempt: true }
  }

  const minimumHeight = state.fixedWidthMinimumTextFitHeight ?? resolveMinimumTextFitHeight({
    group,
    text,
    width: Math.max(SHAPE_SCALING_MIN_SIZE, state.startWidth * scaleX),
    padding: constraintPadding,
    measurementCache: state.previewTextMeasurementCache
  })
  const minimumScaleY = Math.max(
    SHAPE_SCALING_MIN_SIZE / state.startHeight,
    minimumHeight / state.startHeight
  )
  const didClamp = state.lastAllowedScaleY > minimumScaleY + SHAPE_SCALING_SCALE_EPSILON

  return {
    didClamp,
    minimumHeight,
    scaleY: didClamp ? minimumScaleY : scaleY,
    shouldRestoreBlockedAttempt: false
  }
}

/** Рассчитывает минимальный масштаб для пропорционального скейлинга. */
function resolveProportionalCanvasMove({
  canvas,
  context
}: {
  canvas: Canvas
  context: ShapeCanvasMoveContext
}): ShapeCanvasMoveResolution {
  const { event, group, state, text } = context
  const currentScale = resolveCurrentShapeDragScales({ group, state })
  const reachedOriginX = state.canScaleWidth && hasShapePointerReachedScaleOrigin({
    canvas,
    event,
    group,
    state,
    axis: 'x'
  })
  const reachedOriginY = state.canScaleHeight && hasShapePointerReachedScaleOrigin({
    canvas,
    event,
    group,
    state,
    axis: 'y'
  })
  if (!reachedOriginX && !reachedOriginY) return { action: 'ignore' }

  const minimum = resolveMinimumProportionalShapeScale({ group, text, state })
  const shouldApply = Math.abs(currentScale.scaleX - minimum.scale) > SHAPE_SCALING_SCALE_EPSILON
    || Math.abs(currentScale.scaleY - minimum.scale) > SHAPE_SCALING_SCALE_EPSILON
  if (!shouldApply) return { action: 'ignore' }

  return {
    action: 'apply',
    didClampWidth: false,
    minimumHeight: minimum.minimumHeight,
    scale: { scaleX: minimum.scale, scaleY: minimum.scale }
  }
}

/** Рассчитывает отдельные минимальные масштабы по каждой оси. */
function resolveFreeCanvasMove({
  canvas,
  context
}: {
  canvas: Canvas
  context: ShapeCanvasMoveContext
}): ShapeCanvasMoveResolution {
  const { group, state } = context
  const currentScale = resolveCurrentShapeDragScales({ group, state })
  const width = resolveCanvasMoveWidth({ canvas, context, currentScale })
  const height = resolveCanvasMoveHeight({
    canvas,
    context,
    scaleX: width.scaleX,
    scaleY: currentScale.scaleY
  })
  if (height.shouldRestoreBlockedAttempt) return { action: 'restore-blocked' }

  const rawScaleX = Math.abs(group.scaleX ?? state.startScaleX) || state.startScaleX
  const rawScaleY = Math.abs(group.scaleY ?? state.startScaleY) || state.startScaleY
  const shouldNormalizeInactiveAxis = (
    !state.canScaleWidth && Math.abs(rawScaleX - currentScale.scaleX) > SHAPE_SCALING_SCALE_EPSILON
  ) || (
    !state.canScaleHeight && Math.abs(rawScaleY - currentScale.scaleY) > SHAPE_SCALING_SCALE_EPSILON
  )
  if (!width.didClamp && !height.didClamp && !shouldNormalizeInactiveAxis) {
    return { action: 'ignore' }
  }

  return {
    action: 'apply',
    didClampWidth: width.didClamp,
    minimumHeight: height.minimumHeight,
    scale: { scaleX: width.scaleX, scaleY: height.scaleY }
  }
}

/** Рассчитывает действие для движения указателя, дополняющего пропущенное событие `object:scaling`. */
export function resolveShapeCanvasMove({
  canvas,
  context
}: {
  canvas: Canvas
  context: ShapeCanvasMoveContext
}): ShapeCanvasMoveResolution {
  if (context.state.isProportionalScaling) {
    return resolveProportionalCanvasMove({ canvas, context })
  }

  return resolveFreeCanvasMove({ canvas, context })
}
