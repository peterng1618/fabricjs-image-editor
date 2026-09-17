import {
  Point,
  Rect,
  type FabricObject
} from 'fabric/es'

import type { ImageEditor } from '../../../src/editor'
import type {
  ActiveSelectionScaleDomainMeasurement,
  ActiveSelectionScaleDomainSource
} from '../../../src/editor/selection-manager/scaling/active-selection-scale-domain-source'
import ShapeManager from '../../../src/editor/shape-manager'
import { ShapeGroupObject } from '../../../src/editor/shape-manager/domain/shape-group'
import { applyShapeCornerFreeScaleControls } from '../../../src/editor/shape-manager/scaling/shape-controls'
import { BackgroundTextbox } from '../../../src/editor/text-manager/background-textbox'
import type { ActiveSelectionTextScaleMeasurement } from '../../../src/editor/text-manager/scaling/active-selection-scale-measurer'
import TextActiveSelectionScalingController from '../../../src/editor/text-manager/scaling/active-selection-scaling-controller'
import { createMockFabricImage } from '../managers/image'
import {
  createTextActiveSelectionScaleHarness,
  installSelectionChildGeometryContract,
  type TextActiveSelectionScaleHarness,
  type TextActiveSelectionScaleHarnessOptions
} from './active-selection-scale-interaction'

/** Параметры тестовой сессии полного смешанного выделения. */
type MixedActiveSelectionScaleHarnessOptions = TextActiveSelectionScaleHarnessOptions

/** Наблюдаемые методы доменного источника шейпов в смешанной сессии. */
type MixedSelectionDomainSourceMocks = Readonly<{
  applyDomainMeasurementMock: jest.MockedFunction<ActiveSelectionScaleDomainSource['apply']>
  confirmDomainMeasurementMock: jest.MockedFunction<ActiveSelectionScaleDomainSource['confirmAppliedState']>
  domainSource: ActiveSelectionScaleDomainSource
  measureDomainGeometryMock: jest.MockedFunction<ActiveSelectionScaleDomainSource['measure']>
  restoreConfirmedDomainMock: jest.MockedFunction<ActiveSelectionScaleDomainSource['restoreConfirmedState']>
}>

/** Локальная прямоугольная геометрия объекта в тестовом выделении. */
interface MixedSelectionDomainShapeState {
  readonly height: number
  readonly left: number
  readonly scaleX: number
  readonly scaleY: number
  readonly top: number
  readonly width: number
}

/** Геометрия тестовой рамки вместе с её поворотом. */
interface MixedSelectionFrameTransactionState extends MixedSelectionDomainShapeState {
  readonly angle: number
}

/** Геометрия отдельного текста вместе с каноническим размером шрифта. */
interface MixedSelectionTextTransactionState extends MixedSelectionDomainShapeState {
  readonly fontSize: number
}

/** Наблюдаемое состояние всех объектов перед общей фиксацией или после её отката. */
type MixedSelectionTransactionState = Readonly<{
  image: MixedSelectionDomainShapeState
  selection: MixedSelectionFrameTransactionState
  shape: MixedSelectionDomainShapeState
  texts: readonly MixedSelectionTextTransactionState[]
}>

/** Наблюдаемые зависимости полноценного смешанного состава. */
type MixedActiveSelectionScaleHarness = Readonly<{
  finishShapeCommitMock: jest.MockedFunction<
    ImageEditor['shapeManager']['finishActiveSelectionScaleCommit']
  >
  commitTextChildrenMock: jest.MockedFunction<
    ImageEditor['textManager']['commitActiveSelectionScaling']
  >
  createDomainSourceMock: jest.MockedFunction<
    ImageEditor['shapeManager']['createActiveSelectionScaleDomainSource']
  >
  domain: MixedSelectionDomainSourceMocks
  image: ReturnType<typeof createMockFabricImage>
  interaction: TextActiveSelectionScaleHarness
  prepareShapeCommitMock: jest.MockedFunction<
    ImageEditor['shapeManager']['prepareActiveSelectionScaleCommit']
  >
  preparedShapeCommit: ReturnType<ImageEditor['shapeManager']['prepareActiveSelectionScaleCommit']>
  shape: ShapeGroupObject
}>

