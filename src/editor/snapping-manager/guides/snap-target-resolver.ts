import type { Canvas, FabricObject } from 'fabric/es'

import {
  getObjectBounds,
  getObjectExactBounds
} from '../../utils/geometry'
import {
  collectExcludedObjects,
  shouldIgnoreObject
} from '../../utils/object-filter'
import type { Bounds } from '../types'

/** Способ расчёта границ объектов, доступных для прилипания. */
export type SnapTargetBoundsMode = 'exact' | 'rounded'

/** Объект и его границы в одном снимке целей прилипания. */
export type ResolvedSnapTarget = Readonly<{
  bounds: Bounds
  object: FabricObject
  snapshotIndex: number
}>

/** Объект, который может быть источником активной crop-области. */
type CropFrameSnapTarget = FabricObject & {
  cropSource?: FabricObject | null
}

/** Выбирает объекты для прилипания и рассчитывает их границы в заданном режиме. */
export class SnapTargetResolver {
  /** Холст с объектами, доступными для текущего снимка. */
  private readonly canvas: Canvas

  /** Создаёт resolver целей прилипания для холста редактора. */
  constructor({ canvas }: { canvas: Canvas }) {
    this.canvas = canvas
  }

  /** Возвращает подходящие объекты и рассчитанные границы в порядке холста. */
  public resolve({
    activeObject,
    mode
  }: {
    activeObject?: FabricObject | null
    mode: SnapTargetBoundsMode
  }): ResolvedSnapTarget[] {
    const excluded = collectExcludedObjects({ activeObject })
    const objects: FabricObject[] = []
    const targets: ResolvedSnapTarget[] = []

    this.canvas.forEachObject((object) => {
      if (!shouldIgnoreObject({ object, excluded })) objects.push(object)
    })

    for (let snapshotIndex = 0; snapshotIndex < objects.length; snapshotIndex += 1) {
      const object = objects[snapshotIndex]
      const bounds = this._resolveBounds({ activeObject, mode, object })
      if (!bounds) continue

      targets.push({ bounds, object, snapshotIndex })
    }

    return targets
  }

  /** Рассчитывает границы одной цели с учётом источника активной crop-области. */
  private _resolveBounds({
    activeObject,
    mode,
    object
  }: {
    activeObject?: FabricObject | null
    mode: SnapTargetBoundsMode
    object: FabricObject
  }): Bounds | null {
    if (mode === 'exact') return getObjectExactBounds({ object })
    if (this._isActiveCropSource({ activeObject, object })) return getObjectExactBounds({ object })

    return getObjectBounds({ object })
  }

  /** Проверяет, является ли объект источником активной crop-области. */
  private _isActiveCropSource({
    activeObject,
    object
  }: {
    activeObject?: FabricObject | null
    object: FabricObject
  }): boolean {
    const cropTarget = activeObject as CropFrameSnapTarget | null | undefined

    return cropTarget?.cropSource === object
  }
}
