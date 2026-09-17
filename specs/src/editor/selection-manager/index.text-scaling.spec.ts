import { ActiveSelection, Rect } from 'fabric/es'

import SelectionManager from '../../../../src/editor/selection-manager'
import ActiveSelectionScaleInteractionController from '../../../../src/editor/selection-manager/scaling/active-selection-scale-interaction-controller' // eslint-disable-line max-len
import { createSelectionTestSetup } from '../../../test-utils/managers/selection'

afterEach(jest.restoreAllMocks)

it('передаёт фиксацию выделения с текстом единому владельцу рамки', () => {
  const commitSpy = jest
    .spyOn(ActiveSelectionScaleInteractionController.prototype, 'commitTextDrivenSelectionScale')
    .mockReturnValue(true)
  const { editor } = createSelectionTestSetup()
  const manager = new SelectionManager({ editor })
  const selection = new ActiveSelection([new Rect(), new Rect()], { canvas: editor.canvas })

  expect(manager.commitTextSelectionScale({ selection })).toBe(true)
  expect(commitSpy).toHaveBeenCalledWith({ selection, transform: undefined })

  manager.destroy()
})

it('не запускает фиксацию для выделения без общей текстовой сессии', () => {
  const commitSpy = jest
    .spyOn(ActiveSelectionScaleInteractionController.prototype, 'commitTextDrivenSelectionScale')
    .mockReturnValue(false)
  const { editor } = createSelectionTestSetup()
  const manager = new SelectionManager({ editor })
  const selection = new ActiveSelection([new Rect(), new Rect()], { canvas: editor.canvas })

  expect(manager.commitTextSelectionScale({ selection })).toBe(false)
  expect(commitSpy).toHaveBeenCalledWith({ selection, transform: undefined })

  manager.destroy()
})

it('завершает защищённую сессию, если фиксация текста завершилась ошибкой', () => {
  const commitSpy = jest
    .spyOn(ActiveSelectionScaleInteractionController.prototype, 'commitTextDrivenSelectionScale')
    .mockImplementation(() => {
      throw new Error('Ошибка фиксации')
    })
  const { editor } = createSelectionTestSetup()
  const manager = new SelectionManager({ editor })
  const selection = new ActiveSelection([new Rect(), new Rect()], { canvas: editor.canvas })

  expect(() => manager.commitTextSelectionScale({ selection })).toThrow('Ошибка фиксации')
  expect(commitSpy).toHaveBeenCalledWith({ selection, transform: undefined })

  manager.destroy()
})
