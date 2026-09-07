import {
  createActiveSelectionScaleMouseMoveEvent,
  createActiveSelectionScaleStartEvent
} from '../../../../test-utils/selection/active-selection-scale-interaction'
import {
  captureMixedSelectionTransactionState,
  createMixedActiveSelectionScaleHarness,
  createUnknownActiveSelectionScaleHarness,
  installMixedSelectionTextScalingController
} from '../../../../test-utils/selection/mixed-active-selection-scale-interaction'
import { ScaleSnappingRuntime } from '../../../../../src/editor/snapping-manager/scaling/scale-snapping-runtime'

afterEach(jest.restoreAllMocks)

it('начинает общую сессию для изображения, шейпа и отдельных текстов', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(harness.createDomainSourceMock).toHaveBeenCalledWith({
    selection: interaction.target,
    transform: interaction.transform
  })
  expect(interaction.beginTextSelectionScalingMock).toHaveBeenCalledWith({
    domainSource: harness.domain.domainSource,
    projection: interaction.projection,
    selection: interaction.target,
    transform: interaction.transform
  })
  expect(interaction.captureEnvironmentMock).toHaveBeenCalledTimes(1)
})

it('при ошибке запуска шейпов не оставляет частично начатую общую сессию', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  harness.createDomainSourceMock.mockImplementationOnce(() => {
    throw new Error('Ошибка запуска шейпов')
  })

  expect(() => interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toThrow('Ошибка запуска шейпов')
  expect(interaction.beginTextSelectionScalingMock).not.toHaveBeenCalled()
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledWith({ selection: interaction.target })
  expect(interaction.clearShapeSelectionPreviewStateMock).not.toHaveBeenCalled()
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при ошибке запуска текстов очищает уже начатую сессию шейпов', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  interaction.beginTextSelectionScalingMock.mockImplementationOnce(() => {
    throw new Error('Ошибка запуска текстов')
  })
  interaction.clearTextSelectionScalingMock.mockImplementationOnce(() => {
    throw new Error('Ошибка очистки текстовой сессии')
  })

  expect(() => interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toThrow('Ошибка запуска текстов')
  expect(harness.createDomainSourceMock).toHaveBeenCalledTimes(1)
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledWith({ selection: interaction.target })
  expect(interaction.clearShapeSelectionPreviewStateMock).toHaveBeenCalledWith({
    children: [harness.shape],
    selection: interaction.target
  })
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('оставляет выделение с неизвестным объектом на прежнем пути скейлинга', () => {
  const harness = createUnknownActiveSelectionScaleHarness()
  const { interaction } = harness

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(false)
  expect(interaction.target.getObjects()).toContain(harness.unknownObject)
  expect(harness.createDomainSourceMock).not.toHaveBeenCalled()
  expect(interaction.beginTextSelectionScalingMock).not.toHaveBeenCalled()
  expect(interaction.captureEnvironmentMock).not.toHaveBeenCalled()
})

it('обрабатывает ранний шаг шейпа и не применяет его повторно', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const marker = new MouseEvent('pointermove')

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)

  interaction.applyFabricPreview({ x: 1.15, y: 1 })
  const event = createActiveSelectionScaleMouseMoveEvent({
    harness: interaction,
    marker,
    multipliers: { x: 1.15, y: 1 }
  })

  expect(interaction.controller.handleShapeSelectionScaleStep({
    event,
    intentSource: 'fabric-preview'
  })).toBe(true)
  expect(interaction.controller.handleObjectScaling({ event })).toBe(true)
  expect(interaction.measureTextSelectionScaleMock).toHaveBeenCalledTimes(1)
  expect(harness.domain.measureDomainGeometryMock).toHaveBeenCalledTimes(1)
  expect(interaction.applyTextSelectionPreviewMock).toHaveBeenCalledTimes(1)
  expect(harness.domain.applyDomainMeasurementMock).toHaveBeenCalledTimes(1)
  expect(interaction.confirmTextSelectionScalePreviewMock).toHaveBeenCalledTimes(1)
  expect(interaction.applyShapeSelectionPreviewMock).not.toHaveBeenCalled()
  expect(interaction.publishGuidesMock).toHaveBeenCalledTimes(1)
})

