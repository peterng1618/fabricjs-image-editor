import {
  ActiveSelection,
  type FabricObject,
  type TPointerEvent,
  type Transform
} from 'fabric/es'

import type { ImageEditor } from '../..'
import {
  type RectangularScaleGestureProjection,
  type RectangularScaleGestureTransform,
  type RectangularScalePoint
} from '../../snapping-manager/scaling/rectangular-scale-gesture-projection'
import type { ScaleSnappingRuntime } from '../../snapping-manager/scaling/scale-snapping-runtime'
import { isStandardRectangularScaleControl } from '../../snapping-manager/scaling/standard-scale-control'
import {
  captureActiveSelectionScaleProtectedState,
  isSupportedActiveSelectionScaleGeometry,
  resolveActiveSelectionScaleCompositionKind,
  type ActiveSelectionScaleComposition,
  type ActiveSelectionScaleProtectedState
} from './active-selection-scale-composition'
import type { ActiveSelectionScaleDomainSource } from './active-selection-scale-domain-source'

/** Данные Fabric-события, необходимые для скейлинга общего выделения. */
export type ActiveSelectionScaleInteractionEvent = Readonly<{
  target?: FabricObject | null
  e?: TPointerEvent | null
  transform?: Transform | null
  pointer?: RectangularScalePoint
  scenePoint?: RectangularScalePoint
}>

/** Проверенные данные поддерживаемого жеста общего выделения. */
type ActiveSelectionScaleGesture = Readonly<{
  compositionKind: ActiveSelectionScaleComposition['kind']
  projectionTransform: RectangularScaleGestureTransform
  target: ActiveSelection
  transform: Transform
}>

/** Текущий этап обработки одного жеста скейлинга общего выделения. */
type ActiveSelectionScaleSessionPhase = 'unified' | 'legacy-passthrough' | 'skew-passthrough'

/** Временное состояние одного жеста скейлинга общего выделения. */
export type ActiveSelectionScaleSession = {
  hasSkewStep: boolean
  hasVerifiedStep: boolean
  phase: ActiveSelectionScaleSessionPhase
  readonly projection: RectangularScaleGestureProjection
  readonly protectedState: ActiveSelectionScaleProtectedState
  readonly runtime: ScaleSnappingRuntime
  readonly target: ActiveSelection
  readonly transform: Transform
}

/** Очищает все частично начатые доменные сессии и общую сессию прилипания. */
function cancelTextDrivenScaleSessionStart({
  domainSource,
  editor,
  runtime,
  selection
}: {
  domainSource: ActiveSelectionScaleDomainSource | null
  editor: ImageEditor
  runtime: ScaleSnappingRuntime
  selection: ActiveSelection
}): void {
  try {
    editor.textManager.clearActiveSelectionScaling({ selection })
  } finally {
    try {
      if (domainSource) {
        editor.shapeManager.clearActiveSelectionScalePreviewState({
          children: domainSource.targets,
          selection
        })
      }
    } finally {
      runtime.finishSession()
    }
  }
}

/** Атомарно начинает текстовую и необязательную часть шейпов в общей сессии. */
function beginTextDrivenScaleSession({
  editor,
  gesture,
  projection,
  runtime
}: {
  editor: ImageEditor
  gesture: ActiveSelectionScaleGesture
  projection: RectangularScaleGestureProjection
  runtime: ScaleSnappingRuntime
}): void {
  if (gesture.compositionKind !== 'texts' && gesture.compositionKind !== 'mixed') return

  let domainSource: ActiveSelectionScaleDomainSource | null = null
  try {
    if (gesture.compositionKind === 'mixed') {
      domainSource = editor.shapeManager.createActiveSelectionScaleDomainSource({
        selection: gesture.target,
        transform: gesture.transform
      })
      if (!domainSource) throw new Error('Полный смешанный состав должен начать сессию ShapeManager')
    }

    const started = editor.textManager.beginActiveSelectionScaling({
      domainSource,
      projection,
      selection: gesture.target,
      transform: gesture.transform
    })
    if (!started) throw new Error('Поддерживаемое выделение с текстами должно начать сессию TextManager')
  } catch (error) {
    try {
      cancelTextDrivenScaleSessionStart({ domainSource, editor, runtime, selection: gesture.target })
    } catch {
      // Ошибка запуска остаётся основной после попытки очистить все частично начатые сессии.
    }
    throw error
  }
}

/** Создаёт сессию расчёта и возвращает null, если исходная проекция жеста недоступна. */
export function createActiveSelectionScaleSession({
  editor,
  gesture,
  pointerStart
}: {
  editor: ImageEditor
  gesture: ActiveSelectionScaleGesture
  pointerStart: RectangularScalePoint
}): ActiveSelectionScaleSession | null {
  const snappingSession = editor.snappingManager.startRectangularScaleSnappingSession({
    pointerStart,
    transform: gesture.projectionTransform
  })
  if (!snappingSession) return null

  const { projection, runtime } = snappingSession
  beginTextDrivenScaleSession({ editor, gesture, projection, runtime })

  return {
    hasSkewStep: false,
    hasVerifiedStep: false,
    phase: 'unified',
    projection,
    protectedState: captureActiveSelectionScaleProtectedState({
      compositionKind: gesture.compositionKind,
      target: gesture.target,
      transform: gesture.transform
    }),
    runtime,
    target: gesture.target,
    transform: gesture.transform
  }
}

/** Проверяет `mouse:down` и возвращает данные поддерживаемого общего выделения. */
export function resolveActiveSelectionScaleGesture({
  editor,
  event
}: {
  editor: ImageEditor
  event: ActiveSelectionScaleInteractionEvent
}): ActiveSelectionScaleGesture | null {
  const { target, transform } = event
  if (!(target instanceof ActiveSelection) || !transform) return null
  if (transform.target !== target || !isSupportedActiveSelectionScaleGeometry({ target })) return null

  const compositionKind = resolveActiveSelectionScaleCompositionKind({ editor, target })
  if (!compositionKind) return null
  if ((compositionKind === 'texts' || compositionKind === 'mixed')
    && (transform.corner === 'mt' || transform.corner === 'mb')) return null
  const shapeControlMode = compositionKind === 'shapes' || compositionKind === 'mixed'
    ? editor.shapeManager.resolveActiveSelectionScaleControlMode({
      selection: target,
      transform,
      event: event.e
    })
    : null
  const usesSupportedControl = isStandardRectangularScaleControl({ target, transform })
    || shapeControlMode !== null
  if (!usesSupportedControl) return null

  const originalScaleX = transform.original?.scaleX
  const originalScaleY = transform.original?.scaleY
  if (typeof originalScaleX !== 'number' || !Number.isFinite(originalScaleX) || originalScaleX <= 0) return null
  if (typeof originalScaleY !== 'number' || !Number.isFinite(originalScaleY) || originalScaleY <= 0) return null

  return Object.freeze({
    compositionKind,
    projectionTransform: Object.freeze({
      target,
      action: transform.action,
      corner: transform.corner,
      originX: transform.originX,
      originY: transform.originY,
      original: Object.freeze({ scaleX: originalScaleX, scaleY: originalScaleY })
    }),
    target,
    transform
  })
}

/** Проверяет принадлежность события исходному выделению и преобразованию Fabric. */
export function doesEventBelongToSession({
  event,
  session
}: {
  event: ActiveSelectionScaleInteractionEvent
  session: ActiveSelectionScaleSession
}): boolean {
  if (event.transform !== session.transform) return false
  if (event.target && event.target !== session.target) return false

  return true
}
