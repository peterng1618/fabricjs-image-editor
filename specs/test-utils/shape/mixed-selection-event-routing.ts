import { ActiveSelection } from 'fabric/es'

import { BackgroundTextbox } from '../../../src/editor/text-manager/background-textbox'
import { createMockFabricImage } from '../managers/image'
import {
  createShapeEventRoutingHarness,
  type ShapeEventRoutingHarness
} from './event-routing'

/** Событие фиксации полноценного смешанного выделения. */
type MixedSelectionModifiedEvent = Readonly<{
  target: ActiveSelection
  transform: Readonly<{
    action: 'scaleX'
    target: ActiveSelection
  }>
}>

/** Наблюдаемое окружение раннего события ShapeManager для смешанного состава. */
export type MixedSelectionShapeEventRoutingHarness = Readonly<{
  event: MixedSelectionModifiedEvent
  routing: ShapeEventRoutingHarness
  selection: ActiveSelection
}>

/** Создаёт полноценный смешанный состав для проверки порядка фиксации менеджеров. */
export function createMixedSelectionShapeEventRoutingHarness(): MixedSelectionShapeEventRoutingHarness {
  const routing = createShapeEventRoutingHarness()
  const image = createMockFabricImage({ height: 70, width: 90 })
  const text = new BackgroundTextbox('Отдельный текст', {
    fontSize: 24,
    strokeWidth: 0,
    width: 120
  })
  text.initDimensions()
  text.set({ width: 120 })

  const selection = new ActiveSelection([routing.group, image, text])
  const event = Object.freeze({
    target: selection,
    transform: Object.freeze({ action: 'scaleX' as const, target: selection })
  })
  routing.shouldSkipShapeSelectionScaleCommitMock.mockReturnValue(true)

  if (selection.getObjects().length !== 3) {
    throw new Error('Тестовое выделение должно содержать изображение, шейп и отдельный текст')
  }
  if (!selection.getObjects().includes(routing.group)) {
    throw new Error('Тестовый шейп должен входить в смешанное выделение')
  }

  return Object.freeze({ event, routing, selection })
}