it('рассчитывает итоговые размеры всех объектов до их применения', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.2, y: 1 }
    })
  })).toBe(true)

  const textMeasureOrder = interaction.measureTextSelectionScaleMock.mock.invocationCallOrder[0]
  const domainMeasureOrder = harness.domain.measureDomainGeometryMock.mock.invocationCallOrder[0]
  const textApplyOrder = interaction.applyTextSelectionPreviewMock.mock.invocationCallOrder[0]
  const domainApplyOrder = harness.domain.applyDomainMeasurementMock.mock.invocationCallOrder[0]

  expect(textMeasureOrder).toBeLessThan(domainMeasureOrder)
  expect(domainMeasureOrder).toBeLessThan(textApplyOrder)
  expect(textApplyOrder).toBeLessThan(domainApplyOrder)
  expect(interaction.applyTextSelectionPreviewMock).toHaveBeenCalledTimes(1)
  expect(harness.domain.applyDomainMeasurementMock).toHaveBeenCalledTimes(1)
})

it('при нескольких движениях за угол сохраняет свободный скейлинг после изменения шейпа', () => {
  const harness = createMixedActiveSelectionScaleHarness({
    controlKey: 'br',
    uniformScaling: false
  })
  const { interaction, shape } = harness

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)

  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove', { shiftKey: true }),
      multipliers: { x: 1.2, y: 1.1 }
    })
  })).toBe(true)
  shape.set({ scaleX: 0.9, scaleY: 1.05 })
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove', { shiftKey: true }),
      multipliers: { x: 1.3, y: 1.15 }
    })
  })).toBe(true)

  const measuredModes = interaction.measureTextSelectionScaleMock.mock.calls.map(([params]) => params.mode)

  expect(measuredModes).toEqual(['free', 'free'])
  expect(interaction.applyTextSelectionPreviewMock).toHaveBeenCalledTimes(2)
})

