import {
  test,
  expect
} from '../../../fixtures/active-selection-scaling.fixture'
import {
  expectMixedSelectionScaleCommit,
  expectMixedSelectionScalePreview,
  expectMixedShapeTextNotDeformed
} from '../../../helpers/mixed-selection-scaling.helper'

test('при горизонтальном скейлинге изображение, шейп и текст меняют ширину без деформации', async({
  activeSelectionMixedScaleSetup: setup,
  selection
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const initial = await selection.getMixedCompositionSnapshot(snapshotParams)

  await selection.scaling.startFromControl({ control: 'mr' })
  await selection.scaling.dragControlBy({ deltaX: 70, deltaY: 0, pointerSteps: 2 })

  const live = await selection.getMixedCompositionSnapshot(snapshotParams)

  expect(live.selection.boundsWidth).toBeGreaterThan(initial.selection.boundsWidth)
  expect(live.selection.boundsLeft).toBeCloseTo(initial.selection.boundsLeft, 5)
  expectMixedSelectionScalePreview({ changesHeight: false, initial, live })

  await selection.scaling.finish()
  const final = await selection.getMixedCompositionSnapshot(snapshotParams)

  expectMixedSelectionScaleCommit({ final, live })
  const initialShape = initial.shapes[0]
  const finalShape = final.shapes[0]
  if (!initialShape || !finalShape) throw new Error('Состояние должно содержать шейп')

  expect(finalShape.snapshot.width).toBeGreaterThan(initialShape.snapshot.width)
})

test('свободный скейлинг за угол по-разному меняет оси без деформации объектов', async({
  activeSelectionMixedScaleSetup: setup,
  selection
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const initial = await selection.getMixedCompositionSnapshot(snapshotParams)
  const movingPoint = await selection.scaling.getControlScenePoint({ control: 'br' })

  await selection.scaling.startFromControl({ control: 'br' })
  await selection.scaling.dragControlToScenePoint({
    point: { x: movingPoint.x + 70, y: movingPoint.y + 25 },
    shiftKey: true
  })
  const live = await selection.getMixedCompositionSnapshot(snapshotParams)
  const initialImage = initial.images[0]
  const liveImage = live.images[0]
  const initialShape = initial.shapes[0]
  const liveShape = live.shapes[0]
  const initialText = initial.texts[0]
  const liveText = live.texts[0]
  if (!initialImage || !liveImage || !initialShape || !liveShape || !initialText || !liveText) {
    throw new Error('Полное состояние должно содержать изображение, шейп и отдельный текст')
  }

  const imageWidthMultiplier = liveImage.geometry.topEdgeLength / initialImage.geometry.topEdgeLength
  const imageHeightMultiplier = liveImage.geometry.leftEdgeLength / initialImage.geometry.leftEdgeLength
  const textWidthMultiplier = liveText.snapshot.width / initialText.snapshot.width
  const textFontMultiplier = liveText.snapshot.fontSize / initialText.snapshot.fontSize

  expect(imageWidthMultiplier).toBeGreaterThan(1)
  expect(imageHeightMultiplier).toBeGreaterThan(1)
  expect(imageWidthMultiplier).not.toBeCloseTo(imageHeightMultiplier, 2)
  expect(textWidthMultiplier).toBeGreaterThan(1)
  expect(textFontMultiplier).toBeGreaterThan(1)
  expect(textWidthMultiplier).not.toBeCloseTo(textFontMultiplier, 2)
  expect(liveImage.geometry.orthogonality).toBeCloseTo(0, 5)
  expectMixedShapeTextNotDeformed({ initial: initialShape, live: liveShape })

  await selection.scaling.finish()
  const final = await selection.getMixedCompositionSnapshot(snapshotParams)

  expectMixedSelectionScaleCommit({ final, live })
})

test('горизонтальный скейлинг относительно центра сохраняет центр и форму объектов', async({
  activeSelectionMixedScaleSetup: setup,
  selection
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const initial = await selection.getMixedCompositionSnapshot(snapshotParams)

  await selection.scaling.startFromControl({ centered: true, control: 'mr' })
  await selection.scaling.dragControlBy({ deltaX: 50, deltaY: 0, pointerSteps: 2 })
  const live = await selection.getMixedCompositionSnapshot(snapshotParams)

  expect(live.selection.centerX).toBeCloseTo(initial.selection.centerX, 5)
  expect(live.selection.centerY).toBeCloseTo(initial.selection.centerY, 5)
  expectMixedSelectionScalePreview({ changesHeight: false, initial, live })

  await selection.scaling.finish()
  const final = await selection.getMixedCompositionSnapshot(snapshotParams)

  expectMixedSelectionScaleCommit({ final, live })
})

test('скейлинг за угол относительно центра сохраняет центр и форму объектов', async({
  activeSelectionMixedScaleSetup: setup,
  selection
}) => {
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const initial = await selection.getMixedCompositionSnapshot(snapshotParams)

  await selection.scaling.startFromControl({ centered: true, control: 'br' })
  await selection.scaling.dragControlBy({ deltaX: 45, deltaY: 45, pointerSteps: 2 })
  const live = await selection.getMixedCompositionSnapshot(snapshotParams)

  expect(live.selection.centerX).toBeCloseTo(initial.selection.centerX, 5)
  expect(live.selection.centerY).toBeCloseTo(initial.selection.centerY, 5)
  expectMixedSelectionScalePreview({ changesHeight: true, initial, live })

  await selection.scaling.finish()
  const final = await selection.getMixedCompositionSnapshot(snapshotParams)

  expectMixedSelectionScaleCommit({ final, live })
})

test('повёрнутая рамка меняет ширину всех объектов без деформации', async({
  activeSelectionMixedScaleSetup: setup,
  selection
}) => {
  await selection.setAngle({ angle: 25 })
  const snapshotParams = {
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  }
  const initial = await selection.getMixedCompositionSnapshot(snapshotParams)

  await selection.scaling.startFromControl({ control: 'mr' })
  await selection.scaling.dragControlBy({ deltaX: 50, deltaY: 0, pointerSteps: 2 })
  const live = await selection.getMixedCompositionSnapshot(snapshotParams)
  const initialImage = initial.images[0]
  const liveImage = live.images[0]
  if (!initialImage || !liveImage) throw new Error('Полное состояние должно содержать изображение')

  expectMixedSelectionScalePreview({ changesHeight: false, initial, live })
  expect(liveImage.geometry.sceneAngle).toBeCloseTo(initialImage.geometry.sceneAngle, 5)

  await selection.scaling.finish()
  const final = await selection.getMixedCompositionSnapshot(snapshotParams)

  expectMixedSelectionScaleCommit({ final, live })
  expect(final.selection.angle).toBeCloseTo(initial.selection.angle, 5)
})
