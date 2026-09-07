import type {
  ActiveSelection,
  Transform
} from 'fabric'

import type {
  RectangularScaleGestureMode,
  RectangularScaleMultipliers
} from '../../snapping-manager/scaling/rectangular-scale-gesture-projection'
import type {
  ActiveSelectionScaleDomainChildMeasurement,
  ActiveSelectionScaleDomainMeasurement,
  ActiveSelectionScaleDomainSource,
  ActiveSelectionScaleFrame
} from '../../selection-manager/scaling/active-selection-scale-domain-source'
import type { ShapeGroup } from '../types'
import type ShapeActiveSelectionScalingController from './active-selection-scaling-controller'
import {
  captureShapeScalingGeometry,
  restoreShapeScalingSnapshots,
  type ShapeScalingGeometrySnapshot
} from './shape-scaling-geometry-snapshot'

/** Число измерений шейпов, сохраняемых между движениями одного жеста. */
const ACTIVE_SELECTION_SHAPE_DOMAIN_CACHE_SIZE = 48

/** Сессионный источник фактической геометрии шейпов для общего измерения смешанного состава. */
export default class ShapeActiveSelectionScaleDomainSource implements ActiveSelectionScaleDomainSource {
  /** Контроллер, который рассчитывает и применяет внутреннюю компоновку шейпов. */
  private readonly controller: ShapeActiveSelectionScalingController

  /** Исходное общее выделение текущего жеста. */
  private readonly selection: ActiveSelection

  /** Исходное преобразование Fabric текущего жеста. */
  private readonly transform: Transform

  /** Рассчитанные состояния, переиспользуемые уточнением одной и той же геометрии. */
  private readonly measurements = new Map<string, ActiveSelectionScaleDomainMeasurement>()

  /** Геометрия шейпов после последнего шага, подтверждённого общим владельцем. */
  private confirmedGeometry: readonly ShapeScalingGeometrySnapshot[]

  /** Измерение, которому соответствует подтверждённая внутренняя компоновка шейпов. */
  private confirmedMeasurement: ActiveSelectionScaleDomainMeasurement | null = null

  /** Шейпы, которыми владеет источник в исходном порядке выделения. */
  public readonly targets: readonly ShapeGroup[]

  /** Фиксирует неизменяемое начало доменной сессии до первой мутации Fabric. */
  constructor({
    controller,
    selection,
    targets,
    transform
  }: {
    controller: ShapeActiveSelectionScalingController
    selection: ActiveSelection
    targets: readonly ShapeGroup[]
    transform: Transform
  }) {
    if (targets.length === 0) throw new Error('Смешанный состав должен содержать хотя бы один шейп')

    this.controller = controller
    this.selection = selection
    this.targets = Object.freeze([...targets])
    this.transform = transform
    this.confirmedGeometry = this._captureGeometry()

    if (!controller.beginDomainScaling({ selection, transform })) {
      throw new Error('Поддерживаемые шейпы должны начать доменную сессию скейлинга')
    }
  }

  /** Возвращает закешированную фактическую геометрию для переданных множителей. */
  public measure({
    mode,
    multipliers
  }: {
    mode: RectangularScaleGestureMode
    multipliers: RectangularScaleMultipliers
  }): ActiveSelectionScaleDomainMeasurement {
    const key = `${mode}:${multipliers.x}:${multipliers.y}`
    const cached = this.measurements.get(key)
    if (cached) return cached

    const measurement = this.controller.measureDomainScale({
      mode,
      multipliers,
      selection: this.selection,
      transform: this.transform
    })
    this.measurements.set(key, measurement)
    if (this.measurements.size > ACTIVE_SELECTION_SHAPE_DOMAIN_CACHE_SIZE) {
      const oldestKey = this.measurements.keys().next().value
      if (typeof oldestKey !== 'string') throw new Error('Кеш измерений шейпов не должен быть пустым')
      this.measurements.delete(oldestKey)
    }

    return measurement
  }

  /** Атомарно применяет рассчитанную компоновку к живым шейпам и общей рамке. */
  public apply({
    children,
    frame,
    measurement
  }: {
    children: readonly ActiveSelectionScaleDomainChildMeasurement[]
    frame: ActiveSelectionScaleFrame
    measurement: ActiveSelectionScaleDomainMeasurement
  }): void {
    const previousGeometry = this._captureGeometry()

    try {
      this.controller.applyDomainScale({
        children,
        frame,
        measurement,
        selection: this.selection
      })
    } catch (error) {
      try {
        this._restoreState({ snapshots: previousGeometry })
      } catch {
        // Ошибка применения живого состояния остаётся основной после попытки полностью откатить изменения.
      }
      throw error
    }
  }

  /** Запоминает геометрию только после проверки общего применённого результата. */
  public confirmAppliedState({
    measurement
  }: {
    measurement: ActiveSelectionScaleDomainMeasurement
  }): void {
    const confirmedGeometry = this._captureGeometry()

    this.controller.confirmDomainScale({ measurement, selection: this.selection })
    this.confirmedGeometry = confirmedGeometry
    this.confirmedMeasurement = measurement
  }

  /** Возвращает шейпы и внутреннее состояние фиксации к последнему подтверждённому шагу. */
  public restoreConfirmedState(): void {
    this._restoreState({ snapshots: this.confirmedGeometry })
  }

  /** Сохраняет точную изменяемую геометрию всех шейпов текущей сессии. */
  private _captureGeometry(): readonly ShapeScalingGeometrySnapshot[] {
    return Object.freeze(this.targets.map((group) => captureShapeScalingGeometry({ group })))
  }

  /** Пытается восстановить геометрию и внутреннее состояние всех владельцев домена. */
  private _restoreState({
    snapshots
  }: {
    snapshots: readonly ShapeScalingGeometrySnapshot[]
  }): void {
    let didFail = false
    let firstFailure: unknown

    try {
      restoreShapeScalingSnapshots({ snapshots })
    } catch (error) {
      didFail = true
      firstFailure = error
    }

    try {
      this._restoreConfirmedControllerState()
    } catch (error) {
      if (!didFail) firstFailure = error
      didFail = true
    }

    if (didFail) throw firstFailure
  }

  /** Возвращает внутренние масштабы фиксации к подтверждённому измерению, если оно уже было. */
  private _restoreConfirmedControllerState(): void {
    if (!this.confirmedMeasurement) return

    this.controller.confirmDomainScale({
      measurement: this.confirmedMeasurement,
      selection: this.selection
    })
  }
}
