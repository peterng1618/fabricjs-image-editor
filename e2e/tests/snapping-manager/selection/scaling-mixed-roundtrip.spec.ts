import {
  test,
  expect
} from '../../../fixtures/active-selection-scaling.fixture'
import { expectImageTextScaleRoundtrip } from '../../../helpers/image-text-selection-scaling.helper'
import { expectMixedShapeScaleRoundtrip } from '../../../helpers/mixed-selection-scaling.helper'

test('после скейлинга копия смешанного выделения сохраняет размеры и оформление объектов', async({
  activeSelectionMixedScaleSetup: setup,
  clipboard,
  selection
}) => {
  const sourceIds = [setup.imageId, setup.shapeId, setup.textId]

  await selection.scaling.startFromControl({ control: 'mr' })
  await selection.scaling.dragControlBy({ deltaX: 80, deltaY: 0, pointerSteps: 2 })
  await selection.scaling.finish()

  const source = await selection.getMixedCompositionSnapshot({
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  })

  await clipboard.copy()
  await clipboard.waitForClipboardReady()
  expect(await clipboard.paste()).toBe(true)

  const copiedComposition = await selection.getCompositionSnapshot()
  const copiedImage = copiedComposition.children.find(({ type }) => type === 'image')
  const copiedShape = copiedComposition.children.find(({ type }) => type === 'shape-group')
  const copiedText = copiedComposition.children.find(({ type }) => type === 'background-textbox')

  expect(copiedImage, 'копия должна содержать изображение').toBeDefined()
  expect(copiedShape, 'копия должна содержать шейп').toBeDefined()
  expect(copiedText, 'копия должна содержать отдельный текст').toBeDefined()
  if (!copiedImage || !copiedShape || !copiedText) throw new Error('Не удалось получить объекты копии')
  expect(sourceIds).not.toContain(copiedImage.id)
  expect(sourceIds).not.toContain(copiedShape.id)
  expect(sourceIds).not.toContain(copiedText.id)

  const copied = await selection.getMixedCompositionSnapshot({
    imageIds: [copiedImage.id],
    shapeIds: [copiedShape.id],
    textIds: [copiedText.id]
  })
  const offsetX = copied.selection.boundsLeft - source.selection.boundsLeft
  const offsetY = copied.selection.boundsTop - source.selection.boundsTop

  expect(Math.abs(offsetX) + Math.abs(offsetY)).toBeGreaterThan(0)
  expectImageTextScaleRoundtrip({
    actual: { selection: copied.selection, images: copied.images, texts: copied.texts },
    expected: { selection: source.selection, images: source.images, texts: source.texts }
  })

  const sourceShapeState = source.shapes[0]
  const copiedShapeState = copied.shapes[0]
  if (!sourceShapeState || !copiedShapeState) throw new Error('Снимки должны содержать шейп')
  expectMixedShapeScaleRoundtrip({
    actual: copiedShapeState,
    expected: sourceShapeState,
    offsetX,
    offsetY
  })
})

test('после скейлинга шаблон сохраняет геометрию изображения, шейпа и отдельного текста', async({
  activeSelectionMixedScaleSetup: setup,
  editorModel,
  selection,
  template
}) => {
  await selection.scaling.startFromControl({ control: 'br' })
  await selection.scaling.dragControlBy({ deltaX: 80, deltaY: 65, pointerSteps: 2 })
  await selection.scaling.finish()

  const source = await selection.getMixedCompositionSnapshot({
    imageIds: [setup.imageId],
    shapeIds: [setup.shapeId],
    textIds: [setup.textId]
  })
  const serializedTemplate = await template.serializeSelection()

  expect(serializedTemplate, 'смешанное выделение должно сохраниться в шаблон').not.toBeNull()
  expect(serializedTemplate?.objects).toHaveLength(3)
  if (!serializedTemplate) throw new Error('Не удалось сохранить смешанное выделение в шаблон')
  const templateBeforeApply = JSON.stringify(serializedTemplate)

  await editorModel.deleteSelectedObject()
  await editorModel.checkObjectCount({ count: 0 })
  expect(await template.applyTemplate({ template: serializedTemplate })).toBe(3)
  expect(JSON.stringify(serializedTemplate)).toBe(templateBeforeApply)

  const restoredComposition = await selection.getCompositionSnapshot()
  const restoredImage = restoredComposition.children.find(({ type }) => type === 'image')
  const restoredShape = restoredComposition.children.find(({ type }) => type === 'shape-group')
  const restoredText = restoredComposition.children.find(({ type }) => type === 'background-textbox')

  expect(restoredImage, 'шаблон должен восстановить изображение').toBeDefined()
  expect(restoredShape, 'шаблон должен восстановить шейп').toBeDefined()
  expect(restoredText, 'шаблон должен восстановить отдельный текст').toBeDefined()
  if (!restoredImage || !restoredShape || !restoredText) {
    throw new Error('Не удалось получить объекты восстановленного шаблона')
  }
  expect(restoredImage.id).not.toBe(setup.imageId)
  expect(restoredShape.id).not.toBe(setup.shapeId)
  expect(restoredText.id).not.toBe(setup.textId)

  const restored = await selection.getMixedCompositionSnapshot({
    imageIds: [restoredImage.id],
    shapeIds: [restoredShape.id],
    textIds: [restoredText.id]
  })
  expectImageTextScaleRoundtrip({
    actual: { selection: restored.selection, images: restored.images, texts: restored.texts },
    expected: { selection: source.selection, images: source.images, texts: source.texts }
  })

  const sourceShapeState = source.shapes[0]
  const restoredShapeState = restored.shapes[0]
  if (!sourceShapeState || !restoredShapeState) throw new Error('Снимки должны содержать шейп')
  expectMixedShapeScaleRoundtrip({ actual: restoredShapeState, expected: sourceShapeState })
})
