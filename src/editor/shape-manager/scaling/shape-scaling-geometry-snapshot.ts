import {
  Rect,
  util,
  type FabricObject
} from 'fabric'

import { getShapeNodes } from '../domain/shape-nodes'
import type {
  ShapeGroup,
  ShapeNode,
  ShapeTextNode
} from '../types'

/** Геометрия и преобразование объекта Fabric до изменения компоновки. */
type FabricGeometrySnapshot = Readonly<{
  height: number
  originX: FabricObject['originX']
  originY: FabricObject['originY']
  transform: Readonly<ReturnType<typeof util.saveObjectTransform>>
  width: number
}>

/** Свойства компоновки группы, которые изменяются при фиксации скейлинга. */
type ShapeGroupLayoutSnapshot = Readonly<{
  shapeAlignHorizontal: ShapeGroup['shapeAlignHorizontal']
  shapeAlignVertical: ShapeGroup['shapeAlignVertical']
  shapeBaseHeight: ShapeGroup['shapeBaseHeight']
  shapeBaseWidth: ShapeGroup['shapeBaseWidth']
  shapeLayoutSignature: ShapeGroup['shapeLayoutSignature']
  shapeManualBaseHeight: ShapeGroup['shapeManualBaseHeight']
  shapeManualBaseWidth: ShapeGroup['shapeManualBaseWidth']
  shapePaddingBottom: ShapeGroup['shapePaddingBottom']
  shapePaddingLeft: ShapeGroup['shapePaddingLeft']
  shapePaddingRight: ShapeGroup['shapePaddingRight']
  shapePaddingTop: ShapeGroup['shapePaddingTop']
  shapeReplaceBoxHeight: ShapeGroup['shapeReplaceBoxHeight']
  shapeReplaceBoxWidth: ShapeGroup['shapeReplaceBoxWidth']
  shapeTextAutoExpand: ShapeGroup['shapeTextAutoExpand']
}>

/** Скругление прямоугольника, которое переносится в узел шейпа при изменении размера. */
type ShapeNodeRoundingSnapshot = Readonly<{
  rx: number
  ry: number
}> | null

/** Свойства компоновки текста, которые могут измениться при фиксации размеров. */
type ShapeTextLayoutSnapshot = Readonly<{
  autoExpand: ShapeTextNode['autoExpand']
  splitByGrapheme: ShapeTextNode['splitByGrapheme']
  textAlign: ShapeTextNode['textAlign']
}>

/** Полный снимок изменяемой геометрии композиции шейпа для атомарной операции. */
export type ShapeScalingGeometrySnapshot = Readonly<{
  group: ShapeGroup
  groupGeometry: FabricGeometrySnapshot
  groupLayout: ShapeGroupLayoutSnapshot
  shape: ShapeNode
  shapeGeometry: FabricGeometrySnapshot
  shapeRounding: ShapeNodeRoundingSnapshot
  text: ShapeTextNode
  textGeometry: FabricGeometrySnapshot
  textLayout: ShapeTextLayoutSnapshot
}>

/** Сохраняет геометрию объекта Fabric через его штатные свойства преобразования. */
function captureFabricGeometry({
  object
}: {
  object: FabricObject
}): FabricGeometrySnapshot {
  return Object.freeze({
    height: object.height,
    originX: object.originX,
    originY: object.originY,
    transform: Object.freeze({ ...util.saveObjectTransform(object) }),
    width: object.width
  })
}

/** Восстанавливает геометрию объекта Fabric без его замены. */
function restoreFabricGeometry({
  object,
  snapshot
}: {
  object: FabricObject
  snapshot: FabricGeometrySnapshot
}): void {
  object.set({
    ...snapshot.transform,
    height: snapshot.height,
    originX: snapshot.originX,
    originY: snapshot.originY,
    width: snapshot.width,
    dirty: true
  })
  object.setCoords()
}

/** Сохраняет свойства компоновки группы, изменяемые при фиксации скейлинга. */
function captureGroupLayout({
  group
}: {
  group: ShapeGroup
}): ShapeGroupLayoutSnapshot {
  return Object.freeze({
    shapeAlignHorizontal: group.shapeAlignHorizontal,
    shapeAlignVertical: group.shapeAlignVertical,
    shapeBaseHeight: group.shapeBaseHeight,
    shapeBaseWidth: group.shapeBaseWidth,
    shapeLayoutSignature: group.shapeLayoutSignature,
    shapeManualBaseHeight: group.shapeManualBaseHeight,
    shapeManualBaseWidth: group.shapeManualBaseWidth,
    shapePaddingBottom: group.shapePaddingBottom,
    shapePaddingLeft: group.shapePaddingLeft,
    shapePaddingRight: group.shapePaddingRight,
    shapePaddingTop: group.shapePaddingTop,
    shapeReplaceBoxHeight: group.shapeReplaceBoxHeight,
    shapeReplaceBoxWidth: group.shapeReplaceBoxWidth,
    shapeTextAutoExpand: group.shapeTextAutoExpand
  })
}

