import TextActiveSelectionScalingController from '../../../../../src/editor/text-manager/scaling/active-selection-scaling-controller'
import * as activeSelectionScaleLiveState from '../../../../../src/editor/text-manager/scaling/active-selection-scale-live-state'
import { createMixedActiveSelectionScaleHarness } from '../../../../test-utils/selection/mixed-active-selection-scale-interaction'

afterEach(jest.restoreAllMocks)

it('рассчитывает геометрию шейпа до применения общего состояния к живым объектам', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const controller = new TextActiveSelectionScalingController({
    canvas: interaction.editor.canvas,
    canvasManager: interaction.editor.canvasManager
  })

  expect(controller.supportsScaling({
    domainTargets: harness.domain.domainSource.targets,
    selection: interaction.target
  })).toBe(true)
  expect(controller.beginScaling({
    domainSource: harness.domain.domainSource,
    projection: interaction.projection,
    selection: interaction.target,
    transform: interaction.transform
  })).toBe(true)

  const measurement = controller.measureScale({
    mode: 'horizontal',
    multipliers: { x: 1.2, y: 1 },
    selection: interaction.target
  })

  expect(harness.domain.measureDomainGeometryMock).toHaveBeenCalled()
  expect(harness.domain.applyDomainMeasurementMock).not.toHaveBeenCalled()
  expect(measurement.domainMeasurement).not.toBeNull()
  expect(measurement.domainChildren).toHaveLength(1)
  expect(measurement.domainChildren[0]?.target).toBe(harness.shape)

  expect(controller.applyScalePreview({
    measurement,
    selection: interaction.target
  })).toEqual(measurement.multipliers)
  expect(harness.domain.applyDomainMeasurementMock).toHaveBeenCalledTimes(1)
  expect(harness.domain.applyDomainMeasurementMock).toHaveBeenCalledWith({
    children: measurement.domainChildren,
    frame: measurement.frame,
    measurement: measurement.domainMeasurement
  })
  expect(controller.confirmScalePreview({ selection: interaction.target })).toBe(true)
  expect(harness.domain.confirmDomainMeasurementMock).toHaveBeenCalledWith({
    measurement: measurement.domainMeasurement
  })
  expect(controller.clearScaling({ selection: interaction.target })).toBe(true)
})

it('после ошибки первого применения восстанавливает исходную геометрию всех объектов', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction, shape } = harness
  const controller = new TextActiveSelectionScalingController({
    canvas: interaction.editor.canvas,
    canvasManager: interaction.editor.canvasManager
  })
  const initialTexts = interaction.children.map(({ fontSize, width }) => ({ fontSize, width }))

  expect(controller.beginScaling({
    domainSource: harness.domain.domainSource,
    projection: interaction.projection,
    selection: interaction.target,
    transform: interaction.transform
  })).toBe(true)
  const measurement = controller.measureScale({
    mode: 'horizontal',
    multipliers: { x: 1.2, y: 1 },
    selection: interaction.target
  })
  harness.domain.applyDomainMeasurementMock.mockImplementationOnce(() => {
    throw new Error('Ошибка применения шейпа')
  })

  expect(() => controller.applyScalePreview({
    measurement,
    selection: interaction.target
  })).toThrow('Ошибка применения шейпа')
  expect(controller.hasConfirmedScalePreview({ selection: interaction.target })).toBe(false)
  expect(interaction.target.scaleX).toBeCloseTo(1, 8)
  expect(interaction.target.scaleY).toBeCloseTo(1, 8)
  expect(shape.scaleX).toBeCloseTo(1, 8)
  expect(shape.scaleY).toBeCloseTo(1, 8)
  expect(harness.image.scaleX).toBeCloseTo(1, 8)
  expect(harness.image.scaleY).toBeCloseTo(1, 8)
  interaction.children.forEach((text, index) => {
    expect(text.fontSize).toBeCloseTo(initialTexts[index].fontSize, 8)
    expect(text.width).toBeCloseTo(initialTexts[index].width, 8)
    expect(text.scaleX ?? 1).toBeCloseTo(1, 8)
    expect(text.scaleY ?? 1).toBeCloseTo(1, 8)
  })
  expect(shape.group).toBe(interaction.target)
  expect(harness.domain.applyDomainMeasurementMock).toHaveBeenCalledTimes(1)
  expect(harness.domain.restoreConfirmedDomainMock).toHaveBeenCalledTimes(1)
  expect(controller.clearScaling({ selection: interaction.target })).toBe(true)
})