/** Наблюдаемые зависимости неподдерживаемого состава с обычным Fabric-объектом. */
type UnknownActiveSelectionScaleHarness = Readonly<{
  createDomainSourceMock: jest.MockedFunction<
    ImageEditor['shapeManager']['createActiveSelectionScaleDomainSource']
  >
  interaction: TextActiveSelectionScaleHarness
  unknownObject: Rect
}>

/** Создаёт каноническое изображение внутри тестового общего выделения. */
function createSelectionImage({
  interaction
}: {
  interaction: TextActiveSelectionScaleHarness
}): ReturnType<typeof createMockFabricImage> {
  const image = createMockFabricImage({ height: 70, width: 90 })
  image.set({
    angle: 0,
    flipX: false,
    flipY: false,
    group: interaction.target,
    left: -90,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    strokeWidth: 0,
    top: -35
  })
  installSelectionChildGeometryContract({ selection: interaction.target, target: image })

  if (image.group !== interaction.target) {
    throw new Error('Изображение должно принадлежать тестовому общему выделению')
  }

  return image
}

/** Создаёт канонический шейп внутри тестового общего выделения. */
function createSelectionShape({
  interaction
}: {
  interaction: TextActiveSelectionScaleHarness
}): ShapeGroupObject {
  const shapeNode = new Rect({ height: 80, strokeWidth: 0, width: 100 })
  const textNode = new BackgroundTextbox('Текст шейпа', {
    fontSize: 20,
    height: 30,
    strokeWidth: 0,
    width: 80
  })
  shapeNode.shapeNodeType = 'shape'
  textNode.shapeNodeType = 'text'
  const shape = new ShapeGroupObject([
    shapeNode,
    textNode
  ], {
    height: 80,
    shapePresetKey: 'square',
    width: 100
  })
  shape.set({
    angle: 0,
    flipX: false,
    flipY: false,
    group: interaction.target,
    left: -30,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    top: -25
  })
  installSelectionChildGeometryContract({ selection: interaction.target, target: shape })

  if (shape.group !== interaction.target) {
    throw new Error('Шейп должен принадлежать тестовому общему выделению')
  }

  return shape
}

/** Создаёт рассчитанную геометрию одного шейпа для текущих множителей. */
function createDomainMeasurement({
  multipliers,
  shape
}: {
  multipliers: ActiveSelectionScaleDomainMeasurement['multipliers']
  shape: ShapeGroupObject
}): ActiveSelectionScaleDomainMeasurement {
  const width = shape.width * multipliers.x
  const height = shape.height * multipliers.y
  const center = Object.freeze({ x: 20, y: 15 })

  return Object.freeze({
    children: Object.freeze([Object.freeze({
      bounds: Object.freeze({
        bottom: center.y + (height / 2),
        centerX: center.x,
        centerY: center.y,
        left: center.x - (width / 2),
        right: center.x + (width / 2),
        top: center.y - (height / 2)
      }),
      center,
      target: shape
    })]),
    multipliers: Object.freeze({ ...multipliers })
  })
}

/** Сохраняет локальную прямоугольную геометрию одного тестового объекта. */
function captureRectangularState({
  target
}: {
  target: FabricObject
}): MixedSelectionDomainShapeState {
  return Object.freeze({
    height: target.height,
    left: target.left,
    scaleX: target.scaleX,
    scaleY: target.scaleY,
    top: target.top,
    width: target.width
  })
}

/** Восстанавливает локальную прямоугольную геометрию тестового шейпа. */
function restoreDomainShapeState({
  shape,
  state
}: {
  shape: ShapeGroupObject
  state: MixedSelectionDomainShapeState
}): void {
  shape.set({ ...state })
  shape.setCoords()
}

