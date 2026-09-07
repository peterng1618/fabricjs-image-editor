import { Group, Point } from 'fabric'
import type { MockCanvas } from './factories'
import { createMockCanvas, createMockShapeTextbox } from './factories'

/** Горизонтальная точка привязки объекта в тестовом CanvasManager. */
type PlacementOriginX = Group['originX']

/** Вертикальная точка привязки объекта в тестовом CanvasManager. */
type PlacementOriginY = Group['originY']

/** Положение объекта, которое возвращает тестовый CanvasManager. */
type ShapeObjectPlacement = Readonly<{
  left: number
  top: number
  originX: PlacementOriginX
  originY: PlacementOriginY
}>

/** Точки привязки, приведённые к текущим значениям группы. */
type ShapePlacementOrigins = Pick<ShapeObjectPlacement, 'originX' | 'originY'>

/** Минимальная монтажная область, необходимая ShapeManager в unit-тестах. */
type ShapeTestMontageArea = {
  width: number
  height: number
  left: number
  top: number
  setCoords: jest.Mock
  getBoundingRect: jest.Mock
}

/** Возвращает валидную ширину тестовой монтажной области. */
function resolveMontageAreaWidth({ montageAreaWidth }: { montageAreaWidth?: number }): number {
  if (!Number.isFinite(montageAreaWidth)) return 400

  return Math.max(1, Number(montageAreaWidth))
}

/** Создаёт монтажную область для тестового редактора ShapeManager. */
function createShapeTestMontageArea({ width }: { width: number }): ShapeTestMontageArea {
  return {
    width,
    height: 300,
    left: width / 2,
    top: 150,
    setCoords: jest.fn(),
    getBoundingRect: jest.fn(() => ({
      left: 0,
      top: 0,
      width,
      height: 300
    }))
  }
}

/** Возвращает явно переданные или текущие точки привязки группы. */
function resolveShapePlacementOrigins({
  object,
  originX,
  originY
}: {
  object: Group
  originX?: PlacementOriginX
  originY?: PlacementOriginY
}): ShapePlacementOrigins {
  return {
    originX: originX ?? object.originX ?? 'center',
    originY: originY ?? object.originY ?? 'center'
  }
}

/** Считывает положение группы относительно выбранной точки привязки. */
function getShapeObjectPlacement({
  object,
  originX,
  originY
}: {
  object: Group
  originX?: PlacementOriginX
  originY?: PlacementOriginY
}): ShapeObjectPlacement {
  const origins = resolveShapePlacementOrigins({ object, originX, originY })
  const point = object.getPointByOrigin(origins.originX, origins.originY)

  return {
    left: point.x,
    top: point.y,
    ...origins
  }
}

/** Дополняет неполное положение группы текущими или резервными координатами. */
function resolveShapeObjectPlacement({
  object,
  left,
  top,
  originX,
  originY,
  fallbackPoint
}: {
  object: Group
  left?: number
  top?: number
  originX?: PlacementOriginX
  originY?: PlacementOriginY
  fallbackPoint?: Point
}): ShapeObjectPlacement {
  const origins = resolveShapePlacementOrigins({ object, originX, originY })
  const basePoint = fallbackPoint ?? object.getPointByOrigin(origins.originX, origins.originY)

  return {
    left: left ?? basePoint.x,
    top: top ?? basePoint.y,
    ...origins
  }
}

/** Применяет рассчитанное положение к тестовой группе. */
function applyShapeObjectPlacement({
  object,
  placement
}: {
  object: Group
  placement: ShapeObjectPlacement
}): void {
  object.originX = placement.originX
  object.originY = placement.originY
  object.setPositionByOrigin(
    new Point(placement.left, placement.top),
    placement.originX,
    placement.originY
  )
  object.setCoords()
}

/** Создаёт тестовую зависимость CanvasManager для редактора ShapeManager. */
function createShapeCanvasManagerStub({
  montageArea
}: {
  montageArea: ShapeTestMontageArea
}) {
  return {
    centerObjectToMontageArea: jest.fn(({ object }: { object: Group }) => {
      object.setPositionByOrigin(new Point(montageArea.left, montageArea.top), 'center', 'center')
      object.setCoords()
    }),
    getMontageAreaSceneCenter: jest.fn(() => new Point(montageArea.left, montageArea.top)),
    getObjectPlacement: jest.fn(getShapeObjectPlacement),
    getMontageAreaSceneBounds: jest.fn(() => ({
      left: 0,
      top: 0,
      right: montageArea.width,
      bottom: montageArea.height,
      width: montageArea.width,
      height: montageArea.height,
      center: new Point(montageArea.left, montageArea.top)
    })),
    resolveObjectPlacement: jest.fn(resolveShapeObjectPlacement),
    applyObjectPlacement: jest.fn(applyShapeObjectPlacement)
  }
}

/** Создаёт минимальный редактор для unit-тестов ShapeManager. */
export const createShapeManagerEditorStub = ({
  canvas,
  montageAreaWidth
}: {
  canvas?: MockCanvas
  montageAreaWidth?: number
} = {}) => {
  const resolvedCanvas = canvas ?? createMockCanvas()
  const resolvedMontageAreaWidth = resolveMontageAreaWidth({ montageAreaWidth })
  const montageArea = createShapeTestMontageArea({ width: resolvedMontageAreaWidth })

  return {
    canvas: resolvedCanvas,
    canvasManager: createShapeCanvasManagerStub({ montageArea }),
    textManager: {
      addText: jest.fn((style: Record<string, unknown>) => createMockShapeTextbox({
        text: String(style.text ?? ''),
        width: Number(style.width) || 180,
        textAlign: (style.align as 'left' | 'center' | 'right' | 'justify') ?? 'center'
      })),
      syncLineStylesWithText: jest.fn(),
      updateText: jest.fn()
    },
    historyManager: {
      suspendHistory: jest.fn(),
      resumeHistory: jest.fn(),
      saveState: jest.fn()
    },
    selectionManager: {
      handleShapeSelectionScaleStep: jest.fn().mockReturnValue(false),
      commitShapeSelectionScale: jest.fn().mockReturnValue(false),
      shouldSkipShapeSelectionScaleCommit: jest.fn().mockReturnValue(false)
    },
    montageArea
  }
}