it('при ошибке восстановления одного текста сохраняет причину сбоя и восстанавливает остальные объекты', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const controller = new TextActiveSelectionScalingController({
    canvas: interaction.editor.canvas,
    canvasManager: interaction.editor.canvasManager
  })
  const secondText = interaction.children[1]
  if (!secondText) throw new Error('Для проверки отката нужен второй текст')
  const initialSecondTextWidth = secondText.width

  expect(controller.beginScaling({
    domainSource: harness.domain.domainSource,
    projection: interaction.projection,
    selection: interaction.target,
    transform: interaction.transform
  })).toBe(true)
  const measurement = controller.measureScale({
    mode: 'horizontal', multipliers: { x: 1.2, y: 1 }, selection: interaction.target
  })
  harness.domain.applyDomainMeasurementMock.mockImplementationOnce(() => {
    jest.spyOn(interaction.children[0], 'set').mockImplementationOnce(() => {
      throw new Error('Ошибка восстановления первого текста')
    })

    throw new Error('Ошибка применения шейпа')
  })

  expect(() => controller.applyScalePreview({
    measurement,
    selection: interaction.target
  })).toThrow('Ошибка применения шейпа')
  expect(secondText.width).toBeCloseTo(initialSecondTextWidth, 8)
  expect(harness.image.scaleX).toBeCloseTo(1, 8)
  expect(interaction.target.scaleX).toBeCloseTo(1, 8)
  expect(harness.domain.restoreConfirmedDomainMock).toHaveBeenCalledTimes(1)
  expect(controller.clearScaling({ selection: interaction.target })).toBe(true)
})

it('не меняет подтверждённое состояние, если общий снимок сохранить не удалось', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const controller = new TextActiveSelectionScalingController({
    canvas: interaction.editor.canvas,
    canvasManager: interaction.editor.canvasManager
  })

  expect(controller.beginScaling({
    domainSource: harness.domain.domainSource,
    projection: interaction.projection,
    selection: interaction.target,
    transform: interaction.transform
  })).toBe(true)
  const measurement = controller.measureScale({
    mode: 'horizontal', multipliers: { x: 1.1, y: 1 }, selection: interaction.target
  })
  controller.applyScalePreview({ measurement, selection: interaction.target })
  jest.spyOn(activeSelectionScaleLiveState, 'captureActiveSelectionScaleLiveState')
    .mockImplementationOnce(() => {
      throw new Error('Ошибка сохранения живого снимка')
    })

  expect(() => controller.confirmScalePreview({
    selection: interaction.target
  })).toThrow('Ошибка сохранения живого снимка')
  expect(harness.domain.confirmDomainMeasurementMock).not.toHaveBeenCalled()
  expect(controller.hasConfirmedScalePreview({ selection: interaction.target })).toBe(false)
  expect(controller.restoreScalePreview({ selection: interaction.target })).toBe(true)
  expect(harness.domain.restoreConfirmedDomainMock).toHaveBeenCalledTimes(1)
  expect(controller.clearScaling({ selection: interaction.target })).toBe(true)
})

it('после ошибки следующего применения возвращает последний подтверждённый результат', () => {
  const harness = createMixedActiveSelectionScaleHarness()
  const { interaction } = harness
  const controller = new TextActiveSelectionScalingController({
    canvas: interaction.editor.canvas,
    canvasManager: interaction.editor.canvasManager
  })

  expect(controller.beginScaling({
    domainSource: harness.domain.domainSource,
    projection: interaction.projection,
    selection: interaction.target,
    transform: interaction.transform
  })).toBe(true)
  const confirmed = controller.measureScale({
    mode: 'horizontal', multipliers: { x: 1.1, y: 1 }, selection: interaction.target
  })
  controller.applyScalePreview({ measurement: confirmed, selection: interaction.target })
  expect(controller.confirmScalePreview({ selection: interaction.target })).toBe(true)
  const confirmedScaleX = interaction.target.scaleX
  const confirmedImageScaleX = harness.image.scaleX
  const confirmedTexts = interaction.children.map(({ fontSize, scaleX, width }) => ({ fontSize, scaleX, width }))
  const failed = controller.measureScale({
    mode: 'horizontal', multipliers: { x: 1.2, y: 1 }, selection: interaction.target
  })
  harness.domain.applyDomainMeasurementMock.mockImplementationOnce(() => {
    throw new Error('Ошибка следующего применения шейпа')
  })

  expect(() => controller.applyScalePreview({
    measurement: failed,
    selection: interaction.target
  })).toThrow('Ошибка следующего применения шейпа')
  expect(interaction.target.scaleX).toBeCloseTo(confirmedScaleX, 9)
  expect(harness.image.scaleX).toBeCloseTo(confirmedImageScaleX, 9)
  interaction.children.forEach((text, index) => {
    expect(text.fontSize).toBeCloseTo(confirmedTexts[index].fontSize, 9)
    expect(text.scaleX ?? 1).toBeCloseTo(confirmedTexts[index].scaleX ?? 1, 9)
    expect(text.width).toBeCloseTo(confirmedTexts[index].width, 9)
  })
  expect(controller.hasConfirmedScalePreview({ selection: interaction.target })).toBe(true)
  expect(harness.domain.restoreConfirmedDomainMock).toHaveBeenCalledTimes(1)
  expect(controller.clearScaling({ selection: interaction.target })).toBe(true)
})