/** Создаёт наблюдаемый источник геометрии шейпа для смешанной сессии. */
function createDomainSourceMocks({
  shape
}: {
  shape: ShapeGroupObject
}): MixedSelectionDomainSourceMocks {
  let confirmedState = captureRectangularState({ target: shape })
  const measureDomainGeometryMock: MixedSelectionDomainSourceMocks['measureDomainGeometryMock'] = jest.fn<
    ActiveSelectionScaleDomainMeasurement,
    Parameters<ActiveSelectionScaleDomainSource['measure']>
  >(({ multipliers }) => createDomainMeasurement({ multipliers, shape }))
  const applyDomainMeasurementMock: MixedSelectionDomainSourceMocks['applyDomainMeasurementMock'] = jest.fn<
    void,
    Parameters<ActiveSelectionScaleDomainSource['apply']>
  >(({ children, frame, measurement }) => {
    const [child] = children
    if (children.length !== 1 || child?.target !== shape) {
      throw new Error('Тестовый домен должен применять геометрию единственного шейпа')
    }
    if (Math.min(frame.scaleX, frame.scaleY) <= 0) {
      throw new Error('Тестовая рамка должна иметь положительный масштаб')
    }

    shape.set({
      scaleX: measurement.multipliers.x / frame.scaleX,
      scaleY: measurement.multipliers.y / frame.scaleY
    })
    shape.setPositionByOrigin(new Point(
      (child.center.x - frame.center.x) / frame.scaleX,
      (child.center.y - frame.center.y) / frame.scaleY
    ), 'center', 'center')
    shape.setCoords()
  })
  const confirmDomainMeasurementMock: MixedSelectionDomainSourceMocks['confirmDomainMeasurementMock'] = jest.fn(
    (_params) => {
      confirmedState = captureRectangularState({ target: shape })
    }
  )
  const restoreConfirmedDomainMock: MixedSelectionDomainSourceMocks['restoreConfirmedDomainMock'] = jest.fn(
    () => restoreDomainShapeState({ shape, state: confirmedState })
  )
  const domainSource: ActiveSelectionScaleDomainSource = Object.freeze({
    apply: applyDomainMeasurementMock,
    confirmAppliedState: confirmDomainMeasurementMock,
    measure: measureDomainGeometryMock,
    restoreConfirmedState: restoreConfirmedDomainMock,
    targets: Object.freeze([shape])
  })

  return Object.freeze({
    applyDomainMeasurementMock,
    confirmDomainMeasurementMock,
    domainSource,
    measureDomainGeometryMock,
    restoreConfirmedDomainMock
  })
}

/** Подключает настоящий контроллер TextManager к тестовой сессии смешанного выделения. */
export function installMixedSelectionTextScalingController({
  harness
}: {
  harness: MixedActiveSelectionScaleHarness
}): TextActiveSelectionScalingController {
  const { editor } = harness.interaction
  const controller = new TextActiveSelectionScalingController({
    canvas: editor.canvas,
    canvasManager: editor.canvasManager
  })

  editor.textManager.supportsActiveSelectionScaling = (params) => controller.supportsScaling(params)
  editor.textManager.beginActiveSelectionScaling = (params) => controller.beginScaling(params)
  editor.textManager.measureActiveSelectionScale = (params) => controller.measureScale(params)
  editor.textManager.resolveActiveSelectionScaleStep = (params) => controller.resolveScaleStep(params)
  editor.textManager.applyActiveSelectionScalePreview = (params) => controller.applyScalePreview(params)
  editor.textManager.confirmActiveSelectionScalePreview = (params) => controller.confirmScalePreview(params)
  editor.textManager.commitActiveSelectionScaling = (params) => controller.commitScaling(params)
  editor.textManager.clearActiveSelectionScaling = (params) => controller.clearScaling(params)
  editor.textManager.hasConfirmedActiveSelectionScale = (params) => controller.hasConfirmedScalePreview(params)
  editor.textManager.restoreActiveSelectionScalePreview = (params) => controller.restoreScalePreview(params)

  return controller
}

/** Сохраняет локальную геометрию полного смешанного состава для проверки общего отката. */
export function captureMixedSelectionTransactionState({
  harness
}: {
  harness: MixedActiveSelectionScaleHarness
}): MixedSelectionTransactionState {
  return Object.freeze({
    image: captureRectangularState({ target: harness.image }),
    selection: Object.freeze({
      ...captureRectangularState({ target: harness.interaction.target }),
      angle: harness.interaction.target.angle
    }),
    shape: captureRectangularState({ target: harness.shape }),
    texts: Object.freeze(harness.interaction.children.map((text) => Object.freeze({
      ...captureRectangularState({ target: text }),
      fontSize: text.fontSize
    })))
  })
}