it('один раз снимает рамку, фиксирует шейп и тексты и восстанавливает выделение', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.15, y: 1 }
    })
  })).toBe(true)
  expect(interaction.controller.shouldSkipShapeSelectionCommit({
    selection: interaction.target
  })).toBe(true)

  const discardActiveObjectMock = jest.spyOn(interaction.editor.canvas, 'discardActiveObject')
  const setActiveObjectMock = jest.spyOn(interaction.editor.canvas, 'setActiveObject')
  discardActiveObjectMock.mockClear()
  setActiveObjectMock.mockClear()

  expect(interaction.controller.commitTextDrivenSelectionScale({
    selection: interaction.target,
    transform: interaction.transform
  })).toBe(true)
  expect(harness.commitTextChildrenMock).toHaveBeenCalledWith({ selection: interaction.target })
  expect(harness.prepareShapeCommitMock).toHaveBeenCalledWith({
    children: [harness.shape],
    selection: interaction.target,
    transform: interaction.transform
  })
  expect(harness.finishShapeCommitMock).toHaveBeenCalledWith({
    commit: harness.preparedShapeCommit
  })
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledWith({
    selection: interaction.target
  })
  expect(discardActiveObjectMock).toHaveBeenCalledTimes(1)
  expect(setActiveObjectMock).toHaveBeenCalledTimes(1)
  expect(harness.prepareShapeCommitMock.mock.invocationCallOrder[0])
    .toBeLessThan(setActiveObjectMock.mock.invocationCallOrder[0])
  expect(setActiveObjectMock.mock.invocationCallOrder[0])
    .toBeLessThan(harness.finishShapeCommitMock.mock.invocationCallOrder[0])
  expect(harness.finishShapeCommitMock.mock.invocationCallOrder[0])
    .toBeLessThan(interaction.clearTextSelectionScalingMock.mock.invocationCallOrder[0])
  expect(interaction.editor.canvas.getActiveObject()).not.toBe(interaction.target)
  expect(interaction.controller.shouldSkipShapeSelectionCommit({
    selection: interaction.target
  })).toBe(true)
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('после восстановления новой рамки сообщает об ошибке завершения без отката геометрии', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const emitErrorMock = jest.spyOn(interaction.editor.errorManager, 'emitError').mockImplementation()
  harness.finishShapeCommitMock.mockImplementationOnce(() => {
    throw new Error('Ошибка завершающего события шейпа')
  })

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.commitTextDrivenSelectionScale({
    selection: interaction.target,
    transform: interaction.transform
  })).toBe(true)

  expect(interaction.editor.canvas.getActiveObject()).not.toBe(interaction.target)
  expect(interaction.clearShapeSelectionPreviewStateMock).not.toHaveBeenCalled()
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledWith({
    selection: interaction.target
  })
  expect(emitErrorMock).toHaveBeenCalledWith(expect.objectContaining({
    code: 'SELECTION_SCALE_COMMIT_FINALIZATION_FAILED',
    origin: 'SelectionManager'
  }))
  expect(interaction.controller.shouldSkipShapeSelectionCommit({
    selection: interaction.target
  })).toBe(true)
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при ошибке фиксации текста восстанавливает рамку и очищает оба домена', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const setActiveObjectMock = jest.spyOn(interaction.editor.canvas, 'setActiveObject')
  interaction.restoreTextSelectionScalePreviewMock.mockReturnValue(true)
  harness.commitTextChildrenMock.mockImplementationOnce(() => {
    throw new Error('Ошибка фиксации текста')
  })

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  setActiveObjectMock.mockClear()
  jest.spyOn(interaction.children[0], 'setCoords').mockImplementationOnce(() => {
    throw new Error('Ошибка обновления координат текста')
  })
  interaction.publishGuidesMock.mockImplementationOnce(() => {
    throw new Error('Ошибка очистки направляющих')
  })

  expect(() => interaction.controller.commitTextDrivenSelectionScale({
    selection: interaction.target,
    transform: interaction.transform
  })).toThrow('Ошибка фиксации текста')
  expect(harness.prepareShapeCommitMock).not.toHaveBeenCalled()
  expect(harness.finishShapeCommitMock).not.toHaveBeenCalled()
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledWith({ selection: interaction.target })
  expect(interaction.clearShapeSelectionPreviewStateMock).toHaveBeenCalledWith({
    children: [harness.shape],
    selection: interaction.target
  })
  expect(setActiveObjectMock).toHaveBeenCalledTimes(1)
  expect(interaction.editor.canvas.getActiveObject()).toBe(interaction.target)
  expect(interaction.target.getObjects()).toEqual([harness.image, harness.shape, ...interaction.children])
  expect(interaction.target.getObjects().every((child) => child.group === interaction.target)).toBe(true)
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при ошибке фиксации шейпа восстанавливает рамку и очищает оба домена', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const endActionMock = jest.spyOn(interaction.editor.historyManager, 'endAction')
  const setActiveObjectMock = jest.spyOn(interaction.editor.canvas, 'setActiveObject')
  interaction.restoreTextSelectionScalePreviewMock.mockReturnValue(true)
  harness.prepareShapeCommitMock.mockImplementationOnce(() => {
    throw new Error('Ошибка фиксации шейпа')
  })

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  Reflect.set(interaction.editor.canvas, '_currentTransform', interaction.transform)
  interaction.target.isMoving = true
  setActiveObjectMock.mockClear()
  expect(() => interaction.controller.commitTextDrivenSelectionScale({
    selection: interaction.target,
    transform: interaction.transform
  })).toThrow('Ошибка фиксации шейпа')
  expect(harness.commitTextChildrenMock).toHaveBeenCalledTimes(1)
  expect(harness.prepareShapeCommitMock).toHaveBeenCalledTimes(1)
  expect(harness.finishShapeCommitMock).not.toHaveBeenCalled()
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledWith({ selection: interaction.target })
  expect(interaction.clearShapeSelectionPreviewStateMock).toHaveBeenCalledWith({
    children: [harness.shape],
    selection: interaction.target
  })
  expect(setActiveObjectMock).toHaveBeenCalledTimes(1)
  expect(interaction.editor.canvas.getActiveObject()).toBe(interaction.target)
  expect(interaction.target.getObjects()).toEqual([harness.image, harness.shape, ...interaction.children])
  expect(interaction.target.getObjects().every((child) => child.group === interaction.target)).toBe(true)
  expect(Reflect.get(interaction.editor.canvas, '_currentTransform')).toBeNull()
  expect(interaction.target.isMoving).toBe(false)
  expect(endActionMock).toHaveBeenCalledWith({ reason: 'object-transform' })
  expect(interaction.controller.shouldSkipShapeSelectionCommit({
    selection: interaction.target
  })).toBe(false)
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при частичной фиксации возвращает все объекты к последнему подтверждённому состоянию', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  installMixedSelectionTextScalingController({ harness })

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.15, y: 1 }
    })
  })).toBe(true)
  const confirmed = captureMixedSelectionTransactionState({ harness })

  harness.prepareShapeCommitMock.mockImplementationOnce(() => {
    harness.shape.set({ left: 999, scaleX: 2, width: 333 })
    throw new Error('Ошибка подготовки шейпа')
  })

  expect(() => interaction.controller.commitTextDrivenSelectionScale({
    selection: interaction.target,
    transform: interaction.transform
  })).toThrow('Ошибка подготовки шейпа')
  const restored = captureMixedSelectionTransactionState({ harness })

  expect(restored).toEqual(confirmed)
  expect(interaction.editor.canvas.getActiveObject()).toBe(interaction.target)
  expect(interaction.target.getObjects()).toEqual([harness.image, harness.shape, ...interaction.children])
  expect(interaction.target.getObjects().every((child) => child.group === interaction.target)).toBe(true)
  expect(harness.domain.restoreConfirmedDomainMock).toHaveBeenCalledTimes(1)
  expect(harness.finishShapeCommitMock).not.toHaveBeenCalled()
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при ошибке восстановления новой рамки возвращает объекты в исходное выделение', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  installMixedSelectionTextScalingController({ harness })

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.15, y: 1 }
    })
  })).toBe(true)
  const confirmed = captureMixedSelectionTransactionState({ harness })
  jest.spyOn(interaction.editor.canvas, 'requestRenderAll').mockImplementationOnce(() => {
    throw new Error('Ошибка восстановления новой рамки')
  })

  expect(() => interaction.controller.commitTextDrivenSelectionScale({
    selection: interaction.target,
    transform: interaction.transform
  })).toThrow('Ошибка восстановления новой рамки')

  expect(captureMixedSelectionTransactionState({ harness })).toEqual(confirmed)
  expect(interaction.editor.canvas.getActiveObject()).toBe(interaction.target)
  expect(interaction.target.getObjects()).toEqual([harness.image, harness.shape, ...interaction.children])
  expect(interaction.target.getObjects().every((child) => child.group === interaction.target)).toBe(true)
  expect(harness.domain.restoreConfirmedDomainMock).toHaveBeenCalledTimes(1)
  expect(harness.finishShapeCommitMock).not.toHaveBeenCalled()
})

