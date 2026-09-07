import {
  test,
  expect
} from '../../../fixtures/active-selection-scaling.fixture'
import { expectMixedSelectionScaleHold } from '../../../helpers/mixed-selection-scaling.helper'

test('при микродвижениях у вертикального гайда не меняет изображение, шейп и текст', async({
  activeSelectionMixedScaleSetup: setup,
  editorModel,
  selection,
  snapping
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const movingPoint = await selection.scaling.getControlScenePoint({ control: 'mr' })

  await selection.scaling.startFromControl({ control: 'mr' })
  await selection.scaling.dragControlToScenePoint({
    point: { x: setup.montage.right, y: movingPoint.y }
  })

  const acquired = await selection.getMixedCompositionSnapshot(snapshotParams)
  const acquiredIndicator = await editorModel.requireObjectSizeIndicator()

  expect(acquired.selection.boundsRight).toBeCloseTo(setup.montage.right, 5)
  expect((await snapping.getGuideState()).guides).toEqual([{
    type: 'vertical',
    position: setup.montage.right
  }])

  for (const offset of [-3, -1, 1, 3]) {
    await selection.scaling.dragControlToScenePoint({
      point: { x: setup.montage.right + (offset * setup.scenePixel), y: movingPoint.y }
    })
    const held = await selection.getMixedCompositionSnapshot(snapshotParams)

    expectMixedSelectionScaleHold({ acquired, held })
    expect(await editorModel.requireObjectSizeIndicator()).toEqual(acquiredIndicator)
    expect((await snapping.getGuideState()).guides).toEqual([{
      type: 'vertical',
      position: setup.montage.right
    }])
  }

  const committed = await selection.scaling.finish()

  expect(committed.boundsLeft).toBeCloseTo(acquired.selection.boundsLeft, 5)
  expect(committed.boundsRight).toBeCloseTo(acquired.selection.boundsRight, 5)
})

test('при микродвижениях у горизонтального гайда сохраняет размер всех объектов', async({
  activeSelectionMixedScaleSetup: setup,
  editorModel,
  selection,
  snapping
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const guidePosition = setup.montage.top
  const path = await selection.scaling.createTopRightProportionalPath({
    topPositions: [0, -3, -1, 1, 3].map((offset) => guidePosition + (offset * setup.scenePixel))
  })
  const acquiredPoint = path[0]
  if (!acquiredPoint) throw new Error('Путь должен содержать точку прилипания')

  await selection.scaling.startFromControl({ control: 'tr' })
  await selection.scaling.dragControlToScenePoint({ point: acquiredPoint })

  const acquired = await selection.getMixedCompositionSnapshot(snapshotParams)
  const acquiredIndicator = await editorModel.requireObjectSizeIndicator()

  expect(acquired.selection.boundsTop).toBeCloseTo(guidePosition, 5)
  expect((await snapping.getGuideState()).guides).toEqual([{
    type: 'horizontal',
    position: guidePosition
  }])

  for (const point of path.slice(1)) {
    await selection.scaling.dragControlToScenePoint({ point })
    const held = await selection.getMixedCompositionSnapshot(snapshotParams)

    expectMixedSelectionScaleHold({ acquired, held })
    expect(await editorModel.requireObjectSizeIndicator()).toEqual(acquiredIndicator)
    expect((await snapping.getGuideState()).guides).toEqual([{
      type: 'horizontal',
      position: guidePosition
    }])
  }

  const committed = await selection.scaling.finish()

  expect(committed.boundsTop).toBeCloseTo(acquired.selection.boundsTop, 5)
  expect(committed.boundsBottom).toBeCloseTo(acquired.selection.boundsBottom, 5)
})

test('после выхода из зоны удержания отпускает вертикальный гайд и продолжает менять ширину', async({
  activeSelectionMixedScaleSetup: setup,
  selection,
  snapping
}) => {
  const movingPoint = await selection.scaling.getControlScenePoint({ control: 'mr' })

  await selection.scaling.startFromControl({ control: 'mr' })
  const acquired = await selection.scaling.dragControlToScenePoint({
    point: { x: setup.montage.right, y: movingPoint.y }
  })

  expect(acquired.boundsRight).toBeCloseTo(setup.montage.right, 5)
  expect((await snapping.getGuideState()).guides).toHaveLength(1)

  const released = await selection.scaling.dragControlToScenePoint({
    point: {
      x: setup.montage.right + (30 * setup.scenePixel),
      y: movingPoint.y
    }
  })
  const guideState = await snapping.getGuideState()

  expect(Math.abs(released.boundsRight - acquired.boundsRight)).toBeGreaterThan(20 * setup.scenePixel)
  expect(released.boundsLeft).toBeCloseTo(setup.initial.selection.boundsLeft, 5)
  expect(guideState.guides).toHaveLength(0)
  expect(guideState.spacingGuides).toHaveLength(0)

  await selection.scaling.finish()
})

test('при свободном скейлинге отпускает вертикальный гайд независимо от горизонтального', async({
  activeSelectionMixedScaleSetup: setup,
  selection,
  snapping
}) => {
  await selection.scaling.startFromControl({ control: 'br' })
  const acquired = await selection.scaling.dragControlToScenePoint({
    point: { x: setup.montage.right, y: setup.montage.bottom },
    shiftKey: true
  })

  expect(acquired.boundsRight).toBeCloseTo(setup.montage.right, 5)
  expect(acquired.boundsBottom).toBeCloseTo(setup.montage.bottom, 5)

  const released = await selection.scaling.dragControlToScenePoint({
    point: {
      x: setup.montage.right + (30 * setup.scenePixel),
      y: setup.montage.bottom + (2 * setup.scenePixel)
    },
    shiftKey: true
  })
  const guideState = await snapping.getGuideState()

  expect(Math.abs(released.boundsRight - acquired.boundsRight)).toBeGreaterThan(20 * setup.scenePixel)
  expect(released.boundsBottom).toBeCloseTo(setup.montage.bottom, 5)
  expect(guideState.guides).toEqual([{
    type: 'horizontal',
    position: setup.montage.bottom
  }])
  expect(guideState.spacingGuides).toHaveLength(0)

  await selection.scaling.finish()
})

test('Ctrl временно отключает прилипание полного смешанного выделения в текущей сессии', async({
  activeSelectionMixedScaleSetup: setup,
  selection,
  snapping
}) => {
  const movingPoint = await selection.scaling.getControlScenePoint({ control: 'mr' })

  await selection.scaling.startFromControl({ control: 'mr' })
  const acquired = await selection.scaling.dragControlToScenePoint({
    point: { x: setup.montage.right + setup.scenePixel, y: movingPoint.y }
  })
  const acquiredGuides = await snapping.getGuideState()

  expect(acquired.boundsRight).toBeCloseTo(setup.montage.right, 5)
  expect(acquiredGuides.guides).toEqual([{
    type: 'vertical',
    position: setup.montage.right
  }])

  const withoutSnap = await selection.scaling.dragControlToScenePoint({
    ctrlKey: true,
    point: { x: setup.montage.right - (2 * setup.scenePixel), y: movingPoint.y }
  })
  const disabledGuides = await snapping.getGuideState()

  expect(withoutSnap.boundsRight).not.toBeCloseTo(setup.montage.right, 5)
  expect(disabledGuides.guides).toHaveLength(0)
  expect(disabledGuides.spacingGuides).toHaveLength(0)

  const reacquired = await selection.scaling.dragControlToScenePoint({
    point: { x: setup.montage.right - setup.scenePixel, y: movingPoint.y }
  })
  const reacquiredGuides = await snapping.getGuideState()

  expect(reacquired.boundsRight).toBeCloseTo(setup.montage.right, 5)
  expect(reacquiredGuides.guides).toEqual([{
    type: 'vertical',
    position: setup.montage.right
  }])
  expect(reacquiredGuides.spacingGuides).toHaveLength(0)

  await selection.scaling.finish()
})
