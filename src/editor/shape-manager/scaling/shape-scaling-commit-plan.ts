import type { Canvas } from 'fabric'

import { resolveMinimumShapeWidthForText } from '../layout/shape-layout'
import {
  SHAPE_DEFAULT_HORIZONTAL_ALIGN,
  SHAPE_DEFAULT_VERTICAL_ALIGN
} from '../domain/shape-presets'
import type {
  ShapeGroup,
  ShapeHorizontalAlign,
  ShapePadding,
  ShapeScalingState,
  ShapeTextNode,
  ShapeTextWrapPolicy,
  ShapeVerticalAlign
} from '../types'
import {
  hasShapePointerReachedScaleOrigin,
  shouldClampShapeHeightToMinimum,
  shouldClampShapeWidthToMinimum
} from './shape-scaling-drag-boundary'
import {
  resolveMinimumProportionalShapeScale,
  resolveMinimumTextFitHeight,
  resolveShapeScalingCommitDimensions,
  resolveShapeScalingConstraintPadding,
  resolveShapeScalingTextWrapPolicy,
  SHAPE_SCALING_MIN_SIZE,
  SHAPE_SCALING_SCALE_EPSILON
} from './shape-scaling-layout'
import type {
  ShapeScalingCommitDimensions,
  ShapeScalingStartDimensions
} from './shape-scaling-layout'
import { resolveShapeScaleActionAxes } from './shape-scaling-transform'
import type { ShapeModifiedEvent } from './shape-scaling-types'

/** Масштаб шейпа по двум осям во время финальной фиксации. */
type ShapeScale = Readonly<{
  scaleX: number
  scaleY: number
}>

/** Исходный размер шейпа перед финальной фиксацией скейлинга. */
export type ShapeScalingCommitStartSize = Readonly<{
  height: number
  width: number
}>

/** Данные, нужные для расчёта финального масштаба и размеров. */
type ShapeScalingCommitContext = Readonly<{
  alignH: ShapeHorizontalAlign
  alignV: ShapeVerticalAlign
  constraintPadding: ShapePadding
  currentScale: ShapeScale
  startDimensions: ShapeScalingStartDimensions
}>

/** Полный план финальной фиксации геометрии шейпа. */
export type ShapeScalingCommitPlan = Readonly<{
  alignH: ShapeHorizontalAlign
  alignV: ShapeVerticalAlign
  dimensions: ShapeScalingCommitDimensions
  startDimensions: ShapeScalingStartDimensions
  wrapPolicy?: ShapeTextWrapPolicy
}>

/** Возвращает канонический размер, от которого нужно фиксировать завершённый скейлинг. */
export function resolveShapeScalingCommitStartSize({
  group,
  state
}: {
  group: ShapeGroup
  state?: ShapeScalingState
}): ShapeScalingCommitStartSize {
  const width = state?.startWidth ?? Math.max(
    SHAPE_SCALING_MIN_SIZE,
    group.shapeBaseWidth ?? group.width ?? group.shapeManualBaseWidth ?? SHAPE_SCALING_MIN_SIZE
  )
  const height = state?.startHeight ?? Math.max(
    SHAPE_SCALING_MIN_SIZE,
    group.shapeBaseHeight ?? group.height ?? group.shapeManualBaseHeight ?? SHAPE_SCALING_MIN_SIZE
  )

  return { height, width }
}

/** Собирает оси, исходные размеры и настройки финальной фиксации. */
function createShapeScalingCommitContext({
  event,
  group,
  scale,
  startSize,
  state
}: {
  event: ShapeModifiedEvent
  group: ShapeGroup
  scale: ShapeScale
  startSize: ShapeScalingCommitStartSize
  state?: ShapeScalingState
}): ShapeScalingCommitContext {
  const resolvedAxes = event.transform
    ? resolveShapeScaleActionAxes({ transform: event.transform })
    : null
  const canScaleWidth = state?.canScaleWidth
    ?? resolvedAxes?.canScaleWidth
    ?? (Math.abs(scale.scaleX - 1) > SHAPE_SCALING_SCALE_EPSILON)
  const canScaleHeight = state?.canScaleHeight
    ?? resolvedAxes?.canScaleHeight
    ?? (Math.abs(scale.scaleY - 1) > SHAPE_SCALING_SCALE_EPSILON)
  const startManualBaseWidth = state?.startManualBaseWidth ?? Math.max(
    SHAPE_SCALING_MIN_SIZE,
    group.shapeManualBaseWidth ?? startSize.width
  )
  const startManualBaseHeight = state?.startManualBaseHeight ?? Math.max(
    SHAPE_SCALING_MIN_SIZE,
    group.shapeManualBaseHeight ?? startSize.height
  )

  return {
    alignH: group.shapeAlignHorizontal ?? SHAPE_DEFAULT_HORIZONTAL_ALIGN,
    alignV: group.shapeAlignVertical ?? SHAPE_DEFAULT_VERTICAL_ALIGN,
    constraintPadding: resolveShapeScalingConstraintPadding({ group }),
    currentScale: scale,
    startDimensions: {
      startWidth: startSize.width,
      startHeight: startSize.height,
      startManualBaseWidth,
      startManualBaseHeight,
      canScaleWidth,
      canScaleHeight
    }
  }
}

