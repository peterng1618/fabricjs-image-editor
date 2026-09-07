import { getRequiredCanvasHandler } from '../../../test-utils/canvas/handlers'
import { createMixedSelectionShapeEventRoutingHarness } from '../../../test-utils/shape/mixed-selection-event-routing'

afterEach(jest.restoreAllMocks)

it('не фиксирует шейп отдельно до общей фиксации смешанного выделения', () => {
  const harness = createMixedSelectionShapeEventRoutingHarness()

  try {
    getRequiredCanvasHandler({
      canvas: harness.routing.canvas,
      eventName: 'object:modified'
    })(harness.event)

    expect(harness.routing.shouldSkipShapeSelectionScaleCommitMock).toHaveBeenCalledWith({
      selection: harness.selection
    })
    expect(harness.routing.commitShapeSelectionScaleMock).not.toHaveBeenCalled()
    expect(harness.routing.scalingController.commitActiveSelectionGroupScaling).not.toHaveBeenCalled()
    expect(harness.routing.scalingController.handleObjectModified).not.toHaveBeenCalled()
    expect(harness.routing.scalingController.clearActiveSelectionState).not.toHaveBeenCalled()
    expect(harness.routing.lifecycleController.finishResize).not.toHaveBeenCalled()
  } finally {
    harness.routing.controller.destroy()
  }
})