/** Сохраняет прямоугольное скругление узла шейпа, если оно существует. */
function captureShapeRounding({
  shape
}: {
  shape: ShapeNode
}): ShapeNodeRoundingSnapshot {
  if (!(shape instanceof Rect)) return null

  return Object.freeze({
    rx: shape.rx,
    ry: shape.ry
  })
}

/** Восстанавливает скругление прямоугольного узла шейпа. */
function restoreShapeRounding({
  shape,
  snapshot
}: {
  shape: ShapeNode
  snapshot: ShapeNodeRoundingSnapshot
}): void {
  if (!snapshot) return
  if (!(shape instanceof Rect)) throw new Error('Скругление можно восстановить только для прямоугольного шейпа')

  shape.set(snapshot)
}

/** Сохраняет свойства внутреннего текста, изменяемые компоновкой шейпа. */
function captureTextLayout({
  text
}: {
  text: ShapeTextNode
}): ShapeTextLayoutSnapshot {
  return Object.freeze({
    autoExpand: text.autoExpand,
    splitByGrapheme: text.splitByGrapheme,
    textAlign: text.textAlign
  })
}

/** Восстанавливает внутреннее измерение текста для сохранённой ширины. */
function restoreTextGeometry({
  geometry,
  layout,
  text
}: {
  geometry: FabricGeometrySnapshot
  layout: ShapeTextLayoutSnapshot
  text: ShapeTextNode
}): void {
  text.set({
    autoExpand: layout.autoExpand,
    splitByGrapheme: layout.splitByGrapheme,
    textAlign: layout.textAlign,
    width: geometry.width
  })
  text.initDimensions()
  restoreFabricGeometry({ object: text, snapshot: geometry })
}

/** Сохраняет изменяемую геометрию группы, шейпа и текста до атомарного шага скейлинга. */
export function captureShapeScalingGeometry({
  group
}: {
  group: ShapeGroup
}): ShapeScalingGeometrySnapshot {
  const { shape, text } = getShapeNodes({ group })
  if (!shape || !text) throw new Error('Снимок скейлинга требует полноценную композицию шейпа')

  return Object.freeze({
    group,
    groupGeometry: captureFabricGeometry({ object: group }),
    groupLayout: captureGroupLayout({ group }),
    shape,
    shapeGeometry: captureFabricGeometry({ object: shape }),
    shapeRounding: captureShapeRounding({ shape }),
    text,
    textGeometry: captureFabricGeometry({ object: text }),
    textLayout: captureTextLayout({ text })
  })
}

/** Полностью восстанавливает композицию шейпа после незавершённой атомарной операции. */
export function restoreShapeScalingGeometry({
  snapshot
}: {
  snapshot: ShapeScalingGeometrySnapshot
}): void {
  const failures: unknown[] = []

  try {
    snapshot.group.set({ ...snapshot.groupLayout })
  } catch (error) {
    failures.push(error)
  }
  try {
    restoreFabricGeometry({ object: snapshot.shape, snapshot: snapshot.shapeGeometry })
    restoreShapeRounding({ shape: snapshot.shape, snapshot: snapshot.shapeRounding })
  } catch (error) {
    failures.push(error)
  }
  try {
    restoreTextGeometry({
      geometry: snapshot.textGeometry,
      layout: snapshot.textLayout,
      text: snapshot.text
    })
  } catch (error) {
    failures.push(error)
  }
  try {
    restoreFabricGeometry({ object: snapshot.group, snapshot: snapshot.groupGeometry })
  } catch (error) {
    failures.push(error)
  }

  const [firstFailure] = failures
  if (failures.length > 0) throw firstFailure
}

/** Пытается восстановить каждый шейп и возвращает первую ошибку только после полного прохода. */
export function restoreShapeScalingSnapshots({
  snapshots
}: {
  snapshots: readonly ShapeScalingGeometrySnapshot[]
}): void {
  const failures: unknown[] = []

  for (let index = snapshots.length - 1; index >= 0; index -= 1) {
    const snapshot = snapshots[index]
    if (!snapshot) {
      failures.push(new Error('Каждому шейпу должен соответствовать снимок геометрии'))
      continue
    }

    try {
      restoreShapeScalingGeometry({ snapshot })
    } catch (error) {
      failures.push(error)
    }
  }

  const [firstFailure] = failures
  if (failures.length > 0) throw firstFailure
}