/** Дополняет текстовое измерение рассчитанной геометрией шейпов. */
function attachDomainMeasurement({
  domain,
  measurement,
  mode,
  multipliers
}: {
  domain: MixedSelectionDomainSourceMocks
  measurement: ActiveSelectionTextScaleMeasurement
  mode: Parameters<ActiveSelectionScaleDomainSource['measure']>[0]['mode']
  multipliers: ActiveSelectionScaleDomainMeasurement['multipliers']
}): ActiveSelectionTextScaleMeasurement {
  const domainMeasurement = domain.domainSource.measure({ mode, multipliers })

  return Object.freeze({
    ...measurement,
    domainChildren: domainMeasurement.children,
    domainMeasurement
  })
}

/** Подключает доменный источник к наблюдаемому TextManager тестового контроллера. */
function installMixedTextManagerContract({
  domain,
  interaction,
  shape
}: {
  domain: MixedSelectionDomainSourceMocks
  interaction: TextActiveSelectionScaleHarness
  shape: ShapeGroupObject
}): void {
  const measureText = interaction.measureTextSelectionScaleMock.getMockImplementation()
  const applyText = interaction.applyTextSelectionPreviewMock.getMockImplementation()
  if (!measureText || !applyText) throw new Error('Тестовый TextManager должен измерять и применять геометрию')

  interaction.supportsTextSelectionMock.mockImplementation(({ domainTargets }) => {
    return domainTargets?.length === 1 && domainTargets[0] === shape
  })
  interaction.measureTextSelectionScaleMock.mockImplementation((params) => {
    const measurement = measureText(params)

    return attachDomainMeasurement({
      domain,
      measurement,
      mode: params.mode,
      multipliers: params.multipliers
    })
  })
  interaction.applyTextSelectionPreviewMock.mockImplementation((params) => {
    const multipliers = applyText(params)
    const { domainChildren, domainMeasurement, frame } = params.measurement
    if (!domainMeasurement) throw new Error('Смешанное измерение должно содержать геометрию шейпа')

    domain.domainSource.apply({ children: domainChildren, frame, measurement: domainMeasurement })

    return multipliers
  })
}

/** Устанавливает наблюдаемые методы ShapeManager для смешанной сессии. */
function installMixedShapeManagerContract({
  domain,
  interaction,
  shape
}: {
  domain: MixedSelectionDomainSourceMocks
  interaction: TextActiveSelectionScaleHarness
  shape: ShapeGroupObject
}): Readonly<{
  finishShapeCommitMock: MixedActiveSelectionScaleHarness['finishShapeCommitMock']
  createDomainSourceMock: MixedActiveSelectionScaleHarness['createDomainSourceMock']
  prepareShapeCommitMock: MixedActiveSelectionScaleHarness['prepareShapeCommitMock']
  preparedShapeCommit: MixedActiveSelectionScaleHarness['preparedShapeCommit']
}> {
  const { shapeManager } = interaction.editor
  const resolveShapesMock: jest.MockedFunction<
    ImageEditor['shapeManager']['resolveSupportedActiveSelectionShapeChildren']
  > = jest.fn<
    ReturnType<ImageEditor['shapeManager']['resolveSupportedActiveSelectionShapeChildren']>,
    Parameters<ImageEditor['shapeManager']['resolveSupportedActiveSelectionShapeChildren']>
  >(() => Object.freeze([shape]))
  const createDomainSourceMock: MixedActiveSelectionScaleHarness['createDomainSourceMock'] = jest.fn<
    ReturnType<ImageEditor['shapeManager']['createActiveSelectionScaleDomainSource']>,
    Parameters<ImageEditor['shapeManager']['createActiveSelectionScaleDomainSource']>
  >(() => domain.domainSource)
  const preparedShapeCommit = Object.freeze({
    groups: Object.freeze([shape]),
    selection: interaction.target
  }) satisfies MixedActiveSelectionScaleHarness['preparedShapeCommit']
  const prepareShapeCommitMock: MixedActiveSelectionScaleHarness['prepareShapeCommitMock'] = jest.fn<
    ReturnType<ImageEditor['shapeManager']['prepareActiveSelectionScaleCommit']>,
    Parameters<ImageEditor['shapeManager']['prepareActiveSelectionScaleCommit']>
  >(() => preparedShapeCommit)
  const finishShapeCommitMock: MixedActiveSelectionScaleHarness['finishShapeCommitMock'] = jest.fn<
    ReturnType<ImageEditor['shapeManager']['finishActiveSelectionScaleCommit']>,
    Parameters<ImageEditor['shapeManager']['finishActiveSelectionScaleCommit']>
  >()

  shapeManager.resolveSupportedActiveSelectionShapeChildren = resolveShapesMock
  shapeManager.createActiveSelectionScaleDomainSource = createDomainSourceMock
  shapeManager.prepareActiveSelectionScaleCommit = prepareShapeCommitMock
  shapeManager.finishActiveSelectionScaleCommit = finishShapeCommitMock
  shapeManager.resolveActiveSelectionScaleControlMode = ShapeManager.prototype.resolveActiveSelectionScaleControlMode

  return Object.freeze({
    createDomainSourceMock,
    finishShapeCommitMock,
    prepareShapeCommitMock,
    preparedShapeCommit
  })
}

