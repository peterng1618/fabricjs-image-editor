import {
  test,
  expect
} from '../../../fixtures/active-selection-scaling.fixture'
import { expectMixedSelectionScaleHold } from '../../../helpers/mixed-selection-scaling.helper'

test('после минимальной ширины снова увеличивает все объекты и прилипает в той же сессии', async({
  activeSelectionMixedScaleSetup: setup,
  selection,
  snapping
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const fixedPoint = await selection.scaling.getControlScenePoint({ control: 'ml' })

  await selection.scaling.startFromControl({ control: 'mr' })
  await selection.scaling.dragControlToScenePoint({ point: fixedPoint })
  const minimum = await selection.getMixedCompositionSnapshot(snapshotParams)

  await selection.scaling.dragControlToScenePoint({
    point: { x: fixedPoint.x - (20 * setup.scenePixel), y: fixedPoint.y }
  })
  const heldAtMinimum = await selection.getMixedCompositionSnapshot(snapshotParams)

  expectMixedSelectionScaleHold({ acquired: minimum, held: heldAtMinimum })

  await selection.scaling.dragControlToScenePoint({
    point: { x: setup.montage.right, y: fixedPoint.y }
  })
  const reacquired = await selection.getMixedCompositionSnapshot(snapshotParams)
  const guides = await snapping.getGuideState()

  expect(reacquired.selection.boundsRight).toBeCloseTo(setup.montage.right, 5)
  expect(reacquired.selection.boundsWidth).toBeGreaterThan(minimum.selection.boundsWidth)
  expect(reacquired.images[0]?.geometry.topEdgeLength)
    .toBeGreaterThan(minimum.images[0]?.geometry.topEdgeLength ?? Number.POSITIVE_INFINITY)
  expect(reacquired.shapes[0]?.geometry.topEdgeLength)
    .toBeGreaterThan(minimum.shapes[0]?.geometry.topEdgeLength ?? Number.POSITIVE_INFINITY)
  expect(reacquired.texts[0]?.snapshot.width)
    .toBeGreaterThan(minimum.texts[0]?.snapshot.width ?? Number.POSITIVE_INFINITY)
  expect(guides.guides).toEqual([{ type: 'vertical', position: setup.montage.right }])
  expect(guides.spacingGuides).toHaveLength(0)

  await selection.scaling.finish()
})

test('после минимального размера снова увеличивает все объекты за угол и прилипает', async({
  activeSelectionMixedScaleSetup: setup,
  selection,
  snapping
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const fixedPoint = await selection.scaling.getControlScenePoint({ control: 'tl' })
  const movingPoint = await selection.scaling.getControlScenePoint({ control: 'br' })

  await selection.scaling.startFromControl({ control: 'br' })
  await selection.scaling.dragControlToScenePoint({ point: fixedPoint })
  const minimum = await selection.getMixedCompositionSnapshot(snapshotParams)

  await selection.scaling.dragControlToScenePoint({
    point: {
      x: fixedPoint.x - (20 * setup.scenePixel),
      y: fixedPoint.y - (20 * setup.scenePixel)
    }
  })
  const heldAtMinimum = await selection.getMixedCompositionSnapshot(snapshotParams)

  expectMixedSelectionScaleHold({ acquired: minimum, held: heldAtMinimum })

  const multiplier = (setup.montage.right - fixedPoint.x) / (movingPoint.x - fixedPoint.x)
  if (!Number.isFinite(multiplier) || multiplier <= 1) {
    throw new Error('Точка повторного прилипания должна увеличивать выделение')
  }
  await selection.scaling.dragControlToScenePoint({
    point: {
      x: fixedPoint.x + ((movingPoint.x - fixedPoint.x) * multiplier),
      y: fixedPoint.y + ((movingPoint.y - fixedPoint.y) * multiplier)
    }
  })
  const reacquired = await selection.getMixedCompositionSnapshot(snapshotParams)
  const guides = await snapping.getGuideState()

  expect(reacquired.selection.boundsRight).toBeCloseTo(setup.montage.right, 5)
  expect(reacquired.selection.boundsWidth).toBeGreaterThan(minimum.selection.boundsWidth)
  expect(reacquired.selection.boundsHeight).toBeGreaterThan(minimum.selection.boundsHeight)
  expect(reacquired.images[0]?.geometry.topEdgeLength)
    .toBeGreaterThan(minimum.images[0]?.geometry.topEdgeLength ?? Number.POSITIVE_INFINITY)
  expect(reacquired.shapes[0]?.geometry.topEdgeLength)
    .toBeGreaterThan(minimum.shapes[0]?.geometry.topEdgeLength ?? Number.POSITIVE_INFINITY)
  expect(reacquired.texts[0]?.snapshot.fontSize)
    .toBeGreaterThan(minimum.texts[0]?.snapshot.fontSize ?? Number.POSITIVE_INFINITY)
  expect(guides.guides).toEqual([{ type: 'vertical', position: setup.montage.right }])
  expect(guides.spacingGuides).toHaveLength(0)

  await selection.scaling.finish()
})
