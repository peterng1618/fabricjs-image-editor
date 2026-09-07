import { SnapTargetResolver } from '../../../../../src/editor/snapping-manager/guides/snap-target-resolver'
import {
  createBoundsObject,
  createSnappingTestContext
} from '../../../../test-utils/canvas/geometry-objects'

describe('Выбор объектов для прилипания', () => {
  it('исключает активный объект и сохраняет исходный индекс цели без доступных границ', () => {
    const { canvas, objects } = createSnappingTestContext()
    const active = createBoundsObject({ id: 'active', left: 0, top: 0, width: 20, height: 20 })
    const first = createBoundsObject({ id: 'first', left: 30, top: 0, width: 20, height: 20 })
    const withoutBounds = createBoundsObject({ id: 'without-bounds', left: 60, top: 0, width: 20, height: 20 })
    const last = createBoundsObject({ id: 'last', left: 90, top: 0, width: 20, height: 20 })
    withoutBounds.getBoundingRect.mockImplementation(() => {
      throw new Error('Границы недоступны')
    })
    objects.push(active, first, withoutBounds, last)

    const targets = new SnapTargetResolver({ canvas }).resolve({ activeObject: active, mode: 'exact' })

    expect(targets.map(({ object }) => object.id)).toEqual(['first', 'last'])
    expect(targets.map(({ snapshotIndex }) => snapshotIndex)).toEqual([0, 2])
  })

  it('не возвращает скрытые и служебные объекты', () => {
    const { canvas, objects } = createSnappingTestContext()
    const visible = createBoundsObject({ id: 'visible', left: 0, top: 0, width: 20, height: 20 })
    const hidden = createBoundsObject({ id: 'hidden', left: 30, top: 0, width: 20, height: 20 })
    const background = createBoundsObject({ id: 'background', left: 60, top: 0, width: 20, height: 20 })
    hidden.visible = false
    objects.push(visible, hidden, background)

    const targets = new SnapTargetResolver({ canvas }).resolve({ mode: 'exact' })

    expect(targets).toHaveLength(1)
    expect(targets[0].object).toBe(visible)
  })

  it('не округляет границы источника активной crop-области', () => {
    const { canvas, objects } = createSnappingTestContext()
    const source = createBoundsObject({ id: 'source', left: 10.25, top: 20.5, width: 40.6, height: 30.4 })
    const regularActive = createBoundsObject({ id: 'active', left: 100, top: 100, width: 20, height: 20 })
    const cropFrame = createBoundsObject({ id: 'crop-frame', left: 100, top: 100, width: 20, height: 20 })
    cropFrame.cropSource = source
    objects.push(source)

    const resolver = new SnapTargetResolver({ canvas })
    const rounded = resolver.resolve({ activeObject: regularActive, mode: 'rounded' })[0].bounds
    const cropSource = resolver.resolve({ activeObject: cropFrame, mode: 'rounded' })[0].bounds
    const exact = resolver.resolve({ activeObject: regularActive, mode: 'exact' })[0].bounds

    expect(rounded.right - rounded.left).toBe(41)
    expect(cropSource.right - cropSource.left).toBeCloseTo(40.6, 10)
    expect(exact.right - exact.left).toBeCloseTo(40.6, 10)
  })
})
