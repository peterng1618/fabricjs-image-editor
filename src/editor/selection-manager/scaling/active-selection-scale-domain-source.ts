import type { FabricObject } from 'fabric/es'

import type {
  RectangularScaleGestureMode,
  RectangularScaleMultipliers,
  RectangularScalePoint
} from '../../snapping-manager/scaling/rectangular-scale-gesture-projection'
import type { ObjectBounds } from '../../utils/geometry'

/** Фактическая геометрия одного ребёнка, рассчитанная его доменным менеджером. */
export type ActiveSelectionScaleDomainChildMeasurement = Readonly<{
  bounds: ObjectBounds
  center: RectangularScalePoint
  target: FabricObject
}>

/** Геометрия доменных объектов после применения допустимых канонических множителей. */
export type ActiveSelectionScaleDomainMeasurement = Readonly<{
  children: readonly ActiveSelectionScaleDomainChildMeasurement[]
  multipliers: RectangularScaleMultipliers
}>

/** Итоговая временная рамка с компенсацией геометрии доменных объектов во время скейлинга. */
export type ActiveSelectionScaleFrame = Readonly<{
  center: RectangularScalePoint
  height: number
  scaleX: number
  scaleY: number
  width: number
}>

/**
 * Источник нелинейной геометрии доменных объектов внутри общего выделения.
 * Расчёт выполняется до изменения живых объектов, применение — один раз по готовой общей рамке.
 */
export type ActiveSelectionScaleDomainSource = Readonly<{
  /** Атомарно применяет измерение или сохраняет прежнюю геометрию всех доменных объектов. */
  apply({
    children,
    frame,
    measurement
  }: {
    children: readonly ActiveSelectionScaleDomainChildMeasurement[]
    frame: ActiveSelectionScaleFrame
    measurement: ActiveSelectionScaleDomainMeasurement
  }): void
  /** Запоминает применённое измерение только после общей проверки результата. */
  confirmAppliedState({
    measurement
  }: {
    measurement: ActiveSelectionScaleDomainMeasurement
  }): void
  /** Рассчитывает достижимую геометрию без изменения живых объектов. */
  measure({
    mode,
    multipliers
  }: {
    mode: RectangularScaleGestureMode
    multipliers: RectangularScaleMultipliers
  }): ActiveSelectionScaleDomainMeasurement
  /** Синхронно возвращает доменные объекты к последнему подтверждённому состоянию. */
  restoreConfirmedState(): void
  /** Содержит доменные объекты в неизменяемом порядке текущей сессии. */
  targets: readonly FabricObject[]
}>
