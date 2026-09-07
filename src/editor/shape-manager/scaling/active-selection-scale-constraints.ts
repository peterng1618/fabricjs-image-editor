import type {
  ShapeTransformOriginX
} from '../types'
import {
  resolveActiveSelectionOriginOffset,
  type ActiveSelectionLocalBounds,
  type ActiveSelectionVerticalAttachment
} from './active-selection-geometry'
import {
  SHAPE_SCALING_MIN_SIZE
} from './shape-scaling-layout'

/** Ограничения одного шейпа, влияющие на пропорциональный масштаб общей рамки. */
type ActiveSelectionShapeScaleConstraint = Readonly<{
  availableHeight: number
  availableWidth: number
  canScaleHeight: boolean
  canScaleWidth: boolean
  minimumHeight: number
  minimumWidth: number
}>

/** Стартовые размеры и разрешённые оси компоновки одного шейпа. */
type ActiveSelectionShapeScaleLimits = Readonly<{
  canScaleHeight: boolean
  canScaleWidth: boolean
  startHeight: number
  startWidth: number
}>

/** Возвращает доступную ширину общей рамки для конкретного шейпа. */
export function resolveSelectionAvailableWidth({
  originX,
  selectionBounds,
  shapeBounds
}: {
  originX: ShapeTransformOriginX
  selectionBounds: ActiveSelectionLocalBounds
  shapeBounds: ActiveSelectionLocalBounds
}): number {
  const originOffset = resolveActiveSelectionOriginOffset({ origin: originX })

  if (originOffset > 0) {
    return Math.max(SHAPE_SCALING_MIN_SIZE, shapeBounds.right - selectionBounds.left)
  }
  if (originOffset < 0) {
    return Math.max(SHAPE_SCALING_MIN_SIZE, selectionBounds.right - shapeBounds.left)
  }

  const shapeCenterX = (shapeBounds.left + shapeBounds.right) / 2

  return Math.max(
    SHAPE_SCALING_MIN_SIZE,
    2 * Math.min(
      shapeCenterX - selectionBounds.left,
      selectionBounds.right - shapeCenterX
    )
  )
}

/** Возвращает доступную высоту общей рамки для конкретного шейпа. */
export function resolveSelectionAvailableHeight({
  selectionBounds,
  shapeBounds,
  verticalAttachment
}: {
  selectionBounds: ActiveSelectionLocalBounds
  shapeBounds: ActiveSelectionLocalBounds
  verticalAttachment: ActiveSelectionVerticalAttachment
}): number {
  if (verticalAttachment === 'top') {
    return Math.max(SHAPE_SCALING_MIN_SIZE, selectionBounds.bottom - shapeBounds.top)
  }

  if (verticalAttachment === 'bottom') {
    return Math.max(SHAPE_SCALING_MIN_SIZE, shapeBounds.bottom - selectionBounds.top)
  }

  const shapeCenterY = (shapeBounds.top + shapeBounds.bottom) / 2

  return Math.max(
    SHAPE_SCALING_MIN_SIZE,
    2 * Math.min(
      shapeCenterY - selectionBounds.top,
      selectionBounds.bottom - shapeCenterY
    )
  )
}

/** Собирает ограничение одного шейпа в координатах общей рамки. */
export function resolveActiveSelectionShapeScaleConstraint({
  layoutMinimumScale,
  limits,
  selectionBounds,
  shapeBounds,
  transformOriginX,
  verticalAttachment
}: {
  layoutMinimumScale: number
  limits: ActiveSelectionShapeScaleLimits
  selectionBounds: ActiveSelectionLocalBounds
  shapeBounds: ActiveSelectionLocalBounds
  transformOriginX: ShapeTransformOriginX
  verticalAttachment: ActiveSelectionVerticalAttachment
}): ActiveSelectionShapeScaleConstraint {
  return {
    availableHeight: resolveSelectionAvailableHeight({
      selectionBounds,
      shapeBounds,
      verticalAttachment
    }),
    availableWidth: resolveSelectionAvailableWidth({
      originX: transformOriginX,
      selectionBounds,
      shapeBounds
    }),
    canScaleHeight: limits.canScaleHeight,
    canScaleWidth: limits.canScaleWidth,
    minimumHeight: limits.canScaleHeight
      ? Math.max(SHAPE_SCALING_MIN_SIZE, limits.startHeight * layoutMinimumScale)
      : limits.startHeight,
    minimumWidth: limits.canScaleWidth
      ? Math.max(SHAPE_SCALING_MIN_SIZE, limits.startWidth * layoutMinimumScale)
      : limits.startWidth
  }
}

/** Переводит минимальный размер шейпа в минимальный масштаб общей рамки. */
export function resolveMinimumSelectionScaleForSize({
  allowGrowth,
  minimumSize,
  startSize
}: {
  allowGrowth: boolean
  minimumSize: number
  startSize: number
}): number {
  const minimumScale = Math.max(
    SHAPE_SCALING_MIN_SIZE / startSize,
    minimumSize / startSize
  )

  if (allowGrowth) return minimumScale

  return Math.min(1, minimumScale)
}

/** Возвращает масштаб общей рамки, достаточный для ограничений всех шейпов. */
export function resolveProportionalSelectionScale({
  allowGrowthX,
  allowGrowthY,
  constraints,
  requestedScale
}: {
  allowGrowthX: boolean
  allowGrowthY: boolean
  constraints: readonly ActiveSelectionShapeScaleConstraint[]
  requestedScale: number
}): number {
  let appliedScale = requestedScale

  for (const constraint of constraints) {
    const minimumScaleX = constraint.canScaleWidth
      ? resolveMinimumSelectionScaleForSize({
        allowGrowth: allowGrowthX,
        minimumSize: constraint.minimumWidth,
        startSize: constraint.availableWidth
      })
      : requestedScale
    const minimumScaleY = constraint.canScaleHeight
      ? resolveMinimumSelectionScaleForSize({
        allowGrowth: allowGrowthY,
        minimumSize: constraint.minimumHeight,
        startSize: constraint.availableHeight
      })
      : requestedScale

    appliedScale = Math.max(appliedScale, minimumScaleX, minimumScaleY)
  }

  return appliedScale
}