it('при ошибке расчёта не применяет частичный результат и очищает состояние всех объектов', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  interaction.transform.actionPerformed = true
  harness.domain.measureDomainGeometryMock.mockImplementationOnce(() => {
    throw new Error('Ошибка расчёта шейпа')
  })
  interaction.endCurrentTransformMock.mockImplementationOnce(() => {
    throw new Error('Ошибка завершения преобразования')
  })

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(() => interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.1, y: 1 }
    })
  })).toThrow('Ошибка расчёта шейпа')
  expect(interaction.applyTextSelectionPreviewMock).not.toHaveBeenCalled()
  expect(harness.domain.applyDomainMeasurementMock).not.toHaveBeenCalled()
  expect(interaction.endCurrentTransformMock).toHaveBeenCalledTimes(1)
  expect(interaction.transform.actionPerformed).toBe(false)
  expect(interaction.endHistoryActionMock).toHaveBeenCalledWith({ reason: 'object-transform' })
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledWith({
    selection: interaction.target
  })
  expect(interaction.clearShapeSelectionPreviewStateMock).toHaveBeenCalledWith({
    children: [harness.shape],
    selection: interaction.target
  })
  expect(interaction.publishGuidesMock).toHaveBeenLastCalledWith({ guides: [] })
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('не подтверждает применённое состояние, если проверка фактической геометрии завершилась ошибкой', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  interaction.restoreTextSelectionScalePreviewMock.mockReturnValue(true)

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.1, y: 1 }
    })
  })).toBe(true)
  interaction.transform.actionPerformed = true
  Reflect.set(interaction.editor.canvas, '_currentTransform', interaction.transform)
  interaction.endCurrentTransformMock.mockImplementationOnce(() => {
    throw new Error('Ошибка завершения подтверждённого преобразования')
  })
  const session = Reflect.get(interaction.controller, 'session') as { runtime?: ScaleSnappingRuntime } | null
  const runtime = session?.runtime
  if (!(runtime instanceof ScaleSnappingRuntime)) throw new Error('Тест должен получить runtime активной сессии')
  jest.spyOn(runtime, 'verifyScalePlan').mockImplementationOnce(() => {
    throw new Error('Ошибка проверки геометрии')
  })

  expect(() => interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.2, y: 1 }
    })
  })).toThrow('Ошибка проверки геометрии')
  expect(interaction.confirmTextSelectionScalePreviewMock).toHaveBeenCalledTimes(1)
  expect(interaction.restoreTextSelectionScalePreviewMock).toHaveBeenCalledTimes(1)
  expect(interaction.endCurrentTransformMock).toHaveBeenCalledTimes(1)
  expect(interaction.endHistoryActionMock).toHaveBeenCalledWith({ reason: 'object-transform' })
  expect(Reflect.get(interaction.editor.canvas, '_currentTransform')).toBeNull()
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при ошибке после успешного шага восстанавливает последний результат и завершает скейлинг', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const restorePreviewMock = jest
    .spyOn(interaction.editor.textManager, 'restoreActiveSelectionScalePreview')

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.1, y: 1 }
    })
  })).toBe(true)

  const confirmedMeasurement = interaction.applyTextSelectionPreviewMock.mock.calls[0]?.[0].measurement
  if (!confirmedMeasurement) throw new Error('Первый шаг должен применить подтверждённое измерение')
  restorePreviewMock.mockImplementation(({ selection }) => {
    interaction.applyTextSelectionPreviewMock({
      measurement: confirmedMeasurement,
      selection
    })

    return true
  })
  harness.domain.applyDomainMeasurementMock.mockImplementationOnce(() => {
    throw new Error('Ошибка применения шейпа')
  })

  expect(() => interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.2, y: 1 }
    })
  })).toThrow('Ошибка применения шейпа')
  expect(restorePreviewMock).toHaveBeenCalledWith({ selection: interaction.target })
  expect(interaction.endCurrentTransformMock).toHaveBeenCalledTimes(1)
  expect(interaction.applyTextSelectionPreviewMock).toHaveBeenLastCalledWith({
    measurement: confirmedMeasurement,
    selection: interaction.target
  })
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при повторной ошибке восстановления отменяет фиксацию и сохраняет исходную ошибку', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const restorePreviewMock = jest
    .spyOn(interaction.editor.textManager, 'restoreActiveSelectionScalePreview')
    .mockImplementation(() => {
      throw new Error('Ошибка восстановления')
    })

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.1, y: 1 }
    })
  })).toBe(true)
  harness.domain.applyDomainMeasurementMock.mockImplementationOnce(() => {
    throw new Error('Ошибка применения шейпа')
  })

  expect(() => interaction.controller.handleCanvasMouseMove({
    event: createActiveSelectionScaleMouseMoveEvent({
      harness: interaction,
      marker: new MouseEvent('pointermove'),
      multipliers: { x: 1.2, y: 1 }
    })
  })).toThrow('Ошибка применения шейпа')
  expect(restorePreviewMock).toHaveBeenCalledTimes(1)
  expect(interaction.transform.actionPerformed).toBe(false)
  expect(interaction.endCurrentTransformMock).toHaveBeenCalledTimes(1)
  expect(interaction.endHistoryActionMock).toHaveBeenCalledWith({ reason: 'object-transform' })
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledTimes(1)
  expect(interaction.controller.finishGesture()).toBe(false)
})

it('при отмене указателя один раз очищает состояние шейпа и текстов', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const event = new Event('pointercancel') as PointerEvent

  expect(interaction.controller.startGesture({
    event: createActiveSelectionScaleStartEvent({ harness: interaction })
  })).toBe(true)
  expect(interaction.controller.interruptGesture({ event })).toBe(true)
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledTimes(1)
  expect(interaction.clearShapeSelectionPreviewStateMock).toHaveBeenCalledTimes(1)
  expect(interaction.clearShapeSelectionPreviewStateMock).toHaveBeenCalledWith({
    children: [harness.shape],
    selection: interaction.target
  })
  expect(interaction.endCurrentTransformMock).toHaveBeenCalledWith(event)
  expect(interaction.controller.interruptGesture({ event })).toBe(false)
  expect(interaction.clearTextSelectionScalingMock).toHaveBeenCalledTimes(1)
  expect(interaction.clearShapeSelectionPreviewStateMock).toHaveBeenCalledTimes(1)
})