/** Ограничивает финальный пропорциональный масштаб минимальным размером текста. */
function resolveProportionalCommitScale({
  canvas,
  context,
  event,
  group,
  initialScale,
  state,
  text
}: {
  canvas: Canvas
  context: ShapeScalingCommitContext
  event: ShapeModifiedEvent
  group: ShapeGroup
  initialScale: ShapeScale
  state: ShapeScalingState
  text: ShapeTextNode
}): ShapeScale {
  const reachedOriginX = hasShapePointerReachedScaleOrigin({
    canvas,
    event,
    group,
    state,
    axis: 'x'
  })
  const reachedOriginY = hasShapePointerReachedScaleOrigin({
    canvas,
    event,
    group,
    state,
    axis: 'y'
  })
  if (!reachedOriginX && !reachedOriginY) return initialScale

  const minimum = resolveMinimumProportionalShapeScale({ group, text, state })
  const isBelowMinimum = context.currentScale.scaleX < minimum.scale - SHAPE_SCALING_SCALE_EPSILON
    || context.currentScale.scaleY < minimum.scale - SHAPE_SCALING_SCALE_EPSILON

  return isBelowMinimum
    ? { scaleX: minimum.scale, scaleY: minimum.scale }
    : initialScale
}

/** Ограничивает финальный свободный масштаб минимальными размерами по каждой оси. */
function resolveFreeCommitScale({
  canvas,
  context,
  event,
  group,
  initialScale,
  state,
  text
}: {
  canvas: Canvas
  context: ShapeScalingCommitContext
  event: ShapeModifiedEvent
  group: ShapeGroup
  initialScale: ShapeScale
  state?: ShapeScalingState
  text: ShapeTextNode
}): ShapeScale {
  const { constraintPadding, startDimensions } = context
  let { scaleX, scaleY } = initialScale
  const minimumWidth = resolveMinimumShapeWidthForText({
    text,
    padding: constraintPadding,
    resolvePaddingForWidth: ({ width }) => resolveShapeScalingConstraintPadding({
      group,
      width,
      height: Math.max(SHAPE_SCALING_MIN_SIZE, startDimensions.startHeight * scaleY)
    })
  })

  if (shouldClampShapeWidthToMinimum({ canvas, event, group, minimumWidth, state })) {
    scaleX = Math.max(SHAPE_SCALING_MIN_SIZE / startDimensions.startWidth, minimumWidth / startDimensions.startWidth)
  }

  const minimumHeight = resolveMinimumTextFitHeight({
    group,
    text,
    width: Math.max(SHAPE_SCALING_MIN_SIZE, startDimensions.startWidth * scaleX),
    padding: constraintPadding
  })
  if (shouldClampShapeHeightToMinimum({ canvas, event, group, minimumHeight, state })) {
    scaleY = Math.max(SHAPE_SCALING_MIN_SIZE / startDimensions.startHeight, minimumHeight / startDimensions.startHeight)
  }

  return { scaleX, scaleY }
}

/** Выбирает допустимый финальный масштаб с учётом режима текущего жеста. */
function resolveShapeScalingCommitScale({
  canvas,
  context,
  event,
  group,
  state,
  text
}: {
  canvas: Canvas
  context: ShapeScalingCommitContext
  event: ShapeModifiedEvent
  group: ShapeGroup
  state?: ShapeScalingState
  text: ShapeTextNode
}): ShapeScale {
  const initialScale = {
    scaleX: state?.lastAllowedScaleX ?? context.currentScale.scaleX,
    scaleY: state?.lastAllowedScaleY ?? context.currentScale.scaleY
  }
  if (state?.isProportionalScaling) {
    return resolveProportionalCommitScale({ canvas, context, event, group, initialScale, state, text })
  }

  return resolveFreeCommitScale({ canvas, context, event, group, initialScale, state, text })
}

/** Рассчитывает полный план финальной фиксации геометрии шейпа. */
export function resolveShapeScalingCommitPlan({
  canvas,
  event,
  group,
  scale,
  startSize,
  state,
  text
}: {
  canvas: Canvas
  event: ShapeModifiedEvent
  group: ShapeGroup
  scale: ShapeScale
  startSize: ShapeScalingCommitStartSize
  state?: ShapeScalingState
  text: ShapeTextNode
}): ShapeScalingCommitPlan {
  const context = createShapeScalingCommitContext({ event, group, scale, startSize, state })
  const allowedScale = resolveShapeScalingCommitScale({ canvas, context, event, group, state, text })
  const wrapPolicy = resolveShapeScalingTextWrapPolicy({
    isProportionalScaling: state?.isProportionalScaling,
    startTextSplitByGrapheme: state?.startTextSplitByGrapheme
  })
  const dimensions = resolveShapeScalingCommitDimensions({
    group,
    text,
    constraintPadding: context.constraintPadding,
    startDimensions: context.startDimensions,
    scaleX: allowedScale.scaleX,
    scaleY: allowedScale.scaleY,
    wrapPolicy
  })

  return {
    alignH: context.alignH,
    alignV: context.alignV,
    dimensions,
    startDimensions: context.startDimensions,
    wrapPolicy
  }
}
