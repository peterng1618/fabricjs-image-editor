import {
  test,
  expect
} from '../../../fixtures/active-selection-scaling.fixture'
import { ACTIVE_SELECTION_TEXT_SCALE_CONTROL_CASES } from '../../../fixtures/data/active-selection-scaling.data'
import {
  expectMixedSelectionScaleCommit,
  expectMixedSelectionScalePreview
} from '../../../helpers/mixed-selection-scaling.helper'

test('у выделения из изображения, шейпа и текста доступны две боковые и четыре угловые ручки', async({
  activeSelectionMixedScaleSetup: setup,
  selection
}) => {
  const capability = await selection.scaling.getCapability()
  const expectedHandles = ACTIVE_SELECTION_TEXT_SCALE_CONTROL_CASES
    .map(({ control }) => control)
    .sort()

  expect(capability.targetType).toBe('activeselection')
  expect([...capability.childIds].sort()).toEqual([
    setup.imageId,
    setup.shapeId,
    setup.textId
  ].sort())
  expect([...capability.availableScaleHandles].sort()).toEqual(expectedHandles)
  expect(capability.availableScaleHandles).not.toContain('mt')
  expect(capability.availableScaleHandles).not.toContain('mb')
})

for (const controlCase of ACTIVE_SELECTION_TEXT_SCALE_CONTROL_CASES) {
  test(`в выделении из изображения, шейпа и текста ${controlCase.title} меняет объекты без деформации`, async({
    activeSelectionMixedScaleSetup: setup,
    editorModel,
    selection
  }) => {
    const snapshotParams = {
      imageIds: [setup.imageId],
      shapeIds: [setup.shapeId],
      textIds: [setup.textId]
    }
    const initial = await selection.getMixedCompositionSnapshot(snapshotParams)
    const { zoom } = await editorModel.getCanvasState()
    const scenePixel = 1 / zoom

    await selection.scaling.startFromControl({ control: controlCase.control })
    await selection.scaling.dragControlBy({
      deltaX: controlCase.outwardDeltaX,
      deltaY: controlCase.outwardDeltaY,
      pointerSteps: 2
    })
    const live = await selection.getMixedCompositionSnapshot(snapshotParams)

    await test.step('сохраняет неподвижные границы рамки', async() => {
      expect(live.selection.boundsWidth).toBeGreaterThan(initial.selection.boundsWidth)
      if (controlCase.fixedEdges.includes('left')) {
        expect(Math.abs(live.selection.boundsLeft - initial.selection.boundsLeft))
          .toBeLessThanOrEqual(scenePixel)
      }
      if (controlCase.fixedEdges.includes('right')) {
        expect(Math.abs(live.selection.boundsRight - initial.selection.boundsRight))
          .toBeLessThanOrEqual(scenePixel)
      }
      if (controlCase.fixedEdges.includes('top')) {
        expect(Math.abs(live.selection.boundsTop - initial.selection.boundsTop))
          .toBeLessThanOrEqual(scenePixel)
      }
      if (controlCase.fixedEdges.includes('bottom')) {
        expect(Math.abs(live.selection.boundsBottom - initial.selection.boundsBottom))
          .toBeLessThanOrEqual(scenePixel)
      }
    })

    await test.step('меняет все объекты без искажений', async() => {
      expectMixedSelectionScalePreview({ changesHeight: controlCase.changesHeight, initial, live })
    })

    await selection.scaling.finish()
    const final = await selection.getMixedCompositionSnapshot(snapshotParams)

    await test.step('не меняет последнее состояние после mouseup', async() => {
      expectMixedSelectionScaleCommit({ final, live })
    })
  })
}