/** Создаёт полноценный состав из изображения, шейпа и двух отдельных текстов. */
export function createMixedActiveSelectionScaleHarness(
  options: MixedActiveSelectionScaleHarnessOptions = {}
): MixedActiveSelectionScaleHarness {
  const interaction = createTextActiveSelectionScaleHarness({ controlKey: 'mr', ...options })
  applyShapeCornerFreeScaleControls({ target: interaction.target })
  const image = createSelectionImage({ interaction })
  const shape = createSelectionShape({ interaction })
  const children: FabricObject[] = [image, shape, ...interaction.children]
  for (const child of children) {
    if (typeof child.setCoords !== 'function') {
      throw new Error(`Ребёнок ${child.constructor.name} должен сохранять контракт FabricObject`)
    }
  }
  interaction.target.removeAll()
  interaction.target.add(...children)
  if (interaction.target.getObjects().some((child, index) => child !== children[index])) {
    throw new Error('Полное смешанное выделение должно сохранять исходный порядок объектов')
  }

  const domain = createDomainSourceMocks({ shape })
  installMixedTextManagerContract({ domain, interaction, shape })
  const shapeContract = installMixedShapeManagerContract({ domain, interaction, shape })
  const commitTextChildrenMock: MixedActiveSelectionScaleHarness['commitTextChildrenMock'] = jest.fn<
    ReturnType<ImageEditor['textManager']['commitActiveSelectionScaling']>,
    Parameters<ImageEditor['textManager']['commitActiveSelectionScaling']>
  >(() => true)
  interaction.editor.textManager.commitActiveSelectionScaling = commitTextChildrenMock

  return Object.freeze({
    ...shapeContract,
    commitTextChildrenMock,
    domain,
    image,
    interaction,
    shape
  })
}

/** Создаёт состав с обычным Fabric-объектом, который должен остаться на прежнем пути. */
export function createUnknownActiveSelectionScaleHarness(): UnknownActiveSelectionScaleHarness {
  const interaction = createTextActiveSelectionScaleHarness({ controlKey: 'mr' })
  const image = createSelectionImage({ interaction })
  const unknownObject = new Rect({ height: 40, width: 50 })
  unknownObject.set({ group: interaction.target })
  jest.spyOn(interaction.target, 'getObjects')
    .mockReturnValue([image, unknownObject, ...interaction.children])
  interaction.supportsTextSelectionMock.mockReturnValue(false)

  const shapeManager = interaction.editor.shapeManager
  const resolveShapesMock: jest.MockedFunction<
    ImageEditor['shapeManager']['resolveSupportedActiveSelectionShapeChildren']
  > = jest.fn<
    ReturnType<ImageEditor['shapeManager']['resolveSupportedActiveSelectionShapeChildren']>,
    Parameters<ImageEditor['shapeManager']['resolveSupportedActiveSelectionShapeChildren']>
  >(() => null)
  const createDomainSourceMock: UnknownActiveSelectionScaleHarness['createDomainSourceMock'] = jest.fn<
    ReturnType<ImageEditor['shapeManager']['createActiveSelectionScaleDomainSource']>,
    Parameters<ImageEditor['shapeManager']['createActiveSelectionScaleDomainSource']>
  >(() => null)
  shapeManager.resolveSupportedActiveSelectionShapeChildren = resolveShapesMock
  shapeManager.createActiveSelectionScaleDomainSource = createDomainSourceMock

  return Object.freeze({ createDomainSourceMock, interaction, unknownObject })
}
