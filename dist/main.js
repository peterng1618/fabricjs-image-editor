import { ActiveSelection as e, Canvas as t, Color as n, Control as r, Ellipse as i, FabricImage as a, FitContentLayout as o, Gradient as s, Group as c, InteractiveFabricObject as l, LayoutManager as u, Path as d, Pattern as f, Point as p, Polygon as m, Polyline as h, Rect as g, Textbox as _, Triangle as v, classRegistry as y, controlsUtils as b, loadSVGFromString as x, loadSVGFromURL as S, util as C } from "fabric/es";
import { create as w } from "jsondiffpatch/with-text-diffs";
//#region node_modules/nanoid/url-alphabet/index.js
var T = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", E = (e = 21) => {
	let t = "", n = crypto.getRandomValues(new Uint8Array(e |= 0));
	for (; e--;) t += T[n[e] & 63];
	return t;
}, D = 300, O = 100, k = 16, A = .05, ee = .8, te = 50, ne = 1, re = class t {
	constructor({ editor: e, options: n = {} }) {
		this.isDragging = !1, this.lastPanPointerX = 0, this.lastPanPointerY = 0, this.lastGestureScale = 1, this.isUndoRedoKeyPressed = !1, this.isSpacePressed = !1, this.savedSelection = [], this.canvasDragging = !1, this.mouseWheelZooming = !1, this.resetObjectFitByDoubleClick = !1, this.copyObjectsByHotkey = !1, this.cutObjectsByHotkey = !1, this.duplicateObjectsByHotkey = !1, this.pasteImageFromClipboard = !1, this.undoRedoByHotKeys = !1, this.selectAllByHotkey = !1, this.deleteObjectsByHotkey = !1, this.adaptCanvasToContainerOnResize = !1, this.editor = e, this.canvas = e.canvas, this.options = n, this.handleContainerResizeBound = t.debounce(this.handleContainerResize.bind(this), 500), this.handleCopyEventBound = this.handleCopyEvent.bind(this), this.handleCutEventBound = this.handleCutEvent.bind(this), this.handleDuplicateEventBound = this.handleDuplicateEvent.bind(this), this.handlePasteEventBound = this.handlePasteEvent.bind(this), this.handleUndoRedoEventBound = this.handleUndoRedoEvent.bind(this), this.handleUndoRedoKeyUpBound = this.handleUndoRedoKeyUp.bind(this), this.handleSelectAllEventBound = this.handleSelectAllEvent.bind(this), this.handleDeleteObjectsEventBound = this.handleDeleteObjectsEvent.bind(this), this.handleSpaceKeyDownBound = this.handleSpaceKeyDown.bind(this), this.handleSpaceKeyUpBound = this.handleSpaceKeyUp.bind(this), this.handleObjectModifiedHistoryBound = this.handleObjectModifiedHistory.bind(this), this.handleObjectRotatingHistoryBound = this.handleObjectRotatingHistory.bind(this), this.handleObjectTransformStartBound = this.handleObjectTransformStart.bind(this), this.handleObjectTransformEndBound = this.handleObjectTransformEnd.bind(this), this.handleObjectAddedHistoryBound = this.handleObjectAddedHistory.bind(this), this.handleObjectRemovedHistoryBound = this.handleObjectRemovedHistory.bind(this), this.handleOverlayUpdateBound = this.handleOverlayUpdate.bind(this), this.handleBackgroundUpdateBound = this.handleBackgroundUpdate.bind(this), this.handleCanvasDragStartBound = this.handleCanvasDragStart.bind(this), this.handleCanvasDraggingBound = this.handleCanvasDragging.bind(this), this.handleCanvasDragEndBound = this.handleCanvasDragEnd.bind(this), this.handleCanvasWheelInputBound = this.handleCanvasWheelInput.bind(this), this.handleCanvasGestureStartBound = this.handleCanvasGestureStart.bind(this), this.handleCanvasGestureChangeBound = this.handleCanvasGestureChange.bind(this), this.handleCanvasGestureEndBound = this.handleCanvasGestureEnd.bind(this), this.handleResetObjectFitBound = this.handleResetObjectFit.bind(this), this.init();
	}
	init() {
		this._bindCanvasInteractionEvents(), this._bindDomEvents(), this._bindHistoryEvents(), this._bindOverlayEvents(), this._bindBackgroundEvents();
	}
	_bindCanvasInteractionEvents() {
		this.options.canvasDragging && (this.canvas.on("mouse:down", this.handleCanvasDragStartBound), this.canvas.on("mouse:move", this.handleCanvasDraggingBound), this.canvas.on("mouse:up", this.handleCanvasDragEndBound), document.addEventListener("keydown", this.handleSpaceKeyDownBound, { capture: !0 }), document.addEventListener("keyup", this.handleSpaceKeyUpBound, { capture: !0 })), (this.options.mouseWheelZooming || this.options.canvasDragging) && this.canvas.wrapperEl.addEventListener("wheel", this.handleCanvasWheelInputBound, {
			capture: !0,
			passive: !1
		}), this.options.mouseWheelZooming && (this.canvas.wrapperEl.addEventListener("gesturestart", this.handleCanvasGestureStartBound, {
			capture: !0,
			passive: !1
		}), this.canvas.wrapperEl.addEventListener("gesturechange", this.handleCanvasGestureChangeBound, {
			capture: !0,
			passive: !1
		}), this.canvas.wrapperEl.addEventListener("gestureend", this.handleCanvasGestureEndBound, {
			capture: !0,
			passive: !1
		})), this.options.resetObjectFitByDoubleClick && this.canvas.on("mouse:dblclick", this.handleResetObjectFitBound);
	}
	_bindDomEvents() {
		this.options.adaptCanvasToContainerOnResize && window.addEventListener("resize", this.handleContainerResizeBound, { capture: !0 }), this.options.copyObjectsByHotkey && document.addEventListener("keydown", this.handleCopyEventBound, { capture: !0 }), this.options.cutObjectsByHotkey && document.addEventListener("keydown", this.handleCutEventBound, { capture: !0 }), this.options.duplicateObjectsByHotkey && document.addEventListener("keydown", this.handleDuplicateEventBound, { capture: !0 }), this.options.pasteImageFromClipboard && document.addEventListener("paste", this.handlePasteEventBound, { capture: !0 }), this.options.undoRedoByHotKeys && (document.addEventListener("keydown", this.handleUndoRedoEventBound, { capture: !0 }), document.addEventListener("keyup", this.handleUndoRedoKeyUpBound, { capture: !0 })), this.options.selectAllByHotkey && document.addEventListener("keydown", this.handleSelectAllEventBound, { capture: !0 }), this.options.deleteObjectsByHotkey && document.addEventListener("keydown", this.handleDeleteObjectsEventBound, { capture: !0 });
	}
	_bindHistoryEvents() {
		this.canvas.on("object:modified", this.handleObjectModifiedHistoryBound), this.canvas.on("object:rotating", this.handleObjectRotatingHistoryBound), this.canvas.on("object:added", this.handleObjectAddedHistoryBound), this.canvas.on("object:removed", this.handleObjectRemovedHistoryBound), this.canvas.on("object:moving", this.handleObjectTransformStartBound), this.canvas.on("object:scaling", this.handleObjectTransformStartBound), this.canvas.on("object:rotating", this.handleObjectTransformStartBound), this.canvas.on("object:skewing", this.handleObjectTransformStartBound), this.canvas.on("object:resizing", this.handleObjectTransformStartBound), this.canvas.on("object:modified", this.handleObjectTransformEndBound);
	}
	_bindOverlayEvents() {
		this.canvas.on("object:added", this.handleOverlayUpdateBound), this.canvas.on("selection:created", this.handleOverlayUpdateBound);
	}
	_bindBackgroundEvents() {
		this.canvas.on("object:added", this.handleBackgroundUpdateBound), this.canvas.on("selection:created", this.handleBackgroundUpdateBound);
	}
	handleObjectModifiedHistory({ target: e } = {}) {
		let { historyManager: t, textManager: n } = this.editor, r = e;
		if (r?.shapeScalingNoopTransform) {
			r.shapeScalingNoopTransform = !1;
			return;
		}
		t.skipHistory || n.isTextEditingActive || t.scheduleSaveState({
			delayMs: D,
			reason: "object-modified"
		});
	}
	handleObjectRotatingHistory() {
		let { historyManager: e, textManager: t } = this.editor;
		e.skipHistory || t.isTextEditingActive || e.scheduleSaveState({
			delayMs: D,
			reason: "object-rotating"
		});
	}
	handleObjectTransformStart({ target: e }) {
		e && this.editor.historyManager.beginAction({ reason: "object-transform" });
	}
	handleObjectTransformEnd() {
		this.editor.historyManager.endAction({ reason: "object-transform" });
	}
	handleObjectAddedHistory() {
		this.editor.historyManager.skipHistory || this.editor.textManager.isTextEditingActive || this.editor.historyManager.saveState();
	}
	handleObjectRemovedHistory() {
		this.editor.historyManager.skipHistory || this.editor.textManager.isTextEditingActive || this.editor.historyManager.saveState();
	}
	handleOverlayUpdate() {
		let { interactionBlocker: e } = this.editor;
		!e.isBlocked || !e.overlayMask || this.editor.interactionBlocker.refresh();
	}
	handleBackgroundUpdate() {
		this.editor.historyManager.skipHistory || this.editor.backgroundManager.refresh();
	}
	handleContainerResize() {
		this.editor.canvasManager.updateCanvas();
	}
	handleCopyEvent(e) {
		let { ctrlKey: t, metaKey: n, code: r } = e;
		this._shouldIgnoreKeyboardEvent(e) || !t && !n || r !== "KeyC" || (e.preventDefault(), this.editor.clipboardManager.copy());
	}
	handleCutEvent(e) {
		let { ctrlKey: t, metaKey: n, code: r } = e;
		this._shouldIgnoreKeyboardEvent(e) || !t && !n || r !== "KeyX" || (e.preventDefault(), this.editor.clipboardManager.cut());
	}
	handleDuplicateEvent(e) {
		let { ctrlKey: t, metaKey: n, code: r } = e;
		this._shouldIgnoreKeyboardEvent(e) || !t && !n || r !== "KeyD" || (e.preventDefault(), this.editor.clipboardManager.copyPaste());
	}
	handlePasteEvent(e) {
		this._shouldIgnoreKeyboardEvent(e) || this.editor.clipboardManager.handlePasteEvent(e);
	}
	async handleUndoRedoEvent(e) {
		let { ctrlKey: t, metaKey: n, code: r, repeat: i } = e;
		if (!this._shouldIgnoreKeyboardEvent(e) && !(!t && !n || i) && !(r !== "KeyZ" && r !== "KeyY")) {
			if (this.editor.interactionBlocker.isBlocked) {
				e.preventDefault(), this.isUndoRedoKeyPressed = !1;
				return;
			}
			!/Mac/i.test(navigator.userAgent) && this.isUndoRedoKeyPressed || (r === "KeyZ" ? (e.preventDefault(), this.isUndoRedoKeyPressed = !0, await this.editor.historyManager.undo()) : r === "KeyY" && (e.preventDefault(), this.isUndoRedoKeyPressed = !0, await this.editor.historyManager.redo()));
		}
	}
	handleUndoRedoKeyUp(e) {
		this._shouldIgnoreKeyboardEvent(e) || ["KeyZ", "KeyY"].includes(e.code) && (this.isUndoRedoKeyPressed = !1);
	}
	handleSelectAllEvent(e) {
		if (this._shouldIgnoreKeyboardEvent(e)) return;
		let { ctrlKey: t, metaKey: n, code: r } = e;
		!t && !n || r !== "KeyA" || (e.preventDefault(), this.editor.selectionManager.selectAll());
	}
	handleDeleteObjectsEvent(e) {
		this._shouldIgnoreKeyboardEvent(e) || e.code !== "Delete" && e.code !== "Backspace" || (e.preventDefault(), this.editor.deletionManager.deleteSelectedObjects());
	}
	handleSpaceKeyDown(t) {
		let { code: n } = t;
		if (n !== "Space" || this._shouldIgnoreKeyboardEvent(t)) return;
		if (this._isObjectTransforming()) {
			t.preventDefault();
			return;
		}
		let { canvas: r, editor: i, isSpacePressed: a, isDragging: o } = this;
		if (a || o) return;
		i.historyManager.skipHistory || i.historyManager.saveState(), i.historyManager.suspendHistory(), this.isSpacePressed = !0, t.preventDefault();
		let s = r.getActiveObject() || null;
		s instanceof e ? this.savedSelection = s.getObjects().slice() : s && (this.savedSelection = [s]), r.discardActiveObject(), r.set({
			selection: !1,
			defaultCursor: "grab"
		}), r.setCursor("grab"), i.canvasManager.getObjects().forEach((e) => {
			e.set({
				selectable: !1,
				evented: !1
			});
		}), r.requestRenderAll();
	}
	handleSpaceKeyUp(e) {
		let { code: t } = e;
		t === "Space" && (this._shouldIgnoreKeyboardEvent(e) && !this.isSpacePressed || this.isSpacePressed && (this.isSpacePressed = !1, this.isDragging && this.handleCanvasDragEnd(), this.canvas.set({
			defaultCursor: "default",
			selection: !0
		}), this.canvas.setCursor("default"), this.editor.canvasManager.getObjects().forEach((e) => {
			e.set({
				selectable: !0,
				evented: !0
			});
		}), this._restoreSelection(this.savedSelection), this.savedSelection = [], this.editor.historyManager.resumeHistory(), this.canvas.requestRenderAll()));
	}
	_restoreSelection(t) {
		let { canvas: n, editor: r } = this;
		if (t.length === 0) return;
		if (t.length === 1) {
			n.setActiveObject(t[0]);
			return;
		}
		let i = t.filter((e) => r.canvasManager.getObjects().includes(e)), a = new e(i, { canvas: n });
		i.some((e) => e.locked) && r.objectLockManager.lockObject({
			object: a,
			skipInnerObjects: !0,
			withoutSave: !0
		}), n.setActiveObject(a);
	}
	_isObjectTransforming() {
		let { canvas: e } = this, { _currentTransform: t } = e;
		return !!t;
	}
	handleCanvasDragStart({ e }) {
		let t = this._getPanPointer(e);
		t && (this.isDragging = !0, this.lastPanPointerX = t.x, this.lastPanPointerY = t.y, this._isClientPointerEvent(e) && (this.canvas.set("defaultCursor", "grabbing"), this.canvas.setCursor("grabbing")));
	}
	handleCanvasDragging({ e }) {
		if (!this.isDragging) return;
		let t = this._getPanPointer(e);
		t && this.editor.panConstraintManager.applyPanDelta({
			deltaX: t.x - this.lastPanPointerX,
			deltaY: t.y - this.lastPanPointerY
		}) && (this.lastPanPointerX = t.x, this.lastPanPointerY = t.y, e.cancelable && e.preventDefault());
	}
	handleCanvasDragEnd() {
		this.isDragging && (this.canvas.setViewportTransform(this.canvas.viewportTransform), this.isDragging = !1, this.isSpacePressed && (this.canvas.set("defaultCursor", "grab"), this.canvas.setCursor("grab")));
	}
	_getPanPointer(e) {
		return this._getTwoTouchCenter(e) || (this._isClientPointerEvent(e) && this.isSpacePressed ? {
			x: e.clientX,
			y: e.clientY
		} : null);
	}
	_isClientPointerEvent(e) {
		let t = e;
		return typeof t.clientX == "number" && typeof t.clientY == "number";
	}
	_getTwoTouchCenter(e) {
		if (!("touches" in e)) return null;
		let { touches: t } = e;
		if (t.length !== 2) return null;
		let n = t[0], r = t[1];
		return !n || !r ? null : {
			x: (n.clientX + r.clientX) / 2,
			y: (n.clientY + r.clientY) / 2
		};
	}
	_calculateAdaptiveZoomStep(e) {
		let t = this.canvas.getZoom(), n = this._normalizeWheelDeltaY(e), r = this._isTrackpadPinchWheel(e) ? ee : A, i = n / O;
		return -(t * r * i);
	}
	_normalizeWheelDelta({ event: e, axis: t }) {
		let n = t === "x" ? e.deltaX : e.deltaY;
		return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? n * k : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n * (t === "x" ? this.canvas.getWidth() : this.canvas.getHeight()) : n;
	}
	_normalizeWheelDeltaY(e) {
		return this._normalizeWheelDelta({
			event: e,
			axis: "y"
		});
	}
	_isTrackpadPinchWheel(e) {
		let t = Math.abs(this._normalizeWheelDeltaY(e));
		return e.deltaMode === WheelEvent.DOM_DELTA_PIXEL && t < te;
	}
	_getWheelPanDelta(e) {
		return {
			deltaX: -this._normalizeWheelDelta({
				event: e,
				axis: "x"
			}),
			deltaY: -this._normalizeWheelDelta({
				event: e,
				axis: "y"
			})
		};
	}
	_calculateGestureZoomStep(e) {
		let t = this.canvas.getZoom(), n = e / this.lastGestureScale;
		return !Number.isFinite(n) || n <= 0 ? 0 : t * (n - 1) * ne;
	}
	_isCanvasGestureEvent(e) {
		return "scale" in e && typeof e.scale == "number";
	}
	_getGesturePointer(e) {
		let { clientX: t, clientY: n } = e;
		if (typeof t == "number" && typeof n == "number") return {
			clientX: t,
			clientY: n
		};
		let r = this.canvas.wrapperEl.getBoundingClientRect();
		return {
			clientX: r.left + r.width / 2,
			clientY: r.top + r.height / 2
		};
	}
	handleCanvasWheelInput(e) {
		if (!e.ctrlKey && !e.metaKey) {
			this._handleCanvasWheelPan(e);
			return;
		}
		e.preventDefault(), e.stopPropagation();
		let t = this._calculateAdaptiveZoomStep(e);
		this.editor.zoomManager.handlePointerZoom(t, e);
	}
	_handleCanvasWheelPan(e) {
		this.options.canvasDragging && this.editor.panConstraintManager.applyPanDelta(this._getWheelPanDelta(e)) && (e.preventDefault(), e.stopPropagation());
	}
	handleCanvasGestureStart(e) {
		this._isCanvasGestureEvent(e) && (e.preventDefault(), e.stopPropagation(), this.lastGestureScale = e.scale > 0 ? e.scale : 1);
	}
	handleCanvasGestureChange(e) {
		if (!this._isCanvasGestureEvent(e)) return;
		e.preventDefault(), e.stopPropagation();
		let t = this._calculateGestureZoomStep(e.scale);
		if (this.lastGestureScale = e.scale, !t) return;
		let n = this._getGesturePointer(e);
		this.editor.zoomManager.handlePointerZoom(t, n);
	}
	handleCanvasGestureEnd(e) {
		this._isCanvasGestureEvent(e) && (e.preventDefault(), e.stopPropagation()), this.lastGestureScale = 1;
	}
	handleResetObjectFit(e) {
		let { target: t, e: n } = e;
		n && (n.ctrlKey || n.metaKey) || this.editor.cropManager.resetFrameToSource({ target: t }) || !t || t instanceof _ || t.shapeComposite || this.editor.transformManager.resetObject({ object: t });
	}
	_shouldIgnoreKeyboardEvent(e) {
		let t = document.activeElement, n = e.target, r = [
			"input",
			"textarea",
			"select"
		];
		if (n) {
			let i = n.tagName.toLowerCase();
			if (e.type === "paste" && r.includes(i)) {
				let e = t?.tagName.toLowerCase();
				return !!(e && r.includes(e));
			}
			if (r.includes(i) || n.contentEditable === "true") return !0;
		}
		if (t && t !== n) {
			let e = t.tagName.toLowerCase();
			if (r.includes(e) || t.contentEditable === "true") return !0;
		}
		let i = window.getSelection();
		if (i && !i.isCollapsed && i.rangeCount > 0) {
			let e = i.getRangeAt(0).commonAncestorContainer;
			e.nodeType === Node.TEXT_NODE && (e = e.parentElement);
			let { keyboardIgnoreSelectors: t } = this.options;
			if (t?.length && e) for (let n of t) try {
				let t = e;
				if (t.matches && t.matches(n) || t.closest && t.closest(n)) return !0;
			} catch (e) {
				console.warn(`Error checking selection container with selector "${n}":`, e);
			}
		}
		return !1;
	}
	destroy() {
		window.removeEventListener("resize", this.handleContainerResizeBound, { capture: !0 }), document.removeEventListener("keydown", this.handleCopyEventBound, { capture: !0 }), document.removeEventListener("keydown", this.handleCutEventBound, { capture: !0 }), document.removeEventListener("keydown", this.handleDuplicateEventBound, { capture: !0 }), document.removeEventListener("paste", this.handlePasteEventBound, { capture: !0 }), document.removeEventListener("keydown", this.handleUndoRedoEventBound, { capture: !0 }), document.removeEventListener("keyup", this.handleUndoRedoKeyUpBound, { capture: !0 }), document.removeEventListener("keydown", this.handleSelectAllEventBound, { capture: !0 }), document.removeEventListener("keydown", this.handleDeleteObjectsEventBound, { capture: !0 }), this.options.canvasDragging && (this.canvas.off("mouse:down", this.handleCanvasDragStartBound), this.canvas.off("mouse:move", this.handleCanvasDraggingBound), this.canvas.off("mouse:up", this.handleCanvasDragEndBound), document.removeEventListener("keydown", this.handleSpaceKeyDownBound, { capture: !0 }), document.removeEventListener("keyup", this.handleSpaceKeyUpBound, { capture: !0 }));
		let e = this.canvas.wrapperEl;
		e && (this.options.mouseWheelZooming || this.options.canvasDragging) && e.removeEventListener("wheel", this.handleCanvasWheelInputBound, { capture: !0 }), e && this.options.mouseWheelZooming && (e.removeEventListener("gesturestart", this.handleCanvasGestureStartBound, { capture: !0 }), e.removeEventListener("gesturechange", this.handleCanvasGestureChangeBound, { capture: !0 }), e.removeEventListener("gestureend", this.handleCanvasGestureEndBound, { capture: !0 })), this.options.resetObjectFitByDoubleClick && this.canvas.off("mouse:dblclick", this.handleResetObjectFitBound), this.canvas.off("object:modified", this.handleObjectModifiedHistoryBound), this.canvas.off("object:rotating", this.handleObjectRotatingHistoryBound), this.canvas.off("object:added", this.handleObjectAddedHistoryBound), this.canvas.off("object:removed", this.handleObjectRemovedHistoryBound), this.canvas.off("object:moving", this.handleObjectTransformStartBound), this.canvas.off("object:scaling", this.handleObjectTransformStartBound), this.canvas.off("object:rotating", this.handleObjectTransformStartBound), this.canvas.off("object:skewing", this.handleObjectTransformStartBound), this.canvas.off("object:resizing", this.handleObjectTransformStartBound), this.canvas.off("object:modified", this.handleObjectTransformEndBound), this.canvas.off("object:added", this.handleOverlayUpdateBound), this.canvas.off("selection:created", this.handleOverlayUpdateBound), this.canvas.off("object:added", this.handleBackgroundUpdateBound), this.canvas.off("selection:created", this.handleBackgroundUpdateBound);
	}
	static debounce(e, t) {
		let n = null;
		return function(...r) {
			n !== null && clearTimeout(n), n = setTimeout(() => {
				e.apply(this, r);
			}, t);
		};
	}
}, ie = class {
	constructor() {
		this.cache = /* @__PURE__ */ new Map(), this.loaders = { jspdf: () => import("jspdf") };
	}
	loadModule(e) {
		return this.loaders[e] ? (this.cache.has(e) || this.cache.set(e, this.loaders[e]()), this.cache.get(e)) : Promise.reject(/* @__PURE__ */ Error(`Unknown module "${e}"`));
	}
};
//#endregion
//#region src/editor/worker-manager/worker.ts?worker
function ae(e) {
	return new Worker("" + new URL("assets/worker-Ds8wxpzF.js", import.meta.url).href, { name: e?.name });
}
//#endregion
//#region src/editor/worker-manager/index.ts
var oe = class {
	constructor(e) {
		e ? this.worker = new Worker(e, { type: "module" }) : this.worker = new ae(), this._callbacks = /* @__PURE__ */ new Map(), this.worker.onmessage = this._handleMessage.bind(this);
	}
	_handleMessage({ data: e }) {
		let { requestId: t, success: n, data: r, error: i } = e, a = this._callbacks.get(t);
		if (!a) {
			console.warn(`No callback found for requestId: ${t}`);
			return;
		}
		n ? a.resolve(r) : a.reject(Error(i)), this._callbacks.delete(t);
	}
	post(e, t, n = []) {
		let r = `${e}:${E(8)}`;
		return new Promise((i, a) => {
			this._callbacks.set(r, {
				resolve: i,
				reject: a
			}), this.worker.postMessage({
				action: e,
				payload: t,
				requestId: r
			}, n);
		});
	}
	terminate() {
		this.worker.terminate();
	}
}, se = "#2B2D33", j = "#3D8BF4", ce = "#FFFFFF";
//#endregion
//#region src/editor/customized-controls/renderers.ts
function le(e, t, n, r, i) {
	e.save(), e.translate(t, n), e.rotate(C.degreesToRadians(i.angle)), e.fillStyle = ce, e.strokeStyle = j, e.lineWidth = 1, e.beginPath(), e.roundRect(-12 / 2, -12 / 2, 12, 12, 2), e.fill(), e.stroke(), e.restore();
}
function ue(e, t, n, r, i) {
	e.save(), e.translate(t, n), e.rotate(C.degreesToRadians(i.angle)), e.fillStyle = ce, e.strokeStyle = j, e.lineWidth = 1, e.beginPath(), e.roundRect(-8 / 2, -20 / 2, 8, 20, 100), e.fill(), e.stroke(), e.restore();
}
function de(e, t, n, r, i) {
	e.save(), e.translate(t, n), e.rotate(C.degreesToRadians(i.angle)), e.fillStyle = ce, e.strokeStyle = j, e.lineWidth = 1, e.beginPath(), e.roundRect(-20 / 2, -8 / 2, 20, 8, 100), e.fill(), e.stroke(), e.restore();
}
var fe = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE4Ljc1IDQuMzc1djMuNzVhLjYyNS42MjUgMCAwIDEtLjYyNS42MjVoLTMuNzVhLjYyNS42MjUgMCAwIDEgMC0xLjI1aDIuMTRsLTIuMDc3LTEuOTAzLS4wMi0uMDE5YTYuMjUgNi4yNSAwIDEgMC0uMTMgOC45NjcuNjI2LjYyNiAwIDAgMSAuODYuOTA5QTcuNDU2IDcuNDU2IDAgMCAxIDEwIDE3LjVoLS4xMDNhNy41IDcuNSAwIDEgMSA1LjM5Ni0xMi44MTJMMTcuNSA2LjcwM1Y0LjM3NWEuNjI1LjYyNSAwIDAgMSAxLjI1IDBaIi8+PC9zdmc+", pe = new Image();
pe.src = fe;
function me(e, t, n, r, i) {
	e.save(), e.translate(t, n), e.rotate(C.degreesToRadians(i.angle)), e.fillStyle = se, e.beginPath(), e.arc(0, 0, 16, 0, 2 * Math.PI), e.fill(), e.drawImage(pe, -16 / 2, -16 / 2, 16, 16), e.restore();
}
//#endregion
//#region src/editor/customized-controls/default-controls.ts
var he = {
	tl: {
		render: le,
		sizeX: 12,
		sizeY: 12,
		offsetX: 0,
		offsetY: 0
	},
	tr: {
		render: le,
		sizeX: 12,
		sizeY: 12,
		offsetX: 0,
		offsetY: 0
	},
	bl: {
		render: le,
		sizeX: 12,
		sizeY: 12,
		offsetX: 0,
		offsetY: 0
	},
	br: {
		render: le,
		sizeX: 12,
		sizeY: 12,
		offsetX: 0,
		offsetY: 0
	},
	ml: {
		render: ue,
		sizeX: 8,
		sizeY: 20,
		offsetX: 0,
		offsetY: 0
	},
	mr: {
		render: ue,
		sizeX: 8,
		sizeY: 20,
		offsetX: 0,
		offsetY: 0
	},
	mt: {
		render: de,
		sizeX: 20,
		sizeY: 8,
		offsetX: 0,
		offsetY: 0
	},
	mb: {
		render: de,
		sizeX: 20,
		sizeY: 8,
		offsetX: 0,
		offsetY: 0
	},
	mtr: {
		render: me,
		sizeX: 32,
		sizeY: 32,
		offsetX: 0,
		offsetY: -32
	}
}, ge = [
	"tl",
	"tr",
	"bl",
	"br"
], _e = ({ target: e, transform: t }) => {
	let n = t.corner;
	return !ge.some((e) => e === n) || t.action !== "scale" ? !1 : !!e.controls[n]?.shapeFreeScaleCornerControl;
}, ve = ({ shiftKey: e }) => e ? "free" : "uniform", ye = ({ transform: e }) => {
	let { originX: t, originY: n } = e;
	return (t === "center" || t === .5) && (n === "center" || n === .5);
}, be = ({ transform: e, x: t, y: n }) => {
	let r = e, { target: i } = r, { scaleX: a = 1, scaleY: o = 1 } = i, s = b.getLocalPoint(r, r.originX, r.originY, t, n), c = Math.sign(s.x || r.signX || 1), l = Math.sign(s.y || r.signY || 1);
	r.signX === void 0 && (r.signX = c), r.signY === void 0 && (r.signY = l);
	let u = i._getTransformedDimensions(), d = Math.abs(s.x * a / u.x), f = Math.abs(s.y * o / u.y);
	ye({ transform: r }) && (d *= 2, f *= 2);
	let p = !i.lockScalingX && (!i.lockScalingFlip || r.signX === c), m = !i.lockScalingY && (!i.lockScalingFlip || r.signY === l);
	return p && i.set("scaleX", d), m && i.set("scaleY", f), a !== i.scaleX || o !== i.scaleY;
}, xe = () => {
	let e = b.wrapWithFireEvent("scaling", b.wrapWithFixedAnchor((e, t, n, r) => be({
		transform: t,
		x: n,
		y: r
	})));
	return (t, n, r, i) => {
		let { canvas: a } = n.target, o = ve({ shiftKey: !!t.shiftKey });
		if (!a || o === "free") return e(t, n, r, i);
		let { uniformScaling: s } = a;
		a.uniformScaling = !0;
		try {
			return b.scalingEqually(t, n, r, i);
		} finally {
			a.uniformScaling = s;
		}
	};
}, Se = ({ control: e }) => {
	let t = new r({
		...e,
		actionHandler: xe()
	});
	return t.shapeFreeScaleCornerControl = !0, t;
}, Ce = ({ target: e }) => {
	let t = { ...e.controls }, n = !1;
	ge.forEach((r) => {
		let i = e.controls[r];
		i && (i.shapeFreeScaleCornerControl || (t[r] = Se({ control: i }), n = !0));
	}), n && (e.controls = t);
}, we = class t {
	static wrapWidthControl(e) {
		if (!e?.actionHandler) return;
		let t = e.actionHandler;
		e.actionHandler = (e, n, r, i) => {
			let a = n?.target;
			return !a || a.locked || a.lockScalingX ? !1 : t(e, n, r, i);
		};
	}
	static applyControlOverrides(e) {
		Object.entries(he).forEach(([t, n]) => {
			let r = e[t];
			r && (Object.assign(r, n), t === "mtr" && (r.cursorStyle = "grab", r.mouseDownHandler = (e, t, n, r) => {
				let i = t?.target;
				!i || i.locked || i.lockRotation || i.canvas?.setCursor("grabbing");
			}));
		});
	}
	static apply() {
		let e = b.createObjectDefaultControls();
		t.applyControlOverrides(e), l.ownDefaults.controls = e;
		let n = b.createTextboxDefaultControls();
		t.applyControlOverrides(n), n.mt && (n.mt.visible = !1), n.mb && (n.mb.visible = !1), t.wrapWidthControl(n.ml), t.wrapWidthControl(n.mr), _.ownDefaults.controls = n, t.patchActiveSelectionBounds(), l.ownDefaults.snapAngle = 1;
	}
	static patchActiveSelectionBounds() {
		let n = e.prototype, r = n._calcBoundsFromObjects;
		n._calcBoundsFromObjects = function(...e) {
			let n = this.getObjects?.() ?? [];
			t.applyActiveSelectionScalingRules({
				selection: this,
				objects: n
			});
			let i = t.calculateActiveSelectionBounds({ objects: n });
			if (!i) return r ? r.apply(this, e) : void 0;
			let { left: a, top: o, width: s, height: c } = i;
			this.set({
				flipX: !1,
				flipY: !1,
				width: s,
				height: c
			});
			let l = new p(a + s / 2, o + c / 2);
			return this.setPositionByOrigin(l, "center", "center"), i;
		};
		let i = n._onAfterObjectsChange;
		n._onAfterObjectsChange = function(e, n) {
			let r = i ? i.call(this, e, n) : void 0, a = this.getObjects?.() ?? [];
			t.applyActiveSelectionScalingRules({
				selection: this,
				objects: a
			});
			let o = t.calculateActiveSelectionBounds({ objects: a });
			if (!o) return r;
			let { left: s, top: c, width: l, height: u } = o, d = new p(s + l / 2, c + u / 2);
			return this.set({
				width: l,
				height: u
			}), this.setPositionByOrigin(d, "center", "center"), this.setCoords(), r;
		};
		let a = o.prototype.calcBoundingBox;
		o.prototype.calcBoundingBox = function(n, r) {
			let { target: i, type: o } = r;
			if (o === "imperative" && r.overrides) return r.overrides;
			if (!(i instanceof e)) return a.call(this, n, r);
			t.applyActiveSelectionScalingRules({
				selection: i,
				objects: n
			});
			let s = t.calculateActiveSelectionBounds({ objects: n });
			if (!s) return a.call(this, n, r);
			let { left: c, top: l, width: u, height: d } = s, f = new p(u, d), m = new p(c + u / 2, l + d / 2);
			return o === "initialization" ? {
				center: m,
				relativeCorrection: new p(0, 0),
				size: f
			} : {
				center: m,
				size: f
			};
		};
	}
	static calculateActiveSelectionBounds({ objects: e }) {
		if (!e.length) return null;
		let t = e.map((e) => e.getBoundingRect()), n = Math.min(...t.map(({ left: e }) => e)), r = Math.min(...t.map(({ top: e }) => e)), i = Math.max(...t.map(({ left: e, width: t }) => e + t));
		return {
			height: Math.max(...t.map(({ top: e, height: t }) => e + t)) - r,
			left: n,
			top: r,
			width: i - n
		};
	}
	static applyActiveSelectionScalingRules({ selection: e, objects: t }) {
		let n = t.some((e) => e instanceof _), r = t.some((e) => e.shapeComposite === !0), i = n || r;
		e.set({ lockScalingFlip: i }), r && Ce({ target: e }), e.setControlsVisibility({
			mt: !n,
			mb: !n,
			ml: !0,
			mr: !0
		});
	}
}, Te = class e {
	static {
		this.registeredFontKeys = /* @__PURE__ */ new Set();
	}
	static {
		this.descriptorDefaults = {
			style: "normal",
			weight: "normal",
			stretch: "normal",
			unicodeRange: "U+0-10FFFF",
			variant: "normal",
			featureSettings: "normal",
			display: "auto"
		};
	}
	constructor(e = []) {
		this.fonts = e;
	}
	setFonts(e) {
		this.fonts = e;
	}
	async loadFonts() {
		let t = this.fonts ?? [];
		if (!t.length) return;
		let n = typeof document < "u" ? document : void 0;
		if (!n) return;
		let r = t.map((t) => e.loadFont(t, n));
		await Promise.allSettled(r);
	}
	static async loadFont(t, n) {
		let r = typeof FontFace < "u", i = t.family?.trim(), a = t.source?.trim();
		if (!i || !a) return;
		let o = e.normalizeFontSource(a), s = e.getDescriptorSnapshot(t.descriptors), c = e.getFontRegistrationKey(i, o, s);
		if (!e.registeredFontKeys.has(c)) {
			if (e.isFontFaceAlreadyApplied(n, i, s)) {
				e.registeredFontKeys.add(c);
				return;
			}
			if (r && n.fonts && typeof n.fonts.add == "function") try {
				let r = await new FontFace(i, o, t.descriptors).load();
				n.fonts.add(r), e.registeredFontKeys.add(c);
				return;
			} catch (e) {
				console.warn(`Не удалось загрузить шрифт "${i}" через FontFace API`, e);
			}
			e.injectFontFace({
				font: t,
				source: o,
				doc: n,
				registrationKey: c
			});
		}
	}
	static injectFontFace({ font: t, source: n, doc: r, registrationKey: i }) {
		let { descriptors: a } = t, o = t.family?.trim();
		if (!o) return;
		let s = r.createElement("style");
		s.setAttribute("data-editor-font", o), s.setAttribute("data-editor-font-key", i);
		let c = e.descriptorsToCss(a);
		s.textContent = [
			"@font-face {",
			`  font-family: ${e.formatFontFamilyForCss(o)};`,
			`  src: ${n};`,
			...c.map((e) => `  ${e}`),
			"}"
		].join("\n"), r.head.appendChild(s), e.registeredFontKeys.add(i);
	}
	static normalizeFontSource(e) {
		let t = e.trim();
		return /^(url|local)\(/i.test(t) ? t : `url('${t.replace(/'/g, "\\'")}')`;
	}
	static formatFontFamilyForCss(e) {
		return `'${e.replace(/'/g, "\\'")}'`;
	}
	static normalizeDescriptorValue(e, t) {
		if (typeof e == "string") {
			let n = e.trim();
			return n.length > 0 ? n : t;
		}
		if (e == null) return t;
		let n = `${e}`.trim();
		return n.length > 0 ? n : t;
	}
	static normalizeFamilyName(e) {
		return e ? e.trim().replace(/^['"]+|['"]+$/g, "").toLowerCase() : "";
	}
	static getDescriptorSnapshot(t) {
		let n = e.descriptorDefaults;
		return {
			style: e.normalizeDescriptorValue(t?.style, n.style),
			weight: e.normalizeDescriptorValue(t?.weight, n.weight),
			stretch: e.normalizeDescriptorValue(t?.stretch, n.stretch),
			unicodeRange: e.normalizeDescriptorValue(t?.unicodeRange, n.unicodeRange),
			variant: e.normalizeDescriptorValue(t?.variant, n.variant),
			featureSettings: e.normalizeDescriptorValue(t?.featureSettings, n.featureSettings),
			display: e.normalizeDescriptorValue(t?.display, n.display)
		};
	}
	static areDescriptorSnapshotsEqual(e, t) {
		return e.style === t.style && e.weight === t.weight && e.stretch === t.stretch && e.unicodeRange === t.unicodeRange && e.variant === t.variant && e.featureSettings === t.featureSettings && e.display === t.display;
	}
	static getFontRegistrationKey(t, n, r) {
		return [
			e.normalizeFamilyName(t),
			n,
			r.style,
			r.weight,
			r.stretch,
			r.unicodeRange,
			r.variant,
			r.featureSettings,
			r.display
		].join("::");
	}
	static isFontFaceAlreadyApplied(t, n, r) {
		let i = t.fonts;
		if (!i || typeof i.forEach != "function") return !1;
		let a = e.normalizeFamilyName(n), o = !1;
		try {
			i.forEach((t) => {
				if (o || e.normalizeFamilyName(t.family) !== a) return;
				let n = t, i = e.getDescriptorSnapshot({
					style: n.style,
					weight: n.weight,
					stretch: n.stretch,
					unicodeRange: n.unicodeRange,
					variant: n.variant,
					featureSettings: n.featureSettings,
					display: n.display
				});
				e.areDescriptorSnapshotsEqual(r, i) && (o = !0);
			});
		} catch (e) {
			return console.warn("Не удалось проверить, загружен ли шрифт ранее через FontFaceSet", e), !1;
		}
		return o;
	}
	static descriptorsToCss(e) {
		if (!e) return [];
		let t = {
			style: "font-style",
			weight: "font-weight",
			stretch: "font-stretch",
			unicodeRange: "unicode-range",
			variant: "font-variant",
			featureSettings: "font-feature-settings",
			display: "font-display",
			ascentOverride: "ascent-override",
			descentOverride: "descent-override",
			lineGapOverride: "line-gap-override"
		};
		return Object.entries(e).filter(([, e]) => e != null && `${e}`.length > 0).map(([e, n]) => `${t[e] ?? e}: ${n};`);
	}
};
function M({ rounding: e }) {
	return typeof e != "number" || !Number.isFinite(e) ? 0 : Math.min(100, Math.max(0, e));
}
function Ee({ rounding: e }) {
	return M({ rounding: e }) / 100;
}
//#endregion
//#region src/editor/shape-manager/domain/shape-presets.ts
var N = 180, De = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
}, Oe = .45, ke = ({ value: e }) => Number(e.toFixed(4)), P = ({ width: e, height: t }) => {
	let n = N / Math.max(e, t);
	return {
		width: ke({ value: e * n }),
		height: ke({ value: t * n })
	};
}, Ae = ({ spikes: e, outerRadius: t = 50, innerRadius: n = 22, centerX: r = 50, centerY: i = 50, rotation: a = -Math.PI / 2 }) => {
	let o = [], s = e * 2;
	for (let c = 0; c < s; c += 1) {
		let s = c % 2 == 0 ? t : n, l = a + c * Math.PI / e;
		o.push({
			x: ke({ value: r + s * Math.cos(l) }),
			y: ke({ value: i + s * Math.sin(l) })
		});
	}
	return o;
}, je = [
	{
		key: "circle",
		type: "ellipse",
		width: N,
		height: N,
		internalTextInset: {
			top: .05,
			right: .05,
			bottom: .05,
			left: .05
		}
	},
	{
		key: "pie",
		type: "path",
		...P({
			width: 34,
			height: 34
		}),
		path: "M34 17A17 17 0 1 1 17 0v17z"
	},
	{
		key: "triangle",
		type: "triangle",
		...P({
			width: 38,
			height: 31
		}),
		internalTextInset: {
			top: .34,
			right: .24,
			bottom: .12,
			left: .24
		}
	},
	{
		key: "square",
		type: "rect",
		width: N,
		height: N
	},
	{
		key: "diamond",
		type: "polygon",
		width: N,
		height: N,
		points: [
			{
				x: 50,
				y: 0
			},
			{
				x: 100,
				y: 50
			},
			{
				x: 50,
				y: 100
			},
			{
				x: 0,
				y: 50
			}
		],
		internalTextInset: {
			top: .3,
			right: .24,
			bottom: .3,
			left: .24
		}
	},
	{
		key: "pentagon",
		type: "polygon",
		...P({
			width: 36,
			height: 33
		}),
		points: [
			{
				x: 50,
				y: 0
			},
			{
				x: 100,
				y: 38.197
			},
			{
				x: 80.9028,
				y: 100
			},
			{
				x: 19.0972,
				y: 100
			},
			{
				x: 0,
				y: 38.197
			}
		],
		internalTextInset: {
			top: .24,
			right: .08,
			bottom: .08,
			left: .08
		}
	},
	{
		key: "hexagon",
		type: "polygon",
		...P({
			width: 32,
			height: 36
		}),
		points: [
			{
				x: 50,
				y: 0
			},
			{
				x: 100,
				y: 25
			},
			{
				x: 100,
				y: 75
			},
			{
				x: 50,
				y: 100
			},
			{
				x: 0,
				y: 75
			},
			{
				x: 0,
				y: 25
			}
		],
		internalTextInset: {
			top: .22,
			bottom: .22
		}
	},
	{
		key: "star",
		type: "polygon",
		...P({
			width: 38,
			height: 36
		}),
		points: [
			{
				x: 50,
				y: 0
			},
			{
				x: 61.8026,
				y: 38.1944
			},
			{
				x: 100,
				y: 38.1944
			},
			{
				x: 69.0974,
				y: 61.8056
			},
			{
				x: 80.9026,
				y: 100
			},
			{
				x: 50,
				y: 76.3944
			},
			{
				x: 19.0974,
				y: 100
			},
			{
				x: 30.9026,
				y: 61.8056
			},
			{
				x: 0,
				y: 38.1944
			},
			{
				x: 38.1974,
				y: 38.1944
			}
		],
		internalTextInset: {
			top: .38,
			right: .3,
			bottom: .22,
			left: .3
		}
	},
	{
		key: "star-16",
		type: "polygon",
		width: N,
		height: N,
		points: Ae({
			spikes: 16,
			outerRadius: 50,
			innerRadius: 45,
			rotation: -Math.PI / 2
		}),
		internalTextInset: {
			top: .05,
			right: .05,
			bottom: .05,
			left: .05
		}
	},
	{
		key: "sparkle",
		type: "polygon",
		width: N,
		height: N,
		points: Ae({
			spikes: 4,
			outerRadius: 50,
			innerRadius: 19.1,
			rotation: -Math.PI / 2
		}),
		internalTextInset: {
			top: .32,
			right: .32,
			bottom: .32,
			left: .32
		}
	},
	{
		key: "heart",
		type: "path",
		...P({
			width: 36,
			height: 34
		}),
		path: [
			"M26 0c5.523 0 10 4.477 10 10l-.013.586",
			"C35.443 22.876 18.003 33.998 18 34c-.004-.003-18-11.48-18-24",
			"C0 4.477 4.477 0 10 0a9.99 9.99 0 0 1 8 3.999A9.99 9.99 0 0 1 26 0"
		].join(" "),
		internalTextInset: {
			top: .1,
			right: .1,
			bottom: .16,
			left: .1
		}
	},
	{
		key: "arrow-right-fat",
		type: "polygon",
		width: N,
		height: 130,
		points: [
			{
				x: 0,
				y: 38
			},
			{
				x: 58,
				y: 38
			},
			{
				x: 58,
				y: 14
			},
			{
				x: 100,
				y: 50
			},
			{
				x: 58,
				y: 86
			},
			{
				x: 58,
				y: 62
			},
			{
				x: 0,
				y: 62
			}
		],
		internalTextInset: {
			top: .34,
			right: .42,
			bottom: .34,
			left: .16
		}
	},
	{
		key: "arrow-up-fat",
		type: "polygon",
		width: 130,
		height: N,
		points: [
			{
				x: 38,
				y: 100
			},
			{
				x: 38,
				y: 42
			},
			{
				x: 14,
				y: 42
			},
			{
				x: 50,
				y: 0
			},
			{
				x: 86,
				y: 42
			},
			{
				x: 62,
				y: 42
			},
			{
				x: 62,
				y: 100
			}
		],
		internalTextInset: {
			top: .1,
			right: .35,
			left: .35
		}
	},
	{
		key: "arrow-right",
		type: "polygon",
		...P({
			width: 36,
			height: 28
		}),
		points: [
			{
				x: 100,
				y: 50
			},
			{
				x: 61.1111,
				y: 100
			},
			{
				x: 61.1111,
				y: 71.4286
			},
			{
				x: 0,
				y: 71.4286
			},
			{
				x: 0,
				y: 28.5714
			},
			{
				x: 61.1111,
				y: 28.5714
			},
			{
				x: 61.1111,
				y: 0
			}
		],
		internalTextInset: {
			top: .3,
			right: .1,
			bottom: .3
		}
	},
	{
		key: "arrow-left",
		type: "polygon",
		...P({
			width: 36,
			height: 28
		}),
		points: [
			{
				x: 38.8889,
				y: 28.5714
			},
			{
				x: 100,
				y: 28.5714
			},
			{
				x: 100,
				y: 71.4286
			},
			{
				x: 38.8889,
				y: 71.4286
			},
			{
				x: 38.8889,
				y: 100
			},
			{
				x: 0,
				y: 50
			},
			{
				x: 38.8889,
				y: 0
			}
		],
		internalTextInset: {
			top: .3,
			bottom: .3,
			left: .1
		}
	},
	{
		key: "arrow-up",
		type: "polygon",
		...P({
			width: 28,
			height: 36
		}),
		points: [
			{
				x: 71.4286,
				y: 100
			},
			{
				x: 28.5714,
				y: 100
			},
			{
				x: 28.5714,
				y: 38.8889
			},
			{
				x: 0,
				y: 38.8889
			},
			{
				x: 50,
				y: 0
			},
			{
				x: 100,
				y: 38.8889
			},
			{
				x: 71.4286,
				y: 38.8889
			}
		],
		internalTextInset: {
			top: .12,
			right: .28,
			left: .28
		}
	},
	{
		key: "arrow-down-fat",
		type: "polygon",
		width: 130,
		height: N,
		points: [
			{
				x: 38,
				y: 0
			},
			{
				x: 38,
				y: 58
			},
			{
				x: 14,
				y: 58
			},
			{
				x: 50,
				y: 100
			},
			{
				x: 86,
				y: 58
			},
			{
				x: 62,
				y: 58
			},
			{
				x: 62,
				y: 0
			}
		],
		internalTextInset: {
			right: .35,
			bottom: .1,
			left: .35
		}
	},
	{
		key: "arrow-down",
		type: "polygon",
		...P({
			width: 28,
			height: 36
		}),
		points: [
			{
				x: 0,
				y: 61.1111
			},
			{
				x: 28.5714,
				y: 61.1111
			},
			{
				x: 28.5714,
				y: 0
			},
			{
				x: 71.4286,
				y: 0
			},
			{
				x: 71.4286,
				y: 61.1111
			},
			{
				x: 100,
				y: 61.1111
			},
			{
				x: 50,
				y: 100
			}
		],
		internalTextInset: {
			right: .28,
			bottom: .12,
			left: .28
		}
	},
	{
		key: "arrow-up-down",
		type: "polygon",
		...P({
			width: 20,
			height: 38
		}),
		points: [
			{
				x: 70,
				y: 73.6842
			},
			{
				x: 100,
				y: 73.6842
			},
			{
				x: 50,
				y: 100
			},
			{
				x: 0,
				y: 73.6842
			},
			{
				x: 30,
				y: 73.6842
			},
			{
				x: 30,
				y: 26.3158
			},
			{
				x: 0,
				y: 26.3158
			},
			{
				x: 50,
				y: 0
			},
			{
				x: 100,
				y: 26.3158
			},
			{
				x: 70,
				y: 26.3158
			}
		],
		internalTextInset: {
			top: .1,
			right: .3,
			bottom: .1,
			left: .3
		}
	},
	{
		key: "arrow-left-right",
		type: "polygon",
		...P({
			width: 38,
			height: 20
		}),
		points: [
			{
				x: 100,
				y: 50
			},
			{
				x: 73.6842,
				y: 100
			},
			{
				x: 73.6842,
				y: 70
			},
			{
				x: 26.3158,
				y: 70
			},
			{
				x: 26.3158,
				y: 100
			},
			{
				x: 0,
				y: 50
			},
			{
				x: 26.3158,
				y: 0
			},
			{
				x: 26.3158,
				y: 30
			},
			{
				x: 73.6842,
				y: 30
			},
			{
				x: 73.6842,
				y: 0
			}
		],
		internalTextInset: {
			top: .3,
			right: .08,
			bottom: .3,
			left: .08
		}
	},
	{
		key: "banner",
		type: "polygon",
		...P({
			width: 36,
			height: 24
		}),
		points: [
			{
				x: 0,
				y: 100
			},
			{
				x: 0,
				y: 0
			},
			{
				x: 77.7778,
				y: 0
			},
			{
				x: 100,
				y: 50
			},
			{
				x: 77.7778,
				y: 100
			}
		],
		internalTextInset: { right: .2 }
	},
	{
		key: "drop",
		type: "path",
		...P({
			width: 26,
			height: 36
		}),
		path: "M0 23C0 11 13 0 13 0s13 11 13 23c0 7.18-5.82 13-13 13S0 30.18 0 23",
		internalTextInset: {
			top: .24,
			right: .1,
			bottom: .1,
			left: .1
		}
	},
	{
		key: "cross",
		type: "polygon",
		width: N,
		height: N,
		points: [
			{
				x: 67.6471,
				y: 32.3529
			},
			{
				x: 100,
				y: 32.3529
			},
			{
				x: 100,
				y: 67.6471
			},
			{
				x: 67.6471,
				y: 67.6471
			},
			{
				x: 67.6471,
				y: 100
			},
			{
				x: 32.3529,
				y: 100
			},
			{
				x: 32.3529,
				y: 67.6471
			},
			{
				x: 0,
				y: 67.6471
			},
			{
				x: 0,
				y: 32.3529
			},
			{
				x: 32.3529,
				y: 32.3529
			},
			{
				x: 32.3529,
				y: 0
			},
			{
				x: 67.6471,
				y: 0
			}
		],
		internalTextInset: {
			top: .32,
			right: .32,
			bottom: .32,
			left: .32
		}
	},
	{
		key: "ribbon",
		type: "polygon",
		...P({
			width: 24,
			height: 34
		}),
		points: [
			{
				x: 0,
				y: 0
			},
			{
				x: 100,
				y: 0
			},
			{
				x: 100,
				y: 100
			},
			{
				x: 50,
				y: 76.4706
			},
			{
				x: 0,
				y: 100
			}
		],
		internalTextInset: { bottom: .22 }
	},
	{
		key: "gear",
		type: "polygon",
		width: N,
		height: N,
		points: Ae({
			spikes: 14,
			outerRadius: 50,
			innerRadius: 40,
			rotation: -Math.PI / 2
		}),
		internalTextInset: {
			top: .1,
			right: .1,
			bottom: .1,
			left: .1
		}
	},
	{
		key: "badge",
		type: "path",
		width: N,
		height: N,
		path: "M24 6 H76 L94 24 V76 L76 94 H24 L6 76 V24 Z",
		internalTextInset: {
			top: .1,
			bottom: .1
		}
	},
	{
		key: "bookmark",
		type: "polygon",
		width: 130,
		height: N,
		points: [
			{
				x: 18,
				y: 0
			},
			{
				x: 82,
				y: 0
			},
			{
				x: 82,
				y: 100
			},
			{
				x: 50,
				y: 74
			},
			{
				x: 18,
				y: 100
			}
		],
		internalTextInset: { bottom: .24 }
	},
	{
		key: "tag",
		type: "path",
		width: N,
		height: 130,
		path: "M4 20 L64 20 L96 50 L64 80 L4 80 Z",
		internalTextInset: { right: .28 }
	},
	{
		key: "moon",
		type: "path",
		width: 150,
		height: N,
		path: [
			"M68 4 C36 4 10 30 10 62",
			"C10 94 36 120 68 120 C85 120 100 112 111 100",
			"C82 102 58 78 58 48 C58 28 68 12 84 4",
			"C79 4 74 4 68 4 Z"
		].join(" "),
		internalTextInset: {
			top: .28,
			right: .5,
			bottom: .28
		}
	}
], Me = "circle", Ne = "center", Pe = "middle", Fe = {};
for (let e = 0; e < je.length; e += 1) {
	let t = je[e];
	Fe[t.key] = t;
}
var Ie = Fe, Le = ({ presetKey: e }) => Ie[e] ?? null, Re = ({ preset: e, rounding: t }) => M({ rounding: t }) <= 0 || e.type === "rect" ? e.key : e.roundedVariant ?? e.key;
function ze({ value: e, size: t }) {
	let n = Number.isFinite(e) ? Math.min(Math.max(e, 0), Oe) : 0;
	return (Number.isFinite(t) && t > 0 ? t : 0) * n;
}
var Be = ({ preset: e, width: t, height: n }) => {
	let r = e.internalTextInset ?? {};
	return {
		top: ze({
			value: r.top ?? De.top,
			size: n
		}),
		right: ze({
			value: r.right ?? De.right,
			size: t
		}),
		bottom: ze({
			value: r.bottom ?? De.bottom,
			size: n
		}),
		left: ze({
			value: r.left ?? De.left,
			size: t
		})
	};
};
function Ve({ path: e }) {
	let t = e.match(/[a-zA-Z]/g) ?? [], n = /* @__PURE__ */ new Set([
		"M",
		"L",
		"H",
		"V",
		"Z"
	]);
	for (let e = 0; e < t.length; e += 1) {
		let r = t[e].toUpperCase();
		if (!n.has(r)) return !1;
	}
	return t.length > 0;
}
var He = ({ preset: e }) => e.type === "rect" || e.type === "triangle" || e.type === "polygon" || e.type === "polyline" ? !0 : e.type === "ellipse" || e.type === "svg" ? !1 : Ve({ path: e.path });
//#endregion
//#region src/editor/shape-manager/layout/shape-padding.ts
function Ue({ value: e }) {
	return Number.isFinite(e) ? Math.max(0, e ?? 0) : 0;
}
function We({ value: e }) {
	return Number.isFinite(e) ? Math.max(0, Math.floor(e ?? 0)) : 0;
}
function Ge({ stroke: e, strokeWidth: t }) {
	return e == null ? !1 : Math.max(0, t ?? 0) > 0;
}
function F({ padding: e }) {
	return {
		top: Ue({ value: e?.top }),
		right: Ue({ value: e?.right }),
		bottom: Ue({ value: e?.bottom }),
		left: Ue({ value: e?.left })
	};
}
function Ke({ padding: e }) {
	return {
		top: We({ value: e?.top }),
		right: We({ value: e?.right }),
		bottom: We({ value: e?.bottom }),
		left: We({ value: e?.left })
	};
}
function qe({ stroke: e, strokeWidth: t }) {
	if (!Ge({
		stroke: e,
		strokeWidth: t
	})) return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
	let n = Math.max(0, t ?? 0);
	return {
		top: n,
		right: n,
		bottom: n,
		left: n
	};
}
function Je({ base: e, override: t }) {
	return t ? Ke({ padding: {
		top: t.top ?? e.top,
		right: t.right ?? e.right,
		bottom: t.bottom ?? e.bottom,
		left: t.left ?? e.left
	} }) : e;
}
function Ye({ base: e, addition: t }) {
	let n = F({ padding: e }), r = F({ padding: t });
	return {
		top: n.top + r.top,
		right: n.right + r.right,
		bottom: n.bottom + r.bottom,
		left: n.left + r.left
	};
}
function Xe({ baseInset: e, stroke: t, strokeWidth: n }) {
	return Ye({
		base: e,
		addition: qe({
			stroke: t,
			strokeWidth: n
		})
	});
}
function Ze({ padding: e }) {
	if (!e) return {};
	let t = {}, n = Object.keys(e);
	for (let r = 0; r < n.length; r += 1) {
		let i = n[r];
		e[i] !== void 0 && (t[i] = !0);
	}
	return t;
}
//#endregion
//#region src/editor/shape-manager/domain/shape-nodes.ts
var Qe = ({ group: e }) => {
	let t = e.getObjects();
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (n.shapeNodeType === "shape") return n;
	}
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (!(n instanceof _)) return n;
	}
	return null;
}, $e = ({ group: e }) => {
	let t = e.getObjects();
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (n.shapeNodeType === "text" && n instanceof _) return n;
	}
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (n instanceof _) return n;
	}
	return null;
}, I = ({ group: e }) => ({
	shape: Qe({ group: e }),
	text: $e({ group: e })
}), et = ({ group: e }) => {
	let t = !!e.locked, n = e;
	typeof n.setInteractive == "function" && n.setInteractive(!0), n.set({
		evented: !0,
		interactive: !0,
		lockMovementX: t,
		lockMovementY: t,
		moveCursor: void 0,
		selectable: !0,
		subTargetCheck: !0,
		hoverCursor: void 0
	});
}, tt = ({ text: e }) => {
	let t = !!(e.locked || e.group?.locked);
	e.set({
		hasBorders: !1,
		hasControls: !1,
		evented: !1,
		selectable: !1,
		lockMovementX: t,
		lockMovementY: t,
		editable: !t,
		autoExpand: !1,
		shapeNodeType: "text"
	}), e.setCoords();
}, nt = ({ group: e }) => {
	let { layoutManager: t } = e;
	if (!t || typeof t.unsubscribeTargets != "function") return;
	let n = e.getObjects();
	n.length !== 0 && t.unsubscribeTargets({
		target: e,
		targets: n
	});
}, rt = ({ group: e }) => {
	let t = e.getObjects();
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (n.shapeNodeType === "text" && n instanceof _) return n;
	}
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (n instanceof _) return n;
	}
	return null;
}, it = "shape-group", at = ({ group: e, metadata: t }) => {
	let { padding: n, style: r } = t, i = r.strokeDashArray ? r.strokeDashArray.slice() : r.strokeDashArray ?? null, a = t.presetCanRound ? M({ rounding: t.rounding }) : 0;
	e.set({
		shapeComposite: !0,
		shapePresetKey: t.presetKey,
		shapeBaseWidth: t.width,
		shapeBaseHeight: t.height,
		shapeManualBaseWidth: Math.max(1, t.manualWidth ?? t.width),
		shapeManualBaseHeight: Math.max(1, t.manualHeight ?? t.height),
		shapeReplaceBoxWidth: Math.max(1, t.replaceBoxWidth ?? t.width),
		shapeReplaceBoxHeight: Math.max(1, t.replaceBoxHeight ?? t.height),
		shapeTextAutoExpand: t.shapeTextAutoExpand,
		shapeAlignHorizontal: t.alignH,
		shapeAlignVertical: t.alignV,
		shapePaddingTop: n.top,
		shapePaddingRight: n.right,
		shapePaddingBottom: n.bottom,
		shapePaddingLeft: n.left,
		shapeFill: r.fill,
		shapeStroke: r.stroke,
		shapeStrokeWidth: r.strokeWidth,
		shapeStrokeDashArray: i,
		shapeOpacity: r.opacity,
		shapeRounding: a,
		shapeCanRound: t.presetCanRound
	});
};
function ot() {
	let e = new u();
	return e.performLayout = () => {}, e;
}
function st({ layoutManager: e }) {
	let t = y.getClass("layoutManager");
	if (!e) return new t();
	let { strategy: n, type: r } = e, i = y.getClass(r);
	return n ? new i(new (y.getClass(n))()) : new i();
}
var ct = class e extends c {
	static {
		this.type = it;
	}
	constructor(e = [], t = {}) {
		let { layoutManager: n, objectCaching: r, centeredScaling: i, lockScalingFlip: a, ...o } = t;
		super(e, {
			...o,
			layoutManager: n,
			objectCaching: r ?? !1,
			centeredScaling: i ?? !1,
			lockScalingFlip: a ?? !0
		}), this.rehydrateRuntimeState();
	}
	rehydrateRuntimeState() {
		this.set({
			objectCaching: !1,
			shapeComposite: !0
		}), this.shapeTextAutoExpand === void 0 && (this.shapeTextAutoExpand = !0), this.shapeAlignHorizontal === void 0 && (this.shapeAlignHorizontal = Ne), this.shapeAlignVertical === void 0 && (this.shapeAlignVertical = Pe);
		let e = Ke({ padding: {
			top: this.shapePaddingTop,
			right: this.shapePaddingRight,
			bottom: this.shapePaddingBottom,
			left: this.shapePaddingLeft
		} });
		this.shapePaddingTop = e.top, this.shapePaddingRight = e.right, this.shapePaddingBottom = e.bottom, this.shapePaddingLeft = e.left, this._syncRoundability(), this._foldGroupOpacityIntoNodes(), et({ group: this }), Ce({ target: this });
		let t = rt({ group: this });
		t && tt({ text: t }), nt({ group: this }), this.setCoords();
	}
	static async fromObject({ type: t, objects: n = [], layoutManager: r, ...i }, a) {
		let [o, s] = await Promise.all([C.enlivenObjects(n, a), C.enlivenObjectEnlivables(i, a)]), c = new e(o, {
			...i,
			...s,
			layoutManager: ot()
		});
		return c.layoutManager = st({ layoutManager: r }), c.layoutManager.subscribeTargets({
			type: "initialization",
			target: c,
			targets: c.getObjects()
		}), c.rehydrateRuntimeState(), c.setCoords(), c;
	}
	replaceShapeNode(e, t, n) {
		this._objects.splice(e, 1), this.exitGroup(t, !0), this._objects.splice(e, 0, n), this.enterGroup(n, !1), this._set("dirty", !0);
	}
	_syncRoundability() {
		if (typeof this.shapeCanRound == "boolean") return;
		let e = this.shapePresetKey;
		if (!e) return;
		let t = Le({ presetKey: e });
		t && (this.shapeCanRound = He({ preset: t }));
	}
	_foldGroupOpacityIntoNodes() {
		let e = this.opacity;
		if (typeof e != "number" || e === 1) return;
		let { shape: t, text: n } = I({ group: this });
		if (!(!t && !n)) {
			if (t) {
				let n = (typeof t.opacity == "number" ? t.opacity : this.shapeOpacity ?? 1) * e;
				t.set({ opacity: n }), t.setCoords(), this.shapeOpacity = n;
			}
			if (n) {
				let t = typeof n.opacity == "number" ? n.opacity : 1;
				n.set({ opacity: t * e }), n.setCoords();
			}
			this.set({ opacity: 1 });
		}
	}
}, lt = () => {
	y?.setClass && y.setClass(ct, it);
}, L = (e) => e instanceof ct || e instanceof c && e.shapeComposite === !0, ut = ({ target: e, subTargets: t = [] }) => {
	if (L(e)) return e;
	if (e?.group && L(e.group)) return e.group;
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (L(n)) return n;
		let { group: r } = n;
		if (r && L(r)) return r;
	}
	return null;
}, dt = ({ canvas: e }) => ut({ target: e.getActiveObject() }), ft = ({ canvas: e, id: t }) => {
	let n = e.getObjects();
	for (let e = 0; e < n.length; e += 1) {
		let r = n[e];
		if (r.id === t && L(r)) return r;
	}
	return null;
}, pt = ({ canvas: e, target: t }) => t ? typeof t == "string" ? ft({
	canvas: e,
	id: t
}) : ut({ target: t }) : dt({ canvas: e }), mt = {
	style: {
		position: "absolute",
		display: "none",
		background: "#2B2D33",
		borderRadius: "8px",
		padding: "0 8px",
		height: "32px",
		gap: "10px",
		zIndex: 10,
		alignItems: "center"
	},
	btnStyle: {
		background: "transparent",
		border: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "20px",
		width: "20px",
		cursor: "pointer",
		transition: "background-color 0.2s ease, transform 0.1s ease",
		transform: "scale(1)"
	},
	btnHover: {
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: "50%",
		transform: "scale(1.1)"
	},
	toolbarClass: "fabric-editor-toolbar",
	btnClass: "fabric-editor-toolbar-btn",
	lockedActions: [{
		name: "Разблокировать",
		handle: "unlock"
	}],
	actions: [
		{
			name: "Создать копию",
			handle: "copyPaste"
		},
		{
			name: "Заблокировать",
			handle: "lock"
		},
		{
			name: "На передний план",
			handle: "bringToFront"
		},
		{
			name: "На задний план",
			handle: "sendToBack"
		},
		{
			name: "На один уровень вверх",
			handle: "bringForward"
		},
		{
			name: "На один уровень вниз",
			handle: "sendBackwards"
		},
		{
			name: "Удалить",
			handle: "delete"
		}
	],
	offsetTop: 50,
	icons: {
		copyPaste: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNi44NzUgMi41YS42MjUuNjI1IDAgMCAwLS42MjUuNjI0VjYuMjVIMy4xMjVhLjYyNS42MjUgMCAwIDAtLjYyNS42MjV2MTBjMCAuMzQ1LjI4LjYyNS42MjUuNjI1aDEwYy4zNDUgMCAuNjI1LS4yOC42MjUtLjYyNXYtMy4xMjZoMy4xMjVjLjM0NSAwIC42MjUtLjI4LjYyNS0uNjI1di0xMGEuNjI1LjYyNSAwIDAgMC0uNjI1LS42MjVoLTEwWm02Ljg3NSAxMGgyLjVWMy43NUg3LjV2Mi41aDUuNjI1Yy4zNDUgMCAuNjI1LjI4LjYyNS42MjV2NS42MjRabS0xMCAzLjc1VjcuNWg4Ljc1djguNzVIMy43NVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==",
		delete: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI0VDNEU0MCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOC4xMjUgMS4yNUExLjg3NSAxLjg3NSAwIDAgMCA2LjI1IDMuMTI1di42MjVIMy4xMjVhLjYyNS42MjUgMCAwIDAgMCAxLjI1aC42MjV2MTEuMjVBMS4yNSAxLjI1IDAgMCAwIDUgMTcuNWgxMGExLjI1IDEuMjUgMCAwIDAgMS4yNS0xLjI1VjVoLjYyNWEuNjI1LjYyNSAwIDAgMCAwLTEuMjVIMTMuNzV2LS42MjVhMS44NzUgMS44NzUgMCAwIDAtMS44NzUtMS44NzVoLTMuNzVabTQuMzc1IDIuNXYtLjYyNWEuNjI1LjYyNSAwIDAgMC0uNjI1LS42MjVoLTMuNzVhLjYyNS42MjUgMCAwIDAtLjYyNS42MjV2LjYyNWg1Wk01IDE2LjI1VjVoMTB2MTEuMjVINVpNOC4xMjUgNy41Yy4zNDUgMCAuNjI1LjI4LjYyNS42MjV2NWEuNjI1LjYyNSAwIDEgMS0xLjI1IDB2LTVjMC0uMzQ1LjI4LS42MjUuNjI1LS42MjVabTQuMzc1IDUuNjI1di01YS42MjUuNjI1IDAgMCAwLTEuMjUgMHY1YS42MjUuNjI1IDAgMSAwIDEuMjUgMFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==",
		lock: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMi41IDcuNWMwLS42OS41Ni0xLjI1IDEuMjUtMS4yNWgxMi41Yy42OSAwIDEuMjUuNTYgMS4yNSAxLjI1djguNzVjMCAuNjktLjU2IDEuMjUtMS4yNSAxLjI1SDMuNzVjLS42OSAwLTEuMjUtLjU2LTEuMjUtMS4yNVY3LjVabTEzLjc1IDBIMy43NXY4Ljc1aDEyLjVWNy41WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTAgMS44NzVhMi4xODggMi4xODggMCAwIDAtMi4xODggMi4xODh2Mi44MTJhLjYyNS42MjUgMCAxIDEtMS4yNSAwVjQuMDYyYTMuNDM3IDMuNDM3IDAgMSAxIDYuODc1IDB2Mi44MTNhLjYyNS42MjUgMCAxIDEtMS4yNSAwVjQuMDYyQTIuMTg4IDIuMTg4IDAgMCAwIDEwIDEuODc2WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEwIDEyLjgxM2EuOTM3LjkzNyAwIDEgMCAwLTEuODc1LjkzNy45MzcgMCAwIDAgMCAxLjg3NFoiLz48L3N2Zz4=",
		unlock: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE2LjI1IDYuMjVINy41VjQuMzc1YTIuNSAyLjUgMCAwIDEgMi41LTIuNWMxLjIgMCAyLjI4MS44NiAyLjUxMiAyYS42MjUuNjI1IDAgMCAwIDEuMjI2LS4yNWMtLjM1NC0xLjczOC0xLjkyNS0zLTMuNzM4LTNhMy43NTQgMy43NTQgMCAwIDAtMy43NSAzLjc1VjYuMjVoLTIuNUExLjI1IDEuMjUgMCAwIDAgMi41IDcuNXY4Ljc1YTEuMjUgMS4yNSAwIDAgMCAxLjI1IDEuMjVoMTIuNWExLjI1IDEuMjUgMCAwIDAgMS4yNS0xLjI1VjcuNWExLjI1IDEuMjUgMCAwIDAtMS4yNS0xLjI1Wm0wIDEwSDMuNzVWNy41aDEyLjV2OC43NVptLTUuMzEzLTQuMzc1YS45MzcuOTM3IDAgMSAxLTEuODc0IDAgLjkzNy45MzcgMCAwIDEgMS44NzQgMFoiLz48L3N2Zz4K",
		bringToFront: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0ibTIuNSA2LjI1IDcuNSA0LjM3NSA3LjUtNC4zNzVMMTAgMS44NzUgMi41IDYuMjVaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOS42ODUgMS4zMzVhLjYyNS42MjUgMCAwIDEgLjYzIDBsNy41IDQuMzc1YS42MjUuNjI1IDAgMCAxIDAgMS4wOGwtNy41IDQuMzc1YS42MjUuNjI1IDAgMCAxLS42MyAwbC03LjUtNC4zNzVhLjYyNS42MjUgMCAwIDEgMC0xLjA4bDcuNS00LjM3NVpNMy43NCA2LjI1IDEwIDkuOTAxbDYuMjYtMy42NTFMMTAgMi41OTkgMy43NCA2LjI1WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNS40IDExLjMzNWEuNjI1LjYyNSAwIDAgMSAuNjMgMEwxMCAxMy42NTFsMy45Ny0yLjMxNmEuNjI1LjYyNSAwIDAgMSAuNjMgMGwzLjIxNSAxLjg3NWEuNjI1LjYyNSAwIDAgMSAwIDEuMDhsLTcuNSA0LjM3NWEuNjI1LjYyNSAwIDAgMS0uNjMgMGwtNy41LTQuMzc1YS42MjUuNjI1IDAgMCAxIDAtMS4wOEw1LjQgMTEuMzM1Wk0zLjc0IDEzLjc1IDEwIDE3LjQwMWw2LjI2LTMuNjUxLTEuOTc0LTEuMTUxLTMuOTcxIDIuMzE2YS42MjUuNjI1IDAgMCAxLS42MyAwbC0zLjk3LTIuMzE2TDMuNzQgMTMuNzVaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjQgNy41ODVhLjYyNS42MjUgMCAwIDEgLjYzIDBMMTAgOS45MDFsMy45Ny0yLjMxNmEuNjI1LjYyNSAwIDAgMSAuNjMgMGwzLjIxNSAxLjg3NWEuNjI1LjYyNSAwIDAgMSAwIDEuMDhsLTcuNSA0LjM3NWEuNjI1LjYyNSAwIDAgMS0uNjMgMGwtNy41LTQuMzc1YS42MjUuNjI1IDAgMCAxIDAtMS4wOEw1LjQgNy41ODVaTTMuNzQgMTAgMTAgMTMuNjUxIDE2LjI2IDEwbC0xLjk3NC0xLjE1MS0zLjk3MSAyLjMxNmEuNjI1LjYyNSAwIDAgMS0uNjMgMGwtMy45Ny0yLjMxNkwzLjc0IDEwWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+",
		sendToBack: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMS45NiAxMy40MzVhLjYyNS42MjUgMCAwIDEgLjg1NS0uMjI1TDEwIDE3LjQwMWw3LjE4NS00LjE5YS42MjUuNjI1IDAgMCAxIC42MyAxLjA3OWwtNy41IDQuMzc1YS42MjUuNjI1IDAgMCAxLS42MyAwbC03LjUtNC4zNzVhLjYyNS42MjUgMCAwIDEtLjIyNS0uODU1Wk05LjY4NSAxLjMzNWEuNjI1LjYyNSAwIDAgMSAuNjMgMGw3LjUgNC4zNzVhLjYyNS42MjUgMCAwIDEgMCAxLjA4bC03LjUgNC4zNzVhLjYyNS42MjUgMCAwIDEtLjYzIDBsLTcuNS00LjM3NWEuNjI1LjYyNSAwIDAgMSAwLTEuMDhsNy41LTQuMzc1Wk0zLjc0IDYuMjUgMTAgOS45MDFsNi4yNi0zLjY1MUwxMCAyLjU5OSAzLjc0IDYuMjVaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Im01LjcxNCAxMS44NzUgNC4yODYgMi41IDQuMjg2LTIuNUwxNy41IDEzLjc1IDEwIDE4LjEyNSAyLjUgMTMuNzVsMy4yMTQtMS44NzVaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjQgMTEuMzM1YS42MjUuNjI1IDAgMCAxIC42MyAwTDEwIDEzLjY1MWwzLjk3LTIuMzE2YS42MjUuNjI1IDAgMCAxIC42MyAwbDMuMjE1IDEuODc1YS42MjUuNjI1IDAgMCAxIDAgMS4wOGwtNy41IDQuMzc1YS42MjUuNjI1IDAgMCAxLS42MyAwbC03LjUtNC4zNzVhLjYyNS42MjUgMCAwIDEgMC0xLjA4TDUuNCAxMS4zMzVaTTMuNzQgMTMuNzUgMTAgMTcuNDAxbDYuMjYtMy42NTEtMS45NzQtMS4xNTEtMy45NzEgMi4zMTZhLjYyNS42MjUgMCAwIDEtLjYzIDBsLTMuOTctMi4zMTZMMy43NCAxMy43NVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuNCA3LjU4NWEuNjI1LjYyNSAwIDAgMSAuNjMgMEwxMCA5LjkwMWwzLjk3LTIuMzE2YS42MjUuNjI1IDAgMCAxIC42MyAwbDMuMjE1IDEuODc1YS42MjUuNjI1IDAgMCAxIDAgMS4wOGwtNy41IDQuMzc1YS42MjUuNjI1IDAgMCAxLS42MyAwbC03LjUtNC4zNzVhLjYyNS42MjUgMCAwIDEgMC0xLjA4TDUuNCA3LjU4NVpNMy43NCAxMCAxMCAxMy42NTEgMTYuMjYgMTBsLTEuOTc0LTEuMTUxLTMuOTcxIDIuMzE2YS42MjUuNjI1IDAgMCAxLS42MyAwbC0zLjk3LTIuMzE2TDMuNzQgMTBaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=",
		bringForward: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIuNSA4LjEyNSAxMCAxMi41bDcuNS00LjM3NUwxMCAzLjc1IDIuNSA4LjEyNVoiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjY4NSAzLjIxYS42MjUuNjI1IDAgMCAxIC42MyAwbDcuNSA0LjM3NWEuNjI1LjYyNSAwIDAgMSAwIDEuMDhsLTcuNSA0LjM3NWEuNjI1LjYyNSAwIDAgMS0uNjMgMGwtNy41LTQuMzc1YS42MjUuNjI1IDAgMCAxIDAtMS4wOGw3LjUtNC4zNzVaTTMuNzQgOC4xMjUgMTAgMTEuNzc2bDYuMjYtMy42NTFMMTAgNC40NzQgMy43NCA4LjEyNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuNCA5LjQ2YS42MjUuNjI1IDAgMCAxIC42MyAwTDEwIDExLjc3NmwzLjk3LTIuMzE2YS42MjUuNjI1IDAgMCAxIC42MyAwbDMuMjE1IDEuODc1YS42MjUuNjI1IDAgMCAxIDAgMS4wOGwtNy41IDQuMzc1YS42MjUuNjI1IDAgMCAxLS42MyAwbC03LjUtNC4zNzVhLjYyNS42MjUgMCAwIDEgMC0xLjA4TDUuNCA5LjQ2Wm0tMS42NiAyLjQxNUwxMCAxNS41MjZsNi4yNi0zLjY1MS0xLjk3NC0xLjE1MS0zLjk3MSAyLjMxNmEuNjI1LjYyNSAwIDAgMS0uNjMgMGwtMy45Ny0yLjMxNi0xLjk3NSAxLjE1MVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==",
		sendBackwards: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOS42ODUgMy4yMWEuNjI1LjYyNSAwIDAgMSAuNjMgMGw3LjUgNC4zNzVhLjYyNS42MjUgMCAwIDEgMCAxLjA4bC03LjUgNC4zNzVhLjYyNS42MjUgMCAwIDEtLjYzIDBsLTcuNS00LjM3NWEuNjI1LjYyNSAwIDAgMSAwLTEuMDhsNy41LTQuMzc1Wk0zLjc0IDguMTI1IDEwIDExLjc3Nmw2LjI2LTMuNjUxTDEwIDQuNDc0IDMuNzQgOC4xMjVaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjcxNCAxMCAxMCAxMi41bDQuMjg2LTIuNSAzLjIxNCAxLjg3NUwxMCAxNi4yNWwtNy41LTQuMzc1TDUuNzE0IDEwWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNS40IDkuNDZhLjYyNS42MjUgMCAwIDEgLjYzIDBMMTAgMTEuNzc2bDMuOTctMi4zMTZhLjYyNS42MjUgMCAwIDEgLjYzIDBsMy4yMTUgMS44NzVhLjYyNS42MjUgMCAwIDEgMCAxLjA4bC03LjUgNC4zNzVhLjYyNS42MjUgMCAwIDEtLjYzIDBsLTcuNS00LjM3NWEuNjI1LjYyNSAwIDAgMSAwLTEuMDhMNS40IDkuNDZabS0xLjY2IDIuNDE1TDEwIDE1LjUyNmw2LjI2LTMuNjUxLTEuOTc0LTEuMTUxLTMuOTcxIDIuMzE2YS42MjUuNjI1IDAgMCAxLS42MyAwbC0zLjk3LTIuMzE2LTEuOTc1IDEuMTUxWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+"
	},
	handlers: {
		copyPaste: async (e, t) => {
			e.clipboardManager.copyPaste(t ?? void 0);
		},
		delete: (t, n) => {
			if (n instanceof e) {
				t.deletionManager.deleteSelectedObjects({ objects: n.getObjects() });
				return;
			}
			if (!n) {
				t.deletionManager.deleteSelectedObjects();
				return;
			}
			t.deletionManager.deleteSelectedObjects({ objects: [n] });
		},
		lock: (e, t) => {
			e.objectLockManager.lockObject({ object: t ?? void 0 });
		},
		unlock: (e, t) => {
			e.objectLockManager.unlockObject({ object: t ?? void 0 });
		},
		bringForward: (e, t) => {
			e.layerManager.bringForward(t ?? void 0);
		},
		bringToFront: (e, t) => {
			e.layerManager.bringToFront(t ?? void 0);
		},
		sendToBack: (e, t) => {
			e.layerManager.sendToBack(t ?? void 0);
		},
		sendBackwards: (e, t) => {
			e.layerManager.sendBackwards(t ?? void 0);
		}
	}
}, ht = class {
	constructor({ editor: e }) {
		this.currentTarget = null, this.currentLocked = !1, this.isTransforming = !1, this.isTemporarilyHidden = !1, this.editor = e, this.canvas = e.canvas, this.options = e.options, this._initToolbar();
	}
	_initToolbar() {
		if (!this.options.showToolbar) return;
		let e = this.options.toolbar || {};
		this.config = {
			...mt,
			...e,
			style: {
				...mt.style,
				...e.style || {}
			},
			btnStyle: {
				...mt.btnStyle,
				...e.btnStyle || {}
			},
			icons: {
				...mt.icons,
				...e.icons || {}
			},
			handlers: {
				...mt.handlers,
				...e.handlers || {}
			}
		}, this.currentTarget = null, this.currentLocked = !1, this.isTransforming = !1, this.isTemporarilyHidden = !1, this._onMouseDown = this._handleMouseDown.bind(this), this._onObjectMoving = this._startTransform.bind(this), this._onObjectScaling = this._startTransform.bind(this), this._onObjectRotating = this._startTransform.bind(this), this._onMouseUp = this._endTransform.bind(this), this._onObjectModified = this._endTransform.bind(this), this._onSelectionChange = this._updateToolbar.bind(this), this._onSelectionClear = () => {
			this.el.style.display = "none";
		}, this._createDOM(), this._bindEvents();
	}
	_createDOM() {
		let { style: e } = this.config;
		this.el = document.createElement("div"), Object.assign(this.el.style, e), this.canvas.wrapperEl.appendChild(this.el), this._onBtnOver = (e) => {
			let t = e.target.closest("button");
			t && Object.assign(t.style, this.config.btnHover);
		}, this._onBtnOut = (e) => {
			let t = e.target.closest("button");
			t && Object.assign(t.style, this.config.btnStyle);
		}, this.el.addEventListener("mouseover", this._onBtnOver), this.el.addEventListener("mouseout", this._onBtnOut);
	}
	_renderButtons(e) {
		this.el.innerHTML = "";
		for (let t of e) {
			let { name: e, handle: n } = t, { icons: r = {}, btnStyle: i, handlers: a = {} } = this.config, o = document.createElement("button");
			o.innerHTML = r[n] ? `<img src="${r[n]}" title="${e}" />` : e, Object.assign(o.style, i), o.onclick = () => a[n]?.(this.editor, this.currentTarget), o.onmousedown = (e) => {
				e.stopPropagation(), e.preventDefault();
			}, o.ondragstart = (e) => e.preventDefault(), this.el.appendChild(o);
		}
	}
	_bindEvents() {
		this.canvas.on("mouse:down", this._onMouseDown), this.canvas.on("object:moving", this._onObjectMoving), this.canvas.on("object:scaling", this._onObjectScaling), this.canvas.on("object:rotating", this._onObjectRotating), this.canvas.on("mouse:up", this._onMouseUp), this.canvas.on("object:modified", this._onObjectModified), this.canvas.on("selection:created", this._onSelectionChange), this.canvas.on("selection:updated", this._onSelectionChange), this.canvas.on("after:render", this._onSelectionChange), this.canvas.on("selection:cleared", this._onSelectionClear);
	}
	hideTemporarily() {
		!this.options.showToolbar || !this.el || (this.isTemporarilyHidden = !0, this.el.style.display = "none");
	}
	showAfterTemporary() {
		!this.options.showToolbar || !this.el || (this.isTemporarilyHidden = !1, this._updateToolbar());
	}
	_handleMouseDown(e) {
		e.transform?.actionPerformed && this._startTransform();
	}
	_startTransform() {
		this.isTransforming = !0, this.el.style.display = "none";
	}
	_endTransform() {
		this.isTransforming = !1, this._updatePos();
	}
	_updateToolbar() {
		if (this.isTransforming || this.isTemporarilyHidden) return;
		let e = this._resolveCurrentTarget();
		if (!e) {
			this.el.style.display = "none", this.currentTarget = null;
			return;
		}
		let t = !!e.locked;
		if (e !== this.currentTarget || t !== this.currentLocked) {
			this.currentTarget = e, this.currentLocked = t;
			let n = t ? this.config.lockedActions : this.config.actions;
			this._renderButtons(n ?? []);
		}
		this._updatePos();
	}
	_updatePos() {
		if (this.isTransforming || this.isTemporarilyHidden) return;
		let e = this._resolveCurrentTarget();
		if (!e) {
			this.el.style.display = "none";
			return;
		}
		let { el: t, config: n, canvas: r } = this;
		e.setCoords();
		let i = r.getZoom(), [, , , , a, o] = r.viewportTransform, { x: s } = e.getCenterPoint(), { top: c, height: l } = e.getBoundingRect(), u = s * i + a - t.offsetWidth / 2, d = n.offsetTop || 0, f = (c + l) * i + o + d;
		Object.assign(t.style, {
			left: `${u}px`,
			top: `${f}px`,
			display: "flex"
		});
	}
	_resolveCurrentTarget() {
		let e = this.canvas.getActiveObject();
		return ut({ target: e }) ?? e ?? null;
	}
	destroy() {
		this.el.removeEventListener("mouseover", this._onBtnOver), this.el.removeEventListener("mouseout", this._onBtnOut), this.canvas.off("mouse:down", this._onMouseDown), this.canvas.off("object:moving", this._onObjectMoving), this.canvas.off("object:scaling", this._onObjectScaling), this.canvas.off("object:rotating", this._onObjectRotating), this.canvas.off("mouse:up", this._onMouseUp), this.canvas.off("object:modified", this._onObjectModified), this.canvas.off("selection:created", this._onSelectionChange), this.canvas.off("selection:updated", this._onSelectionChange), this.canvas.off("after:render", this._onSelectionChange), this.canvas.off("selection:cleared", this._onSelectionClear), this.el.remove();
	}
}, gt = {
	position: "absolute",
	display: "none",
	background: "#2B2D33",
	color: "#fff",
	padding: "4px 8px",
	"border-radius": "4px",
	"font-size": "12px",
	"font-weight": "500",
	"font-family": "system-ui, -apple-system, sans-serif",
	"z-index": "1000",
	"pointer-events": "none",
	"white-space": "nowrap",
	"box-shadow": "0 2px 8px rgba(0, 0, 0, 0.2)"
}, _t = class e {
	constructor({ parent: e, className: t }) {
		this.parent = e, this.el = this._createElement({ className: t }), this.parent.appendChild(this.el);
	}
	showAtPointer({ text: t, event: n }) {
		let r = e._resolveClientPoint({ event: n });
		if (!r) {
			this.hide();
			return;
		}
		this.el.textContent = t, this.el.style.display = "block";
		let i = this._resolvePosition({ point: r });
		this._applyPosition({ position: i });
	}
	hide() {
		this.el.style.display = "none", this.el.textContent = "";
	}
	destroy() {
		this.hide(), this.el.parentNode && this.el.parentNode.removeChild(this.el);
	}
	_createElement({ className: e }) {
		let t = document.createElement("div");
		return t.className = e, Object.entries(gt).forEach(([e, n]) => {
			t.style.setProperty(e, n);
		}), t;
	}
	_resolvePosition({ point: e }) {
		let t = this.parent.getBoundingClientRect(), n = this.el.getBoundingClientRect(), r = e.clientX - t.left, i = e.clientY - t.top, a = r + 16, o = i + 16;
		a + n.width > t.width && (a = r - n.width - 16), o + n.height > t.height && (o = i - n.height - 16);
		let s = Math.max(0, t.width - n.width), c = Math.max(0, t.height - n.height);
		return {
			left: Math.min(Math.max(0, a), s),
			top: Math.min(Math.max(0, o), c)
		};
	}
	_applyPosition({ position: e }) {
		this.el.style.left = `${e.left}px`, this.el.style.top = `${e.top}px`;
	}
	static _resolveClientPoint({ event: e }) {
		if ("clientX" in e && typeof e.clientX == "number" && "clientY" in e && typeof e.clientY == "number") return {
			clientX: e.clientX,
			clientY: e.clientY
		};
		let t = "touches" in e ? e.touches : void 0, n = "changedTouches" in e ? e.changedTouches : void 0, r = t?.item(0) ?? n?.item(0);
		return r ? {
			clientX: r.clientX,
			clientY: r.clientY
		} : null;
	}
}, vt = "fabric-editor-angle-indicator", yt = class e {
	constructor({ editor: t }) {
		this.currentAngle = 0, this._handleObjectRotating = (t) => {
			let { target: n } = t.transform;
			if (!this._shouldShowIndicator(n)) {
				this._hideIndicator();
				return;
			}
			let r = n.angle || 0;
			this.currentAngle = e._normalizeAngle(r), this.indicator.showAtPointer({
				text: `${this.currentAngle}°`,
				event: t.e
			});
		}, this._handleMouseUp = () => {
			this._hideIndicator();
		}, this._handleObjectModified = () => {
			this._hideIndicator();
		}, this._handleSelectionCleared = () => {
			this._hideIndicator();
		}, this.editor = t, this.canvas = t.canvas, this.options = t.options, this.indicator = new _t({
			parent: this.canvas.wrapperEl,
			className: vt
		}), this.el = this.indicator.el, this._bindEvents();
	}
	_bindEvents() {
		this.canvas.on("object:rotating", this._handleObjectRotating), this.canvas.on("mouse:up", this._handleMouseUp), this.canvas.on("object:modified", this._handleObjectModified), this.canvas.on("selection:cleared", this._handleSelectionCleared);
	}
	_shouldShowIndicator(e) {
		return !(!this.options.showRotationAngle || !e || e.id === this.editor.montageArea.id || e.lockRotation || e.lockMovementX || e.lockMovementY);
	}
	_hideIndicator() {
		this.indicator.hide(), this.currentAngle = 0;
	}
	static _normalizeAngle(e) {
		let t = e % 360;
		return t > 180 && (t -= 360), t < -180 && (t += 360), Math.round(t);
	}
	destroy() {
		this.canvas.off("object:rotating", this._handleObjectRotating), this.canvas.off("mouse:up", this._handleMouseUp), this.canvas.off("object:modified", this._handleObjectModified), this.canvas.off("selection:cleared", this._handleSelectionCleared), this.indicator.destroy();
	}
}, bt = "fabric-editor-object-size-indicator", xt = 1e-6, St = class e {
	constructor({ editor: t }) {
		this._handleObjectSizeChanging = (e) => {
			this._showIndicatorForTarget({
				target: e.transform.target,
				event: e.e
			});
		}, this._handleCanvasMouseMove = (t) => {
			let n = this.canvas._currentTransform;
			n && e._isSizeChangingTransform({ transform: n }) && this._showIndicatorForTarget({
				target: n.target,
				event: t.e
			});
		}, this._handleSizeChangeFinished = () => {
			this._hideIndicator();
		}, this.editor = t, this.canvas = t.canvas, this.options = t.options, this.indicator = new _t({
			parent: this.canvas.wrapperEl,
			className: bt
		}), this.el = this.indicator.el, this._bindEvents();
	}
	destroy() {
		this._unbindEvents(), this.indicator.destroy();
	}
	_bindEvents() {
		this.canvas.on("object:scaling", this._handleObjectSizeChanging), this.canvas.on("object:resizing", this._handleObjectSizeChanging), this.canvas.on("mouse:move", this._handleCanvasMouseMove), this.canvas.on("mouse:up", this._handleSizeChangeFinished), this.canvas.on("object:modified", this._handleSizeChangeFinished), this.canvas.on("selection:cleared", this._handleSizeChangeFinished);
	}
	_unbindEvents() {
		this.canvas.off("object:scaling", this._handleObjectSizeChanging), this.canvas.off("object:resizing", this._handleObjectSizeChanging), this.canvas.off("mouse:move", this._handleCanvasMouseMove), this.canvas.off("mouse:up", this._handleSizeChangeFinished), this.canvas.off("object:modified", this._handleSizeChangeFinished), this.canvas.off("selection:cleared", this._handleSizeChangeFinished);
	}
	_showIndicatorForTarget({ target: t, event: n }) {
		if (!t) {
			this._hideIndicator();
			return;
		}
		if (!this._shouldShowIndicator({ target: t })) {
			this._hideIndicator();
			return;
		}
		let r = e._resolveDisplaySize({ target: t });
		if (!r) {
			this._hideIndicator();
			return;
		}
		this.indicator.showAtPointer({
			text: e._formatSize({ size: r }),
			event: n
		});
	}
	_shouldShowIndicator({ target: e }) {
		return !(!this.options.showObjectSizeOnScale || !e || e.id === this.editor.montageArea.id || e.locked || e.lockScalingX && e.lockScalingY);
	}
	_hideIndicator() {
		this.indicator.hide();
	}
	static _resolveDisplaySize({ target: t }) {
		let n = t.getObjectDisplaySize?.();
		return n ? e._normalizeDisplaySize({ size: n }) : e._normalizeDisplaySize({ size: {
			width: t.getScaledWidth(),
			height: t.getScaledHeight()
		} });
	}
	static _normalizeDisplaySize({ size: e }) {
		let t = Math.abs(e.width), n = Math.abs(e.height);
		return !Number.isFinite(t) || !Number.isFinite(n) ? null : {
			height: n,
			width: t
		};
	}
	static _formatSize({ size: t }) {
		return `ширина: ${e._formatDimension({ value: t.width })} высота: ${e._formatDimension({ value: t.height })}`;
	}
	static _formatDimension({ value: e }) {
		return Math.round(e + xt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}
	static _isSizeChangingTransform({ transform: e }) {
		let { action: t, corner: n } = e;
		return typeof t == "string" && (t.includes("scale") || t.includes("resiz")) ? !0 : n === "tl" || n === "tr" || n === "br" || n === "bl" || n === "ml" || n === "mr" || n === "mt" || n === "mb";
	}
}, Ct = 36, wt = 14, Tt = 4, Et = 5, Dt = 40, Ot = class e {
	constructor({ editor: t }) {
		this.state = e._createEmptyState(), this.dragState = null, this._handleCameraStateChanged = () => {
			this.update();
		}, this._handleHorizontalPointerDown = (e) => {
			this._startDrag({
				axis: "horizontal",
				event: e
			});
		}, this._handleVerticalPointerDown = (e) => {
			this._startDrag({
				axis: "vertical",
				event: e
			});
		}, this._handleDocumentPointerMove = (e) => {
			let { dragState: t } = this;
			if (!t) return;
			e.preventDefault();
			let n = this._resolveDragRatio({
				event: e,
				dragState: t
			});
			t.axis === "horizontal" ? this.editor.panConstraintManager.applyPanRatio({ horizontalRatio: n }) : this.editor.panConstraintManager.applyPanRatio({ verticalRatio: n }), this.update();
		}, this._handleDocumentPointerUp = () => {
			this.dragState = null, this._unbindDocumentDragEvents();
		}, this.editor = t, this.canvas = t.canvas, this.el = this._createRootElement(), this.horizontalTrack = this._createTrack({ axis: "horizontal" }), this.verticalTrack = this._createTrack({ axis: "vertical" }), this.horizontalThumb = this._createThumb({ axis: "horizontal" }), this.verticalThumb = this._createThumb({ axis: "vertical" }), this.horizontalTrack.appendChild(this.horizontalThumb), this.verticalTrack.appendChild(this.verticalThumb), this.el.appendChild(this.horizontalTrack), this.el.appendChild(this.verticalTrack), this._ensureWrapperPosition(), this.canvas.wrapperEl.appendChild(this.el), this._bindEvents(), this.update();
	}
	getState() {
		return this.state;
	}
	update() {
		this.editor.panConstraintManager.updateBounds(), this.state = this._calculateState(), this._applyAxisState({ axis: "horizontal" }), this._applyAxisState({ axis: "vertical" });
	}
	destroy() {
		this._unbindEvents(), this.el.parentNode && this.el.parentNode.removeChild(this.el);
	}
	_createRootElement() {
		let t = document.createElement("div");
		return t.className = "image-editor-viewport-scrollbars", t.dataset.editorViewportScrollbars = "true", e._applyStyles({
			element: t,
			styles: {
				inset: "0",
				pointerEvents: "none",
				position: "absolute",
				zIndex: String(Dt)
			}
		}), t;
	}
	_createTrack({ axis: t }) {
		let n = document.createElement("div");
		return n.className = `image-editor-viewport-scrollbar image-editor-viewport-scrollbar--${t}`, n.dataset.editorScrollbar = t, e._applyStyles({
			element: n,
			styles: this._getTrackStyles({ axis: t })
		}), n;
	}
	_createThumb({ axis: t }) {
		let n = document.createElement("div");
		return n.className = `image-editor-viewport-scrollbar__thumb image-editor-viewport-scrollbar__thumb--${t}`, n.dataset.editorScrollbarThumb = t, e._applyStyles({
			element: n,
			styles: this._getThumbStyles({ axis: t })
		}), n;
	}
	_getTrackStyles({ axis: e }) {
		let t = {
			borderRadius: "999px",
			display: "none",
			pointerEvents: "auto",
			position: "absolute"
		};
		return e === "horizontal" ? {
			...t,
			bottom: `${Tt}px`,
			height: `${Et}px`,
			left: `${wt}px`
		} : {
			...t,
			right: `${Tt}px`,
			top: `${wt}px`,
			width: `${Et}px`
		};
	}
	_getThumbStyles({ axis: e }) {
		let t = {
			background: "#89909a",
			borderRadius: "999px",
			cursor: e === "horizontal" ? "ew-resize" : "ns-resize",
			pointerEvents: "auto",
			position: "absolute"
		};
		return e === "horizontal" ? {
			...t,
			height: `${Et}px`,
			left: "0",
			top: "0"
		} : {
			...t,
			left: "0",
			top: "0",
			width: `${Et}px`
		};
	}
	_bindEvents() {
		this.canvas.on("editor:zoom-changed", this._handleCameraStateChanged), this.canvas.on("editor:pan-changed", this._handleCameraStateChanged), this.canvas.on("editor:canvas-updated", this._handleCameraStateChanged), this.horizontalThumb.addEventListener("pointerdown", this._handleHorizontalPointerDown), this.verticalThumb.addEventListener("pointerdown", this._handleVerticalPointerDown);
	}
	_unbindEvents() {
		this.canvas.off("editor:zoom-changed", this._handleCameraStateChanged), this.canvas.off("editor:pan-changed", this._handleCameraStateChanged), this.canvas.off("editor:canvas-updated", this._handleCameraStateChanged), this.horizontalThumb.removeEventListener("pointerdown", this._handleHorizontalPointerDown), this.verticalThumb.removeEventListener("pointerdown", this._handleVerticalPointerDown), this._unbindDocumentDragEvents();
	}
	_startDrag({ axis: t, event: n }) {
		let r = this.state[t];
		r.visible && (n.preventDefault(), this.dragState = {
			axis: t,
			pointerStart: e._getPointerPosition({
				axis: t,
				event: n
			}),
			ratioStart: r.ratio
		}, this._bindDocumentDragEvents());
	}
	_bindDocumentDragEvents() {
		document.addEventListener("pointermove", this._handleDocumentPointerMove), document.addEventListener("pointerup", this._handleDocumentPointerUp);
	}
	_unbindDocumentDragEvents() {
		document.removeEventListener("pointermove", this._handleDocumentPointerMove), document.removeEventListener("pointerup", this._handleDocumentPointerUp);
	}
	_resolveDragRatio({ event: t, dragState: n }) {
		let r = this.state[n.axis], i = e._getPointerPosition({
			axis: n.axis,
			event: t
		}), a = Math.max(1, r.trackSize - r.thumbSize), o = (i - n.pointerStart) / a;
		return e._clamp(n.ratioStart + o, 0, 1);
	}
	_calculateState() {
		return {
			horizontal: this._calculateAxisState({ axis: "horizontal" }),
			vertical: this._calculateAxisState({ axis: "vertical" })
		};
	}
	_calculateAxisState({ axis: t }) {
		let n = this.editor.panConstraintManager.getViewportPanState(), r = t === "horizontal" ? n.horizontal : n.vertical, i = this._getTrackSize({ axis: t });
		if (!(r.canPan && i > 0)) return e._createHiddenAxisState({ trackSize: i });
		let a = this._calculateThumbSize({
			scrollDistance: r.scrollDistance,
			trackSize: i,
			viewportSize: r.viewportSize
		});
		return {
			ratio: r.ratio,
			thumbOffset: (i - a) * r.ratio,
			thumbSize: a,
			trackSize: i,
			visible: !0
		};
	}
	_getTrackSize({ axis: e }) {
		let t = e === "horizontal" ? this.canvas.getWidth() : this.canvas.getHeight();
		return Math.max(0, t - wt * 2);
	}
	_calculateThumbSize({ scrollDistance: t, trackSize: n, viewportSize: r }) {
		let i = n * (r / (r + t));
		return e._clamp(i, Ct, n);
	}
	_applyAxisState({ axis: e }) {
		let t = this._getTrackElement({ axis: e }), n = this._getThumbElement({ axis: e }), r = this.state[e];
		if (t.style.display = r.visible ? "block" : "none", r.visible) {
			if (e === "horizontal") {
				t.style.width = `${r.trackSize}px`, n.style.width = `${r.thumbSize}px`, n.style.transform = `translateX(${r.thumbOffset}px)`;
				return;
			}
			t.style.height = `${r.trackSize}px`, n.style.height = `${r.thumbSize}px`, n.style.transform = `translateY(${r.thumbOffset}px)`;
		}
	}
	_getTrackElement({ axis: e }) {
		return e === "horizontal" ? this.horizontalTrack : this.verticalTrack;
	}
	_getThumbElement({ axis: e }) {
		return e === "horizontal" ? this.horizontalThumb : this.verticalThumb;
	}
	_ensureWrapperPosition() {
		let e = this.canvas.wrapperEl, { position: t } = window.getComputedStyle(e);
		(t === "static" || !t) && (e.style.position = "relative");
	}
	static _getPointerPosition({ axis: e, event: t }) {
		return e === "horizontal" ? t.clientX : t.clientY;
	}
	static _createEmptyState() {
		return {
			horizontal: e._createHiddenAxisState({ trackSize: 0 }),
			vertical: e._createHiddenAxisState({ trackSize: 0 })
		};
	}
	static _createHiddenAxisState({ trackSize: e }) {
		return {
			ratio: 0,
			thumbOffset: 0,
			thumbSize: 0,
			trackSize: e,
			visible: !1
		};
	}
	static _applyStyles({ element: e, styles: t }) {
		Object.assign(e.style, t);
	}
	static _clamp(e, t, n) {
		return Math.max(t, Math.min(n, e));
	}
}, kt = /* @__PURE__ */ "customData.backgroundType.format.contentType.width.height.originX.originY.locked.editable.evented.selectable.lockMovementX.lockMovementY.lockRotation.lockScalingX.lockScalingY.lockSkewingX.lockSkewingY.styles.lineFontDefaults.preserveExactTextGeometry.textCaseRaw.uppercase.autoExpand.linethrough.underline.fontStyle.fontWeight.backgroundOpacity.paddingTop.paddingRight.paddingBottom.paddingLeft.radiusTopLeft.radiusTopRight.radiusBottomRight.radiusBottomLeft.shapeComposite.shapePresetKey.shapeBaseWidth.shapeBaseHeight.shapeManualBaseWidth.shapeManualBaseHeight.shapeReplaceBoxWidth.shapeReplaceBoxHeight.shapeTextAutoExpand.shapeLayoutSignature.shapeAlignHorizontal.shapeAlignVertical.shapePaddingTop.shapePaddingRight.shapePaddingBottom.shapePaddingLeft.shapeFill.shapeStroke.shapeStrokeWidth.shapeStrokeDashArray.shapeOpacity.shapeRounding.shapeNodeType".split("."), At = [
	"id",
	"backgroundId",
	...kt
];
//#endregion
//#region src/editor/history-manager/diff-normalization.ts
function jt({ state: e }) {
	return JSON.parse(JSON.stringify(e));
}
function Mt({ value: e }) {
	if (Array.isArray(e)) {
		let t = [];
		for (let n = 0; n < e.length; n += 1) t.push(Mt({ value: e[n] }));
		return t;
	}
	if (e && typeof e == "object") {
		let t = {}, n = Object.keys(e).sort();
		for (let r = 0; r < n.length; r += 1) {
			let i = n[r];
			t[i] = Mt({ value: e[i] });
		}
		return t;
	}
	return e;
}
function Nt({ value: e }) {
	let t = Mt({ value: e });
	return JSON.stringify(t);
}
function Pt({ prevState: e, nextState: t }) {
	return Nt({ value: e }) === Nt({ value: t });
}
function Ft({ objects: e, id: t }) {
	for (let n = 0; n < e.length; n += 1) {
		let r = e[n];
		if (r.id === t) return r;
	}
	return null;
}
function It({ objects: e }) {
	let t = Ft({
		objects: e,
		id: "montage-area"
	});
	if (!t) return {
		width: 0,
		height: 0
	};
	let { width: n = 0, height: r = 0 } = t;
	return {
		width: n,
		height: r
	};
}
function Lt({ objects: e }) {
	let t = [], n = [...e];
	for (let e = 0; e < n.length; e += 1) {
		let r = n[e];
		t.push(r);
		let i = Array.isArray(r.objects) ? r.objects : [];
		for (let e = 0; e < i.length; e += 1) n.push(i[e]);
	}
	return t;
}
function Rt({ objects: e }) {
	let t = Lt({ objects: e });
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e], { type: r, backgroundOpacity: i, backgroundColor: a, textBackgroundColor: o } = n, s = typeof i == "number" ? i : 0, c = typeof a == "string" ? a : "", l = typeof o == "string" ? o : "", u = r === "textbox" || r === "background-textbox", d = c.length > 0 || l.length > 0;
		u && (s > 0 && d || (n.backgroundColor = null, n.textBackgroundColor = null));
	}
}
function zt({ prevState: e, nextState: t }) {
	let { width: n, height: r, objects: i } = e, { objects: a } = t, { width: o, height: s } = It({ objects: i }), { width: c, height: l } = It({ objects: a });
	o !== c || s !== l || (t.width = n, t.height = r);
}
function Bt({ prevState: e, nextState: t }) {
	let n = jt({ state: e }), r = jt({ state: t });
	return Rt({ objects: n.objects }), Rt({ objects: r.objects }), zt({
		prevState: n,
		nextState: r
	}), {
		prevState: n,
		nextState: r
	};
}
//#endregion
//#region src/editor/history-manager/load-state.ts
function Vt({ customData: e }) {
	return JSON.parse(JSON.stringify(e));
}
function Ht({ state: e }) {
	let t = JSON.parse(JSON.stringify(e)), n = (t.objects ?? []).filter((e) => e.id !== "overlay-mask");
	t.objects = n;
	for (let e = 0; e < n.length; e += 1) {
		let t = n[e], { customData: r } = t;
		!r || typeof r != "object" || (t.customData = JSON.stringify(r));
	}
	return t;
}
function Ut({ state: e, canvas: t }) {
	let { objects: n = [] } = e, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.length; e += 1) {
		let { customData: t, id: a } = n[e];
		if (!(!t || typeof t != "object")) {
			if (typeof a == "string") {
				r.set(a, t);
				continue;
			}
			i.set(e, t);
		}
	}
	let a = t.getObjects?.() ?? [];
	for (let e = 0; e < a.length; e += 1) {
		let t = a[e], { id: n } = t, o;
		typeof n == "string" && (o = r.get(n)), o ||= i.get(e), o && (t.customData = Vt({ customData: o }));
	}
}
//#endregion
//#region src/editor/history-manager/snapshot-interactivity.ts
function Wt({ object: e }) {
	return typeof e.getObjects == "function" ? e.getObjects() : [];
}
function Gt({ objects: e }) {
	for (let t = 0; t < e.length; t += 1) if (e[t].isEditing) return !0;
	return !1;
}
function Kt({ object: e }) {
	let t = typeof e.type == "string" ? e.type.toLowerCase() : "";
	return t === "textbox" || t === "background-textbox" || typeof e.isEditing == "boolean";
}
function qt({ object: e, withEvented: t = !1 }) {
	let n = {
		object: e,
		lockMovementX: e.lockMovementX,
		lockMovementY: e.lockMovementY,
		selectable: e.selectable
	};
	return t && (n.evented = e.evented), n;
}
function Jt({ object: e, snapshotStates: t }) {
	return e.shapeComposite !== !0 || !Gt({ objects: Wt({ object: e }) }) ? !1 : (t.push(qt({ object: e })), e.lockMovementX = !1, e.lockMovementY = !1, e.selectable = !0, !0);
}
function Yt({ object: e, snapshotStates: t }) {
	if (!Kt({ object: e })) return !1;
	let n = e.group, { isEditing: r } = e, i = n?.shapeComposite === !0, a = !!n?.locked;
	return !i || a || !r ? !1 : (t.push(qt({
		object: e,
		withEvented: !0
	})), e.lockMovementX = !1, e.lockMovementY = !1, e.selectable = !1, e.evented = !1, !0);
}
function Xt({ object: e, snapshotStates: t }) {
	if (!Kt({ object: e })) return !1;
	let n = !!e.lockMovementX, r = !!e.lockMovementY;
	return !n && !r ? !1 : (t.push(qt({ object: e })), e.lockMovementX = !1, e.lockMovementY = !1, e.selectable = !0, !0);
}
function Zt({ objects: e }) {
	let t = [];
	for (let n = 0; n < e.length; n += 1) {
		let r = e[n];
		r.locked || Jt({
			object: r,
			snapshotStates: t
		}) || Yt({
			object: r,
			snapshotStates: t
		}) || Xt({
			object: r,
			snapshotStates: t
		});
	}
	return t;
}
function Qt({ canvas: e }) {
	let t = [...e.getObjects?.() ?? []], n = [];
	for (let e = 0; e < t.length; e += 1) {
		let r = t[e];
		n.push(r);
		let i = Wt({ object: r });
		for (let e = 0; e < i.length; e += 1) t.push(i[e]);
	}
	return n;
}
function $t({ snapshotStates: e }) {
	for (let t = 0; t < e.length; t += 1) {
		let { object: n, lockMovementX: r, lockMovementY: i, selectable: a, evented: o } = e[t];
		n.lockMovementX = r, n.lockMovementY = i, n.selectable = a, o !== void 0 && (n.evented = o);
	}
}
function en({ canvas: e, callback: t }) {
	let n = Zt({ objects: Qt({ canvas: e }) });
	try {
		return t();
	} finally {
		$t({ snapshotStates: n });
	}
}
//#endregion
//#region src/editor/history-manager/index.ts
var tn = class {
	constructor({ editor: e }) {
		this.editor = e, this.canvas = e.canvas, this._isSavingState = !1, this._historySuspendCount = 0, this._isActionInProgress = !1, this._actionSnapshot = null, this._actionReason = null, this._pendingSaveTimeoutId = null, this._pendingSaveReason = null, this._pendingCommittedState = null, this._pendingCommittedStateReason = null, this._hasDeferredSaveAfterUnblock = !1, this.baseState = null, this.patches = [], this.currentIndex = 0, this.maxHistoryLength = e.options.maxHistoryLength, this.totalChangesCount = 0, this.baseStateChangesCount = 0, this._createDiffPatcher();
	}
	get skipHistory() {
		return this._historySuspendCount > 0 || this._isSavingState;
	}
	get lastPatch() {
		return this.patches[this.currentIndex - 1] || null;
	}
	_createDiffPatcher() {
		this.diffPatcher = w({
			objectHash(e) {
				return [JSON.stringify(e)].join("-");
			},
			arrays: {
				detectMove: !0,
				includeValueOnMove: !1
			},
			textDiff: { minLength: 60 }
		});
	}
	suspendHistory() {
		this._historySuspendCount += 1;
	}
	resumeHistory() {
		this._historySuspendCount = Math.max(0, this._historySuspendCount - 1);
	}
	beginAction({ reason: e }) {
		this._isActionInProgress || this.skipHistory || (this._isActionInProgress = !0, this._actionReason = e, this._actionSnapshot = this._captureCurrentState());
	}
	endAction({ reason: e } = {}) {
		this._isActionInProgress && (e && this._actionReason && e !== this._actionReason || this._clearPendingAction());
	}
	scheduleSaveState({ delayMs: e, reason: t }) {
		this._clearPendingSave(), this._pendingSaveReason = t, this._pendingSaveTimeoutId = setTimeout(this._handlePendingSaveTimeout.bind(this), e);
	}
	flushPendingSave({ reason: e } = {}) {
		return this._pendingSaveTimeoutId === null || e && this._pendingSaveReason !== e ? !1 : (this._clearPendingSave(), this.saveState(), !0);
	}
	stageCurrentStateForPendingSave({ reason: e }) {
		this.skipHistory || (this._pendingCommittedState = this._captureCurrentState(), this._pendingCommittedStateReason = e);
	}
	hasUnsavedChanges() {
		return this.totalChangesCount > 0;
	}
	getCurrentChangePosition() {
		return this.baseStateChangesCount + this.currentIndex;
	}
	_isUiBlocked() {
		let { interactionBlocker: e } = this.editor;
		return e ? e.isBlocked : !1;
	}
	_deferSaveAfterUiUnblock() {
		this._hasDeferredSaveAfterUnblock = !0;
	}
	flushDeferredSaveAfterUnblock() {
		return !this._hasDeferredSaveAfterUnblock || this._isUiBlocked() || this.skipHistory ? !1 : (this._hasDeferredSaveAfterUnblock = !1, this.saveState(), !0);
	}
	getFullState() {
		let { baseState: e, currentIndex: t, patches: n } = this, r = JSON.parse(JSON.stringify(e));
		for (let e = 0; e < t; e += 1) r = this.diffPatcher.patch(r, n[e].diff);
		return console.log("getFullState state", r), r;
	}
	_captureCurrentState() {
		return en({
			canvas: this.canvas,
			callback: () => this._serializeCanvasState()
		});
	}
	_serializeCanvasState() {
		let { canvas: e } = this;
		return this.editor.options.serializeHistoryState?.(e) ?? e.toDatalessObject([...At]);
	}
	_handlePendingSaveTimeout() {
		this._pendingSaveTimeoutId !== null && (this._pendingSaveTimeoutId = null, this._pendingSaveReason = null, this.saveState());
	}
	_deactivateTextEditing() {
		let { textManager: e } = this.editor;
		e && (e.isTextEditingActive &&= !1);
	}
	_clearPendingSave() {
		let { _pendingSaveTimeoutId: e } = this;
		e !== null && (clearTimeout(e), this._pendingSaveTimeoutId = null, this._pendingSaveReason = null);
	}
	_clearPendingCommittedState() {
		this._pendingCommittedState = null, this._pendingCommittedStateReason = null;
	}
	_consumePendingCommittedState({ reason: e } = {}) {
		if (!this._pendingCommittedState || e && this._pendingCommittedStateReason !== e) return null;
		let t = {
			state: this._pendingCommittedState,
			reason: this._pendingCommittedStateReason
		};
		return this._clearPendingCommittedState(), t;
	}
	_clearPendingAction() {
		this._isActionInProgress = !1, this._actionSnapshot = null, this._actionReason = null;
	}
	async _cancelPendingAction() {
		let { _isActionInProgress: e, _actionSnapshot: t } = this;
		if (!e || !t) return !1;
		let n = this._actionReason;
		this._clearPendingSave(), this._clearPendingCommittedState(), this._clearPendingAction(), this.suspendHistory();
		try {
			return await this.loadStateFromFullState(t), n === "text-edit" && this._deactivateTextEditing(), !0;
		} finally {
			this.resumeHistory();
		}
	}
	_saveSerializedState({ currentStateObj: e }) {
		if (!this.baseState) return this.baseState = e, this.patches = [], this.currentIndex = 0, console.log("Базовое состояние сохранено."), { saved: !1 };
		let t = this._resolveStateDiff({ currentStateObj: e });
		if (!t) return { saved: !1 };
		console.log("baseState", this.baseState), console.log("diff", t);
		let n = this._appendHistoryPatch({ diff: t });
		return console.log("Состояние сохранено. Текущий индекс истории:", this.currentIndex), {
			saved: !0,
			patchId: n
		};
	}
	_resolveStateDiff({ currentStateObj: e }) {
		let { prevState: t, nextState: n } = Bt({
			prevState: this.getFullState(),
			nextState: e
		}), r = this.diffPatcher.diff(t, n);
		return console.log("normalizedPrevState", t), console.log("normalizedCurrentState", n), r ? Pt({
			prevState: t,
			nextState: n
		}) ? (console.log("statesEqual. Нет изменений для сохранения."), null) : r : (console.log("Нет изменений для сохранения."), null);
	}
	_appendHistoryPatch({ diff: e }) {
		this.currentIndex < this.patches.length && this.patches.splice(this.currentIndex);
		let t = E();
		return this.totalChangesCount += 1, this.patches.push({
			id: t,
			diff: e
		}), this.currentIndex += 1, this._trimHistoryToMaxLength(), t;
	}
	_trimHistoryToMaxLength() {
		this.patches.length <= this.maxHistoryLength || (this.baseState = this.diffPatcher.patch(this.baseState, this.patches[0].diff), this.patches.shift(), --this.currentIndex, this.baseStateChangesCount += 1);
	}
	_createHistoryChangedPayload({ action: e, patchId: t }) {
		let n = {
			action: e,
			currentIndex: this.currentIndex,
			totalChangesCount: this.totalChangesCount,
			baseStateChangesCount: this.baseStateChangesCount,
			patchesCount: this.patches.length,
			canUndo: this.currentIndex > 0,
			canRedo: this.currentIndex < this.patches.length,
			hasUnsavedChanges: this.hasUnsavedChanges(),
			currentChangePosition: this.getCurrentChangePosition()
		};
		return t !== void 0 && (n.patchId = t), n;
	}
	_fireHistoryChanged({ action: e, patchId: t }) {
		this.canvas.fire("editor:history-changed", this._createHistoryChangedPayload({
			action: e,
			patchId: t
		}));
	}
	_fireHistoryChangedAfterSave(e) {
		e.saved && this._fireHistoryChanged({
			action: "save",
			patchId: e.patchId
		});
	}
	saveState() {
		if (console.log("saveState"), !this.skipHistory) {
			if (this._isUiBlocked()) {
				this._deferSaveAfterUiUnblock();
				return;
			}
			this._isSavingState = !0, console.time("saveState");
			try {
				let e = this._consumePendingCommittedState();
				if (e) {
					this._pendingSaveTimeoutId !== null && this._pendingSaveReason === e.reason && this._clearPendingSave(), e.reason === "text-edit" && this._deactivateTextEditing();
					let t = this._saveSerializedState({ currentStateObj: e.state });
					this._fireHistoryChangedAfterSave(t);
				}
				let t = this._captureCurrentState();
				console.timeEnd("saveState");
				let n = this._saveSerializedState({ currentStateObj: t });
				this._fireHistoryChangedAfterSave(n);
			} finally {
				this._isSavingState = !1;
			}
		}
	}
	resetHistory() {
		this.skipHistory || (this._clearPendingSave(), this._clearPendingCommittedState(), this._clearPendingAction(), this.baseState = this._captureCurrentState(), this.patches = [], this.currentIndex = 0, this.totalChangesCount = 0, this.baseStateChangesCount = 0);
	}
	async loadStateFromFullState(e) {
		if (!e) return;
		console.log("loadStateFromFullState fullState", e);
		let { canvas: t, canvasManager: n, interactionBlocker: r, backgroundManager: i, zoomManager: a, panConstraintManager: o } = this.editor, { width: s, height: c } = t, { width: l, height: u } = this.editor.montageArea;
		r.overlayMask = null;
		let d = Ht({ state: e });
		await this.editor.options.beforeHistoryStateLoad?.(t), await (this.editor.options.reviveHistoryState?.(t, d) ?? t.loadFromJSON(d)), Ut({
			state: e,
			canvas: t
		});
		let f = t.getObjects().find((e) => e.id === "montage-area"), p = !1, m = !1;
		f && (this.editor.montageArea = f, n.placeMontageAreaAtCanonicalScenePosition(), p = f.width !== l || f.height !== u, m = s !== t.getWidth() || c !== t.getHeight());
		let h = t.getObjects().find((e) => e.id === "background");
		h ? i.backgroundObject = h : i.removeBackground({ withoutSave: !0 });
		let { textManager: g, shapeManager: _ } = this.editor;
		t.getObjects().forEach((e) => {
			g.commitStandaloneTextScale({ target: e }), _.commitRehydratedShapeLayout({ target: e });
		}), f && (r.ensureOverlay(), m ? n.updateCanvas() : p ? (a.calculateAndApplyDefaultZoom(), n.refreshMontageDerivedState()) : (a.updateDefaultZoom(), n.refreshMontageDerivedState(), o.updateBounds())), t.renderAll(), t.fire("editor:history-state-loaded", {
			fullState: e,
			currentIndex: this.currentIndex,
			totalChangesCount: this.totalChangesCount,
			baseStateChangesCount: this.baseStateChangesCount,
			patchesCount: this.patches.length,
			patches: this.patches
		});
	}
	async undo() {
		if (!this.skipHistory && !await this._cancelPendingAction()) {
			if (this.flushPendingSave(), this.currentIndex <= 0) {
				console.log("Нет предыдущих состояний для отмены.");
				return;
			}
			this.suspendHistory();
			try {
				--this.currentIndex, --this.totalChangesCount;
				let e = this.getFullState();
				await this.loadStateFromFullState(e), console.log("Undo выполнен. Текущий индекс истории:", this.currentIndex), this.canvas.fire("editor:undo", {
					fullState: e,
					currentIndex: this.currentIndex,
					totalChangesCount: this.totalChangesCount,
					baseStateChangesCount: this.baseStateChangesCount,
					patchesCount: this.patches.length,
					patches: this.patches
				}), this._fireHistoryChanged({ action: "undo" });
			} catch (e) {
				this.editor.errorManager.emitError({
					origin: "HistoryManager",
					method: "undo",
					code: "UNDO_ERROR",
					message: "Ошибка отмены действия",
					data: e
				});
			} finally {
				this.resumeHistory();
			}
		}
	}
	async redo() {
		if (!this.skipHistory && !await this._cancelPendingAction()) {
			if (this.flushPendingSave(), this.currentIndex >= this.patches.length) {
				console.log("Нет состояний для повтора.");
				return;
			}
			this.suspendHistory();
			try {
				this.currentIndex += 1, this.totalChangesCount += 1;
				let e = this.getFullState();
				console.log("fullState", e), await this.loadStateFromFullState(e), console.log("Redo выполнен. Текущий индекс истории:", this.currentIndex), this.canvas.fire("editor:redo", {
					fullState: e,
					currentIndex: this.currentIndex,
					totalChangesCount: this.totalChangesCount,
					baseStateChangesCount: this.baseStateChangesCount,
					patchesCount: this.patches.length,
					patches: this.patches
				}), this._fireHistoryChanged({ action: "redo" });
			} catch (e) {
				this.editor.errorManager.emitError({
					origin: "HistoryManager",
					method: "redo",
					code: "REDO_ERROR",
					message: "Ошибка повтора действия",
					data: e
				});
			} finally {
				this.resumeHistory();
			}
		}
	}
};
//#endregion
//#region src/editor/image-manager/blob-url-registry.ts
function nn({ src: e }) {
	return e.startsWith("blob:");
}
function rn({ src: e }) {
	return e.toLowerCase().startsWith("data:");
}
function an({ src: e }) {
	return e.toLowerCase().startsWith("data:image/");
}
function on({ error: e }) {
	return e instanceof TypeError || typeof DOMException < "u" && e instanceof DOMException;
}
var sn = class {
	constructor() {
		this.urls = [];
	}
	createObjectUrl({ source: e }) {
		let t = URL.createObjectURL(e);
		return this.urls.push(t), t;
	}
	async getOrCreateForSource({ src: e, cache: t }) {
		if (nn({ src: e })) return e;
		let n = t.get(e);
		if (n) return n;
		if (rn({ src: e })) {
			let n = await this.createObjectUrlFromDataUrl({ src: e });
			return n ? (t.set(e, n), n) : null;
		}
		let r = await this.fetchAsBlobUrl({ src: e });
		return r ? (t.set(e, r), r) : null;
	}
	async createObjectUrlFromDataUrl({ src: e }) {
		if (!an({ src: e })) return null;
		let t = await this.fetchImageDataUrlAsBlob({ src: e });
		return t ? this.createObjectUrl({ source: t }) : null;
	}
	async fetchImageDataUrlAsBlob({ src: e }) {
		try {
			let t = await fetch(e);
			if (!t.ok) return null;
			let n = await t.blob();
			return n.type.toLowerCase().startsWith("image/") ? n : null;
		} catch (e) {
			if (!on({ error: e })) throw e;
			return null;
		}
	}
	async fetchAsBlobUrl({ src: e }) {
		try {
			let t = await fetch(e, { mode: "cors" });
			if (!t.ok) return null;
			let n = await t.blob();
			return this.createObjectUrl({ source: n });
		} catch (e) {
			if (!on({ error: e })) throw e;
			return null;
		}
	}
	revokeAll() {
		this.urls.forEach((e) => URL.revokeObjectURL(e)), this.urls = [];
	}
}, cn = "application/octet-stream";
function ln({ src: e }) {
	return e.startsWith("blob:");
}
function un(e = "") {
	let t = e.match(/^[^/]+\/([^+;]+)/);
	return t ? t[1] : "";
}
function dn({ acceptContentTypes: e }) {
	return e.map((e) => un(e)).filter((e) => e !== "");
}
function fn({ contentType: e = "", acceptContentTypes: t }) {
	return t.includes(e);
}
function pn({ acceptContentTypes: e }) {
	let t = {};
	return e.forEach((e) => {
		let n = un(e);
		n !== "" && (t[n] = e);
	}), t;
}
function mn({ url: e, acceptContentTypes: t }) {
	try {
		let n = new URL(e).pathname.split(".").pop()?.toLowerCase(), r = pn({ acceptContentTypes: t });
		return n && r[n] || cn;
	} catch (t) {
		return console.warn("Не удалось определить расширение из URL:", e, t), cn;
	}
}
async function hn({ src: e }) {
	try {
		let t = await (await fetch(e)).blob();
		if (t.type && t.type.startsWith("image/")) return t.type.split(";")[0];
	} catch (e) {
		console.warn("Не удалось определить MIME-тип blob URL:", e);
	}
	return cn;
}
async function gn({ src: e, acceptContentTypes: t }) {
	if (ln({ src: e })) return hn({ src: e });
	if (e.startsWith("data:")) {
		let t = e.match(/^data:([^;]+)/);
		return t ? t[1] : cn;
	}
	try {
		let t = (await fetch(e, { method: "HEAD" })).headers.get("content-type");
		if (t && t.startsWith("image/")) return t.split(";")[0];
	} catch (e) {
		console.warn("HEAD запрос неудачен, определяем тип по расширению:", e);
	}
	return mn({
		url: e,
		acceptContentTypes: t
	});
}
async function _n({ source: e, acceptContentTypes: t }) {
	return typeof e == "string" ? gn({
		src: e,
		acceptContentTypes: t
	}) : e.type || cn;
}
//#endregion
//#region src/editor/image-manager/export-utils.ts
function vn(e, { exportAsBase64: t, exportAsBlob: n, fileName: r = "image.svg" } = {}) {
	return n ? new Blob([e], { type: "image/svg+xml" }) : t ? `data:image/svg+xml;base64,${window.btoa(encodeURIComponent(e))}` : new File([e], r.replace(/\.[^/.]+$/, ".svg"), { type: "image/svg+xml" });
}
async function yn({ editor: e, blob: t, contentType: n }) {
	let r = await createImageBitmap(t), i = await e.workerManager.post("toDataURL", {
		contentType: n,
		quality: 1,
		bitmap: r
	}, [r]);
	if (typeof i != "string") throw Error("toDataURL worker должен вернуть строку");
	return i;
}
//#endregion
//#region src/editor/image-manager/canvas-export.ts
function bn({ options: e }) {
	let { fileName: t = "image.png", contentType: n = "image/png", exportAsBase64: r = !1, exportAsBlob: i = !1 } = e, a = n === "application/pdf", o = a ? "image/jpeg" : n;
	return {
		fileName: t,
		contentType: n,
		exportAsBase64: r,
		exportAsBlob: i,
		exportContentType: o,
		format: un(o),
		isPDF: a
	};
}
async function xn({ editor: e, request: t }) {
	let { canvas: n, canvasManager: r } = e, { left: i, top: a, width: o, height: s } = r.getMontageAreaSceneBounds(), c = await n.clone([
		"id",
		"format",
		"locked"
	]);
	try {
		Sn({
			editor: e,
			tmpCanvas: c,
			left: i,
			top: a,
			width: o,
			height: s,
			contentType: t.exportContentType
		});
		let n = c.getObjects().filter((e) => e.format).every((e) => e.format === "svg");
		return t.format === "svg" && n ? {
			type: "svg",
			svgString: c.toSVG(),
			width: o,
			height: s
		} : {
			type: "raster",
			blob: await Tn({
				canvasElement: c.getElement(),
				contentType: t.exportContentType
			}),
			allCanvasItemsAreSVG: n,
			width: o,
			height: s
		};
	} finally {
		c.dispose();
	}
}
function Sn({ editor: e, tmpCanvas: t, left: n, top: r, width: i, height: a, contentType: o }) {
	t.enableRetinaScaling = !1, ["image/jpg", "image/jpeg"].includes(o) && (t.backgroundColor = "#ffffff"), Cn({
		editor: e,
		tmpCanvas: t
	}), wn({
		editor: e,
		tmpCanvas: t
	}), t.clipPath = void 0, t.viewportTransform = [
		1,
		0,
		0,
		1,
		-n,
		-r
	], t.setDimensions({
		width: i,
		height: a
	}, { backstoreOnly: !0 }), t.renderAll();
}
function Cn({ editor: e, tmpCanvas: t }) {
	let n = t.getObjects().find((t) => t.id === e.montageArea.id);
	n && (n.visible = !1);
}
function wn({ editor: e, tmpCanvas: t }) {
	let n = e.interactionBlocker?.overlayMask?.id;
	if (!e.interactionBlocker?.isBlocked || !n) return;
	let r = t.getObjects().find((e) => e.id === n);
	r && (r.visible = !1);
}
async function Tn({ canvasElement: e, contentType: t }) {
	return new Promise((n, r) => {
		e.toBlob((e) => {
			e ? n(e) : r(/* @__PURE__ */ Error("Failed to create Blob from canvas"));
		}, t, 1);
	});
}
async function En({ editor: e, request: t, snapshot: n }) {
	if (n.type === "svg") return Dn({
		editor: e,
		request: t,
		snapshot: n
	});
	if (t.exportAsBlob) return An({
		editor: e,
		request: t,
		image: n.blob,
		contentType: t.exportContentType
	});
	let r = await yn({
		editor: e,
		blob: n.blob,
		contentType: t.exportContentType
	});
	return t.isPDF ? On({
		editor: e,
		request: t,
		snapshot: n,
		dataUrl: r
	}) : t.exportAsBase64 ? An({
		editor: e,
		request: t,
		image: r,
		contentType: t.exportContentType
	}) : kn({
		editor: e,
		request: t,
		snapshot: n
	});
}
function Dn({ editor: e, request: t, snapshot: n }) {
	return An({
		editor: e,
		request: t,
		image: vn(n.svgString, {
			exportAsBase64: t.exportAsBase64,
			exportAsBlob: t.exportAsBlob,
			fileName: t.fileName
		}),
		format: "svg",
		contentType: "image/svg+xml",
		fileName: t.fileName.replace(/\.[^/.]+$/, ".svg")
	});
}
async function On({ editor: e, request: t, snapshot: n, dataUrl: r }) {
	let i = .264583, a = n.width * i, o = n.height * i, s = (await e.moduleLoader.loadModule("jspdf")).jsPDF, c = new s({
		orientation: a > o ? "landscape" : "portrait",
		unit: "mm",
		format: [a, o]
	});
	if (c.addImage(String(r), "JPG", 0, 0, a, o), t.exportAsBase64) {
		let n = c.output("datauristring");
		if (typeof n != "string") throw Error("jsPDF должен вернуть data URI строку");
		return An({
			editor: e,
			request: t,
			image: n,
			format: "pdf",
			contentType: "application/pdf"
		});
	}
	return An({
		editor: e,
		request: t,
		image: new File([c.output("blob")], t.fileName, { type: "application/pdf" }),
		format: "pdf",
		contentType: "application/pdf"
	});
}
function kn({ editor: e, request: t, snapshot: n }) {
	let r = t.format === "svg" && !n.allCanvasItemsAreSVG ? t.fileName.replace(/\.[^/.]+$/, ".png") : t.fileName;
	return An({
		editor: e,
		request: t,
		image: new File([n.blob], r, { type: t.exportContentType }),
		contentType: t.exportContentType,
		fileName: r
	});
}
function An({ editor: e, request: t, image: n, format: r = t.format, contentType: i, fileName: a = t.fileName }) {
	let o = {
		image: n,
		format: r,
		contentType: i,
		fileName: a
	};
	return e.canvas.fire("editor:canvas-exported", o), o;
}
var jn = .1, Mn = 4096, Nn = 4096, Pn = "application/image-editor:", Fn = ["id", ...kt];
//#endregion
//#region src/editor/image-manager/image-resize.ts
function In({ editor: e, data: t }) {
	let { sizeType: n, maxWidth: r, maxHeight: i, minWidth: a, minHeight: o } = t, s = `Размер изображения больше максимального размера канваса, поэтому оно будет уменьшено до максимальных размеров c сохранением пропорций: ${r}x${i}`;
	n === "min" && (s = `Размер изображения меньше минимального размера канваса, поэтому оно будет увеличено до минимальных размеров c сохранением пропорций: ${a}x${o}`), e.errorManager.emitWarning({
		origin: "ImageManager",
		method: "resizeImageToBoundaries",
		code: "IMAGE_RESIZE_WARNING",
		message: s,
		data: t
	});
}
async function Ln({ editor: e, options: t }) {
	let { dataURL: n, sizeType: r = "max", contentType: i = "image/png", quality: a = 1, maxWidth: o = Mn, maxHeight: s = Nn, minWidth: c = 16, minHeight: l = 16, asBase64: u = !1, emitMessage: d = !0 } = t, f = {
		dataURL: n,
		sizeType: r,
		contentType: i,
		quality: a,
		maxWidth: o,
		maxHeight: s,
		minWidth: c,
		minHeight: l
	};
	d && In({
		editor: e,
		data: f
	});
	let p = await e.workerManager.post("resizeImage", f);
	if (!(p instanceof Blob)) throw Error("resizeImage worker должен вернуть Blob");
	if (!u) return p;
	let m = await createImageBitmap(p), h = await e.workerManager.post("toDataURL", {
		contentType: i,
		quality: a,
		bitmap: m
	}, [m]);
	if (typeof h != "string") throw Error("toDataURL worker должен вернуть строку");
	return h;
}
//#endregion
//#region src/editor/image-manager/image-scale.ts
function Rn({ montageArea: e, imageObject: t, scaleType: n = "contain" }) {
	if (!e || !t) return 1;
	let { width: r, height: i } = e, { width: a, height: o } = t;
	return n === "contain" || n === "image-contain" ? Math.min(r / a, i / o) : n === "cover" || n === "image-cover" ? Math.max(r / a, i / o) : 1;
}
//#endregion
//#region src/editor/image-manager/import-image.ts
function zn(e) {
	return e instanceof File || typeof e == "string";
}
async function Bn({ options: e, defaultScale: t, acceptContentTypes: n }) {
	let { source: r, withoutSave: i = !1, fromClipboard: a = !1, isBackground: o = !1, withoutSelection: s = !1, withoutAdding: c = !1, customData: l = null } = e;
	if (!r) return null;
	let u = e.scale ?? t, d = zn(r) ? await _n({
		source: r,
		acceptContentTypes: n
	}) : Vn({ source: r });
	return {
		source: r,
		scale: u,
		withoutSave: i,
		fromClipboard: a,
		isBackground: o,
		withoutSelection: s,
		withoutAdding: c,
		customData: l,
		contentType: d,
		format: un(d)
	};
}
function Vn({ source: e }) {
	if (!$n(e)) return "application/octet-stream";
	let { type: t } = e;
	return typeof t == "string" ? t : "application/octet-stream";
}
async function Hn({ dataUrl: e, format: t }) {
	if (t === "svg") {
		let t = await S(e), n = t.objects.filter((e) => !!e);
		return C.groupSVGElements(n, t.options);
	}
	return a.fromURL(e, { crossOrigin: "anonymous" });
}
function Un({ image: e }) {
	let t = e.getElement();
	if (t instanceof HTMLImageElement) return t.src;
	if (t instanceof HTMLCanvasElement) return t.toDataURL();
	throw Error("Не удалось получить источник изображения для resize");
}
async function Wn({ editor: e, blobUrls: t, image: n, contentType: r }) {
	if (!(n instanceof a)) return n;
	let { width: i, height: o } = n;
	return o > 4096 || i > 4096 ? Qn({
		editor: e,
		blobUrls: t,
		image: n,
		contentType: r,
		sizeType: "max"
	}) : o < 16 || i < 16 ? Qn({
		editor: e,
		blobUrls: t,
		image: n,
		contentType: r,
		sizeType: "min"
	}) : n;
}
function Gn({ image: e, request: t }) {
	e.set({
		id: `${e.type}-${E()}`,
		format: t.format,
		contentType: t.contentType,
		customData: t.customData ?? null,
		originX: "left",
		originY: "top"
	});
}
function Kn({ editor: e, image: t, request: n }) {
	if (n.scale === "scale-montage") {
		e.canvasManager.scaleMontageAreaToImage({
			object: t,
			withoutSave: !0
		});
		return;
	}
	let { montageArea: r, transformManager: i } = e, { width: a, height: o } = r, { width: s, height: c } = t, l = Rn({
		montageArea: r,
		imageObject: t,
		scaleType: n.scale
	});
	if (n.scale === "image-contain" && l < 1) {
		i.fitObject({
			object: t,
			type: "contain",
			withoutSave: !0
		});
		return;
	}
	n.scale === "image-cover" && (s <= a && c <= o || i.fitObject({
		object: t,
		type: "cover",
		withoutSave: !0
	}));
}
function qn({ editor: e, request: t, acceptContentTypes: n, acceptFormats: r }) {
	let { source: i, format: a, contentType: o, fromClipboard: s, isBackground: c, withoutSelection: l, withoutAdding: u, customData: d } = t, f = `Неверный contentType для изображения: ${o}. Ожидается один из: ${n.join(", ")}.`;
	e.errorManager.emitError({
		origin: "ImageManager",
		method: "importImage",
		code: "INVALID_CONTENT_TYPE",
		message: f,
		data: {
			source: i,
			format: a,
			contentType: o,
			acceptContentTypes: n,
			acceptFormats: r,
			fromClipboard: s,
			isBackground: c,
			withoutSelection: l,
			withoutAdding: u,
			customData: d
		}
	});
}
function Jn({ editor: e, request: t }) {
	let { source: n, format: r, contentType: i, fromClipboard: a, isBackground: o, withoutSelection: s, withoutAdding: c, customData: l } = t;
	e.errorManager.emitError({
		origin: "ImageManager",
		method: "importImage",
		code: "INVALID_SOURCE_TYPE",
		message: "Неверный тип источника изображения. Ожидается URL или объект File.",
		data: {
			source: n,
			format: r,
			contentType: i,
			fromClipboard: a,
			isBackground: o,
			withoutSelection: s,
			withoutAdding: c,
			customData: l
		}
	});
}
async function Yn({ request: e, blobUrls: t }) {
	let { source: n } = e;
	if (n instanceof File) return t.createObjectUrl({ source: n });
	let r = await t.fetchAsBlobUrl({ src: n });
	if (!r) throw Error("Не удалось загрузить изображение по URL");
	return r;
}
function Xn({ editor: e, image: t, request: n }) {
	let r = er({
		image: t,
		request: n
	});
	return n.withoutAdding || tr({
		editor: e,
		image: t,
		request: n
	}), e.historyManager.resumeHistory(), !n.withoutAdding && !n.withoutSave && e.historyManager.saveState(), e.canvas.fire("editor:image-imported", r), r;
}
async function Zn({ objects: e, cache: t, blobUrls: n }) {
	let r = [...e];
	for (let e = 0; e < r.length; e += 1) {
		let i = r[e];
		if (!$n(i)) continue;
		let { type: a, src: o, objects: s } = i;
		if ((typeof a == "string" ? a.toLowerCase() : "") === "image" && typeof o == "string") {
			let e = await n.getOrCreateForSource({
				src: o,
				cache: t
			});
			e && (i.src = e);
		}
		Array.isArray(s) && r.push(...s);
	}
}
async function Qn({ editor: e, blobUrls: t, image: n, contentType: r, sizeType: i }) {
	let o = await Ln({
		editor: e,
		options: {
			dataURL: Un({ image: n }),
			sizeType: i,
			contentType: r
		}
	}), s = t.createObjectUrl({ source: o });
	return a.fromURL(s, { crossOrigin: "anonymous" });
}
function $n(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function er({ image: e, request: t }) {
	let { format: n, contentType: r, scale: i, withoutSave: a, source: o, fromClipboard: s, isBackground: c, withoutSelection: l, withoutAdding: u, customData: d } = t;
	return {
		image: e,
		format: n,
		contentType: r,
		scale: i,
		withoutSave: a,
		source: o,
		fromClipboard: s,
		isBackground: c,
		withoutSelection: l,
		withoutAdding: u,
		customData: d
	};
}
function tr({ editor: e, image: t, request: n }) {
	let { canvas: r, canvasManager: i } = e;
	r.add(t), i.centerObjectToMontageArea({ object: t }), n.withoutSelection || r.setActiveObject(t), r.renderAll();
}
function nr({ editor: e, error: t, request: n }) {
	e.errorManager.emitError({
		origin: "ImageManager",
		method: "importImage",
		code: "IMPORT_FAILED",
		message: `Ошибка импорта изображения: ${t.message}`,
		data: n
	});
}
//#endregion
//#region src/editor/image-manager/object-export.ts
function rr({ object: e, options: t }) {
	let { fileName: n, contentType: r, exportAsBase64: i = !1, exportAsBlob: a = !1 } = t, { contentType: o, format: s = "" } = e || {}, c = r ?? o ?? "image/png", l = un(c) || s || "png";
	return {
		object: e,
		contentType: c,
		format: l,
		fileName: n ?? `image.${l}`,
		exportAsBase64: i,
		exportAsBlob: a
	};
}
function ir(e) {
	return !!e.object;
}
async function ar({ editor: e, request: t }) {
	return t.format === "svg" ? lr({
		editor: e,
		request: t
	}) : or(t) ? ur({
		editor: e,
		request: t
	}) : dr({
		editor: e,
		request: t
	});
}
function or(e) {
	return !e.exportAsBase64 || !(e.object instanceof a) ? !1 : !sr({ image: e.object });
}
function sr({ image: e }) {
	let t = Number(e.cropX ?? 0), n = Number(e.cropY ?? 0), r = Number(e.width ?? 0), i = Number(e.height ?? 0), a = cr({ image: e });
	return !!(t || n || a.width && r && r < a.width || a.height && i && i < a.height);
}
function cr({ image: e }) {
	let t = e.getElement();
	return {
		width: t.naturalWidth || t.videoWidth || t.width || 0,
		height: t.naturalHeight || t.videoHeight || t.height || 0
	};
}
function lr({ editor: e, request: t }) {
	let n = vn(t.object.toSVG(), {
		exportAsBase64: t.exportAsBase64,
		exportAsBlob: t.exportAsBlob,
		fileName: t.fileName
	}), r = {
		object: t.object,
		image: n,
		format: t.format,
		contentType: "image/svg+xml",
		fileName: t.fileName.replace(/\.[^/.]+$/, ".svg")
	};
	return e.canvas.fire("editor:object-exported", r), r;
}
async function ur({ editor: e, request: t }) {
	let n = await createImageBitmap(t.object.getElement()), r = await e.workerManager.post("toDataURL", {
		contentType: t.contentType,
		quality: 1,
		bitmap: n
	}, [n]);
	if (typeof r != "string") throw Error("toDataURL worker должен вернуть строку");
	let i = {
		object: t.object,
		image: r,
		format: t.format,
		contentType: t.contentType,
		fileName: t.fileName
	};
	return e.canvas.fire("editor:object-exported", i), i;
}
async function dr({ editor: e, request: t }) {
	let n = await fr({ request: t });
	return t.exportAsBlob ? pr({
		editor: e,
		request: t,
		image: n
	}) : t.exportAsBase64 ? pr({
		editor: e,
		request: t,
		image: await yn({
			editor: e,
			blob: n,
			contentType: t.contentType
		})
	}) : pr({
		editor: e,
		request: t,
		image: new File([n], t.fileName, { type: t.contentType })
	});
}
async function fr({ request: e }) {
	let t = e.object.toCanvasElement({ enableRetinaScaling: !1 });
	return new Promise((n, r) => {
		t.toBlob((e) => {
			e ? n(e) : r(/* @__PURE__ */ Error("Failed to create Blob from canvas"));
		}, e.contentType, 1);
	});
}
function pr({ editor: e, request: t, image: n }) {
	let r = {
		object: t.object,
		image: n,
		format: t.format,
		contentType: t.contentType,
		fileName: t.fileName
	};
	return e.canvas.fire("editor:object-exported", r), r;
}
//#endregion
//#region src/editor/image-manager/index.ts
var mr = class {
	constructor({ editor: e }) {
		this.editor = e, this.options = e.options, this._blobUrls = new sn(), this.acceptContentTypes = this.editor.options.acceptContentTypes, this.acceptFormats = this.getAllowedFormatsFromContentTypes();
	}
	async prepareSerializedImageSources({ state: e }) {
		if (!e) return e;
		let t = JSON.parse(JSON.stringify(e)), n = /* @__PURE__ */ new Map();
		return await Zn({
			objects: Array.isArray(t.objects) ? t.objects : [],
			cache: n,
			blobUrls: this._blobUrls
		}), t;
	}
	async importImage(e) {
		let t = await Bn({
			options: e,
			defaultScale: this.options.scaleType === "cover" ? "image-cover" : "image-contain",
			acceptContentTypes: this.acceptContentTypes
		});
		if (!t) return null;
		let { source: n, contentType: r } = t;
		if (zn(n) && !this.isAllowedContentType(r)) return qn({
			editor: this.editor,
			request: t,
			acceptContentTypes: this.acceptContentTypes,
			acceptFormats: this.acceptFormats
		}), null;
		let { historyManager: i } = this.editor;
		i.suspendHistory();
		try {
			if (!zn(n)) return Jn({
				editor: this.editor,
				request: t
			}), i.resumeHistory(), null;
			let e = {
				...t,
				source: n
			}, r = await Hn({
				dataUrl: await Yn({
					request: e,
					blobUrls: this._blobUrls
				}),
				format: t.format
			}), a = await Wn({
				editor: this.editor,
				blobUrls: this._blobUrls,
				image: r,
				contentType: t.contentType
			});
			return Gn({
				image: a,
				request: e
			}), Kn({
				editor: this.editor,
				image: a,
				request: e
			}), Xn({
				editor: this.editor,
				image: a,
				request: e
			});
		} catch (e) {
			return nr({
				editor: this.editor,
				error: e,
				request: t
			}), i.resumeHistory(), null;
		}
	}
	async resizeImageToBoundaries(e) {
		return Ln({
			editor: this.editor,
			options: e
		});
	}
	async exportCanvasAsImageFile(e = {}) {
		let t = bn({ options: e });
		try {
			let e = await xn({
				editor: this.editor,
				request: t
			});
			return await En({
				editor: this.editor,
				request: t,
				snapshot: e
			});
		} catch (e) {
			return this.editor.errorManager.emitError({
				origin: "ImageManager",
				method: "exportCanvasAsImageFile",
				code: "IMAGE_EXPORT_FAILED",
				message: `Ошибка экспорта изображения: ${e.message}`,
				data: {
					contentType: t.contentType,
					fileName: t.fileName,
					exportAsBase64: t.exportAsBase64,
					exportAsBlob: t.exportAsBlob
				}
			}), null;
		}
	}
	async exportObjectAsImageFile(e = {}) {
		let { object: t, exportAsBase64: n = !1, exportAsBlob: r = !1 } = e, i = rr({
			object: (t || this.editor.canvas.getActiveObject()) ?? void 0,
			options: e
		});
		if (!ir(i)) return this.editor.errorManager.emitError({
			origin: "ImageManager",
			method: "exportObjectAsImageFile",
			code: "NO_OBJECT_SELECTED",
			message: "Не выбран объект для экспорта",
			data: {
				contentType: i.contentType,
				fileName: i.fileName,
				exportAsBase64: n,
				exportAsBlob: r
			}
		}), null;
		try {
			return await ar({
				editor: this.editor,
				request: i
			});
		} catch (e) {
			return this.editor.errorManager.emitError({
				origin: "ImageManager",
				method: "exportObjectAsImageFile",
				code: "IMAGE_EXPORT_FAILED",
				message: `Ошибка экспорта объекта: ${e.message}`,
				data: {
					contentType: i.contentType,
					fileName: i.fileName,
					exportAsBase64: n,
					exportAsBlob: r
				}
			}), null;
		}
	}
	revokeBlobUrls() {
		this._blobUrls.revokeAll();
	}
	getAllowedFormatsFromContentTypes() {
		return dn({ acceptContentTypes: this.acceptContentTypes });
	}
	isAllowedContentType(e = "") {
		return fn({
			contentType: e,
			acceptContentTypes: this.acceptContentTypes
		});
	}
	async getContentType(e) {
		return typeof e == "string" ? this.getContentTypeFromUrl(e) : _n({
			source: e,
			acceptContentTypes: this.acceptContentTypes
		});
	}
	async getContentTypeFromUrl(e) {
		return gn({
			src: e,
			acceptContentTypes: this.acceptContentTypes
		});
	}
	getContentTypeFromExtension(e) {
		return mn({
			url: e,
			acceptContentTypes: this.acceptContentTypes
		});
	}
	calculateScaleFactor({ imageObject: e, scaleType: t = "contain" }) {
		return Rn({
			montageArea: this.editor.montageArea,
			imageObject: e,
			scaleType: t
		});
	}
	getFormatFromContentType(e = "") {
		return un(e);
	}
}, hr = (e, t, n) => Math.max(Math.min(e, n), t), gr = (e, t) => e * t;
function _r(e) {
	return (e?.type === "image" || e?.format === "svg") && typeof e?.width == "number" && typeof e?.height == "number";
}
var vr = class {
	constructor({ editor: e }) {
		this.editor = e;
	}
	getEditorContainer() {
		let { canvas: e, options: { editorContainer: t } } = this.editor;
		return e.editorContainer || t;
	}
	getVisibleCenterPoint() {
		let { canvas: e } = this.editor, t = e.getZoom(), n = e.viewportTransform, r = e.getWidth(), i = e.getHeight(), a = this.getMontageAreaSceneBounds(), o = (r / 2 - n[4]) / t, s = (i / 2 - n[5]) / t;
		return new p(hr(o, a.left, a.right), hr(s, a.top, a.bottom));
	}
	getMontageAreaSceneCenter() {
		let { montageArea: e } = this.editor;
		return new p(e.left, e.top);
	}
	getMontageAreaCanonicalSceneCenter() {
		let { montageArea: e } = this.editor;
		return new p(e.width / 2, e.height / 2);
	}
	getMontageAreaSceneBounds() {
		let { montageArea: e } = this.editor, t = this.getMontageAreaSceneCenter(), n = e.width / 2, r = e.height / 2;
		return {
			left: t.x - n,
			top: t.y - r,
			right: t.x + n,
			bottom: t.y + r,
			width: e.width,
			height: e.height,
			center: t
		};
	}
	getObjectPlacement({ object: e, originX: t, originY: n }) {
		let r = t ?? e.originX ?? "center", i = n ?? e.originY ?? "center", a = e.getPointByOrigin(r, i), o = e.group ? a.transform(e.group.calcTransformMatrix()) : a;
		return {
			left: o.x,
			top: o.y,
			originX: r,
			originY: i
		};
	}
	resolveObjectPlacement({ object: e, left: t, top: n, originX: r, originY: i, fallbackPoint: a }) {
		let o = r ?? e.originX ?? "center", s = i ?? e.originY ?? "center", c = this.getObjectPlacement({
			object: e,
			originX: o,
			originY: s
		});
		return {
			left: t ?? a?.x ?? c.left,
			top: n ?? a?.y ?? c.top,
			originX: o,
			originY: s
		};
	}
	applyObjectPlacement({ object: e, placement: t }) {
		let { left: n, top: r, originX: i, originY: a } = t;
		e.set({
			originX: i,
			originY: a
		}), e.setXY(new p(n, r), i, a), e.setCoords();
	}
	centerObjectToMontageArea({ object: e }) {
		let t = this.getMontageAreaSceneCenter();
		e.setPositionByOrigin(t, "center", "center"), e.setCoords();
	}
	syncClipPathWithMontageArea() {
		let { canvas: e, montageArea: t } = this.editor, { clipPath: n } = e;
		n && (n.set({
			left: t.left,
			top: t.top,
			width: t.width,
			height: t.height,
			originX: t.originX,
			originY: t.originY
		}), n.setCoords());
	}
	placeMontageAreaAtCanonicalScenePosition() {
		let { montageArea: e } = this.editor, t = this.getMontageAreaCanonicalSceneCenter();
		e.set({
			left: t.x,
			top: t.y
		}), e.setCoords(), this.syncClipPathWithMontageArea();
	}
	refreshMontageDerivedState() {
		let { backgroundManager: e, interactionBlocker: t } = this.editor;
		e.backgroundObject && e.refresh(), t.isBlocked && t.refresh();
	}
	setResolutionWidth(e, { preserveProportional: t, withoutSave: n, adaptCanvasToContainer: r } = {}) {
		if (!e) return;
		let { canvas: i, montageArea: a, options: { canvasBackstoreWidth: o } } = this.editor, { width: s, height: c } = a, l = hr(Number(e), 16, Mn);
		if (!o || o === "auto" || r ? this.adaptCanvasToContainer() : o ? this.setCanvasBackstoreWidth(Number(o)) : this.setCanvasBackstoreWidth(l), a.set({ width: l }), this.placeMontageAreaAtCanonicalScenePosition(), t) {
			let e = gr(c, l / s);
			this.setResolutionHeight(e, {
				withoutSave: n,
				adaptCanvasToContainer: r
			});
			return;
		}
		this.editor.zoomManager.calculateAndApplyDefaultZoom(), this.refreshMontageDerivedState(), n || this.editor.historyManager.saveState(), i.fire("editor:resolution-width-changed", {
			width: l,
			preserveProportional: t,
			withoutSave: n,
			adaptCanvasToContainer: r
		}), this.editor.panConstraintManager.updateBounds();
	}
	setResolutionHeight(e, { preserveProportional: t, withoutSave: n, adaptCanvasToContainer: r } = {}) {
		if (!e) return;
		let { canvas: i, montageArea: a, options: { canvasBackstoreHeight: o } } = this.editor, { width: s, height: c } = a, l = hr(Number(e), 16, Nn);
		if (!o || o === "auto" || r ? this.adaptCanvasToContainer() : o ? this.setCanvasBackstoreHeight(Number(o)) : this.setCanvasBackstoreHeight(l), a.set({ height: l }), this.placeMontageAreaAtCanonicalScenePosition(), t) {
			let e = gr(s, l / c);
			this.setResolutionWidth(e, {
				withoutSave: n,
				adaptCanvasToContainer: r
			});
			return;
		}
		this.editor.zoomManager.calculateAndApplyDefaultZoom(), this.refreshMontageDerivedState(), n || this.editor.historyManager.saveState(), i.fire("editor:resolution-height-changed", {
			height: l,
			preserveProportional: t,
			withoutSave: n,
			adaptCanvasToContainer: r
		}), this.editor.panConstraintManager.updateBounds();
	}
	centerViewportToMontageArea() {
		let { canvas: e } = this.editor, t = e.getZoom(), n = this.getMontageAreaSceneCenter(), r = e.getWidth(), i = e.getHeight();
		e.setViewportTransform([
			t,
			0,
			0,
			t,
			r / 2 - n.x * t,
			i / 2 - n.y * t
		]), e.renderAll();
	}
	setCanvasBackstoreWidth(e) {
		if (!e || typeof e != "number") return;
		let t = hr(e, 16, Mn);
		this.editor.canvas.setDimensions({ width: t }, { backstoreOnly: !0 });
	}
	setCanvasBackstoreHeight(e) {
		if (!e || typeof e != "number") return;
		let t = hr(e, 16, Nn);
		this.editor.canvas.setDimensions({ height: t }, { backstoreOnly: !0 });
	}
	adaptCanvasToContainer() {
		let { canvas: e } = this.editor, t = this.getEditorContainer(), n = t.clientWidth, r = t.clientHeight, i = hr(n, 16, Mn), a = hr(r, 16, Nn);
		e.setDimensions({
			width: i,
			height: a
		}, { backstoreOnly: !0 });
	}
	updateCanvas() {
		let { canvas: e, montageArea: { width: t, height: n } } = this.editor;
		this.adaptCanvasToContainer(), this.placeMontageAreaAtCanonicalScenePosition(), this.editor.zoomManager.updateDefaultZoom(), this.centerViewportToMontageArea(), this.refreshMontageDerivedState(), e.fire("editor:canvas-updated", {
			width: t,
			height: n
		}), this.editor.panConstraintManager.updateBounds();
	}
	setCanvasCSSWidth(e) {
		this.setDisplayDimension({
			element: "canvas",
			dimension: "width",
			value: e
		});
	}
	setCanvasCSSHeight(e) {
		this.setDisplayDimension({
			element: "canvas",
			dimension: "height",
			value: e
		});
	}
	setCanvasWrapperWidth(e) {
		this.setDisplayDimension({
			element: "wrapper",
			dimension: "width",
			value: e
		});
	}
	setCanvasWrapperHeight(e) {
		this.setDisplayDimension({
			element: "wrapper",
			dimension: "height",
			value: e
		});
	}
	setEditorContainerWidth(e) {
		this.setDisplayDimension({
			element: "container",
			dimension: "width",
			value: e
		});
	}
	setEditorContainerHeight(e) {
		this.setDisplayDimension({
			element: "container",
			dimension: "height",
			value: e
		});
	}
	setDisplayDimension({ element: e = "canvas", dimension: t, value: n } = {}) {
		if (!n) return;
		let { canvas: r } = this.editor, i = [];
		switch (e) {
			case "canvas":
				i.push(r.lowerCanvasEl, r.upperCanvasEl);
				break;
			case "wrapper":
				i.push(r.wrapperEl);
				break;
			case "container":
				i.push(this.getEditorContainer());
				break;
			default: i.push(r.lowerCanvasEl, r.upperCanvasEl);
		}
		let a = t === "width" ? "width" : "height";
		if (typeof n == "string") {
			i.forEach((e) => {
				e.style[a] = n;
			});
			return;
		}
		if (isNaN(n)) return;
		let o = `${n}px`;
		i.forEach((e) => {
			e.style[a] = o;
		}), r.fire(`editor:display-${e}-${a}-changed`, {
			element: e,
			value: n
		});
	}
	scaleMontageAreaToImage({ object: e, preserveAspectRatio: t, withoutSave: n } = {}) {
		let { canvas: r, montageArea: i, transformManager: a } = this.editor, o = e || r.getActiveObject();
		if (!_r(o)) return;
		let { width: s, height: c } = o, l = Math.min(s, Mn), u = Math.min(c, Nn);
		if (t) {
			let { width: e, height: t } = i, n = s / e, r = c / t, a = Math.max(n, r);
			l = e * a, u = t * a;
		}
		this.setResolutionWidth(l, { withoutSave: !0 }), this.setResolutionHeight(u, { withoutSave: !0 }), a.resetObject({
			object: o,
			withoutSave: !0
		}), this.centerObjectToMontageArea({ object: o }), r.renderAll(), n || this.editor.historyManager.saveState(), r.fire("editor:montage-area-scaled-to-image", {
			object: o,
			width: l,
			height: u,
			preserveAspectRatio: t,
			withoutSave: n
		});
	}
	clearCanvas() {
		let { canvas: e, montageArea: t, historyManager: n } = this.editor;
		n.suspendHistory(), e.clear(), e.add(t), e.renderAll(), n.resumeHistory(), n.saveState(), e?.fire("editor:cleared");
	}
	setDefaultScale({ withoutSave: e } = {}) {
		let { canvas: t, transformManager: n, historyManager: r, options: { montageAreaWidth: i, montageAreaHeight: a } } = this.editor;
		this.editor.zoomManager.resetZoom(), this.setResolutionWidth(i, { withoutSave: !0 }), this.setResolutionHeight(a, { withoutSave: !0 }), t.renderAll(), n.resetObjects(), e || r.saveState(), t.fire("editor:default-scale-set");
	}
	getObjects() {
		let { canvas: e, montageArea: t, interactionBlocker: { overlayMask: n }, backgroundManager: { backgroundObject: r } } = this.editor;
		return e.getObjects().filter((e) => e.id !== t.id && e.id !== n?.id && e.id !== r?.id);
	}
}, yr = class {
	constructor({ editor: e }) {
		this.editor = e, this.options = e.options;
	}
	setAngle(e, t, { withoutSave: n } = {}) {
		let { canvas: r, historyManager: i } = this.editor;
		e && (e.rotate(t), e.setCoords(), r.renderAll(), n || i.saveState(), r.fire("editor:object-rotated", {
			object: e,
			withoutSave: n,
			angle: t
		}));
	}
	rotate(e = 90, { withoutSave: t } = {}) {
		let { canvas: n } = this.editor, r = n.getActiveObject();
		if (!r) return;
		let i = (r.angle ?? 0) + e;
		this.setAngle(r, i, { withoutSave: t });
	}
	flipX({ withoutSave: e } = {}) {
		let { canvas: t, historyManager: n } = this.editor, r = t.getActiveObject();
		r && (r.flipX = !r.flipX, t.renderAll(), e || n.saveState(), t.fire("editor:object-flipped-x", {
			object: r,
			withoutSave: e
		}));
	}
	flipY({ withoutSave: e } = {}) {
		let { canvas: t, historyManager: n } = this.editor, r = t.getActiveObject();
		r && (r.flipY = !r.flipY, t.renderAll(), e || n.saveState(), t.fire("editor:object-flipped-y", {
			object: r,
			withoutSave: e
		}));
	}
	setActiveObjectOpacity({ object: t, opacity: n = 1, withoutSave: r } = {}) {
		let { canvas: i, historyManager: a } = this.editor, o = t || i.getActiveObject();
		if (!o) return;
		let s = !1;
		if (o instanceof e) {
			let e = o.getObjects();
			for (let t = 0; t < e.length; t += 1) {
				let r = e[t], i = this._setCanvasObjectOpacity({
					object: r,
					opacity: n
				});
				s ||= i;
			}
		} else s = this._setCanvasObjectOpacity({
			object: o,
			opacity: n
		});
		s && (i.renderAll(), r || a.saveState(), i.fire("editor:object-opacity-changed", {
			object: o,
			opacity: n,
			withoutSave: r
		}));
	}
	_setCanvasObjectOpacity({ object: e, opacity: t }) {
		let n = ut({ target: e });
		return n ? !!this.editor.shapeManager.setOpacity({
			target: n,
			opacity: t,
			withoutSave: !0
		}) : (e.set("opacity", t), !0);
	}
	fitObject({ object: t, type: n = this.options.scaleType, withoutSave: r, fitAsOneObject: i } = {}) {
		let { canvas: a, historyManager: o } = this.editor, s = t || a.getActiveObject();
		if (s) {
			if (s instanceof e && !i) {
				let t = s.getObjects();
				a.discardActiveObject(), t.forEach((e) => {
					this._fitSingleObject(e, n);
				});
				let r = new e(t, { canvas: a });
				a.setActiveObject(r);
			} else this._fitSingleObject(s, n), s instanceof e && i && this._materializeFittedSelection({ selection: s });
			a.renderAll(), r || o.saveState(), a.fire("editor:object-fitted", {
				object: s,
				type: n,
				withoutSave: r,
				fitAsOneObject: i
			});
		}
	}
	_fitSingleObject(e, t) {
		let { canvasManager: n, montageArea: r } = this.editor, { width: i, height: a, scaleX: o = 1, scaleY: s = 1, angle: c = 0 } = e, l = i * Math.abs(o), u = a * Math.abs(s), d = c * Math.PI / 180, f = Math.abs(Math.cos(d)), p = Math.abs(Math.sin(d)), m = l * f + u * p, h = l * p + u * f, g = r.width, _ = r.height, v;
		v = t === "contain" ? Math.min(g / m, _ / h) : Math.max(g / m, _ / h), e.set({
			scaleX: o * v,
			scaleY: s * v
		}), n.centerObjectToMontageArea({ object: e }), this._materializeFittedObject({ object: e }) || e.setCoords?.();
	}
	_materializeFittedObject({ object: e }) {
		let { shapeManager: t, textManager: n } = this.editor, r = { target: e };
		e.shapeComposite === !0 && (r.textScale = Math.abs(e.scaleX ?? 1) || 1);
		let i = n.commitStandaloneTextScale({ target: e }), a = t.commitRehydratedShapeLayout(r);
		return i || a;
	}
	_requiresFittedObjectMaterialization({ object: e }) {
		let t = e.type === "textbox" || e.type === "background-textbox", n = "shapeComposite" in e && e.shapeComposite === !0;
		return t || n;
	}
	_materializeFittedSelection({ selection: t }) {
		let { canvas: n } = this.editor, r = t.getObjects();
		if (!r.some((e) => this._requiresFittedObjectMaterialization({ object: e }))) return;
		n.discardActiveObject(), r.forEach((e) => {
			this._materializeFittedObject({ object: e }) || e.setCoords?.();
		});
		let i = new e(r, { canvas: n });
		n.setActiveObject(i);
	}
	resetObjects() {
		this.editor.canvasManager.getObjects().forEach((e) => {
			this.resetObject({ object: e });
		});
	}
	resetObject({ object: e, alwaysFitObject: t = !1, withoutSave: n = !1 } = {}) {
		let { canvas: r, canvasManager: i, montageArea: a, imageManager: o, historyManager: s, options: { scaleType: c } } = this.editor, l = e || r.getActiveObject();
		if (!(!l || l.locked)) {
			if (s.suspendHistory(), l.type === "image" || l.format === "svg" || l.set({
				scaleX: 1,
				scaleY: 1,
				flipX: !1,
				flipY: !1,
				angle: 0
			}), t) this.fitObject({
				object: l,
				withoutSave: !0,
				fitAsOneObject: !0
			});
			else {
				let { width: e, height: t } = a, { width: n, height: r } = l, i = o.calculateScaleFactor({
					imageObject: l,
					scaleType: c
				});
				c === "contain" && i < 1 || c === "cover" && (n > e || r > t) ? this.fitObject({
					object: l,
					withoutSave: !0,
					fitAsOneObject: !0
				}) : l.set({
					scaleX: 1,
					scaleY: 1
				});
			}
			l.set({
				flipX: !1,
				flipY: !1,
				angle: 0
			}), i.centerObjectToMontageArea({ object: l }), r.renderAll(), s.resumeHistory(), n || s.saveState(), r.fire("editor:object-reset", {
				object: l,
				withoutSave: n,
				alwaysFitObject: t
			});
		}
	}
}, br = class {
	constructor({ editor: e }) {
		this.editor = e, this.options = e.options, this.minZoom = this.options.minZoom || .1, this.maxZoom = this.options.maxZoom || 2, this.defaultZoom = this._normalizeDefaultZoom(this.options.defaultScale);
	}
	_normalizeDefaultZoom(e) {
		return Math.min(this.maxZoom, Math.max(this.minZoom, Number(e.toFixed(2))));
	}
	_calculateDefaultZoom(e) {
		let { canvas: t, montageArea: n } = this.editor, r = t.editorContainer, i = r.clientWidth || t.getWidth(), a = r.clientHeight || t.getHeight(), o = i / n.width * e, s = a / n.height * e;
		return this._normalizeDefaultZoom(Math.min(o, s));
	}
	_getScaledMontageDimensions(e) {
		let { montageArea: t } = this.editor;
		return {
			width: t.width * e,
			height: t.height * e
		};
	}
	_getClampedPointerCoordinates(e) {
		let { canvas: t, montageArea: n } = this.editor, r = this._getViewportPointerCoordinates(e), i = t.viewportTransform, a = t.getZoom(), o = n.left - n.width / 2, s = n.left + n.width / 2, c = n.top - n.height / 2, l = n.top + n.height / 2, u = o * a + i[4], d = s * a + i[4], f = c * a + i[5], p = l * a + i[5];
		return {
			x: Math.max(u, Math.min(d, r.x)),
			y: Math.max(f, Math.min(p, r.y))
		};
	}
	_getViewportPointerCoordinates(e) {
		let t = this.editor.canvas.upperCanvasEl.getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	_calculateFitZoom() {
		let { canvas: e, montageArea: t } = this.editor, n = e.getWidth(), r = e.getHeight(), i = n / t.width, a = r / t.height;
		return Math.max(i, a);
	}
	_calculateTargetViewportPosition(e) {
		let { canvas: t, montageArea: n } = this.editor, r = t.getWidth(), i = t.getHeight(), a = r / 2, o = i / 2, s = n.left, c = n.top;
		return {
			x: a - s * e,
			y: o - c * e
		};
	}
	_calculateEmptySpaceRatio(e) {
		let { canvas: t, montageArea: n } = this.editor, r = t.viewportTransform, i = t.getWidth(), a = t.getHeight(), o = n.left - n.width / 2, s = n.left + n.width / 2, c = n.top - n.height / 2, l = n.top + n.height / 2, u = -r[4] / e, d = (-r[4] + i) / e, f = -r[5] / e, p = (-r[5] + a) / e;
		if (!(u < o || d > s || f < c || p > l)) return 0;
		let m = Math.max(0, o - u), h = Math.max(0, d - s), g = Math.max(0, c - f), _ = Math.max(0, p - l), v = Math.max(m, h), y = Math.max(g, _), b = v / i, x = y / a;
		return Math.max(b, x);
	}
	_calculateSmoothCenteringStep(e, t, n, r, i) {
		let { canvas: a, montageArea: o } = this.editor, s = a.viewportTransform, c = a.getWidth(), l = a.getHeight(), u = e.x - s[4], d = e.y - s[5], f = Math.abs(r), p = t - n;
		if (Math.abs(p) / f <= .1) return {
			x: u,
			y: d
		};
		let m = c / 2, h = l / 2, g = o.left, _ = o.top, v = m - g * n, y = h - _ * n, b = (v - s[4]) / (t - n), x = (y - s[5]) / (t - n), S = b * f, C = x * f, w = S * i, T = C * i;
		return {
			x: Math.abs(w) > Math.abs(u) ? u : w,
			y: Math.abs(T) > Math.abs(d) ? d : T
		};
	}
	_applyViewportCentering(e, t = !1, n = jn) {
		let { canvas: r } = this.editor, i = this._getScaledMontageDimensions(e), a = r.getWidth(), o = r.getHeight(), s = i.width > a || i.height > o, c = this._calculateFitZoom(), l = e - c;
		if (!(!s || l) && !t) return !1;
		let u = r.viewportTransform, d = this._calculateTargetViewportPosition(e);
		if (!s) return u[4] = d.x, u[5] = d.y, r.setViewportTransform(u), !0;
		if (t && !s) {
			let t = this._calculateEmptySpaceRatio(e);
			if (t > 0) {
				let i = this._calculateSmoothCenteringStep(d, e, c, n, t);
				return u[4] += i.x, u[5] += i.y, r.setViewportTransform(u), !0;
			}
		}
		return !1;
	}
	_constrainViewportToPanBounds() {
		let { canvas: e, montageArea: t, panConstraintManager: n } = this.editor, r = e.viewportTransform;
		n.updateBounds();
		let i = n.constrainPan(r[4], r[5]);
		if (!(i.x !== r[4] || i.y !== r[5])) return;
		let a = [...r];
		a[4] = i.x, a[5] = i.y, e.setViewportTransform(a), t.setCoords();
	}
	updateDefaultZoom(e = this.options.defaultScale) {
		return this.defaultZoom = this._calculateDefaultZoom(e), this.defaultZoom;
	}
	calculateAndApplyDefaultZoom(e = this.options.defaultScale) {
		this.updateDefaultZoom(e), this.setZoom();
	}
	handlePointerZoom(e, t) {
		let { canvas: n, montageArea: r } = this.editor, i = n.getZoom(), a = e < 0, o = this._getScaledMontageDimensions(i), s = n.getWidth(), c = n.getHeight(), l = o.width > s || o.height > c;
		if (a) {
			if (!l) this.zoom(e, {
				pointX: r.left,
				pointY: r.top
			});
			else {
				let n = this._getClampedPointerCoordinates(t);
				this.zoom(e, {
					pointX: n.x,
					pointY: n.y
				});
			}
			return;
		}
		if (!l) {
			this.zoom(e, {
				pointX: r.left,
				pointY: r.top
			});
			return;
		}
		let u = this._getClampedPointerCoordinates(t);
		this.zoom(e, {
			pointX: u.x,
			pointY: u.y
		});
	}
	handleMouseWheelZoom(e, t) {
		this.handlePointerZoom(e, t);
	}
	zoom(e = jn, t = {}) {
		if (!e) return;
		let { minZoom: n, maxZoom: r } = this, { canvas: i } = this.editor, a = e < 0, o = i.getZoom(), s = i.getCenterPoint(), c = new p(t.pointX ?? s.x, t.pointY ?? s.y);
		this.editor.montageArea.setCoords(), this.editor.canvas.requestRenderAll();
		let l = o + Number(e);
		l > r && (l = r), l < n && (l = n), i.zoomToPoint(c, l), this._applyViewportCentering(l, a, e), this._constrainViewportToPanBounds(), i.fire("editor:zoom-changed", {
			currentZoom: i.getZoom(),
			zoom: l,
			point: c
		});
	}
	setZoom(e = this.defaultZoom) {
		let { minZoom: t, maxZoom: n } = this, { canvas: r, canvasManager: i, montageArea: a } = this.editor, o = new p(a.left, a.top), s = e;
		e > n && (s = n), e < t && (s = t), r.zoomToPoint(o, s), i.centerViewportToMontageArea(), r.fire("editor:zoom-changed", {
			currentZoom: r.getZoom(),
			zoom: s,
			point: o
		}), this.editor.panConstraintManager.updateBounds();
	}
	resetZoom() {
		let { canvas: e, canvasManager: t, montageArea: n } = this.editor, r = new p(n.left, n.top);
		e.zoomToPoint(r, this.defaultZoom), t.centerViewportToMontageArea(), this.editor.canvas.fire("editor:zoom-changed", {
			currentZoom: e.getZoom(),
			point: r
		}), this.editor.panConstraintManager.updateBounds();
	}
}, R = ({ value: e, fallback: t = 0 }) => typeof e == "number" && Number.isFinite(e) ? e : typeof t == "number" && Number.isFinite(t) ? t : 0, xr = ({ value: e, dimension: t, useRelativePositions: n }) => {
	let r = R({ value: e });
	return n ? r : r / (t || 1);
}, Sr = ({ object: e, baseWidth: t, baseHeight: n, useRelativePositions: r }) => ({
	x: xr({
		value: e.left,
		dimension: t,
		useRelativePositions: r
	}),
	y: xr({
		value: e.top,
		dimension: n,
		useRelativePositions: r
	})
}), Cr = ({ normalizedX: e, normalizedY: t, bounds: n }) => {
	let { left: r, top: i, width: a, height: o } = n;
	return new p(r + e * a, i + t * o);
}, wr = ({ object: e }) => {
	let { left: t = 0, top: n = 0, width: r = 0, height: i = 0, scaleX: a = 1, scaleY: o = 1, strokeWidth: s = 0, strokeUniform: c = !1 } = e, l = typeof e.type == "string" ? e.type.toLowerCase() : "", u = e instanceof _ || l === "textbox" || l === "background-textbox", d = c ? 0 : s, f = r + d, p = i + d, m = {
		left: Math.round(t),
		top: Math.round(n)
	};
	u || (f > 0 && (m.scaleX = Math.max(1, Math.round(f * a)) / f), p > 0 && (m.scaleY = Math.max(1, Math.round(p * o)) / p)), e.set(m), e.setCoords();
};
function Tr({ bounds: e }) {
	return Number.isFinite(e.left) && Number.isFinite(e.right) && Number.isFinite(e.top) && Number.isFinite(e.bottom) && Number.isFinite(e.centerX) && Number.isFinite(e.centerY);
}
function Er({ left: e, right: t, top: n, bottom: r }) {
	return {
		left: e,
		right: t,
		top: n,
		bottom: r,
		centerX: e + (t - e) / 2,
		centerY: n + (r - n) / 2
	};
}
function Dr({ bounds: e, source: t }) {
	let { left: n, right: r, top: i, bottom: a } = e;
	if (!(Number.isFinite(n) && Number.isFinite(r) && Number.isFinite(i) && Number.isFinite(a))) throw Error(`Invalid ${t}: edges must be finite`);
	if (r < n || a < i) throw Error(`Invalid ${t}: edges must be ordered`);
}
function Or({ object: e, mode: t }) {
	try {
		e.setCoords();
		let n = e.getBoundingRect(), r = t === "compatible" ? n.left ?? 0 : n.left, i = t === "compatible" ? n.top ?? 0 : n.top, a = t === "compatible" ? n.width ?? 0 : n.width, o = t === "compatible" ? n.height ?? 0 : n.height;
		return Er({
			left: r,
			right: r + a,
			top: i,
			bottom: i + o
		});
	} catch {
		return null;
	}
}
var z = ({ object: e }) => {
	if (!e) return null;
	let t = e.getObjectSnappingBounds?.();
	if (t) return Dr({
		bounds: t,
		source: "custom snapping bounds"
	}), Er(t);
	let n = Or({
		object: e,
		mode: "exact"
	});
	return n ? (Dr({
		bounds: n,
		source: "visual bounds"
	}), n) : null;
}, kr = ({ object: e }) => {
	if (!e) return null;
	let t = e.getObjectSnappingBounds?.();
	if (t && Tr({ bounds: t })) return t;
	let n = Or({
		object: e,
		mode: "compatible"
	});
	if (!n) return null;
	let r = Math.round(n.right - n.left), i = Math.round(n.bottom - n.top), a = n.left + r, o = n.top + i;
	return {
		left: n.left,
		right: a,
		top: n.top,
		bottom: o,
		centerX: n.left + r / 2,
		centerY: n.top + i / 2
	};
};
//#endregion
//#region src/editor/utils/primitive-shapes.ts
function Ar({ canvas: e, object: t, left: n, top: r, centerPoint: i, flags: a }) {
	let { withoutSelection: o, withoutAdding: s } = a;
	if (n === void 0 && r === void 0) {
		let n = i ?? e.getCenterPoint();
		t.setPositionByOrigin(n, "center", "center"), t.setCoords();
	}
	return wr({ object: t }), s ? t : (e.add(t), o || e.setActiveObject(t), e.renderAll(), t);
}
var jr = ({ canvas: e, options: t = {}, centerPoint: n, flags: r = {} }) => {
	let { id: i = `rect-${E()}`, left: a, top: o, width: s = 100, height: c = 100, fill: l = "blue", ...u } = t;
	return Ar({
		canvas: e,
		object: new g({
			id: i,
			left: a,
			top: o,
			width: s,
			height: c,
			fill: l,
			...u
		}),
		left: a,
		top: o,
		centerPoint: n,
		flags: r
	});
}, Mr = "ai-generation-overlay", Nr = 1080, Pr = Math.PI * 2, Fr = 40, Ir = 8 / 2, Lr = 22.536585365853657, Rr = 26.536585365853657, zr = Fr * 16, Br = .18, Vr = .58, Hr = "rgba(136, 136, 136, 0.5)", Ur = "#ffffff", Wr = [
	{
		rx: 540,
		ry: 430,
		weight: 1.3,
		speed: .62,
		pulseSpeed: 1.9,
		jitterX: 42,
		jitterY: 30,
		travelPadX: 360,
		travelPadY: 320,
		seed: .13
	},
	{
		rx: 430,
		ry: 340,
		weight: 1.16,
		speed: .72,
		pulseSpeed: 1.76,
		jitterX: 36,
		jitterY: 24,
		travelPadX: 300,
		travelPadY: 270,
		seed: 1.41
	},
	{
		rx: 380,
		ry: 300,
		weight: 1.08,
		speed: .82,
		pulseSpeed: 2.04,
		jitterX: 32,
		jitterY: 24,
		travelPadX: 280,
		travelPadY: 260,
		seed: 2.77
	},
	{
		rx: 300,
		ry: 235,
		weight: 1,
		speed: .92,
		pulseSpeed: 1.72,
		jitterX: 26,
		jitterY: 20,
		travelPadX: 240,
		travelPadY: 220,
		seed: 4.09
	},
	{
		rx: 210,
		ry: 165,
		weight: .92,
		speed: 1.08,
		pulseSpeed: 2.18,
		jitterX: 20,
		jitterY: 16,
		travelPadX: 210,
		travelPadY: 190,
		seed: 5.37
	}
];
function Gr({ value: e, min: t = 0, max: n = 1 }) {
	return Math.max(t, Math.min(n, e));
}
function Kr({ from: e, to: t, progress: n }) {
	return e + (t - e) * n;
}
function qr({ edgeStart: e, edgeEnd: t, value: n }) {
	let r = Gr({ value: (n - e) / (t - e) });
	return r * r * (3 - 2 * r);
}
function Jr({ time: e, seed: t }) {
	return Gr({ value: .5 + .5 * (.53 * Math.sin(e * .73 + t * 11.17) + .29 * Math.sin(e * 1.37 + t * 7.13 + 1.1) + .18 * Math.sin(e * 2.21 + t * 3.97 + 2.4)) });
}
function Yr({ animationSize: e, blob: t, time: n }) {
	let r = n * t.speed, i = n * t.pulseSpeed + t.seed * 3.1, a = -t.travelPadX, o = e.width + t.travelPadX, s = -t.travelPadY, c = e.height + t.travelPadY, l = Jr({
		time: r,
		seed: t.seed + .11
	}), u = Jr({
		time: r * .93 + 7.3,
		seed: t.seed + .67
	}), d = Kr({
		from: a,
		to: o,
		progress: l
	}), f = Kr({
		from: s,
		to: c,
		progress: u
	});
	return d += Math.sin(r * .57 + t.seed * 5.4) * t.jitterX * 1.8, d += Math.sin(r * 2.6 + t.seed * 9.1) * t.jitterX, f += Math.cos(r * .49 + t.seed * 6.2) * t.jitterY * 1.8, f += Math.cos(r * 2.1 + t.seed * 7.7) * t.jitterY, {
		x: d,
		y: f,
		rx: t.rx * (.88 + .24 * (.5 + .5 * Math.sin(i))),
		ry: t.ry * (.88 + .24 * (.5 + .5 * Math.cos(i * 1.07))),
		weight: t.weight
	};
}
function Xr({ state: e, dot: t }) {
	let n = (t.x - e.x) / e.rx, r = (t.y - e.y) / e.ry;
	return Math.exp(-(n * n + r * r) * 1.6) * e.weight;
}
function Zr({ dot: e, states: t, time: n }) {
	let r = 0;
	for (let n of t) r += Xr({
		state: n,
		dot: e
	});
	let i = .98 + .02 * Math.sin(e.x * .012 + e.y * .01 + n * 3.1);
	return qr({
		edgeStart: Br,
		edgeEnd: Vr,
		value: r
	}) * i;
}
function Qr({ size: e }) {
	let t = Math.min(e.width, e.height) / Nr;
	return {
		animationSize: {
			width: e.width / t,
			height: e.height / t
		},
		animationToOverlayScale: t
	};
}
function $r({ size: e }) {
	let t = Math.floor((e - 2 * Lr) / Rr) + 1, n = Math.max(1, Math.min(zr, t));
	return {
		count: n,
		start: (e - (n - 1) * Rr) / 2
	};
}
function ei({ ctx: e, size: t, time: n }) {
	let { animationSize: r, animationToOverlayScale: i } = Qr({ size: t }), a = $r({ size: r.width }), o = $r({ size: r.height }), s = t.width / 2, c = t.height / 2, l = Wr.map((e) => Yr({
		animationSize: r,
		blob: e,
		time: n
	}));
	e.fillStyle = Ur;
	for (let t = 0; t < o.count; t += 1) for (let r = 0; r < a.count; r += 1) {
		let u = {
			x: a.start + r * Rr,
			y: o.start + t * Rr
		}, d = Zr({
			dot: u,
			states: l,
			time: n
		});
		if (d <= .01) continue;
		let f = u.x * i - s, p = u.y * i - c, m = Ir * Math.min(d, 1) * i;
		e.beginPath(), e.arc(f, p, m, 0, Pr), e.fill();
	}
}
var ti = class extends g {
	static {
		this.type = Mr;
	}
	constructor(e = {}) {
		super({
			...e,
			fill: Hr,
			objectCaching: !1
		}), this._animationFrameId = null, this._renderTimeMs = 0;
	}
	startAnimation({ canvas: e }) {
		if (this._animationFrameId !== null) return;
		if (typeof window > "u" || typeof window.requestAnimationFrame != "function") {
			e.requestRenderAll();
			return;
		}
		let t = (n) => {
			this._animationFrameId !== null && (this._renderTimeMs = n, this.dirty = !0, e.requestRenderAll(), this._animationFrameId = window.requestAnimationFrame(t));
		};
		this._animationFrameId = window.requestAnimationFrame(t);
	}
	stopAnimation() {
		let e = this._animationFrameId;
		e !== null && (this._animationFrameId = null, typeof window < "u" && typeof window.cancelAnimationFrame == "function" && window.cancelAnimationFrame(e));
	}
	_render(e) {
		let t = this.width ?? 0, n = this.height ?? 0;
		t <= 0 || n <= 0 || (e.save(), e.beginPath(), e.rect(-t / 2, -n / 2, t, n), e.clip(), e.fillStyle = Hr, e.fillRect(-t / 2, -n / 2, t, n), ei({
			ctx: e,
			size: {
				width: t,
				height: n
			},
			time: this._renderTimeMs / 1e3
		}), e.restore());
	}
}, ni = () => {
	y?.setClass && y.setClass(ti, Mr);
}, ri = "default", ii = "overlay-mask", ai = class {
	constructor({ editor: e }) {
		ni(), this.editor = e, this.isBlocked = !1, this.overlayMask = null, this._overlayType = ri;
	}
	_getOverlayGeometry() {
		let { canvasManager: e } = this.editor, t = e.getMontageAreaSceneBounds();
		return {
			width: t.width,
			height: t.height,
			left: t.center.x,
			top: t.center.y,
			originX: "center",
			originY: "center",
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: !1,
			flipY: !1
		};
	}
	_getOverlayBaseOptions() {
		return {
			...this._getOverlayGeometry(),
			selectable: !1,
			evented: !0,
			hoverCursor: "not-allowed",
			hasBorders: !1,
			hasControls: !1,
			excludeFromExport: !0,
			visible: !1,
			id: ii
		};
	}
	_createDefaultOverlay() {
		let { options: { overlayMaskColor: e = "rgba(136, 136, 136, 0.5)" } } = this.editor;
		return jr({
			canvas: this.editor.canvas,
			options: {
				...this._getOverlayBaseOptions(),
				fill: e
			},
			flags: { withoutSelection: !0 }
		});
	}
	_createAiGenerationOverlay() {
		let e = new ti(this._getOverlayBaseOptions());
		return this.editor.canvas.add(e), e;
	}
	_stopOverlayAnimation() {
		this.overlayMask instanceof ti && this.overlayMask.stopAnimation();
	}
	_createOverlay({ overlay: e }) {
		let { canvas: t, historyManager: n } = this.editor;
		n.suspendHistory();
		try {
			this._stopOverlayAnimation(), this.overlayMask && t.remove(this.overlayMask), this.overlayMask = e === "ai-generation" ? this._createAiGenerationOverlay() : this._createDefaultOverlay(), this._overlayType = e;
		} finally {
			n.resumeHistory();
		}
	}
	_startOverlayAnimation() {
		this.overlayMask instanceof ti && this.overlayMask.startAnimation({ canvas: this.editor.canvas });
	}
	ensureOverlay({ overlay: e = this._overlayType } = {}) {
		(!this.overlayMask || this._overlayType !== e) && this._createOverlay({ overlay: e }), this.overlayMask && (this.overlayMask.set(this._getOverlayGeometry()), this.overlayMask.visible = this.isBlocked, this.overlayMask.setCoords());
	}
	refresh() {
		let { canvas: e, historyManager: t } = this.editor;
		if (this.overlayMask) {
			t.suspendHistory();
			try {
				this.overlayMask.set(this._getOverlayGeometry()), this.overlayMask.setCoords(), e.discardActiveObject(), this.editor.layerManager.bringToFront(this.overlayMask, { withoutSave: !0 }), this.isBlocked && this._startOverlayAnimation();
			} finally {
				t.resumeHistory();
			}
		}
	}
	block({ overlay: e = ri } = {}) {
		if (this.isBlocked) {
			this.ensureOverlay();
			return;
		}
		if (this.ensureOverlay({ overlay: e }), !this.overlayMask) return;
		let { canvas: t, canvasManager: n, historyManager: r } = this.editor;
		r.suspendHistory();
		try {
			this.isBlocked = !0, t.discardActiveObject(), t.selection = !1, t.skipTargetFind = !0, n.getObjects().forEach((e) => {
				e.evented = !1, e.selectable = !1;
			}), t.upperCanvasEl.style.pointerEvents = "none", t.lowerCanvasEl.style.pointerEvents = "none", this.overlayMask.visible = !0, this.refresh(), t.fire("editor:disabled");
		} finally {
			r.resumeHistory();
		}
	}
	unblock() {
		if (!this.isBlocked || !this.overlayMask) return;
		let { canvas: e, canvasManager: t, historyManager: n } = this.editor;
		n.suspendHistory();
		try {
			this.isBlocked = !1, e.selection = !0, e.skipTargetFind = !1, t.getObjects().forEach((e) => {
				e.evented = !0, e.selectable = !0;
			}), e.upperCanvasEl.style.pointerEvents = "", e.lowerCanvasEl.style.pointerEvents = "", this._stopOverlayAnimation(), this.overlayMask.visible = !1, e.requestRenderAll(), e.fire("editor:enabled");
		} finally {
			n.resumeHistory();
		}
		n.flushDeferredSaveAfterUnblock();
	}
}, oi = class e {
	constructor({ editor: e }) {
		this.editor = e, this.backgroundObject = null;
	}
	_getMontageBackgroundRectOptions() {
		let { canvasManager: e } = this.editor, t = e.getMontageAreaSceneBounds();
		return {
			width: t.width,
			height: t.height,
			left: t.center.x,
			top: t.center.y,
			originX: "center",
			originY: "center",
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: !1,
			flipY: !1
		};
	}
	_syncBackgroundGeometry() {
		let { backgroundObject: e } = this;
		if (e) {
			if (e.backgroundType === "image") {
				this.editor.transformManager.fitObject({
					object: e,
					withoutSave: !0,
					type: "cover"
				});
				return;
			}
			e.set(this._getMontageBackgroundRectOptions()), e.setCoords();
		}
	}
	setColorBackground({ color: e, customData: t = {}, fromTemplate: n = !1, withoutSave: r = !1 }) {
		try {
			let { historyManager: i } = this.editor, { backgroundObject: a } = this;
			if (i.suspendHistory(), a && a.backgroundType === "color") {
				if (a.fill === e) {
					i.resumeHistory();
					return;
				}
				a.set({
					fill: e,
					backgroundId: `background-${E()}`
				}), this.editor.canvas.requestRenderAll();
			} else this._removeCurrentBackground(), this._createColorBackground(e);
			this.backgroundObject?.set({ customData: t }), this.editor.canvas.fire("editor:background:changed", {
				type: "color",
				color: e,
				customData: t,
				fromTemplate: n,
				withoutSave: r
			}), i.resumeHistory(), r || i.saveState();
		} catch (i) {
			this.editor.errorManager.emitError({
				code: "BACKGROUND_CREATION_FAILED",
				origin: "BackgroundManager",
				method: "setColorBackground",
				message: "Не удалось установить цветовой фон",
				data: {
					error: i,
					color: e,
					customData: t,
					fromTemplate: n,
					withoutSave: r
				}
			});
		}
	}
	setGradientBackground({ gradient: t, customData: n = {}, fromTemplate: r = !1, withoutSave: i = !1 }) {
		try {
			let { historyManager: a } = this.editor, { backgroundObject: o } = this;
			if (a.suspendHistory(), o && o.backgroundType === "gradient") {
				let n = e._createFabricGradient(t);
				if (e._isGradientEqual(o.fill, n)) {
					a.resumeHistory();
					return;
				}
				o.set({
					fill: n,
					backgroundId: `background-${E()}`
				}), this.editor.canvas.requestRenderAll();
			} else this._removeCurrentBackground(), this._createGradientBackground(t);
			this.backgroundObject?.set({ customData: n }), this.editor.canvas.fire("editor:background:changed", {
				type: "gradient",
				customData: n,
				fromTemplate: r,
				withoutSave: i,
				gradientParams: t
			}), a.resumeHistory(), i || a.saveState();
		} catch (e) {
			this.editor.errorManager.emitError({
				code: "BACKGROUND_CREATION_FAILED",
				origin: "BackgroundManager",
				method: "setGradientBackground",
				message: "Не удалось установить градиентный фон",
				data: {
					error: e,
					gradient: t,
					customData: n,
					fromTemplate: r,
					withoutSave: i
				}
			});
		}
	}
	setLinearGradientBackground({ angle: e, startColor: t, endColor: n, startPosition: r, endPosition: i, colorStops: a, customData: o = {}, withoutSave: s = !1 }) {
		this.setGradientBackground({
			gradient: {
				type: "linear",
				angle: e,
				startColor: t,
				endColor: n,
				startPosition: r,
				endPosition: i,
				colorStops: a
			},
			customData: o,
			withoutSave: s
		});
	}
	setRadialGradientBackground({ centerX: e, centerY: t, radius: n, startColor: r, endColor: i, startPosition: a, endPosition: o, colorStops: s, customData: c = {}, withoutSave: l = !1 }) {
		this.setGradientBackground({
			gradient: {
				type: "radial",
				centerX: e,
				centerY: t,
				radius: n,
				startColor: r,
				endColor: i,
				startPosition: a,
				endPosition: o,
				colorStops: s
			},
			customData: c,
			withoutSave: l
		});
	}
	async setImageBackground({ imageSource: e, customData: t = {}, fromTemplate: n = !1, withoutSave: r = !1 }) {
		try {
			let { historyManager: i } = this.editor;
			i.suspendHistory(), await this._createImageBackground(e, t), this.editor.canvas.fire("editor:background:changed", {
				type: "image",
				imageSource: e,
				customData: t,
				fromTemplate: n,
				withoutSave: r,
				backgroundObject: this.backgroundObject
			}), i.resumeHistory(), r || i.saveState();
		} catch (i) {
			this.editor.errorManager.emitError({
				code: "BACKGROUND_CREATION_FAILED",
				origin: "BackgroundManager",
				method: "setImageBackground",
				message: "Не удалось установить изображение в качестве фона",
				data: {
					error: i,
					imageSource: e,
					customData: t,
					fromTemplate: n,
					withoutSave: r
				}
			});
		}
	}
	setPreparedImageBackground({ image: e, customData: t = {}, fromTemplate: n = !1, withoutSave: r = !1 }) {
		let { historyManager: i } = this.editor, a = !1;
		try {
			i.suspendHistory(), a = !0, this._setImageBackgroundObject({
				image: e,
				customData: t
			}), this.editor.canvas.fire("editor:background:changed", {
				type: "image",
				customData: t,
				fromTemplate: n,
				withoutSave: r,
				backgroundObject: this.backgroundObject
			}), i.resumeHistory(), a = !1, r || i.saveState();
		} catch (o) {
			a && i.resumeHistory(), this.editor.errorManager.emitError({
				code: "BACKGROUND_CREATION_FAILED",
				origin: "BackgroundManager",
				method: "setPreparedImageBackground",
				message: "Не удалось установить подготовленное изображение в качестве фона",
				data: {
					error: o,
					image: e,
					customData: t,
					fromTemplate: n,
					withoutSave: r
				}
			});
		}
	}
	removeBackground({ withoutSave: e = !1 } = {}) {
		try {
			let { historyManager: t } = this.editor;
			if (!this.backgroundObject) return;
			t.suspendHistory(), this._removeCurrentBackground(), this.editor.canvas.fire("editor:background:removed", { withoutSave: e }), t.resumeHistory(), e || t.saveState();
		} catch (t) {
			this.editor.errorManager.emitError({
				code: "BACKGROUND_REMOVAL_FAILED",
				origin: "BackgroundManager",
				method: "removeBackground",
				message: "Не удалось удалить фон",
				data: {
					error: t,
					withoutSave: e
				}
			});
		}
	}
	refresh() {
		let { canvas: e, montageArea: t, historyManager: n } = this.editor;
		if (!t || !this.backgroundObject) return;
		n.suspendHistory(), this._syncBackgroundGeometry();
		let r = e.getObjects(), i = r.indexOf(t), a = r.indexOf(this.backgroundObject);
		this.backgroundObject && a !== i + 1 && e.moveObjectTo(this.backgroundObject, i + 1), e.requestRenderAll(), n.resumeHistory();
	}
	_createColorBackground(e) {
		this.backgroundObject = jr({
			canvas: this.editor.canvas,
			options: {
				...this._getMontageBackgroundRectOptions(),
				fill: e,
				selectable: !1,
				evented: !1,
				hasBorders: !1,
				hasControls: !1,
				id: "background",
				backgroundType: "color",
				backgroundId: `background-${E()}`
			},
			flags: { withoutSelection: !0 }
		}), this.refresh();
	}
	_createGradientBackground(t) {
		this.backgroundObject = jr({
			canvas: this.editor.canvas,
			options: {
				...this._getMontageBackgroundRectOptions(),
				fill: "#ffffff",
				selectable: !1,
				evented: !1,
				hasBorders: !1,
				hasControls: !1,
				id: "background",
				backgroundType: "gradient",
				backgroundId: `background-${E()}`
			},
			flags: { withoutSelection: !0 }
		}), this.refresh();
		let n = e._createFabricGradient(t);
		this.backgroundObject.set("fill", n), this.editor.canvas.requestRenderAll();
	}
	async _createImageBackground(e, t) {
		let { image: n } = await this.editor.imageManager.importImage({
			source: e,
			withoutSave: !0,
			isBackground: !0,
			withoutSelection: !0,
			scale: "image-cover"
		}) ?? {};
		if (!n) throw Error("Не удалось загрузить изображение");
		this._setImageBackgroundObject({
			image: n,
			customData: t
		});
	}
	_setImageBackgroundObject({ image: e, customData: t }) {
		e.set({
			selectable: !1,
			evented: !1,
			hasBorders: !1,
			hasControls: !1,
			id: "background",
			backgroundType: "image",
			backgroundId: `background-${E()}`,
			customData: t
		}), this._removeCurrentBackground(), e.canvas !== this.editor.canvas && this.editor.canvas.add(e), this.backgroundObject = e, this.refresh();
	}
	_removeCurrentBackground() {
		this.backgroundObject && (this.editor.canvas.remove(this.backgroundObject), this.backgroundObject = null, this.editor.canvas.renderAll());
	}
	static _createFabricGradient(t) {
		let { startColor: n, endColor: r, startPosition: i = 0, endPosition: a = 100, colorStops: o } = t, c;
		if (c = o && o.length > 0 ? o.map((e) => ({
			offset: e.offset / 100,
			color: e.color
		})) : n && r ? [{
			offset: i / 100,
			color: n
		}, {
			offset: a / 100,
			color: r
		}] : [{
			offset: 0,
			color: "#000000"
		}, {
			offset: 1,
			color: "#ffffff"
		}], t.type === "linear") {
			let n = t.angle * Math.PI / 180;
			return new s({
				type: "linear",
				gradientUnits: "percentage",
				coords: e._angleToCoords(n),
				colorStops: c
			});
		}
		let { centerX: l = 50, centerY: u = 50, radius: d = 50 } = t;
		return new s({
			type: "radial",
			gradientUnits: "percentage",
			coords: {
				x1: l / 100,
				y1: u / 100,
				x2: l / 100,
				y2: u / 100,
				r1: 0,
				r2: d / 100
			},
			colorStops: c
		});
	}
	static _angleToCoords(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return {
			x1: .5 - t * .5,
			y1: .5 - n * .5,
			x2: .5 + t * .5,
			y2: .5 + n * .5
		};
	}
	static _isGradientEqual(e, t) {
		if (!e || !t || e.type !== t.type) return !1;
		let n = e.colorStops || [], r = t.colorStops || [];
		return n.length !== r.length || !n.every((e, t) => {
			let n = r[t];
			return e.color === n.color && Math.abs(e.offset - n.offset) < 1e-4;
		}) ? !1 : e.type === "linear" && t.type === "linear" ? Math.abs(e.coords.x1 - t.coords.x1) < 1e-4 && Math.abs(e.coords.y1 - t.coords.y1) < 1e-4 && Math.abs(e.coords.x2 - t.coords.x2) < 1e-4 && Math.abs(e.coords.y2 - t.coords.y2) < 1e-4 : e.type === "radial" && t.type === "radial" ? Math.abs(e.coords.x1 - t.coords.x1) < 1e-4 && Math.abs(e.coords.y1 - t.coords.y1) < 1e-4 && Math.abs(e.coords.x2 - t.coords.x2) < 1e-4 && Math.abs(e.coords.y2 - t.coords.y2) < 1e-4 && Math.abs(e.coords.r1 - t.coords.r1) < 1e-4 && Math.abs(e.coords.r2 - t.coords.r2) < 1e-4 : !1;
	}
}, si = class t {
	constructor({ editor: e }) {
		this.editor = e;
	}
	bringToFront(t, { withoutSave: n } = {}) {
		let { canvas: r, historyManager: i, textManager: a } = this.editor;
		n || a.exitActiveTextEditing(), i.suspendHistory();
		let o = t || r.getActiveObject();
		o && (o instanceof e ? o.getObjects().forEach((e) => {
			r.bringObjectToFront(e);
		}) : r.bringObjectToFront(o), r.renderAll(), i.resumeHistory(), n || i.saveState(), r.fire("editor:object-bring-to-front", {
			object: o,
			withoutSave: n
		}));
	}
	bringForward(n, { withoutSave: r } = {}) {
		let { canvas: i, historyManager: a, textManager: o } = this.editor;
		r || o.exitActiveTextEditing(), a.suspendHistory();
		let s = n || i.getActiveObject();
		s && (s instanceof e ? t._moveSelectionForward(i, s) : i.bringObjectForward(s), i.renderAll(), a.resumeHistory(), r || a.saveState(), i.fire("editor:object-bring-forward", {
			object: s,
			withoutSave: r
		}));
	}
	sendToBack(t, { withoutSave: n } = {}) {
		let { canvas: r, montageArea: i, historyManager: a, textManager: o, interactionBlocker: { overlayMask: s }, backgroundManager: { backgroundObject: c } } = this.editor;
		n || o.exitActiveTextEditing(), a.suspendHistory();
		let l = t || r.getActiveObject();
		if (l) {
			if (l instanceof e) {
				let e = l.getObjects();
				for (let t = e.length - 1; t >= 0; --t) r.sendObjectToBack(e[t]);
			} else r.sendObjectToBack(l);
			c && r.sendObjectToBack(c), r.sendObjectToBack(i), s && r.sendObjectToBack(s), r.renderAll(), a.resumeHistory(), n || a.saveState(), r.fire("editor:object-send-to-back", {
				object: l,
				withoutSave: n
			});
		}
	}
	sendBackwards(n, { withoutSave: r } = {}) {
		let { canvas: i, montageArea: a, historyManager: o, textManager: s, interactionBlocker: { overlayMask: c }, backgroundManager: { backgroundObject: l } } = this.editor;
		r || s.exitActiveTextEditing(), o.suspendHistory();
		let u = n || i.getActiveObject();
		u && (u instanceof e ? t._moveSelectionBackwards(i, u) : i.sendObjectBackwards(u), l && i.sendObjectToBack(l), i.sendObjectToBack(a), c && i.sendObjectToBack(c), i.renderAll(), o.resumeHistory(), r || o.saveState(), i.fire("editor:object-send-backwards", {
			object: u,
			withoutSave: r
		}));
	}
	static _moveSelectionForward(e, t) {
		let n = e.getObjects(), r = t.getObjects();
		r.some((e) => {
			let t = n.indexOf(e);
			for (let e = t + 1; e < n.length; e += 1) if (!r.includes(n[e])) return !0;
			return !1;
		}) && r.map((e) => ({
			obj: e,
			index: n.indexOf(e)
		})).sort((e, t) => t.index - e.index).forEach((t) => {
			e.bringObjectForward(t.obj);
		});
	}
	static _moveSelectionBackwards(e, t) {
		let n = e.getObjects(), r = t.getObjects();
		r.some((e) => {
			let t = n.indexOf(e);
			for (let e = t - 1; e >= 0; --e) if (!r.includes(n[e])) return !0;
			return !1;
		}) && r.map((e) => ({
			obj: e,
			index: n.indexOf(e)
		})).sort((e, t) => e.index - t.index).forEach((t) => {
			e.sendObjectBackwards(t.obj);
		});
	}
}, ci = "#B4B7BD", li = 0, ui = 1;
function di({ options: e, fallback: t }) {
	let { fill: n, stroke: r, strokeWidth: i, strokeDashArray: a, opacity: o } = e, s = a === void 0 ? t?.shapeStrokeDashArray : a;
	return {
		fill: n ?? t?.shapeFill ?? ci,
		stroke: r ?? t?.shapeStroke ?? null,
		strokeWidth: i ?? t?.shapeStrokeWidth ?? li,
		strokeDashArray: s ?? null,
		opacity: o ?? t?.shapeOpacity ?? ui
	};
}
//#endregion
//#region src/editor/shape-manager/creation/shape-node-factory.ts
var fi = 1, pi = 1e-4;
function B({ value: e }) {
	return Number(e.toFixed(4));
}
function mi({ rounding: e }) {
	return M({ rounding: e }) > 0;
}
function hi({ width: e, height: t, strokeWidth: n }) {
	let r = Math.max(0, n ?? 0);
	return {
		width: Math.max(fi, e - r),
		height: Math.max(fi, t - r)
	};
}
function gi({ shape: e, width: t, height: n, rounding: r, strokeWidth: i }) {
	let a = hi({
		width: Math.max(fi, t),
		height: Math.max(fi, n),
		strokeWidth: i
	});
	if (e instanceof g) {
		let t = Math.min(a.width / 2, a.height / 2) * Ee({ rounding: r });
		e.set({
			width: a.width,
			height: a.height,
			rx: t,
			ry: t,
			scaleX: 1,
			scaleY: 1,
			left: 0,
			top: 0,
			originX: "center",
			originY: "center"
		}), e.setCoords();
		return;
	}
	let { width: o = fi, height: s = fi } = e, c = Math.max(fi, o), l = Math.max(fi, s);
	e.set({
		scaleX: a.width / c,
		scaleY: a.height / l,
		left: 0,
		top: 0,
		originX: "center",
		originY: "center"
	}), e.setCoords();
}
function _i({ shape: e, style: t }) {
	let { fill: n, stroke: r, strokeWidth: i, strokeDashArray: a, opacity: o } = t, s = {
		strokeUniform: !0,
		strokeLineCap: "round",
		strokeLineJoin: "round"
	};
	n !== void 0 && (s.fill = n), r !== void 0 && (s.stroke = r), i !== void 0 && (s.strokeWidth = i), a !== void 0 && (s.strokeDashArray = a), o !== void 0 && (s.opacity = o), e.set(s), e.setCoords();
}
function vi({ shape: e, style: t }) {
	let n = [e];
	for (let e = 0; e < n.length; e += 1) {
		let r = n[e];
		if (r instanceof c) {
			let e = r.getObjects();
			for (let t = 0; t < e.length; t += 1) n.push(e[t]);
			t.opacity !== void 0 && r.set({ opacity: t.opacity }), r.setCoords();
			continue;
		}
		_i({
			shape: r,
			style: t
		});
	}
}
function yi({ points: e, closed: t }) {
	if (e.length === 0) return "";
	let n = `M ${B({ value: e[0].x })} ${B({ value: e[0].y })}`;
	for (let t = 1; t < e.length; t += 1) {
		let r = e[t];
		n += ` L ${B({ value: r.x })} ${B({ value: r.y })}`;
	}
	return t && (n += " Z"), n;
}
function bi({ previous: e, current: t, next: n, roundingRatio: r }) {
	let i = {
		x: e.x - t.x,
		y: e.y - t.y
	}, a = {
		x: n.x - t.x,
		y: n.y - t.y
	}, o = Math.hypot(i.x, i.y), s = Math.hypot(a.x, a.y);
	if (o <= pi || s <= pi) return {
		start: {
			x: B({ value: t.x }),
			y: B({ value: t.y })
		},
		end: {
			x: B({ value: t.x }),
			y: B({ value: t.y })
		}
	};
	let c = Math.min(o / 2, s / 2) * r;
	return {
		start: {
			x: B({ value: t.x + i.x / o * c }),
			y: B({ value: t.y + i.y / o * c })
		},
		end: {
			x: B({ value: t.x + a.x / s * c }),
			y: B({ value: t.y + a.y / s * c })
		}
	};
}
function xi({ points: e, roundingRatio: t, closed: n }) {
	let r = e.length;
	if (r === 0) return "";
	if (!n && r === 1) {
		let t = e[0];
		return `M ${B({ value: t.x })} ${B({ value: t.y })}`;
	}
	if (t <= 0) return yi({
		points: e,
		closed: n
	});
	if (n) {
		let n = [];
		for (let i = 0; i < r; i += 1) {
			let a = i === 0 ? r - 1 : i - 1, o = i === r - 1 ? 0 : i + 1;
			n.push(bi({
				previous: e[a],
				current: e[i],
				next: e[o],
				roundingRatio: t
			}));
		}
		let i = n[0], a = `M ${i.start.x} ${i.start.y}`;
		for (let t = 0; t < r; t += 1) {
			let i = e[t], o = n[t], s = n[t === r - 1 ? 0 : t + 1];
			a += ` Q ${i.x} ${i.y} ${o.end.x} ${o.end.y}`, a += ` L ${s.start.x} ${s.start.y}`;
		}
		return a += " Z", a;
	}
	if (r === 2) return yi({
		points: e,
		closed: !1
	});
	let i = `M ${B({ value: e[0].x })} ${B({ value: e[0].y })}`;
	for (let n = 1; n < r - 1; n += 1) {
		let r = bi({
			previous: e[n - 1],
			current: e[n],
			next: e[n + 1],
			roundingRatio: t
		});
		i += ` L ${r.start.x} ${r.start.y}`, i += ` Q ${e[n].x} ${e[n].y} ${r.end.x} ${r.end.y}`;
	}
	let a = e[r - 1];
	return i += ` L ${B({ value: a.x })} ${B({ value: a.y })}`, i;
}
function Si({ points: e, rounding: t, closed: n }) {
	return new d(xi({
		points: e,
		roundingRatio: Ee({ rounding: t }),
		closed: n
	}), {
		originX: "center",
		originY: "center",
		left: 0,
		top: 0
	});
}
function Ci({ rounding: e }) {
	return mi({ rounding: e }) ? Si({
		points: [
			{
				x: 50,
				y: 0
			},
			{
				x: 100,
				y: 100
			},
			{
				x: 0,
				y: 100
			}
		],
		rounding: M({ rounding: e }),
		closed: !0
	}) : new v({
		width: 100,
		height: 100,
		originX: "center",
		originY: "center",
		left: 0,
		top: 0
	});
}
function wi({ path: e }) {
	return new d(e, {
		originX: "center",
		originY: "center",
		left: 0,
		top: 0
	});
}
function Ti({ path: e, rounding: t }) {
	let n = wi({ path: e }).path ?? [], r = C.makePathSimpler(n), i = [], a = !1;
	for (let e = 0; e < r.length; e += 1) {
		let t = r[e];
		if (!t) return null;
		let n = t[0], o = typeof n == "string" ? n.toUpperCase() : "";
		if (o === "M" || o === "L") {
			let e = Number(t[1]), n = Number(t[2]);
			if (!Number.isFinite(e) || !Number.isFinite(n)) return null;
			i.push({
				x: e,
				y: n
			});
			continue;
		}
		if (o === "Z") {
			a = !0;
			continue;
		}
		return null;
	}
	return i.length < 2 || a && i.length < 3 ? null : Si({
		points: i,
		rounding: t,
		closed: a
	});
}
function Ei({ path: e, rounding: t }) {
	return mi({ rounding: t }) && Ti({
		path: e,
		rounding: M({ rounding: t })
	}) || wi({ path: e });
}
function Di({ points: e, type: t, rounding: n }) {
	let r = e.length > 0 ? e : [
		{
			x: 0,
			y: 0
		},
		{
			x: 100,
			y: 0
		},
		{
			x: 100,
			y: 100
		}
	], i = M({ rounding: n });
	if (i > 0) {
		if (t === "polygon" && r.length >= 3) return Si({
			points: r,
			rounding: i,
			closed: !0
		});
		if (t === "polyline" && r.length >= 2) return Si({
			points: r,
			rounding: i,
			closed: !1
		});
	}
	return new (t === "polyline" ? h : m)(r, {
		originX: "center",
		originY: "center",
		left: 0,
		top: 0
	});
}
async function Oi({ svg: e }) {
	let t = await x(e), n = C.groupSVGElements(t.objects, t.options);
	return n.set({
		originX: "center",
		originY: "center",
		left: 0,
		top: 0
	}), n.setCoords(), n;
}
async function ki({ preset: e, rounding: t }) {
	switch (e.type) {
		case "rect": return new g({
			width: 100,
			height: 100,
			originX: "center",
			originY: "center",
			left: 0,
			top: 0
		});
		case "ellipse": return new i({
			rx: 50,
			ry: 50,
			originX: "center",
			originY: "center",
			left: 0,
			top: 0
		});
		case "triangle": return Ci({ rounding: t });
		case "polygon": return Di({
			points: e.points,
			type: "polygon",
			rounding: t
		});
		case "polyline": return Di({
			points: e.points,
			type: "polyline",
			rounding: t
		});
		case "path": return Ei({
			path: e.path,
			rounding: t
		});
		case "svg": return Oi({ svg: e.svg });
		default: return new g({
			width: 100,
			height: 100,
			originX: "center",
			originY: "center",
			left: 0,
			top: 0
		});
	}
}
async function Ai({ preset: e, width: t, height: n, style: r, rounding: i }) {
	let a = await ki({
		preset: e,
		rounding: i
	});
	return vi({
		shape: a,
		style: r
	}), gi({
		shape: a,
		width: t,
		height: n,
		rounding: i,
		strokeWidth: r.strokeWidth
	}), a.set({
		id: `${a.type}-${E()}`,
		selectable: !1,
		evented: !1,
		hasControls: !1,
		hasBorders: !1,
		shapeNodeType: "shape"
	}), a;
}
//#endregion
//#region src/editor/shape-manager/layout/shape-layout-padding.ts
var ji = .5, Mi = 12;
function Ni({ width: e, padding: t }) {
	let n = Math.max(0, t.left), r = Math.max(0, t.right);
	return Math.max(1, e - n - r);
}
function Pi({ text: e }) {
	return (e.text ?? "").trim().length > 0;
}
function Fi({ start: e, end: t, maxTotalPadding: n, startChanged: r, endChanged: i }) {
	let a = Math.max(0, e), o = Math.max(0, t), s = Math.max(0, n);
	if (a + o <= s + ji) return {
		start: a,
		end: o
	};
	if (r && !i) {
		let e = Math.min(o, s);
		return {
			start: Math.min(a, Math.max(0, s - e)),
			end: e
		};
	}
	if (i && !r) {
		let e = Math.min(a, s);
		return {
			start: e,
			end: Math.min(o, Math.max(0, s - e))
		};
	}
	let c = a + o;
	if (c <= 0) return {
		start: 0,
		end: 0
	};
	let l = s / c;
	return {
		start: a * l,
		end: o * l
	};
}
function Ii({ start: e, end: t, insetStart: n, insetEnd: r, maxTotalPadding: i, startChanged: a, endChanged: o }) {
	let s = Math.max(0, n), c = Math.max(0, r), l = Math.max(0, i - s - c), u = Fi({
		start: Math.max(0, e),
		end: Math.max(0, t),
		maxTotalPadding: l,
		startChanged: a,
		endChanged: o
	}), d = Math.max(0, Math.floor(u.start)), f = Math.max(0, Math.floor(u.end));
	return {
		appliedPaddingStart: s + d,
		appliedPaddingEnd: c + f,
		appliedUserPaddingStart: d,
		appliedUserPaddingEnd: f
	};
}
function Li({ text: e, minFrameWidth: t, maxFrameWidth: n, frameHeight: r, measureTextboxHeightForFrame: i }) {
	let a = Math.max(1, t), o = Math.max(a, n), s = Math.max(1, r);
	if (!Pi({ text: e }) || i({
		text: e,
		frameWidth: a
	}) <= s + ji) return a;
	if (i({
		text: e,
		frameWidth: o
	}) > s + ji) return o;
	let c = a, l = o;
	for (let t = 0; t < Mi; t += 1) {
		let t = (c + l) / 2;
		if (i({
			text: e,
			frameWidth: t
		}) <= s + ji) {
			l = t;
			continue;
		}
		c = t;
	}
	return l;
}
function Ri({ text: e, width: t, availableTextFrameHeight: n, padding: r, internalShapeTextInset: i, expandShapeHeightToFitText: a, changedPadding: o, measureTextboxHeightForFrame: s, resolveMinimumTextFrameWidth: c }) {
	let l = Math.max(1, t), u = Math.max(1, n), d = Pi({ text: e }) ? c({ text: e }) : 1, f = d;
	a || (f = Li({
		text: e,
		minFrameWidth: d,
		maxFrameWidth: l,
		frameHeight: u,
		measureTextboxHeightForFrame: s
	}));
	let p = f + i.left + i.right, m = Math.max(0, l - f), h = Ii({
		start: r.left,
		end: r.right,
		insetStart: i.left,
		insetEnd: i.right,
		maxTotalPadding: m,
		startChanged: !!o?.left,
		endChanged: !!o?.right
	});
	return {
		appliedPadding: {
			left: h.appliedPaddingStart,
			right: h.appliedPaddingEnd
		},
		appliedUserPadding: {
			left: h.appliedUserPaddingStart,
			right: h.appliedUserPaddingEnd
		},
		requiredWidth: p
	};
}
function zi({ padding: e, internalShapeTextInset: t, height: n, textHeight: r, changedPadding: i }) {
	let a = Math.max(0, Math.max(1, n) - Math.max(1, r)), o = Ii({
		start: e.top,
		end: e.bottom,
		insetStart: t.top,
		insetEnd: t.bottom,
		maxTotalPadding: a,
		startChanged: !!i?.top,
		endChanged: !!i?.bottom
	});
	return {
		appliedPadding: {
			top: o.appliedPaddingStart,
			bottom: o.appliedPaddingEnd
		},
		appliedUserPadding: {
			top: o.appliedUserPaddingStart,
			bottom: o.appliedUserPaddingEnd
		}
	};
}
function Bi({ text: e, width: t, height: n, padding: r, internalShapeTextInset: i, expandShapeHeightToFitText: a, changedPadding: o, measureTextboxHeightForFrame: s, resolveMinimumTextFrameWidth: c }) {
	let l = Math.max(1, t), u = Math.max(1, n), d = F({ padding: r }), f = F({ padding: i }), p = !!o?.left || !!o?.right, m = !!o?.top || !!o?.bottom, h = !a && p && !m, g = f.top + f.bottom, _ = g + (h ? d.top + d.bottom : 0), v = Ri({
		text: e,
		width: l,
		availableTextFrameHeight: Math.max(1, u - _),
		padding: d,
		internalShapeTextInset: f,
		expandShapeHeightToFitText: a,
		changedPadding: o,
		measureTextboxHeightForFrame: s,
		resolveMinimumTextFrameWidth: c
	}), y = Ni({
		width: l,
		padding: {
			top: 0,
			right: v.appliedPadding.right,
			bottom: 0,
			left: v.appliedPadding.left
		}
	}), b = Pi({ text: e }) ? s({
		text: e,
		frameWidth: y
	}) : 1, x = d.top + d.bottom, S = a ? Math.max(u, b + g + x) : u, C = zi({
		padding: d,
		internalShapeTextInset: f,
		height: S,
		textHeight: b,
		changedPadding: o
	});
	return {
		appliedPadding: {
			top: C.appliedPadding.top,
			right: v.appliedPadding.right,
			bottom: C.appliedPadding.bottom,
			left: v.appliedPadding.left
		},
		appliedUserPadding: {
			top: C.appliedUserPadding.top,
			right: v.appliedUserPadding.right,
			bottom: C.appliedUserPadding.bottom,
			left: v.appliedUserPadding.left
		},
		requiredWidth: v.requiredWidth,
		requiredHeight: S
	};
}
//#endregion
//#region src/editor/shape-manager/layout/shape-text-measurement.ts
var Vi = 1, Hi = .5, Ui = 1e6;
function Wi({ text: e, frameWidth: t, splitByGrapheme: n, requiresGraphemeSplit: r, measurementCache: i }) {
	let a = Math.max(Vi, t), o = oa({
		frameWidth: a,
		splitByGrapheme: n
	}), s = i?.measurementsByKey.get(o);
	if (s) return s;
	let c = na({ text: e }), l = r ?? Yi({
		text: e,
		frameWidth: a,
		measurementCache: i
	});
	e.set({
		autoExpand: !1,
		width: a,
		splitByGrapheme: n,
		scaleX: 1,
		scaleY: 1
	}), e.initDimensions();
	let u = ea({ text: e }), d = $i({ text: e }), f = {
		measuredHeight: Zi({ text: e }),
		renderedLineCount: u > 0 ? u : d,
		longestLineWidth: Math.ceil(Qi({ text: e })),
		requiresGraphemeSplit: l
	};
	return ra({
		text: e,
		state: c
	}), i?.measurementsByKey.set(o, f), f;
}
function Gi({ text: e, frameWidth: t, wrapPolicy: n, measurementCache: r }) {
	let i = $i({ text: e }), a = Yi({
		text: e,
		frameWidth: t,
		wrapPolicy: n,
		measurementCache: r
	}), o = Wi({
		text: e,
		frameWidth: t,
		splitByGrapheme: a,
		requiresGraphemeSplit: a,
		measurementCache: r
	});
	return {
		hasWrappedLines: o.renderedLineCount > i,
		longestLineWidth: o.longestLineWidth
	};
}
function Ki({ text: e, frameWidth: t, splitByGrapheme: n, wrapPolicy: r, measurementCache: i }) {
	let a = n ?? Yi({
		text: e,
		frameWidth: t,
		wrapPolicy: r,
		measurementCache: i
	});
	return Wi({
		text: e,
		frameWidth: t,
		splitByGrapheme: a,
		requiresGraphemeSplit: a,
		measurementCache: i
	}).measuredHeight;
}
function qi({ text: e, measurementCache: t }) {
	if (t?.minimumTextFrameWidth !== null && t?.minimumTextFrameWidth !== void 0) return t.minimumTextFrameWidth;
	let n = Xi({
		text: e,
		frameWidth: Vi,
		splitByGrapheme: !0,
		measurementCache: t
	}), r = Math.max(Vi, n);
	return t && (t.minimumTextFrameWidth = r), r;
}
function Ji({ alignV: e, frameHeight: t, frameTop: n, textHeight: r }) {
	let i = Math.max(0, t - r);
	return e === "top" ? n : e === "bottom" ? n + i : n + i / 2;
}
function Yi({ text: e, frameWidth: t, wrapPolicy: n, measurementCache: r }) {
	if (n === "words-only") return !1;
	let i = Math.max(Vi, t), a = aa({ frameWidth: i }), o = r?.splitByGraphemeByFrameWidth.get(a);
	if (typeof o == "boolean") return o;
	let s = na({ text: e });
	e.set({
		autoExpand: !1,
		width: i,
		splitByGrapheme: !1,
		scaleX: 1,
		scaleY: 1
	}), e.initDimensions();
	let c = ia({ text: e }) > i + Hi;
	return ra({
		text: e,
		state: s
	}), r?.splitByGraphemeByFrameWidth.set(a, c), c;
}
function Xi({ text: e, frameWidth: t, splitByGrapheme: n, measurementCache: r }) {
	let i = r?.measurementsByKey.get(oa({
		frameWidth: t,
		splitByGrapheme: n
	}));
	if (i) return i.longestLineWidth;
	let a = na({ text: e });
	e.set({
		autoExpand: !1,
		width: Math.max(Vi, t),
		splitByGrapheme: n,
		scaleX: 1,
		scaleY: 1
	}), e.initDimensions();
	let o = Qi({ text: e });
	return ra({
		text: e,
		state: a
	}), o;
}
function Zi({ text: e }) {
	let { height: t } = e;
	if (typeof t == "number" && Number.isFinite(t)) return t;
	if (typeof e.calcTextHeight == "function") {
		let t = e.calcTextHeight();
		if (typeof t == "number" && Number.isFinite(t)) return t;
	}
	return Vi;
}
function Qi({ text: e }) {
	let t = ea({ text: e });
	if (t > 0) return ta({
		text: e,
		lineCount: t
	});
	let n = e.text ?? "";
	return ta({
		text: e,
		lineCount: Math.max(n.split("\n").length, 1)
	});
}
function $i({ text: e }) {
	let t = e.text ?? "";
	return Math.max(t.split("\n").length, 1);
}
function ea({ text: e }) {
	let t = e;
	return Array.isArray(t.textLines) ? t.textLines.length : 0;
}
function ta({ text: e, lineCount: t }) {
	let n = Vi;
	for (let r = 0; r < t; r += 1) {
		let t = e.getLineWidth(r);
		t > n && (n = t);
	}
	return n;
}
function na({ text: e }) {
	let { autoExpand: t, splitByGrapheme: n, width: r, scaleX: i, scaleY: a } = e;
	return {
		autoExpand: t,
		splitByGrapheme: n,
		width: typeof r == "number" ? r : void 0,
		scaleX: typeof i == "number" ? i : void 0,
		scaleY: typeof a == "number" ? a : void 0
	};
}
function ra({ text: e, state: t }) {
	let { autoExpand: n, splitByGrapheme: r, width: i, scaleX: a, scaleY: o } = t, s = {};
	n !== void 0 && (s.autoExpand = n), r !== void 0 && (s.splitByGrapheme = r), typeof i == "number" && (s.width = i), typeof a == "number" && (s.scaleX = a), typeof o == "number" && (s.scaleY = o), Object.keys(s).length > 0 && (e.set(s), e.initDimensions());
}
function ia({ text: e }) {
	let { dynamicMinWidth: t } = e;
	return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
function aa({ frameWidth: e }) {
	return String(Math.round(Math.max(Vi, e) * Ui) / Ui);
}
function oa({ frameWidth: e, splitByGrapheme: t }) {
	return `${aa({ frameWidth: e })}:${+!!t}`;
}
//#endregion
//#region src/editor/shape-manager/domain/shape-layout-signature.ts
var sa = "v1", ca = 4294967291, la = 4294967279;
function ua({ group: e, text: t }) {
	return JSON.stringify([
		t.textCaseRaw,
		t.text,
		t.uppercase,
		t.fontFamily,
		t.fontSize,
		t.fontWeight,
		t.fontStyle,
		t.lineHeight,
		t.charSpacing,
		t.stroke,
		t.strokeWidth,
		t.styles,
		t.lineFontDefaults,
		e.shapePresetKey,
		e.shapeTextAutoExpand,
		e.shapePaddingTop,
		e.shapePaddingRight,
		e.shapePaddingBottom,
		e.shapePaddingLeft,
		e.shapeStrokeWidth,
		e.shapeRounding
	]);
}
function da({ source: e }) {
	let t = 17, n = 23;
	for (let r = 0; r < e.length; r += 1) {
		let i = e.charCodeAt(r);
		t = (t * 31 + i) % ca, n = (n * 131 + i) % la;
	}
	return [
		sa,
		e.length.toString(36),
		t.toString(36),
		n.toString(36)
	].join(":");
}
function fa({ group: e, text: t }) {
	return da({ source: ua({
		group: e,
		text: t
	}) });
}
function pa({ group: e, text: t }) {
	return e.shapeLayoutSignature === void 0 ? !1 : e.shapeLayoutSignature !== fa({
		group: e,
		text: t
	});
}
//#endregion
//#region src/editor/shape-manager/layout/shape-layout.ts
var V = 1, H = .5, ma = 24, ha = 20, ga = 16;
function _a({ text: e, alignV: t, width: n, height: r, appliedPadding: i, appliedUserPadding: a, wrapPolicy: o }) {
	let { frame: s, splitByGrapheme: c, textTop: l } = Ea({
		text: e,
		width: n,
		height: r,
		alignV: t,
		padding: i,
		wrapPolicy: o
	});
	return {
		width: n,
		height: r,
		appliedPadding: i,
		appliedUserPadding: a,
		frame: s,
		splitByGrapheme: c,
		textTop: l,
		wrapPolicy: o
	};
}
var va = ({ text: e, width: t, height: n, alignV: r, padding: i, wrapPolicy: a, internalShapeTextInset: o, resolveInternalShapeTextInset: s, preserveAspectRatio: c, shapeTextAutoExpandEnabled: l, montageAreaWidth: u, expandShapeHeightToFitText: d = !0, changedPadding: f }) => {
	let { width: p, height: m, appliedPadding: h, appliedUserPadding: g } = c ? Ca({
		text: e,
		width: t,
		height: n,
		padding: i,
		wrapPolicy: a,
		internalShapeTextInset: o,
		resolveInternalShapeTextInset: s,
		shapeTextAutoExpandEnabled: l,
		montageAreaWidth: u,
		expandShapeHeightToFitText: d,
		changedPadding: f
	}) : Ma({
		text: e,
		width: t,
		height: n,
		padding: i,
		wrapPolicy: a,
		internalShapeTextInset: o,
		resolveInternalShapeTextInset: s,
		expandShapeHeightToFitText: d,
		changedPadding: f
	});
	return _a({
		text: e,
		alignV: r,
		width: p,
		height: m,
		appliedPadding: h,
		appliedUserPadding: g,
		wrapPolicy: a
	});
}, ya = ({ text: e, width: t, height: n, alignV: r, padding: i, wrapPolicy: a, internalShapeTextInset: o, resolveInternalShapeTextInset: s, expandShapeHeightToFitText: c = !0, changedPadding: l, measurementCache: u }) => {
	let d = Ke({ padding: i }), f = F({ padding: o }), p = Math.max(V, t), m = Math.max(V, n), h = ({ text: e, frameWidth: t }) => Ki({
		text: e,
		frameWidth: t,
		wrapPolicy: a,
		measurementCache: u
	}), g = Bi({
		text: e,
		width: p,
		height: m,
		padding: d,
		internalShapeTextInset: ja({
			width: p,
			height: m,
			internalShapeTextInset: f,
			resolveInternalShapeTextInset: s
		}),
		expandShapeHeightToFitText: c,
		changedPadding: l,
		measureTextboxHeightForFrame: h,
		resolveMinimumTextFrameWidth: ({ text: e }) => qi({
			text: e,
			measurementCache: u
		})
	});
	for (let t = 0; t < ma; t += 1) {
		let t = Math.max(m, g.requiredHeight);
		if (t <= m + H) break;
		m = t, g = Bi({
			text: e,
			width: p,
			height: m,
			padding: d,
			internalShapeTextInset: ja({
				width: p,
				height: m,
				internalShapeTextInset: f,
				resolveInternalShapeTextInset: s
			}),
			expandShapeHeightToFitText: c,
			changedPadding: l,
			measureTextboxHeightForFrame: h,
			resolveMinimumTextFrameWidth: ({ text: e }) => qi({
				text: e,
				measurementCache: u
			})
		});
	}
	return _a({
		text: e,
		alignV: r,
		width: p,
		height: m,
		appliedPadding: g.appliedPadding,
		appliedUserPadding: g.appliedUserPadding,
		wrapPolicy: a
	});
};
function ba({ group: e, shape: t, text: n, alignH: r, alignV: i, resolvedLayout: a }) {
	let o = Math.max(V, e.shapeManualBaseWidth ?? a.width), s = Math.max(V, e.shapeManualBaseHeight ?? a.height), { width: c, height: l, appliedUserPadding: u, frame: d, splitByGrapheme: f, textTop: p } = a;
	gi({
		shape: t,
		width: c,
		height: l,
		rounding: e.shapeRounding,
		strokeWidth: e.shapeStrokeWidth
	}), n.set({
		autoExpand: !1,
		width: d.width,
		textAlign: r,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		skewX: 0,
		skewY: 0,
		flipX: !1,
		flipY: !1,
		left: d.left,
		top: p,
		originX: "left",
		originY: "top",
		splitByGrapheme: f
	}), n.initDimensions(), n.setCoords(), t.setCoords(), e.shapeBaseWidth = c, e.shapeBaseHeight = l, e.shapeManualBaseWidth = o, e.shapeManualBaseHeight = s, e.shapePaddingTop = u.top, e.shapePaddingRight = u.right, e.shapePaddingBottom = u.bottom, e.shapePaddingLeft = u.left, e.shapeAlignHorizontal = r, e.shapeAlignVertical = i, e.set({
		width: c,
		height: l,
		scaleX: 1,
		scaleY: 1
	}), e.shapeLayoutSignature = fa({
		group: e,
		text: n
	}), e.set("dirty", !0), e.setCoords();
}
var xa = ({ group: e, shape: t, text: n, width: r, height: i, alignH: a, alignV: o, padding: s, wrapPolicy: c, internalShapeTextInset: l, resolveInternalShapeTextInset: u, preserveAspectRatio: d, shapeTextAutoExpandEnabled: f, montageAreaWidth: p, expandShapeHeightToFitText: m = !0, changedPadding: h }) => {
	ba({
		group: e,
		shape: t,
		text: n,
		alignH: a,
		alignV: o,
		resolvedLayout: va({
			text: n,
			width: r,
			height: i,
			alignV: o,
			padding: s,
			wrapPolicy: c,
			internalShapeTextInset: l,
			resolveInternalShapeTextInset: u,
			preserveAspectRatio: d,
			shapeTextAutoExpandEnabled: f ?? e.shapeTextAutoExpand !== !1,
			montageAreaWidth: p,
			expandShapeHeightToFitText: m,
			changedPadding: h
		})
	});
}, Sa = ({ group: e, shape: t, text: n, width: r, height: i, alignH: a, alignV: o, padding: s, wrapPolicy: c, internalShapeTextInset: l, resolveInternalShapeTextInset: u, expandShapeHeightToFitText: d = !0, changedPadding: f }) => {
	ba({
		group: e,
		shape: t,
		text: n,
		alignH: a,
		alignV: o,
		resolvedLayout: ya({
			text: n,
			width: r,
			height: i,
			alignV: o,
			padding: s,
			wrapPolicy: c,
			internalShapeTextInset: l,
			resolveInternalShapeTextInset: u,
			expandShapeHeightToFitText: d,
			changedPadding: f
		})
	});
};
function Ca({ text: e, width: t, height: n, padding: r, wrapPolicy: i, internalShapeTextInset: a, resolveInternalShapeTextInset: o, shapeTextAutoExpandEnabled: s = !0, montageAreaWidth: c, expandShapeHeightToFitText: l = !0, changedPadding: u }) {
	let d = Math.max(V, t), f = Math.max(V, n), p = Number.isFinite(c) && (c ?? 0) > 0 ? Math.max(V, c ?? V) : null;
	if (!Oa({ text: e })) return Ma({
		text: e,
		width: d,
		height: f,
		padding: r,
		wrapPolicy: i,
		internalShapeTextInset: a,
		resolveInternalShapeTextInset: o,
		expandShapeHeightToFitText: l,
		changedPadding: u
	});
	let m = f / d, h = ({ width: t }) => {
		let n = Math.max(V, t * m), s = Ma({
			text: e,
			width: t,
			height: n,
			padding: r,
			wrapPolicy: i,
			internalShapeTextInset: a,
			resolveInternalShapeTextInset: o,
			expandShapeHeightToFitText: l,
			changedPadding: u
		});
		return {
			candidateHeight: n,
			frameWidth: Ni({
				width: t,
				padding: s.appliedPadding
			}),
			layoutResolution: s
		};
	}, g = ({ candidateWidth: e, candidateHeight: t, layoutResolution: n }) => !(n.width > e + H || n.height > t + H);
	if (!s) {
		let e = ({ width: e }) => {
			let { candidateHeight: t, layoutResolution: n } = h({ width: e });
			return g({
				candidateWidth: e,
				candidateHeight: t,
				layoutResolution: n
			});
		}, t = p ? Math.max(d, p) : d;
		e({ width: t }) || (t = Na({
			minimumWidth: t,
			isWidthValid: e
		}));
		let { layoutResolution: n } = h({ width: Pa({
			minimumWidth: d,
			maximumWidth: t,
			isWidthValid: e
		}) });
		return n;
	}
	let _ = ({ width: t, requiredFrameWidth: n }) => {
		let { candidateHeight: r, frameWidth: a, layoutResolution: o } = h({ width: t });
		return !g({
			candidateWidth: t,
			candidateHeight: r,
			layoutResolution: o
		}) || n !== void 0 && a < n - H ? !1 : !Gi({
			text: e,
			frameWidth: a,
			wrapPolicy: i
		}).hasWrappedLines;
	}, v = p ? Math.max(d, p) : Na({
		minimumWidth: d,
		isWidthValid: ({ width: e }) => _({ width: e })
	}), y = h({ width: v }), b = Gi({
		text: e,
		frameWidth: y.frameWidth,
		wrapPolicy: i
	});
	if (b.hasWrappedLines) return y.layoutResolution;
	let x = Math.max(V, b.longestLineWidth), { layoutResolution: S } = h({ width: Pa({
		minimumWidth: d,
		maximumWidth: v,
		isWidthValid: ({ width: e }) => _({
			width: e,
			requiredFrameWidth: x
		})
	}) });
	return S;
}
var wa = ({ text: e, currentWidth: t, minimumWidth: n, padding: r, wrapPolicy: i, montageAreaWidth: a, resolvePaddingForWidth: o }) => {
	let s = Math.max(V, t), c = Math.max(V, n);
	if (!Oa({ text: e })) return c;
	let l = Math.max(c, Number.isFinite(a) && a > 0 ? Math.max(V, a) : Math.max(s, c)), u = Ni({
		width: l,
		padding: ka({
			width: l,
			padding: r,
			resolvePaddingForWidth: o
		})
	}), d = l, f = Gi({
		text: e,
		frameWidth: u,
		wrapPolicy: i
	});
	if (f.hasWrappedLines) return d;
	let p = Math.max(V, f.longestLineWidth);
	return Pa({
		minimumWidth: c,
		maximumWidth: d,
		isWidthValid: ({ width: t }) => {
			let n = Ni({
				width: t,
				padding: ka({
					width: t,
					padding: r,
					resolvePaddingForWidth: o
				})
			});
			return n < p - H ? !1 : !Gi({
				text: e,
				frameWidth: n,
				wrapPolicy: i
			}).hasWrappedLines;
		}
	});
}, Ta = ({ text: e, padding: t, resolvePaddingForWidth: n, measurementCache: r }) => {
	if (!Oa({ text: e })) return V;
	let i = qi({
		text: e,
		measurementCache: r
	}), a = Math.max(V, i), o = ({ width: e }) => Ni({
		width: e,
		padding: ka({
			width: e,
			padding: t,
			resolvePaddingForWidth: n
		})
	}) >= i - H;
	return Pa({
		minimumWidth: a,
		maximumWidth: Na({
			minimumWidth: a,
			isWidthValid: o
		}),
		isWidthValid: o
	});
}, Ea = ({ text: e, width: t, height: n, alignV: r, wrapPolicy: i, padding: a }) => {
	let o = Fa({
		width: Math.max(V, t),
		height: Math.max(V, n),
		padding: F({ padding: a })
	}), s = Yi({
		text: e,
		frameWidth: o.width,
		wrapPolicy: i
	}), c = Ki({
		text: e,
		frameWidth: o.width,
		splitByGrapheme: s,
		wrapPolicy: i
	});
	return {
		frame: o,
		splitByGrapheme: s,
		textTop: Ji({
			alignV: r,
			frameHeight: o.height,
			frameTop: o.top,
			textHeight: c
		})
	};
}, Da = ({ text: e, width: t, height: n, padding: r, wrapPolicy: i, resolvePaddingForSize: a, measurementCache: o }) => {
	let s = Math.max(V, n);
	if (!Oa({ text: e })) return s;
	let c = Math.max(V, t), l = s;
	for (let t = 0; t < ma; t += 1) {
		let t = Aa({
			width: c,
			height: l,
			padding: r,
			resolvePaddingForSize: a
		}), n = Ki({
			text: e,
			frameWidth: Ni({
				width: c,
				padding: t
			}),
			wrapPolicy: i,
			measurementCache: o
		}), u = Math.max(s, n + t.top + t.bottom);
		if (u <= l + H) return u;
		l = u;
	}
	return l;
};
function Oa({ text: e }) {
	return (e.text ?? "").trim().length > 0;
}
function ka({ width: e, padding: t, resolvePaddingForWidth: n }) {
	return F(n ? { padding: n({ width: Math.max(V, e) }) } : { padding: t });
}
function Aa({ width: e, height: t, padding: n, resolvePaddingForSize: r }) {
	return F(r ? { padding: r({
		width: Math.max(V, e),
		height: Math.max(V, t)
	}) } : { padding: n });
}
function ja({ width: e, height: t, internalShapeTextInset: n, resolveInternalShapeTextInset: r }) {
	return F(r ? { padding: r({
		width: Math.max(V, e),
		height: Math.max(V, t)
	}) } : { padding: n });
}
function Ma({ text: e, width: t, height: n, padding: r, wrapPolicy: i, internalShapeTextInset: a, resolveInternalShapeTextInset: o, expandShapeHeightToFitText: s = !0, changedPadding: c }) {
	let l = Ke({ padding: r }), u = F({ padding: a }), d = Math.max(V, t), f = Math.max(V, n), p = ({ text: e, frameWidth: t }) => Ki({
		text: e,
		frameWidth: t,
		wrapPolicy: i
	}), m = Bi({
		text: e,
		width: d,
		height: f,
		padding: l,
		internalShapeTextInset: ja({
			width: d,
			height: f,
			internalShapeTextInset: u,
			resolveInternalShapeTextInset: o
		}),
		expandShapeHeightToFitText: s,
		changedPadding: c,
		measureTextboxHeightForFrame: p,
		resolveMinimumTextFrameWidth: qi
	});
	for (let t = 0; t < ma; t += 1) {
		let t = Math.max(d, m.requiredWidth), n = Math.max(f, m.requiredHeight);
		if (t <= d + H && n <= f + H) break;
		d = t, f = n, m = Bi({
			text: e,
			width: d,
			height: f,
			padding: l,
			internalShapeTextInset: ja({
				width: d,
				height: f,
				internalShapeTextInset: u,
				resolveInternalShapeTextInset: o
			}),
			expandShapeHeightToFitText: s,
			changedPadding: c,
			measureTextboxHeightForFrame: p,
			resolveMinimumTextFrameWidth: qi
		});
	}
	return {
		width: d,
		height: f,
		appliedPadding: m.appliedPadding,
		appliedUserPadding: m.appliedUserPadding
	};
}
function Na({ minimumWidth: e, isWidthValid: t }) {
	let n = Math.max(V, e);
	if (t({ width: n })) return n;
	for (let e = 0; e < ga; e += 1) if (n = Math.max(n + 1, n * 2), t({ width: n })) return n;
	return n;
}
function Pa({ minimumWidth: e, maximumWidth: t, isWidthValid: n }) {
	let r = Math.max(V, e), i = Math.max(r, t);
	if (n({ width: r })) return r;
	if (!n({ width: i })) return i;
	for (let e = 0; e < ha && !(i - r <= H); e += 1) {
		let e = r + (i - r) / 2;
		if (n({ width: e })) {
			i = e;
			continue;
		}
		r = e;
	}
	return i;
}
function Fa({ width: e, height: t, padding: n }) {
	let r = Math.max(0, n.left), i = Math.max(0, n.right), a = Math.max(0, n.top), o = Math.max(0, n.bottom);
	return {
		left: -e / 2 + r,
		top: -t / 2 + a,
		width: Math.max(V, e - r - i),
		height: Math.max(V, t - a - o)
	};
}
//#endregion
//#region src/editor/shape-manager/creation/shape-group-factory.ts
var Ia = ({ explicitAlign: e, textAlign: t }) => e || (t === "left" || t === "center" || t === "right" || t === "justify" ? t : Ne), La = ({ preset: e, style: t }) => ({ width: n, height: r }) => Xe({
	baseInset: Be({
		preset: e,
		width: n,
		height: r
	}),
	stroke: t.stroke,
	strokeWidth: t.strokeWidth
}), Ra = class {
	constructor({ layoutController: e, textNodeController: t }) {
		this.layoutController = e, this.textNodeController = t;
	}
	async createForAdd({ basePreset: e, options: t }) {
		let n = this._resolvePresetState({
			basePreset: e,
			options: t
		}), r = this._resolveDimensions({
			preset: n.preset,
			options: t
		}), i = this._resolveLayoutState({
			preset: n.preset,
			dimensions: r,
			options: t
		}), a = this.textNodeController.create({
			text: t.text,
			textStyle: t.textStyle,
			width: r.manualWidth,
			align: i.alignH,
			opacity: i.style.opacity
		}), o = this._resolveInitialWidth({
			text: a,
			dimensions: r,
			layout: i
		}), s = await Ai({
			preset: n.preset,
			width: o,
			height: r.manualHeight,
			style: i.style,
			rounding: n.rounding
		}), c = this._createGroupObject({
			id: t.id ?? `shape-${E()}`,
			presetKey: n.preset.key,
			presetCanRound: n.presetCanRound,
			shape: s,
			text: a,
			width: o,
			dimensions: r,
			layout: i,
			rounding: n.rounding
		});
		return this._applyInitialLayout({
			group: c,
			shape: s,
			text: a,
			width: o,
			dimensions: r,
			layout: i
		}), c;
	}
	_resolvePresetState({ basePreset: e, options: t }) {
		let n = M({ rounding: t.rounding }), r = Le({ presetKey: Re({
			preset: e,
			rounding: n
		}) }) ?? e, i = He({ preset: r });
		return {
			preset: r,
			presetCanRound: i,
			rounding: i ? n : 0
		};
	}
	_resolveDimensions({ preset: e, options: t }) {
		let { width: n, height: r, preserveAspectRatio: i } = t, a = n === void 0 ? void 0 : Math.max(1, n), o = r === void 0 ? void 0 : Math.max(1, r);
		if (i) {
			let t = this.layoutController.resolveAspectRatioFittedDimensions({
				targetWidth: a,
				targetHeight: o,
				aspectWidth: e.width,
				aspectHeight: e.height
			});
			return {
				manualWidth: t.width,
				manualHeight: t.height,
				replaceBoxWidth: a,
				replaceBoxHeight: o,
				preserveAspectRatio: !0
			};
		}
		return {
			manualWidth: Math.max(1, n ?? e.width),
			manualHeight: Math.max(1, r ?? e.height),
			replaceBoxWidth: a,
			replaceBoxHeight: o,
			preserveAspectRatio: !1
		};
	}
	_resolveLayoutState({ preset: e, dimensions: t, options: n }) {
		let r = di({
			options: n,
			fallback: null
		}), i = Ke({ padding: n.textPadding }), a = La({
			preset: e,
			style: r
		});
		return {
			shapeTextAutoExpand: n.shapeTextAutoExpand !== !1,
			alignH: Ia({
				explicitAlign: n.alignH,
				textAlign: n.textStyle?.align
			}),
			alignV: n.alignV ?? "middle",
			userPadding: i,
			internalShapeTextInset: a({
				width: t.manualWidth,
				height: t.manualHeight
			}),
			resolveInternalShapeTextInset: a,
			changedPadding: Ze({ padding: n.textPadding }),
			style: r
		};
	}
	_resolveInitialWidth({ text: e, dimensions: t, layout: n }) {
		if (t.preserveAspectRatio) return t.manualWidth;
		let r = Ye({
			base: n.internalShapeTextInset,
			addition: n.userPadding
		});
		return this.layoutController.resolveShapeLayoutWidth({
			text: e,
			currentWidth: t.manualWidth,
			manualWidth: t.manualWidth,
			shapeTextAutoExpandEnabled: n.shapeTextAutoExpand,
			padding: r,
			resolvePaddingForWidth: ({ width: e }) => Ye({
				base: n.resolveInternalShapeTextInset({
					width: e,
					height: t.manualHeight
				}),
				addition: n.userPadding
			})
		});
	}
	_createGroupObject({ id: e, presetKey: t, presetCanRound: n, shape: r, text: i, width: a, dimensions: o, layout: s, rounding: c }) {
		let l = new ct([r, i], {
			originX: "center",
			originY: "center",
			left: 0,
			top: 0,
			lockScalingFlip: !0,
			centeredScaling: !1,
			objectCaching: !1
		}), u = l;
		return u.id = e, at({
			group: l,
			metadata: {
				presetKey: t,
				presetCanRound: n,
				width: a,
				height: o.manualHeight,
				manualWidth: o.manualWidth,
				manualHeight: o.manualHeight,
				replaceBoxWidth: o.replaceBoxWidth,
				replaceBoxHeight: o.replaceBoxHeight,
				shapeTextAutoExpand: s.shapeTextAutoExpand,
				alignH: s.alignH,
				alignV: s.alignV,
				padding: s.userPadding,
				style: s.style,
				rounding: c
			}
		}), l.rehydrateRuntimeState(), et({ group: l }), tt({ text: i }), l;
	}
	_applyInitialLayout({ group: e, shape: t, text: n, width: r, dimensions: i, layout: a }) {
		xa({
			group: e,
			shape: t,
			text: n,
			width: r,
			height: i.manualHeight,
			alignH: a.alignH,
			alignV: a.alignV,
			padding: a.userPadding,
			shapeTextAutoExpandEnabled: a.shapeTextAutoExpand,
			preserveAspectRatio: i.preserveAspectRatio,
			internalShapeTextInset: a.internalShapeTextInset,
			resolveInternalShapeTextInset: a.resolveInternalShapeTextInset,
			montageAreaWidth: i.preserveAspectRatio ? this.layoutController.resolveMontageAreaWidth() : void 0,
			changedPadding: a.changedPadding
		}), i.preserveAspectRatio && (e.shapeManualBaseWidth = Math.max(1, e.shapeBaseWidth ?? r), e.shapeManualBaseHeight = Math.max(1, e.shapeBaseHeight ?? i.manualHeight)), nt({ group: e });
	}
};
//#endregion
//#region src/editor/shape-manager/scaling/shape-scaling-transform.ts
function za({ value: e }) {
	return typeof e != "number" || !Number.isFinite(e) || e === 0 ? null : e > 0 ? 1 : -1;
}
var Ba = ({ transform: e, key: t }) => {
	let n = e?.original;
	if (!n || typeof n != "object") return null;
	let r = n[t];
	return typeof r != "number" || !Number.isFinite(r) ? null : r;
}, Va = ({ value: e }) => e === "left" || e === "center" || e === "right" || typeof e == "number" && Number.isFinite(e) ? e : null, Ha = ({ value: e }) => e === "top" || e === "center" || e === "bottom" || typeof e == "number" && Number.isFinite(e) ? e : null, U = ({ transform: e }) => {
	let t = e?.action ?? "", n = typeof e?.corner == "string" ? e.corner : "", r = t === "skewX" || t === "skewY", i = !r && (n === "tl" || n === "tr" || n === "bl" || n === "br"), a = !r && (t === "scaleX" || n === "ml" || n === "mr"), o = !r && (t === "scaleY" || n === "mt" || n === "mb"), s = a || i, c = o || i;
	return {
		canScaleWidth: s,
		canScaleHeight: c,
		isCornerScaleAction: i,
		isVerticalOnlyScale: c && !s
	};
}, Ua = ({ event: e, target: t, transform: n, canvas: r }) => {
	if (!e) return null;
	let i = t.canvas ?? r, a = i.getScenePoint(e), o = t.getRelativeCenterPoint(), s = t.translateToGivenOrigin(o, "center", "center", n.originX, n.originY), c = t.angle ?? 0, l = (c === 0 ? a : a.rotate(-c * Math.PI / 180, o)).subtract(s), u = t.controls[n.corner], d = i.getZoom() || 1, f = (t.padding ?? 0) / d;
	return l.x >= f && (l.x -= f), l.x <= -f && (l.x += f), l.y >= f && (l.y -= f), l.y <= -f && (l.y += f), l.x -= u?.offsetX ?? 0, l.y -= u?.offsetY ?? 0, l;
}, Wa = ({ group: e, originX: t, originY: n }) => {
	if (t === null || n === null) return null;
	let r = e, i = typeof r.getRelativeCenterPoint == "function" ? r.getRelativeCenterPoint() : e.getCenterPoint();
	return typeof r.translateToOriginPoint == "function" ? r.translateToOriginPoint(i, t, n) : i;
}, Ga = ({ state: e, transform: t }) => {
	if (!t || e.startTransformOriginX === null && e.startTransformOriginY === null) return !1;
	let n = Va({ value: t.originX }), r = Ha({ value: t.originY });
	return n !== e.startTransformOriginX || r !== e.startTransformOriginY;
}, Ka = ({ state: e, transform: t }) => !t || !e.startTransformCorner ? !1 : t.corner !== e.startTransformCorner, W = 1e-4, qa = .5;
function Ja({ isProportionalScaling: e, startTextSplitByGrapheme: t }) {
	if (e && !t) return "words-only";
}
function Ya({ width: e, height: t }) {
	return `${Math.round(Math.max(1, e) * 1e6) / 1e6}:${Math.round(Math.max(1, t) * 1e6) / 1e6}`;
}
function Xa({ width: e, padding: t }) {
	return Math.max(1, e - Math.max(0, t.left) - Math.max(0, t.right));
}
function Za({ height: e, padding: t }) {
	return Math.max(1, e - Math.max(0, t.top) - Math.max(0, t.bottom));
}
function Qa({ text: e }) {
	return (e.text ?? "").trim().length > 0;
}
function $a({ height: e }) {
	return {
		measuredHeight: e,
		renderedLineCount: 0,
		longestLineWidth: 0,
		requiresGraphemeSplit: !1,
		isValid: !0
	};
}
function eo({ group: e }) {
	return Ke({ padding: {
		top: e.shapePaddingTop,
		right: e.shapePaddingRight,
		bottom: e.shapePaddingBottom,
		left: e.shapePaddingLeft
	} });
}
function to({ group: e, width: t, height: n }) {
	let r = e.shapePresetKey ?? "", i = r ? Le({ presetKey: r }) : null;
	return Xe({
		baseInset: i ? Be({
			preset: i,
			width: t,
			height: n
		}) : void 0,
		stroke: e.shapeStroke,
		strokeWidth: e.shapeStrokeWidth
	});
}
function G({ group: e, width: t, height: n }) {
	return to({
		group: e,
		width: Math.max(1, t ?? e.shapeBaseWidth ?? e.width ?? e.shapeManualBaseWidth ?? 1),
		height: Math.max(1, n ?? e.shapeBaseHeight ?? e.height ?? e.shapeManualBaseHeight ?? 1)
	});
}
function no({ group: e, text: t, width: n, height: r, measurementCache: i, constraintCache: a }) {
	let o = Math.max(1, n), s = Math.max(1, r), c = Ya({
		width: o,
		height: s
	}), l = a?.get(c);
	if (l) return l;
	if (!Qa({ text: t })) {
		let e = $a({ height: s });
		return a?.set(c, e), e;
	}
	let u = G({
		group: e,
		width: o,
		height: s
	}), d = Xa({
		width: o,
		padding: u
	}), f = Za({
		height: s,
		padding: u
	}), p = Wi({
		text: t,
		frameWidth: d,
		splitByGrapheme: !1,
		measurementCache: i ?? void 0
	}), m = {
		...p,
		isValid: !p.requiresGraphemeSplit && p.measuredHeight <= f + .5
	};
	return a?.set(c, m), m;
}
function ro({ group: e, text: t, state: n }) {
	let { startHeight: r, startWidth: i, startScaleX: a, startScaleY: o, lastAllowedScaleX: s, lastAllowedScaleY: c } = n, l = Math.max(1 / i, 1 / r), u = Math.max(l, a, o, s, c), d = ({ scale: a }) => {
		let o = no({
			group: e,
			text: t,
			width: Math.max(1, i * a),
			height: Math.max(1, r * a),
			measurementCache: n.previewTextMeasurementCache,
			constraintCache: n.proportionalTextConstraintCache
		});
		return {
			minimumHeight: o.measuredHeight,
			isValid: o.isValid
		};
	}, f = d({ scale: u });
	if (!f.isValid) return {
		scale: u,
		minimumHeight: f.minimumHeight
	};
	let p = l, m = u, h = u, g = f.minimumHeight;
	for (let e = 0; e < 24; e += 1) {
		let e = (p + m) / 2, t = d({ scale: e });
		if (t.isValid) {
			h = e, g = t.minimumHeight, m = e;
			continue;
		}
		p = e;
	}
	return {
		scale: h,
		minimumHeight: g
	};
}
function io({ group: e, text: t, width: n, padding: r, wrapPolicy: i, measurementCache: a }) {
	return Da({
		text: t,
		width: n,
		height: 1,
		padding: r,
		wrapPolicy: i,
		measurementCache: a ?? void 0,
		resolvePaddingForSize: ({ width: t, height: n }) => G({
			group: e,
			width: t,
			height: n
		})
	});
}
function ao({ group: e, text: t, constraintPadding: n, state: r, scaleX: i, scaleY: a }) {
	let o = r.canScaleWidth ? Math.max(1, r.startWidth * i) : r.startWidth, s = r.canScaleHeight ? Math.max(1, r.startHeight * a) : r.startHeight, c = i < r.lastAllowedScaleX - W, l = a < r.lastAllowedScaleY - W, u = r.canScaleHeight && !r.canScaleWidth, d = r.canScaleWidth && c ? Ta({
		text: t,
		padding: n,
		measurementCache: r.previewTextMeasurementCache ?? void 0,
		resolvePaddingForWidth: ({ width: t }) => G({
			group: e,
			width: t,
			height: s
		})
	}) : null;
	return {
		attemptedHeight: s,
		attemptedWidth: o,
		isShrinkingX: c,
		isShrinkingY: l,
		minimumHeight: r.canScaleHeight && l ? (u ? r.fixedWidthMinimumTextFitHeight : null) ?? io({
			group: e,
			text: t,
			width: o,
			padding: n,
			measurementCache: r.previewTextMeasurementCache
		}) : null,
		minimumWidth: d,
		shouldHandleAsNoop: u && r.cannotScaleDownAtStart && a < r.startScaleY - 1e-4,
		shouldValidateProportionalConstraint: r.isProportionalScaling && r.canScaleWidth && r.canScaleHeight && (c || l)
	};
}
function oo({ attempt: e, group: t, state: n, text: r }) {
	if (!e.shouldValidateProportionalConstraint) return null;
	if (no({
		group: t,
		text: r,
		width: e.attemptedWidth,
		height: e.attemptedHeight,
		measurementCache: n.previewTextMeasurementCache,
		constraintCache: n.proportionalTextConstraintCache
	}).isValid) return {
		shouldHandleAsNoop: e.shouldHandleAsNoop,
		shouldRestoreLastAllowedTransform: n.crossedOppositeCorner,
		clampedScaleX: null,
		clampedScaleY: null,
		resolvedMinimumHeight: null
	};
	let i = ro({
		group: t,
		text: r,
		state: n
	});
	return {
		shouldHandleAsNoop: e.shouldHandleAsNoop,
		shouldRestoreLastAllowedTransform: n.crossedOppositeCorner,
		clampedScaleX: i.scale,
		clampedScaleY: i.scale,
		resolvedMinimumHeight: i.minimumHeight
	};
}
function so({ attempt: e, group: t, state: n, text: r }) {
	let i = e.minimumWidth !== null && e.attemptedWidth < e.minimumWidth + 1e-4, a = e.minimumHeight !== null && e.attemptedHeight < e.minimumHeight + 1e-4;
	if (n.isProportionalScaling && (i || a)) {
		let i = ro({
			group: t,
			text: r,
			state: n
		});
		return {
			shouldHandleAsNoop: e.shouldHandleAsNoop,
			shouldRestoreLastAllowedTransform: n.crossedOppositeCorner,
			clampedScaleX: i.scale,
			clampedScaleY: i.scale,
			resolvedMinimumHeight: i.minimumHeight
		};
	}
	let o = e.minimumWidth === null || !i ? null : Math.max(1 / n.startWidth, e.minimumWidth / n.startWidth), s = e.minimumHeight === null || !a ? null : Math.max(1 / n.startHeight, e.minimumHeight / n.startHeight);
	return {
		shouldHandleAsNoop: e.shouldHandleAsNoop,
		shouldRestoreLastAllowedTransform: n.crossedOppositeCorner,
		clampedScaleX: o,
		clampedScaleY: s,
		resolvedMinimumHeight: e.minimumHeight
	};
}
function co(e) {
	let t = ao(e);
	return oo({
		attempt: t,
		group: e.group,
		state: e.state,
		text: e.text
	}) ?? so({
		attempt: t,
		group: e.group,
		state: e.state,
		text: e.text
	});
}
function lo({ group: e, text: t, constraintPadding: n, startDimensions: r, appliedScaleX: i, appliedScaleY: a, minimumHeight: o, wrapPolicy: s, measurementCache: c }) {
	let l = r.canScaleWidth ? Math.max(1, r.startWidth * i) : r.startWidth, u = r.canScaleHeight ? Math.max(1, r.startHeight * a) : r.startManualBaseHeight, d = o ?? Da({
		text: t,
		width: l,
		height: u,
		padding: n,
		wrapPolicy: s,
		measurementCache: c ?? void 0,
		resolvePaddingForSize: ({ width: t, height: n }) => G({
			group: e,
			width: t,
			height: n
		})
	});
	return {
		previewWidth: l,
		previewHeight: Math.max(u, d)
	};
}
function uo({ group: e, text: t, state: n, appliedScaleX: r, appliedScaleY: i, minimumHeight: a }) {
	let o = n.canScaleWidth ? Math.max(1, n.startWidth * r) : n.startWidth, s = n.canScaleHeight ? Math.max(1, n.startHeight * i) : n.startManualBaseHeight, c = a == null ? s : Math.max(s, a), l = !n.canScaleHeight, u = Ja({
		isProportionalScaling: n.isProportionalScaling,
		startTextSplitByGrapheme: n.startTextSplitByGrapheme
	});
	return ya({
		text: t,
		width: o,
		height: c,
		alignV: e.shapeAlignVertical ?? "middle",
		padding: eo({ group: e }),
		wrapPolicy: u,
		expandShapeHeightToFitText: l,
		measurementCache: n.previewTextMeasurementCache ?? void 0,
		resolveInternalShapeTextInset: ({ width: t, height: n }) => to({
			group: e,
			width: t,
			height: n
		})
	});
}
function fo({ group: e, transform: t }) {
	let { canScaleWidth: n, canScaleHeight: r } = U({ transform: t }), i = Math.max(1, e.shapeBaseWidth ?? e.width ?? e.shapeManualBaseWidth ?? 1), a = Math.max(1, e.shapeBaseHeight ?? e.height ?? e.shapeManualBaseHeight ?? 1);
	return {
		startWidth: i,
		startHeight: a,
		startManualBaseWidth: Math.max(1, e.shapeManualBaseWidth ?? i),
		startManualBaseHeight: Math.max(1, e.shapeManualBaseHeight ?? a),
		canScaleWidth: n,
		canScaleHeight: r
	};
}
function po({ group: e, transform: t }) {
	let n = Ba({
		transform: t,
		key: "scaleX"
	}), r = Ba({
		transform: t,
		key: "scaleY"
	}), i = Ba({
		transform: t,
		key: "left"
	}), a = Ba({
		transform: t,
		key: "top"
	}), o = Va({ value: t?.original?.originX ?? t?.originX }), s = Ha({ value: t?.original?.originY ?? t?.originY }), c = Wa({
		group: e,
		originX: o,
		originY: s
	}), l = typeof t?.corner == "string" ? t.corner : null;
	return {
		startScaleX: Math.abs(n ?? e.scaleX ?? 1) || 1,
		startScaleY: Math.abs(r ?? e.scaleY ?? 1) || 1,
		startLeft: i ?? e.left ?? 0,
		startTop: a ?? e.top ?? 0,
		startTransformOriginX: o,
		startTransformOriginY: s,
		startTransformCorner: l,
		scalingAnchorX: c?.x ?? null,
		scalingAnchorY: c?.y ?? null
	};
}
function mo({ group: e, text: t, constraintPadding: n, transform: r }) {
	let i = fo({
		group: e,
		transform: r
	}), a = po({
		group: e,
		transform: r
	}), o = !i.canScaleWidth && i.canScaleHeight, s = {
		measurementsByKey: /* @__PURE__ */ new Map(),
		splitByGraphemeByFrameWidth: /* @__PURE__ */ new Map(),
		minimumTextFrameWidth: null
	}, c = /* @__PURE__ */ new Map(), l = io({
		group: e,
		text: t,
		width: i.startWidth,
		padding: n,
		measurementCache: s
	});
	return {
		...i,
		cannotScaleDownAtStart: l >= i.startHeight - W,
		startTextSplitByGrapheme: !!t.splitByGrapheme,
		isProportionalScaling: !1,
		blockedScaleAttempt: !1,
		...a,
		scalingAnchorOriginX: a.startTransformOriginX,
		scalingAnchorOriginY: a.startTransformOriginY,
		crossedOppositeCorner: !1,
		lastAllowedFlipX: !!e.flipX,
		lastAllowedFlipY: !!e.flipY,
		lastAllowedScaleX: a.startScaleX,
		lastAllowedScaleY: a.startScaleY,
		lastAllowedLeft: a.startLeft,
		lastAllowedTop: a.startTop,
		scaleDirectionX: null,
		scaleDirectionY: null,
		fixedWidthMinimumTextFitHeight: o ? l : null,
		previewTextMeasurementCache: s,
		proportionalTextConstraintCache: c
	};
}
function ho({ scalingState: e, group: t, text: n, constraintPadding: r, transform: i }) {
	let a = e.get(t);
	return a || (a = mo({
		group: t,
		text: n,
		constraintPadding: r,
		transform: i
	}), e.set(t, a), a);
}
function go({ group: e, text: t, constraintPadding: n, startDimensions: r, scaleX: i, scaleY: a, wrapPolicy: o }) {
	let { previewWidth: s, previewHeight: c } = lo({
		group: e,
		text: t,
		constraintPadding: n,
		startDimensions: r,
		appliedScaleX: i,
		appliedScaleY: a,
		wrapPolicy: o
	}), { startWidth: l, startHeight: u } = r, d = Math.abs(s - l) > qa, f = Math.abs(c - u) > qa;
	return {
		width: s,
		height: c,
		hasWidthChange: d,
		hasDimensionChange: d || f
	};
}
function _o({ startManualBaseWidth: e, startManualBaseHeight: t, canScaleWidth: n, canScaleHeight: r, finalWidth: i, finalHeight: a }) {
	let o = e;
	n && (o = i);
	let s = t;
	return r && (s = a), {
		width: o,
		height: s
	};
}
function vo({ group: e, shape: t, text: n, width: r, height: i, alignH: a, alignV: o, startManualBaseWidth: s, startManualBaseHeight: c, canScaleWidth: l, canScaleHeight: u, hasWidthChange: d, wrapPolicy: f }) {
	let p = _o({
		startManualBaseWidth: s,
		startManualBaseHeight: c,
		canScaleWidth: l,
		canScaleHeight: u,
		finalWidth: r,
		finalHeight: i
	});
	e.shapeManualBaseWidth = p.width, e.shapeManualBaseHeight = p.height, l && d && (e.shapeTextAutoExpand = !1);
	let m = eo({ group: e }), h = to({
		group: e,
		width: r,
		height: i
	}), g = !u, _ = ({ width: t, height: n }) => to({
		group: e,
		width: t,
		height: n
	});
	!l && u ? Sa({
		group: e,
		shape: t,
		text: n,
		width: r,
		height: i,
		alignH: a,
		alignV: o,
		padding: m,
		wrapPolicy: f,
		internalShapeTextInset: h,
		expandShapeHeightToFitText: g,
		resolveInternalShapeTextInset: _
	}) : xa({
		group: e,
		shape: t,
		text: n,
		width: r,
		height: i,
		alignH: a,
		alignV: o,
		padding: m,
		wrapPolicy: f,
		shapeTextAutoExpandEnabled: e.shapeTextAutoExpand !== !1,
		internalShapeTextInset: h,
		expandShapeHeightToFitText: g,
		resolveInternalShapeTextInset: _
	}), e.shapeReplaceBoxWidth = Math.max(1, r), e.shapeReplaceBoxHeight = Math.max(1, i), n.set({
		scaleX: 1,
		scaleY: 1
	}), e.set({
		scaleX: 1,
		scaleY: 1
	}), e.setCoords(), n.setCoords(), t.setCoords();
}
//#endregion
//#region src/editor/shape-manager/scaling/shape-scaling-drag-boundary.ts
function yo({ group: e, state: t }) {
	let n = Math.abs(e.scaleX ?? t.startScaleX) || t.startScaleX, r = Math.abs(e.scaleY ?? t.startScaleY) || t.startScaleY;
	return {
		scaleX: t.canScaleWidth ? n : t.startScaleX,
		scaleY: t.canScaleHeight ? r : t.startScaleY
	};
}
function bo({ axis: e, canvas: t, event: n, group: r, state: i }) {
	let { transform: a } = n;
	if (!a) return !1;
	let o = a, s = e === "x" ? i?.scaleDirectionX ?? null : i?.scaleDirectionY ?? null, c = za({ value: e === "x" ? o.signX : o.signY }) ?? s;
	if (c === null) return !1;
	let l = Ua({
		canvas: t,
		event: n.e,
		target: r,
		transform: a
	});
	return l ? (e === "x" ? l.x : l.y) * c <= 0 : !1;
}
function xo({ canvas: e, event: t, group: n, minimumWidth: r, state: i }) {
	if (!i || !t.transform || !U({ transform: t.transform }).canScaleWidth || !bo({
		axis: "x",
		canvas: e,
		event: t,
		group: n,
		state: i
	})) return !1;
	let a = Math.max(1 / i.startWidth, r / i.startWidth);
	return i.lastAllowedScaleX > a + W;
}
function So({ canvas: e, event: t, group: n, minimumHeight: r, state: i }) {
	if (!i || !t.transform || !U({ transform: t.transform }).canScaleHeight || !bo({
		axis: "y",
		canvas: e,
		event: t,
		group: n,
		state: i
	})) return !1;
	let a = Math.max(1 / i.startHeight, r / i.startHeight);
	return i.lastAllowedScaleY > a + W;
}
function Co({ canScaleHeight: e, canScaleWidth: t, state: n, transform: r }) {
	let i = r;
	t && n.scaleDirectionX === null && (n.scaleDirectionX = za({ value: i.signX })), e && n.scaleDirectionY === null && (n.scaleDirectionY = za({ value: i.signY }));
}
function wo({ canScaleHeight: e, canScaleWidth: t, localX: n, localY: r, state: i }) {
	t && i.scaleDirectionX === null && (i.scaleDirectionX = za({ value: n })), e && i.scaleDirectionY === null && (i.scaleDirectionY = za({ value: r }));
}
function To({ canvas: e, event: t, group: n, state: r, transform: i }) {
	if (!i) return;
	let a = U({ transform: i });
	if (!a.isCornerScaleAction) return;
	Co({
		...a,
		state: r,
		transform: i
	});
	let o = !a.canScaleWidth || r.scaleDirectionX !== null, s = !a.canScaleHeight || r.scaleDirectionY !== null;
	if (o && s) return;
	let c = Ua({
		canvas: e,
		event: t,
		target: n,
		transform: i
	});
	c && wo({
		...a,
		localX: c.x,
		localY: c.y,
		state: r
	});
}
//#endregion
//#region src/editor/shape-manager/scaling/shape-scaling-preview.ts
function Eo({ size: e, scale: t, strokeWidth: n, minSize: r, scaleEpsilon: i }) {
	let a = Math.max(i, Math.abs(t) || 1), o = Math.max(0, n);
	return o <= 0 ? Math.max(r, e / a) : Math.max(r, e / a + o - o / a);
}
function Do({ group: e, shape: t, width: n, height: r, scaleX: i, scaleY: a, minSize: o, scaleEpsilon: s }) {
	let c = Math.max(0, e.shapeStrokeWidth ?? 0);
	gi({
		shape: t,
		width: Eo({
			size: n,
			scale: i,
			strokeWidth: c,
			minSize: o,
			scaleEpsilon: s
		}),
		height: Eo({
			size: r,
			scale: a,
			strokeWidth: c,
			minSize: o,
			scaleEpsilon: s
		}),
		rounding: e.shapeRounding,
		strokeWidth: c
	});
}
function Oo({ text: e, layout: t, alignH: n, scaleX: r, scaleY: i, scaleEpsilon: a }) {
	let o = Math.max(a, Math.abs(r) || 1), s = Math.max(a, Math.abs(i) || 1), c = n ?? "center";
	e.set({
		autoExpand: !1,
		textAlign: c,
		width: t.frame.width,
		splitByGrapheme: t.splitByGrapheme,
		left: t.frame.left / o,
		top: t.textTop / s,
		originX: "left",
		originY: "top",
		scaleX: 1 / o,
		scaleY: 1 / s
	}), e.initDimensions(), e.setCoords();
}
var ko = ({ group: e, shape: t, text: n, layout: r, alignH: i, scaleX: a, scaleY: o, minSize: s, scaleEpsilon: c }) => {
	let l = Math.max(c, Math.abs(a) || 1), u = Math.max(c, Math.abs(o) || 1);
	e.set({
		width: r.width / l,
		height: r.height / u,
		dirty: !0
	}), Do({
		group: e,
		shape: t,
		width: r.width,
		height: r.height,
		scaleX: a,
		scaleY: o,
		minSize: s,
		scaleEpsilon: c
	}), Oo({
		text: n,
		layout: r,
		alignH: i,
		scaleX: a,
		scaleY: o,
		scaleEpsilon: c
	});
};
//#endregion
//#region src/editor/shape-manager/scaling/shape-scaling-canvas-move.ts
function Ao({ canvas: e, context: t, currentScale: n }) {
	let { constraintPadding: r, event: i, group: a, state: o, text: s } = t;
	if (!(o.canScaleWidth && bo({
		canvas: e,
		event: i,
		group: a,
		state: o,
		axis: "x"
	}))) return {
		didClamp: !1,
		scaleX: n.scaleX
	};
	let c = Ta({
		text: s,
		padding: r,
		resolvePaddingForWidth: ({ width: e }) => G({
			group: a,
			width: e,
			height: Math.max(1, o.startHeight * n.scaleY)
		})
	}), l = Math.max(1 / o.startWidth, c / o.startWidth), u = o.lastAllowedScaleX > l + W;
	return {
		didClamp: u,
		scaleX: u ? l : n.scaleX
	};
}
function jo({ canvas: e, context: t, scaleX: n, scaleY: r }) {
	let { constraintPadding: i, event: a, group: o, state: s, text: c } = t;
	if (!(s.canScaleHeight && bo({
		canvas: e,
		event: a,
		group: o,
		state: s,
		axis: "y"
	}))) return {
		didClamp: !1,
		minimumHeight: null,
		scaleY: r,
		shouldRestoreBlockedAttempt: !1
	};
	if (!s.canScaleWidth && s.cannotScaleDownAtStart) return {
		didClamp: !1,
		minimumHeight: null,
		scaleY: r,
		shouldRestoreBlockedAttempt: !0
	};
	let l = s.fixedWidthMinimumTextFitHeight ?? io({
		group: o,
		text: c,
		width: Math.max(1, s.startWidth * n),
		padding: i,
		measurementCache: s.previewTextMeasurementCache
	}), u = Math.max(1 / s.startHeight, l / s.startHeight), d = s.lastAllowedScaleY > u + W;
	return {
		didClamp: d,
		minimumHeight: l,
		scaleY: d ? u : r,
		shouldRestoreBlockedAttempt: !1
	};
}
function Mo({ canvas: e, context: t }) {
	let { event: n, group: r, state: i, text: a } = t, o = yo({
		group: r,
		state: i
	}), s = i.canScaleWidth && bo({
		canvas: e,
		event: n,
		group: r,
		state: i,
		axis: "x"
	}), c = i.canScaleHeight && bo({
		canvas: e,
		event: n,
		group: r,
		state: i,
		axis: "y"
	});
	if (!s && !c) return { action: "ignore" };
	let l = ro({
		group: r,
		text: a,
		state: i
	});
	return Math.abs(o.scaleX - l.scale) > 1e-4 || Math.abs(o.scaleY - l.scale) > 1e-4 ? {
		action: "apply",
		didClampWidth: !1,
		minimumHeight: l.minimumHeight,
		scale: {
			scaleX: l.scale,
			scaleY: l.scale
		}
	} : { action: "ignore" };
}
function No({ canvas: e, context: t }) {
	let { group: n, state: r } = t, i = yo({
		group: n,
		state: r
	}), a = Ao({
		canvas: e,
		context: t,
		currentScale: i
	}), o = jo({
		canvas: e,
		context: t,
		scaleX: a.scaleX,
		scaleY: i.scaleY
	});
	if (o.shouldRestoreBlockedAttempt) return { action: "restore-blocked" };
	let s = Math.abs(n.scaleX ?? r.startScaleX) || r.startScaleX, c = Math.abs(n.scaleY ?? r.startScaleY) || r.startScaleY, l = !r.canScaleWidth && Math.abs(s - i.scaleX) > 1e-4 || !r.canScaleHeight && Math.abs(c - i.scaleY) > 1e-4;
	return !a.didClamp && !o.didClamp && !l ? { action: "ignore" } : {
		action: "apply",
		didClampWidth: a.didClamp,
		minimumHeight: o.minimumHeight,
		scale: {
			scaleX: a.scaleX,
			scaleY: o.scaleY
		}
	};
}
function Po({ canvas: e, context: t }) {
	return t.state.isProportionalScaling ? Mo({
		canvas: e,
		context: t
	}) : No({
		canvas: e,
		context: t
	});
}
//#endregion
//#region src/editor/shape-manager/scaling/shape-scaling-commit-plan.ts
function Fo({ group: e, state: t }) {
	let n = t?.startWidth ?? Math.max(1, e.shapeBaseWidth ?? e.width ?? e.shapeManualBaseWidth ?? 1);
	return {
		height: t?.startHeight ?? Math.max(1, e.shapeBaseHeight ?? e.height ?? e.shapeManualBaseHeight ?? 1),
		width: n
	};
}
function Io({ event: e, group: t, scale: n, startSize: r, state: i }) {
	let a = e.transform ? U({ transform: e.transform }) : null, o = i?.canScaleWidth ?? a?.canScaleWidth ?? Math.abs(n.scaleX - 1) > 1e-4, s = i?.canScaleHeight ?? a?.canScaleHeight ?? Math.abs(n.scaleY - 1) > 1e-4, c = i?.startManualBaseWidth ?? Math.max(1, t.shapeManualBaseWidth ?? r.width), l = i?.startManualBaseHeight ?? Math.max(1, t.shapeManualBaseHeight ?? r.height);
	return {
		alignH: t.shapeAlignHorizontal ?? "center",
		alignV: t.shapeAlignVertical ?? "middle",
		constraintPadding: G({ group: t }),
		currentScale: n,
		startDimensions: {
			startWidth: r.width,
			startHeight: r.height,
			startManualBaseWidth: c,
			startManualBaseHeight: l,
			canScaleWidth: o,
			canScaleHeight: s
		}
	};
}
function Lo({ canvas: e, context: t, event: n, group: r, initialScale: i, state: a, text: o }) {
	let s = bo({
		canvas: e,
		event: n,
		group: r,
		state: a,
		axis: "x"
	}), c = bo({
		canvas: e,
		event: n,
		group: r,
		state: a,
		axis: "y"
	});
	if (!s && !c) return i;
	let l = ro({
		group: r,
		text: o,
		state: a
	});
	return t.currentScale.scaleX < l.scale - 1e-4 || t.currentScale.scaleY < l.scale - 1e-4 ? {
		scaleX: l.scale,
		scaleY: l.scale
	} : i;
}
function Ro({ canvas: e, context: t, event: n, group: r, initialScale: i, state: a, text: o }) {
	let { constraintPadding: s, startDimensions: c } = t, { scaleX: l, scaleY: u } = i, d = Ta({
		text: o,
		padding: s,
		resolvePaddingForWidth: ({ width: e }) => G({
			group: r,
			width: e,
			height: Math.max(1, c.startHeight * u)
		})
	});
	xo({
		canvas: e,
		event: n,
		group: r,
		minimumWidth: d,
		state: a
	}) && (l = Math.max(1 / c.startWidth, d / c.startWidth));
	let f = io({
		group: r,
		text: o,
		width: Math.max(1, c.startWidth * l),
		padding: s
	});
	return So({
		canvas: e,
		event: n,
		group: r,
		minimumHeight: f,
		state: a
	}) && (u = Math.max(1 / c.startHeight, f / c.startHeight)), {
		scaleX: l,
		scaleY: u
	};
}
function zo({ canvas: e, context: t, event: n, group: r, state: i, text: a }) {
	let o = {
		scaleX: i?.lastAllowedScaleX ?? t.currentScale.scaleX,
		scaleY: i?.lastAllowedScaleY ?? t.currentScale.scaleY
	};
	return i?.isProportionalScaling ? Lo({
		canvas: e,
		context: t,
		event: n,
		group: r,
		initialScale: o,
		state: i,
		text: a
	}) : Ro({
		canvas: e,
		context: t,
		event: n,
		group: r,
		initialScale: o,
		state: i,
		text: a
	});
}
function Bo({ canvas: e, event: t, group: n, scale: r, startSize: i, state: a, text: o }) {
	let s = Io({
		event: t,
		group: n,
		scale: r,
		startSize: i,
		state: a
	}), c = zo({
		canvas: e,
		context: s,
		event: t,
		group: n,
		state: a,
		text: o
	}), l = Ja({
		isProportionalScaling: a?.isProportionalScaling,
		startTextSplitByGrapheme: a?.startTextSplitByGrapheme
	}), u = go({
		group: n,
		text: o,
		constraintPadding: s.constraintPadding,
		startDimensions: s.startDimensions,
		scaleX: c.scaleX,
		scaleY: c.scaleY,
		wrapPolicy: l
	});
	return {
		alignH: s.alignH,
		alignV: s.alignV,
		dimensions: u,
		startDimensions: s.startDimensions,
		wrapPolicy: l
	};
}
//#endregion
//#region src/editor/shape-manager/scaling/active-selection-geometry.ts
var Vo = 1e-9;
function Ho(e) {
	return Math.abs(e) <= Vo;
}
function Uo({ group: e }) {
	return [
		(e.scaleX ?? 1) - 1,
		(e.scaleY ?? 1) - 1,
		e.skewX ?? 0,
		e.skewY ?? 0
	].every(Ho) && !e.flipX && !e.flipY;
}
function Wo({ selection: e }) {
	return [e.skewX ?? 0, e.skewY ?? 0].every(Ho) && !e.flipX && !e.flipY;
}
function Go({ selection: e }) {
	let t = e.getCenterPoint(), n = e.width * Math.abs(e.scaleX ?? 1), r = e.height * Math.abs(e.scaleY ?? 1);
	if (!Number.isFinite(n) || !Number.isFinite(r) || n <= 0 || r <= 0) throw Error("Размер восстановленной рамки общего выделения должен быть положительным и конечным");
	if (!Number.isFinite(t.x) || !Number.isFinite(t.y)) throw Error("Центр восстановленной рамки общего выделения должен состоять из конечных координат");
	return {
		center: t,
		height: r,
		transformState: {
			angle: e.angle ?? 0,
			flipX: !!e.flipX,
			flipY: !!e.flipY,
			scaleX: 1,
			scaleY: 1,
			skewX: e.skewX ?? 0,
			skewY: e.skewY ?? 0
		},
		width: n
	};
}
function Ko({ group: e, selection: t }) {
	let n = e.angle ?? 0;
	if (Ho(n) || !Uo({ group: e }) || !Wo({ selection: t })) return null;
	let r = e.getRelativeCenterPoint();
	if (!Number.isFinite(n)) throw Error("Угол повёрнутого шейпа должен быть конечным");
	if (!Number.isFinite(r.x) || !Number.isFinite(r.y)) throw Error("Центр повёрнутого шейпа должен состоять из конечных координат");
	return {
		angle: n,
		center: r
	};
}
function qo({ geometry: e, group: t, selection: n }) {
	let r = n.calcTransformMatrix(), i = e.center.transform(r), a = (n.angle ?? 0) + e.angle, o = C.composeMatrix({
		angle: a,
		translateX: i.x,
		translateY: i.y
	}), s = C.multiplyTransformMatrices(C.invertTransform(r), o);
	if (!Number.isFinite(i.x) || !Number.isFinite(i.y)) throw Error("Итоговый центр повёрнутого шейпа должен состоять из конечных координат");
	if (!s.every(Number.isFinite)) throw Error("Компенсирующая матрица повёрнутого шейпа должна состоять из конечных значений");
	C.applyTransformToObject(t, s), t.setCoords();
}
function Jo({ target: e }) {
	let t = [
		e.getPositionByOrigin("left", "top"),
		e.getPositionByOrigin("right", "top"),
		e.getPositionByOrigin("right", "bottom"),
		e.getPositionByOrigin("left", "bottom")
	], n = t.map(({ x: e }) => e), r = t.map(({ y: e }) => e);
	return Object.freeze({
		bottom: Math.max(...r),
		left: Math.min(...n),
		right: Math.max(...n),
		top: Math.min(...r)
	});
}
function Yo({ current: e, next: t }) {
	return Object.freeze({
		bottom: Math.max(e.bottom, t.bottom),
		left: Math.min(e.left, t.left),
		right: Math.max(e.right, t.right),
		top: Math.min(e.top, t.top)
	});
}
function Xo({ selectionBounds: e, shapeBounds: t }) {
	let n = Math.max(0, t.top - e.top), r = Math.max(0, e.bottom - t.bottom), i = n <= qa, a = r <= qa;
	return i && !a ? "top" : a && !i ? "bottom" : Math.abs(n - r) <= .5 ? "center" : n < r ? "top" : "bottom";
}
function Zo({ origin: e }) {
	return e === "left" || e === "top" ? -.5 : e === "right" || e === "bottom" ? .5 : e === "center" ? 0 : e - .5;
}
function Qo({ bounds: e, group: t, transformOriginPointX: n, transformOriginX: r, verticalAttachment: i }) {
	if (i === "top") {
		t.setPositionByOrigin(new p(n, e.top), r, "top");
		return;
	}
	if (i === "bottom") {
		t.setPositionByOrigin(new p(n, e.bottom), r, "bottom");
		return;
	}
	t.setPositionByOrigin(new p(n, (e.top + e.bottom) / 2), r, "center");
}
function $o({ scaleX: e, scaleY: t, selection: n, transform: r }) {
	let i = Math.abs(n.scaleX ?? 1) || 1, a = Math.abs(n.scaleY ?? 1) || 1;
	if (!(Math.abs(i - e) > 1e-4 || Math.abs(a - t) > 1e-4)) return;
	let o = Va({ value: r.originX }), s = Ha({ value: r.originY }), c = o !== null && s !== null ? n.getPositionByOrigin(o, s) : null;
	n.set({
		flipX: !1,
		flipY: !1,
		scaleX: e,
		scaleY: t
	}), c && o !== null && s !== null && n.setPositionByOrigin(c, o, s), n.setCoords();
}
//#endregion
//#region src/editor/shape-manager/scaling/active-selection-scale-commit.ts
function es({ group: e, scaleX: t, scaleY: n, state: r, transform: i }) {
	let a = i ? U({ transform: i }) : null;
	return {
		...r ?? fo({
			group: e,
			transform: i
		}),
		canScaleWidth: r?.canScaleWidth ?? a?.canScaleWidth ?? Math.abs(t - 1) > 1e-4,
		canScaleHeight: r?.canScaleHeight ?? a?.canScaleHeight ?? Math.abs(n - 1) > 1e-4
	};
}
function ts({ group: e, layoutScale: t, scaleX: n, scaleY: r, state: i, transform: a }) {
	let { shape: o, text: s } = I({ group: e });
	if (!o || !s) return !1;
	let c = es({
		group: e,
		scaleX: n,
		scaleY: r,
		state: i,
		transform: a
	}), l = G({ group: e }), u = Ja({
		isProportionalScaling: i?.isProportionalScaling,
		startTextSplitByGrapheme: i?.startTextSplitByGrapheme
	}), d = go({
		group: e,
		text: s,
		constraintPadding: l,
		startDimensions: c,
		scaleX: t?.scaleX ?? n,
		scaleY: t?.scaleY ?? r,
		wrapPolicy: u
	});
	return !d.hasDimensionChange && !i && !t ? !1 : (vo({
		group: e,
		shape: o,
		text: s,
		width: d.width,
		height: d.height,
		alignH: e.shapeAlignHorizontal ?? "center",
		alignV: e.shapeAlignVertical ?? "middle",
		startManualBaseWidth: c.startManualBaseWidth,
		startManualBaseHeight: c.startManualBaseHeight,
		canScaleWidth: c.canScaleWidth,
		canScaleHeight: c.canScaleHeight,
		hasWidthChange: d.hasWidthChange,
		wrapPolicy: u
	}), d.hasDimensionChange || !!(i || t));
}
//#endregion
//#region src/editor/shape-manager/scaling/active-selection-scale-domain-geometry.ts
function ns({ anchor: e, scale: t, value: n }) {
	return e + (n - e) * t;
}
function rs({ attachment: e, bounds: t }) {
	return Object.freeze(e === "top" ? {
		offset: -.5,
		value: t.top
	} : e === "bottom" ? {
		offset: .5,
		value: t.bottom
	} : {
		offset: 0,
		value: (t.top + t.bottom) / 2
	});
}
function is({ bounds: e, fixedAnchor: t, layout: n, multipliers: r, target: i, transformOriginPointX: a, transformOriginX: o, verticalAttachment: s }) {
	let c = Zo({ origin: o }), l = ns({
		anchor: t.x,
		scale: r.x,
		value: a
	}), u = rs({
		attachment: s,
		bounds: e
	}), d = ns({
		anchor: t.y,
		scale: r.y,
		value: u.value
	}), f = Object.freeze({
		x: l - c * n.width,
		y: d - u.offset * n.height
	});
	return Object.freeze({
		bounds: Object.freeze({
			bottom: f.y + n.height / 2,
			centerX: f.x,
			centerY: f.y,
			left: f.x - n.width / 2,
			right: f.x + n.width / 2,
			top: f.y - n.height / 2
		}),
		center: f,
		target: i
	});
}
function as({ child: e, frame: t, group: n, layout: r, measurement: i, shape: a, text: o }) {
	if (Math.min(t.scaleX, t.scaleY) <= 0) throw Error("Компенсируемая рамка шейпа должна иметь положительный масштаб");
	ko({
		alignH: n.shapeAlignHorizontal ?? "center",
		group: n,
		layout: r,
		minSize: 1,
		scaleEpsilon: W,
		scaleX: i.multipliers.x,
		scaleY: i.multipliers.y,
		shape: a,
		text: o
	}), n.set({
		scaleX: i.multipliers.x / t.scaleX,
		scaleY: i.multipliers.y / t.scaleY
	}), n.setPositionByOrigin(new p((e.center.x - t.center.x) / t.scaleX, (e.center.y - t.center.y) / t.scaleY), "center", "center"), n.setCoords();
}
//#endregion
//#region src/editor/shape-manager/scaling/active-selection-scale-constraints.ts
function os({ originX: e, selectionBounds: t, shapeBounds: n }) {
	let r = Zo({ origin: e });
	if (r > 0) return Math.max(1, n.right - t.left);
	if (r < 0) return Math.max(1, t.right - n.left);
	let i = (n.left + n.right) / 2;
	return Math.max(1, 2 * Math.min(i - t.left, t.right - i));
}
function ss({ selectionBounds: e, shapeBounds: t, verticalAttachment: n }) {
	if (n === "top") return Math.max(1, e.bottom - t.top);
	if (n === "bottom") return Math.max(1, t.bottom - e.top);
	let r = (t.top + t.bottom) / 2;
	return Math.max(1, 2 * Math.min(r - e.top, e.bottom - r));
}
function cs({ layoutMinimumScale: e, limits: t, selectionBounds: n, shapeBounds: r, transformOriginX: i, verticalAttachment: a }) {
	return {
		availableHeight: ss({
			selectionBounds: n,
			shapeBounds: r,
			verticalAttachment: a
		}),
		availableWidth: os({
			originX: i,
			selectionBounds: n,
			shapeBounds: r
		}),
		canScaleHeight: t.canScaleHeight,
		canScaleWidth: t.canScaleWidth,
		minimumHeight: t.canScaleHeight ? Math.max(1, t.startHeight * e) : t.startHeight,
		minimumWidth: t.canScaleWidth ? Math.max(1, t.startWidth * e) : t.startWidth
	};
}
function ls({ allowGrowth: e, minimumSize: t, startSize: n }) {
	let r = Math.max(1 / n, t / n);
	return e ? r : Math.min(1, r);
}
function us({ allowGrowthX: e, allowGrowthY: t, constraints: n, requestedScale: r }) {
	let i = r;
	for (let a of n) {
		let n = a.canScaleWidth ? ls({
			allowGrowth: e,
			minimumSize: a.minimumWidth,
			startSize: a.availableWidth
		}) : r, o = a.canScaleHeight ? ls({
			allowGrowth: t,
			minimumSize: a.minimumHeight,
			startSize: a.availableHeight
		}) : r;
		i = Math.max(i, n, o);
	}
	return i;
}
//#endregion
//#region src/editor/shape-manager/scaling/active-selection-scaling-controller.ts
function ds({ selection: e }) {
	let [t, ...n] = e.getObjects();
	if (!t) throw Error("Сессия скейлинга шейпов требует непустое общее выделение");
	let r = Jo({ target: t });
	for (let e of n) r = Yo({
		current: r,
		next: Jo({ target: e })
	});
	return r;
}
function fs({ items: e, selection: t, selectionBounds: n, transformOriginX: r, transformOriginY: i }) {
	let a = /* @__PURE__ */ new Map();
	for (let { group: o } of e) {
		let e = Jo({ target: o }), s = o.getPositionByOrigin(r, i);
		a.set(o, {
			bounds: e,
			rotatedGeometry: Ko({
				group: o,
				selection: t
			}),
			transformOriginX: r,
			transformOriginPointX: s.x,
			verticalAttachment: Xo({
				selectionBounds: n,
				shapeBounds: e
			})
		});
	}
	return a;
}
function ps({ bounds: e, transformOriginX: t, transformOriginY: n }) {
	return Object.freeze({
		x: (e.left + e.right) / 2 + Zo({ origin: t }) * (e.right - e.left),
		y: (e.top + e.bottom) / 2 + Zo({ origin: n }) * (e.bottom - e.top)
	});
}
var ms = class {
	constructor({ canvas: e, shapeScalingState: t }) {
		this.canvas = e, this.shapeScalingState = t, this.scalingState = /* @__PURE__ */ new WeakMap(), this.scalingSessions = /* @__PURE__ */ new WeakMap(), this.groupLayoutScales = /* @__PURE__ */ new WeakMap(), this.domainPlans = /* @__PURE__ */ new WeakMap();
	}
	handleScalingPreview({ selection: e, transform: t, event: n }) {
		if (!t) return;
		let { canScaleWidth: r, canScaleHeight: i } = U({ transform: t });
		if (!r && !i) return;
		let a = this._collectPreviewItems({
			selection: e,
			transform: t
		});
		if (!a.length) return;
		let o = this._resolveScalingPreview({
			event: n,
			items: a,
			selection: e,
			transform: t
		});
		$o({
			selection: e,
			transform: t,
			scaleX: o.selectionScale.scaleX,
			scaleY: o.selectionScale.scaleY
		}), this.scalingState.set(e, o.selectionScale);
		for (let t of o.items) this._applyShapeScalingPreviewItem({
			item: t,
			preview: o,
			selection: e
		});
		e.setCoords(), this.canvas.requestRenderAll();
	}
	beginDomainScaling({ selection: e, transform: t }) {
		let n = this._collectPreviewItems({
			selection: e,
			transform: t
		});
		return n.length === 0 ? !1 : (this._ensureScalingSession({
			items: n,
			selection: e,
			transform: t
		}), !0);
	}
	measureDomainScale({ mode: e, multipliers: t, selection: n, transform: r }) {
		let i = this._collectPreviewItems({
			selection: n,
			transform: r
		});
		if (i.length === 0) throw Error("Доменное измерение требует хотя бы один шейп");
		let a = this._resolveScalingPreview({
			items: i,
			mode: e,
			multipliers: t,
			selection: n,
			transform: r
		}), o = Object.freeze(i.map((e) => this._resolveDomainChildPlan({
			item: e,
			preview: a
		}))), s = Object.freeze({
			children: Object.freeze(o.map((e) => this._createDomainChildMeasurement({
				child: e,
				preview: a
			}))),
			multipliers: Object.freeze({
				x: a.selectionScale.scaleX,
				y: a.selectionScale.scaleY
			})
		});
		return this.domainPlans.set(s, Object.freeze({
			children: o,
			preview: a
		})), s;
	}
	applyDomainScale({ children: e, frame: t, measurement: n, selection: r }) {
		let i = this._getDomainPlan({
			measurement: n,
			selection: r
		});
		if (e.length !== i.children.length) throw Error("Применение должно содержать все измеренные шейпы");
		i.children.map((t, n) => {
			let r = e[n];
			if (!r || r.target !== t.item.group) throw Error("Порядок применяемых шейпов должен совпадать с измерением");
			return {
				child: r,
				childPlan: t
			};
		}).forEach(({ child: e, childPlan: r }) => {
			this._applyDomainChildPlan({
				child: e,
				childPlan: r,
				frame: t,
				measurement: n
			});
		});
	}
	confirmDomainScale({ measurement: e, selection: t }) {
		let n = this._getDomainPlan({
			measurement: e,
			selection: t
		});
		this._confirmDomainPlan({
			measurement: e,
			plan: n,
			selection: t
		});
	}
	_resolveScalingPreview({ event: e, items: t, mode: n, multipliers: r, selection: i, transform: a }) {
		let o = this._ensureScalingSession({
			selection: i,
			transform: a,
			items: t
		}), { isCornerScaleAction: s } = U({ transform: a }), c = !!(e && "shiftKey" in e && e.shiftKey), l = n ? n === "uniform" : s && !c, u = r?.x ?? (Math.abs(i.scaleX ?? 1) || 1), d = r?.y ?? (Math.abs(i.scaleY ?? 1) || 1), f = l && (u < .9999 || d < .9999) ? this._resolveProportionalLayoutResults({ items: t }) : null, p = this._resolveSelectionScale({
			items: t,
			isProportionalCornerScale: l,
			proportionalLayoutResults: f,
			scaleX: u,
			scaleY: d,
			session: o,
			transform: a
		});
		return {
			isProportionalCornerScale: l,
			items: t,
			proportionalLayoutResults: f,
			selectionScale: this._resolveSelectionScaleAtPointerBoundary({
				event: e,
				isProportionalCornerScale: l,
				items: t,
				selection: i,
				selectionScale: p,
				session: o,
				transform: a
			}),
			session: o
		};
	}
	_applyShapeScalingPreviewItem({ item: e, preview: t, selection: n }) {
		let { group: r, shape: i, state: a, text: o } = e, s = t.session.items.get(r);
		if (!s) throw Error("Для шейпа должно существовать состояние текущей сессии скейлинга");
		a.isProportionalScaling = t.isProportionalCornerScale;
		let { layoutScale: c, minimumHeight: l } = this._resolveShapePreviewDimensions({
			item: e,
			preview: t
		}), u = uo({
			appliedScaleX: c.scaleX,
			appliedScaleY: c.scaleY,
			group: r,
			minimumHeight: l,
			state: a,
			text: o
		});
		ko({
			alignH: r.shapeAlignHorizontal ?? "center",
			group: r,
			layout: u,
			minSize: 1,
			scaleEpsilon: W,
			scaleX: s.rotatedGeometry ? 1 : t.selectionScale.scaleX,
			scaleY: s.rotatedGeometry ? 1 : t.selectionScale.scaleY,
			shape: i,
			text: o
		}), this.groupLayoutScales.set(r, c), this._positionShapeInSelection({
			group: r,
			selection: n,
			sessionItem: s
		}), r.setCoords();
	}
	_resolveShapePreviewDimensions({ item: e, preview: t }) {
		let { constraintPadding: n, group: r, state: i, text: a } = e, o = t.proportionalLayoutResults?.get(r);
		if (o) {
			let e = Math.max(t.selectionScale.scaleX, o.minimumScale);
			return {
				layoutScale: {
					scaleX: i.canScaleWidth ? e : 1,
					scaleY: i.canScaleHeight ? e : 1
				},
				minimumHeight: o.minimumHeight
			};
		}
		let s = this._resolveShapeLayoutScale({
			item: e,
			selectionScale: t.selectionScale
		});
		return {
			layoutScale: s,
			minimumHeight: lo({
				appliedScaleX: s.scaleX,
				appliedScaleY: s.scaleY,
				constraintPadding: n,
				group: r,
				measurementCache: i.previewTextMeasurementCache,
				startDimensions: i,
				text: a,
				wrapPolicy: Ja({
					isProportionalScaling: i.isProportionalScaling,
					startTextSplitByGrapheme: i.startTextSplitByGrapheme
				})
			}).previewHeight
		};
	}
	_resolveDomainChildPlan({ item: e, preview: t }) {
		let n = {
			...e,
			state: {
				...e.state,
				isProportionalScaling: t.isProportionalCornerScale
			}
		}, { layoutScale: r, minimumHeight: i } = this._resolveShapePreviewDimensions({
			item: n,
			preview: t
		}), a = uo({
			appliedScaleX: r.scaleX,
			appliedScaleY: r.scaleY,
			group: n.group,
			minimumHeight: i,
			state: n.state,
			text: n.text
		});
		return Object.freeze({
			isProportionalScaling: t.isProportionalCornerScale,
			item: e,
			layout: a,
			layoutScale: r
		});
	}
	_createDomainChildMeasurement({ child: e, preview: t }) {
		let n = t.session.items.get(e.item.group);
		if (!n || n.rotatedGeometry) throw Error("Смешанное измерение поддерживает только прямой канонический шейп");
		return is({
			...n,
			fixedAnchor: t.session.fixedAnchor,
			layout: e.layout,
			multipliers: {
				x: t.selectionScale.scaleX,
				y: t.selectionScale.scaleY
			},
			target: e.item.group
		});
	}
	_applyDomainChildPlan({ child: e, childPlan: t, frame: n, measurement: r }) {
		let { group: i, shape: a, text: o } = t.item;
		as({
			child: e,
			frame: n,
			group: i,
			layout: t.layout,
			measurement: r,
			shape: a,
			text: o
		});
	}
	_getDomainPlan({ measurement: e, selection: t }) {
		let n = this.domainPlans.get(e);
		if (!n || n.preview.session !== this.scalingSessions.get(t)) throw Error("Применению шейпов должно предшествовать измерение той же сессии");
		return n;
	}
	_confirmDomainPlan({ measurement: e, plan: t, selection: n }) {
		for (let e of t.children) e.item.state.isProportionalScaling = e.isProportionalScaling, this.groupLayoutScales.set(e.item.group, e.layoutScale);
		this.scalingState.set(n, {
			scaleX: e.multipliers.x,
			scaleY: e.multipliers.y
		});
	}
	commitGroupScaling({ group: e, scaleX: t, scaleY: n, transform: r }) {
		let i = this.materializeGroupScaling({
			group: e,
			scaleX: t,
			scaleY: n,
			transform: r
		});
		return this._clearGroupScalingState({ group: e }), i;
	}
	materializeGroupScaling({ group: e, scaleX: t, scaleY: n, transform: r }) {
		return ts({
			group: e,
			layoutScale: this.groupLayoutScales.get(e),
			scaleX: t,
			scaleY: n,
			state: this.shapeScalingState.get(e),
			transform: r
		});
	}
	_clearGroupScalingState({ group: e }) {
		this.shapeScalingState.delete(e), this.groupLayoutScales.delete(e), e.shapeScalingNoopTransform = !1;
	}
	resolveCommittedScale({ selection: e }) {
		let t = this.scalingState.get(e), n = this.scalingSessions.get(e), r = !!(n && Array.from(n.items.values()).some((e) => !!e.rotatedGeometry));
		return t ? {
			preserveSceneGeometryOnCommit: r,
			scaleX: t.scaleX,
			scaleY: t.scaleY
		} : {
			preserveSceneGeometryOnCommit: r,
			scaleX: Math.abs(e.scaleX ?? 1) || 1,
			scaleY: Math.abs(e.scaleY ?? 1) || 1
		};
	}
	clearState({ selection: e }) {
		let t = this.scalingSessions.get(e);
		if (t) for (let e of t.items.keys()) this.groupLayoutScales.delete(e);
		this.scalingSessions.delete(e), this.scalingState.delete(e);
	}
	_collectPreviewItems({ selection: e, transform: t }) {
		let n = [];
		for (let r of e.getObjects()) {
			if (!L(r)) continue;
			let { shape: e, text: i } = I({ group: r });
			if (!e || !i) continue;
			let a = G({ group: r }), o = ho({
				scalingState: this.shapeScalingState,
				group: r,
				text: i,
				constraintPadding: a,
				transform: t
			});
			n.push({
				group: r,
				shape: e,
				text: i,
				constraintPadding: a,
				state: o
			});
		}
		return n;
	}
	_ensureScalingSession({ selection: e, transform: t, items: n }) {
		let r = this.scalingSessions.get(e);
		if (r) return r;
		let i = Va({ value: t.originX }) ?? "center", a = Ha({ value: t.originY }) ?? "center", o = ds({ selection: e }), s = {
			bounds: o,
			fixedAnchor: ps({
				bounds: o,
				transformOriginX: i,
				transformOriginY: a
			}),
			items: fs({
				items: n,
				selection: e,
				selectionBounds: o,
				transformOriginX: i,
				transformOriginY: a
			})
		};
		return this.scalingSessions.set(e, s), s;
	}
	_resolveSelectionScale({ items: e, isProportionalCornerScale: t, session: n, transform: r, proportionalLayoutResults: i, scaleX: a, scaleY: o }) {
		let { canScaleWidth: s, canScaleHeight: c } = U({ transform: r });
		if (t) {
			let t = Math.max(a, o);
			if (!i) return {
				scaleX: t,
				scaleY: t
			};
			let r = this._resolveProportionalSelectionScale({
				items: e,
				session: n,
				proportionalLayoutResults: i,
				scale: t,
				allowGrowthX: c,
				allowGrowthY: s
			});
			return {
				scaleX: r,
				scaleY: r
			};
		}
		return this._resolveFreeSelectionScale({
			canScaleHeight: c,
			canScaleWidth: s,
			items: e,
			scaleX: a,
			scaleY: o,
			session: n
		});
	}
	_resolveFreeSelectionScale({ canScaleHeight: e, canScaleWidth: t, items: n, scaleX: r, scaleY: i, session: a }) {
		let o = r, s = i;
		return t && (o = this._resolveSelectionScaleX({
			items: n,
			session: a,
			scaleX: r,
			scaleY: s,
			allowGrowth: e
		})), e && (s = this._resolveSelectionScaleY({
			items: n,
			session: a,
			scaleX: o,
			scaleY: i,
			allowGrowth: t
		})), t && e && (o = this._resolveSelectionScaleX({
			items: n,
			session: a,
			scaleX: r,
			scaleY: s,
			allowGrowth: e
		}), s = this._resolveSelectionScaleY({
			items: n,
			session: a,
			scaleX: o,
			scaleY: i,
			allowGrowth: t
		})), {
			scaleX: o,
			scaleY: s
		};
	}
	_resolveProportionalSelectionScale({ items: e, session: t, proportionalLayoutResults: n, scale: r, allowGrowthX: i, allowGrowthY: a }) {
		return us({
			allowGrowthX: i,
			allowGrowthY: a,
			constraints: e.map((e) => {
				let r = t.items.get(e.group), i = n.get(e.group);
				if (!r || !i) throw Error("Для шейпа должны быть рассчитаны ограничения текущей сессии");
				return cs({
					layoutMinimumScale: i.minimumScale,
					limits: e.state,
					selectionBounds: t.bounds,
					shapeBounds: r.bounds,
					transformOriginX: r.transformOriginX,
					verticalAttachment: r.verticalAttachment
				});
			}),
			requestedScale: r
		});
	}
	_resolveSelectionScaleAtPointerBoundary({ isProportionalCornerScale: e, selection: t, items: n, session: r, transform: i, selectionScale: a, event: o }) {
		let { canScaleWidth: s, canScaleHeight: c } = U({ transform: i });
		if (e) return a;
		let l = s && this._hasPointerReachedSelectionScaleOrigin({
			selection: t,
			transform: i,
			event: o,
			axis: "x"
		}), u = c && this._hasPointerReachedSelectionScaleOrigin({
			selection: t,
			transform: i,
			event: o,
			axis: "y"
		});
		if (!l && !u) return a;
		let d = a.scaleX, f = a.scaleY;
		return l && (d = 0), u && (f = 0), this._resolveSelectionScale({
			items: n,
			isProportionalCornerScale: e,
			session: r,
			transform: i,
			proportionalLayoutResults: null,
			scaleX: d,
			scaleY: f
		});
	}
	_resolveSelectionScaleX({ items: e, session: t, scaleX: n, scaleY: r, allowGrowth: i }) {
		let a = n;
		for (let n of e) {
			let e = t.items.get(n.group), o = ls({
				minimumSize: this._resolveMinimumShapeWidth({
					item: n,
					scaleY: r
				}),
				startSize: os({
					selectionBounds: t.bounds,
					shapeBounds: e.bounds,
					originX: e.transformOriginX
				}),
				allowGrowth: i
			});
			a = Math.max(a, o);
		}
		return a;
	}
	_resolveSelectionScaleY({ items: e, session: t, scaleX: n, scaleY: r, allowGrowth: i }) {
		let a = r;
		for (let o of e) {
			let e = t.items.get(o.group), s = this._resolveShapeLayoutScaleX({
				item: o,
				selectionScaleX: n,
				selectionScaleY: r
			}), c = ls({
				minimumSize: this._resolveMinimumShapeHeight({
					item: o,
					scaleX: s
				}),
				startSize: ss({
					selectionBounds: t.bounds,
					shapeBounds: e.bounds,
					verticalAttachment: e.verticalAttachment
				}),
				allowGrowth: i
			});
			a = Math.max(a, c);
		}
		return a;
	}
	_resolveShapeLayoutScale({ item: e, selectionScale: t }) {
		let n = this._resolveShapeLayoutScaleX({
			item: e,
			selectionScaleX: t.scaleX,
			selectionScaleY: t.scaleY
		}), r = this._resolveShapeLayoutScaleY({
			item: e,
			scaleX: n,
			selectionScaleY: t.scaleY
		});
		return n = this._resolveShapeLayoutScaleX({
			item: e,
			selectionScaleX: t.scaleX,
			selectionScaleY: r
		}), r = this._resolveShapeLayoutScaleY({
			item: e,
			scaleX: n,
			selectionScaleY: t.scaleY
		}), {
			scaleX: n,
			scaleY: r
		};
	}
	_resolveShapeLayoutScaleX({ item: e, selectionScaleX: t, selectionScaleY: n }) {
		let { state: r } = e;
		if (!r.canScaleWidth) return 1;
		let i = ls({
			minimumSize: this._resolveMinimumShapeWidth({
				item: e,
				scaleY: n
			}),
			startSize: r.startWidth,
			allowGrowth: r.canScaleHeight
		});
		return Math.max(t, i);
	}
	_resolveShapeLayoutScaleY({ item: e, scaleX: t, selectionScaleY: n }) {
		let { state: r } = e;
		if (!r.canScaleHeight) return 1;
		let i = ls({
			minimumSize: this._resolveMinimumShapeHeight({
				item: e,
				scaleX: t
			}),
			startSize: r.startHeight,
			allowGrowth: r.canScaleWidth
		});
		return Math.max(n, i);
	}
	_resolveProportionalLayoutResults({ items: e }) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) {
			let e = ro({
				group: n.group,
				text: n.text,
				state: n.state
			});
			t.set(n.group, {
				minimumScale: e.scale,
				minimumHeight: e.minimumHeight
			});
		}
		return t;
	}
	_resolveMinimumShapeWidth({ item: e, scaleY: t }) {
		let { group: n, text: r, constraintPadding: i, state: a } = e, o = Math.max(1, a.startHeight * t);
		return Ta({
			text: r,
			padding: i,
			measurementCache: a.previewTextMeasurementCache ?? void 0,
			resolvePaddingForWidth: ({ width: e }) => G({
				group: n,
				width: e,
				height: o
			})
		});
	}
	_resolveMinimumShapeHeight({ item: e, scaleX: t }) {
		let { group: n, text: r, constraintPadding: i, state: a } = e;
		return io({
			group: n,
			text: r,
			width: Math.max(1, a.startWidth * t),
			padding: i,
			measurementCache: a.previewTextMeasurementCache
		});
	}
	_positionShapeInSelection({ group: e, selection: t, sessionItem: n }) {
		let { bounds: r, rotatedGeometry: i, transformOriginX: a, transformOriginPointX: o, verticalAttachment: s } = n;
		if (i) {
			qo({
				geometry: i,
				group: e,
				selection: t
			});
			return;
		}
		Qo({
			bounds: r,
			group: e,
			transformOriginPointX: o,
			transformOriginX: a,
			verticalAttachment: s
		});
	}
	_hasPointerReachedSelectionScaleOrigin({ selection: e, transform: t, event: n, axis: r }) {
		let i = t, a = r === "x" ? i.signX : i.signY;
		if (typeof a != "number" || !Number.isFinite(a)) return !1;
		let o = Ua({
			target: e,
			transform: t,
			event: n,
			canvas: this.canvas
		});
		return o ? (r === "x" ? o.x : o.y) * a <= 0 : !1;
	}
};
//#endregion
//#region src/editor/shape-manager/scaling/shape-scaling-geometry-snapshot.ts
function hs({ object: e }) {
	return Object.freeze({
		height: e.height,
		originX: e.originX,
		originY: e.originY,
		transform: Object.freeze({ ...C.saveObjectTransform(e) }),
		width: e.width
	});
}
function gs({ object: e, snapshot: t }) {
	e.set({
		...t.transform,
		height: t.height,
		originX: t.originX,
		originY: t.originY,
		width: t.width,
		dirty: !0
	}), e.setCoords();
}
function _s({ group: e }) {
	return Object.freeze({
		shapeAlignHorizontal: e.shapeAlignHorizontal,
		shapeAlignVertical: e.shapeAlignVertical,
		shapeBaseHeight: e.shapeBaseHeight,
		shapeBaseWidth: e.shapeBaseWidth,
		shapeLayoutSignature: e.shapeLayoutSignature,
		shapeManualBaseHeight: e.shapeManualBaseHeight,
		shapeManualBaseWidth: e.shapeManualBaseWidth,
		shapePaddingBottom: e.shapePaddingBottom,
		shapePaddingLeft: e.shapePaddingLeft,
		shapePaddingRight: e.shapePaddingRight,
		shapePaddingTop: e.shapePaddingTop,
		shapeReplaceBoxHeight: e.shapeReplaceBoxHeight,
		shapeReplaceBoxWidth: e.shapeReplaceBoxWidth,
		shapeTextAutoExpand: e.shapeTextAutoExpand
	});
}
function vs({ shape: e }) {
	return e instanceof g ? Object.freeze({
		rx: e.rx,
		ry: e.ry
	}) : null;
}
function ys({ shape: e, snapshot: t }) {
	if (t) {
		if (!(e instanceof g)) throw Error("Скругление можно восстановить только для прямоугольного шейпа");
		e.set(t);
	}
}
function bs({ text: e }) {
	return Object.freeze({
		autoExpand: e.autoExpand,
		splitByGrapheme: e.splitByGrapheme,
		textAlign: e.textAlign
	});
}
function xs({ geometry: e, layout: t, text: n }) {
	n.set({
		autoExpand: t.autoExpand,
		splitByGrapheme: t.splitByGrapheme,
		textAlign: t.textAlign,
		width: e.width
	}), n.initDimensions(), gs({
		object: n,
		snapshot: e
	});
}
function Ss({ group: e }) {
	let { shape: t, text: n } = I({ group: e });
	if (!t || !n) throw Error("Снимок скейлинга требует полноценную композицию шейпа");
	return Object.freeze({
		group: e,
		groupGeometry: hs({ object: e }),
		groupLayout: _s({ group: e }),
		shape: t,
		shapeGeometry: hs({ object: t }),
		shapeRounding: vs({ shape: t }),
		text: n,
		textGeometry: hs({ object: n }),
		textLayout: bs({ text: n })
	});
}
function Cs({ snapshot: e }) {
	let t = [];
	try {
		e.group.set({ ...e.groupLayout });
	} catch (e) {
		t.push(e);
	}
	try {
		gs({
			object: e.shape,
			snapshot: e.shapeGeometry
		}), ys({
			shape: e.shape,
			snapshot: e.shapeRounding
		});
	} catch (e) {
		t.push(e);
	}
	try {
		xs({
			geometry: e.textGeometry,
			layout: e.textLayout,
			text: e.text
		});
	} catch (e) {
		t.push(e);
	}
	try {
		gs({
			object: e.group,
			snapshot: e.groupGeometry
		});
	} catch (e) {
		t.push(e);
	}
	let [n] = t;
	if (t.length > 0) throw n;
}
function ws({ snapshots: e }) {
	let t = [];
	for (let n = e.length - 1; n >= 0; --n) {
		let r = e[n];
		if (!r) {
			t.push(/* @__PURE__ */ Error("Каждому шейпу должен соответствовать снимок геометрии"));
			continue;
		}
		try {
			Cs({ snapshot: r });
		} catch (e) {
			t.push(e);
		}
	}
	let [n] = t;
	if (t.length > 0) throw n;
}
//#endregion
//#region src/editor/shape-manager/scaling/active-selection-scale-domain-source.ts
var Ts = 48, Es = class {
	constructor({ controller: e, selection: t, targets: n, transform: r }) {
		if (this.measurements = /* @__PURE__ */ new Map(), this.confirmedMeasurement = null, n.length === 0) throw Error("Смешанный состав должен содержать хотя бы один шейп");
		if (this.controller = e, this.selection = t, this.targets = Object.freeze([...n]), this.transform = r, this.confirmedGeometry = this._captureGeometry(), !e.beginDomainScaling({
			selection: t,
			transform: r
		})) throw Error("Поддерживаемые шейпы должны начать доменную сессию скейлинга");
	}
	measure({ mode: e, multipliers: t }) {
		let n = `${e}:${t.x}:${t.y}`, r = this.measurements.get(n);
		if (r) return r;
		let i = this.controller.measureDomainScale({
			mode: e,
			multipliers: t,
			selection: this.selection,
			transform: this.transform
		});
		if (this.measurements.set(n, i), this.measurements.size > Ts) {
			let e = this.measurements.keys().next().value;
			if (typeof e != "string") throw Error("Кеш измерений шейпов не должен быть пустым");
			this.measurements.delete(e);
		}
		return i;
	}
	apply({ children: e, frame: t, measurement: n }) {
		let r = this._captureGeometry();
		try {
			this.controller.applyDomainScale({
				children: e,
				frame: t,
				measurement: n,
				selection: this.selection
			});
		} catch (e) {
			try {
				this._restoreState({ snapshots: r });
			} catch {}
			throw e;
		}
	}
	confirmAppliedState({ measurement: e }) {
		let t = this._captureGeometry();
		this.controller.confirmDomainScale({
			measurement: e,
			selection: this.selection
		}), this.confirmedGeometry = t, this.confirmedMeasurement = e;
	}
	restoreConfirmedState() {
		this._restoreState({ snapshots: this.confirmedGeometry });
	}
	_captureGeometry() {
		return Object.freeze(this.targets.map((e) => Ss({ group: e })));
	}
	_restoreState({ snapshots: e }) {
		let t = !1, n;
		try {
			ws({ snapshots: e });
		} catch (e) {
			t = !0, n = e;
		}
		try {
			this._restoreConfirmedControllerState();
		} catch (e) {
			t || (n = e), t = !0;
		}
		if (t) throw n;
	}
	_restoreConfirmedControllerState() {
		this.confirmedMeasurement && this.controller.confirmDomainScale({
			measurement: this.confirmedMeasurement,
			selection: this.selection
		});
	}
};
//#endregion
//#region src/editor/shape-manager/scaling/shape-scaling-controller.ts
function Ds({ group: e, state: t, transform: n }) {
	return t.canScaleWidth && (e.scaleX ?? 1) < 0 || t.canScaleHeight && (e.scaleY ?? 1) < 0 || Ga({
		state: t,
		transform: n
	}) || Ka({
		state: t,
		transform: n
	});
}
function Os({ constraintState: e, scaleX: t, scaleY: n, state: r }) {
	return e.shouldHandleAsNoop ? {
		scaleX: r.startScaleX,
		scaleY: r.startScaleY
	} : e.shouldRestoreLastAllowedTransform ? {
		scaleX: r.lastAllowedScaleX,
		scaleY: r.lastAllowedScaleY
	} : {
		scaleX: e.clampedScaleX ?? t,
		scaleY: e.clampedScaleY ?? n
	};
}
function ks({ constraintState: e, state: t }) {
	return e.shouldHandleAsNoop ? t.startHeight : e.resolvedMinimumHeight !== null && e.resolvedMinimumHeight !== void 0 ? e.resolvedMinimumHeight : !t.canScaleWidth && t.canScaleHeight ? t.fixedWidthMinimumTextFitHeight : null;
}
function As({ alignH: e, alignV: t, group: n, startHeight: r, startWidth: i, state: a }) {
	let o = Math.max(1, n.shapeBaseWidth ?? n.width ?? i), s = Math.max(1, n.shapeBaseHeight ?? n.height ?? r);
	return {
		alignH: e ?? "center",
		alignV: t ?? "middle",
		height: s,
		internalShapeTextInset: to({
			group: n,
			width: o,
			height: s
		}),
		isFixedWidthVerticalScaling: !a.canScaleWidth && a.canScaleHeight,
		width: o,
		wrapPolicy: Ja({
			isProportionalScaling: a.isProportionalScaling,
			startTextSplitByGrapheme: a.startTextSplitByGrapheme
		})
	};
}
function js({ group: e, layout: t, shape: n, text: r, userPadding: i }) {
	let a = {
		group: e,
		shape: n,
		text: r,
		width: t.width,
		height: t.height,
		alignH: t.alignH,
		alignV: t.alignV,
		padding: i,
		wrapPolicy: t.wrapPolicy,
		internalShapeTextInset: t.internalShapeTextInset,
		resolveInternalShapeTextInset: ({ width: t, height: n }) => to({
			group: e,
			width: t,
			height: n
		})
	};
	if (t.isFixedWidthVerticalScaling) {
		Sa(a);
		return;
	}
	xa(a);
}
var Ms = class {
	constructor({ canvas: t }) {
		this.handleObjectScaling = (t) => {
			let { target: n, transform: r } = t;
			if (n instanceof e) {
				this.activeSelectionScalingController.handleScalingPreview({
					selection: n,
					transform: r,
					event: t.e
				});
				return;
			}
			if (!L(n)) return;
			let i = n, { shape: a, text: o } = I({ group: i });
			!a || !o || this._handleShapeScalingStep({
				event: t,
				group: i,
				shape: a,
				text: o
			});
		}, this.handleCanvasMouseMove = (t) => {
			let n = this.canvas._currentTransform;
			if (!n) return;
			let { target: r } = n;
			if (r instanceof e) {
				this.activeSelectionScalingController.handleScalingPreview({
					selection: r,
					transform: n,
					event: t.e
				});
				return;
			}
			if (!L(r)) return;
			let i = r, a = this.scalingState.get(i);
			if (!a) return;
			let { shape: o, text: s } = I({ group: i });
			if (!o || !s) return;
			let c = G({ group: i });
			if (!a.canScaleWidth && !a.canScaleHeight) return;
			let l = {
				constraintPadding: c,
				event: {
					...t,
					transform: n
				},
				group: i,
				shape: o,
				state: a,
				text: s
			}, u = Po({
				canvas: this.canvas,
				context: l
			});
			if (u.action !== "ignore") {
				if (u.action === "restore-blocked") {
					this._restoreBlockedScalingAttempt({
						group: i,
						shape: o,
						text: s,
						state: a
					});
					return;
				}
				this._applyCanvasMoveResolution({
					context: l,
					resolution: u
				});
			}
		}, this.handleObjectModified = (e) => {
			let { target: t } = e;
			if (!L(t)) return;
			let n = t, r = this.scalingState.get(n), i = Math.abs(n.scaleX ?? 1) || 1, a = Math.abs(n.scaleY ?? 1) || 1;
			if (!(Math.abs(i - 1) > 1e-4 || Math.abs(a - 1) > 1e-4) && !r) return;
			let o = Fo({
				group: n,
				state: r
			}), { shape: s, text: c } = I({ group: n });
			if (!s || !c) {
				r?.blockedScaleAttempt && (n.shapeScalingNoopTransform = !1), this.scalingState.delete(n);
				return;
			}
			if (r?.blockedScaleAttempt) {
				this._restoreBlockedShapeScaling({
					group: n,
					shape: s,
					startSize: o,
					state: r,
					text: c
				});
				return;
			}
			let l = Bo({
				canvas: this.canvas,
				event: e,
				group: n,
				scale: {
					scaleX: i,
					scaleY: a
				},
				startSize: o,
				state: r,
				text: c
			});
			if (!l.dimensions.hasDimensionChange && r) {
				this._restoreUnchangedShapeScaling({
					group: n,
					plan: l,
					shape: s,
					state: r,
					text: c
				});
				return;
			}
			this._applyShapeScalingCommit({
				group: n,
				plan: l,
				shape: s,
				state: r,
				text: c
			});
		}, this.canvas = t, this.scalingState = /* @__PURE__ */ new WeakMap(), this.activeSelectionScalingController = new ms({
			canvas: t,
			shapeScalingState: this.scalingState
		});
	}
	_handleShapeScalingStep({ event: e, group: t, shape: n, text: r }) {
		let { transform: i } = e, { constraintPadding: a, state: o } = this._prepareShapeScalingStep({
			event: e,
			group: t,
			text: r
		}), s = Object.freeze({
			flipX: !!t.flipX,
			flipY: !!t.flipY,
			left: t.left ?? 0,
			top: t.top ?? 0
		}), c = this._resolveScalingDecision({
			group: t,
			text: r,
			constraintPadding: a,
			state: o,
			transform: i
		});
		if (c.shouldHandleAsNoop) {
			this._restoreBlockedScalingAttempt({
				group: t,
				shape: n,
				text: r,
				state: o
			});
			return;
		}
		this._applyShapeScalingDecision({
			group: t,
			scalingDecision: c,
			shape: n,
			state: o,
			text: r
		}), this._finishShapeScalingStep({
			group: t,
			scalingDecision: c,
			snapshot: s,
			state: o
		});
	}
	_prepareShapeScalingStep({ event: e, group: t, text: n }) {
		t.set({
			centeredScaling: !1,
			lockScalingFlip: !0
		});
		let r = G({ group: t }), i = ho({
			constraintPadding: r,
			group: t,
			scalingState: this.scalingState,
			text: n,
			transform: e.transform
		}), a = i.canScaleWidth && i.canScaleHeight, o = !!(e.e && "shiftKey" in e.e && e.e.shiftKey);
		return i.isProportionalScaling = a && !o, To({
			canvas: this.canvas,
			event: e.e,
			group: t,
			state: i,
			transform: e.transform
		}), {
			constraintPadding: r,
			state: i
		};
	}
	_applyShapeScalingDecision({ forceTransform: e = !1, group: t, scalingDecision: n, shape: r, state: i, text: a }) {
		let o = uo({
			group: t,
			text: a,
			state: i,
			appliedScaleX: n.appliedScaleX,
			appliedScaleY: n.appliedScaleY,
			minimumHeight: n.previewHeight
		}), s = Math.abs(t.scaleX ?? i.startScaleX) || i.startScaleX, c = Math.abs(t.scaleY ?? i.startScaleY) || i.startScaleY;
		(e || n.shouldRestoreLastAllowedTransform || Math.abs(n.appliedScaleX - s) > 1e-4 || Math.abs(n.appliedScaleY - c) > 1e-4) && this._applyResolvedScalingState({
			group: t,
			state: i,
			shouldHandleAsNoop: !1,
			scaleX: n.appliedScaleX,
			scaleY: n.appliedScaleY
		}), ko({
			group: t,
			shape: r,
			text: a,
			layout: o,
			alignH: t.shapeAlignHorizontal ?? "center",
			scaleX: n.appliedScaleX,
			scaleY: n.appliedScaleY,
			minSize: 1,
			scaleEpsilon: W
		});
	}
	_finishShapeScalingStep({ group: e, scalingDecision: t, snapshot: n, state: r }) {
		this._restoreScalingAnchorPosition({
			group: e,
			state: r
		}), !t.shouldHandleAsNoop && !t.shouldRestoreLastAllowedTransform && this._storeLastAllowedTransform({
			group: e,
			state: r,
			scaleX: t.appliedScaleX,
			scaleY: t.appliedScaleY,
			currentLeft: n.left,
			currentTop: n.top,
			currentFlipX: n.flipX,
			currentFlipY: n.flipY
		}), this.canvas.requestRenderAll();
	}
	_resolveScalingDecision({ group: e, text: t, constraintPadding: n, state: r, transform: i }) {
		let { scaleX: a, scaleY: o } = yo({
			group: e,
			state: r
		});
		Ds({
			group: e,
			state: r,
			transform: i
		}) && (r.crossedOppositeCorner = !0);
		let s = co({
			group: e,
			text: t,
			constraintPadding: n,
			state: r,
			scaleX: a,
			scaleY: o
		}), c = Os({
			constraintState: s,
			scaleX: a,
			scaleY: o,
			state: r
		}), { previewHeight: l } = lo({
			group: e,
			text: t,
			constraintPadding: n,
			startDimensions: r,
			appliedScaleX: c.scaleX,
			appliedScaleY: c.scaleY,
			minimumHeight: ks({
				constraintState: s,
				state: r
			}),
			measurementCache: r.previewTextMeasurementCache
		});
		return {
			appliedScaleX: c.scaleX,
			appliedScaleY: c.scaleY,
			previewHeight: l,
			shouldHandleAsNoop: s.shouldHandleAsNoop,
			shouldRestoreLastAllowedTransform: s.shouldRestoreLastAllowedTransform
		};
	}
	_restoreBlockedScalingAttempt({ group: e, shape: t, text: n, state: r }) {
		let i = e.shapeAlignHorizontal ?? "center";
		this._applyResolvedScalingState({
			group: e,
			state: r,
			shouldHandleAsNoop: !0,
			scaleX: r.startScaleX,
			scaleY: r.startScaleY
		}), ko({
			group: e,
			shape: t,
			text: n,
			layout: uo({
				group: e,
				text: n,
				state: r,
				appliedScaleX: r.startScaleX,
				appliedScaleY: r.startScaleY,
				minimumHeight: r.startHeight
			}),
			alignH: i,
			scaleX: r.startScaleX,
			scaleY: r.startScaleY,
			minSize: 1,
			scaleEpsilon: W
		}), this._restoreScalingAnchorPosition({
			group: e,
			state: r
		}), this.canvas.requestRenderAll();
	}
	_applyResolvedScalingState({ group: e, state: t, shouldHandleAsNoop: n, scaleX: r, scaleY: i }) {
		t.blockedScaleAttempt = n, e.shapeScalingNoopTransform = n;
		let a = n ? t.startScaleX : r, o = n ? t.startScaleY : i, s = n ? t.startLeft : t.lastAllowedLeft, c = n ? t.startTop : t.lastAllowedTop;
		n && (t.lastAllowedScaleX = t.startScaleX, t.lastAllowedScaleY = t.startScaleY, t.lastAllowedLeft = t.startLeft, t.lastAllowedTop = t.startTop), e.set({
			flipX: t.lastAllowedFlipX,
			flipY: t.lastAllowedFlipY,
			scaleX: a,
			scaleY: o,
			left: s,
			top: c
		}), this._restoreScalingAnchorPosition({
			group: e,
			state: t
		});
	}
	_applyCanvasMoveResolution({ context: e, resolution: t }) {
		let { constraintPadding: n, group: r, shape: i, state: a, text: o } = e, s = !a.canScaleWidth && a.canScaleHeight ? a.fixedWidthMinimumTextFitHeight : null, c = t.didClampWidth ? null : t.minimumHeight ?? s, { previewHeight: l } = lo({
			group: r,
			text: o,
			constraintPadding: n,
			startDimensions: a,
			appliedScaleX: t.scale.scaleX,
			appliedScaleY: t.scale.scaleY,
			minimumHeight: c,
			measurementCache: a.previewTextMeasurementCache
		}), u = {
			appliedScaleX: t.scale.scaleX,
			appliedScaleY: t.scale.scaleY,
			previewHeight: l,
			shouldHandleAsNoop: !1,
			shouldRestoreLastAllowedTransform: !1
		};
		this._applyShapeScalingDecision({
			forceTransform: !0,
			group: r,
			scalingDecision: u,
			shape: i,
			state: a,
			text: o
		}), this._finishShapeScalingStep({
			group: r,
			scalingDecision: u,
			state: a,
			snapshot: {
				flipX: a.lastAllowedFlipX,
				flipY: a.lastAllowedFlipY,
				left: a.lastAllowedLeft,
				top: a.lastAllowedTop
			}
		});
	}
	_storeLastAllowedTransform({ group: e, state: t, scaleX: n, scaleY: r, currentLeft: i, currentTop: a, currentFlipX: o, currentFlipY: s }) {
		t.blockedScaleAttempt = !1, e.shapeScalingNoopTransform = !1, t.lastAllowedScaleX = Math.abs(n) || 1, t.lastAllowedScaleY = Math.abs(r) || 1, t.lastAllowedLeft = e.left ?? i, t.lastAllowedTop = e.top ?? a, t.lastAllowedFlipX = o, t.lastAllowedFlipY = s;
	}
	_restoreBlockedShapeScaling({ group: e, shape: t, startSize: n, state: r, text: i }) {
		this._restoreShapeStateWithoutResize({
			group: e,
			shape: t,
			text: i,
			state: r,
			startWidth: n.width,
			startHeight: n.height,
			alignH: e.shapeAlignHorizontal,
			alignV: e.shapeAlignVertical,
			userPadding: eo({ group: e })
		}), e.shapeScalingNoopTransform = !1, this.scalingState.delete(e), this.canvas.requestRenderAll();
	}
	_restoreUnchangedShapeScaling({ group: e, plan: t, shape: n, state: r, text: i }) {
		this._restoreShapeStateWithoutResize({
			group: e,
			shape: n,
			text: i,
			state: r,
			startWidth: t.startDimensions.startWidth,
			startHeight: t.startDimensions.startHeight,
			alignH: t.alignH,
			alignV: t.alignV,
			userPadding: eo({ group: e })
		}), this.scalingState.delete(e), this.canvas.requestRenderAll();
	}
	_applyShapeScalingCommit({ group: e, plan: t, shape: n, state: r, text: i }) {
		r && e.set({
			left: r.lastAllowedLeft,
			top: r.lastAllowedTop
		}), vo({
			group: e,
			shape: n,
			text: i,
			width: t.dimensions.width,
			height: t.dimensions.height,
			alignH: t.alignH,
			alignV: t.alignV,
			startManualBaseWidth: t.startDimensions.startManualBaseWidth,
			startManualBaseHeight: t.startDimensions.startManualBaseHeight,
			canScaleWidth: t.startDimensions.canScaleWidth,
			canScaleHeight: t.startDimensions.canScaleHeight,
			hasWidthChange: t.dimensions.hasWidthChange,
			wrapPolicy: t.wrapPolicy
		}), r && this._restoreScalingAnchorPosition({
			group: e,
			state: r
		}), e.setCoords(), i.setCoords(), n.setCoords(), this.scalingState.delete(e), e.shapeScalingNoopTransform = !1, this.canvas.requestRenderAll();
	}
	commitActiveSelectionGroupScaling({ group: e, scaleX: t, scaleY: n, transform: r }) {
		return this.activeSelectionScalingController.commitGroupScaling({
			group: e,
			scaleX: t,
			scaleY: n,
			transform: r
		});
	}
	materializeActiveSelectionGroupScaling({ group: e, scaleX: t, scaleY: n, transform: r }) {
		return this.activeSelectionScalingController.materializeGroupScaling({
			group: e,
			scaleX: t,
			scaleY: n,
			transform: r
		});
	}
	createActiveSelectionScaleDomainSource({ selection: e, targets: t, transform: n }) {
		return new Es({
			controller: this.activeSelectionScalingController,
			selection: e,
			targets: t,
			transform: n
		});
	}
	clearState({ group: e }) {
		this.scalingState.delete(e), e.shapeScalingNoopTransform = !1;
	}
	resolveActiveSelectionCommittedScale({ selection: e }) {
		return this.activeSelectionScalingController.resolveCommittedScale({ selection: e });
	}
	clearActiveSelectionState({ selection: e }) {
		this.activeSelectionScalingController.clearState({ selection: e });
	}
	_restoreScalingAnchorPosition({ group: e, state: t }) {
		let { scalingAnchorX: n, scalingAnchorY: r, scalingAnchorOriginX: i, scalingAnchorOriginY: a } = t;
		if (n === null || r === null || i === null || a === null) {
			e.setCoords();
			return;
		}
		e.setPositionByOrigin(new p(n, r), i, a), e.setCoords();
	}
	_restoreShapeStateWithoutResize({ group: e, shape: t, text: n, state: r, startWidth: i, startHeight: a, alignH: o, alignV: s, userPadding: c }) {
		js({
			group: e,
			layout: As({
				alignH: o,
				alignV: s,
				group: e,
				startHeight: a,
				startWidth: i,
				state: r
			}),
			shape: t,
			text: n,
			userPadding: c
		}), e.set({
			left: r.lastAllowedLeft,
			top: r.lastAllowedTop,
			flipX: r.lastAllowedFlipX,
			flipY: r.lastAllowedFlipY,
			scaleX: 1,
			scaleY: 1
		}), this._restoreScalingAnchorPosition({
			group: e,
			state: r
		});
	}
}, Ns = class {
	constructor({ canvas: e }) {
		this.handleMouseDown = (e) => {
			let { target: t, e: n, subTargets: r = [] } = e, i = ut({
				target: t,
				subTargets: r
			});
			if (!i) return;
			let { text: a } = I({ group: i });
			if (!a) return;
			let o = this.canvas.getActiveObject(), s = o === i;
			if (!(o === a && a.isEditing)) {
				if (!s) {
					a.isEditing || tt({ text: a });
					return;
				}
				n instanceof MouseEvent && (n.detail < 2 || this.enterTextEditing({ group: i }));
			}
		}, this.handleTextEditingEntered = (e) => {
			let { target: t } = e;
			if (!(t instanceof _)) return;
			let n = t, { group: r } = n;
			L(r) && (this._enterTextEditingInteractionMode({
				group: r,
				text: n
			}), this.canvas.requestRenderAll());
		}, this.handleTextEditingExited = (e) => {
			let { target: t } = e;
			if (!(t instanceof _)) return;
			let n = t, { group: r } = n;
			L(r) && (this._restoreTextEditingInteractionMode({
				group: r,
				text: n
			}), tt({ text: n }), this.canvas.getActiveObject() === n && this.canvas.setActiveObject(r), this.canvas.requestRenderAll());
		}, this.canvas = e, this.editingInteractionState = /* @__PURE__ */ new WeakMap(), this.editingTargetResolverState = void 0;
	}
	enterTextEditing({ group: e }) {
		let { text: t } = I({ group: e });
		if (t) {
			if (e.locked || t.locked) {
				tt({ text: t }), this.canvas.requestRenderAll();
				return;
			}
			this._enterTextEditingInteractionMode({
				group: e,
				text: t
			}), t.set({
				evented: !0,
				selectable: !0,
				lockMovementX: !0,
				lockMovementY: !0
			}), this.canvas.setActiveObject(t), t.isEditing || (t.enterEditing(), t.selectAll()), this.canvas.requestRenderAll();
		}
	}
	_enterTextEditingInteractionMode({ group: e, text: t }) {
		this.editingInteractionState.has(e) || this.editingInteractionState.set(e, {
			groupSelectable: e.selectable !== !1,
			groupEvented: e.evented !== !1,
			groupLockMovementX: !!e.lockMovementX,
			groupLockMovementY: !!e.lockMovementY,
			groupHoverCursor: e.hoverCursor,
			groupMoveCursor: e.moveCursor,
			textLockMovementX: !!t.lockMovementX,
			textLockMovementY: !!t.lockMovementY
		}), e.set({
			selectable: !1,
			evented: !0,
			lockMovementX: !0,
			lockMovementY: !0,
			hoverCursor: "text",
			moveCursor: "text"
		}), t.set({
			lockMovementX: !0,
			lockMovementY: !0
		}), this._installEditingTargetResolver({
			group: e,
			text: t
		}), e.setCoords(), t.setCoords();
	}
	_restoreTextEditingInteractionMode({ group: e, text: t }) {
		let n = this.editingInteractionState.get(e);
		n && (e.set({
			selectable: n.groupSelectable,
			evented: n.groupEvented,
			lockMovementX: n.groupLockMovementX,
			lockMovementY: n.groupLockMovementY,
			hoverCursor: n.groupHoverCursor,
			moveCursor: n.groupMoveCursor
		}), t.set({
			lockMovementX: n.textLockMovementX,
			lockMovementY: n.textLockMovementY
		}), this._restoreEditingTargetResolver(), this.editingInteractionState.delete(e), e.setCoords(), t.setCoords());
	}
	_installEditingTargetResolver({ group: e, text: t }) {
		let n = this.editingTargetResolverState;
		if (n?.group === e && n.text === t) return;
		this._restoreEditingTargetResolver();
		let r = this.canvas, i = r.findTarget.bind(r);
		r.findTarget = (n) => {
			let r = i(n);
			if (this.canvas.getActiveObject() !== t || !t.isEditing || r.target === t || ut({
				target: r.target,
				subTargets: r.subTargets
			}) !== e) return r;
			let a = r.subTargets.includes(t) ? r.subTargets : [t, ...r.subTargets];
			return {
				...r,
				target: t,
				currentTarget: t,
				subTargets: a,
				currentSubTargets: a
			};
		}, this.editingTargetResolverState = {
			group: e,
			text: t,
			findTarget: i
		};
	}
	_restoreEditingTargetResolver() {
		let e = this.editingTargetResolverState;
		if (!e) return;
		let t = this.canvas;
		t.findTarget = e.findTarget, this.editingTargetResolverState = void 0;
	}
}, K = 1e-9, Ps = Object.freeze({
	tl: Object.freeze({
		x: 0,
		y: 0
	}),
	tr: Object.freeze({
		x: 1,
		y: 0
	}),
	bl: Object.freeze({
		x: 0,
		y: 1
	}),
	br: Object.freeze({
		x: 1,
		y: 1
	}),
	ml: Object.freeze({
		x: 0,
		y: .5
	}),
	mr: Object.freeze({
		x: 1,
		y: .5
	}),
	mt: Object.freeze({
		x: .5,
		y: 0
	}),
	mb: Object.freeze({
		x: .5,
		y: 1
	})
}), Fs = Object.freeze([
	Object.freeze({
		axis: "x",
		edge: "left",
		extremum: "minimum"
	}),
	Object.freeze({
		axis: "x",
		edge: "right",
		extremum: "maximum"
	}),
	Object.freeze({
		axis: "y",
		edge: "top",
		extremum: "minimum"
	}),
	Object.freeze({
		axis: "y",
		edge: "bottom",
		extremum: "maximum"
	})
]), Is = Object.freeze(["multiplier-x"]), Ls = Object.freeze(["multiplier-y"]), Rs = Object.freeze(["multiplier-x", "multiplier-y"]), zs = Object.freeze(["uniform-multiplier"]), Bs = Object.freeze({
	"multiplier-x": "scale-x",
	"multiplier-y": "scale-y",
	"uniform-multiplier": "uniform-scale"
});
function Vs({ mode: e, multipliers: t }) {
	return Object.freeze(e === "horizontal" ? [t.x] : e === "vertical" ? [t.y] : e === "uniform" ? [t.x] : [t.x, t.y]);
}
function Hs({ projectionMode: e, effectiveValues: t }) {
	let [n, r] = t;
	if (!Number.isFinite(n)) throw Error("Rectangular scale values must contain a finite first multiplier");
	if (e === "horizontal") return Object.freeze({
		x: n,
		y: 1
	});
	if (e === "vertical") return Object.freeze({
		x: 1,
		y: n
	});
	if (e === "uniform") return Object.freeze({
		x: n,
		y: n
	});
	if (e === "free") {
		if (r !== void 0 && Number.isFinite(r)) return Object.freeze({
			x: n,
			y: r
		});
		throw Error("Free rectangular scale requires two finite multipliers");
	}
	throw Error(`Unsupported rectangular scale projection mode "${e}"`);
}
function Us({ point: e }) {
	return Object.freeze({
		x: e.x,
		y: e.y
	});
}
function Ws({ point: e }) {
	return Number.isFinite(e.x) && Number.isFinite(e.y);
}
function Gs({ origin: e, startName: t, endName: n }) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : e === t ? 0 : e === "center" ? .5 : e === n ? 1 : null;
}
function Ks({ transform: e }) {
	let t = Gs({
		origin: e.originX,
		startName: "left",
		endName: "right"
	}), n = Gs({
		origin: e.originY,
		startName: "top",
		endName: "bottom"
	});
	return t === null || n === null ? null : Object.freeze({
		x: t,
		y: n
	});
}
function qs(e) {
	return Object.prototype.hasOwnProperty.call(Ps, e);
}
function Js({ action: e, controlKey: t }) {
	return t === "ml" || t === "mr" ? e === "scaleX" : t === "mt" || t === "mb" ? e === "scaleY" : e === "scale";
}
function Ys({ controlKey: e, control: t, origin: n }) {
	let r = Math.abs(t.x - n.x), i = Math.abs(t.y - n.y);
	return (!(e !== "mt" && e !== "mb") || r > K) && (!(e !== "ml" && e !== "mr") || i > K);
}
function Xs({ target: e }) {
	try {
		let t = e.getCoords();
		if (t.length !== 4 || !t.every((e) => Ws({ point: e }))) return null;
		let [n, r, i, a] = t;
		return Object.freeze({
			topLeft: Us({ point: n }),
			topRight: Us({ point: r }),
			bottomRight: Us({ point: i }),
			bottomLeft: Us({ point: a })
		});
	} catch {
		return null;
	}
}
function Zs({ point: e, origin: t }) {
	return Object.freeze({
		x: e.x - t.x,
		y: e.y - t.y
	});
}
function Qs({ u: e, v: t }) {
	return e.x * t.y - e.y * t.x;
}
function $s({ topLeft: e, u: t, v: n, coordinates: r }) {
	return Object.freeze({
		x: e.x + r.x * t.x + r.y * n.x,
		y: e.y + r.x * t.y + r.y * n.y
	});
}
function ec({ corners: e }) {
	let t = [
		e.topLeft,
		e.topRight,
		e.bottomRight,
		e.bottomLeft
	], n = t.map(({ x: e }) => e), r = t.map(({ y: e }) => e), i = Math.min(...n), a = Math.max(...n), o = Math.min(...r), s = Math.max(...r);
	return Object.freeze({
		left: i,
		right: a,
		top: o,
		bottom: s,
		centerX: i + (a - i) / 2,
		centerY: o + (s - o) / 2
	});
}
function tc({ original: e }) {
	return Number.isFinite(e.scaleX) && Number.isFinite(e.scaleY) && e.scaleX > K && e.scaleY > K;
}
function nc({ transform: e, pointerStart: t, controlKey: n }) {
	return Js({
		action: e.action,
		controlKey: n
	}) && tc({ original: e.original }) && Ws({ point: t });
}
function rc({ transform: e, pointerStart: t }) {
	if (!qs(e.corner) || !nc({
		transform: e,
		pointerStart: t,
		controlKey: e.corner
	})) return null;
	let n = Ks({ transform: e }), r = Ps[e.corner];
	if (!n || !Ys({
		controlKey: e.corner,
		control: r,
		origin: n
	})) return null;
	let i = Xs({ target: e.target });
	if (!i) return null;
	let a = Zs({
		point: i.topRight,
		origin: i.topLeft
	}), o = Zs({
		point: i.bottomLeft,
		origin: i.topLeft
	});
	return Math.abs(Qs({
		u: a,
		v: o
	})) <= K ? null : Object.freeze({
		controlKey: e.corner,
		control: Us({ point: r }),
		origin: n,
		pointerStart: Us({ point: t }),
		fixedAnchor: $s({
			topLeft: i.topLeft,
			u: a,
			v: o,
			coordinates: n
		}),
		u: a,
		v: o,
		originalScales: Object.freeze({
			x: e.original.scaleX,
			y: e.original.scaleY
		}),
		baselineBounds: ec({ corners: i })
	});
}
function ic({ controlKey: e, mode: t }) {
	return e === "ml" || e === "mr" ? t === "horizontal" : e === "mt" || e === "mb" ? t === "vertical" : t === "free" || t === "uniform";
}
function ac({ projection: e, pointer: t }) {
	if (!Ws({ point: t })) return null;
	let n = t.x - e.pointerStart.x, r = t.y - e.pointerStart.y, i = Qs({
		u: e.u,
		v: e.v
	});
	return Math.abs(i) <= K ? null : Object.freeze({
		x: (n * e.v.y - r * e.v.x) / i,
		y: (e.u.x * r - e.u.y * n) / i
	});
}
function oc({ projection: e, pointerDelta: t }) {
	let n = e.control.x - e.origin.x, r = e.control.y - e.origin.y;
	return Object.freeze({
		x: Math.abs(n) > K ? (n + t.x) / n : 1,
		y: Math.abs(r) > K ? (r + t.y) / r : 1
	});
}
function sc({ vector: e }) {
	return Math.sqrt(e.x ** 2 + e.y ** 2);
}
function cc({ projection: e, pointerDelta: t }) {
	let n = e.control.x - e.origin.x, r = e.control.y - e.origin.y, i = n + t.x, a = r + t.y;
	if (n * i < 0 || r * a < 0) return null;
	let o = sc({ vector: e.u }), s = sc({ vector: e.v }), c = Math.abs(n) * o + Math.abs(r) * s;
	return c <= K ? null : (Math.abs(i) * o + Math.abs(a) * s) / c;
}
function lc({ projection: e, pointer: t, mode: n }) {
	if (!ic({
		controlKey: e.controlKey,
		mode: n
	})) return null;
	let r = ac({
		projection: e,
		pointer: t
	});
	if (!r) return null;
	if (n === "uniform") {
		let t = cc({
			projection: e,
			pointerDelta: r
		});
		return t === null ? null : Object.freeze({
			x: t,
			y: t
		});
	}
	let i = oc({
		projection: e,
		pointerDelta: r
	});
	return n === "horizontal" ? Object.freeze({
		x: i.x,
		y: 1
	}) : n === "vertical" ? Object.freeze({
		x: 1,
		y: i.y
	}) : i;
}
function uc({ bounds: e, edge: t }) {
	return t === "left" ? e.left : t === "right" ? e.right : t === "top" ? e.top : e.bottom;
}
function dc({ component: e, extremum: t }) {
	return t === "minimum" ? e >= 0 ? 0 : 1 : +(e >= 0);
}
function fc({ projection: e, descriptor: t }) {
	let n = t.axis === "x" ? e.u.x : e.u.y, r = t.axis === "x" ? e.v.x : e.v.y, i = dc({
		component: n,
		extremum: t.extremum
	}), a = dc({
		component: r,
		extremum: t.extremum
	});
	return Object.freeze({
		axis: t.axis,
		edge: t.edge,
		baselinePosition: uc({
			bounds: e.baselineBounds,
			edge: t.edge
		}),
		multiplierX: (i - e.origin.x) * n,
		multiplierY: (a - e.origin.y) * r
	});
}
function pc({ mode: e }) {
	return e === "horizontal" ? Is : e === "vertical" ? Ls : e === "free" ? Rs : zs;
}
function mc({ edge: e, mode: t }) {
	return Object.freeze(t === "horizontal" ? [e.multiplierX] : t === "vertical" ? [e.multiplierY] : t === "free" ? [e.multiplierX, e.multiplierY] : [e.multiplierX + e.multiplierY]);
}
function hc({ coefficients: e }) {
	return e.some((e) => Math.abs(e) > K);
}
function gc({ edge: e, mode: t }) {
	let n = mc({
		edge: e,
		mode: t
	});
	return hc({ coefficients: n }) ? Object.freeze({
		axis: e.axis,
		edge: e.edge,
		baselinePosition: e.baselinePosition,
		coefficients: n
	}) : null;
}
function _c({ projection: e, mode: t }) {
	if (!ic({
		controlKey: e.controlKey,
		mode: t
	})) return null;
	let n = Fs.map((t) => fc({
		projection: e,
		descriptor: t
	})).map((e) => gc({
		edge: e,
		mode: t
	})).filter((e) => e !== null), r = pc({ mode: t });
	return Object.freeze({
		mode: t,
		variables: r,
		baselineValues: Object.freeze(r.map(() => 1)),
		edges: Object.freeze(n)
	});
}
function vc({ projection: e, mode: t }) {
	let n = e.control.x - e.origin.x, r = e.control.y - e.origin.y, i = Math.abs(n) * sc({ vector: e.u }), a = Math.abs(r) * sc({ vector: e.v });
	if (t === "horizontal") return Object.freeze([i]);
	if (t === "vertical") return Object.freeze([a]);
	if (t === "free") return Object.freeze([i, a]);
	let o = {
		x: n * e.u.x + r * e.v.x,
		y: n * e.u.y + r * e.v.y
	};
	return Object.freeze([sc({ vector: o })]);
}
function yc({ projection: e, modeProjection: t }) {
	let n = t.variables.map((e) => Bs[e]);
	return Object.freeze({
		id: t.mode,
		projection: Object.freeze({
			variables: Object.freeze(n),
			baselineValues: Object.freeze([...t.baselineValues]),
			variableSceneWeights: vc({
				projection: e,
				mode: t.mode
			}),
			edges: Object.freeze(t.edges.map(({ edge: e, coefficients: t }) => Object.freeze({
				edge: e,
				coefficients: Object.freeze([...t])
			})))
		})
	});
}
function bc({ projection: e }) {
	let t = ["free", "uniform"];
	return (e.controlKey === "ml" || e.controlKey === "mr") && (t = ["horizontal"]), (e.controlKey === "mt" || e.controlKey === "mb") && (t = ["vertical"]), Object.freeze(t.map((t) => {
		let n = _c({
			projection: e,
			mode: t
		});
		if (!n) throw Error(`Rectangular scale projection is missing supported mode "${t}"`);
		return yc({
			projection: e,
			modeProjection: n
		});
	}));
}
function xc({ projectionModes: e }) {
	let t = /* @__PURE__ */ new Set();
	for (let { projection: n } of e) for (let e of n.edges) t.add(e.edge);
	if (t.size === 0) throw Error("Rectangular scale gesture must contain at least one moving edge");
	return Object.freeze([...t]);
}
//#endregion
//#region src/editor/shape-manager/scaling/shape-scale-stabilization.ts
var Sc = 1e-9;
function Cc({ value: e, name: t }) {
	if (!Number.isFinite(e) || e <= 0) throw RangeError(`${t} must be a positive finite number`);
}
function wc({ vector: e, name: t }) {
	let n = Math.sqrt(e.x ** 2 + e.y ** 2);
	return Cc({
		value: n,
		name: t
	}), n;
}
function Tc({ projection: e, mode: t }) {
	let n = _c({
		projection: e,
		mode: t
	});
	if (!n) throw Error(`Shape scale mode "${t}" is not supported by control "${e.controlKey}"`);
	if (n.edges.some(({ coefficients: e }) => e.length !== n.variables.length || e.some((e) => !Number.isFinite(e)))) throw Error("Shape scale mode projection contains invalid edge coefficients");
	return n;
}
function Ec({ modeProjection: e, protectedEdges: t }) {
	let n = new Set(t), r = /* @__PURE__ */ new Set();
	return e.edges.forEach(({ edge: t, coefficients: i }) => {
		n.has(t) && i.forEach((t, n) => {
			Math.abs(t) <= Sc || r.add(e.variables[n]);
		});
	}), r;
}
function Dc({ multiplier: e, initialLength: t }) {
	return Math.max(1, Math.round(t * e)) / t;
}
function Oc({ multiplier: e, width: t, height: n }) {
	let r = Dc({
		multiplier: e,
		initialLength: t
	}), i = Dc({
		multiplier: e,
		initialLength: n
	});
	return Math.abs(r - e) <= Math.abs(i - e) ? r : i;
}
function kc({ x: e, y: t }) {
	return Object.freeze({
		x: e,
		y: t
	});
}
function Ac({ variable: e, multiplier: t, initialLength: n, snappedVariables: r }) {
	return r.has(e) ? t : Dc({
		multiplier: t,
		initialLength: n
	});
}
function jc({ mode: e, multipliers: t, width: n, height: r, snappedVariables: i }) {
	return kc({
		x: e === "vertical" ? 1 : Ac({
			variable: "multiplier-x",
			multiplier: t.x,
			initialLength: n,
			snappedVariables: i
		}),
		y: e === "horizontal" ? 1 : Ac({
			variable: "multiplier-y",
			multiplier: t.y,
			initialLength: r,
			snappedVariables: i
		})
	});
}
function Mc({ multipliers: e, width: t, height: n, snappedVariables: r }) {
	if (e.x !== e.y) throw Error("Uniform Shape scale requires equal x and y multipliers");
	let i = r.has("uniform-multiplier") ? e.x : Oc({
		multiplier: e.x,
		width: t,
		height: n
	});
	return kc({
		x: i,
		y: i
	});
}
function Nc({ projection: e, mode: t, multipliers: n, protectedEdges: r }) {
	let i = wc({
		vector: e.u,
		name: "Shape scale initial width"
	}), a = wc({
		vector: e.v,
		name: "Shape scale initial height"
	});
	Cc({
		value: n.x,
		name: "Shape scale multiplier x"
	}), Cc({
		value: n.y,
		name: "Shape scale multiplier y"
	});
	let o = Ec({
		modeProjection: Tc({
			projection: e,
			mode: t
		}),
		protectedEdges: r
	});
	return t === "uniform" ? Mc({
		multipliers: n,
		width: i,
		height: a,
		snappedVariables: o
	}) : jc({
		mode: t,
		multipliers: n,
		width: i,
		height: a,
		snappedVariables: o
	});
}
//#endregion
//#region src/editor/shape-manager/scaling/shape-scale-interaction-controller.ts
var q = 1e-9;
function Pc(e) {
	if (!L(e) || e.group || e.flipX || e.flipY || e.locked || e.lockScalingX || e.lockScalingY) return !1;
	let t = e.skewX ?? 0, n = e.skewY ?? 0;
	return Number.isFinite(t) && Number.isFinite(n) && Math.abs(t) <= q && Math.abs(n) <= q;
}
function Fc({ event: e }) {
	let { transform: t } = e;
	if (!t || !Pc(t.target)) return null;
	let n = t.original?.scaleX, r = t.original?.scaleY;
	return typeof n != "number" || !Number.isFinite(n) || typeof r != "number" || !Number.isFinite(r) ? null : Object.freeze({
		target: t.target,
		transform: t,
		projectionTransform: Object.freeze({
			target: t.target,
			action: t.action,
			corner: t.corner,
			originX: t.originX,
			originY: t.originY,
			original: Object.freeze({
				scaleX: n,
				scaleY: r
			})
		})
	});
}
function Ic({ target: e, transform: t }) {
	return Object.freeze({
		angle: e.angle ?? 0,
		controlKey: t.corner,
		flipX: !!e.flipX,
		flipY: !!e.flipY,
		originX: t.originX,
		originY: t.originY,
		skewX: e.skewX ?? 0,
		skewY: e.skewY ?? 0
	});
}
function Lc({ projection: e, pointerEvent: t }) {
	return e.controlKey === "ml" || e.controlKey === "mr" ? "horizontal" : e.controlKey === "mt" || e.controlKey === "mb" ? "vertical" : "shiftKey" in t && t.shiftKey ? "free" : "uniform";
}
function Rc({ event: e }) {
	return Object.freeze({
		ctrlKey: "ctrlKey" in e && e.ctrlKey === !0,
		shiftKey: "shiftKey" in e && e.shiftKey === !0
	});
}
function zc({ plan: e }) {
	let t = /* @__PURE__ */ new Set();
	return e.constraints.x && t.add(e.constraints.x.candidate.edge), e.constraints.y && t.add(e.constraints.y.candidate.edge), Object.freeze([...t]);
}
function Bc({ constraint: e, bounds: t, epsilon: n }) {
	return e ? Math.abs(t[e.candidate.edge] - e.expectedPosition) <= n : !0;
}
function Vc({ session: e }) {
	let { target: t, protectedState: n } = e;
	return Math.abs((t.angle ?? 0) - n.angle) <= q && Math.abs((t.skewX ?? 0) - n.skewX) <= q && Math.abs((t.skewY ?? 0) - n.skewY) <= q && !!t.flipX === n.flipX && !!t.flipY === n.flipY && e.transform.corner === n.controlKey && e.transform.originX === n.originX && e.transform.originY === n.originY;
}
function Hc({ session: e, pointerEvent: t }) {
	let { controlKey: n } = e.projection;
	if (!(n === "ml" || n === "mr" || n === "mt" || n === "mb")) return !1;
	let r = e.target.canvas?.altActionKey;
	return r ? Reflect.get(t, r) === !0 : !1;
}
function Uc({ session: e, mode: t, multipliers: n }) {
	return Vc({ session: e }) ? t === "horizontal" ? Math.abs(n.y - 1) <= q : t === "vertical" ? Math.abs(n.x - 1) <= q : t === "uniform" ? Math.abs(n.x - n.y) <= q : !0 : !1;
}
var Wc = class {
	constructor({ editor: e, scalingController: t }) {
		this.session = null, this.editor = e, this.scalingController = t;
	}
	beginGesture(e) {
		this.finishGesture();
		let t = Fc({ event: e }), n = e.scenePoint ?? e.pointer;
		if (!t || !n) return !1;
		let r = this.editor.snappingManager.startRectangularScaleSnappingSession({
			pointerStart: n,
			transform: t.projectionTransform
		});
		if (!r) return !1;
		let { projection: i, runtime: a } = r;
		return this.session = Object.freeze({
			target: t.target,
			transform: t.transform,
			projection: i,
			snapping: a,
			protectedState: Ic({
				target: t.target,
				transform: t.transform
			})
		}), !0;
	}
	handleObjectScaling(e) {
		return this._handleScale({
			event: e,
			pointSource: "object-scaling"
		});
	}
	handleCanvasMouseMove(e) {
		return this._handleScale({
			event: e,
			pointSource: "mouse-move"
		});
	}
	finishGesture({ continueWithExistingScaling: e = !1 } = {}) {
		let { session: t } = this;
		if (!t) return;
		let n = t.snapping.finishSession();
		this.session = null, e || this.scalingController.clearState({ group: t.target }), n.didCleanup && this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] });
	}
	finishGestureForTarget({ target: e }) {
		return !this.session || this.session.target !== e ? !1 : (this.finishGesture(), !0);
	}
	interruptGesture({ event: e } = {}) {
		if (!this.session) return !1;
		try {
			this.editor.canvas.endCurrentTransform(e);
		} finally {
			this.finishGesture();
		}
		return !0;
	}
	destroy() {
		this.finishGesture();
	}
	_handleScale({ event: e, pointSource: t }) {
		let { session: n } = this;
		if (!n) return !1;
		let r = e.e;
		if (!r) return this._continueWithExistingScaling();
		if (n.snapping.getDuplicateStep({ marker: r })) return !0;
		if (!this._belongsToCurrentGesture({
			event: e,
			session: n
		})) return this._continueWithExistingScaling();
		if (Hc({
			session: n,
			pointerEvent: r
		})) return this._finishBeforeAnotherTransform();
		if (!Vc({ session: n })) return this._continueWithExistingScaling();
		let i = t === "object-scaling" ? e.pointer : e.scenePoint;
		if (!i) return this._continueWithExistingScaling();
		let a = Lc({
			projection: n.projection,
			pointerEvent: r
		}), o = lc({
			projection: n.projection,
			pointer: i,
			mode: a
		});
		return !o || o.x <= 0 || o.y <= 0 ? this._continueWithExistingScaling() : this._applyScale({
			event: e,
			pointerEvent: r,
			session: n,
			mode: a,
			rawMultipliers: o
		});
	}
	_belongsToCurrentGesture({ event: e, session: t }) {
		return !(e.transform && e.transform !== t.transform || e.target && e.target !== t.target);
	}
	_applyScale({ event: e, pointerEvent: t, session: n, mode: r, rawMultipliers: i }) {
		let a = n.snapping.resolveScalePlan({
			marker: t,
			intent: Object.freeze({
				projectionMode: r,
				values: Vs({
					mode: r,
					multipliers: i
				}),
				modifiers: Rc({ event: t })
			})
		});
		if (a.kind === "duplicate") return !0;
		try {
			let i = Hs({
				projectionMode: a.plan.projectionMode,
				effectiveValues: a.plan.effectiveValues
			}), o = Nc({
				projection: n.projection,
				mode: r,
				multipliers: i,
				protectedEdges: zc({ plan: a.plan })
			});
			this.editor.snappingManager.markScaleStepHandled({ marker: t }), this._applyScaleToShape({
				event: e,
				session: n,
				appliedMultipliers: o
			});
			let s = this._readAppliedGeometry({
				session: n,
				plan: a.plan,
				mode: r
			}), c = n.snapping.verifyScalePlan({
				token: a.token,
				finalGeometry: s
			});
			return this.editor.snappingManager.publishVerifiedScaleGuides({ guides: c.guides }), !0;
		} catch (e) {
			throw this.finishGesture(), e;
		}
	}
	_applyScaleToShape({ event: e, session: t, appliedMultipliers: n }) {
		let { target: r, transform: i, projection: a } = t, o = a.originalScales.x * n.x, s = a.originalScales.y * n.y;
		r.set({
			scaleX: o,
			scaleY: s
		}), i.scaleX = o, i.scaleY = s, r.setPositionByOrigin(new p(a.fixedAnchor.x, a.fixedAnchor.y), i.originX, i.originY), r.setCoords(), this.scalingController.handleObjectScaling({
			target: r,
			transform: i,
			e: e.e ?? void 0
		});
		let c = this._readAppliedMultipliers({ session: t });
		(Math.abs(c.x - 1) > q || Math.abs(c.y - 1) > q) && (i.actionPerformed = !0);
	}
	_readAppliedGeometry({ session: e, plan: t, mode: n }) {
		let r = z({ object: e.target });
		if (!r) throw Error("Shape must have exact bounds after scale");
		let i = this._readAppliedMultipliers({ session: e }), a = e.target.getPointByOrigin(e.transform.originX, e.transform.originY);
		return Object.freeze({
			bounds: r,
			fixedAnchor: Object.freeze({
				x: a.x,
				y: a.y
			}),
			measuredValues: Vs({
				mode: n,
				multipliers: i
			}),
			domainVerdict: Object.freeze({
				x: Bc({
					constraint: t.constraints.x,
					bounds: r,
					epsilon: t.verificationEpsilon
				}) ? "satisfied" : "blocked",
				y: Bc({
					constraint: t.constraints.y,
					bounds: r,
					epsilon: t.verificationEpsilon
				}) ? "satisfied" : "blocked",
				protectedState: Uc({
					session: e,
					mode: n,
					multipliers: i
				}) ? "preserved" : "changed"
			})
		});
	}
	_readAppliedMultipliers({ session: e }) {
		let { target: t, projection: n } = e;
		return Object.freeze({
			x: (t.scaleX ?? n.originalScales.x) / n.originalScales.x,
			y: (t.scaleY ?? n.originalScales.y) / n.originalScales.y
		});
	}
	_continueWithExistingScaling() {
		return this.finishGesture({ continueWithExistingScaling: !0 }), !1;
	}
	_finishBeforeAnotherTransform() {
		return this.finishGesture(), !0;
	}
}, Gc = 1e-4, Kc = class {
	constructor({ dependencies: t }) {
		this._handleObjectScaling = (e) => {
			this.dependencies.editor.selectionManager.handleShapeSelectionScaleStep({
				event: e,
				intentSource: "fabric-preview"
			}) || (this._beginResize({ event: e }), !this.scaleInteractionController.handleObjectScaling(e) && this.dependencies.scalingController.handleObjectScaling(e));
		}, this._handleObjectModified = (t) => {
			let n = this._collectShapeGroupsFromTarget({ target: t.target }), r = t.target instanceof e ? t.target : null;
			if (r && this.dependencies.editor.selectionManager.shouldSkipShapeSelectionScaleCommit({ selection: r })) return;
			let i = t.transform ? U({ transform: t.transform }) : null, a = !i || i.canScaleWidth || i.canScaleHeight;
			r && this._commitUnifiedShapeSelection({
				event: t,
				selection: r
			}) ? n.forEach((e) => {
				this.dependencies.scalingController.clearState({ group: e });
			}) : r && a ? (this._commitActiveSelectionShapeScaling({
				selection: r,
				transform: t.transform,
				usesUnifiedShapeCommit: !1
			}), n.forEach((e) => {
				this.dependencies.scalingController.clearState({ group: e });
			})) : a ? this.dependencies.scalingController.handleObjectModified(t) : r && this.dependencies.scalingController.clearActiveSelectionState({ selection: r }), n.forEach((e) => {
				this.dependencies.lifecycleController.finishResize({ group: e });
			});
		}, this._handleMouseMove = (e) => {
			if (!this.dependencies.editor.selectionManager.handleShapeSelectionScaleStep({
				event: e,
				intentSource: "pointer-projection"
			})) {
				if (this.scaleInteractionController.handleCanvasMouseMove(e)) {
					e.transform?.actionPerformed && this._beginResize({ event: e });
					return;
				}
				this.dependencies.scalingController.handleCanvasMouseMove(e);
			}
		}, this._handleMouseDown = (e) => {
			this._collectShapeGroupsFromTarget({
				target: e.target,
				subTargets: e.subTargets
			}).forEach((e) => {
				this.dependencies.lifecycleController.captureResizeStart({ group: e });
			}), this.scaleInteractionController.beginGesture(e), this.dependencies.editingController.handleMouseDown(e);
		}, this._handleScaleInteractionFinished = () => {
			this.scaleInteractionController.finishGesture(), this.dependencies.lifecycleController.clearResizeStarts();
		}, this._handleObjectRemoved = (e) => {
			let { target: t } = e;
			t && this.scaleInteractionController.finishGestureForTarget({ target: t }) && this.dependencies.lifecycleController.clearResizeStarts();
		}, this._handlePointerCancel = (e) => {
			this.scaleInteractionController.interruptGesture({ event: e }) && this.dependencies.lifecycleController.clearResizeStarts();
		}, this._handleWindowBlur = () => {
			this.scaleInteractionController.interruptGesture() && this.dependencies.lifecycleController.clearResizeStarts();
		}, this._handleTextEditingExited = (e) => {
			let t = null;
			if (e.target instanceof _) {
				let n = e.target, { group: r } = n;
				L(r) && (this.dependencies.editingPlacements.delete(r), t = {
					group: r,
					textNode: n
				});
			}
			this.dependencies.editingController.handleTextEditingExited(e), t && this.dependencies.lifecycleController.finishTextEditing(t);
		}, this._handleTextEditingEntered = (e) => {
			if (e.target instanceof _) {
				let { group: t } = e.target;
				L(t) && (nt({ group: t }), this.dependencies.lifecycleController.beginTextEditing({ group: t }), this.dependencies.editingPlacements.set(t, this.dependencies.editor.canvasManager.getObjectPlacement({ object: t })));
			}
			this.dependencies.editingController.handleTextEditingEntered(e);
		}, this._handleTextChanged = (e) => {
			if (!(e.target instanceof _)) return;
			let t = e.target;
			L(t.group) && (this.dependencies.editor.textManager.syncLineStylesWithText({ textbox: t }), this._syncShapeTextLayoutAfterTextMutation({ textNode: t }) && this.dependencies.editor.canvas.requestRenderAll());
		}, this._handleBeforeTextUpdated = (e) => {
			let { textbox: t, style: n } = e;
			if (!(t instanceof _)) return;
			let r = t, { group: i } = r;
			if (!L(i) || this.dependencies.textNodeController.isInternalUpdate({ textNode: r })) return;
			let a = this.dependencies.lifecycleController.beginTextUpdate({
				group: i,
				textNode: r,
				withoutSave: e.options.withoutSave
			});
			if (!this._syncShapeTextLayoutAfterTextMutation({
				textNode: r,
				textStyle: n
			})) {
				this.dependencies.lifecycleController.cancelTextUpdate({ textNode: r });
				return;
			}
			this.dependencies.lifecycleController.fireBefore({ lifecycle: a });
		}, this._handleTextUpdated = (e) => {
			let { textbox: t } = e;
			t instanceof _ && this.dependencies.lifecycleController.finishTextUpdate({ textNode: t });
		}, this.dependencies = t, this.scaleInteractionController = new Wc({
			editor: t.editor,
			scalingController: t.scalingController
		});
	}
	bind() {
		let { canvas: e } = this.dependencies.editor;
		e.on("object:scaling", this._handleObjectScaling), e.on("object:modified", this._handleObjectModified), e.on("mouse:move", this._handleMouseMove), e.on("mouse:down", this._handleMouseDown), e.on("mouse:up", this._handleScaleInteractionFinished), e.on("object:removed", this._handleObjectRemoved), e.on("selection:created", this._handleScaleInteractionFinished), e.on("selection:updated", this._handleScaleInteractionFinished), e.on("selection:cleared", this._handleScaleInteractionFinished), e.on("text:editing:entered", this._handleTextEditingEntered), e.on("text:editing:exited", this._handleTextEditingExited), e.on("text:changed", this._handleTextChanged), e.on("editor:before:text-updated", this._handleBeforeTextUpdated), e.on("editor:text-updated", this._handleTextUpdated), window.addEventListener("pointercancel", this._handlePointerCancel), window.addEventListener("touchcancel", this._handlePointerCancel), window.addEventListener("blur", this._handleWindowBlur);
	}
	destroy() {
		this.scaleInteractionController.destroy();
		let { canvas: e } = this.dependencies.editor;
		e.off("object:scaling", this._handleObjectScaling), e.off("object:modified", this._handleObjectModified), e.off("mouse:move", this._handleMouseMove), e.off("mouse:down", this._handleMouseDown), e.off("mouse:up", this._handleScaleInteractionFinished), e.off("object:removed", this._handleObjectRemoved), e.off("selection:created", this._handleScaleInteractionFinished), e.off("selection:updated", this._handleScaleInteractionFinished), e.off("selection:cleared", this._handleScaleInteractionFinished), e.off("text:editing:entered", this._handleTextEditingEntered), e.off("text:editing:exited", this._handleTextEditingExited), e.off("text:changed", this._handleTextChanged), e.off("editor:before:text-updated", this._handleBeforeTextUpdated), e.off("editor:text-updated", this._handleTextUpdated), window.removeEventListener("pointercancel", this._handlePointerCancel), window.removeEventListener("touchcancel", this._handlePointerCancel), window.removeEventListener("blur", this._handleWindowBlur);
	}
	_commitUnifiedShapeSelection({ event: e, selection: t }) {
		return this.dependencies.editor.selectionManager.commitShapeSelectionScale({
			selection: t,
			commit: (n) => {
				if (n === "fabric-transform") {
					this.dependencies.scalingController.clearActiveSelectionState({ selection: t });
					return;
				}
				this._commitActiveSelectionShapeScaling({
					selection: t,
					transform: e.transform,
					usesUnifiedShapeCommit: !0
				});
			}
		});
	}
	_beginResize({ event: e }) {
		this._collectShapeGroupsFromTarget({
			target: e.target,
			subTargets: e.subTargets
		}).forEach((e) => {
			this.dependencies.lifecycleController.beginResize({ group: e });
		});
	}
	_syncShapeTextLayoutAfterTextMutation({ textNode: e, textStyle: t }) {
		let { group: n } = e;
		if (!L(n)) return !1;
		let { shape: r, text: i } = I({ group: n });
		if (!r || !i) return !1;
		let { layoutController: a, editingPlacements: o, editor: s } = this.dependencies, c = o.get(n) ?? s.canvasManager.getObjectPlacement({ object: n });
		return nt({ group: n }), a.applyCurrentLayout({
			group: n,
			shape: r,
			text: i,
			placement: c,
			height: a.resolveManualDimensions({ group: n }).height,
			alignH: a.resolveShapeTextHorizontalAlign({
				group: n,
				textStyle: t
			})
		}), !0;
	}
	_collectShapeGroupsFromTarget({ target: t, subTargets: n = [] }) {
		let r = /* @__PURE__ */ new Set(), i = t ? [t, ...n] : n;
		for (let t = 0; t < i.length; t += 1) {
			let n = i[t], a = n instanceof e ? n.getObjects() : [n];
			for (let e = 0; e < a.length; e += 1) {
				let t = ut({ target: a[e] });
				t && r.add(t);
			}
		}
		return Array.from(r);
	}
	_commitActiveSelectionShapeScaling({ selection: e, transform: t, usesUnifiedShapeCommit: n }) {
		let r = e.getObjects(), i = r.filter((e) => L(e));
		if (!i.length) return;
		let { preserveSceneGeometryOnCommit: a, scaleX: o, scaleY: s } = this.dependencies.scalingController.resolveActiveSelectionCommittedScale({ selection: e });
		if (!(Math.abs(o - 1) > Gc || Math.abs(s - 1) > Gc) && !n) {
			this.dependencies.scalingController.clearActiveSelectionState({ selection: e });
			return;
		}
		if (!n) {
			this._commitLegacyActiveSelectionShapeScaling({
				objects: r,
				scaleX: o,
				scaleY: s,
				selection: e,
				shapeGroups: i,
				preserveSceneGeometryOnCommit: a,
				transform: t
			});
			return;
		}
		this._commitUnifiedActiveSelectionShapeScaling({
			objects: r,
			scaleX: o,
			scaleY: s,
			selection: e,
			shapeGroups: i,
			transform: t
		});
	}
	_commitUnifiedActiveSelectionShapeScaling({ objects: e, scaleX: t, scaleY: n, selection: r, shapeGroups: i, transform: a }) {
		let { canvas: o } = this.dependencies.editor, s = r.angle ?? 0, c = r.getCenterPoint();
		r.set({ angle: 0 }), r.setPositionByOrigin(c, "center", "center"), r.setCoords(), this._commitActiveSelectionShapesBeforeRestore({
			groups: i,
			scaleX: t,
			scaleY: n,
			selection: r,
			transform: a
		}), this._restoreActiveSelectionAfterCommit({
			center: c,
			objects: e,
			transformState: {
				angle: s,
				flipX: !1,
				flipY: !1,
				scaleX: 1,
				scaleY: 1,
				skewX: 0,
				skewY: 0
			}
		}), o.requestRenderAll();
	}
	_commitLegacyActiveSelectionShapeScaling({ objects: t, scaleX: n, scaleY: r, selection: i, shapeGroups: a, preserveSceneGeometryOnCommit: o, transform: s }) {
		let { canvas: c } = this.dependencies.editor;
		if (!o) {
			c.discardActiveObject(), this._commitActiveSelectionShapeGroups({
				groups: a,
				scaleX: n,
				scaleY: r,
				transform: s
			}), this.dependencies.scalingController.clearActiveSelectionState({ selection: i }), c.setActiveObject(new e(t, { canvas: c })), c.requestRenderAll();
			return;
		}
		let l = Go({ selection: i });
		this._commitActiveSelectionShapesBeforeRestore({
			groups: a,
			scaleX: n,
			scaleY: r,
			selection: i,
			transform: s
		});
		let u = this._captureChildSceneMatrices({ objects: t });
		this._restoreActiveSelectionAfterCommit({
			childSceneMatrices: u,
			center: l.center,
			frameSize: {
				height: l.height,
				width: l.width
			},
			objects: t,
			transformState: l.transformState
		}), c.requestRenderAll();
	}
	_commitActiveSelectionShapesBeforeRestore({ groups: e, scaleX: t, scaleY: n, selection: r, transform: i }) {
		this._discardActiveSelectionDuringCommit({
			selection: r,
			transform: i
		}), this._commitActiveSelectionShapeGroups({
			groups: e,
			scaleX: t,
			scaleY: n,
			transform: i
		}), this.dependencies.scalingController.clearActiveSelectionState({ selection: r });
	}
	_commitActiveSelectionShapeGroups({ groups: e, scaleX: t, scaleY: n, transform: r }) {
		let { canvasManager: i } = this.dependencies.editor;
		e.forEach((e) => {
			let a = i.getObjectPlacement({ object: e });
			this.dependencies.scalingController.commitActiveSelectionGroupScaling({
				group: e,
				scaleX: t,
				scaleY: n,
				transform: r
			}) && (i.applyObjectPlacement({
				object: e,
				placement: a
			}), e.setCoords());
		});
	}
	_discardActiveSelectionDuringCommit({ selection: e, transform: t }) {
		let { canvas: n } = this.dependencies.editor, r = Reflect.get(n, "_currentTransform"), i = r && r === t && t?.target === e;
		i && Reflect.set(n, "_currentTransform", null);
		try {
			n.discardActiveObject();
		} finally {
			i && Reflect.set(n, "_currentTransform", r);
		}
	}
	_captureChildSceneMatrices({ objects: e }) {
		return e.map((e) => {
			let t = [...e.calcTransformMatrix()];
			if (!t.every(Number.isFinite)) throw Error("Матрица дочернего объекта должна состоять из конечных значений");
			return t;
		});
	}
	_restoreActiveSelectionAfterCommit({ childSceneMatrices: t, center: n, frameSize: r, objects: i, transformState: a }) {
		let { canvas: o } = this.dependencies.editor;
		if (t && t.length !== i.length) throw Error("Количество сохранённых матриц должно совпадать с количеством дочерних объектов");
		let s = new e(i, { canvas: o });
		if (r && s.set(r), s.set(a), s.setPositionByOrigin(n, "center", "center"), t) {
			let e = C.invertTransform(s.calcTransformMatrix());
			i.forEach((n, r) => {
				let i = t[r];
				if (!i) throw Error("Для каждого дочернего объекта должна существовать сохранённая матрица");
				C.applyTransformToObject(n, C.multiplyTransformMatrices(e, i));
			});
		}
		s.setCoords(), t && i.forEach((e) => e.setCoords()), o.setActiveObject(s);
	}
}, qc = class {
	constructor({ editor: e }) {
		this.editor = e;
	}
	resolveAspectRatioFittedDimensions({ targetWidth: e, targetHeight: t, aspectWidth: n, aspectHeight: r }) {
		let i = Math.max(1, n), a = Math.max(1, r), o = e === void 0 ? void 0 : Math.max(1, e), s = t === void 0 ? void 0 : Math.max(1, t);
		if (o !== void 0 && s === void 0) return {
			width: o,
			height: o / i * a
		};
		if (o === void 0 && s !== void 0) return {
			width: s / a * i,
			height: s
		};
		if (o === void 0 || s === void 0) return {
			width: i,
			height: a
		};
		let c = Math.min(o / i, s / a);
		return {
			width: i * c,
			height: a * c
		};
	}
	resolveCurrentDimensions({ group: e }) {
		return {
			width: Math.max(1, (e.shapeBaseWidth ?? e.width ?? 1) * (Math.abs(e.scaleX ?? 1) || 1)),
			height: Math.max(1, (e.shapeBaseHeight ?? e.height ?? 1) * (Math.abs(e.scaleY ?? 1) || 1))
		};
	}
	resolveManualDimensions({ group: e }) {
		return {
			width: Math.max(1, e.shapeManualBaseWidth ?? e.shapeBaseWidth ?? e.width ?? 1),
			height: Math.max(1, e.shapeManualBaseHeight ?? e.shapeBaseHeight ?? e.height ?? 1)
		};
	}
	resolveReplaceBoxDimensions({ group: e }) {
		let t = this.resolveCurrentDimensions({ group: e });
		return {
			width: Math.max(1, e.shapeReplaceBoxWidth ?? t.width),
			height: Math.max(1, e.shapeReplaceBoxHeight ?? t.height)
		};
	}
	resolveGroupUserPadding({ group: e }) {
		return Ke({ padding: {
			top: e.shapePaddingTop,
			right: e.shapePaddingRight,
			bottom: e.shapePaddingBottom,
			left: e.shapePaddingLeft
		} });
	}
	resolveGroupInternalShapeTextInset({ group: e, width: t, height: n }) {
		let r = Le({ presetKey: e.shapePresetKey ?? "circle" });
		return Xe({
			baseInset: r ? Be({
				preset: r,
				width: t,
				height: n
			}) : void 0,
			stroke: e.shapeStroke,
			strokeWidth: e.shapeStrokeWidth
		});
	}
	isShapeTextAutoExpandEnabled({ group: e }) {
		return e.shapeTextAutoExpand !== !1;
	}
	resolveMontageAreaWidth() {
		let { canvasManager: e, montageArea: t } = this.editor;
		if (!t) return null;
		let { width: n } = e.getMontageAreaSceneBounds();
		return !Number.isFinite(n) || n <= 0 ? null : n;
	}
	resolveShapeLayoutWidth({ text: e, currentWidth: t, manualWidth: n, shapeTextAutoExpandEnabled: r, padding: i, resolvePaddingForWidth: a }) {
		return r ? this._resolveAutoExpandShapeWidth({
			text: e,
			currentWidth: t,
			minimumWidth: n,
			padding: i,
			resolvePaddingForWidth: a
		}) : Math.max(1, n);
	}
	resolveShapeTextHorizontalAlign({ group: e, textStyle: t }) {
		let n = t?.align;
		return n === "left" || n === "center" || n === "right" || n === "justify" ? n : e.shapeAlignHorizontal ?? "center";
	}
	applyCurrentLayout({ group: e, shape: t, text: n, placement: r, width: i, height: a, alignH: o, alignV: s, internalShapeTextInset: c, resolveInternalShapeTextInset: l, wrapPolicy: u, preserveAspectRatio: d, expandShapeHeightToFitText: f = !0, changedPadding: p }) {
		let m = this.resolveCurrentDimensions({ group: e }), h = this.resolveManualDimensions({ group: e }), g = this.resolveGroupUserPadding({ group: e }), _ = this.isShapeTextAutoExpandEnabled({ group: e }), v = l ?? (({ width: t, height: n }) => c ?? this.resolveGroupInternalShapeTextInset({
			group: e,
			width: t,
			height: n
		})), y = m.width;
		if (i !== void 0) y = Math.max(1, i);
		else {
			let e = Math.max(1, a ?? m.height);
			y = this.resolveShapeLayoutWidth({
				text: n,
				currentWidth: m.width,
				manualWidth: h.width,
				shapeTextAutoExpandEnabled: _,
				padding: Ye({
					base: v({
						width: y,
						height: e
					}),
					addition: g
				}),
				resolvePaddingForWidth: ({ width: t }) => Ye({
					base: v({
						width: t,
						height: e
					}),
					addition: g
				})
			});
		}
		let b = Math.max(1, a ?? m.height), x = v({
			width: y,
			height: b
		}), S = r ?? this.editor.canvasManager.getObjectPlacement({ object: e });
		xa({
			group: e,
			shape: t,
			text: n,
			width: y,
			height: b,
			alignH: o ?? e.shapeAlignHorizontal ?? "center",
			alignV: s ?? e.shapeAlignVertical ?? "middle",
			padding: g,
			wrapPolicy: u,
			shapeTextAutoExpandEnabled: _,
			internalShapeTextInset: x,
			resolveInternalShapeTextInset: v,
			preserveAspectRatio: d,
			montageAreaWidth: d ? this.resolveMontageAreaWidth() : void 0,
			expandShapeHeightToFitText: f,
			changedPadding: p
		}), this.editor.canvasManager.applyObjectPlacement({
			object: e,
			placement: S
		});
	}
	_resolveAutoExpandShapeWidth({ text: e, currentWidth: t, minimumWidth: n, padding: r, resolvePaddingForWidth: i }) {
		let a = this.resolveMontageAreaWidth();
		return a ? wa({
			text: e,
			currentWidth: t,
			minimumWidth: n,
			padding: r,
			montageAreaWidth: a,
			resolvePaddingForWidth: i
		}) : Math.max(1, t, n);
	}
}, Jc = class e {
	constructor({ canvas: e }) {
		this.canvas = e, this.textEditingSnapshots = /* @__PURE__ */ new WeakMap(), this.pendingTextUpdates = /* @__PURE__ */ new WeakMap(), this.resizeStartSnapshots = /* @__PURE__ */ new Map(), this.pendingResizeUpdates = /* @__PURE__ */ new WeakMap();
	}
	createContext({ group: t, source: n, target: r, presetKey: i, options: a, withoutSave: o }) {
		return this._createContextFromBefore({
			group: t,
			before: e.getSnapshot({ group: t }),
			source: n,
			target: r,
			presetKey: i,
			options: a,
			withoutSave: o
		});
	}
	fireBefore({ lifecycle: e }) {
		this.canvas.fire("editor:before:shape-updated", e.payload);
	}
	fireUpdated({ lifecycle: t, after: n }) {
		let r = n ?? e.getSnapshot({ group: t.payload.shape }), i = {
			...t.payload,
			before: t.before,
			after: r
		};
		return this.canvas.fire("editor:shape-updated", i), r;
	}
	beginTextEditing({ group: t }) {
		this.textEditingSnapshots.set(t, e.getSnapshot({ group: t }));
	}
	finishTextEditing({ group: t, textNode: n }) {
		let r = this.textEditingSnapshots.get(t);
		if (this.textEditingSnapshots.delete(t), !r) return null;
		let i = e.getSnapshot({ group: t });
		if (e.areSnapshotsEqual({
			before: r,
			after: i
		})) return null;
		let a = this._createContextFromBefore({
			group: t,
			before: r,
			source: "text-edit",
			target: n
		});
		return this.fireBefore({ lifecycle: a }), this.fireUpdated({
			lifecycle: a,
			after: i
		});
	}
	beginTextUpdate({ group: e, textNode: t, withoutSave: n }) {
		let r = this.createContext({
			group: e,
			source: "text-update",
			target: t,
			withoutSave: n
		});
		return this.pendingTextUpdates.set(t, r), r;
	}
	cancelTextUpdate({ textNode: e }) {
		this.pendingTextUpdates.delete(e);
	}
	finishTextUpdate({ textNode: e }) {
		let t = this.pendingTextUpdates.get(e);
		if (!t) return null;
		this.pendingTextUpdates.delete(e);
		let n = this.fireUpdated({ lifecycle: t }), { group: r } = e;
		return L(r) && this.textEditingSnapshots.has(r) && this.textEditingSnapshots.set(r, n), n;
	}
	captureResizeStart({ group: t }) {
		this.resizeStartSnapshots.has(t) || this.resizeStartSnapshots.set(t, e.getSnapshot({ group: t }));
	}
	beginResize({ group: t }) {
		if (this.pendingResizeUpdates.has(t)) return;
		let n = this.resizeStartSnapshots.get(t) ?? e.getSnapshot({ group: t });
		this.resizeStartSnapshots.delete(t), this.pendingResizeUpdates.set(t, this._createContextFromBefore({
			group: t,
			before: n,
			source: "resize",
			target: t
		}));
	}
	clearResizeStarts() {
		this.resizeStartSnapshots.clear();
	}
	cancelResize({ group: e }) {
		this.resizeStartSnapshots.delete(e), this.pendingResizeUpdates.delete(e);
	}
	finishResize({ group: t }) {
		let n = this.pendingResizeUpdates.get(t);
		if (!n) return null;
		this.pendingResizeUpdates.delete(t);
		let r = e.getSnapshot({ group: t });
		return e.areSnapshotsEqual({
			before: n.before,
			after: r
		}) ? null : (this.fireBefore({ lifecycle: n }), this.fireUpdated({
			lifecycle: n,
			after: r
		}));
	}
	static getSnapshot({ group: t }) {
		let { id: n, shapePresetKey: r, shapeBaseWidth: i, shapeBaseHeight: a, shapeManualBaseWidth: o, shapeManualBaseHeight: s, shapeTextAutoExpand: c, shapeAlignHorizontal: l, shapeAlignVertical: u, shapePaddingTop: d, shapePaddingRight: f, shapePaddingBottom: p, shapePaddingLeft: m, shapeFill: h, shapeStroke: g, shapeStrokeWidth: _, shapeStrokeDashArray: v, shapeOpacity: y, shapeRounding: b, left: x, top: S, originX: C, originY: w, angle: T, flipX: E, flipY: D, scaleX: O, scaleY: k } = t, { text: A } = I({ group: t });
		return {
			id: n,
			presetKey: r,
			baseWidth: i,
			baseHeight: a,
			manualBaseWidth: o,
			manualBaseHeight: s,
			currentWidth: Math.max(1, (i ?? t.width ?? 1) * (Math.abs(O ?? 1) || 1)),
			currentHeight: Math.max(1, (a ?? t.height ?? 1) * (Math.abs(k ?? 1) || 1)),
			shapeTextAutoExpand: c !== !1,
			alignH: l ?? "center",
			alignV: u ?? "middle",
			padding: {
				top: d ?? 0,
				right: f ?? 0,
				bottom: p ?? 0,
				left: m ?? 0
			},
			fill: h,
			stroke: g,
			strokeWidth: _,
			strokeDashArray: v ? v.slice() : v ?? null,
			opacity: y,
			rounding: b,
			left: x,
			top: S,
			originX: C,
			originY: w,
			angle: T,
			flipX: !!E,
			flipY: !!D,
			scaleX: O,
			scaleY: k,
			text: A ? e._getTextNodeSnapshot({ textNode: A }) : void 0
		};
	}
	static areSnapshotsEqual({ before: e, after: t }) {
		return JSON.stringify(e) === JSON.stringify(t);
	}
	_createContextFromBefore({ group: e, before: t, source: n, target: r, presetKey: i, options: a, withoutSave: o }) {
		return {
			before: t,
			payload: {
				shape: e,
				source: n,
				target: r,
				presetKey: i,
				options: a,
				withoutSave: o
			}
		};
	}
	static _getTextNodeSnapshot({ textNode: e }) {
		let t = e, n = ({ snapshot: e, entries: t }) => {
			Object.entries(t).forEach(([t, n]) => {
				n != null && (e[t] = n);
			});
		}, { id: r, text: i, textCaseRaw: a, uppercase: o, autoExpand: s, fontFamily: c, fontSize: l, fontWeight: u, fontStyle: d, underline: f, linethrough: p, textAlign: m, fill: h, stroke: g, strokeWidth: _, opacity: v, backgroundColor: y, backgroundOpacity: b, paddingTop: x, paddingRight: S, paddingBottom: C, paddingLeft: w, radiusTopLeft: T, radiusTopRight: E, radiusBottomRight: D, radiusBottomLeft: O, left: k, top: A, width: ee, height: te, angle: ne, scaleX: re, scaleY: ie } = t, ae = {
			id: r,
			uppercase: !!o,
			textAlign: m
		};
		return n({
			snapshot: ae,
			entries: {
				text: i,
				textCaseRaw: a,
				autoExpand: s,
				fontFamily: c,
				fontSize: l,
				fontWeight: u,
				fontStyle: d,
				underline: f,
				linethrough: p,
				fill: h,
				stroke: g,
				strokeWidth: _,
				opacity: v,
				backgroundColor: y,
				backgroundOpacity: b,
				paddingTop: x,
				paddingRight: S,
				paddingBottom: C,
				paddingLeft: w,
				radiusTopLeft: T,
				radiusTopRight: E,
				radiusBottomRight: D,
				radiusBottomLeft: O,
				left: k,
				top: A,
				width: ee,
				height: te,
				angle: ne,
				scaleX: re,
				scaleY: ie
			}
		}), ae;
	}
}, Yc = .01, Xc = ({ textbox: e }) => {
	let t = e.text ?? "";
	if (!t.length) return [];
	let n = t.split("\n"), r = [], i = 0;
	for (let e = 0; e < n.length; e += 1) {
		let t = n[e] ?? "", a = i, o = i + t.length;
		i = o + 1, r.push({
			start: a,
			end: o
		});
	}
	return r;
}, Zc = ({ range: e, text: t }) => {
	if (!e) return null;
	let n = t.length;
	if (n <= 0) return null;
	let { start: r, end: i } = e, a = Number.isFinite(r) ? r : 0, o = Number.isFinite(i) ? i : a, s = Math.max(0, Math.min(a, n)), c = Math.max(0, Math.min(o, n)), l = Math.min(s, c), u = Math.max(s, c);
	return l === u ? null : {
		start: l,
		end: u
	};
}, Qc = ({ textbox: e, range: t }) => {
	let n = Xc({ textbox: e });
	if (!n.length) return t;
	let { start: r } = t, { end: i } = t;
	for (let e = 0; e < n.length; e += 1) {
		let a = n[e];
		if (!a) continue;
		let { start: o, end: s } = a;
		t.end > o && t.start < s && (r = Math.min(r, o), i = Math.max(i, s));
	}
	return {
		start: r,
		end: i
	};
}, $c = ({ textbox: e, range: t }) => {
	let n = e.text ?? "";
	if (!n.length) return [];
	let { start: r, end: i } = t, a = n.split("\n"), o = [], s = 0;
	for (let e = 0; e < a.length; e += 1) {
		let t = a[e] ?? "", n = s, c = s + t.length;
		i > n && r < c && o.push(e), s = c + 1;
	}
	return o;
}, el = ({ textbox: e, range: t }) => {
	let n = e.text ?? "";
	if (!n.length) return [];
	let { start: r, end: i } = t, a = n.split("\n"), o = [], s = 0;
	for (let e = 0; e < a.length; e += 1) {
		let t = a[e] ?? "", n = s, c = s + t.length;
		r <= n && i >= c && o.push(e), s = c + 1;
	}
	return o;
}, tl = ({ previous: e, next: t }) => {
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r += 1) if (e[r] !== t[r]) return r;
	return n;
}, nl = ({ text: e, charIndex: t }) => {
	let n = Math.max(0, Math.min(t, e.length)), r = 0;
	for (let t = 0; t < n; t += 1) e[t] === "\n" && (r += 1);
	return r;
}, rl = ({ text: e, lineIndex: t }) => {
	if (t <= 0) return 0;
	let n = 0;
	for (let r = 0; r < e.length; r += 1) if (e[r] === "\n" && (n += 1, n === t)) return r + 1;
	return e.length;
}, il = ({ deltaLines: e, diffIndex: t, lineFontDefaults: n, lineIndexOld: r, previousText: i }) => {
	let a = rl({
		text: i,
		lineIndex: r
	}), o = r + 1;
	t === a && (o = r);
	let s = {};
	for (let t in n) {
		if (!Object.prototype.hasOwnProperty.call(n, t)) continue;
		let r = Number(t);
		if (!Number.isFinite(r)) continue;
		let i = n[r];
		if (!i) continue;
		let a = r >= o ? r + e : r;
		s[a] = { ...i };
	}
	return {
		lineFontDefaults: s,
		changed: !0
	};
}, al = ({ deltaLines: e, diffIndex: t, lineFontDefaults: n, lineIndexOld: r, previousLines: i, previousText: a }) => {
	let o = Math.abs(e), s = r;
	a[t] === "\n" && (i[r] ?? "").length > 0 && (s = r + 1);
	let c = s + o - 1, l = {}, u = [];
	for (let e = s; e <= c; e += 1) {
		let t = n[e];
		t && u.push(t);
	}
	for (let t in n) {
		if (!Object.prototype.hasOwnProperty.call(n, t)) continue;
		let r = Number(t);
		if (!Number.isFinite(r)) continue;
		let i = n[r];
		i && (r < s && (l[r] = { ...i }), r > c && (l[r + e] = { ...i }));
	}
	return {
		lineFontDefaults: l,
		changed: !0,
		deletedLineDefaultsCleanup: {
			lineIndex: s,
			lineDefaults: u
		}
	};
}, ol = ({ lineFontDefaults: e, previousText: t, currentText: n }) => {
	if (!e || !Object.keys(e).length) return {
		lineFontDefaults: e,
		changed: !1
	};
	let r = t.split("\n"), i = n.split("\n").length - r.length;
	if (i === 0) return {
		lineFontDefaults: e,
		changed: !1
	};
	let a = tl({
		previous: t,
		next: n
	}), o = nl({
		text: t,
		charIndex: a
	});
	return i > 0 ? il({
		deltaLines: i,
		diffIndex: a,
		lineFontDefaults: e,
		lineIndexOld: o,
		previousText: t
	}) : al({
		deltaLines: i,
		diffIndex: a,
		lineFontDefaults: e,
		lineIndexOld: o,
		previousLines: r,
		previousText: t
	});
}, sl = ({ lineDefaults: e }) => {
	let t = {};
	return e.fontFamily !== void 0 && (t.fontFamily = e.fontFamily), e.fontSize !== void 0 && (t.fontSize = e.fontSize), e.fontWeight !== void 0 && (t.fontWeight = e.fontWeight), e.fontStyle !== void 0 && (t.fontStyle = e.fontStyle), e.underline !== void 0 && (t.underline = e.underline), e.linethrough !== void 0 && (t.linethrough = e.linethrough), e.fill !== void 0 && (t.fill = e.fill), e.stroke !== void 0 && (t.stroke = e.stroke), e.strokeWidth !== void 0 && (t.strokeWidth = e.strokeWidth), t;
}, cl = ({ textbox: e, lineIndices: t, updates: n }) => {
	if (!t.length) return !1;
	let { fill: r, fontFamily: i, fontSize: a, fontStyle: o, fontWeight: s, linethrough: c, stroke: l, strokeWidth: u, underline: d } = n;
	if (!(r !== void 0 || i !== void 0 || a !== void 0 || o !== void 0 || s !== void 0 || c !== void 0 || l !== void 0 || u !== void 0 || d !== void 0)) return !1;
	let { lineFontDefaults: f } = e, p = f ?? {}, m = !1, h = !1;
	for (let e = 0; e < t.length; e += 1) {
		let n = t[e];
		if (!Number.isFinite(n)) continue;
		let g = h ? p[n] : f?.[n], _ = g ? { ...g } : {}, v = !1;
		i !== void 0 && g?.fontFamily !== i && (_.fontFamily = i, v = !0), a !== void 0 && g?.fontSize !== a && (_.fontSize = a, v = !0), s !== void 0 && g?.fontWeight !== s && (_.fontWeight = s, v = !0), o !== void 0 && g?.fontStyle !== o && (_.fontStyle = o, v = !0), d !== void 0 && g?.underline !== d && (_.underline = d, v = !0), c !== void 0 && g?.linethrough !== c && (_.linethrough = c, v = !0), r !== void 0 && g?.fill !== r && (_.fill = r, v = !0), l !== void 0 && (l === null && g?.stroke !== void 0 && (delete _.stroke, v = !0), l !== null && g?.stroke !== l && (_.stroke = l, v = !0)), u !== void 0 && g?.strokeWidth !== u && (_.strokeWidth = u, v = !0), v && (h ||= (p = { ...p }, !0), p[n] = _, m = !0);
	}
	return m && (e.lineFontDefaults = p), m;
}, ll = ({ lineStyles: e, lineDefaults: t }) => {
	if (!e) return {
		lineStyles: e,
		changed: !1
	};
	let n = sl({ lineDefaults: t }), r = Object.keys(n);
	if (!r.length) return {
		lineStyles: e,
		changed: !1
	};
	let i = e, a = !1, o = !1;
	for (let t in e) {
		if (!Object.prototype.hasOwnProperty.call(e, t)) continue;
		let s = e[t];
		if (!s) continue;
		let c = s, l = !1;
		for (let e = 0; e < r.length; e += 1) {
			let t = r[e];
			t && s[t] === n[t] && (l ||= (c = { ...s }, !0), delete c[t]);
		}
		l && (a ||= (i = { ...e }, !0), Object.keys(c).length ? i[t] = c : delete i[t], o = !0);
	}
	return o ? {
		lineStyles: Object.keys(i).length > 0 ? i : void 0,
		changed: !0
	} : {
		lineStyles: e,
		changed: !1
	};
}, ul = ({ cleanup: e, lineCount: t, styles: n }) => {
	if (!e) return {
		styles: n,
		changed: !1
	};
	if (e.lineIndex >= t) {
		if (!n[e.lineIndex]) return {
			styles: n,
			changed: !1
		};
		let t = { ...n };
		return delete t[e.lineIndex], {
			styles: t,
			changed: !0
		};
	}
	let r = n[e.lineIndex], i = !1;
	for (let t = 0; t < e.lineDefaults.length; t += 1) {
		let n = e.lineDefaults[t];
		if (!n) continue;
		let a = ll({
			lineStyles: r,
			lineDefaults: n
		});
		a.changed && (r = a.lineStyles, i = !0);
	}
	if (!i) return {
		styles: n,
		changed: !1
	};
	let a = { ...n };
	return r ? a[e.lineIndex] = r : delete a[e.lineIndex], {
		styles: a,
		changed: !0
	};
}, dl = ({ textbox: e }) => {
	let { fontFamily: t, fontSize: n, fontStyle: r, fontWeight: i, fill: a, stroke: o, strokeWidth: s, linethrough: c, underline: l } = e, u = {}, d = typeof a == "string" ? a : void 0, f = typeof o == "string" ? o : void 0;
	return t !== void 0 && (u.fontFamily = t), n !== void 0 && (u.fontSize = n), i !== void 0 && (u.fontWeight = i), r !== void 0 && (u.fontStyle = r), l !== void 0 && (u.underline = l), c !== void 0 && (u.linethrough = c), d !== void 0 && (u.fill = d), f !== void 0 && (u.stroke = f), s !== void 0 && (u.strokeWidth = s), u;
}, fl = ({ sourceDefaults: e, globalLineDefaults: t }) => {
	let n = {};
	return e?.fontFamily === void 0 ? t.fontFamily !== void 0 && (n.fontFamily = t.fontFamily) : n.fontFamily = e.fontFamily, e?.fontSize === void 0 ? t.fontSize !== void 0 && (n.fontSize = t.fontSize) : n.fontSize = e.fontSize, e?.fontWeight === void 0 ? t.fontWeight !== void 0 && (n.fontWeight = t.fontWeight) : n.fontWeight = e.fontWeight, e?.fontStyle === void 0 ? t.fontStyle !== void 0 && (n.fontStyle = t.fontStyle) : n.fontStyle = e.fontStyle, e?.underline === void 0 ? t.underline !== void 0 && (n.underline = t.underline) : n.underline = e.underline, e?.linethrough === void 0 ? t.linethrough !== void 0 && (n.linethrough = t.linethrough) : n.linethrough = e.linethrough, e?.fill === void 0 ? t.fill !== void 0 && (n.fill = t.fill) : n.fill = e.fill, e?.stroke === void 0 ? t.stroke !== void 0 && (n.stroke = t.stroke) : n.stroke = e.stroke, e?.strokeWidth === void 0 ? n.stroke !== void 0 && t.strokeWidth !== void 0 && (n.strokeWidth = t.strokeWidth) : n.strokeWidth = e.strokeWidth, n;
}, pl = ({ lineText: e, lineStyles: t, lineDefaults: n }) => {
	let r = e.length;
	if (r === 0) return {
		lineStyles: t,
		changed: !1
	};
	let i = sl({ lineDefaults: n }), a = Object.keys(i);
	if (!a.length) return {
		lineStyles: t,
		changed: !1
	};
	let o = t, s = !1, c = !1;
	if (t) for (let e in t) {
		if (!Object.prototype.hasOwnProperty.call(t, e)) continue;
		let n = Number(e);
		Number.isInteger(n) && n >= 0 && n < r || (c ||= (o = { ...t }, !0), o && Object.prototype.hasOwnProperty.call(o, e) && delete o[e], s = !0);
	}
	for (let e = 0; e < r; e += 1) {
		let n = o ?? t, r = n ? n[e] : void 0;
		if (!r) {
			o || (o = {}, c = !0), c ||= (o = { ...o }, !0), o[e] = { ...i }, s = !0;
			continue;
		}
		a.some((e) => r[e] === void 0) && (o || (o = {}, c = !0), c ||= (o = { ...o }, !0), o[e] = {
			...i,
			...r
		}, s = !0);
	}
	return {
		lineStyles: o,
		changed: s
	};
}, ml = ({ deletedLineDefaultsCleanup: e, globalLineDefaults: t, lineFontDefaults: n, lines: r, styles: i }) => {
	let a = n, o = !1, s = !1, c = i, l = !1, u = !1, d, f = ul({
		styles: c ?? {},
		lineCount: r.length,
		cleanup: e
	});
	f.changed && (c = f.styles, l = !0, u = !0);
	for (let e = 0; e < r.length; e += 1) {
		let n = r[e] ?? "", i = a ? a[e] : void 0;
		if (i && (d = i), n.length !== 0) {
			let t = i;
			if (!t && d && (t = { ...d }, a || (a = {}, s = !0), s ||= (a = { ...a }, !0), a[e] = t, o = !0), t) {
				let r = pl({
					lineText: n,
					lineStyles: c ? c[e] : void 0,
					lineDefaults: t
				});
				r.changed && (c || (c = {}, u = !0), u ||= (c = { ...c }, !0), r.lineStyles && (c[e] = r.lineStyles), !r.lineStyles && c[e] && delete c[e], l = !0), d = t;
			}
			continue;
		}
		let f = fl({
			sourceDefaults: i ?? d,
			globalLineDefaults: t
		});
		!i && Object.keys(f).length && (a || (a = {}, s = !0), s ||= (a = { ...a }, !0), a[e] = f, o = !0, d = f), i && (d = i);
		let p = sl({ lineDefaults: f }), m = Object.keys(p).length > 0;
		(m || c && c[e]) && (c || (c = {}, u = !0), u ||= (c = { ...c }, !0), m && (c[e] = { 0: p }), !m && c[e] && delete c[e], l = !0);
	}
	return {
		lineFontDefaults: a,
		lineFontDefaultsChanged: o,
		styles: c ?? {},
		stylesChanged: l
	};
};
function hl({ textbox: e }) {
	let t = (e.text ?? "").split("\n"), n = dl({ textbox: e }), r = ml({
		lines: t,
		styles: e.styles,
		lineFontDefaults: e.lineFontDefaults,
		globalLineDefaults: n
	}), i = r.lineFontDefaults && Object.keys(r.lineFontDefaults).length > 0 ? r.lineFontDefaults : void 0, a = {};
	for (let e in r.styles) {
		if (!Object.prototype.hasOwnProperty.call(r.styles, e)) continue;
		let t = Number(e);
		if (!Number.isInteger(t) || t < 0) continue;
		let o = r.styles[e];
		if (!o) continue;
		let s = ll({
			lineStyles: o,
			lineDefaults: i?.[t] ?? n
		});
		!s.lineStyles || !Object.keys(s.lineStyles).length || (a[t] = s.lineStyles);
	}
	return {
		lineFontDefaults: i,
		styles: a
	};
}
var gl = ({ currentText: e, previousText: t, textbox: n }) => {
	let r = ol({
		lineFontDefaults: n.lineFontDefaults,
		previousText: t,
		currentText: e
	}), i = ml({
		lines: e.split("\n"),
		styles: n.styles,
		lineFontDefaults: r.lineFontDefaults,
		deletedLineDefaultsCleanup: r.deletedLineDefaultsCleanup,
		globalLineDefaults: dl({ textbox: n })
	});
	return {
		...i,
		lineFontDefaultsChanged: r.changed || i.lineFontDefaultsChanged
	};
}, _l = ({ textbox: e }) => {
	let t = ml({
		lines: (e.text ?? "").split("\n"),
		styles: e.styles,
		lineFontDefaults: e.lineFontDefaults,
		globalLineDefaults: dl({ textbox: e })
	}), n = !1;
	return t.lineFontDefaultsChanged && (e.lineFontDefaults = t.lineFontDefaults, n = !0), t.stylesChanged && (e.styles = t.styles, e.dirty = !0, n = !0), n;
}, vl = ({ lineFontDefaults: e }) => {
	if (!e) return;
	let t = {};
	for (let n in e) {
		if (!Object.prototype.hasOwnProperty.call(e, n)) continue;
		let r = Number(n);
		if (!Number.isFinite(r)) continue;
		let i = e[r];
		i && (t[r] = { ...i });
	}
	return t;
}, yl = ({ lineFontDefaults: e, scale: t }) => {
	if (!e || !Number.isFinite(t) || Math.abs(t - 1) < .01) return;
	let n = {}, r = !1, i = !1;
	for (let a in e) {
		if (!Object.prototype.hasOwnProperty.call(e, a)) continue;
		let o = Number(a);
		if (!Number.isFinite(o)) continue;
		let s = e[o];
		if (!s) continue;
		let c = { ...s };
		if (typeof s.fontSize == "number") {
			let e = Math.min(8, s.fontSize);
			c.fontSize = Math.max(e, s.fontSize * t), i = !0;
		}
		n[o] = c, r = !0;
	}
	if (!(!r || !i)) return n;
}, bl = ({ textbox: e, text: t }) => {
	let { textLines: n } = e, r = Array.isArray(n) && n.length > 0 ? n.length : Math.max(t.split("\n").length, 1), i = 0;
	for (let t = 0; t < r; t += 1) {
		let n = e.getLineWidth(t);
		n > i && (i = n);
	}
	return i;
}, xl = ({ origin: e, size: t }) => e === "left" || e === "top" || e === 0 ? 0 : e === "right" || e === "bottom" || e === 1 ? t : t / 2, Sl = ({ textbox: e, originX: t = e.originX ?? "center", originY: n = e.originY ?? "center" }) => {
	let r = e.width ?? e.calcTextWidth() ?? 0, i = e.height ?? e.calcTextHeight() ?? 0, a = e.paddingTop ?? 0, o = e.paddingRight ?? 0, s = e.paddingBottom ?? 0, c = e.paddingLeft ?? 0, l = -r / 2 + (c - o) / 2, u = -i / 2 + (a - s) / 2, d = new p(l + xl({
		origin: t,
		size: r
	}), u + xl({
		origin: n,
		size: i
	})), f = e.getPointByOrigin("center", "center"), m = e, h = typeof m.calcTransformMatrix == "function" ? m.calcTransformMatrix() : null, g = Array.isArray(h) ? new p(d.x * h[0] + d.y * h[2] + f.x, d.x * h[1] + d.y * h[3] + f.y) : new p(f.x + d.x, f.y + d.y);
	return {
		left: g.x,
		top: g.y,
		originX: t,
		originY: n
	};
}, Cl = ({ textbox: e, montageLeft: t, montageRight: n }) => {
	e.setCoords();
	let r = e.getBoundingRect(), i = r.left ?? 0, a = i + (r.width ?? 0), o = n - t;
	if (o > 0 && (r.width ?? 0) >= o - .01) return !1;
	let s = 0;
	return i < t ? s = t - i : a > n && (s = n - a), Math.abs(s) <= .01 ? !1 : (e.set({ left: (e.left ?? 0) + s }), !0);
}, wl = ({ rawValue: e, calculatedValue: t }) => typeof e == "number" ? e : typeof t == "number" ? t : 0, Tl = ({ stylesList: e }) => {
	let t = e.length;
	if (!t) return !1;
	for (let n = 0; n < t; n += 1) {
		let t = e[n];
		if (!t) continue;
		let { fontFamily: r, fontSize: i, fontWeight: a, fontStyle: o, lineHeight: s, charSpacing: c } = t;
		if (r !== void 0 || i !== void 0 || a !== void 0 || o !== void 0 || s !== void 0 || c !== void 0) return !0;
	}
	return !1;
}, El = ({ textbox: e }) => {
	let { width: t, height: n, calcTextWidth: r, calcTextHeight: i } = e, a = typeof r == "function" ? r.call(e) : void 0, o = typeof i == "function" ? i.call(e) : void 0, s = wl({
		rawValue: t,
		calculatedValue: a
	}), c = wl({
		rawValue: n,
		calculatedValue: o
	}), l = Number.isFinite(s) ? Math.round(s) : null, u = Number.isFinite(c) ? Math.round(c) : null, d = {};
	return l !== null && l !== s && (d.width = Math.max(0, l)), u !== null && u !== c && (d.height = Math.max(0, u)), Object.keys(d).length ? (e.set(d), !0) : !1;
}, Dl = 1e-9, Ol = .5 + Yc, kl = ({ text: e }) => Math.max((typeof e == "string" ? e : "").split("\n").length, 1), Al = ({ textbox: e, fallbackLineCount: t }) => {
	let { textLines: n } = e;
	return Array.isArray(n) && n.length > 0 ? n.length : t;
}, jl = ({ textbox: e, canvasManager: t }) => {
	let { width: n } = t.getMontageAreaSceneBounds(), r = Math.abs(e.scaleX ?? 1) || 1, i = e.paddingLeft ?? 0, a = e.paddingRight ?? 0, o = e.strokeWidth ?? 0;
	return Math.max(1, n / r - i - a - o);
}, Ml = ({ textbox: e, canvasManager: t, base: n, committedWidth: r, shouldScaleFontSize: i }) => {
	if (!i || e.autoExpand === !1) return;
	let a = n.explicitLineCount ?? kl({ text: e.text });
	if ((n.renderedLineCount ?? a) > a || Al({
		textbox: e,
		fallbackLineCount: a
	}) <= a) return;
	let o = e.width ?? r, s = jl({
		textbox: e,
		canvasManager: t
	});
	if (s <= o + .01) return;
	e.set({ width: s }), e.initDimensions();
	let c = typeof e.text == "string" ? e.text : "", l = Math.min(s, Math.max(o, Math.ceil(bl({
		textbox: e,
		text: c
	}))));
	e.set({ width: l }), e.initDimensions();
}, Nl = ({ textbox: e }) => {
	let t = e.width ?? e.calcTextWidth(), n = e.fontSize ?? 16, r = kl({ text: e.text }), i = Al({
		textbox: e,
		fallbackLineCount: r
	}), { styles: a = {} } = e, { lineFontDefaults: o } = e, { paddingTop: s = 0, paddingRight: c = 0, paddingBottom: l = 0, paddingLeft: u = 0 } = e, { radiusTopLeft: d = 0, radiusTopRight: f = 0, radiusBottomRight: p = 0, radiusBottomLeft: m = 0 } = e;
	return {
		width: t,
		height: e.height ?? e.calcTextHeight(),
		fontSize: n,
		explicitLineCount: r,
		renderedLineCount: i,
		padding: {
			top: s,
			right: c,
			bottom: l,
			left: u
		},
		radii: {
			topLeft: d,
			topRight: f,
			bottomRight: p,
			bottomLeft: m
		},
		styles: JSON.parse(JSON.stringify(a)),
		lineFontDefaults: vl({ lineFontDefaults: o })
	};
}, Pl = ({ base: e }) => {
	let t = 1 / Math.max(1, e.width), n = [e.fontSize];
	Object.values(e.styles).forEach((e) => {
		Object.values(e).forEach((e) => {
			let { fontSize: t } = e;
			typeof t != "number" || !Number.isFinite(t) || t <= 0 || n.push(t);
		});
	}), Object.values(e.lineFontDefaults ?? {}).forEach((e) => {
		let { fontSize: t } = e;
		typeof t != "number" || !Number.isFinite(t) || t <= 0 || n.push(t);
	});
	let r = n.reduce((e, t) => Math.max(e, Math.min(8, t) / t), 0);
	return {
		widthScale: t,
		fontScale: r,
		proportionalScale: Math.max(t, r)
	};
}, Fl = ({ textbox: e, base: t, scale: n, shouldScaleFontSize: r = !0, shouldScalePadding: i = !0, shouldScaleRadii: a = !0 }) => {
	let { fontSize: o, padding: s, radii: c, styles: l, lineFontDefaults: u } = t, d = Math.max(Math.min(8, o), o * n), f = Object.keys(l).length > 0, p;
	if (r && f) {
		let e = {};
		Object.entries(l).forEach(([t, r]) => {
			if (!r) return;
			let i = {};
			Object.entries(r).forEach(([e, t]) => {
				if (!t) return;
				let r = { ...t };
				if (typeof t.fontSize == "number") {
					let e = Math.min(8, t.fontSize);
					r.fontSize = Math.max(e, t.fontSize * n);
				}
				i[e] = r;
			}), Object.keys(i).length && (e[t] = i);
		}), Object.keys(e).length && (p = e);
	}
	let m;
	r && (m = yl({
		lineFontDefaults: u,
		scale: n
	}));
	let h = i ? {
		top: Math.max(0, s.top * n),
		right: Math.max(0, s.right * n),
		bottom: Math.max(0, s.bottom * n),
		left: Math.max(0, s.left * n)
	} : s, g = a ? {
		topLeft: Math.max(0, c.topLeft * n),
		topRight: Math.max(0, c.topRight * n),
		bottomRight: Math.max(0, c.bottomRight * n),
		bottomLeft: Math.max(0, c.bottomLeft * n)
	} : c;
	p && (e.styles = p), m && (e.lineFontDefaults = m), e.set({
		fontSize: r ? d : o,
		paddingTop: h.top,
		paddingRight: h.right,
		paddingBottom: h.bottom,
		paddingLeft: h.left,
		radiusTopLeft: g.topLeft,
		radiusTopRight: g.topRight,
		radiusBottomRight: g.bottomRight,
		radiusBottomLeft: g.bottomLeft
	});
};
function Il({ anchorPlacement: e, canvasManager: t, committedWidth: n, dimensionsRounded: r, placement: i, textbox: a }) {
	return e ? (a.set({
		originX: i.originX,
		originY: i.originY
	}), a.setPositionByOrigin(new p(e.left, e.top), e.originX, e.originY)) : t.applyObjectPlacement({
		object: a,
		placement: i
	}), a.setCoords(), {
		appliedWidth: a.width ?? n,
		dimensionsRounded: r
	};
}
function Ll({ base: e, committedWidth: t, shouldRoundDimensions: n, shouldScaleFontSize: r, textbox: i, widthScale: a }) {
	if (n || !r) return;
	let o = (i.fontSize ?? e.fontSize) / e.fontSize;
	!(Math.abs(a - o) <= Dl) || (i.width ?? t) <= t || (i.width = t, i.dirty = !0);
}
function Rl({ base: e, shouldScaleFontSize: t, textbox: n }) {
	if (t || Al({
		textbox: n,
		fallbackLineCount: e.renderedLineCount ?? e.explicitLineCount ?? 1
	}) !== e.renderedLineCount) return;
	let r = n.height ?? e.height;
	Math.abs(r - e.height) > Ol || (n.set({ height: e.height }), n.dirty = !0);
}
function zl({ options: e, shouldRoundDimensions: t }) {
	let { textbox: n, canvasManager: r, base: i, widthScale: a, heightScale: o, placement: s, anchorPlacement: c, shouldScaleFontSize: l, shouldScalePadding: u, shouldScaleRadii: d, shouldDisableAutoExpandOnHorizontalChange: f = !1 } = e, p = Math.max(1, i.width * a), m = t ? Math.max(1, Math.round(p)) : p, h = Math.abs(m - i.width) > Yc;
	f && h && (n.autoExpand = !1), Fl({
		textbox: n,
		base: i,
		scale: o,
		shouldScaleFontSize: l,
		shouldScalePadding: u,
		shouldScaleRadii: d
	}), n.set({
		width: m,
		scaleX: 1,
		scaleY: 1
	}), n.initDimensions(), Rl({
		base: i,
		shouldScaleFontSize: l,
		textbox: n
	}), Ll({
		base: i,
		committedWidth: m,
		shouldRoundDimensions: t,
		shouldScaleFontSize: l,
		textbox: n,
		widthScale: a
	}), Ml({
		textbox: n,
		canvasManager: r,
		base: i,
		committedWidth: m,
		shouldScaleFontSize: l
	});
	let g = t ? El({ textbox: n }) : !1;
	return g && (n.dirty = !0), Il({
		anchorPlacement: c,
		canvasManager: r,
		committedWidth: m,
		dimensionsRounded: g,
		placement: s,
		textbox: n
	});
}
var Bl = (e) => {
	let t = e.shouldRoundDimensions ?? !0, { textbox: n } = e, r = n.shouldRoundDimensionsOnInit;
	n.shouldRoundDimensionsOnInit = t;
	try {
		return zl({
			options: e,
			shouldRoundDimensions: t
		});
	} finally {
		n.shouldRoundDimensionsOnInit = r;
	}
};
//#endregion
//#region src/editor/shape-manager/mutation/shape-rehydration.ts
function Vl({ group: e }) {
	let t = Math.abs(e.scaleX ?? 1) || 1, n = Math.abs(e.scaleY ?? 1) || 1, r = Math.max(1, e.shapeBaseWidth ?? e.width ?? 1), i = Math.max(1, e.shapeBaseHeight ?? e.height ?? 1);
	return {
		currentDimensions: {
			width: Math.max(1, r * t),
			height: Math.max(1, i * n)
		},
		manualDimensions: {
			width: Math.max(1, (e.shapeManualBaseWidth ?? r) * t),
			height: Math.max(1, (e.shapeManualBaseHeight ?? i) * n)
		},
		replaceBoxDimensions: {
			width: Math.max(1, (e.shapeReplaceBoxWidth ?? r) * t),
			height: Math.max(1, (e.shapeReplaceBoxHeight ?? i) * n)
		}
	};
}
function Hl({ group: e, text: t, textScale: n }) {
	let r = Number.isFinite(n) && n > 0 ? n : 1;
	Math.abs(r - 1) <= 1e-4 || (Fl({
		textbox: t,
		base: Nl({ textbox: t }),
		scale: r
	}), e.shapePaddingTop = Math.max(0, (e.shapePaddingTop ?? 0) * r), e.shapePaddingRight = Math.max(0, (e.shapePaddingRight ?? 0) * r), e.shapePaddingBottom = Math.max(0, (e.shapePaddingBottom ?? 0) * r), e.shapePaddingLeft = Math.max(0, (e.shapePaddingLeft ?? 0) * r));
}
function Ul({ group: e, text: t, textScale: n, shapeTextAutoExpand: r }) {
	let { currentDimensions: i, manualDimensions: a, replaceBoxDimensions: o } = Vl({ group: e });
	r !== void 0 && (e.shapeTextAutoExpand = r);
	let s = pa({
		group: e,
		text: t
	});
	return Hl({
		group: e,
		text: t,
		textScale: n
	}), nt({ group: e }), e.shapeManualBaseWidth = a.width, e.shapeManualBaseHeight = a.height, {
		currentDimensions: i,
		replaceBoxDimensions: o,
		shouldRecalculateLayout: s
	};
}
//#endregion
//#region src/editor/shape-manager/mutation/shape-update-pipeline.ts
var Wl = {
	angle: 0,
	skewX: 0,
	skewY: 0,
	flipX: !1,
	flipY: !1,
	scaleX: 1,
	scaleY: 1,
	autoExpand: !1,
	left: 0,
	top: 0,
	originX: "left",
	originY: "top"
}, Gl = class {
	constructor({ dependencies: e }) {
		this.dependencies = e;
	}
	async prepare({ target: e, presetKey: t, options: n }) {
		let r = this._resolveUpdateContext({
			target: e,
			presetKey: t,
			options: n
		});
		if (!r) return null;
		let i = this._resolvePresetState({
			currentGroup: r.currentGroup,
			basePreset: r.basePreset,
			options: n
		}), a = this._resolveDimensionState({
			context: r,
			presetState: i,
			presetKey: t,
			options: n
		}), o = this._resolveStyleState({
			currentGroup: r.currentGroup,
			nextDimensions: a.nextCurrentDimensions,
			options: n,
			presetState: i
		});
		return this._createPreparedUpdate({
			context: r,
			target: e,
			options: n,
			presetState: i,
			styleState: o,
			dimensionState: a
		});
	}
	_resolveUpdateContext({ target: e, presetKey: t, options: n }) {
		let r = pt({
			canvas: this.dependencies.canvas,
			target: e
		});
		if (!r || r.locked) return null;
		let i = r.shapePresetKey ?? "circle", a = t ?? i, o = Le({ presetKey: a });
		return o ? {
			currentGroup: r,
			currentPresetKey: i,
			requestedPresetKey: a,
			basePreset: o,
			placement: this.dependencies.canvasManager.resolveObjectPlacement({
				object: r,
				left: n.left,
				top: n.top,
				originX: n.originX,
				originY: n.originY
			}),
			currentDimensions: this.dependencies.layoutController.resolveCurrentDimensions({ group: r }),
			currentManualDimensions: this.dependencies.layoutController.resolveManualDimensions({ group: r }),
			currentReplaceBoxDimensions: this.dependencies.layoutController.resolveReplaceBoxDimensions({ group: r })
		} : null;
	}
	_resolvePresetState({ currentGroup: e, basePreset: t, options: n }) {
		let r = n.rounding === void 0 ? M({ rounding: e.shapeRounding }) : M({ rounding: n.rounding }), i = Le({ presetKey: Re({
			preset: t,
			rounding: r
		}) }) ?? t, a = He({ preset: i });
		return {
			effectivePreset: i,
			effectivePresetKey: i.key,
			presetCanRound: a,
			effectiveRounding: a ? r : 0,
			presetWidth: i.width,
			presetHeight: i.height
		};
	}
	_resolveDimensionState({ context: e, presetState: t, presetKey: n, options: r }) {
		let i = this.dependencies.layoutController.isShapeTextAutoExpandEnabled({ group: e.currentGroup }), a = r.shapeTextAutoExpand === void 0 ? i : r.shapeTextAutoExpand !== !1, o = !!r.preserveCurrentAspectRatio, s = n !== void 0 && e.requestedPresetKey !== e.currentPresetKey, c = s && !o, l = this._resolveNextReplaceBoxDimensions({
			shouldFitReplacementToPreset: c,
			currentReplaceBoxDimensions: e.currentReplaceBoxDimensions,
			options: r
		}), u = this._resolveNextCurrentDimensions({
			presetState: t,
			nextReplaceBoxDimensions: l,
			currentDimensions: e.currentDimensions,
			options: r
		});
		return {
			nextCurrentDimensions: u,
			manualDimensions: this._resolveManualDimensions({
				isPresetReplace: s,
				currentShapeTextAutoExpand: i,
				nextShapeTextAutoExpand: a,
				nextCurrentDimensions: u,
				currentDimensions: e.currentDimensions,
				currentManualDimensions: e.currentManualDimensions,
				options: r
			}),
			nextReplaceBoxDimensions: l,
			nextShapeTextAutoExpand: a,
			shouldFitReplacementToPreset: c
		};
	}
	_resolveNextReplaceBoxDimensions({ shouldFitReplacementToPreset: e, currentReplaceBoxDimensions: t, options: n }) {
		return e ? {
			width: Math.max(1, n.width ?? t.width),
			height: Math.max(1, n.height ?? t.height)
		} : null;
	}
	_resolveNextCurrentDimensions({ presetState: e, nextReplaceBoxDimensions: t, currentDimensions: n, options: r }) {
		return t ? this.dependencies.layoutController.resolveAspectRatioFittedDimensions({
			targetWidth: t.width,
			targetHeight: t.height,
			aspectWidth: e.presetWidth,
			aspectHeight: e.presetHeight
		}) : {
			width: Math.max(1, r.width ?? n.width),
			height: Math.max(1, r.height ?? n.height)
		};
	}
	_resolveManualDimensions({ isPresetReplace: e, currentShapeTextAutoExpand: t, nextShapeTextAutoExpand: n, nextCurrentDimensions: r, currentDimensions: i, currentManualDimensions: a, options: o }) {
		if (e) return r;
		let { width: s, height: c } = a, l = s, u = c;
		return o.width !== void 0 && (l = Math.max(1, o.width)), o.height !== void 0 && (u = Math.max(1, o.height)), o.width === void 0 && t && !n && (l = i.width), {
			width: l,
			height: u
		};
	}
	_resolveStyleState({ currentGroup: e, nextDimensions: t, options: n, presetState: r }) {
		let i = n.alignH ?? e.shapeAlignHorizontal ?? "center", a = n.alignV ?? e.shapeAlignVertical ?? "middle", o = Je({
			base: this.dependencies.layoutController.resolveGroupUserPadding({ group: e }),
			override: n.textPadding
		}), s = Ze({ padding: n.textPadding }), c = di({
			options: n,
			fallback: e
		}), l = ({ width: e, height: t }) => Xe({
			baseInset: Be({
				preset: r.effectivePreset,
				width: e,
				height: t
			}),
			stroke: c.stroke,
			strokeWidth: c.strokeWidth
		});
		return {
			horizontalAlign: i,
			verticalAlign: a,
			nextUserPadding: o,
			changedPadding: s,
			style: c,
			resolveInternalShapeTextInset: l,
			basePadding: Ye({
				base: l({
					width: t.width,
					height: t.height
				}),
				addition: o
			})
		};
	}
	async _createPreparedUpdate({ context: e, target: t, options: n, presetState: r, styleState: i, dimensionState: a }) {
		let o = this._resolvePreparedCurrentNodes({ currentGroup: e.currentGroup });
		if (!o) return null;
		let s = this._resolvePreparedLayoutDimensions({
			currentGroup: e.currentGroup,
			currentTextNode: o.text,
			currentDimensions: e.currentDimensions,
			options: n,
			styleState: i,
			dimensionState: a
		}), c = await Ai({
			preset: r.effectivePreset,
			width: s.width,
			height: s.height,
			style: i.style,
			rounding: r.effectiveRounding
		}), l = this._resolvePreparedReplaceBoxDimensions({
			currentReplaceBoxDimensions: e.currentReplaceBoxDimensions,
			dimensionState: a,
			options: n
		});
		return this._createPreparedUpdateResult({
			context: e,
			target: t,
			options: n,
			current: o,
			shape: c,
			replaceBox: l,
			layoutDimensions: s,
			presetState: r,
			styleState: i,
			dimensionState: a
		});
	}
	_createPreparedUpdateResult({ context: e, target: t, options: n, current: r, shape: i, replaceBox: a, layoutDimensions: o, presetState: s, styleState: c, dimensionState: l }) {
		return {
			current: r,
			next: this._createPreparedNextState({
				shape: i,
				replaceBox: a,
				presetState: s,
				styleState: c,
				dimensionState: l
			}),
			text: this._createPreparedTextState({
				options: n,
				styleState: c
			}),
			layout: this._createPreparedLayoutState({
				layoutDimensions: o,
				styleState: c,
				dimensionState: l,
				options: n
			}),
			placement: e.placement,
			lifecycle: this.dependencies.lifecycleController.createContext({
				group: e.currentGroup,
				source: "update",
				target: t,
				presetKey: s.effectivePresetKey,
				options: n,
				withoutSave: n.withoutSave
			}),
			withoutSelection: n.withoutSelection,
			withoutSave: n.withoutSave
		};
	}
	_resolvePreparedCurrentNodes({ currentGroup: e }) {
		let { shape: t, text: n } = I({ group: e });
		if (!t || !n) return null;
		let r = e.getObjects().indexOf(t);
		return r < 0 ? null : {
			group: e,
			shape: t,
			text: n,
			shapeIndex: r
		};
	}
	_createPreparedNextState({ shape: e, replaceBox: t, presetState: n, styleState: r, dimensionState: i }) {
		return {
			shape: e,
			presetKey: n.effectivePresetKey,
			presetCanRound: n.presetCanRound,
			rounding: n.effectiveRounding,
			style: r.style,
			shapeTextAutoExpand: i.nextShapeTextAutoExpand,
			userPadding: r.nextUserPadding,
			replaceBox: t,
			manual: i.manualDimensions,
			shouldFitReplacementToPreset: i.shouldFitReplacementToPreset
		};
	}
	_createPreparedTextState({ options: e, styleState: t }) {
		return {
			value: e.text,
			style: e.textStyle,
			syncLineStylesWithText: e.syncLineStylesWithText !== !1,
			horizontalAlign: t.horizontalAlign,
			verticalAlign: t.verticalAlign
		};
	}
	_createPreparedLayoutState({ layoutDimensions: e, styleState: t, dimensionState: n, options: r }) {
		return {
			width: e.width,
			height: e.height,
			internalShapeTextInset: t.resolveInternalShapeTextInset({
				width: e.width,
				height: e.height
			}),
			resolveInternalShapeTextInset: t.resolveInternalShapeTextInset,
			preserveAspectRatio: n.shouldFitReplacementToPreset,
			expandShapeHeightToFitText: r.textPadding === void 0 || !e.shouldPreserveCurrentWidth,
			changedPadding: t.changedPadding
		};
	}
	_resolvePreparedReplaceBoxDimensions({ currentReplaceBoxDimensions: e, dimensionState: t, options: n }) {
		return {
			width: t.nextReplaceBoxDimensions?.width ?? (n.width === void 0 ? e.width : Math.max(1, n.width)),
			height: t.nextReplaceBoxDimensions?.height ?? (n.height === void 0 ? e.height : Math.max(1, n.height))
		};
	}
	_resolvePreparedLayoutDimensions({ currentGroup: e, currentTextNode: t, currentDimensions: n, options: r, styleState: i, dimensionState: a }) {
		let o = this._createStagedTextNode({
			currentGroup: e,
			currentTextNode: t,
			currentWidth: n.width,
			horizontalAlign: i.horizontalAlign,
			text: r.text,
			textStyle: r.textStyle,
			syncLineStylesWithText: r.syncLineStylesWithText
		});
		return this._resolveLayoutDimensions({
			currentDimensions: n,
			options: r,
			stagedTextNode: o,
			styleState: i,
			dimensionState: a
		});
	}
	_createStagedTextNode({ currentGroup: e, currentTextNode: t, currentWidth: n, horizontalAlign: r, text: i, textStyle: a, syncLineStylesWithText: o }) {
		let s = t, c = this.dependencies.textNodeController.create({
			text: s.textCaseRaw ?? t.text ?? "",
			textStyle: this.dependencies.textNodeController.resolveCurrentStyle({
				group: e,
				textNode: t
			}),
			width: Math.max(1, t.width ?? n),
			align: r
		});
		return c.set(Wl), this.dependencies.textNodeController.applyUpdates({
			textNode: c,
			text: i,
			textStyle: a,
			align: r,
			syncLineStylesWithText: o
		}), c;
	}
	_resolveLayoutDimensions({ currentDimensions: e, options: t, stagedTextNode: n, styleState: r, dimensionState: i }) {
		let a = t.width === void 0 && t.height === void 0 && !i.shouldFitReplacementToPreset && t.shapeTextAutoExpand === void 0 && t.rounding === void 0 && t.text === void 0 && !this.dependencies.textNodeController.hasSizeAffectingStyleChanges({ textStyle: t.textStyle });
		return a ? {
			width: e.width,
			height: e.height,
			shouldPreserveCurrentWidth: a
		} : i.shouldFitReplacementToPreset ? this._resolveReplacementLayoutDimensions({
			stagedTextNode: n,
			styleState: r,
			dimensionState: i,
			shouldPreserveCurrentWidth: a
		}) : {
			width: this.dependencies.layoutController.resolveShapeLayoutWidth({
				text: n,
				currentWidth: i.nextCurrentDimensions.width,
				manualWidth: i.manualDimensions.width,
				shapeTextAutoExpandEnabled: i.nextShapeTextAutoExpand,
				padding: r.basePadding,
				resolvePaddingForWidth: ({ width: e }) => Ye({
					base: r.resolveInternalShapeTextInset({
						width: e,
						height: i.nextCurrentDimensions.height
					}),
					addition: r.nextUserPadding
				})
			}),
			height: i.nextCurrentDimensions.height,
			shouldPreserveCurrentWidth: a
		};
	}
	_resolveReplacementLayoutDimensions({ stagedTextNode: e, styleState: t, dimensionState: n, shouldPreserveCurrentWidth: r }) {
		let { width: i, height: a } = n.nextCurrentDimensions, o = a / Math.max(1, i), s = this.dependencies.layoutController.resolveShapeLayoutWidth({
			text: e,
			currentWidth: i,
			manualWidth: i,
			shapeTextAutoExpandEnabled: !0,
			padding: t.basePadding,
			resolvePaddingForWidth: ({ width: e }) => {
				let n = Math.max(1, e * o);
				return Ye({
					base: t.resolveInternalShapeTextInset({
						width: e,
						height: n
					}),
					addition: t.nextUserPadding
				});
			}
		});
		return {
			width: s,
			height: Math.max(1, s * o),
			shouldPreserveCurrentWidth: r
		};
	}
};
//#endregion
//#region src/editor/utils/current-transform.ts
function Kl({ canvas: t, objects: n }) {
	let r = Reflect.get(t, "_currentTransform");
	if (!r) return !1;
	if (n.includes(r.target)) return !0;
	if (!(r.target instanceof e)) return !1;
	let i = r.target.getObjects();
	return n.some((e) => i.includes(e));
}
//#endregion
//#region src/editor/shape-manager/mutation/shape-mutation-controller.ts
var ql = class {
	constructor({ dependencies: e }) {
		this.dependencies = e, this.updatePipeline = new Gl({ dependencies: {
			canvas: e.canvas,
			canvasManager: e.canvasManager,
			lifecycleController: e.lifecycleController,
			layoutController: e.layoutController,
			textNodeController: e.textNodeController
		} });
	}
	async update({ target: e, presetKey: t, options: n = {} } = {}) {
		let r = await this.updatePipeline.prepare({
			target: e,
			presetKey: t,
			options: n
		});
		if (!r) return null;
		let { group: i } = r.current;
		if (!this._isOnCanvas({ group: i })) return this._applyPreparedUpdate({ preparedUpdate: r }), this.dependencies.lifecycleController.fireBefore({ lifecycle: r.lifecycle }), this.dependencies.lifecycleController.fireUpdated({ lifecycle: r.lifecycle }), i;
		this._beginMutation();
		try {
			this._applyPreparedUpdate({ preparedUpdate: r }), !r.current.text.isEditing && !r.withoutSelection && this.dependencies.canvas.setActiveObject(i), this.dependencies.lifecycleController.fireBefore({ lifecycle: r.lifecycle }), this.dependencies.canvas.requestRenderAll();
		} finally {
			this._endMutation({ withoutSave: r.withoutSave });
		}
		return this.dependencies.lifecycleController.fireUpdated({ lifecycle: r.lifecycle }), i;
	}
	remove({ target: t, withoutSave: n } = {}) {
		let r = this._resolveUnlockedGroup({ target: t });
		if (!r) return !1;
		this._beginMutation();
		try {
			let { canvas: t } = this.dependencies;
			Kl({
				canvas: t,
				objects: [r]
			}) && t.endCurrentTransform();
			let n = t.getActiveObject();
			n instanceof e && n.getObjects().includes(r) && t.discardActiveObject(), t.remove(r), t.requestRenderAll();
		} finally {
			this._endMutation({ withoutSave: n });
		}
		return !0;
	}
	setFill({ target: e, fill: t, withoutSave: n }) {
		let r = this._resolveUnlockedShapeTarget({ target: e });
		if (!r) return null;
		let { group: i, shape: a } = r, o = this.dependencies.lifecycleController.createContext({
			group: i,
			source: "fill",
			target: e,
			withoutSave: n
		});
		return this._commitLifecycleMutation({
			lifecycle: o,
			withoutSave: n,
			mutate: () => {
				vi({
					shape: a,
					style: { fill: t }
				}), i.shapeFill = t, i.setCoords();
			}
		}), i;
	}
	setStroke({ target: e, stroke: t, strokeWidth: n, dash: r, withoutSave: i }) {
		let a = this._resolveUnlockedShapeTarget({ target: e });
		if (!a) return null;
		let { group: o, shape: s, text: c } = a, l = this.dependencies.lifecycleController.createContext({
			group: o,
			source: "stroke",
			target: e,
			withoutSave: i
		});
		return this._commitLifecycleMutation({
			lifecycle: l,
			withoutSave: i,
			mutate: () => {
				this._applyStrokeAndTextLayout({
					group: o,
					shape: s,
					text: c,
					stroke: t,
					strokeWidth: n,
					dash: r
				}), o.setCoords();
			}
		}), o;
	}
	setOpacity({ target: e, opacity: t, applyToText: n = !0, withoutSave: r }) {
		let i = this._resolveUnlockedShapeTarget({ target: e });
		if (!i) return null;
		let { group: a, shape: o, text: s } = i, c = this.dependencies.lifecycleController.createContext({
			group: a,
			source: "opacity",
			target: e,
			withoutSave: r
		});
		return this._commitLifecycleMutation({
			lifecycle: c,
			withoutSave: r,
			mutate: () => {
				vi({
					shape: o,
					style: { opacity: t }
				}), n && s && (s.set({ opacity: t }), s.setCoords()), a.shapeOpacity = t, a.set({ opacity: 1 }), a.setCoords();
			}
		}), a;
	}
	updateTextStyle({ target: e, style: t = {}, withoutSave: n } = {}) {
		let r = this._resolveUnlockedShapeTarget({ target: e });
		if (!r) return null;
		let { group: i, shape: a, text: o } = r, s = Object.keys(t).length > 0;
		if (!o) return null;
		if (!s) return i;
		let c = this.dependencies.layoutController.resolveManualDimensions({ group: i }), l = this.dependencies.canvasManager.getObjectPlacement({ object: i }), u = this.dependencies.layoutController.resolveShapeTextHorizontalAlign({
			group: i,
			textStyle: t
		}), d = this.dependencies.lifecycleController.createContext({
			group: i,
			source: "text-style",
			target: e,
			withoutSave: n
		});
		return this._commitLifecycleMutation({
			lifecycle: d,
			withoutSave: n,
			mutate: () => {
				this._applyTextStyleAndLayout({
					group: i,
					shape: a,
					text: o,
					placement: l,
					style: t,
					height: c.height,
					alignH: u
				});
			}
		}), i;
	}
	setTextAlign({ target: e, horizontal: t, vertical: n, withoutSave: r }) {
		let i = this._resolveUnlockedShapeTarget({ target: e });
		if (!i) return null;
		let { group: a, shape: o, text: s } = i;
		if (!s) return null;
		let c = this.dependencies.layoutController.resolveCurrentDimensions({ group: a }), l = t ?? a.shapeAlignHorizontal ?? "center", u = n ?? a.shapeAlignVertical ?? "middle", d = this.dependencies.lifecycleController.createContext({
			group: a,
			source: "text-align",
			target: e,
			withoutSave: r
		});
		return this._commitLifecycleMutation({
			lifecycle: d,
			withoutSave: r,
			mutate: () => {
				this._applyTextAlignAndLayout({
					group: a,
					shape: o,
					text: s,
					width: c.width,
					height: c.height,
					alignH: l,
					alignV: u
				});
			}
		}), a;
	}
	async setRounding({ target: e, rounding: t, withoutSave: n }) {
		let r = this._resolveUnlockedGroup({ target: e });
		if (!r) return null;
		let i = M({ rounding: t });
		return r.shapeCanRound === !1 ? r : this.update({
			target: r,
			presetKey: r.shapePresetKey ?? "circle",
			options: {
				rounding: i,
				withoutSave: n
			}
		});
	}
	commitRehydratedShapeLayout({ target: e, textScale: t = 1, shapeTextAutoExpand: n }) {
		let r = pt({
			canvas: this.dependencies.canvas,
			target: e
		});
		if (!r) return !1;
		let { shape: i, text: a } = I({ group: r });
		if (!i || !a) return !1;
		let o = this.dependencies.canvasManager.getObjectPlacement({ object: r }), { currentDimensions: s, replaceBoxDimensions: c, shouldRecalculateLayout: l } = Ul({
			group: r,
			text: a,
			textScale: t,
			shapeTextAutoExpand: n
		});
		return this.dependencies.layoutController.applyCurrentLayout({
			group: r,
			shape: i,
			text: a,
			placement: o,
			width: l ? void 0 : s.width,
			height: s.height,
			expandShapeHeightToFitText: l,
			alignH: r.shapeAlignHorizontal ?? "center",
			alignV: r.shapeAlignVertical ?? "middle"
		}), r.shapeReplaceBoxWidth = c.width, r.shapeReplaceBoxHeight = c.height, !0;
	}
	_resolveUnlockedGroup({ target: e }) {
		let t = pt({
			canvas: this.dependencies.canvas,
			target: e
		});
		return !t || t.locked ? null : t;
	}
	_resolveUnlockedShapeTarget({ target: e }) {
		let t = this._resolveUnlockedGroup({ target: e });
		if (!t) return null;
		let { shape: n, text: r } = I({ group: t });
		return n ? {
			group: t,
			shape: n,
			text: r
		} : null;
	}
	_applyStrokeAndTextLayout({ group: e, shape: t, text: n, stroke: r, strokeWidth: i, dash: a }) {
		if (vi({
			shape: t,
			style: {
				stroke: r,
				strokeWidth: i,
				strokeDashArray: a
			}
		}), r !== void 0 && (e.shapeStroke = r), i !== void 0 && (e.shapeStrokeWidth = i), a !== void 0 && (e.shapeStrokeDashArray = a), !n) return;
		let o = this.dependencies.layoutController.resolveCurrentDimensions({ group: e });
		this.dependencies.layoutController.applyCurrentLayout({
			group: e,
			shape: t,
			text: n,
			width: o.width,
			height: o.height
		});
	}
	_applyTextStyleAndLayout({ group: e, shape: t, text: n, placement: r, style: i, height: a, alignH: o }) {
		this.dependencies.textNodeController.applyUpdates({
			textNode: n,
			textStyle: i,
			align: o
		}), this.dependencies.layoutController.applyCurrentLayout({
			group: e,
			shape: t,
			text: n,
			placement: r,
			height: a,
			alignH: o
		});
	}
	_applyTextAlignAndLayout({ group: e, shape: t, text: n, width: r, height: i, alignH: a, alignV: o }) {
		this.dependencies.textNodeController.applyUpdates({
			textNode: n,
			align: a
		}), this.dependencies.layoutController.applyCurrentLayout({
			group: e,
			shape: t,
			text: n,
			width: r,
			height: i,
			alignH: a,
			alignV: o
		});
	}
	_applyPreparedUpdate({ preparedUpdate: e }) {
		this._applyPreparedTextState({ preparedUpdate: e }), this._replacePreparedShapeNode({ preparedUpdate: e }), this._applyPreparedMetadata({ preparedUpdate: e }), this._applyPreparedLayout({ preparedUpdate: e }), this._syncPreparedPostLayoutState({ preparedUpdate: e });
	}
	_applyPreparedTextState({ preparedUpdate: e }) {
		let { current: t, text: n } = e;
		nt({ group: t.group }), t.text.set(Wl), this.dependencies.textNodeController.applyUpdates({
			textNode: t.text,
			text: n.value,
			textStyle: n.style,
			align: n.horizontalAlign,
			syncLineStylesWithText: n.syncLineStylesWithText
		});
	}
	_replacePreparedShapeNode({ preparedUpdate: e }) {
		let { current: t, next: n } = e;
		t.group.replaceShapeNode(t.shapeIndex, t.shape, n.shape);
	}
	_applyPreparedMetadata({ preparedUpdate: e }) {
		let { current: t, next: n, text: r, layout: i } = e;
		at({
			group: t.group,
			metadata: {
				presetKey: n.presetKey,
				presetCanRound: n.presetCanRound,
				width: i.width,
				height: i.height,
				manualWidth: n.manual.width,
				manualHeight: n.manual.height,
				replaceBoxWidth: n.replaceBox.width,
				replaceBoxHeight: n.replaceBox.height,
				shapeTextAutoExpand: n.shapeTextAutoExpand,
				alignH: r.horizontalAlign,
				alignV: r.verticalAlign,
				padding: n.userPadding,
				style: n.style,
				rounding: n.rounding
			}
		});
	}
	_applyPreparedLayout({ preparedUpdate: e }) {
		let { current: t, next: n, text: r, layout: i, placement: a } = e;
		this.dependencies.layoutController.applyCurrentLayout({
			group: t.group,
			shape: n.shape,
			text: t.text,
			placement: a,
			width: i.width,
			height: i.height,
			alignH: r.horizontalAlign,
			alignV: r.verticalAlign,
			internalShapeTextInset: i.internalShapeTextInset,
			resolveInternalShapeTextInset: i.resolveInternalShapeTextInset,
			preserveAspectRatio: i.preserveAspectRatio,
			expandShapeHeightToFitText: i.expandShapeHeightToFitText,
			changedPadding: i.changedPadding
		});
	}
	_syncPreparedPostLayoutState({ preparedUpdate: e }) {
		let { current: t, next: n, layout: r, placement: i } = e;
		n.shouldFitReplacementToPreset && (t.group.shapeManualBaseWidth = Math.max(1, t.group.shapeBaseWidth ?? r.width), t.group.shapeManualBaseHeight = Math.max(1, t.group.shapeBaseHeight ?? r.height)), t.text.isEditing && this.dependencies.editingPlacements.set(t.group, i);
	}
	_commitLifecycleMutation({ lifecycle: e, withoutSave: t, mutate: n }) {
		this._beginMutation();
		try {
			n(), this.dependencies.lifecycleController.fireBefore({ lifecycle: e }), this.dependencies.canvas.requestRenderAll();
		} finally {
			this._endMutation({ withoutSave: t });
		}
		this.dependencies.lifecycleController.fireUpdated({ lifecycle: e });
	}
	_beginMutation() {
		this.dependencies.historyManager.suspendHistory();
	}
	_endMutation({ withoutSave: e }) {
		this.dependencies.historyManager.resumeHistory(), e || this.dependencies.historyManager.saveState();
	}
	_isOnCanvas({ group: e }) {
		let t = this.dependencies.canvas.getObjects();
		for (let n = 0; n < t.length; n += 1) if (t[n] === e) return !0;
		return !1;
	}
}, Jl = /* @__PURE__ */ new Set([
	"align",
	"color",
	"strokeColor",
	"strokeWidth",
	"underline",
	"strikethrough",
	"opacity"
]), Yl = (e) => {
	if (e !== void 0) return JSON.parse(JSON.stringify(e));
}, Xl = class {
	constructor({ resolveTextManager: e }) {
		this.resolveTextManager = e, this.internalUpdates = /* @__PURE__ */ new WeakSet();
	}
	create({ text: e, textStyle: t, width: n, align: r, opacity: i }) {
		let a = t ?? {}, o = {
			...a,
			text: e ?? a.text ?? "",
			align: r,
			autoExpand: !1,
			splitByGrapheme: !1,
			width: Math.max(1, n),
			left: 0,
			top: 0
		};
		typeof i == "number" && a.opacity === void 0 && (o.opacity = i);
		let s = this._getTextManager().addText(o, {
			withoutAdding: !0,
			withoutSave: !0,
			withoutSelection: !0,
			emitLifecycleEvents: !1
		});
		return s.set({
			shapeNodeType: "text",
			splitByGrapheme: !1
		}), tt({ text: s }), s;
	}
	applyUpdates({ textNode: e, text: t, textStyle: n, align: r, syncLineStylesWithText: i }) {
		let a = this._resolveStyleUpdates({
			text: t,
			textStyle: n,
			align: r
		});
		this.internalUpdates.add(e);
		try {
			let t = this._getTextManager().updateText({
				target: e,
				style: a,
				skipRender: !0,
				withoutSave: !0,
				emitLifecycleEvents: !1,
				syncLineStylesWithText: i
			});
			t && (t.autoExpand = !1);
		} finally {
			this.internalUpdates.delete(e);
		}
		e.autoExpand = !1;
	}
	resolveCurrentStyle({ group: e, textNode: t }) {
		let n = t;
		return {
			align: this._resolveCurrentAlign({
				group: e,
				textAlign: t.textAlign
			}),
			backgroundColor: typeof t.backgroundColor == "string" ? t.backgroundColor : void 0,
			backgroundOpacity: t.backgroundOpacity,
			bold: t.fontWeight === "bold",
			color: typeof t.fill == "string" ? t.fill : void 0,
			fontFamily: t.fontFamily,
			fontSize: t.fontSize,
			italic: t.fontStyle === "italic",
			lineFontDefaults: Yl(t.lineFontDefaults),
			opacity: t.opacity,
			paddingBottom: t.paddingBottom,
			paddingLeft: t.paddingLeft,
			paddingRight: t.paddingRight,
			paddingTop: t.paddingTop,
			radiusBottomLeft: t.radiusBottomLeft,
			radiusBottomRight: t.radiusBottomRight,
			radiusTopLeft: t.radiusTopLeft,
			radiusTopRight: t.radiusTopRight,
			splitByGrapheme: !1,
			strokeColor: typeof t.stroke == "string" ? t.stroke : void 0,
			strokeWidth: t.strokeWidth,
			strikethrough: !!t.linethrough,
			styles: Yl(t.styles),
			underline: !!t.underline,
			uppercase: !!n.uppercase
		};
	}
	hasSizeAffectingStyleChanges({ textStyle: e }) {
		if (!e) return !1;
		let t = Object.keys(e);
		for (let e = 0; e < t.length; e += 1) if (!Jl.has(t[e])) return !0;
		return !1;
	}
	isInternalUpdate({ textNode: e }) {
		return this.internalUpdates.has(e);
	}
	_resolveStyleUpdates({ text: e, textStyle: t, align: n }) {
		let r = {};
		if (t) {
			let e = Object.keys(t);
			for (let n = 0; n < e.length; n += 1) {
				let i = e[n];
				r[i] = t[i];
			}
		}
		return e !== void 0 && (r.text = e), n && (r.align = n), r.autoExpand = !1, r.splitByGrapheme = !1, r;
	}
	_resolveCurrentAlign({ group: e, textAlign: t }) {
		return t === "left" || t === "center" || t === "right" || t === "justify" ? t : e.shapeAlignHorizontal ?? "center";
	}
	_getTextManager() {
		let e = this.resolveTextManager();
		if (!e) throw Error("Shape text operation requires initialized TextManager");
		return e;
	}
}, Zl = 1e-9;
function Ql({ group: e }) {
	return [
		e.flipX,
		e.flipY,
		e.locked,
		e.lockScalingX,
		e.lockScalingY
	].some(Boolean) ? !0 : ![
		e.width,
		e.height,
		e.scaleX,
		e.scaleY,
		e.angle ?? 0,
		e.skewX ?? 0,
		e.skewY ?? 0
	].every(Number.isFinite) || e.width <= 0 || e.height <= 0 || e.scaleX <= 0 || e.scaleY <= 0 || Math.abs(e.scaleX - 1) > Zl || Math.abs(e.scaleY - 1) > Zl || Math.abs(e.angle ?? 0) > Zl || Math.abs(e.skewX ?? 0) > Zl || Math.abs(e.skewY ?? 0) > Zl;
}
function $l({ selection: e }) {
	let t = [];
	for (let n of e.getObjects()) {
		if (!L(n)) continue;
		if (n.parent || Ql({ group: n })) return null;
		let { shape: e, text: r } = I({ group: n });
		if (!e || !r) return null;
		t.push(n);
	}
	return t.length > 0 ? t : null;
}
function eu({ selection: e }) {
	let t = $l({ selection: e }), n = e.getObjects();
	return t && t.length >= 2 && t.length === n.length ? t : null;
}
function tu({ scaleX: e, scaleY: t }) {
	return Number.isFinite(e) && Number.isFinite(t) && e > 0 && t > 0;
}
var nu = class {
	constructor({ editor: e }) {
		this.editor = e, lt(), this.scalingController = new Ms({ canvas: e.canvas }), this.editingController = new Ns({ canvas: e.canvas }), this.editingPlacements = /* @__PURE__ */ new WeakMap(), this.lifecycleController = new Jc({ canvas: e.canvas }), this.layoutController = new qc({ editor: this.editor }), this.textNodeController = new Xl({ resolveTextManager: () => this.editor.textManager }), this.groupFactory = new Ra({
			layoutController: this.layoutController,
			textNodeController: this.textNodeController
		}), this.mutationController = new ql({ dependencies: {
			canvas: this.editor.canvas,
			canvasManager: this.editor.canvasManager,
			historyManager: this.editor.historyManager,
			lifecycleController: this.lifecycleController,
			layoutController: this.layoutController,
			textNodeController: this.textNodeController,
			editingPlacements: this.editingPlacements
		} }), this.eventController = new Kc({ dependencies: {
			editor: this.editor,
			scalingController: this.scalingController,
			editingController: this.editingController,
			lifecycleController: this.lifecycleController,
			layoutController: this.layoutController,
			textNodeController: this.textNodeController,
			editingPlacements: this.editingPlacements
		} }), this.eventController.bind();
	}
	async add({ presetKey: e = Me, options: t = {} } = {}) {
		let n = Le({ presetKey: e });
		if (!n) return null;
		let { left: r, top: i, originX: a, originY: o, withoutAdding: s, withoutSelection: c, withoutSave: l } = t, u = await this.groupFactory.createForAdd({
			basePreset: n,
			options: t
		}), d = {
			shape: u,
			presetKey: u.shapePresetKey ?? n.key,
			options: t
		};
		if (r === void 0 && i === void 0) this.editor.canvasManager.centerObjectToMontageArea({ object: u });
		else {
			let e = this.editor.canvasManager.resolveObjectPlacement({
				object: u,
				left: r,
				top: i,
				originX: a,
				originY: o,
				fallbackPoint: this.editor.canvasManager.getMontageAreaSceneCenter()
			});
			this.editor.canvasManager.applyObjectPlacement({
				object: u,
				placement: e
			});
		}
		if (s) return this.editor.canvas.fire("editor:shape-added", d), u;
		this._beginMutation();
		try {
			this.editor.canvas.add(u), c || this.editor.canvas.setActiveObject(u), this.editor.canvas.requestRenderAll();
		} finally {
			this._endMutation({ withoutSave: l });
		}
		return this.editor.canvas.fire("editor:shape-added", d), u;
	}
	async update({ target: e, presetKey: t, options: n = {} } = {}) {
		return this.mutationController.update({
			target: e,
			presetKey: t,
			options: n
		});
	}
	remove({ target: e, withoutSave: t } = {}) {
		return this.mutationController.remove({
			target: e,
			withoutSave: t
		});
	}
	setFill({ target: e, fill: t, withoutSave: n }) {
		return this.mutationController.setFill({
			target: e,
			fill: t,
			withoutSave: n
		});
	}
	setStroke({ target: e, stroke: t, strokeWidth: n, dash: r, withoutSave: i }) {
		return this.mutationController.setStroke({
			target: e,
			stroke: t,
			strokeWidth: n,
			dash: r,
			withoutSave: i
		});
	}
	setOpacity({ target: e, opacity: t, applyToText: n = !0, withoutSave: r }) {
		return this.mutationController.setOpacity({
			target: e,
			opacity: t,
			applyToText: n,
			withoutSave: r
		});
	}
	getTextNode({ target: e } = {}) {
		let t = pt({
			canvas: this.editor.canvas,
			target: e
		});
		if (!t) return null;
		let { text: n } = I({ group: t });
		return n || null;
	}
	updateTextStyle({ target: e, style: t = {}, withoutSave: n } = {}) {
		return this.mutationController.updateTextStyle({
			target: e,
			style: t,
			withoutSave: n
		});
	}
	setTextAlign({ target: e, horizontal: t, vertical: n, withoutSave: r }) {
		return this.mutationController.setTextAlign({
			target: e,
			horizontal: t,
			vertical: n,
			withoutSave: r
		});
	}
	async setRounding({ target: e, rounding: t, withoutSave: n }) {
		return this.mutationController.setRounding({
			target: e,
			rounding: t,
			withoutSave: n
		});
	}
	commitRehydratedShapeLayout({ target: e, textScale: t = 1, shapeTextAutoExpand: n }) {
		return this.mutationController.commitRehydratedShapeLayout({
			target: e,
			textScale: t,
			shapeTextAutoExpand: n
		});
	}
	supportsActiveSelectionScaling({ selection: e }) {
		return eu({ selection: e }) !== null;
	}
	resolveSupportedActiveSelectionShapeChildren({ selection: e }) {
		return $l({ selection: e });
	}
	createActiveSelectionScaleDomainSource({ selection: e, transform: t }) {
		let n = $l({ selection: e });
		if (!n || t.target !== e) return null;
		try {
			return n.forEach((e) => this.lifecycleController.beginResize({ group: e })), this.scalingController.createActiveSelectionScaleDomainSource({
				selection: e,
				targets: n,
				transform: t
			});
		} catch (t) {
			throw this.clearActiveSelectionScalePreviewState({
				children: n,
				selection: e
			}), t;
		}
	}
	resolveActiveSelectionScaleControlMode({ selection: e, transform: t, event: n }) {
		return t.target !== e || !_e({
			target: e,
			transform: t
		}) ? null : ve({ shiftKey: !!(n && "shiftKey" in n && n.shiftKey) });
	}
	applyActiveSelectionScalePreview({ selection: e, transform: t, event: n }) {
		let r = eu({ selection: e });
		if (!r || t.target !== e) return null;
		for (let e of r) this.lifecycleController.beginResize({ group: e });
		this.scalingController.handleObjectScaling({
			target: e,
			transform: t,
			e: n
		});
		let i = this.scalingController.resolveActiveSelectionCommittedScale({ selection: e });
		if (!tu(i)) throw Error("ShapeManager должен применить положительный конечный масштаб общего выделения");
		return t.scaleX = e.scaleX, t.scaleY = e.scaleY, i;
	}
	clearActiveSelectionScalePreviewState({ selection: e, children: t }) {
		if (t.length < 1) throw Error("Для очистки общего скейлинга нужен хотя бы один дочерний шейп");
		let n = [];
		for (let e of t) {
			if (!L(e)) throw Error("Доменную сессию шейпов можно очистить только для shape-групп");
			n.push(e);
		}
		this.scalingController.clearActiveSelectionState({ selection: e });
		for (let e of n) this.scalingController.clearState({ group: e }), this.lifecycleController.cancelResize({ group: e });
	}
	prepareActiveSelectionScaleCommit({ children: e, selection: t, transform: n }) {
		let r = e.map((e) => {
			if (!L(e)) throw Error("Фиксация смешанного состава принимает только шейпы");
			return e;
		});
		if (r.length === 0) throw Error("Фиксация смешанного состава требует хотя бы один шейп");
		let i = r.map((e) => Ss({ group: e })), { scaleX: a, scaleY: o } = this.scalingController.resolveActiveSelectionCommittedScale({ selection: t });
		try {
			return this._materializeActiveSelectionShapeGroups({
				groups: r,
				scaleX: a,
				scaleY: o,
				transform: n
			}), Object.freeze({
				groups: Object.freeze([...r]),
				selection: t
			});
		} catch (e) {
			try {
				ws({ snapshots: i });
			} catch {}
			throw e;
		}
	}
	finishActiveSelectionScaleCommit({ commit: e }) {
		let t = [];
		try {
			this.scalingController.clearActiveSelectionState({ selection: e.selection });
		} catch (e) {
			t.push(e);
		}
		for (let n of e.groups) {
			try {
				this.scalingController.clearState({ group: n });
			} catch (e) {
				t.push(e);
			}
			try {
				this.lifecycleController.finishResize({ group: n });
			} catch (e) {
				t.push(e);
			}
		}
		let [n] = t;
		if (t.length > 0) throw n;
	}
	_materializeActiveSelectionShapeGroups({ groups: e, scaleX: t, scaleY: n, transform: r }) {
		for (let i of e) {
			let e = this.editor.canvasManager.getObjectPlacement({ object: i });
			if (!this.scalingController.materializeActiveSelectionGroupScaling({
				group: i,
				scaleX: t,
				scaleY: n,
				transform: r
			})) throw Error("Каждый измеренный шейп должен зафиксировать рассчитанные размеры");
			this.editor.canvasManager.applyObjectPlacement({
				object: i,
				placement: e
			}), i.setCoords();
		}
	}
	destroy() {
		this.eventController.destroy();
	}
	_beginMutation() {
		this.editor.historyManager.suspendHistory();
	}
	_endMutation({ withoutSave: e }) {
		this.editor.historyManager.resumeHistory(), e || this.editor.historyManager.saveState();
	}
}, ru = ({ rootObject: t, enableEvented: n = !0 }) => {
	let r = [{
		object: t,
		enableEvented: n
	}];
	for (let t = 0; t < r.length; t += 1) {
		let n = r[t], i = { id: `${n.object.type}-${E()}` };
		n.enableEvented && (i.evented = !0), n.object.set(i);
		let a = null, o = !1;
		if (n.object instanceof e ? (a = n.object.getObjects(), o = !0) : n.object instanceof c && (a = n.object.getObjects()), a) for (let e = 0; e < a.length; e += 1) r.push({
			object: a[e],
			enableEvented: o
		});
	}
}, iu = class {
	constructor({ editor: e }) {
		this.editor = e, this.clipboard = null;
	}
	copy() {
		let { canvas: e } = this.editor, t = e.getActiveObject();
		!t || t.locked || this._copyObjectToClipboard({
			object: t,
			method: "copy"
		});
	}
	async _cloneObject({ object: e }) {
		let t = this._captureCloneGeometry({ object: e }), n = await e.clone(Fn);
		return this._restoreCloneGeometry({
			clonedObject: n,
			geometry: t
		}), this._prepareObjectClone({ clonedObject: n }), n;
	}
	_captureCloneGeometry({ object: e }) {
		let t = [e], n = [];
		for (let e = 0; e < t.length; e += 1) {
			let r = t[e];
			if (!r) throw Error("Исходный объект должен существовать до клонирования");
			let i = r instanceof c ? r.getObjects() : [];
			n.push({
				angle: r.angle,
				childCount: i.length,
				height: r.height,
				left: r.left,
				scaleX: r.scaleX,
				scaleY: r.scaleY,
				skewX: r.skewX,
				skewY: r.skewY,
				strokeWidth: r.strokeWidth,
				top: r.top,
				width: r.width
			}), t.push(...i);
		}
		return n;
	}
	_restoreCloneGeometry({ clonedObject: e, geometry: t }) {
		let n = [e];
		for (let e = 0; e < t.length; e += 1) {
			let r = t[e], i = n[e];
			if (!r || !i) throw Error("Структура клона должна совпадать с исходным объектом");
			i.set({
				angle: r.angle,
				left: r.left,
				scaleX: r.scaleX,
				scaleY: r.scaleY,
				skewX: r.skewX,
				skewY: r.skewY,
				strokeWidth: r.strokeWidth,
				top: r.top
			}), i.width = r.width, i.height = r.height, i.dirty = !0;
			let a = i instanceof c ? i.getObjects() : [];
			if (r.childCount !== a.length) throw Error("Количество объектов внутри клона должно совпадать с исходным объектом");
			n.push(...a);
		}
		if (n.length !== t.length) throw Error("Структура клона должна совпадать с исходным объектом");
		for (let e of n) e.setCoords();
	}
	_detachObjectCustomData({ object: e }) {
		let { customData: t } = e;
		!t || typeof t != "object" || (e.customData = JSON.parse(JSON.stringify(t)));
	}
	_prepareObjectClone({ clonedObject: t }) {
		let { prepareObjectClone: n } = this.editor.options, r = [t];
		for (let t = 0; t < r.length; t += 1) {
			let i = r[t];
			if (this._detachObjectCustomData({ object: i }), n?.(i), !(i instanceof e) && !(i instanceof c)) continue;
			let a = i.getObjects();
			for (let e = 0; e < a.length; e += 1) r.push(a[e]);
		}
	}
	async _copyObjectToClipboard({ object: e, method: t }) {
		let { canvas: n, errorManager: r } = this.editor;
		try {
			let r = await this._cloneObject({ object: e });
			return this._materializeCloneGeometry({ clonedObject: r }), this.clipboard = r, n.fire("editor:object-copied", { object: r }), this._copyToSystemClipboardInBackground({
				object: r,
				method: t
			}), !0;
		} catch (e) {
			return r.emitError({
				origin: "ClipboardManager",
				method: "_cloneToInternalClipboard",
				code: "CLONE_FAILED",
				message: "Ошибка клонирования объекта для внутреннего буфера",
				data: e
			}), !1;
		}
	}
	_copyToSystemClipboardInBackground({ object: e, method: t }) {
		this._copyToSystemClipboard(e).catch((e) => {
			this.editor.errorManager.emitWarning({
				origin: "ClipboardManager",
				method: t,
				code: "COPY_FAILED",
				message: "Ошибка копирования объекта в системный буфер обмена",
				data: e
			});
		});
	}
	async _copyToSystemClipboard(e) {
		let { errorManager: t } = this.editor;
		if (typeof ClipboardItem > "u" || !navigator.clipboard) return t.emitWarning({
			origin: "ClipboardManager",
			method: "_copyToSystemClipboard",
			code: "CLIPBOARD_NOT_SUPPORTED",
			message: "navigator.clipboard не поддерживается в этом браузере или отсутствует HTTPS-соединение."
		}), !1;
		try {
			let t = e.toObject(Fn), n = JSON.stringify(t);
			return e.type === "image" ? this._copyImageToClipboard(e, n) : this._copyTextToClipboard(n);
		} catch (e) {
			return t.emitError({
				origin: "ClipboardManager",
				method: "_copyToSystemClipboard",
				code: "COPY_FAILED",
				message: "Ошибка копирования объекта",
				data: e
			}), !1;
		}
	}
	async _copyImageToClipboard(e, t) {
		try {
			let t = e.toCanvasElement({ enableRetinaScaling: !1 }).toDataURL(), n = t.slice(5).split(";")[0], r = t.split(",")[1], i = atob(r), a = new Uint8Array(i.length);
			for (let e = 0; e < i.length; e += 1) a[e] = i.charCodeAt(e);
			let o = new Blob([a.buffer], { type: n }), s = new ClipboardItem({ [n]: o });
			return await navigator.clipboard.write([s]), console.info("Image copied to clipboard successfully"), !0;
		} catch (e) {
			return this.editor.errorManager.emitWarning({
				origin: "ClipboardManager",
				method: "_copyImageToClipboard",
				code: "CLIPBOARD_WRITE_IMAGE_FAILED",
				message: `Ошибка записи изображения в буфер обмена, выполняется fallback к текстовому копированию: ${e}`,
				data: e
			}), this._copyTextToClipboard(t);
		}
	}
	async _copyTextToClipboard(e) {
		try {
			let t = `${Pn}${e}`;
			return await navigator.clipboard.writeText(t), console.info("Text copied to clipboard successfully"), !0;
		} catch (e) {
			let { errorManager: t } = this.editor;
			return t.emitWarning({
				origin: "ClipboardManager",
				method: "_copyTextToClipboard",
				code: "CLIPBOARD_WRITE_TEXT_FAILED",
				message: `Ошибка записи текста в буфер обмена: ${e}`,
				data: e
			}), !1;
		}
	}
	_addClonedObjectToCanvas(t) {
		let { canvas: n, historyManager: r } = this.editor;
		if (n.discardActiveObject(), t instanceof e) {
			r.suspendHistory(), t.canvas = n, t.forEachObject((e) => {
				n.add(e);
			}), n.setActiveObject(t), n.requestRenderAll(), r.resumeHistory(), r.saveState();
			return;
		}
		n.add(t), n.setActiveObject(t), n.requestRenderAll();
	}
	_materializeCloneGeometry({ clonedObject: t }) {
		let { shapeManager: n, textManager: r } = this.editor;
		if (t instanceof e) {
			t.forEachObject((e) => {
				r.commitStandaloneTextScale({ target: e }), n.commitRehydratedShapeLayout({ target: e });
			}), t.setCoords();
			return;
		}
		r.commitStandaloneTextScale({ target: t }), n.commitRehydratedShapeLayout({ target: t });
	}
	async _handleImageImport(e) {
		let { canvas: t, errorManager: n } = this.editor, r = !1, i = !1, a = null, o = null, s = new Promise((e, t) => {
			a = (t) => {
				i || (i = !0, e(t ?? null));
			}, o = (e) => {
				i || (i = !0, t(e));
			};
		});
		if (t.fire("editor:external-image-paste-pending", {
			imageSource: e,
			defer: () => (r = !0, {
				resolve: a,
				reject: o
			})
		}), !r) {
			await this._importExternalImage({ source: e });
			return;
		}
		try {
			let t = await s;
			if (t === null) {
				await this._importExternalImage({ source: e });
				return;
			}
			await this._importExternalImage({
				source: e,
				importOptions: t
			});
		} catch (e) {
			n.emitError({
				origin: "ClipboardManager",
				method: "_handleImageImport",
				code: "EXTERNAL_PASTE_DEFERRED_REJECTED",
				message: "Вставка изображения из буфера обмена была отменена или завершилась ошибкой",
				data: { error: e }
			});
		}
	}
	async _importExternalImage({ source: e, importOptions: t = {} }) {
		let n = {
			source: e,
			...t,
			fromClipboard: !0
		}, r = await this.editor.imageManager.importImage(n), i = r?.image, a = r?.source ?? e;
		i && this.editor.canvas.fire("editor:object-pasted", {
			imageSource: a,
			fromInternalClipboard: !1,
			object: i
		});
	}
	async copyPaste(e) {
		let { canvas: t } = this.editor, n = e || t.getActiveObject();
		if (!n || n.locked) return !1;
		try {
			let e = await this._cloneObject({ object: n });
			return ru({ rootObject: e }), e.set({
				left: e.left + 10,
				top: e.top + 10
			}), this._materializeCloneGeometry({ clonedObject: e }), this._addClonedObjectToCanvas(e), t.fire("editor:object-duplicated", {
				targetObject: n,
				clonedObject: e
			}), !0;
		} catch (e) {
			let { errorManager: t } = this.editor;
			return t.emitError({
				origin: "ClipboardManager",
				method: "copyPaste",
				code: "COPY_PASTE_FAILED",
				message: "Ошибка создания копии объекта",
				data: e
			}), !1;
		}
	}
	async cut() {
		let { canvas: t, deletionManager: n, errorManager: r } = this.editor, i = t.getActiveObject();
		if (!i || i.locked) return !1;
		try {
			let t = i instanceof e ? i.getObjects() : [i], r = n.resolveDeleteTargets({ objects: t });
			if (!r.deletableObjects.length) return n.deleteSelectedObjects({ objects: t }), !1;
			let a = this._createCutSourceObject({
				activeObject: i,
				objectsToCut: r.deletableObjects
			});
			return !a || !await this._copyObjectToClipboard({
				object: a,
				method: "cut"
			}) ? !1 : !!n.deleteSelectedObjects({ objects: t });
		} catch (e) {
			return r.emitError({
				origin: "ClipboardManager",
				method: "cut",
				code: "CUT_FAILED",
				message: "Ошибка вырезания объекта",
				data: e
			}), !1;
		}
	}
	_createCutSourceObject({ activeObject: t, objectsToCut: n }) {
		return t instanceof e ? n.length ? n.length === t.getObjects().length ? t : n.length === 1 ? n[0] : new e(n, { canvas: this.editor.canvas }) : null : t;
	}
	async handlePasteEvent({ clipboardData: e }) {
		if (!e?.items?.length) {
			this.paste();
			return;
		}
		let t = e.getData("text/plain");
		if (t && t.startsWith("application/image-editor:")) {
			this.paste();
			return;
		}
		let { items: n } = e, r = n[n.length - 1], i = r.getAsFile();
		if (r.type !== "text/html" && i) {
			let e = new FileReader();
			e.onload = (e) => {
				e.target && this._handleImageImport(e.target.result).catch((e) => {
					this.editor.errorManager.emitError({
						origin: "ClipboardManager",
						method: "handlePasteEvent",
						code: "PASTE_IMAGE_FAILED",
						message: "Ошибка вставки изображения из буфера обмена",
						data: e
					});
				});
			}, e.readAsDataURL(i);
			return;
		}
		let a = e.getData("text/html");
		if (a) {
			let e = new DOMParser().parseFromString(a, "text/html").querySelector("img");
			if (e?.src) {
				this._handleImageImport(e.src).catch((e) => {
					this.editor.errorManager.emitError({
						origin: "ClipboardManager",
						method: "handlePasteEvent",
						code: "PASTE_HTML_IMAGE_FAILED",
						message: "Ошибка вставки изображения из HTML",
						data: e
					});
				});
				return;
			}
		}
		this.paste();
	}
	async paste() {
		let { canvas: e } = this.editor;
		if (!this.clipboard) return !1;
		try {
			let t = await this._cloneObject({ object: this.clipboard });
			return e.discardActiveObject(), ru({ rootObject: t }), t.set({
				left: t.left + 10,
				top: t.top + 10
			}), this._materializeCloneGeometry({ clonedObject: t }), this._addClonedObjectToCanvas(t), e.fire("editor:object-pasted", {
				fromInternalClipboard: !0,
				clipboardObject: this.clipboard,
				object: t
			}), !0;
		} catch (e) {
			let { errorManager: t } = this.editor;
			return t.emitError({
				origin: "ClipboardManager",
				method: "paste",
				code: "PASTE_FAILED",
				message: "Ошибка вставки объекта",
				data: e
			}), !1;
		}
	}
}, au = class t {
	constructor({ editor: e }) {
		this.editor = e;
	}
	lockObject({ object: e, skipInnerObjects: n, withoutSave: r } = {}) {
		let { canvas: i, historyManager: a } = this.editor, o = e || i.getActiveObject(), s = ut({ target: o }) ?? o;
		if (!s || s.locked) return;
		let c = {
			lockMovementX: !0,
			lockMovementY: !0,
			lockRotation: !0,
			lockScalingX: !0,
			lockScalingY: !0,
			lockSkewingX: !0,
			lockSkewingY: !0,
			editable: !1,
			locked: !0
		}, l = n ? [s] : t._collectLockTargets({ object: s });
		t._exitEditingInTextboxes({ objects: l });
		for (let e = 0; e < l.length; e += 1) l[e].set(c);
		i.renderAll(), r || a.saveState(), i.fire("editor:object-locked", {
			object: s,
			skipInnerObjects: n,
			withoutSave: r
		});
	}
	unlockObject({ object: e, withoutSave: n } = {}) {
		let { canvas: r, historyManager: i } = this.editor, a = e || r.getActiveObject(), o = ut({ target: a }) ?? a;
		if (!o) return;
		let s = {
			lockMovementX: !1,
			lockMovementY: !1,
			lockRotation: !1,
			lockScalingX: !1,
			lockScalingY: !1,
			lockSkewingX: !1,
			lockSkewingY: !1,
			editable: !0,
			locked: !1
		}, c = t._collectLockTargets({ object: o });
		for (let e = 0; e < c.length; e += 1) c[e].set(s);
		r.renderAll(), n || i.saveState(), r.fire("editor:object-unlocked", {
			object: o,
			withoutSave: n
		});
	}
	static _isGroupOrSelection(t) {
		return t instanceof e || t instanceof c;
	}
	static _collectLockTargets({ object: e }) {
		let n = [e];
		if (!t._isGroupOrSelection(e)) return n;
		let r = e.getObjects();
		for (let e = 0; e < r.length; e += 1) {
			let i = r[e], a = t._collectLockTargets({ object: i });
			for (let e = 0; e < a.length; e += 1) n.push(a[e]);
		}
		return n;
	}
	static _exitEditingInTextboxes({ objects: e }) {
		for (let t = 0; t < e.length; t += 1) {
			let n = e[t];
			!(n instanceof _) || !n.isEditing || n.exitEditing();
		}
	}
}, ou = class {
	constructor({ editor: e }) {
		this.editor = e;
	}
	_getObjectsToGroup(t) {
		if (Array.isArray(t)) return t.length > 0 ? t : null;
		let n = t || this.editor.canvas.getActiveObject();
		return !n || !(n instanceof e) ? null : n.getObjects();
	}
	_getGroupsToUngroup(t) {
		if (Array.isArray(t)) {
			let e = t.filter((e) => e instanceof c);
			return e.length > 0 ? e : null;
		}
		if (t instanceof e) {
			let e = t.getObjects().filter((e) => e instanceof c);
			return e.length > 0 ? e : null;
		}
		let n = t || this.editor.canvas.getActiveObject();
		if (!n) return null;
		if (n instanceof e) {
			let e = n.getObjects().filter((e) => e instanceof c);
			return e.length > 0 ? e : null;
		}
		return n instanceof c ? [n] : null;
	}
	_materializeUngroupedObject({ object: e }) {
		let { shapeManager: t, textManager: n } = this.editor, r = { target: e };
		e.shapeComposite === !0 && (r.textScale = Math.abs(e.scaleX ?? 1) || 1);
		let i = n.commitStandaloneTextScale({ target: e }), a = t.commitRehydratedShapeLayout(r);
		!i && !a && e.setCoords();
	}
	group({ target: e, withoutSave: t = !1 } = {}) {
		let { canvas: n, historyManager: r } = this.editor, i = this._getObjectsToGroup(e);
		if (!i) return null;
		try {
			r.suspendHistory();
			let e = new c(i, { id: `group-${E()}` });
			i.forEach((e) => n.remove(e)), n.add(e), n.setActiveObject(e), n.requestRenderAll();
			let a = {
				group: e,
				withoutSave: t
			};
			return n.fire("editor:objects-grouped", a), a;
		} finally {
			r.resumeHistory(), t || r.saveState();
		}
	}
	ungroup({ target: t, withoutSave: n = !1 } = {}) {
		let { canvas: r, historyManager: i } = this.editor, a = this._getGroupsToUngroup(t);
		if (!a) return null;
		try {
			i.suspendHistory();
			let t = [];
			a.forEach((e) => {
				let n = e.removeAll();
				r.remove(e), n.forEach((e) => {
					this._materializeUngroupedObject({ object: e }), r.add(e), t.push(e);
				});
			});
			let o = new e(t, { canvas: r });
			r.setActiveObject(o), r.requestRenderAll();
			let s = {
				selection: o,
				ungroupedObjects: t,
				withoutSave: n
			};
			return r.fire("editor:objects-ungrouped", s), s;
		} finally {
			i.resumeHistory(), n || i.saveState();
		}
	}
}, su = {
	IMAGE_MANAGER: {
		INVALID_CONTENT_TYPE: "INVALID_CONTENT_TYPE",
		INVALID_SOURCE_TYPE: "INVALID_SOURCE_TYPE",
		IMPORT_FAILED: "IMPORT_FAILED",
		IMAGE_RESIZE_WARNING: "IMAGE_RESIZE_WARNING",
		NO_OBJECT_SELECTED: "NO_OBJECT_SELECTED",
		IMAGE_EXPORT_FAILED: "IMAGE_EXPORT_FAILED",
		INITIAL_STATE_LOAD_FAILED: "INITIAL_STATE_LOAD_FAILED"
	},
	CLIPBOARD_MANAGER: {
		CLIPBOARD_NOT_SUPPORTED: "CLIPBOARD_NOT_SUPPORTED",
		CLIPBOARD_WRITE_TEXT_FAILED: "CLIPBOARD_WRITE_TEXT_FAILED",
		CLIPBOARD_WRITE_IMAGE_FAILED: "CLIPBOARD_WRITE_IMAGE_FAILED",
		CLONE_FAILED: "CLONE_FAILED",
		COPY_FAILED: "COPY_FAILED",
		CUT_FAILED: "CUT_FAILED",
		PASTE_IMAGE_FAILED: "PASTE_IMAGE_FAILED",
		EXTERNAL_PASTE_DEFERRED_REJECTED: "EXTERNAL_PASTE_DEFERRED_REJECTED",
		PASTE_HTML_IMAGE_FAILED: "PASTE_HTML_IMAGE_FAILED",
		PASTE_FAILED: "PASTE_FAILED"
	},
	CANVAS_MANAGER: { NO_ACTIVE_OBJECT: "NO_ACTIVE_OBJECT" },
	CROP_MANAGER: {
		INVALID_IMAGE_TARGET: "CROP_INVALID_IMAGE_TARGET",
		LOCKED_IMAGE_TARGET: "CROP_LOCKED_IMAGE_TARGET"
	},
	HISTORY_MANAGER: {
		UNDO_ERROR: "UNDO_ERROR",
		REDO_ERROR: "REDO_ERROR"
	},
	SELECTION_MANAGER: { SCALE_COMMIT_FINALIZATION_FAILED: "SELECTION_SCALE_COMMIT_FINALIZATION_FAILED" },
	BACKGROUND_MANAGER: {
		BACKGROUND_CREATION_FAILED: "BACKGROUND_CREATION_FAILED",
		BACKGROUND_REMOVAL_FAILED: "BACKGROUND_REMOVAL_FAILED",
		NO_BACKGROUND_TO_REMOVE: "NO_BACKGROUND_TO_REMOVE",
		INVALID_GRADIENT_FORMAT: "INVALID_GRADIENT_FORMAT"
	},
	TEMPLATE_MANAGER: {
		NO_OBJECTS_SELECTED: "TEMPLATE_NO_OBJECTS_SELECTED",
		INVALID_TEMPLATE: "TEMPLATE_INVALID_TEMPLATE",
		INVALID_TARGET: "TEMPLATE_INVALID_TARGET",
		APPLY_FAILED: "TEMPLATE_APPLY_FAILED"
	}
}, cu = 1e-9;
function lu({ canvas: e, event: t, intentSource: n, mode: r, projection: i, target: a }) {
	let o = t.e;
	if (!o) return null;
	let s = r ?? pu({
		canvas: e,
		pointerEvent: o,
		projection: i
	}), c = mu({
		event: t,
		intentSource: n,
		mode: s,
		projection: i,
		target: a
	});
	return !c || c.x <= 0 || c.y <= 0 ? null : Object.freeze({
		intent: gu({
			mode: s,
			multipliers: c,
			pointerEvent: o
		}),
		mode: s
	});
}
function uu({ plan: e, projection: t, target: n, transform: r }) {
	let i = Hs({
		projectionMode: e.projectionMode,
		effectiveValues: e.effectiveValues
	});
	if (i.x <= 0 || i.y <= 0) throw Error("План прямоугольного скейлинга должен содержать положительные множители");
	n.set({
		scaleX: t.originalScales.x * i.x,
		scaleY: t.originalScales.y * i.y
	}), r.scaleX = n.scaleX, r.scaleY = n.scaleY, n.setPositionByOrigin(new p(t.fixedAnchor.x, t.fixedAnchor.y), r.originX, r.originY), n.setCoords();
}
function du({ projection: e, target: t }) {
	let n = hu({
		projection: e,
		target: t
	});
	if (!n || n.x <= 0 || n.y <= 0) throw Error("Прямоугольный скейлинг должен содержать положительные применённые множители");
	return n;
}
function fu({ mode: e, multipliers: t, plan: n, protectedStatePreserved: r, target: i, transform: a }) {
	let o = z({ object: i });
	if (!o) throw Error("Прямоугольному скейлингу нужны точные итоговые границы");
	let s = i.getPointByOrigin(a.originX, a.originY);
	return Object.freeze({
		bounds: o,
		fixedAnchor: vu({ point: s }),
		measuredValues: Vs({
			mode: e,
			multipliers: t
		}),
		domainVerdict: Object.freeze({
			x: _u({
				bounds: o,
				constraint: n.constraints.x,
				epsilon: n.verificationEpsilon
			}) ? "satisfied" : "blocked",
			y: _u({
				bounds: o,
				constraint: n.constraints.y,
				epsilon: n.verificationEpsilon
			}) ? "satisfied" : "blocked",
			protectedState: r ? "preserved" : "changed"
		})
	});
}
function pu({ canvas: e, pointerEvent: t, projection: n }) {
	let { controlKey: r } = n;
	if (r === "ml" || r === "mr") return "horizontal";
	if (r === "mt" || r === "mb") return "vertical";
	let { uniformScaling: i, uniScaleKey: a } = e, o = !!(a && Reflect.get(t, a) === !0);
	return i && !o || !i && o ? "uniform" : "free";
}
function mu({ event: e, intentSource: t, mode: n, projection: r, target: i }) {
	if (t === "pointer-projection") return e.scenePoint ? lc({
		projection: r,
		pointer: e.scenePoint,
		mode: n
	}) : null;
	let a = hu({
		projection: r,
		target: i
	});
	return !a || n === "uniform" && !yu({
		first: a.x,
		second: a.y
	}) ? null : a;
}
function hu({ projection: e, target: t }) {
	let n = t.scaleX / e.originalScales.x, r = t.scaleY / e.originalScales.y;
	return !Number.isFinite(n) || !Number.isFinite(r) ? null : Object.freeze({
		x: n,
		y: r
	});
}
function gu({ mode: e, multipliers: t, pointerEvent: n }) {
	return Object.freeze({
		projectionMode: e,
		values: Vs({
			mode: e,
			multipliers: t
		}),
		modifiers: Object.freeze({
			ctrlKey: "ctrlKey" in n && n.ctrlKey === !0,
			shiftKey: "shiftKey" in n && n.shiftKey === !0
		})
	});
}
function _u({ bounds: e, constraint: t, epsilon: n }) {
	return t ? Math.abs(e[t.candidate.edge] - t.expectedPosition) <= n : !0;
}
function vu({ point: e }) {
	if (!Number.isFinite(e.x) || !Number.isFinite(e.y)) throw Error("Точка прямоугольного скейлинга должна содержать конечные координаты");
	return Object.freeze({
		x: e.x,
		y: e.y
	});
}
function yu({ first: e, second: t }) {
	return Number.isFinite(e) && Number.isFinite(t) && Math.abs(e - t) <= cu;
}
//#endregion
//#region src/editor/snapping-manager/scaling/standard-scale-control.ts
var bu = Object.freeze(b.createObjectDefaultControls()), xu = 1e-9;
function Su({ first: e, second: t }) {
	return e === void 0 || t === void 0 ? e === t : Number.isFinite(e) && Number.isFinite(t) && Math.abs(e - t) <= xu;
}
function Cu({ target: e, transform: t }) {
	let n = e.controls[t.corner], r = bu[t.corner];
	return !n || !r || ![
		n.actionHandler === r.actionHandler,
		n.getActionHandler === r.getActionHandler,
		n.positionHandler === r.positionHandler,
		n.getTransformAnchorPoint === r.getTransformAnchorPoint,
		n.transformAnchorPoint === r.transformAnchorPoint
	].every(Boolean) ? !1 : [
		[n.x, r.x],
		[n.y, r.y],
		[n.offsetX, r.offsetX],
		[n.offsetY, r.offsetY]
	].every(([e, t]) => Su({
		first: e,
		second: t
	}));
}
function wu({ controlKey: e, pointerEvent: t, target: n }) {
	if (!(e === "ml" || e === "mr" || e === "mt" || e === "mb")) return !1;
	let r = n.canvas?.altActionKey;
	return r ? Reflect.get(t, r) === !0 : !1;
}
//#endregion
//#region src/editor/selection-manager/scaling/active-selection-scale-composition.ts
var Tu = 1e-9;
function Eu({ editor: e, target: t }) {
	return ju({ target: t }) ? "images" : e.shapeManager.supportsActiveSelectionScaling({ selection: t }) ? "shapes" : e.textManager.supportsActiveSelectionScaling({ selection: t }) ? "texts" : Mu({
		editor: e,
		target: t
	}) ? "mixed" : null;
}
function Du({ target: e }) {
	return [
		e.group,
		e.parent,
		e.flipX,
		e.flipY,
		e.locked,
		e.lockScalingX,
		e.lockScalingY
	].some(Boolean) || ![
		e.width,
		e.height,
		e.angle ?? 0,
		e.skewX ?? 0,
		e.skewY ?? 0
	].every(Number.isFinite) || e.width <= 0 || e.height <= 0 ? !1 : Math.abs(e.skewX ?? 0) <= Tu && Math.abs(e.skewY ?? 0) <= Tu;
}
function Ou({ compositionKind: e, target: t, transform: n }) {
	return Object.freeze({
		action: n.action,
		angle: t.angle ?? 0,
		composition: Nu({
			compositionKind: e,
			target: t
		}),
		controlKey: n.corner,
		flipX: !!t.flipX,
		flipY: !!t.flipY,
		height: t.height,
		lockScalingFlip: !!t.lockScalingFlip,
		originX: n.originX,
		originY: n.originY,
		skewX: t.skewX ?? 0,
		skewY: t.skewY ?? 0,
		targetOriginX: t.originX,
		targetOriginY: t.originY,
		width: t.width
	});
}
function ku({ protectedState: e, target: t, transform: n }) {
	return n.action === e.action && n.corner === e.controlKey && n.originX === e.originX && n.originY === e.originY && J({
		first: t.angle ?? 0,
		second: e.angle
	}) && J({
		first: t.skewX ?? 0,
		second: e.skewX
	}) && J({
		first: t.skewY ?? 0,
		second: e.skewY
	}) && !!t.flipX === e.flipX && !!t.flipY === e.flipY;
}
function Au({ mode: e, multipliers: t, protectedState: n, target: r, transform: i }) {
	return Lu({
		protectedState: n,
		target: r,
		transform: i
	}) ? e === "horizontal" ? J({
		first: t.y,
		second: 1
	}) : e === "vertical" ? J({
		first: t.x,
		second: 1
	}) : e === "uniform" ? J({
		first: t.x,
		second: t.y
	}) : !0 : !1;
}
function J({ first: e, second: t }) {
	return Number.isFinite(e) && Number.isFinite(t) && Math.abs(e - t) <= Tu;
}
function ju({ target: e }) {
	let t = e.getObjects();
	return !(t.length < 2 || t.some((e) => !(e instanceof a) || !!e.parent));
}
function Mu({ editor: e, target: t }) {
	let n = e.shapeManager.resolveSupportedActiveSelectionShapeChildren({ selection: t });
	return !n || !t.getObjects().some((e) => e instanceof a) ? !1 : e.textManager.supportsActiveSelectionScaling({
		domainTargets: n,
		selection: t
	});
}
function Nu({ compositionKind: e, target: t }) {
	return Object.freeze(e === "images" ? {
		children: Object.freeze(t.getObjects().map((e) => Pu({ target: e }))),
		kind: "images"
	} : e === "texts" ? {
		children: Object.freeze(t.getObjects().map((e) => e instanceof a ? Pu({ target: e }) : Iu({ target: e }))),
		kind: "texts"
	} : e === "mixed" ? {
		children: Object.freeze(t.getObjects().map((e) => e instanceof a ? Pu({ target: e }) : e instanceof _ ? Iu({ target: e }) : Fu({ target: e }))),
		kind: "mixed"
	} : {
		children: Object.freeze(t.getObjects().map((e) => Fu({ target: e }))),
		kind: "shapes"
	});
}
function Pu({ target: e }) {
	return Object.freeze({
		angle: e.angle ?? 0,
		cropX: e.cropX ?? 0,
		cropY: e.cropY ?? 0,
		flipX: !!e.flipX,
		flipY: !!e.flipY,
		height: e.height,
		kind: "image",
		left: e.left,
		originX: e.originX,
		originY: e.originY,
		scaleX: e.scaleX,
		scaleY: e.scaleY,
		skewX: e.skewX ?? 0,
		skewY: e.skewY ?? 0,
		target: e,
		top: e.top,
		width: e.width
	});
}
function Fu({ target: e }) {
	return Object.freeze({
		angle: e.angle ?? 0,
		flipX: !!e.flipX,
		flipY: !!e.flipY,
		kind: "shape",
		originX: e.originX,
		originY: e.originY,
		scaleX: e.scaleX,
		scaleY: e.scaleY,
		skewX: e.skewX ?? 0,
		skewY: e.skewY ?? 0,
		target: e
	});
}
function Iu({ target: e }) {
	if (!(e instanceof _)) throw Error("Текстовый состав должен содержать только объекты Textbox");
	return Object.freeze({
		angle: e.angle ?? 0,
		flipX: !!e.flipX,
		flipY: !!e.flipY,
		kind: "text",
		originX: e.originX,
		originY: e.originY,
		skewX: e.skewX ?? 0,
		skewY: e.skewY ?? 0,
		target: e,
		text: e.text ?? ""
	});
}
function Lu({ protectedState: e, target: t, transform: n }) {
	let { composition: r } = e, i = t.getObjects();
	return i.length === r.children.length ? ku({
		protectedState: e,
		target: t,
		transform: n
	}) && J({
		first: t.width,
		second: e.width
	}) && J({
		first: t.height,
		second: e.height
	}) && t.originX === e.targetOriginX && t.originY === e.targetOriginY && !!t.lockScalingFlip === e.lockScalingFlip && Ru({
		children: i,
		composition: r
	}) : !1;
}
function Ru({ children: e, composition: t }) {
	return t.kind === "images" ? t.children.every((t, n) => e[n] === t.target && zu({ state: t })) : t.kind === "texts" || t.kind === "mixed" ? t.children.every((t, n) => e[n] === t.target ? t.kind === "image" ? Bu({ state: t }) : t.kind === "shape" ? Uu({ state: t }) : Hu({ state: t }) : !1) : t.children.every((t, n) => e[n] === t.target && Vu({ state: t }));
}
function zu({ state: e }) {
	let { target: t } = e;
	return J({
		first: t.left,
		second: e.left
	}) && J({
		first: t.top,
		second: e.top
	}) && J({
		first: t.scaleX,
		second: e.scaleX
	}) && J({
		first: t.scaleY,
		second: e.scaleY
	}) && Bu({ state: e });
}
function Bu({ state: e }) {
	let { target: t } = e;
	return J({
		first: t.width,
		second: e.width
	}) && J({
		first: t.height,
		second: e.height
	}) && J({
		first: t.angle ?? 0,
		second: e.angle
	}) && J({
		first: t.skewX ?? 0,
		second: e.skewX
	}) && J({
		first: t.skewY ?? 0,
		second: e.skewY
	}) && J({
		first: t.cropX ?? 0,
		second: e.cropX
	}) && J({
		first: t.cropY ?? 0,
		second: e.cropY
	}) && !!t.flipX === e.flipX && !!t.flipY === e.flipY && t.originX === e.originX && t.originY === e.originY;
}
function Vu({ state: e }) {
	let { target: t } = e;
	return J({
		first: t.scaleX,
		second: e.scaleX
	}) && J({
		first: t.scaleY,
		second: e.scaleY
	}) && Uu({ state: e });
}
function Hu({ state: e }) {
	let { target: t } = e;
	return Uu({ state: e }) && (t.text ?? "") === e.text;
}
function Uu({ state: e }) {
	let { target: t } = e;
	return J({
		first: t.angle ?? 0,
		second: e.angle
	}) && J({
		first: t.skewX ?? 0,
		second: e.skewX
	}) && J({
		first: t.skewY ?? 0,
		second: e.skewY
	}) && !!t.flipX === e.flipX && !!t.flipY === e.flipY && t.originX === e.originX && t.originY === e.originY;
}
//#endregion
//#region src/editor/selection-manager/scaling/active-selection-scale-session.ts
function Wu({ domainSource: e, editor: t, runtime: n, selection: r }) {
	try {
		t.textManager.clearActiveSelectionScaling({ selection: r });
	} finally {
		try {
			e && t.shapeManager.clearActiveSelectionScalePreviewState({
				children: e.targets,
				selection: r
			});
		} finally {
			n.finishSession();
		}
	}
}
function Gu({ editor: e, gesture: t, projection: n, runtime: r }) {
	if (t.compositionKind !== "texts" && t.compositionKind !== "mixed") return;
	let i = null;
	try {
		if (t.compositionKind === "mixed" && (i = e.shapeManager.createActiveSelectionScaleDomainSource({
			selection: t.target,
			transform: t.transform
		}), !i)) throw Error("Полный смешанный состав должен начать сессию ShapeManager");
		if (!e.textManager.beginActiveSelectionScaling({
			domainSource: i,
			projection: n,
			selection: t.target,
			transform: t.transform
		})) throw Error("Поддерживаемое выделение с текстами должно начать сессию TextManager");
	} catch (n) {
		try {
			Wu({
				domainSource: i,
				editor: e,
				runtime: r,
				selection: t.target
			});
		} catch {}
		throw n;
	}
}
function Ku({ editor: e, gesture: t, pointerStart: n }) {
	let r = e.snappingManager.startRectangularScaleSnappingSession({
		pointerStart: n,
		transform: t.projectionTransform
	});
	if (!r) return null;
	let { projection: i, runtime: a } = r;
	return Gu({
		editor: e,
		gesture: t,
		projection: i,
		runtime: a
	}), {
		hasSkewStep: !1,
		hasVerifiedStep: !1,
		phase: "unified",
		projection: i,
		protectedState: Ou({
			compositionKind: t.compositionKind,
			target: t.target,
			transform: t.transform
		}),
		runtime: a,
		target: t.target,
		transform: t.transform
	};
}
function qu({ editor: t, event: n }) {
	let { target: r, transform: i } = n;
	if (!(r instanceof e) || !i || i.target !== r || !Du({ target: r })) return null;
	let a = Eu({
		editor: t,
		target: r
	});
	if (!a || (a === "texts" || a === "mixed") && (i.corner === "mt" || i.corner === "mb")) return null;
	let o = a === "shapes" || a === "mixed" ? t.shapeManager.resolveActiveSelectionScaleControlMode({
		selection: r,
		transform: i,
		event: n.e
	}) : null;
	if (!(Cu({
		target: r,
		transform: i
	}) || o !== null)) return null;
	let s = i.original?.scaleX, c = i.original?.scaleY;
	return typeof s != "number" || !Number.isFinite(s) || s <= 0 || typeof c != "number" || !Number.isFinite(c) || c <= 0 ? null : Object.freeze({
		compositionKind: a,
		projectionTransform: Object.freeze({
			target: r,
			action: i.action,
			corner: i.corner,
			originX: i.originX,
			originY: i.originY,
			original: Object.freeze({
				scaleX: s,
				scaleY: c
			})
		}),
		target: r,
		transform: i
	});
}
function Ju({ event: e, session: t }) {
	return !(e.transform !== t.transform || e.target && e.target !== t.target);
}
//#endregion
//#region src/editor/selection-manager/scaling/active-selection-scale-interaction-controller.ts
var Yu = class {
	constructor({ editor: e }) {
		this.session = null, this.commitSession = null, this.coordinatedTextDrivenSelections = /* @__PURE__ */ new WeakSet(), this._handleMouseDown = (e) => {
			this.startGesture({ event: e });
		}, this._handleMouseMove = (e) => {
			this.handleCanvasMouseMove({ event: e });
		}, this._handleObjectScaling = (e) => {
			this.handleObjectScaling({ event: e });
		}, this._handleInteractionFinished = () => {
			let { session: e } = this;
			e && this.commitSession?.session === e || this._cancelAndClearGuides();
		}, this._handlePointerCancel = (e) => {
			this.interruptGesture({ event: e });
		}, this._handleWindowBlur = () => {
			this.interruptGesture();
		}, this._handleObjectRemoved = ({ target: e }) => {
			e && this.finishGestureForTarget({ target: e });
		}, this.editor = e;
	}
	bind() {
		let { canvas: e } = this.editor;
		e.on("mouse:down", this._handleMouseDown), e.on("mouse:move", this._handleMouseMove), e.on("object:scaling", this._handleObjectScaling), e.on("mouse:up", this._handleInteractionFinished), e.on("object:removed", this._handleObjectRemoved), e.on("selection:created", this._handleInteractionFinished), e.on("selection:updated", this._handleInteractionFinished), e.on("selection:cleared", this._handleInteractionFinished), window.addEventListener("pointercancel", this._handlePointerCancel), window.addEventListener("touchcancel", this._handlePointerCancel), window.addEventListener("blur", this._handleWindowBlur);
	}
	destroy() {
		let { canvas: e } = this.editor;
		this.session && this.interruptGesture(), e.off("mouse:down", this._handleMouseDown), e.off("mouse:move", this._handleMouseMove), e.off("object:scaling", this._handleObjectScaling), e.off("mouse:up", this._handleInteractionFinished), e.off("object:removed", this._handleObjectRemoved), e.off("selection:created", this._handleInteractionFinished), e.off("selection:updated", this._handleInteractionFinished), e.off("selection:cleared", this._handleInteractionFinished), window.removeEventListener("pointercancel", this._handlePointerCancel), window.removeEventListener("touchcancel", this._handlePointerCancel), window.removeEventListener("blur", this._handleWindowBlur), this._cancelAndClearGuides();
	}
	startGesture({ event: e }) {
		this._cancelAndClearGuides();
		let t = qu({
			editor: this.editor,
			event: e
		}), n = e.scenePoint ?? e.pointer;
		if (!t || !n) return !1;
		let r = Ku({
			editor: this.editor,
			gesture: t,
			pointerStart: n
		});
		return r ? (this.session = r, !0) : !1;
	}
	handleObjectScaling({ event: e }) {
		return this._handleScaleStep({
			event: e,
			intentSource: "fabric-preview"
		});
	}
	handleCanvasMouseMove({ event: e }) {
		return this._handleScaleStep({
			event: e,
			intentSource: "pointer-projection"
		});
	}
	finishGesture() {
		let { session: e } = this;
		return e ? (e.runtime.finishSession(), this.session = null, this.commitSession?.session === e && (this.commitSession = null), !0) : !1;
	}
	beginShapeSelectionCommit({ selection: e }) {
		let { session: t } = this;
		if (!t || t.target !== e || t.protectedState.composition.kind !== "shapes") return null;
		if (this.commitSession) throw Error("Фиксация общего выделения из шейпов уже выполняется");
		return this.commitSession = Object.freeze({
			kind: "shapes",
			session: t
		}), t.hasSkewStep ? "fabric-transform" : "canonical-scale";
	}
	finishShapeSelectionCommit({ selection: e }) {
		return this._finishSelectionCommit({
			kind: "shapes",
			selection: e
		});
	}
	beginTextSelectionCommit({ selection: e }) {
		let { session: t } = this;
		if (!t || t.target !== e || !Xu({ session: t })) return !1;
		if (this.commitSession) throw Error("Фиксация общего выделения уже выполняется другим доменом");
		return this.commitSession = Object.freeze({
			kind: "texts",
			session: t
		}), !0;
	}
	finishTextSelectionCommit({ selection: e }) {
		return this._finishSelectionCommit({
			kind: "texts",
			selection: e
		});
	}
	shouldSkipShapeSelectionCommit({ selection: e }) {
		let { session: t } = this;
		return this.coordinatedTextDrivenSelections.has(e) ? !0 : t?.target === e && t.protectedState.composition.kind === "mixed" && t.phase === "unified";
	}
	commitTextDrivenSelectionScale({ selection: e, transform: t }) {
		if (!this.beginTextSelectionCommit({ selection: e })) return !1;
		let { commitSession: n } = this;
		if (!n) throw Error("Фиксация текстового состава должна иметь защищённую сессию");
		this.coordinatedTextDrivenSelections.add(e);
		let r;
		try {
			r = this._prepareTextDrivenChildrenCommit({
				selection: e,
				session: n.session,
				transform: t
			});
		} catch (r) {
			throw this._abortFailedTextDrivenCommit({
				selection: e,
				session: n.session,
				transform: t
			}), r;
		}
		let i = this._finishCommittedTextDrivenSelection({
			selection: e,
			session: n.session,
			shapeCommit: r
		});
		return i && this._reportTextDrivenCommitFinalizationFailure({ error: i }), !0;
	}
	finishGestureForTarget({ target: e }) {
		let { session: t } = this;
		if (!t) return !1;
		let n = t.protectedState.composition.children.some((t) => t.target === e);
		return e !== t.target && !n ? !1 : this._cancelAndClearGuides();
	}
	handleShapeSelectionScaleStep({ event: e, intentSource: t }) {
		let { session: n } = this;
		return !n || !["shapes", "mixed"].includes(n.protectedState.composition.kind) || !Ju({
			event: e,
			session: n
		}) ? !1 : this._handleScaleStep({
			event: e,
			intentSource: t
		});
	}
	interruptGesture({ event: e } = {}) {
		if (!this.session) return !1;
		try {
			this.editor.canvas.endCurrentTransform(e);
		} finally {
			this._cancelAndClearGuides();
		}
		return !0;
	}
	_handleScaleStep({ event: e, intentSource: t }) {
		let { session: n } = this;
		if (!n) return !1;
		if (n.phase === "legacy-passthrough") return this._handleLegacyPassthroughStep({
			event: e,
			session: n
		});
		if (n.phase === "skew-passthrough") return this._handleSkewPassthroughStep({
			event: e,
			session: n
		});
		let r = td({ event: e }), i = n.runtime.getDuplicateStep({ marker: r });
		if (i) {
			if (!i.verification) throw Error("Повторный шаг ActiveSelection не может завершиться до проверки результата");
			return this.editor.snappingManager.markScaleStepHandled({ marker: r }), !0;
		}
		let a = e.e;
		return !a || !Ju({
			event: e,
			session: n
		}) ? this._continueWithExistingScaling() : wu({
			controlKey: n.projection.controlKey,
			pointerEvent: a,
			target: n.target
		}) ? this._finishBeforeSkew({
			marker: r,
			pointerEvent: a
		}) : ku({
			protectedState: n.protectedState,
			target: n.target,
			transform: n.transform
		}) ? this._applyScaleStep({
			event: e,
			intentSource: t,
			marker: r,
			pointerEvent: a,
			session: n
		}) : this._continueWithExistingScaling();
	}
	_handleLegacyPassthroughStep({ event: e, session: t }) {
		if (!Ju({
			event: e,
			session: t
		})) return !1;
		let n = e.e;
		return !n || !wu({
			controlKey: t.projection.controlKey,
			pointerEvent: n,
			target: t.target
		}) ? !1 : (t.phase = "skew-passthrough", t.hasSkewStep = !0, this.editor.snappingManager.markScaleStepHandled({ marker: td({ event: e }) }), this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] }), !0);
	}
	_handleSkewPassthroughStep({ event: e, session: t }) {
		if (!Ju({
			event: e,
			session: t
		})) return !1;
		let n = e.e;
		return !n || wu({
			controlKey: t.projection.controlKey,
			pointerEvent: n,
			target: t.target
		}) ? (this.editor.snappingManager.markScaleStepHandled({ marker: td({ event: e }) }), !0) : (t.phase = "legacy-passthrough", !1);
	}
	_applyScaleStep({ event: e, intentSource: t, marker: n, pointerEvent: r, session: i }) {
		try {
			let a = Zu({
				editor: this.editor,
				event: e,
				intentSource: t,
				pointerEvent: r,
				session: i
			});
			if (!a) return this._continueWithExistingScaling();
			let o = i.runtime.resolveScalePlan({
				marker: n,
				intent: a.intent,
				stepProjection: a.textMeasurement?.projection
			});
			if (o.kind === "duplicate") throw Error("Шаг ActiveSelection стал повторным после начальной проверки сессии");
			let s = this._applyAndVerifyScaleStep({
				plan: o.plan,
				mode: a.mode,
				pointerEvent: r,
				session: i,
				textMeasurement: a.textMeasurement,
				token: o.token
			});
			if (Xu({ session: i }) && !this.editor.textManager.confirmActiveSelectionScalePreview({ selection: i.target })) throw Error("Проверенный текстовый шаг должен стать подтверждённым");
			return i.hasVerifiedStep = !0, this.editor.snappingManager.markScaleStepHandled({ marker: n }), this.editor.snappingManager.publishVerifiedScaleGuides({ guides: s.guides }), !0;
		} catch (e) {
			try {
				this._abortFailedScaleStep({
					pointerEvent: r,
					session: i
				});
			} catch {}
			throw e;
		}
	}
	_abortFailedScaleStep({ pointerEvent: e, session: t }) {
		t.hasVerifiedStep || (t.transform.actionPerformed = !1);
		try {
			if (Xu({ session: t })) try {
				this.editor.textManager.restoreActiveSelectionScalePreview({ selection: t.target }) || (t.transform.actionPerformed = !1);
			} catch {
				t.transform.actionPerformed = !1;
			}
		} finally {
			try {
				this.editor.canvas.endCurrentTransform(e);
			} catch {
				t.target.isMoving = !1, Reflect.get(this.editor.canvas, "_currentTransform") === t.transform && Reflect.set(this.editor.canvas, "_currentTransform", null);
			} finally {
				try {
					this.editor.historyManager.endAction({ reason: "object-transform" });
				} finally {
					this.session === t && this._cancelAndClearGuides();
				}
			}
		}
	}
	_applyAndVerifyScaleStep({ mode: e, plan: t, pointerEvent: n, session: r, textMeasurement: i, token: a }) {
		let o = this._resolveDomainScalePlan({
			mode: e,
			plan: t,
			runtime: r.runtime,
			selection: r.target,
			textMeasurement: i,
			token: a
		}), s = $u({
			editor: this.editor,
			plan: o.plan,
			pointerEvent: n,
			projection: r.projection,
			protectedState: r.protectedState,
			target: r.target,
			textMeasurement: o.textMeasurement,
			transform: r.transform
		}), c = fu({
			mode: e,
			multipliers: s,
			plan: o.plan,
			protectedStatePreserved: Au({
				mode: e,
				multipliers: s,
				protectedState: r.protectedState,
				target: r.target,
				transform: r.transform
			}),
			target: r.target,
			transform: r.transform
		});
		return ed({ multipliers: s }) && (r.transform.actionPerformed = !0), r.runtime.verifyScalePlan({
			token: a,
			finalGeometry: c
		});
	}
	_resolveDomainScalePlan({ mode: e, plan: t, runtime: n, selection: r, textMeasurement: i, token: a }) {
		if (!i) return Object.freeze({
			plan: t,
			textMeasurement: null
		});
		let o = this.editor.textManager.resolveActiveSelectionScaleStep({
			mode: e,
			plan: t,
			pointerMeasurement: i,
			selection: r
		}), s = o.refinement ? n.refineScalePlan({
			token: a,
			refinement: o.refinement
		}) : t;
		return Object.freeze({
			plan: s,
			textMeasurement: o.measurement
		});
	}
	_continueWithExistingScaling() {
		let { session: e } = this;
		return e?.protectedState.composition.kind === "shapes" ? (e.runtime.finishSession(), e.phase = "legacy-passthrough", this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] }), !1) : e && Xu({ session: e }) && this.editor.textManager.hasConfirmedActiveSelectionScale({ selection: e.target }) ? this._finishAppliedTextGesture({ session: e }) : (this._cancelAndClearGuides(), !1);
	}
	_finishBeforeSkew({ marker: e, pointerEvent: t }) {
		let { session: n } = this;
		if (!n) throw Error("Переход к наклону требует активной сессии общего выделения");
		return n.protectedState.composition.kind === "shapes" ? (n.runtime.finishSession(), n.phase = "skew-passthrough", n.hasSkewStep = !0, this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] })) : Xu({ session: n }) && this.editor.textManager.hasConfirmedActiveSelectionScale({ selection: n.target }) ? this._finishAppliedTextGesture({
			session: n,
			pointerEvent: t
		}) : this._cancelAndClearGuides(), this.editor.snappingManager.markScaleStepHandled({ marker: e }), !0;
	}
	_finishAppliedTextGesture({ session: e, pointerEvent: t }) {
		if (!this.editor.textManager.restoreActiveSelectionScalePreview({ selection: e.target })) throw Error("Досрочное завершение должно восстановить последний текстовый шаг");
		if (this.editor.canvas.endCurrentTransform(t), this.session === e) throw Error("Досрочное завершение текстового скейлинга должно зафиксировать активную сессию");
		return !0;
	}
	_finishAndClearGuides() {
		return this.finishGesture() ? (this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] }), !0) : !1;
	}
	_finishSelectionCommit({ kind: e, selection: t }) {
		let { commitSession: n } = this;
		return !n || n.kind !== e || n.session.target !== t ? !1 : (this.commitSession = null, this._finishAndClearGuides());
	}
	_prepareTextDrivenChildrenCommit({ selection: e, session: t, transform: n }) {
		let { composition: r } = t.protectedState, i = r.children.map(({ target: e }) => e), a = r.children.filter((e) => e.kind === "shape").map(({ target: e }) => e), o = e.angle ?? 0, s = e.getCenterPoint(), c = null;
		try {
			if (e.set({ angle: 0 }), e.setPositionByOrigin(s, "center", "center"), e.setCoords(), this._discardSelectionDuringCommit({
				selection: e,
				transform: n
			}), !this.editor.textManager.commitActiveSelectionScaling({ selection: e })) throw Error("TextManager должен зафиксировать измеренную геометрию текста");
			r.kind === "mixed" && (c = this.editor.shapeManager.prepareActiveSelectionScaleCommit({
				children: a,
				selection: e,
				transform: n
			})), this._restoreTextDrivenSelectionAfterCommit({
				angle: o,
				center: s,
				children: i
			});
		} catch (t) {
			try {
				this._restoreTextDrivenCommitState({
					children: i,
					selection: e
				});
			} catch {}
			throw t;
		}
		return c;
	}
	_restoreTextDrivenCommitState({ children: e, selection: t }) {
		let n = [];
		try {
			this._restoreOriginalSelectionTopology({
				children: e,
				selection: t
			});
		} catch (e) {
			n.push(e);
		}
		try {
			if (!this.editor.textManager.restoreActiveSelectionScalePreview({ selection: t })) throw Error("TextManager должен восстановить подтверждённое состояние");
		} catch (e) {
			n.push(e);
		}
		try {
			t.setCoords(), this.editor.canvas.setActiveObject(t), this.editor.canvas.requestRenderAll();
		} catch (e) {
			n.push(e);
		}
		let [r] = n;
		if (n.length > 0) throw r;
	}
	_restoreOriginalSelectionTopology({ children: t, selection: n }) {
		let { canvas: r } = this.editor, i = r.getActiveObject();
		i instanceof e && i !== n && r.discardActiveObject();
		let a = new Set(n.getObjects()), o = t.filter((e) => !a.has(e));
		o.length > 0 && n.add(...o);
		let s = n.getObjects();
		if (!(s.length === t.length && s.every((e, n) => e === t[n]))) throw Error("Откат должен восстановить исходный порядок объектов");
	}
	_finishTextDrivenDomainCommits({ selection: e, shapeCommit: t }) {
		let n = [];
		if (t) try {
			this.editor.shapeManager.finishActiveSelectionScaleCommit({ commit: t });
		} catch (e) {
			n.push(e);
		}
		try {
			this.editor.textManager.clearActiveSelectionScaling({ selection: e });
		} catch (e) {
			n.push(e);
		}
		let [r] = n;
		if (n.length > 0) throw r;
	}
	_finishCommittedTextDrivenSelection({ selection: e, session: t, shapeCommit: n }) {
		let r = [];
		try {
			this._finishTextDrivenDomainCommits({
				selection: e,
				shapeCommit: n
			});
		} catch (e) {
			r.push(e);
		}
		try {
			this.finishTextSelectionCommit({ selection: e }) || r.push(/* @__PURE__ */ Error("Общая текстовая сессия должна завершиться после фиксации"));
		} catch (e) {
			r.push(e);
		}
		return r.length > 0 && this._forceFinishCommitSession({
			selection: e,
			session: t
		}), r.length > 0 ? r[0] ?? /* @__PURE__ */ Error("Не удалось завершить фиксацию общего выделения") : null;
	}
	_abortFailedTextDrivenCommit({ selection: e, session: t, transform: n }) {
		try {
			this._clearDomainPreviewState({ session: t });
		} catch {}
		this._forceFinishCommitSession({
			selection: e,
			session: t
		}), this.coordinatedTextDrivenSelections.delete(e), this._releaseFailedCommitTransform({
			selection: e,
			transform: n
		});
	}
	_forceFinishCommitSession({ selection: e, session: t }) {
		if (t.target === e) {
			try {
				t.runtime.finishSession();
			} catch {}
			this.session === t && (this.session = null), this.commitSession = null;
			try {
				this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] });
			} catch {}
		}
	}
	_reportTextDrivenCommitFinalizationFailure({ error: e }) {
		try {
			this.editor.errorManager.emitError({
				code: su.SELECTION_MANAGER.SCALE_COMMIT_FINALIZATION_FAILED,
				data: { error: e },
				message: "Не удалось полностью завершить фиксацию общего выделения",
				method: "commitTextDrivenSelectionScale",
				origin: "SelectionManager"
			});
		} catch {}
	}
	_restoreTextDrivenSelectionAfterCommit({ angle: e, center: t, children: n }) {
		let r = [];
		for (let e of n) try {
			e.setCoords();
		} catch (e) {
			r.push(e);
		}
		try {
			this._restoreSelectionAfterCommit({
				angle: e,
				center: t,
				children: n
			});
		} catch (e) {
			r.push(e);
		}
		let [i] = r;
		if (r.length > 0) throw i;
	}
	_discardSelectionDuringCommit({ selection: e, transform: t }) {
		let { canvas: n } = this.editor, r = Reflect.get(n, "_currentTransform"), i = r && r === t && t?.target === e;
		i && Reflect.set(n, "_currentTransform", null);
		try {
			n.discardActiveObject();
		} finally {
			i && Reflect.set(n, "_currentTransform", r);
		}
	}
	_releaseFailedCommitTransform({ selection: e, transform: t }) {
		let { canvas: n } = this.editor, r = Reflect.get(n, "_currentTransform");
		if (!(!t || t.target !== e || r !== t)) {
			e.isMoving = !1, Reflect.set(n, "_currentTransform", null);
			try {
				this.editor.historyManager.endAction({ reason: "object-transform" });
			} catch {}
		}
	}
	_restoreSelectionAfterCommit({ angle: t, center: n, children: r }) {
		let { canvas: i } = this.editor, a = new e([...r], { canvas: i });
		a.set({
			angle: t,
			flipX: !1,
			flipY: !1,
			scaleX: 1,
			scaleY: 1,
			skewX: 0,
			skewY: 0
		}), a.setPositionByOrigin(n, "center", "center"), a.setCoords(), i.setActiveObject(a), i.requestRenderAll();
	}
	_cancelAndClearGuides() {
		let { session: e } = this;
		if (!e) return !1;
		let t = !1;
		try {
			this._clearDomainPreviewState({ session: e });
		} finally {
			t = this._finishAndClearGuides();
		}
		return t;
	}
	_clearDomainPreviewState({ session: e }) {
		let { composition: t } = e.protectedState;
		if (t.kind === "mixed") {
			try {
				this.editor.textManager.clearActiveSelectionScaling({ selection: e.target });
			} finally {
				this.editor.shapeManager.clearActiveSelectionScalePreviewState({
					selection: e.target,
					children: t.children.filter((e) => e.kind === "shape").map(({ target: e }) => e)
				});
			}
			return;
		}
		if (t.kind === "texts") {
			this.editor.textManager.clearActiveSelectionScaling({ selection: e.target });
			return;
		}
		t.kind === "shapes" && this.editor.shapeManager.clearActiveSelectionScalePreviewState({
			selection: e.target,
			children: t.children.filter((e) => e.kind === "shape").map(({ target: e }) => e)
		});
	}
};
function Xu({ session: e }) {
	let { kind: t } = e.protectedState.composition;
	return t === "texts" || t === "mixed";
}
function Zu({ editor: e, event: t, intentSource: n, pointerEvent: r, session: i }) {
	let { composition: a } = i.protectedState;
	if (a.kind === "texts" || a.kind === "mixed") return Qu({
		editor: e,
		event: t,
		intentSource: n,
		pointerEvent: r,
		session: i
	});
	let o = a.kind === "shapes" ? e.shapeManager.resolveActiveSelectionScaleControlMode({
		selection: i.target,
		transform: i.transform,
		event: r
	}) : null, s = lu({
		canvas: e.canvas,
		event: t,
		intentSource: n,
		mode: o ?? void 0,
		projection: i.projection,
		target: i.target
	});
	return s ? Object.freeze({
		...s,
		textMeasurement: null
	}) : null;
}
function Qu({ editor: e, event: t, intentSource: n, pointerEvent: r, session: i }) {
	let a = n === "fabric-preview" ? t.pointer : t.scenePoint;
	if (!a) return null;
	let o = (i.protectedState.composition.kind === "mixed" ? e.shapeManager.resolveActiveSelectionScaleControlMode({
		selection: i.target,
		transform: i.transform,
		event: r
	}) : null) ?? pu({
		canvas: e.canvas,
		pointerEvent: r,
		projection: i.projection
	}), s = lc({
		projection: i.projection,
		pointer: a,
		mode: o
	}) ?? (o === "uniform" ? Object.freeze({
		x: 0,
		y: 0
	}) : null);
	if (!s) return null;
	let c = e.textManager.measureActiveSelectionScale({
		mode: o,
		multipliers: s,
		selection: i.target
	});
	return Object.freeze({
		intent: gu({
			mode: o,
			multipliers: c.multipliers,
			pointerEvent: r
		}),
		mode: o,
		textMeasurement: c
	});
}
function $u({ editor: e, plan: t, pointerEvent: n, projection: r, protectedState: i, target: a, textMeasurement: o, transform: s }) {
	if (i.composition.kind === "texts" || i.composition.kind === "mixed") {
		if (!o) throw Error("План выделения с текстами должен содержать измеренное каноническое состояние");
		return e.textManager.applyActiveSelectionScalePreview({
			measurement: o,
			selection: a
		});
	}
	if (uu({
		plan: t,
		projection: r,
		target: a,
		transform: s
	}), i.composition.kind === "shapes") {
		let t = e.shapeManager.applyActiveSelectionScalePreview({
			selection: a,
			transform: s,
			event: n
		});
		if (!t) throw Error("Поддерживаемое выделение из шейпов должно принять рассчитанный масштаб");
		if (!J({
			first: a.scaleX,
			second: t.scaleX
		}) || !J({
			first: a.scaleY,
			second: t.scaleY
		})) throw Error("Масштаб выделения должен совпасть с результатом ShapeManager");
	}
	return du({
		projection: r,
		target: a
	});
}
function ed({ multipliers: e }) {
	return !J({
		first: e.x,
		second: 1
	}) || !J({
		first: e.y,
		second: 1
	});
}
function td({ event: e }) {
	let { e: t } = e;
	return typeof t == "object" && t || typeof t == "function" ? t : e;
}
//#endregion
//#region src/editor/selection-manager/index.ts
var nd = class t {
	constructor({ editor: e }) {
		this.lastSelection = [], this.isCtrlSelectionBoxActive = !1, this.isSelectionMergeInProgress = !1, this.editor = e, this.scaleInteractionController = new Yu({ editor: e }), this.selectionKey = this._resolveSelectionKey(), this.handleTextEditingEnteredBound = this._handleTextEditingEntered.bind(this), this.handleTextEditingExitedBound = this._handleTextEditingExited.bind(this), this.handleLockedSelectionBound = this._filterLockedSelection.bind(this), this.handleSelectionMergeBound = this._handleSelectionMerge.bind(this), this.handleSelectionChangeBound = this._handleSelectionChange.bind(this), this.handleSelectionClearedBound = this._handleSelectionCleared.bind(this), this.handleSelectionBoxStartBound = this._handleSelectionBoxStart.bind(this), this.handleSelectionBoxEndBound = this._handleSelectionBoxEnd.bind(this), this.scaleInteractionController.bind(), this._applySelectionKey({ selectionKey: this.selectionKey }), this._bindEvents();
	}
	selectAll() {
		let { canvas: t, canvasManager: n, objectLockManager: r } = this.editor;
		t.discardActiveObject();
		let i = n.getObjects(), a = i.some((e) => e.locked), o = i.length > 1 ? new e(n.getObjects(), { canvas: t }) : i[0];
		a && r.lockObject({
			object: o,
			skipInnerObjects: !0,
			withoutSave: !0
		}), t.setActiveObject(o), t.requestRenderAll(), t.fire("editor:all-objects-selected", { selected: o });
	}
	handleShapeSelectionScaleStep({ event: t, intentSource: n }) {
		return !(t.target instanceof e) || !t.transform ? !1 : this.scaleInteractionController.handleShapeSelectionScaleStep({
			event: t,
			intentSource: n
		});
	}
	commitShapeSelectionScale({ selection: e, commit: t }) {
		let n = this.scaleInteractionController.beginShapeSelectionCommit({ selection: e });
		if (!n) return !1;
		let r = !1;
		try {
			t(n);
		} finally {
			r = this.scaleInteractionController.finishShapeSelectionCommit({ selection: e });
		}
		if (!r) throw Error("Сессия скейлинга шейпов должна завершиться после фиксации");
		return !0;
	}
	commitTextSelectionScale({ selection: e, transform: t }) {
		return this.scaleInteractionController.commitTextDrivenSelectionScale({
			selection: e,
			transform: t
		});
	}
	shouldSkipShapeSelectionScaleCommit({ selection: e }) {
		return this.scaleInteractionController.shouldSkipShapeSelectionCommit({ selection: e });
	}
	destroy() {
		let { canvas: e } = this.editor;
		this.scaleInteractionController.destroy(), e.off("mouse:down", this.handleSelectionBoxStartBound), e.off("mouse:up", this.handleSelectionBoxEndBound), e.off("text:editing:entered", this.handleTextEditingEnteredBound), e.off("text:editing:exited", this.handleTextEditingExitedBound), e.off("selection:created", this.handleSelectionMergeBound), e.off("selection:updated", this.handleSelectionMergeBound), e.off("selection:created", this.handleLockedSelectionBound), e.off("selection:updated", this.handleLockedSelectionBound), e.off("selection:created", this.handleSelectionChangeBound), e.off("selection:updated", this.handleSelectionChangeBound), e.off("selection:cleared", this.handleSelectionClearedBound);
	}
	_applySelectionKey({ selectionKey: e }) {
		let { canvas: t } = this.editor;
		t.selectionKey = e;
	}
	_bindEvents() {
		let { canvas: e } = this.editor;
		e.on("text:editing:entered", this.handleTextEditingEnteredBound), e.on("text:editing:exited", this.handleTextEditingExitedBound), e.on("mouse:down", this.handleSelectionBoxStartBound), e.on("mouse:up", this.handleSelectionBoxEndBound), e.on("selection:created", this.handleSelectionMergeBound), e.on("selection:updated", this.handleSelectionMergeBound), e.on("selection:created", this.handleLockedSelectionBound), e.on("selection:updated", this.handleLockedSelectionBound), e.on("selection:created", this.handleSelectionChangeBound), e.on("selection:updated", this.handleSelectionChangeBound), e.on("selection:cleared", this.handleSelectionClearedBound);
	}
	_handleTextEditingEntered(e) {
		this._applySelectionKey({ selectionKey: null });
	}
	_handleTextEditingExited(e) {
		let { selectionKey: t } = this;
		this._applySelectionKey({ selectionKey: t });
	}
	_filterLockedSelection({ selected: e, e: n }) {
		let { editor: r } = this, { canvas: i } = r;
		if (!(n instanceof MouseEvent)) return;
		let a = i.getActiveObject();
		if (!a) return;
		let o = t._collectSelectionObjects({ activeObject: a });
		if (o.length <= 1) return;
		let { lockedObjects: s, unlockedObjects: c } = t._splitLockedObjects({ objects: o });
		if (s.length !== 0) {
			if (c.length > 0) {
				let r = e ?? [];
				if (t._shouldKeepLockedSelection({
					addedObjects: r,
					currentSelection: o,
					pointerEvent: n
				})) {
					this._applySelectionObjects({ objects: s }), i.requestRenderAll();
					return;
				}
				this._applySelectionObjects({ objects: c }), i.requestRenderAll();
				return;
			}
			this._applySelectionObjects({ objects: s }), i.requestRenderAll();
		}
	}
	_handleSelectionMerge({ selected: e, e: n }) {
		let { canvas: r } = this.editor, { lastSelection: i, isCtrlSelectionBoxActive: a, isSelectionMergeInProgress: o } = this;
		if (o || !a || !(n instanceof MouseEvent)) return;
		let { ctrlKey: s, metaKey: c } = n;
		if (!(s || c) || i.length === 0 || e.length === 0) return;
		let l = r.getActiveObject(), u = t._collectSelectionObjects({ activeObject: l });
		if (u.length === 0) return;
		let d = i, f = t._isSelectionLockedOnly({ objects: d }) ? t._filterLockedSelectionObjects({ objects: u }) : u, p = t._mergeSelections({
			baseSelection: d,
			addedSelection: f
		});
		if (t._areSelectionsEqual({
			left: p,
			right: u
		})) {
			this.isCtrlSelectionBoxActive = !1;
			return;
		}
		this.isSelectionMergeInProgress = !0, this._applySelectionObjects({ objects: p }), r.requestRenderAll(), this.isSelectionMergeInProgress = !1, this.isCtrlSelectionBoxActive = !1;
	}
	_handleSelectionBoxStart({ e, target: n }) {
		if (!(e instanceof MouseEvent) || n) return;
		let { editor: r } = this, { canvas: i, textManager: a } = r;
		if (!i.selection || a.isTextEditingActive) return;
		let { ctrlKey: o, metaKey: s } = e;
		if (!(o || s)) return;
		let c = i.getActiveObject(), l = t._collectSelectionObjects({ activeObject: c });
		this.lastSelection = l.slice(), this.isCtrlSelectionBoxActive = l.length > 0;
	}
	_handleSelectionBoxEnd({ e }) {
		e instanceof MouseEvent && (this.isCtrlSelectionBoxActive = !1);
	}
	_handleSelectionChange() {
		let { canvas: e } = this.editor, n = e.getActiveObject(), r = t._collectSelectionObjects({ activeObject: n });
		this.lastSelection = r.slice();
	}
	_handleSelectionCleared({ e }) {
		let { lastSelection: t } = this;
		if (t.length === 0) return;
		if (!(e instanceof MouseEvent)) {
			this.lastSelection = [];
			return;
		}
		let { ctrlKey: n, metaKey: r } = e;
		if (!(n || r)) {
			this.lastSelection = [];
			return;
		}
		let i = this._filterExistingObjects({ objects: t });
		if (i.length === 0) {
			this.lastSelection = [];
			return;
		}
		this._applySelectionObjects({ objects: i });
	}
	static _collectSelectionObjects({ activeObject: t }) {
		return t ? t instanceof e ? t.getObjects() : [t] : [];
	}
	static _isSelectionLockedOnly({ objects: e }) {
		if (e.length === 0) return !1;
		for (let t of e) if (!t.locked) return !1;
		return !0;
	}
	static _filterLockedSelectionObjects({ objects: e }) {
		let t = [];
		for (let n of e) n.locked && t.push(n);
		return t;
	}
	_filterExistingObjects({ objects: e }) {
		let { canvasManager: t } = this.editor, n = t.getObjects(), r = [];
		for (let t of e) n.includes(t) && r.push(t);
		return r;
	}
	static _areSelectionsEqual({ left: e, right: t }) {
		if (e.length !== t.length) return !1;
		if (e.length === 0) return !0;
		for (let n of e) if (!t.includes(n)) return !1;
		return !0;
	}
	static _mergeSelections({ baseSelection: e, addedSelection: t }) {
		let n = [];
		for (let t of e) n.includes(t) || n.push(t);
		for (let e of t) n.includes(e) || n.push(e);
		return n;
	}
	static _splitLockedObjects({ objects: e }) {
		let t = [], n = [];
		for (let r of e) {
			if (r.locked) {
				t.push(r);
				continue;
			}
			n.push(r);
		}
		return {
			lockedObjects: t,
			unlockedObjects: n
		};
	}
	static _shouldKeepLockedSelection({ addedObjects: e, currentSelection: t, pointerEvent: n }) {
		let { ctrlKey: r, metaKey: i } = n;
		if (!(r || i) || e.length === 0) return !1;
		let a = !1;
		for (let t of e) if (!t.locked) {
			a = !0;
			break;
		}
		if (!a) return !1;
		let o = [];
		for (let n of t) e.includes(n) || o.push(n);
		if (o.length === 0) return !1;
		for (let e of o) if (!e.locked) return !1;
		return !0;
	}
	_applySelectionObjects({ objects: n }) {
		let { editor: r } = this, { canvas: i, objectLockManager: a } = r, o = this._filterExistingObjects({ objects: n });
		if (o.length === 0) return;
		if (o.length === 1) {
			i.setActiveObject(o[0]);
			return;
		}
		let s = new e(o, { canvas: i });
		t._hasLockedObjects({ objects: o }) && a.lockObject({
			object: s,
			skipInnerObjects: !0,
			withoutSave: !0
		}), i.setActiveObject(s);
	}
	static _hasLockedObjects({ objects: e }) {
		for (let t of e) if (t.locked) return !0;
		return !1;
	}
	_resolveSelectionKey() {
		let { options: e } = this.editor, { selectionKey: t } = e;
		return t === void 0 ? ["ctrlKey", "metaKey"] : t;
	}
}, rd = class e {
	constructor({ editor: e }) {
		this.editor = e;
	}
	static _isUngroupableGroup(e) {
		return e instanceof c && e.format !== "svg";
	}
	_canDeleteObject({ object: e, ignoreDeleteGuard: t }) {
		return t ? !0 : this.editor.options.canDeleteObject?.(e) ?? !0;
	}
	resolveDeleteTargets({ objects: e, ignoreDeleteGuard: t = !1 } = {}) {
		let n = e || this.editor.canvas.getActiveObjects(), r = [], i = [];
		for (let e = 0; e < n.length; e += 1) {
			let a = n[e];
			if (!a.locked) {
				if (!this._canDeleteObject({
					object: a,
					ignoreDeleteGuard: t
				})) {
					i.push(a);
					continue;
				}
				r.push(a);
			}
		}
		return {
			requestedObjects: n,
			deletableObjects: r,
			skippedObjects: i
		};
	}
	_resolveDeletePlan({ objects: t, ignoreDeleteGuard: n = !1 } = {}) {
		let r = this.resolveDeleteTargets({
			objects: t,
			ignoreDeleteGuard: n
		}), i = [...r.skippedObjects], a = !1;
		for (let t = 0; t < r.deletableObjects.length; t += 1) {
			let o = r.deletableObjects[t];
			if (!e._isUngroupableGroup(o)) {
				a = !0;
				continue;
			}
			let s = o.getObjects();
			if (!s.length) {
				a = !0;
				continue;
			}
			let c = this.resolveDeleteTargets({
				objects: s,
				ignoreDeleteGuard: n
			});
			if (c.deletableObjects.length > 0) {
				a = !0;
				continue;
			}
			i.push(...c.skippedObjects);
		}
		return {
			...r,
			skippedObjects: i,
			hasCanvasChanges: a
		};
	}
	_fireDeleteSkipped({ skippedObjects: e, requestedObjects: t, withoutSave: n }) {
		e.length && this.editor.canvas.fire("editor:objects-delete-skipped", {
			skippedObjects: e,
			requestedObjects: t,
			withoutSave: n
		});
	}
	_resolveObjectsForDelete({ objects: e, withoutSave: t }) {
		if (e) return e;
		if (t) return;
		let n = this.editor.textManager.getActiveTextEditingOwner();
		if (n) return [n];
	}
	_collectGroupObjectsForDeletion({ group: e, ignoreDeleteGuard: t }) {
		let { groupingManager: n } = this.editor, r = e.getObjects(), i = this.resolveDeleteTargets({
			objects: r,
			ignoreDeleteGuard: t
		});
		if (r.length && !i.deletableObjects.length) return {
			deletedObjects: [],
			skippedObjects: i.skippedObjects,
			objectsToDelete: []
		};
		let { ungroupedObjects: a = [] } = n.ungroup({
			target: e,
			withoutSave: !0
		}) ?? {}, o = [], s = !r.length;
		for (let e = 0; e < a.length; e += 1) {
			let t = a[e];
			(s || i.deletableObjects.includes(t)) && o.push(t);
		}
		return {
			deletedObjects: [e],
			skippedObjects: i.skippedObjects,
			objectsToDelete: o
		};
	}
	_deleteObjects({ objects: t, ignoreDeleteGuard: n }) {
		let { canvas: r } = this.editor, i = [...t], a = [], o = [];
		for (let t = 0; t < i.length; t += 1) {
			let s = i[t];
			if (e._isUngroupableGroup(s)) {
				let e = this._collectGroupObjectsForDeletion({
					group: s,
					ignoreDeleteGuard: n
				});
				a.push(...e.deletedObjects), o.push(...e.skippedObjects);
				for (let t = 0; t < e.objectsToDelete.length; t += 1) i.push(e.objectsToDelete[t]);
				continue;
			}
			r.remove(s), a.push(s);
		}
		return {
			deletedObjects: a,
			skippedObjects: o
		};
	}
	_deleteObjectsInHistoryTransaction({ deletePlan: e, ignoreDeleteGuard: t }) {
		let { canvas: n, historyManager: r } = this.editor, i = {
			deletedObjects: [],
			skippedObjects: []
		};
		r.suspendHistory();
		try {
			Kl({
				canvas: n,
				objects: e.deletableObjects
			}) && n.endCurrentTransform(), i = this._deleteObjects({
				objects: e.deletableObjects,
				ignoreDeleteGuard: t
			}), i.deletedObjects.length && (n.discardActiveObject(), n.renderAll());
		} finally {
			r.resumeHistory();
		}
		return i;
	}
	_completeDeleteOperation({ deletePlan: e, deleteResult: t, skippedObjects: n, withoutSave: r }) {
		let { canvas: i, historyManager: a } = this.editor;
		r || a.saveState();
		let o = {
			objects: t.deletedObjects,
			withoutSave: r
		};
		return this._fireDeleteSkipped({
			skippedObjects: n,
			requestedObjects: e.requestedObjects,
			withoutSave: r
		}), i.fire("editor:objects-deleted", o), o;
	}
	deleteSelectedObjects({ objects: e, withoutSave: t = !1, ignoreDeleteGuard: n = !1 } = {}) {
		let { textManager: r } = this.editor, i = this._resolveObjectsForDelete({
			objects: e,
			withoutSave: t
		}), a = this._resolveDeletePlan({
			objects: i,
			ignoreDeleteGuard: n
		});
		if (!a.hasCanvasChanges) return this._fireDeleteSkipped({
			skippedObjects: a.skippedObjects,
			requestedObjects: a.requestedObjects,
			withoutSave: t
		}), null;
		t || r.exitActiveTextEditing();
		let o = this._deleteObjectsInHistoryTransaction({
			deletePlan: a,
			ignoreDeleteGuard: n
		}), s = [...a.skippedObjects, ...o.skippedObjects];
		return o.deletedObjects.length ? this._completeDeleteOperation({
			deletePlan: a,
			deleteResult: o,
			skippedObjects: s,
			withoutSave: t
		}) : (this._fireDeleteSkipped({
			skippedObjects: s,
			requestedObjects: a.requestedObjects,
			withoutSave: t
		}), null);
	}
}, id = class e {
	constructor({ editor: e }) {
		this._buffer = [], this.editor = e;
	}
	get buffer() {
		return this._buffer;
	}
	cleanBuffer() {
		this._buffer.length = 0;
	}
	emitError({ origin: t = "ImageEditor", method: n = "Unknown Method", code: r, data: i, message: a }) {
		if (!e.isValidErrorCode(r)) {
			console.warn("Неизвестный код ошибки: ", {
				code: r,
				origin: t,
				method: n
			});
			return;
		}
		if (!r) return;
		let o = a || r;
		console.error(`${t}. ${n}. ${r}. ${o}`, i);
		let s = {
			code: r,
			origin: t,
			method: n,
			message: o,
			data: i
		};
		this._buffer.push({
			type: "editor:error",
			...s
		}), this.editor.canvas.fire("editor:error", s);
	}
	emitWarning({ origin: t = "ImageEditor", method: n = "Unknown Method", code: r, message: i, data: a }) {
		if (!e.isValidErrorCode(r)) {
			console.warn("Неизвестный код предупреждения: ", {
				code: r,
				origin: t,
				method: n
			});
			return;
		}
		let o = i || r;
		console.warn(`${t}. ${n}. ${r}. ${o}`, a);
		let s = {
			code: r,
			origin: t,
			method: n,
			message: o,
			data: a
		};
		this._buffer.push({
			type: "editor:warning",
			...s
		}), this.editor.canvas.fire("editor:warning", s);
	}
	static isValidErrorCode(e) {
		return e ? Object.values(su).some((t) => Object.values(t).includes(e)) : !1;
	}
}, ad = 48, od = class e {
	constructor({ editor: e }) {
		this.currentBounds = null, this.editor = e;
	}
	calculatePanBounds() {
		let e = this.getViewportPanState();
		return {
			minX: e.horizontal.min,
			maxX: e.horizontal.max,
			minY: e.vertical.min,
			maxY: e.vertical.max,
			canPanX: e.horizontal.canPan,
			canPanY: e.vertical.canPan,
			canPan: e.canPan
		};
	}
	isPanAllowed() {
		return this.updateBounds(), this.currentBounds?.canPan ?? !1;
	}
	constrainPan(t, n) {
		let r = this.currentBounds;
		return r || (r = this.calculatePanBounds(), this.currentBounds = r), {
			x: e._clamp(t, r.minX, r.maxX),
			y: e._clamp(n, r.minY, r.maxY)
		};
	}
	getViewportPanState() {
		let e = this._getPanAxisState({ axis: "x" }), t = this._getPanAxisState({ axis: "y" });
		return {
			horizontal: e,
			vertical: t,
			canPan: e.canPan || t.canPan
		};
	}
	applyPanRatio({ horizontalRatio: t, verticalRatio: n }) {
		let r = this.getViewportPanState();
		if (!r.canPan) return !1;
		let i = typeof t == "number" ? e._getAxisPositionByRatio({
			axisState: r.horizontal,
			ratio: t
		}) : this.editor.canvas.viewportTransform[4], a = typeof n == "number" ? e._getAxisPositionByRatio({
			axisState: r.vertical,
			ratio: n
		}) : this.editor.canvas.viewportTransform[5];
		return this._applyConstrainedViewport({
			vptX: i,
			vptY: a
		});
	}
	applyPanDelta({ deltaX: e, deltaY: t }) {
		if (e === 0 && t === 0 || !this.getViewportPanState().canPan) return !1;
		let { canvas: n } = this.editor, r = n.viewportTransform;
		return this._applyConstrainedViewport({
			vptX: r[4] + e,
			vptY: r[5] + t
		});
	}
	_applyConstrainedViewport({ vptX: e, vptY: t }) {
		this.updateBounds();
		let { canvas: n, montageArea: r } = this.editor, i = n.viewportTransform, a = this.constrainPan(e, t);
		if (!(a.x !== i[4] || a.y !== i[5])) return !0;
		let o = [...i];
		return o[4] = a.x, o[5] = a.y, n.setViewportTransform(o), r.setCoords(), n.fire("editor:pan-changed", {
			panState: this.getViewportPanState(),
			viewportTransform: o
		}), !0;
	}
	getPanBounds() {
		return this.currentBounds;
	}
	getCurrentOffset() {
		let { canvas: e, montageArea: t } = this.editor, n = e.getZoom(), r = e.viewportTransform, i = t.left, a = t.top, o = e.getWidth() / 2, s = e.getHeight() / 2;
		return {
			x: i * n + r[4] - o,
			y: a * n + r[5] - s
		};
	}
	_getPanAxisState({ axis: t }) {
		let { canvas: n, montageArea: r, zoomManager: i } = this.editor, a = n.getZoom(), o = t === "x", s = o ? n.getWidth() : n.getHeight(), c = (o ? r.width : r.height) * a, l = (o ? r.left : r.top) * a, u = s / 2 - l, d = e._getScrollDistance({
			contentSize: c,
			viewportSize: s
		});
		if (!(a > i.defaultZoom && d > 0)) return e._createLockedAxisState({
			contentSize: c,
			current: u,
			viewportSize: s
		});
		let f = e._normalizeZero(u - d / 2), p = e._normalizeZero(u + d / 2), m = e._clamp(o ? n.viewportTransform[4] : n.viewportTransform[5], f, p);
		return {
			canPan: !0,
			contentSize: c,
			current: m,
			max: p,
			min: f,
			ratio: e._getAxisRatio({
				current: m,
				max: p,
				min: f
			}),
			scrollDistance: d,
			viewportSize: s
		};
	}
	static _getScrollDistance({ contentSize: e, viewportSize: t }) {
		let n = Math.max(1, t - ad * 2);
		return Math.max(0, e - n);
	}
	static _createLockedAxisState({ contentSize: e, current: t, viewportSize: n }) {
		return {
			canPan: !1,
			contentSize: e,
			current: t,
			max: t,
			min: t,
			ratio: 0,
			scrollDistance: 0,
			viewportSize: n
		};
	}
	static _getAxisRatio({ current: t, max: n, min: r }) {
		let i = n - r;
		return i <= 0 ? 0 : e._clamp((n - t) / i, 0, 1);
	}
	static _getAxisPositionByRatio({ axisState: t, ratio: n }) {
		let r = e._clamp(n, 0, 1);
		return t.max - (t.max - t.min) * r;
	}
	static _clamp(t, n, r) {
		return e._normalizeZero(Math.max(n, Math.min(r, t)));
	}
	static _normalizeZero(e) {
		return Object.is(e, -0) ? 0 : e;
	}
	updateBounds() {
		this.currentBounds = this.calculatePanBounds();
	}
}, sd = ({ textbox: e }) => {
	if (!e.isEditing) return null;
	let t = e.selectionStart ?? 0, n = e.selectionEnd ?? t;
	return t === n ? null : {
		start: Math.min(t, n),
		end: Math.max(t, n)
	};
}, cd = ({ textbox: e }) => {
	let t = e.text?.length ?? 0;
	return t <= 0 ? null : {
		start: 0,
		end: t
	};
}, ld = ({ textbox: e, range: t }) => {
	if (!t) return !1;
	let n = e.text?.length ?? 0;
	return n <= 0 ? !1 : t.start <= 0 && t.end >= n;
}, ud = ({ textbox: e, styles: t, range: n }) => {
	if (!t || !Object.keys(t).length) return !1;
	let { start: r, end: i } = n;
	return i <= r ? !1 : (e.setSelectionStyles(t, r, i), !0);
}, dd = ({ textbox: e, range: t, property: n }) => {
	if (!t) return;
	let r = e.getSelectionStyles(t.start, t.end, !0);
	if (r.length) return r[0]?.[n];
}, fd = ({ strokeColor: e, width: t }) => t <= 0 ? null : e ?? "#000000", pd = ({ width: e = 0 }) => e ? Math.max(0, e) : 0, md = ({ value: e }) => typeof e == "string" ? e.toLocaleUpperCase() : "";
function hd({ textbox: e, width: t }) {
	if (!Number.isFinite(t)) throw Error("Ширина Textbox должна быть конечным числом");
	let n = Math.max(1, t);
	e.autoExpand = !1, e.set({ width: n });
	let r = Math.max(n, e.dynamicMinWidth);
	return e.width = r, e.dirty = !0, r;
}
//#endregion
//#region src/editor/text-manager/background-textbox.ts
var gd = ({ value: e, min: t, max: n }) => Math.min(Math.max(e, t), n), _d = class e extends _ {
	static {
		this.type = "background-textbox";
	}
	static {
		this.cacheProperties = [
			...Array.isArray(_.cacheProperties) ? _.cacheProperties : [],
			"backgroundColor",
			"backgroundOpacity",
			"lineFontDefaults",
			"paddingTop",
			"paddingRight",
			"paddingBottom",
			"paddingLeft",
			"radiusTopLeft",
			"radiusTopRight",
			"radiusBottomRight",
			"radiusBottomLeft"
		];
	}
	static {
		this.stateProperties = [
			...Array.isArray(_.stateProperties) ? _.stateProperties : [],
			"backgroundColor",
			"backgroundOpacity",
			"lineFontDefaults",
			"paddingTop",
			"paddingRight",
			"paddingBottom",
			"paddingLeft",
			"preserveExactTextGeometry",
			"radiusTopLeft",
			"radiusTopRight",
			"radiusBottomRight",
			"radiusBottomLeft"
		];
	}
	static fromObject(t) {
		return super.fromObject(t).then((n) => {
			if (!(n instanceof e)) return n;
			let r = t;
			if (r.shapeNodeType === "text") return n.preserveExactTextGeometry = !1, n;
			let { height: i, width: a } = r, o = typeof i == "number" && Number.isFinite(i), s = typeof a == "number" && Number.isFinite(a), c = r.autoExpand === !1 && s;
			if (r.preserveExactTextGeometry !== !0) return c ? (n.autoExpand = !1, n.width = Math.max(1, a), n.dirty = !0, n.setCoords(), n) : n;
			let l = n.shouldRoundDimensionsOnInit;
			n.shouldRoundDimensionsOnInit = !1;
			try {
				s && n.set({ width: a }), n.initDimensions(), o && n.set({ height: i });
			} finally {
				n.shouldRoundDimensionsOnInit = l;
			}
			return n.setCoords(), n;
		});
	}
	constructor(e, t = {}) {
		if (super(e, t), this.backgroundOpacity = t.backgroundOpacity ?? 1, this.lineFontDefaults = t.lineFontDefaults ?? void 0, this.preserveExactTextGeometry = t.preserveExactTextGeometry === !0, this.paddingTop = t.paddingTop ?? 0, this.paddingRight = t.paddingRight ?? 0, this.paddingBottom = t.paddingBottom ?? 0, this.paddingLeft = t.paddingLeft ?? 0, this.radiusTopLeft = t.radiusTopLeft ?? 0, this.radiusTopRight = t.radiusTopRight ?? 0, this.radiusBottomRight = t.radiusBottomRight ?? 0, this.radiusBottomLeft = t.radiusBottomLeft ?? 0, _l({ textbox: this })) {
			this.initDimensions(), this.dirty = !0;
			return;
		}
		this._roundDimensions();
	}
	initDimensions() {
		let e = this.preserveExactTextGeometry === !0 ? this.width : null;
		super.initDimensions(), this.shouldRoundDimensionsOnInit !== !1 && this._roundDimensions(), e !== null && (this.width = e);
	}
	transformMatrixKey(e = !1) {
		return [
			...super.transformMatrixKey(e),
			this.paddingTop ?? 0,
			this.paddingRight ?? 0,
			this.paddingBottom ?? 0,
			this.paddingLeft ?? 0
		];
	}
	_getLeftOffset() {
		let { width: e } = this._getBackgroundDimensions(), { left: t } = this._getPadding();
		return -e / 2 + t;
	}
	_getTopOffset() {
		let { height: e } = this._getBackgroundDimensions(), { top: t } = this._getPadding();
		return -e / 2 + t;
	}
	_getNonTransformedDimensions() {
		let { width: e, height: t } = this._getBackgroundDimensions();
		return new p(e, t).scalarAdd(this.strokeWidth);
	}
	_getTransformedDimensions(e = {}) {
		let { width: t, height: n } = this._getBackgroundDimensions();
		return super._getTransformedDimensions({
			...e,
			width: t,
			height: n
		});
	}
	toObject(e = []) {
		let t = super.toObject(e), { lineFontDefaults: n, styles: r } = hl({ textbox: this });
		return {
			...t,
			backgroundOpacity: this.backgroundOpacity,
			lineFontDefaults: n,
			preserveExactTextGeometry: this.preserveExactTextGeometry === !0,
			styles: C.stylesToArray(r, this.text ?? ""),
			paddingTop: this.paddingTop,
			paddingRight: this.paddingRight,
			paddingBottom: this.paddingBottom,
			paddingLeft: this.paddingLeft,
			radiusTopLeft: this.radiusTopLeft,
			radiusTopRight: this.radiusTopRight,
			radiusBottomRight: this.radiusBottomRight,
			radiusBottomLeft: this.radiusBottomLeft
		};
	}
	_renderBackground(t) {
		let n = this._getEffectiveBackgroundFill();
		if (!n) return;
		let r = this._getPadding(), i = this.width ?? 0, a = this.height ?? 0, o = i + r.left + r.right, s = a + r.top + r.bottom, c = this._getCornerRadii({
			width: o,
			height: s
		}), l = this._getLeftOffset() - r.left, u = this._getTopOffset() - r.top;
		t.save(), e._renderRoundedRect({
			ctx: t,
			height: s,
			left: l,
			radii: c,
			top: u,
			width: o
		}), t.fillStyle = n, t.fill(), t.restore();
	}
	_renderTextDecoration(e, t) {
		let { direction: n, fontSize: r, lineHeight: i, offsets: a, width: o, _fontSizeFraction: s, _textLines: c } = this, l = !1;
		for (let e = 0; e < c.length; e += 1) if (this.styleHas(t, e)) {
			l = !0;
			break;
		}
		if (!this[t] && !l) return;
		let u = this._getTopOffset(), d = this._getLeftOffset(), { path: f } = this, p = this._getWidthOfCharSpacing(), m = a[t], h = 0;
		t === "linethrough" ? h = .5 : t === "overline" && (h = 1);
		for (let a = 0, l = c.length; a < l; a += 1) {
			let l = this.getHeightOfLine(a);
			if (!this[t] && !this.styleHas(t, a)) {
				u += l;
				continue;
			}
			let g = c[a], _ = l / i, v = this._getLineLeftOffset(a), y = 0, b = 0, x = this.getValueOfPropertyAt(a, 0, t), S = this._getDecorationColorAt(a, 0), C = this.getValueOfPropertyAt(a, 0, "textDecorationThickness"), w = x, T = S, E = C, D = u + _ * (1 - s), O = this.getHeightOfChar(a, 0), k = this.getValueOfPropertyAt(a, 0, "deltaY");
			for (let i = 0, s = g.length; i < s; i += 1) {
				let s = this.__charBounds[a][i];
				w = this.getValueOfPropertyAt(a, i, t), T = this._getDecorationColorAt(a, i), E = this.getValueOfPropertyAt(a, i, "textDecorationThickness");
				let c = this.getHeightOfChar(a, i), l = this.getValueOfPropertyAt(a, i, "deltaY");
				if (f && w && T) {
					let t = r * E / 1e3;
					e.save(), e.fillStyle = S, e.translate(s.renderLeft, s.renderTop), e.rotate(s.angle), e.fillRect(-s.kernedWidth / 2, m * c + l - h * t, s.kernedWidth, t), e.restore();
				} else if ((w !== x || T !== S || c !== O || E !== C || l !== k) && b > 0) {
					let t = r * C / 1e3, i = d + v + y;
					n === "rtl" && (i = o - i - b), x && S && C && (e.fillStyle = S, e.fillRect(i, D + m * O + k - h * t, b, t)), y = s.left, b = s.width, x = w, C = E, S = T, O = c, k = l;
				} else b += s.kernedWidth;
			}
			let A = d + v + y;
			n === "rtl" && (A = o - A - b), e.fillStyle = T;
			let ee = r * E / 1e3;
			w && T && E && e.fillRect(A, D + m * O + k - h * ee, b - p, ee), u += l;
		}
		this._removeShadow(e);
	}
	_getDecorationColorAt(e, t) {
		let n = this.getValueOfPropertyAt(e, t, "strokeWidth"), r = pd({ width: typeof n == "number" && Number.isFinite(n) ? n : 0 }), i = this.getValueOfPropertyAt(e, t, "stroke"), a = i == null ? null : fd({
			strokeColor: i,
			width: r
		});
		return r > 0 && a != null ? a : this.getValueOfPropertyAt(e, t, "fill") ?? null;
	}
	_getBackgroundDimensions() {
		let e = this.width ?? this.calcTextWidth() ?? 0, t = this.height ?? this.calcTextHeight() ?? 0, n = this._getPadding();
		return {
			height: t + n.top + n.bottom,
			width: e + n.left + n.right
		};
	}
	_getCornerRadii({ width: e, height: t }) {
		let n = e / 2, r = t / 2, i = Math.min(n, r);
		return {
			bottomLeft: gd({
				value: this.radiusBottomLeft ?? 0,
				min: 0,
				max: i
			}),
			bottomRight: gd({
				value: this.radiusBottomRight ?? 0,
				min: 0,
				max: i
			}),
			topLeft: gd({
				value: this.radiusTopLeft ?? 0,
				min: 0,
				max: i
			}),
			topRight: gd({
				value: this.radiusTopRight ?? 0,
				min: 0,
				max: i
			})
		};
	}
	_getPadding() {
		return {
			bottom: this.paddingBottom ?? 0,
			left: this.paddingLeft ?? 0,
			right: this.paddingRight ?? 0,
			top: this.paddingTop ?? 0
		};
	}
	_getEffectiveBackgroundFill() {
		let e = this.backgroundColor;
		if (!e) return null;
		let t = gd({
			value: this.backgroundOpacity ?? 1,
			min: 0,
			max: 1
		}), r;
		try {
			r = new n(e);
		} catch {
			return null;
		}
		return r.setAlpha(t), r.toRgba();
	}
	static _renderRoundedRect({ ctx: e, height: t, left: n, radii: r, top: i, width: a }) {
		let o = n + a, s = i + t, { topLeft: c, topRight: l, bottomRight: u, bottomLeft: d } = r, f = gd({
			value: c,
			min: 0,
			max: a
		}), p = gd({
			value: l,
			min: 0,
			max: a
		}), m = gd({
			value: u,
			min: 0,
			max: a
		}), h = gd({
			value: d,
			min: 0,
			max: a
		});
		e.beginPath(), e.moveTo(n + f, i), e.lineTo(o - p, i), e.quadraticCurveTo(o, i, o, i + p), e.lineTo(o, s - m), e.quadraticCurveTo(o, s, o - m, s), e.lineTo(n + h, s), e.quadraticCurveTo(n, s, n, s - h), e.lineTo(n, i + f), e.quadraticCurveTo(n, i, n + f, i), e.closePath();
	}
	_roundDimensions() {
		let { width: e = 0, height: t = 0 } = this, n = Math.round(e), r = Math.round(t);
		n !== e && (this.width = Math.max(0, n)), r !== t && (this.height = Math.max(0, r));
	}
}, vd = () => {
	y?.setClass && y.setClass(_d, "background-textbox");
}, yd = class {
	constructor({ runtime: e }) {
		this.runtime = e;
	}
	updateText({ target: e, style: t = {}, withoutSave: n, skipRender: r, selectionRange: i, emitLifecycleEvents: a = !0, syncLineStylesWithText: o = !0, shouldRoundDimensions: s = !0 } = {}) {
		let c = this._prepareUpdate({
			target: e,
			style: t,
			withoutSave: n,
			skipRender: r,
			selectionRangeOverride: i,
			emitLifecycleEvents: a,
			syncLineStylesWithText: o,
			shouldRoundDimensions: s
		});
		return c ? (this._applyUpdates({ preparedUpdate: c }), this._finishUpdate({ preparedUpdate: c }), c.textbox) : null;
	}
	_prepareUpdate({ target: e, style: t, withoutSave: n, skipRender: r, selectionRangeOverride: i, emitLifecycleEvents: a, syncLineStylesWithText: o, shouldRoundDimensions: s }) {
		let c = this.runtime.resolveTextObject(e);
		if (!c || c.locked) return null;
		this.runtime.historyManager.suspendHistory();
		let l = c.text ?? "", u = this._createSelectionContext({
			textbox: c,
			currentText: l,
			selectionRangeOverride: i
		}), d = this._buildStyleMaps({
			textbox: c,
			style: t,
			selection: u
		}), f = this.runtime.canvasManager.resolveObjectPlacement({
			object: c,
			left: t.left,
			top: t.top,
			originX: t.originX,
			originY: t.originY
		}), p = this._applyTextContentUpdate({
			textbox: c,
			style: t,
			updates: d.updates,
			currentText: l
		}), m = this._resolveContentPlacement({
			textbox: c,
			style: t,
			updates: d.updates,
			placement: f,
			styleMaps: d,
			contentUpdate: p
		});
		return {
			textbox: c,
			target: e,
			style: t,
			withoutSave: n,
			skipRender: r,
			emitLifecycleEvents: a,
			syncLineStylesWithText: o,
			beforeState: this.runtime.getSnapshot(c),
			placement: f,
			selection: u,
			styleMaps: d,
			contentUpdate: p,
			contentPlacement: m,
			shouldRoundDimensions: s
		};
	}
	_createSelectionContext({ textbox: e, currentText: t, selectionRangeOverride: n }) {
		let r = n === void 0 ? sd({ textbox: e }) : Zc({
			text: t,
			range: n
		}), i = r ? Qc({
			textbox: e,
			range: r
		}) : null, a = ld({
			textbox: e,
			range: r
		}), o = ld({
			textbox: e,
			range: i
		}), s = !r || a;
		return {
			selectionRange: r,
			fontSelectionRange: i,
			shouldUpdateWholeObject: s,
			shouldUpdateWholeObjectFont: s || o,
			shouldApplyWholeTextStyles: !r
		};
	}
	_buildStyleMaps({ textbox: e, style: t, selection: n }) {
		let r = { ...t }, i = {
			updates: r,
			selectionStyles: {},
			lineSelectionStyles: {},
			wholeTextStyles: {}
		};
		return delete r.fontFamily, delete r.fontSize, delete r.bold, delete r.italic, delete r.underline, delete r.uppercase, delete r.strikethrough, delete r.align, delete r.color, delete r.strokeColor, delete r.strokeWidth, delete r.opacity, delete r.backgroundColor, delete r.backgroundOpacity, delete r.paddingTop, delete r.paddingRight, delete r.paddingBottom, delete r.paddingLeft, delete r.radiusTopLeft, delete r.radiusTopRight, delete r.radiusBottomRight, delete r.radiusBottomLeft, delete r.left, delete r.top, delete r.originX, delete r.originY, delete r.text, delete r.autoExpand, this._applyFontUpdates({
			styleMaps: i,
			style: t,
			selection: n
		}), this._applyTextDecorationUpdates({
			styleMaps: i,
			style: t,
			selection: n
		}), this._applyColorUpdates({
			textbox: e,
			styleMaps: i,
			style: t,
			selection: n
		}), this._applyBoxStyleUpdates({
			styleMaps: i,
			style: t
		}), i;
	}
	_applyFontUpdates({ styleMaps: e, style: t, selection: n }) {
		let { fontFamily: r, fontSize: i, align: a, opacity: o } = t, { fontSelectionRange: s, shouldUpdateWholeObjectFont: c, shouldApplyWholeTextStyles: l } = n;
		r !== void 0 && (s && (e.lineSelectionStyles.fontFamily = r), c && (e.updates.fontFamily = r, l && (e.wholeTextStyles.fontFamily = r))), i !== void 0 && (s && (e.lineSelectionStyles.fontSize = i), c && (e.updates.fontSize = i, l && (e.wholeTextStyles.fontSize = i))), a !== void 0 && (e.updates.textAlign = a), o !== void 0 && (e.updates.opacity = o);
	}
	_applyTextDecorationUpdates({ styleMaps: e, style: t, selection: n }) {
		this._applyFontWeightUpdate({
			styleMaps: e,
			style: t,
			selection: n
		}), this._applyFontStyleUpdate({
			styleMaps: e,
			style: t,
			selection: n
		}), this._applyBooleanTextStyleUpdate({
			styleMaps: e,
			nextValue: t.underline,
			objectKey: "underline",
			selectionKey: "underline",
			selection: n
		}), this._applyBooleanTextStyleUpdate({
			styleMaps: e,
			nextValue: t.strikethrough,
			objectKey: "linethrough",
			selectionKey: "linethrough",
			selection: n
		});
	}
	_applyFontWeightUpdate({ styleMaps: e, style: t, selection: n }) {
		if (t.bold === void 0) return;
		let r = t.bold ? "bold" : "normal";
		e.resolvedFontWeight = r, n.selectionRange && (e.selectionStyles.fontWeight = r), n.shouldUpdateWholeObject && (e.updates.fontWeight = r, n.shouldApplyWholeTextStyles && (e.wholeTextStyles.fontWeight = r));
	}
	_applyFontStyleUpdate({ styleMaps: e, style: t, selection: n }) {
		if (t.italic === void 0) return;
		let r = t.italic ? "italic" : "normal";
		e.resolvedFontStyle = r, n.selectionRange && (e.selectionStyles.fontStyle = r), n.shouldUpdateWholeObject && (e.updates.fontStyle = r, n.shouldApplyWholeTextStyles && (e.wholeTextStyles.fontStyle = r));
	}
	_applyBooleanTextStyleUpdate({ styleMaps: e, nextValue: t, objectKey: n, selectionKey: r, selection: i }) {
		t !== void 0 && (i.selectionRange && (e.selectionStyles[r] = t), i.shouldUpdateWholeObject && (e.updates[n] = t, i.shouldApplyWholeTextStyles && (e.wholeTextStyles[n] = t)));
	}
	_applyColorUpdates({ textbox: e, styleMaps: t, style: n, selection: r }) {
		if (n.color !== void 0 && (r.selectionRange && (t.selectionStyles.fill = n.color), r.shouldUpdateWholeObject && (t.updates.fill = n.color, r.shouldApplyWholeTextStyles && (t.wholeTextStyles.fill = n.color))), n.strokeColor === void 0 && n.strokeWidth === void 0) return;
		let i = this._resolveStrokeUpdate({
			textbox: e,
			selectionRange: r.selectionRange,
			strokeColor: n.strokeColor,
			strokeWidth: n.strokeWidth
		});
		t.resolvedStrokeColor = i.stroke, t.resolvedStrokeWidth = i.strokeWidth, r.selectionRange && (t.selectionStyles.stroke = i.stroke, t.selectionStyles.strokeWidth = i.strokeWidth), r.shouldUpdateWholeObject && (t.updates.stroke = i.stroke, t.updates.strokeWidth = i.strokeWidth, r.shouldApplyWholeTextStyles && (t.wholeTextStyles.stroke = i.stroke, t.wholeTextStyles.strokeWidth = i.strokeWidth));
	}
	_resolveStrokeUpdate({ textbox: e, selectionRange: t, strokeColor: n, strokeWidth: r }) {
		let i = t ? dd({
			textbox: e,
			range: t,
			property: "strokeWidth"
		}) : void 0, a = t ? dd({
			textbox: e,
			range: t,
			property: "stroke"
		}) : void 0, o = typeof i == "number" ? i : void 0, s = typeof a == "string" ? a : void 0, c = typeof e.stroke == "string" ? e.stroke : void 0, l = pd({ width: r ?? o ?? e.strokeWidth ?? 0 });
		return {
			stroke: fd({
				strokeColor: n ?? s ?? c,
				width: l
			}) ?? null,
			strokeWidth: l
		};
	}
	_applyBoxStyleUpdates({ styleMaps: e, style: t }) {
		t.backgroundColor !== void 0 && (e.updates.backgroundColor = t.backgroundColor), t.backgroundOpacity !== void 0 && (e.updates.backgroundOpacity = t.backgroundOpacity), t.paddingTop !== void 0 && (e.updates.paddingTop = t.paddingTop), t.paddingRight !== void 0 && (e.updates.paddingRight = t.paddingRight), t.paddingBottom !== void 0 && (e.updates.paddingBottom = t.paddingBottom), t.paddingLeft !== void 0 && (e.updates.paddingLeft = t.paddingLeft), t.radiusTopLeft !== void 0 && (e.updates.radiusTopLeft = t.radiusTopLeft), t.radiusTopRight !== void 0 && (e.updates.radiusTopRight = t.radiusTopRight), t.radiusBottomRight !== void 0 && (e.updates.radiusBottomRight = t.radiusBottomRight), t.radiusBottomLeft !== void 0 && (e.updates.radiusBottomLeft = t.radiusBottomLeft);
	}
	_applyTextContentUpdate({ textbox: e, style: t, updates: n, currentText: r }) {
		let i = e.textCaseRaw ?? r, a = !!e.uppercase, o = t.text !== void 0, s = o ? t.text ?? "" : i, c = t.uppercase ?? a, l = c !== a, u = e.text ?? "";
		return o || l ? (n.text = c ? md({ value: s }) : s, e.textCaseRaw = s) : e.textCaseRaw === void 0 && (e.textCaseRaw = i), e.uppercase = c, {
			hasTextUpdate: o,
			uppercaseChanged: l,
			previousRenderedText: u
		};
	}
	_resolveContentPlacement({ textbox: e, style: t, updates: n, placement: r, styleMaps: i, contentUpdate: a }) {
		let o = Tl({ stylesList: [
			n,
			i.selectionStyles,
			i.lineSelectionStyles,
			i.wholeTextStyles
		] }), s = [
			t.left,
			t.top,
			t.originX,
			t.originY
		].some((e) => e !== void 0), c = [
			t.paddingTop,
			t.paddingRight,
			t.paddingBottom,
			t.paddingLeft
		].some((e) => e !== void 0), l = Object.prototype.hasOwnProperty.call(n, "width");
		return c && !s && !a.hasTextUpdate && !a.uppercaseChanged && !o && !l ? Sl({
			textbox: e,
			originX: r.originX,
			originY: r.originY
		}) : null;
	}
	_applyUpdates({ preparedUpdate: e }) {
		let { textbox: t, placement: n, style: r, selection: i, styleMaps: a, contentUpdate: o, contentPlacement: s, syncLineStylesWithText: c, shouldRoundDimensions: l } = e, u = t.shouldRoundDimensionsOnInit;
		t.shouldRoundDimensionsOnInit = l;
		try {
			t.set(a.updates), this._applyWholeTextStyles({
				textbox: t,
				selection: i,
				styleMaps: a
			}), this._applySelectionStyles({
				textbox: t,
				selection: i,
				styleMaps: a
			}), this._applyLineDefaultUpdates({
				textbox: t,
				style: r,
				selection: i,
				styleMaps: a
			}), this._applyPostStyleLayout({
				textbox: t,
				placement: n,
				style: r,
				styleMaps: a,
				contentUpdate: o,
				contentPlacement: s,
				syncLineStylesWithText: c,
				shouldRoundDimensions: l
			}), t.preserveExactTextGeometry = !l;
		} finally {
			t.shouldRoundDimensionsOnInit = u;
		}
		t.setCoords();
	}
	_applyWholeTextStyles({ textbox: e, selection: t, styleMaps: n }) {
		if (t.selectionRange || Object.keys(n.wholeTextStyles).length === 0) return;
		let r = cd({ textbox: e });
		r && ud({
			textbox: e,
			styles: n.wholeTextStyles,
			range: r
		}) && (e.dirty = !0, Tl({ stylesList: [n.wholeTextStyles] }) && (e.initDimensions(), e.dirty = !0));
	}
	_applySelectionStyles({ textbox: e, selection: t, styleMaps: n }) {
		if (!t.selectionRange) return;
		let r = ud({
			textbox: e,
			styles: n.selectionStyles,
			range: t.selectionRange
		}), i = t.fontSelectionRange ? ud({
			textbox: e,
			styles: n.lineSelectionStyles,
			range: t.fontSelectionRange
		}) : !1, a = Tl({ stylesList: [
			n.selectionStyles,
			n.lineSelectionStyles,
			n.wholeTextStyles
		] });
		(r || i) && (e.dirty = !0, a && (e.initDimensions(), e.dirty = !0));
	}
	_applyLineDefaultUpdates({ textbox: e, style: t, selection: n, styleMaps: r }) {
		this._applyFontLineDefaultUpdates({
			textbox: e,
			style: t,
			selection: n
		}), this._applyDecorationLineDefaultUpdates({
			textbox: e,
			style: t,
			selection: n,
			styleMaps: r
		});
	}
	_applyFontLineDefaultUpdates({ textbox: e, style: t, selection: n }) {
		if (!n.fontSelectionRange || t.fontFamily === void 0 && t.fontSize === void 0) return;
		let r = {};
		t.fontFamily !== void 0 && (r.fontFamily = t.fontFamily), t.fontSize !== void 0 && (r.fontSize = t.fontSize), cl({
			textbox: e,
			lineIndices: $c({
				textbox: e,
				range: n.fontSelectionRange
			}),
			updates: r
		});
	}
	_applyDecorationLineDefaultUpdates({ textbox: e, style: t, selection: n, styleMaps: r }) {
		if (!n.selectionRange || !(t.bold !== void 0 || t.italic !== void 0 || t.underline !== void 0 || t.strikethrough !== void 0 || t.color !== void 0 || t.strokeColor !== void 0 || t.strokeWidth !== void 0)) return;
		let i = {};
		r.resolvedFontWeight !== void 0 && (i.fontWeight = r.resolvedFontWeight), r.resolvedFontStyle !== void 0 && (i.fontStyle = r.resolvedFontStyle), t.underline !== void 0 && (i.underline = t.underline), t.strikethrough !== void 0 && (i.linethrough = t.strikethrough), t.color !== void 0 && (i.fill = t.color), (t.strokeColor !== void 0 || t.strokeWidth !== void 0) && (r.resolvedStrokeColor === null && (i.stroke = null), r.resolvedStrokeColor !== null && r.resolvedStrokeColor !== void 0 && (i.stroke = r.resolvedStrokeColor), r.resolvedStrokeWidth !== void 0 && (i.strokeWidth = r.resolvedStrokeWidth)), cl({
			textbox: e,
			lineIndices: el({
				textbox: e,
				range: n.selectionRange
			}),
			updates: i
		});
	}
	_applyPostStyleLayout({ textbox: e, placement: t, style: n, styleMaps: r, contentUpdate: i, contentPlacement: a, syncLineStylesWithText: o, shouldRoundDimensions: s }) {
		let c = e.text ?? "", l = this._hasBackgroundStyleUpdate({ style: n }), u = this._shouldRefreshDimensions({
			contentUpdate: i,
			styleMaps: r
		}), d = this._resolveShouldAutoExpand({
			textbox: e,
			style: n,
			styleMaps: r,
			shouldRefreshDimensions: u
		});
		l && (e.dirty = !0), this._applyAutoExpandPreference({
			textbox: e,
			autoExpand: n.autoExpand
		}), this._syncRenderedTextChange({
			textbox: e,
			previousRenderedText: i.previousRenderedText,
			nextRenderedText: c,
			syncLineStylesWithText: o
		}), this.runtime.normalizeTextboxAfterContentChange({
			textbox: e,
			placement: t,
			shouldAutoExpand: d,
			shouldRefreshDimensions: u,
			shouldRoundDimensions: s
		}), a && this.runtime.restoreTextboxContentPlacement({
			textbox: e,
			contentPlacement: a
		});
	}
	_hasBackgroundStyleUpdate({ style: e }) {
		return [
			e.backgroundColor,
			e.backgroundOpacity,
			e.paddingTop,
			e.paddingRight,
			e.paddingBottom,
			e.paddingLeft,
			e.radiusTopLeft,
			e.radiusTopRight,
			e.radiusBottomRight,
			e.radiusBottomLeft
		].some((e) => e !== void 0);
	}
	_resolveShouldAutoExpand({ textbox: e, style: t, styleMaps: n, shouldRefreshDimensions: r }) {
		return (t.autoExpand ?? e.autoExpand) !== !1 && !Object.prototype.hasOwnProperty.call(n.updates, "width") && r;
	}
	_shouldRefreshDimensions({ contentUpdate: e, styleMaps: t }) {
		return e.hasTextUpdate || e.uppercaseChanged || Tl({ stylesList: [
			t.updates,
			t.selectionStyles,
			t.lineSelectionStyles,
			t.wholeTextStyles
		] });
	}
	_applyAutoExpandPreference({ textbox: e, autoExpand: t }) {
		if (t !== void 0) {
			e.autoExpand = t !== !1;
			return;
		}
		e.autoExpand === void 0 && (e.autoExpand = !0);
	}
	_syncRenderedTextChange({ textbox: e, previousRenderedText: t, nextRenderedText: n, syncLineStylesWithText: r }) {
		!r || t === n || this.runtime.syncLineStylesWithText({
			textbox: e,
			previousText: t,
			currentText: n
		});
	}
	_finishUpdate({ preparedUpdate: e }) {
		let { textbox: t, target: n, style: r, withoutSave: i, skipRender: a, emitLifecycleEvents: o, beforeState: s, selection: c, styleMaps: l } = e, u = {
			withoutSave: !!i,
			skipRender: !!a
		}, d = !!c.selectionRange && Object.keys(l.selectionStyles).length > 0, f = {
			textbox: t,
			target: n,
			style: r,
			options: u,
			updates: l.updates,
			selectionRange: c.selectionRange ?? void 0,
			selectionStyles: d ? l.selectionStyles : void 0
		};
		o && this.runtime.canvas.fire("editor:before:text-updated", f), a || this.runtime.canvas.requestRenderAll();
		let p = this.runtime.getSnapshot(t);
		if (this.runtime.historyManager.resumeHistory(), i || this.runtime.historyManager.saveState(), !o) return;
		let m = {
			...f,
			before: s,
			after: p
		};
		this.runtime.canvas.fire("editor:text-updated", m);
	}
}, bd = 1e-7;
function xd({ textbox: e }) {
	let t = [];
	return Object.entries(e.styles ?? {}).forEach(([e, n]) => {
		Object.entries(n ?? {}).forEach(([n, r]) => {
			typeof r?.fontSize == "number" && t.push(Object.freeze({
				key: `${e}:${n}`,
				value: r.fontSize
			}));
		});
	}), Object.freeze(t.sort((e, t) => e.key.localeCompare(t.key)));
}
function Sd({ textbox: e }) {
	let t = Object.entries(e.lineFontDefaults ?? {}).filter((e) => typeof e[1]?.fontSize == "number").map(([e, t]) => Object.freeze({
		key: e,
		value: t.fontSize
	}));
	return Object.freeze(t.sort((e, t) => e.key.localeCompare(t.key)));
}
function Cd({ textbox: e }) {
	return Object.freeze({
		fontSize: e.fontSize ?? 16,
		height: e.height ?? e.calcTextHeight(),
		inlineFontSizes: xd({ textbox: e }),
		lineCount: Math.max(e.textLines?.length ?? 0, 1),
		lineFontSizes: Sd({ textbox: e }),
		paddingBottom: e.paddingBottom ?? 0,
		paddingLeft: e.paddingLeft ?? 0,
		paddingRight: e.paddingRight ?? 0,
		paddingTop: e.paddingTop ?? 0,
		radiusBottomLeft: e.radiusBottomLeft ?? 0,
		radiusBottomRight: e.radiusBottomRight ?? 0,
		radiusTopLeft: e.radiusTopLeft ?? 0,
		radiusTopRight: e.radiusTopRight ?? 0,
		scaleX: e.scaleX ?? 1,
		scaleY: e.scaleY ?? 1,
		width: e.width ?? e.calcTextWidth()
	});
}
function wd({ actual: e, expected: t }) {
	return e.length === t.length && e.every((e, n) => {
		let r = t[n];
		return e.key === r?.key && Math.abs(e.value - r.value) <= bd;
	});
}
function Td({ actual: e, expected: t }) {
	return e.lineCount === t.lineCount && [
		"fontSize",
		"height",
		"paddingBottom",
		"paddingLeft",
		"paddingRight",
		"paddingTop",
		"radiusBottomLeft",
		"radiusBottomRight",
		"radiusTopLeft",
		"radiusTopRight",
		"scaleX",
		"scaleY",
		"width"
	].every((n) => Math.abs(e[n] - t[n]) <= bd) && wd({
		actual: e.inlineFontSizes,
		expected: t.inlineFontSizes
	}) && wd({
		actual: e.lineFontSizes,
		expected: t.lineFontSizes
	});
}
//#endregion
//#region src/editor/text-manager/scaling/text-scaling-transform.ts
var Ed = ({ transform: e }) => {
	let { corner: t = "", action: n = "" } = e;
	return {
		isCornerHandle: t === "tl" || t === "tr" || t === "bl" || t === "br" || n === "scale",
		isHorizontalHandle: t === "ml" || t === "mr" || n === "scaleX",
		isVerticalHandle: t === "mt" || t === "mb" || n === "scaleY"
	};
}, Dd = ({ textbox: e, transform: t, appliedWidth: n }) => {
	t.scaleX = 1, t.scaleY = 1;
	let r = t.original;
	r && (r.scaleX = 1, r.scaleY = 1, r.width = n, r.height = e.height, r.left = e.left, r.top = e.top);
}, Od = ({ textbox: e, transform: t, scenePoint: n }) => {
	let { x: r, y: i } = e._getTransformedDimensions();
	if (r <= 0 || i <= 0) return null;
	let a = b.getLocalPoint(t, t.originX, t.originY, n.x, n.y), o = t, s = typeof o.signX == "number" && a.x * o.signX <= 0, c = typeof o.signY == "number" && a.y * o.signY <= 0, l = Math.abs(a.x / r), u = Math.abs(a.y / i);
	return (t.originX === "center" || t.originX === .5) && (t.originY === "center" || t.originY === .5) && (l *= 2, u *= 2), {
		passedOriginX: s,
		passedOriginY: c,
		stepScaleX: l,
		stepScaleY: u
	};
}, kd = 1e-4;
function Ad(e) {
	return !!e && e instanceof _;
}
function jd(e) {
	if (!Ad(e)) return !1;
	let t = e.group;
	return e.shapeNodeType === "text" && t?.shapeComposite === !0;
}
function Md({ state: e, textbox: t }) {
	return Object.freeze({
		fontSize: t.fontSize ?? e.startBase.fontSize,
		padding: Object.freeze({
			top: t.paddingTop ?? 0,
			right: t.paddingRight ?? 0,
			bottom: t.paddingBottom ?? 0,
			left: t.paddingLeft ?? 0
		}),
		radii: Object.freeze({
			topLeft: t.radiusTopLeft ?? 0,
			topRight: t.radiusTopRight ?? 0,
			bottomRight: t.radiusBottomRight ?? 0,
			bottomLeft: t.radiusBottomLeft ?? 0
		}),
		width: t.width ?? e.startBase.width
	});
}
function Nd({ appliedWidth: e, current: t, isCornerHandle: n, isHorizontalHandle: r, isVerticalHandle: i, state: a }) {
	let { fontSize: o, width: s } = a.startBase, c = a.lastAllowedScaleX, l = a.lastAllowedScaleY;
	if (n) {
		let e = t.fontSize / Math.max(1, o);
		c = e, l = e;
	} else r ? c = e / Math.max(1, s) : i && (l = t.fontSize / Math.max(1, o));
	return Object.freeze({
		widthScale: c,
		heightScale: l
	});
}
function Pd({ appliedWidth: e, current: t, previous: n, dimensionsRounded: r }) {
	let i = Math.abs(e - n.width) > Yc, a = Math.abs(t.fontSize - n.fontSize) > Yc, o = Math.abs(t.padding.top - n.padding.top) > .01 || Math.abs(t.padding.right - n.padding.right) > .01 || Math.abs(t.padding.bottom - n.padding.bottom) > .01 || Math.abs(t.padding.left - n.padding.left) > .01, s = Math.abs(t.radii.topLeft - n.radii.topLeft) > .01 || Math.abs(t.radii.topRight - n.radii.topRight) > .01 || Math.abs(t.radii.bottomRight - n.radii.bottomRight) > .01 || Math.abs(t.radii.bottomLeft - n.radii.bottomLeft) > .01;
	return i || a || o || s || r;
}
function Fd({ currentScale: e, minimumScale: t, passedOrigin: n, participates: r, stepScale: i }) {
	return r ? n ? t : Math.max(t, e * i) : e;
}
function Id({ anchorPlacement: e, axisState: t, pointerStep: n, state: r }) {
	let { isCornerHandle: i, isHorizontalHandle: a, isVerticalHandle: o } = t, { passedOriginX: s, passedOriginY: c, stepScaleX: l, stepScaleY: u } = n;
	if (i) {
		let t = s || c ? r.minimumProportionalScale : Math.max(r.minimumProportionalScale, r.lastAllowedScaleX * Math.sqrt(l * u));
		return Math.abs(t - r.lastAllowedScaleX) <= kd ? null : Object.freeze({
			anchorPlacement: e,
			heightScale: t,
			shouldStoreLastAllowedState: !0,
			widthScale: t
		});
	}
	let d = Fd({
		currentScale: r.lastAllowedScaleX,
		minimumScale: r.minimumWidthScale,
		passedOrigin: s,
		participates: a,
		stepScale: l
	}), f = Fd({
		currentScale: r.lastAllowedScaleY,
		minimumScale: r.minimumFontScale,
		passedOrigin: c,
		participates: o,
		stepScale: u
	});
	return Math.abs(d - r.lastAllowedScaleX) <= kd && Math.abs(f - r.lastAllowedScaleY) <= kd ? null : Object.freeze({
		anchorPlacement: e,
		heightScale: f,
		shouldStoreLastAllowedState: !0,
		widthScale: d
	});
}
function Ld({ anchorPlacement: e, axisState: t, corner: n, rawScaleX: r, rawScaleY: i, scaleOriginX: a, scaleOriginY: o, state: s }) {
	let { isCornerHandle: c, isHorizontalHandle: l, isVerticalHandle: u } = t, d = Math.abs(r) || 1, f = Math.abs(i) || 1, p = s.lastAllowedScaleX, m = s.lastAllowedScaleY;
	if (!c) return l && (p = Math.max(s.minimumWidthScale, p * d)), u && (m = Math.max(s.minimumFontScale, m * f)), Object.freeze({
		anchorPlacement: e,
		heightScale: m,
		shouldStoreLastAllowedState: !0,
		widthScale: p
	});
	if (r < 0 || i < 0 || a !== s.startTransformOriginX || o !== s.startTransformOriginY || n !== s.startTransformCorner) return Object.freeze({
		anchorPlacement: s.lastAllowedAnchorPlacement,
		heightScale: m,
		shouldStoreLastAllowedState: !1,
		widthScale: p
	});
	let h = Math.max(s.minimumProportionalScale, s.lastAllowedScaleX * Math.sqrt(d * f));
	return Object.freeze({
		anchorPlacement: e,
		heightScale: h,
		shouldStoreLastAllowedState: !0,
		widthScale: h
	});
}
function Rd({ fixedAnchor: e, transform: t }) {
	return {
		left: e.x,
		top: e.y,
		originX: t.originX,
		originY: t.originY
	};
}
var zd = class {
	constructor({ canvas: t, canvasManager: n, persistScaledTextbox: r }) {
		this.handleMouseMove = (e) => {
			let t = this.canvas._currentTransform;
			if (!t) return;
			let { target: n } = t;
			if (!Ad(n) || jd(n)) return;
			let r = this.scalingState.get(n);
			if (!r || !e.e) return;
			let i = Ed({ transform: t }), { isCornerHandle: a, isHorizontalHandle: o, isVerticalHandle: s } = i;
			if (!o && !s && !a) return;
			let c = Od({
				textbox: n,
				transform: t,
				scenePoint: this.canvas.getScenePoint(e.e)
			});
			if (!c) return;
			let l = t.originX ?? n.originX ?? "center", u = t.originY ?? n.originY ?? "center", d = Id({
				anchorPlacement: this.canvasManager.getObjectPlacement({
					object: n,
					originX: l,
					originY: u
				}),
				axisState: i,
				pointerStep: c,
				state: r
			});
			if (!d) return;
			let f = Md({
				state: r,
				textbox: n
			}), { appliedWidth: p, dimensionsRounded: m } = this._materializeTextScaleStep({
				axisState: i,
				state: r,
				step: d,
				target: n,
				transform: t
			});
			this._updateScalingStateAfterLiveCommit({
				textbox: n,
				state: r,
				appliedWidth: p,
				previous: f,
				dimensionsRounded: m,
				isCornerHandle: a,
				isHorizontalHandle: o,
				isVerticalHandle: s,
				originX: l,
				originY: u
			}), this.canvas.requestRenderAll();
		}, this.handleObjectScaling = (t) => {
			let { target: n, transform: r } = t;
			if (n instanceof e || !Ad(n) || jd(n) || !r) return;
			n.isScaling = !0;
			let i = this._ensureScalingState({
				textbox: n,
				transform: r
			}), a = Md({
				state: i,
				textbox: n
			}), o = Ed({ transform: r }), { isCornerHandle: s, isHorizontalHandle: c, isVerticalHandle: l } = o, u = r.corner ?? "";
			if (!c && !l && !s) return;
			let d = n.scaleX ?? r.scaleX ?? 1, f = n.scaleY ?? r.scaleY ?? 1, p = r.originX ?? n.originX ?? "center", m = r.originY ?? n.originY ?? "center", h = Ld({
				anchorPlacement: this.canvasManager.getObjectPlacement({
					object: n,
					originX: p,
					originY: m
				}),
				axisState: o,
				corner: u,
				rawScaleX: d,
				rawScaleY: f,
				scaleOriginX: p,
				scaleOriginY: m,
				state: i
			}), { appliedWidth: g, dimensionsRounded: _ } = this._materializeTextScaleStep({
				axisState: o,
				state: i,
				step: h,
				target: n,
				transform: r
			});
			this.canvas.requestRenderAll(), h.shouldStoreLastAllowedState && this._updateScalingStateAfterLiveCommit({
				textbox: n,
				state: i,
				appliedWidth: g,
				previous: a,
				dimensionsRounded: _,
				isCornerHandle: s,
				isHorizontalHandle: c,
				isVerticalHandle: l,
				originX: p,
				originY: m
			});
		}, this.handleObjectModified = (t) => {
			let { target: n } = t;
			if (n instanceof e) {
				this._commitActiveSelectionScale({ selection: n });
				return;
			}
			Ad(n) && (jd(n) || this._commitStandaloneTextboxScale({ textbox: n }));
		}, this.canvas = t, this.canvasManager = n, this.persistScaledTextbox = r, this.scalingState = /* @__PURE__ */ new WeakMap();
	}
	commitStandaloneTextScale({ target: e, shouldDisableAutoExpandOnHorizontalChange: t = !1, shouldRoundDimensions: n = !0 }) {
		if (!Ad(e) || jd(e)) return !1;
		let r = Math.abs(e.scaleX ?? 1) || 1, i = Math.abs(e.scaleY ?? 1) || 1;
		if (!(Math.abs(r - 1) > .01 || Math.abs(i - 1) > .01)) return !1;
		let a = Nl({ textbox: e }), o = this.canvasManager.getObjectPlacement({ object: e });
		return Bl({
			textbox: e,
			canvasManager: this.canvasManager,
			base: a,
			widthScale: r,
			heightScale: i,
			placement: o,
			shouldScaleFontSize: !0,
			shouldScalePadding: !0,
			shouldScaleRadii: !0,
			shouldDisableAutoExpandOnHorizontalChange: t,
			shouldRoundDimensions: n
		}), e.preserveExactTextGeometry = !n, !0;
	}
	beginStandaloneCornerScale({ target: e, transform: t }) {
		if (!Ad(e) || jd(e)) return !1;
		let { isCornerHandle: n } = Ed({ transform: t });
		return !n || t.target !== e ? !1 : (this._ensureScalingState({
			textbox: e,
			transform: t
		}), !0);
	}
	applyStandaloneCornerScale({ fixedAnchor: e, scale: t, target: n, transform: r }) {
		let i = this.scalingState.get(n);
		if (!i) throw Error("Угловой скейлинг текста должен начинаться с исходного состояния");
		if (!Number.isFinite(t) || t <= 0) throw Error("Множитель скейлинга текста должен быть положительным");
		let a = Md({
			state: i,
			textbox: n
		}), o = this._materializeStandaloneCornerScale({
			fixedAnchor: e,
			scale: t,
			state: i,
			target: n,
			transform: r
		});
		return this._updateScalingStateAfterLiveCommit({
			textbox: n,
			state: i,
			appliedWidth: o.appliedWidth,
			previous: a,
			dimensionsRounded: o.dimensionsRounded,
			isCornerHandle: !0,
			isHorizontalHandle: !1,
			isVerticalHandle: !1,
			originX: r.originX,
			originY: r.originY
		}), i.hasScalingChange && (i.shouldRoundDimensionsOnCommit = !1), Math.abs(o.scale - 1) > kd && (r.actionPerformed = !0), this.canvas.requestRenderAll(), Object.freeze({
			canonicalState: Cd({ textbox: n }),
			scale: (n.fontSize ?? i.startBase.fontSize) / i.startBase.fontSize
		});
	}
	_materializeStandaloneCornerScale({ fixedAnchor: e, scale: t, state: n, target: r, transform: i }) {
		let a = Math.max(n.minimumProportionalScale, t), o = Bl({
			textbox: r,
			canvasManager: this.canvasManager,
			base: n.startBase,
			widthScale: a,
			heightScale: a,
			placement: n.startObjectPlacement,
			anchorPlacement: Rd({
				fixedAnchor: e,
				transform: i
			}),
			shouldScaleFontSize: !0,
			shouldScalePadding: !0,
			shouldScaleRadii: !0,
			shouldRoundDimensions: !1
		});
		return r.isScaling = !0, i.scaleX = 1, i.scaleY = 1, Object.freeze({
			...o,
			scale: a
		});
	}
	clearStandaloneCornerScale({ target: e }) {
		this.scalingState.delete(e), e.isScaling = !1;
	}
	prepareStandaloneCornerScaleForLegacyCommit({ target: e }) {
		let t = this.scalingState.get(e);
		if (!t) throw Error("Для перехода на прежнее завершение должен существовать активный скейлинг текста");
		t.shouldRoundDimensionsOnCommit = !0;
	}
	_materializeTextScaleStep({ axisState: e, state: t, step: n, target: r, transform: i }) {
		let { isCornerHandle: a, isHorizontalHandle: o, isVerticalHandle: s } = e, c = Bl({
			textbox: r,
			canvasManager: this.canvasManager,
			base: t.startBase,
			placement: t.startObjectPlacement,
			anchorPlacement: n.anchorPlacement,
			widthScale: n.widthScale,
			heightScale: n.heightScale,
			shouldScaleFontSize: a || s,
			shouldScalePadding: a || s,
			shouldScaleRadii: a || s,
			shouldDisableAutoExpandOnHorizontalChange: o,
			shouldRoundDimensions: !a
		});
		return Dd({
			textbox: r,
			transform: i,
			appliedWidth: c.appliedWidth
		}), c;
	}
	_commitActiveSelectionScale({ selection: t }) {
		let n = t.getObjects();
		if (!n.some((e) => Ad(e))) return;
		let { scaleX: r = 1, scaleY: i = 1 } = t;
		if (Math.abs(r - 1) < .01 && Math.abs(i - 1) < .01) return;
		this.canvas.discardActiveObject(), n.forEach((e) => {
			this.commitStandaloneTextScale({ target: e }), e.setCoords();
		});
		let a = new e(n, { canvas: this.canvas });
		this.canvas.setActiveObject(a), this.canvas.requestRenderAll();
	}
	_commitStandaloneTextboxScale({ textbox: e }) {
		e.isScaling = !1;
		let t = this.scalingState.get(e);
		if (this.scalingState.delete(e), !t?.hasScalingChange) return;
		let n = e.width ?? e.calcTextWidth(), { fontSize: r, styles: i } = t.startBase, a = e.fontSize ?? r ?? 16, o = Object.keys(i).length > 0, { paddingTop: s = 0, paddingRight: c = 0, paddingBottom: l = 0, paddingLeft: u = 0, radiusTopLeft: d = 0, radiusTopRight: f = 0, radiusBottomRight: p = 0, radiusBottomLeft: m = 0 } = e, h = {
			width: n,
			paddingTop: s,
			paddingRight: c,
			paddingBottom: l,
			paddingLeft: u,
			radiusTopLeft: d,
			radiusTopRight: f,
			radiusBottomRight: p,
			radiusBottomLeft: m
		};
		o || (h.fontSize = a), this.persistScaledTextbox({
			target: e,
			style: h,
			shouldRoundDimensions: t.shouldRoundDimensionsOnCommit
		}), e.set({
			scaleX: 1,
			scaleY: 1
		}), e.setCoords();
	}
	_ensureScalingState({ textbox: e, transform: t }) {
		let n = this.scalingState.get(e);
		if (!n) {
			let r = Nl({ textbox: e }), i = this.canvasManager.getObjectPlacement({ object: e }), a = Pl({ base: r }), o = t.original?.originX ?? t.originX ?? e.originX ?? "center", s = t.original?.originY ?? t.originY ?? e.originY ?? "center";
			n = {
				startBase: r,
				startObjectPlacement: i,
				startTransformCorner: typeof t.corner == "string" ? t.corner : null,
				startTransformOriginX: o,
				startTransformOriginY: s,
				lastAllowedScaleX: 1,
				lastAllowedScaleY: 1,
				lastAllowedAnchorPlacement: this.canvasManager.getObjectPlacement({
					object: e,
					originX: o,
					originY: s
				}),
				minimumWidthScale: a.widthScale,
				minimumFontScale: a.fontScale,
				minimumProportionalScale: a.proportionalScale,
				shouldRoundDimensionsOnCommit: !0,
				hasScalingChange: !1
			}, this.scalingState.set(e, n);
		}
		return n;
	}
	_updateScalingStateAfterLiveCommit({ textbox: e, state: t, appliedWidth: n, previous: r, dimensionsRounded: i, isCornerHandle: a, isHorizontalHandle: o, isVerticalHandle: s, originX: c, originY: l }) {
		let u = Md({
			state: t,
			textbox: e
		}), { widthScale: d, heightScale: f } = Nd({
			appliedWidth: n,
			current: u,
			isCornerHandle: a,
			isHorizontalHandle: o,
			isVerticalHandle: s,
			state: t
		});
		this._storeLastAllowedScalingState({
			textbox: e,
			state: t,
			widthScale: d,
			heightScale: f,
			originX: c,
			originY: l
		}), t.hasScalingChange = t.hasScalingChange || Pd({
			appliedWidth: n,
			current: u,
			previous: r,
			dimensionsRounded: i
		});
	}
	_storeLastAllowedScalingState({ textbox: e, state: t, widthScale: n, heightScale: r, originX: i, originY: a }) {
		t.lastAllowedScaleX = n, t.lastAllowedScaleY = r, t.lastAllowedAnchorPlacement = this.canvasManager.getObjectPlacement({
			object: e,
			originX: i,
			originY: a
		});
	}
}, Bd = "#3D8BF4", Vd = 1e-9, Hd = 2, Ud = Object.freeze({
	left: null,
	right: null,
	top: null,
	bottom: null
});
function Wd({ bounds: e, input: t }) {
	if (Xd({ input: t }), t.edges.length === 0) throw Error("Scale projection must contain at least one moving scene edge");
	let n = /* @__PURE__ */ new Set(), r = t.edges.map((r) => {
		if (n.has(r.edge)) throw Error(`Scale projection contains duplicate ${r.edge} edge`);
		return n.add(r.edge), Zd({
			bounds: e,
			input: r,
			variableCount: t.variables.length
		});
	});
	return Qd({
		edges: r,
		variables: t.variables
	}), Object.freeze({
		variables: Object.freeze([...t.variables]),
		baselineValues: Object.freeze([...t.baselineValues]),
		variableSceneWeights: Object.freeze([...t.variableSceneWeights]),
		edges: Object.freeze(r)
	});
}
function Gd({ projection: e, edge: t }) {
	return e.edges.find((e) => e.edge === t) ?? null;
}
function Kd({ projection: e, values: t }) {
	$d({
		projection: e,
		values: t
	});
	let n = { ...Ud };
	for (let r of e.edges) n[r.edge] = tf({
		projection: e,
		projectionEdge: r,
		values: t
	});
	return Object.freeze(n);
}
function qd({ projection: e, rawValues: t, constraints: n, epsilon: r }) {
	return $d({
		projection: e,
		values: t
	}), ef({
		projection: e,
		constraints: n,
		epsilon: r
	}), n.length === 0 ? sf({
		projection: e,
		values: t
	}) : n.length === 1 ? nf({
		projection: e,
		rawValues: t,
		constraint: n[0],
		epsilon: r
	}) : rf({
		projection: e,
		rawValues: t,
		constraints: n,
		epsilon: r
	});
}
function Jd({ projection: e, rawValues: t, constraint: n }) {
	let r = qd({
		projection: e,
		rawValues: t,
		constraints: [n],
		epsilon: Vd
	});
	if (!r) throw Error(`Scale constraint for ${n.edge} edge cannot be projected`);
	return cf({
		projection: e,
		first: t,
		second: r.values
	});
}
function Yd({ edge: e }) {
	return e === "left" || e === "right" ? "x" : "y";
}
function Xd({ input: e }) {
	let { variables: t, baselineValues: n, variableSceneWeights: r } = e;
	if (t.length === 0 || t.length > Hd) throw Error("Scale projection must contain one or two variables");
	if (t.length !== n.length) throw Error("Scale projection variables and baseline values must have equal length");
	if (t.length !== r.length) throw Error("Scale projection variables and scene weights must have equal length");
	if (new Set(t).size !== t.length) throw Error("Scale projection variables must be unique");
	if (!n.every(Number.isFinite)) throw Error("Scale projection baseline values must be finite");
	if (!r.every((e) => Number.isFinite(e) && e > 0)) throw Error("Scale projection scene weights must be finite positive numbers");
}
function Zd({ bounds: e, input: t, variableCount: n }) {
	if (t.coefficients.length !== n) throw Error(`Scale projection coefficients for ${t.edge} edge have invalid length`);
	if (!t.coefficients.every(Number.isFinite)) throw Error(`Scale projection coefficients for ${t.edge} edge must be finite`);
	return Object.freeze({
		axis: Yd({ edge: t.edge }),
		edge: t.edge,
		baselinePosition: e[t.edge],
		coefficients: Object.freeze([...t.coefficients])
	});
}
function Qd({ edges: e, variables: t }) {
	t.forEach((t, n) => {
		if (!e.some(({ coefficients: e }) => Math.abs(e[n]) > Vd)) throw Error(`Scale projection variable "${t}" must affect at least one edge`);
	});
}
function $d({ projection: e, values: t }) {
	if (t.length !== e.variables.length) throw Error("Scale projection values have invalid length");
	if (!t.every(Number.isFinite)) throw Error("Scale projection values must be finite");
}
function ef({ projection: e, constraints: t, epsilon: n }) {
	if (t.length > 2) throw Error("Scale projection supports at most two scene constraints");
	if (!Number.isFinite(n) || n < 0) throw Error("Scale projection epsilon must be a finite non-negative number");
	if (new Set(t.map(({ axis: e }) => e)).size !== t.length) throw Error("Scale projection constraints must use different scene axes");
	for (let n of t) {
		let t = Gd({
			projection: e,
			edge: n.edge
		});
		if (!t || t.axis !== n.axis) throw Error(`Scale projection does not contain ${n.edge} edge on ${n.axis} axis`);
		if (!Number.isFinite(n.position)) throw Error(`Scale projection constraint for ${n.edge} edge must be finite`);
	}
}
function tf({ projection: e, projectionEdge: t, values: n }) {
	let r = t.baselinePosition;
	for (let i = 0; i < n.length; i += 1) r += t.coefficients[i] * (n[i] - e.baselineValues[i]);
	return r;
}
function nf({ projection: e, rawValues: t, constraint: n, epsilon: r }) {
	let i = Gd({
		projection: e,
		edge: n.edge
	});
	if (!i) throw Error(`Scale projection does not contain ${n.edge} edge`);
	let a = Kd({
		projection: e,
		values: t
	})[n.edge];
	if (a === null) throw Error(`Scale projection did not resolve ${n.edge} position`);
	let o = n.position - a;
	if (Math.hypot(...i.coefficients) <= Vd) return Math.abs(o) <= r ? sf({
		projection: e,
		values: t
	}) : null;
	let s = i.coefficients.map((t, n) => t / e.variableSceneWeights[n] ** 2), c = i.coefficients.reduce((e, t, n) => e + t * s[n], 0);
	return sf({
		projection: e,
		values: t.map((e, t) => e + s[t] * o / c)
	});
}
function rf({ projection: e, rawValues: t, constraints: n, epsilon: r }) {
	let i = e.variables.length === 2 ? af({
		projection: e,
		rawValues: t,
		constraints: n
	}) : null;
	if (i && of({
		solution: i,
		constraints: n,
		epsilon: r
	})) return i;
	for (let i of n) {
		let a = nf({
			projection: e,
			rawValues: t,
			constraint: i,
			epsilon: r
		});
		if (a && of({
			solution: a,
			constraints: n,
			epsilon: r
		})) return a;
	}
	return null;
}
function af({ projection: e, rawValues: t, constraints: n }) {
	let [r, i] = n, a = Gd({
		projection: e,
		edge: r.edge
	}), o = Gd({
		projection: e,
		edge: i.edge
	});
	if (!a || !o) return null;
	let [s, c] = a.coefficients, [l, u] = o.coefficients, d = Math.hypot(s, c), f = Math.hypot(l, u);
	if (d <= Vd || f <= Vd) return null;
	let p = s / d, m = c / d, h = l / f, g = u / f, _ = p * g - m * h;
	if (Math.abs(_) <= Vd) return null;
	let v = Kd({
		projection: e,
		values: t
	}), y = v[r.edge], b = v[i.edge];
	if (y === null || b === null) return null;
	let x = (r.position - y) / d, S = (i.position - b) / f, C = (x * g - m * S) / _, w = (p * S - x * h) / _;
	return sf({
		projection: e,
		values: [t[0] + C, t[1] + w]
	});
}
function of({ solution: e, constraints: t, epsilon: n }) {
	for (let r of t) {
		let t = e.positions[r.edge];
		if (t === null || Math.abs(t - r.position) > n) return !1;
	}
	return !0;
}
function sf({ projection: e, values: t }) {
	let n = Object.freeze([...t]);
	return Object.freeze({
		values: n,
		positions: Kd({
			projection: e,
			values: n
		})
	});
}
function cf({ projection: e, first: t, second: n }) {
	let r = 0;
	for (let i = 0; i < t.length; i += 1) {
		let a = (t[i] - n[i]) * e.variableSceneWeights[i];
		r += a ** 2;
	}
	return Math.sqrt(r);
}
//#endregion
//#region src/editor/snapping-manager/scaling/scale-snapping-resolver.ts
function lf({ constraints: e }) {
	let t = [e.x, e.y].filter((e) => e !== null).map((e) => Object.freeze({
		axis: e.axis,
		edge: e.candidate.edge,
		position: e.expectedPosition
	}));
	return Object.freeze(t);
}
var uf = .1, df = 1e-9, ff = 1e-9, pf = Object.freeze({
	"domain-boundary": 0,
	edge: 1,
	center: 2,
	spacing: 3
}), mf = Object.freeze({ kind: "free" }), hf = Object.freeze({
	x: mf,
	y: mf
});
function gf({ bounds: e, fixedAnchor: t, projectionModes: n, candidates: r, zoom: i }) {
	let a = Cf({ bounds: e }), o = wf({
		point: t,
		name: "fixed anchor"
	}), s = Tf({
		bounds: a,
		projectionModes: n
	}), c = Df({
		candidates: r,
		projectionModes: s
	});
	return Object.freeze({
		bounds: a,
		fixedAnchor: o,
		projectionModes: s,
		candidates: c,
		thresholds: Sf({ zoom: i })
	});
}
function _f({ baseline: e, intent: t, holdState: n, stepProjection: r }) {
	let i = yf({
		baselineMode: Ef({
			baseline: e,
			modeId: t.projectionMode
		}),
		stepProjection: r
	});
	kf({
		projection: i.projection,
		intent: t
	}), Pf({
		baseline: e,
		holdState: n
	});
	let a = Object.freeze([...t.values]), o = Kd({
		projection: i.projection,
		values: a
	});
	if (t.modifiers.ctrlKey) return Wf({
		baseline: e,
		projectionMode: i,
		rawValues: a,
		rawPositions: o,
		proposals: Object.freeze({
			x: null,
			y: null
		}),
		resolved: null
	});
	let s = {
		baseline: e,
		projectionMode: i,
		rawPositions: o,
		rawValues: a
	}, c = Ff({
		...s,
		axis: "x",
		hold: n.x
	}), l = Ff({
		...s,
		axis: "y",
		hold: n.y
	}), u = zf({
		baseline: e,
		projectionMode: i,
		rawValues: a,
		x: c,
		y: l
	});
	return Wf({
		baseline: e,
		projectionMode: i,
		rawValues: a,
		rawPositions: o,
		proposals: Object.freeze({
			x: c,
			y: l
		}),
		resolved: u
	});
}
function vf({ plan: e, refinement: t }) {
	let n = yf({
		baselineMode: Object.freeze({
			id: e.projectionMode,
			projection: e.projection
		}),
		stepProjection: t.stepProjection
	}), r = Object.freeze([...t.effectiveValues]);
	Af({
		projection: n.projection,
		values: r
	});
	let i = Mf({
		candidates: e.refinementCandidates,
		constraints: t.constraints
	}), a = Kd({
		projection: n.projection,
		values: r
	});
	return jf({
		bounds: t.stepProjection.bounds,
		constraints: i,
		effectivePositions: a,
		verificationEpsilon: e.verificationEpsilon
	}), Object.freeze({
		...e,
		projection: n.projection,
		variables: n.projection.variables,
		effectiveValues: r,
		effectivePositions: a,
		constraints: i,
		proposedHoldState: Jf(i)
	});
}
function yf({ baselineMode: e, stepProjection: t }) {
	if (!t) return e;
	let n = Wd({
		bounds: Cf({ bounds: t.bounds }),
		input: t.projection
	});
	return bf({
		baseline: e.projection,
		step: n
	}), Object.freeze({
		id: e.id,
		projection: n
	});
}
function bf({ baseline: e, step: t }) {
	if (!(e.variables.length === t.variables.length && e.variables.every((e, n) => e === t.variables[n]))) throw Error("Scale step projection must preserve gesture variables");
	let n = e.edges.map(({ edge: e }) => e).sort(), r = t.edges.map(({ edge: e }) => e).sort();
	if (!(n.length === r.length && n.every((e, t) => e === r[t]))) throw Error("Scale step projection must preserve gesture edges");
}
function xf({ plan: e, finalGeometry: t }) {
	let { measuredValues: n, domainVerdict: r } = t, i = Cf({ bounds: t.bounds }), a = wf({
		point: t.fixedAnchor,
		name: "final fixed anchor"
	}), o = np({
		first: e.fixedAnchor,
		second: a,
		epsilon: e.verificationEpsilon
	}), s = Zf({
		plan: e,
		measuredValues: n
	}), c = o && r.protectedState === "preserved";
	return $f({
		plan: e,
		xVerified: c && r.x === "satisfied" && Qf({
			constraint: e.constraints.x,
			measuredPositions: s,
			plan: e
		}) && Xf({
			constraint: e.constraints.x,
			bounds: i,
			plan: e
		}),
		yVerified: c && r.y === "satisfied" && Qf({
			constraint: e.constraints.y,
			measuredPositions: s,
			plan: e
		}) && Xf({
			constraint: e.constraints.y,
			bounds: i,
			plan: e
		})
	});
}
function Sf({ zoom: e }) {
	if (!Number.isFinite(e) || e <= 0) throw Error("Scale snapping zoom must be a finite positive number");
	return Object.freeze({
		acquire: 5 / e,
		release: 5 / e,
		spacingRelease: 10 / e,
		verification: uf
	});
}
function Cf({ bounds: e }) {
	let { left: t, right: n, top: r, bottom: i, centerX: a, centerY: o } = e;
	if (![
		t,
		n,
		r,
		i
	].every(Number.isFinite) || n < t || i < r) throw Error("Scale snapping bounds must contain finite ordered edges");
	if (!Number.isFinite(a) || !Number.isFinite(o)) throw Error("Scale snapping bounds must contain finite centers");
	let s = t + (n - t) / 2, c = r + (i - r) / 2;
	if (Math.abs(a - s) > df || Math.abs(o - c) > df) throw Error("Scale snapping bounds centers must be derived from their edges");
	return Object.freeze({
		left: t,
		right: n,
		top: r,
		bottom: i,
		centerX: a,
		centerY: o
	});
}
function wf({ point: e, name: t }) {
	if (!Number.isFinite(e.x) || !Number.isFinite(e.y)) throw Error(`Scale snapping ${t} must contain finite coordinates`);
	return Object.freeze({
		x: e.x,
		y: e.y
	});
}
function Tf({ bounds: e, projectionModes: t }) {
	if (t.length === 0) throw Error("Scale gesture baseline must contain at least one projection mode");
	let n = /* @__PURE__ */ new Set(), r = t.map(({ id: t, projection: r }) => {
		if (t.trim().length === 0 || n.has(t)) throw Error(`Scale projection mode id "${t}" must be non-empty and unique`);
		return n.add(t), Object.freeze({
			id: t,
			projection: Wd({
				bounds: e,
				input: r
			})
		});
	});
	return Object.freeze(r);
}
function Ef({ baseline: e, modeId: t }) {
	let n = e.projectionModes.find(({ id: e }) => e === t);
	if (!n) throw Error(`Unknown scale projection mode "${t}"`);
	return n;
}
function Df({ candidates: e, projectionModes: t }) {
	let n = /* @__PURE__ */ new Set(), r = e.map((e, r) => (Of({
		candidate: e,
		projectionModes: t,
		candidateIds: n
	}), n.add(e.id), Object.freeze({
		...e,
		snapshotIndex: r
	})));
	return Object.freeze(r);
}
function Of({ candidate: e, projectionModes: t, candidateIds: n }) {
	if (e.id.trim().length === 0 || n.has(e.id)) throw Error(`Scale snap candidate id "${e.id}" must be non-empty and unique`);
	if (!Number.isFinite(e.position)) throw Error(`Scale snap candidate "${e.id}" position must be finite`);
	if (Yd({ edge: e.edge }) !== e.axis) throw Error(`Scale snap candidate "${e.id}" edge does not belong to ${e.axis} axis`);
	if (!t.some(({ projection: t }) => !!Gd({
		projection: t,
		edge: e.edge
	}))) throw Error(`Scale snap candidate "${e.id}" edge is not moved by any projection mode`);
}
function kf({ projection: e, intent: t }) {
	if (t.values.length !== e.variables.length) throw Error("Scale raw intent has invalid values length");
	if (!t.values.every(Number.isFinite)) throw Error("Scale raw intent values must be finite");
	if (typeof t.modifiers.ctrlKey != "boolean" || typeof t.modifiers.shiftKey != "boolean") throw Error("Scale raw intent modifiers must be boolean");
}
function Af({ projection: e, values: t }) {
	if (t.length !== e.variables.length) throw Error("Scale refinement has invalid values length");
	if (!t.every(Number.isFinite)) throw Error("Scale refinement values must be finite");
}
function jf({ bounds: e, constraints: t, effectivePositions: n, verificationEpsilon: r }) {
	for (let i of [t.x, t.y]) {
		if (!i) continue;
		let { edge: t } = i.candidate, a = n[t], o = e[t];
		if (a === null || Math.abs(a - i.expectedPosition) > r || Math.abs(o - i.expectedPosition) > r) throw Error(`Refined scale plan does not reach ${t} constraint`);
	}
}
function Mf({ candidates: e, constraints: t }) {
	return Object.freeze({
		x: Nf({
			axis: "x",
			candidate: e.x,
			constraint: t.x
		}),
		y: Nf({
			axis: "y",
			candidate: e.y,
			constraint: t.y
		})
	});
}
function Nf({ axis: e, candidate: t, constraint: n }) {
	if (!n) return null;
	if (!t || !ip({
		first: t,
		second: n
	})) throw Error(`Refined ${e} constraint does not belong to scale plan candidates`);
	return t;
}
function Pf({ baseline: e, holdState: t }) {
	for (let n of ["x", "y"]) {
		let r = t[n];
		if (r.kind === "free") continue;
		if (r.candidate.axis !== n) throw Error(`Held scale candidate belongs to ${r.candidate.axis}, not ${n} axis`);
		let i = e.candidates[r.candidate.snapshotIndex];
		if (!i || !rp({
			first: i,
			second: r.candidate
		})) throw Error(`Held scale candidate "${r.candidate.id}" does not belong to baseline snapshot`);
	}
}
function Ff({ axis: e, baseline: t, projectionMode: n, rawPositions: r, rawValues: i, hold: a }) {
	if (a.kind === "held") {
		let o = r[a.candidate.edge], s = a.candidate.category === "spacing" ? t.thresholds.spacingRelease : t.thresholds.release;
		if (o !== null && Math.abs(o - a.candidate.position) <= s && Lf({
			baseline: t,
			candidate: a.candidate,
			projectionMode: n,
			rawValues: i
		})) return Object.freeze({
			axis: e,
			candidate: a.candidate,
			transition: "held"
		});
	}
	let o = If({
		axis: e,
		baseline: t,
		projectionMode: n,
		rawPositions: r,
		rawValues: i
	});
	return o ? Object.freeze({
		axis: e,
		candidate: o,
		transition: "acquired"
	}) : null;
}
function If({ axis: e, baseline: t, projectionMode: n, rawPositions: r, rawValues: i }) {
	let a = null, o = Infinity;
	for (let s of t.candidates) {
		if (s.axis !== e || !Gd({
			projection: n.projection,
			edge: s.edge
		})) continue;
		let c = r[s.edge];
		if (c === null) continue;
		let l = Math.abs(s.position - c);
		l > t.thresholds.acquire || Lf({
			baseline: t,
			candidate: s,
			projectionMode: n,
			rawValues: i
		}) && Rf({
			candidate: s,
			distance: l,
			bestCandidate: a,
			bestDistance: o
		}) && (a = s, o = l);
	}
	return a;
}
function Lf({ baseline: e, candidate: t, projectionMode: n, rawValues: r }) {
	return qd({
		projection: n.projection,
		rawValues: r,
		constraints: [{
			axis: t.axis,
			edge: t.edge,
			position: t.position
		}],
		epsilon: e.thresholds.verification
	}) !== null;
}
function Rf({ candidate: e, distance: t, bestCandidate: n, bestDistance: r }) {
	if (!n) return !0;
	let i = t - r;
	if (i < -1e-9) return !0;
	if (i > ff) return !1;
	let a = pf[e.category], o = pf[n.category];
	return a === o ? e.snapshotIndex < n.snapshotIndex : a < o;
}
function zf({ baseline: e, projectionMode: t, rawValues: n, x: r, y: i }) {
	let a = Bf({
		projectionMode: t,
		rawValues: n,
		x: r,
		y: i
	}), o = a.map(Uf), s = qd({
		projection: t.projection,
		rawValues: n,
		constraints: o,
		epsilon: e.thresholds.verification
	});
	if (s) return Object.freeze({
		x: r,
		y: i,
		solution: s
	});
	let [c] = a;
	if (!c) throw Error("Raw scale intent must have a projection solution");
	let l = qd({
		projection: t.projection,
		rawValues: n,
		constraints: [Uf(c)],
		epsilon: e.thresholds.verification
	});
	if (!l) throw Error(`Scale constraint for ${c.candidate.edge} edge must have a projection solution`);
	return Object.freeze({
		x: c.axis === "x" ? c : null,
		y: c.axis === "y" ? c : null,
		solution: l
	});
}
function Bf({ projectionMode: e, rawValues: t, x: n, y: r }) {
	let i = [];
	return n && i.push(n), r && i.push(r), !n || !r ? Object.freeze(i) : Vf({
		projectionMode: e,
		rawValues: t,
		x: n,
		y: r
	}).axis === "x" ? Object.freeze([n, r]) : Object.freeze([r, n]);
}
function Vf({ projectionMode: e, rawValues: t, x: n, y: r }) {
	if (n.transition !== r.transition) return n.transition === "held" ? n : r;
	let i = Hf({
		projectionMode: e,
		rawValues: t,
		proposal: n
	}) - Hf({
		projectionMode: e,
		rawValues: t,
		proposal: r
	});
	return i < -1e-9 ? n : i > ff ? r : n;
}
function Hf({ projectionMode: e, rawValues: t, proposal: n }) {
	return Jd({
		projection: e.projection,
		rawValues: t,
		constraint: Uf(n)
	});
}
function Uf(e) {
	return Object.freeze({
		axis: e.axis,
		edge: e.candidate.edge,
		position: e.candidate.position
	});
}
function Wf({ baseline: e, projectionMode: t, rawValues: n, rawPositions: r, proposals: i, resolved: a }) {
	let o = a ? a.solution.values : n, s = a ? a.solution.positions : r, c = Gf({
		x: a?.x ?? null,
		y: a?.y ?? null
	}), l = Gf(i);
	return Kf({
		constraints: c,
		effectivePositions: s,
		verificationEpsilon: e.thresholds.verification
	}), Object.freeze({
		projectionMode: t.id,
		projection: t.projection,
		variables: t.projection.variables,
		rawValues: n,
		effectiveValues: o,
		rawPositions: r,
		effectivePositions: s,
		constraints: c,
		refinementCandidates: l,
		proposedHoldState: Jf(c),
		fixedAnchor: e.fixedAnchor,
		verificationEpsilon: e.thresholds.verification
	});
}
function Gf({ x: e, y: t }) {
	return Object.freeze({
		x: e ? qf(e) : null,
		y: t ? qf(t) : null
	});
}
function Kf({ constraints: e, effectivePositions: t, verificationEpsilon: n }) {
	for (let r of [e.x, e.y]) {
		if (!r) continue;
		let e = t[r.candidate.edge];
		if (e === null || Math.abs(e - r.expectedPosition) > n) throw Error(`Scale plan does not reach ${r.candidate.edge} constraint`);
	}
}
function qf(e) {
	return Object.freeze({
		axis: e.axis,
		candidate: e.candidate,
		transition: e.transition,
		expectedPosition: e.candidate.position
	});
}
function Jf({ x: e, y: t }) {
	return Object.freeze({
		x: Yf({ constraint: e }),
		y: Yf({ constraint: t })
	});
}
function Yf({ constraint: e }) {
	return e ? Object.freeze({
		kind: "held",
		candidate: e.candidate
	}) : mf;
}
function Xf({ constraint: e, bounds: t, plan: n }) {
	if (!e) return !1;
	let r = t[e.candidate.edge];
	return Math.abs(r - e.expectedPosition) <= n.verificationEpsilon;
}
function Zf({ plan: e, measuredValues: t }) {
	return t.length !== e.projection.variables.length || !t.every(Number.isFinite) ? null : Kd({
		projection: e.projection,
		values: t
	});
}
function Qf({ constraint: e, measuredPositions: t, plan: n }) {
	if (!e || !t) return !1;
	let { edge: r } = e.candidate, i = t[r], a = n.effectivePositions[r];
	return i === null || a === null ? !1 : Math.abs(i - a) <= n.verificationEpsilon;
}
function $f({ plan: e, xVerified: t, yVerified: n }) {
	let r = [], i = [], a = ep({
		constraint: e.constraints.x,
		verified: t,
		guides: r,
		blockedAxes: i
	}), o = ep({
		constraint: e.constraints.y,
		verified: n,
		guides: r,
		blockedAxes: i
	});
	return Object.freeze({
		guides: Object.freeze(r),
		blockedAxes: Object.freeze(i),
		holdState: Object.freeze({
			x: a,
			y: o
		})
	});
}
function ep({ constraint: e, verified: t, guides: n, blockedAxes: r }) {
	return e ? t ? (n.push(tp(e)), Object.freeze({
		kind: "held",
		candidate: e.candidate
	})) : (r.push(e.axis), mf) : mf;
}
function tp(e) {
	let { candidate: t } = e;
	return Object.freeze({
		axis: e.axis,
		edge: t.edge,
		position: t.position,
		candidateId: t.id,
		category: t.category,
		snapshotIndex: t.snapshotIndex
	});
}
function np({ first: e, second: t, epsilon: n }) {
	return Math.abs(e.x - t.x) <= n && Math.abs(e.y - t.y) <= n;
}
function rp({ first: e, second: t }) {
	return e.id === t.id && e.axis === t.axis && e.edge === t.edge && e.position === t.position && e.category === t.category && e.snapshotIndex === t.snapshotIndex;
}
function ip({ first: e, second: t }) {
	return e.axis === t.axis && e.transition === t.transition && e.expectedPosition === t.expectedPosition && rp({
		first: e.candidate,
		second: t.candidate
	});
}
//#endregion
//#region src/editor/snapping-manager/scaling/scale-snapping-runtime.ts
var ap = 1, op = Object.freeze({
	didCleanup: !1,
	hiddenGuides: Object.freeze([])
}), sp = class {
	constructor() {
		this._session = null, this._issuedTokens = /* @__PURE__ */ new WeakSet(), this._consumedTokens = /* @__PURE__ */ new WeakSet();
	}
	startSession({ baseline: e }) {
		if (this._session) throw Error("Scale snapping runtime already has an active session");
		this._session = {
			id: ap,
			baseline: e,
			holdState: hf,
			visibleGuides: Object.freeze([]),
			markerRecords: /* @__PURE__ */ new WeakMap(),
			pendingStep: null,
			nextStep: 1
		}, ap += 1;
	}
	getDuplicateStep({ marker: e }) {
		let t = this._getActiveSession();
		return this._getDuplicateStep({
			session: t,
			marker: e
		});
	}
	resolveScalePlan({ marker: e, intent: t, stepProjection: n }) {
		let r = this._getActiveSession(), i = r.markerRecords.get(e);
		if (i) return up({
			first: i.intent.projectionMode,
			second: t.projectionMode
		}), dp({
			first: i.intent.values,
			second: t.values
		}), fp({
			first: i.intent.modifiers,
			second: t.modifiers
		}), lp({ record: i });
		if (r.pendingStep) throw Error("Previous scale plan token must be verified before the next pointer marker");
		let a = _f({
			baseline: r.baseline,
			intent: t,
			holdState: r.holdState,
			stepProjection: n
		}), o = this._createPlanToken({ session: r }), s = {
			intent: cp(t),
			token: o,
			plan: a,
			verification: null
		};
		return r.markerRecords.set(e, s), r.pendingStep = s, Object.freeze({
			kind: "planned",
			token: o,
			plan: a
		});
	}
	refineScalePlan({ token: e, refinement: t }) {
		let n = this._getActiveSession();
		this._assertUsableToken({
			session: n,
			token: e
		});
		let { pendingStep: r } = n;
		if (!r) throw Error("Scale snapping runtime has no pointer step to refine");
		let i = vf({
			plan: r.plan,
			refinement: t
		});
		return r.plan = i, i;
	}
	verifyScalePlan({ token: e, finalGeometry: t }) {
		let n = this._getActiveSession();
		this._assertUsableToken({
			session: n,
			token: e
		});
		let { pendingStep: r } = n;
		if (!r) throw Error("Scale snapping runtime has no pointer step to verify");
		let i = xf({
			plan: r.plan,
			finalGeometry: t
		});
		return this._consumedTokens.add(e), r.verification = i, n.pendingStep = null, n.holdState = i.holdState, n.visibleGuides = i.guides, i;
	}
	finishSession() {
		let e = this._session;
		if (!e) return op;
		let t = e.pendingStep?.token;
		t && this._consumedTokens.add(t);
		let n = Object.freeze({
			didCleanup: !0,
			hiddenGuides: Object.freeze([...e.visibleGuides])
		});
		return this._session = null, n;
	}
	_getActiveSession() {
		if (!this._session) throw Error("Scale snapping runtime has no active session");
		return this._session;
	}
	_getDuplicateStep({ session: e, marker: t }) {
		let n = e.markerRecords.get(t);
		return n ? lp({ record: n }) : null;
	}
	_createPlanToken({ session: e }) {
		let t = Object.freeze({
			sessionId: e.id,
			step: e.nextStep
		});
		return e.nextStep += 1, this._issuedTokens.add(t), t;
	}
	_assertUsableToken({ session: e, token: t }) {
		if (!this._issuedTokens.has(t)) throw Error("Foreign scale plan token");
		if (this._consumedTokens.has(t)) throw Error("Scale plan token has already been used");
		if (!e.pendingStep || e.pendingStep.token !== t) throw Error("Scale plan token does not belong to the current pointer step");
	}
};
function cp(e) {
	return Object.freeze({
		projectionMode: e.projectionMode,
		values: Object.freeze([...e.values]),
		modifiers: Object.freeze({
			ctrlKey: e.modifiers.ctrlKey,
			shiftKey: e.modifiers.shiftKey
		})
	});
}
function lp({ record: e }) {
	return Object.freeze({
		kind: "duplicate",
		phase: e.verification ? "verified" : "pending",
		token: e.token,
		plan: e.plan,
		verification: e.verification
	});
}
function up({ first: e, second: t }) {
	if (e !== t) throw Error("Native scale pointer marker was reused with a different projection mode");
}
function dp({ first: e, second: t }) {
	if (!(e.length === t.length && e.every((e, n) => e === t[n]))) throw Error("Native scale pointer marker was reused with different transform values");
}
function fp({ first: e, second: t }) {
	if (e.ctrlKey !== t.ctrlKey || e.shiftKey !== t.shiftKey) throw Error("Native scale pointer marker was reused with different modifiers");
}
//#endregion
//#region src/editor/text-manager/scaling/text-scaling-measurement.ts
function pp({ textbox: e }) {
	let t = {};
	return Object.entries(e.styles ?? {}).forEach(([e, n]) => {
		if (!n) return;
		let r = {};
		Object.entries(n).forEach(([e, t]) => {
			t && (r[e] = { ...t });
		}), t[e] = r;
	}), t;
}
function mp({ target: e, autoExpand: t }) {
	return {
		left: e.left,
		top: e.top,
		originX: e.originX,
		originY: e.originY,
		angle: e.angle,
		scaleX: e.scaleX,
		scaleY: e.scaleY,
		width: e.width,
		minWidth: e.minWidth,
		fontFamily: e.fontFamily,
		fontSize: e.fontSize,
		fontStyle: e.fontStyle,
		fontWeight: e.fontWeight,
		lineHeight: e.lineHeight,
		charSpacing: e.charSpacing,
		textAlign: e.textAlign,
		direction: e.direction,
		splitByGrapheme: e.splitByGrapheme,
		fill: e.fill,
		stroke: e.stroke,
		strokeWidth: e.strokeWidth,
		strokeUniform: e.strokeUniform,
		paintFirst: e.paintFirst,
		styles: pp({ textbox: e }),
		lineFontDefaults: vl({ lineFontDefaults: e.lineFontDefaults }),
		backgroundColor: e.backgroundColor,
		backgroundOpacity: e.backgroundOpacity,
		paddingTop: e.paddingTop,
		paddingRight: e.paddingRight,
		paddingBottom: e.paddingBottom,
		paddingLeft: e.paddingLeft,
		radiusTopLeft: e.radiusTopLeft,
		radiusTopRight: e.radiusTopRight,
		radiusBottomRight: e.radiusBottomRight,
		radiusBottomLeft: e.radiusBottomLeft,
		autoExpand: t
	};
}
function hp({ target: e, options: t = {} }) {
	let n = t.autoExpand ?? e.autoExpand !== !1, r = new _d(e.text ?? "", mp({
		target: e,
		autoExpand: n
	})), { width: i } = e;
	return typeof i == "number" && Number.isFinite(i) && (hd({
		textbox: r,
		width: i
	}), r.autoExpand = n), r;
}
//#endregion
//#region src/editor/text-manager/scaling/text-corner-scale-projection.ts
var gp = "uniform", _p = 1e-9;
function vp({ transform: e }) {
	let t = e.original?.scaleX, n = e.original?.scaleY;
	return typeof t != "number" || !Number.isFinite(t) || t <= 0 || typeof n != "number" || !Number.isFinite(n) || n <= 0 ? null : Object.freeze({
		x: t,
		y: n
	});
}
function yp({ projection: e }) {
	return bc({ projection: e }).find(({ id: e }) => e === "uniform") ?? null;
}
function bp({ textbox: e, transform: t, pointerStart: n }) {
	let r = vp({ transform: t });
	if (!r) return null;
	let i = rc({
		transform: Object.freeze({
			target: e,
			action: t.action,
			corner: t.corner,
			originX: t.originX,
			originY: t.originY,
			original: Object.freeze({
				scaleX: r.x,
				scaleY: r.y
			})
		}),
		pointerStart: n
	});
	if (!i) return null;
	let a = yp({ projection: i });
	return a ? Object.freeze({
		baselineBounds: i.baselineBounds,
		fixedAnchor: i.fixedAnchor,
		movingEdges: xc({ projectionModes: [a] }),
		projectionMode: a,
		rectangular: i
	}) : null;
}
function xp({ gesture: e, pointer: t }) {
	if (!Number.isFinite(t.x) || !Number.isFinite(t.y)) return null;
	let n = lc({
		projection: e.rectangular,
		pointer: t,
		mode: gp
	});
	return n ? !Number.isFinite(n.x) || n.x < 0 ? null : n.x : 0;
}
function Sp({ bounds: e, edge: t, samples: n, scale: r }) {
	let i = 0;
	for (let a of n) {
		let n = a.bounds[t] - e[t];
		if (Math.abs(n) <= _p) continue;
		let o = n / (a.scale - r);
		Math.abs(o) > Math.abs(i) && (i = o);
	}
	return i;
}
function Cp({ bounds: e, gesture: t, samples: n, scale: r }) {
	if (!Number.isFinite(r) || r <= 0 || n.length === 0 || n.length > 2 || !n.every((e) => Number.isFinite(e.scale) && e.scale > 0 && Math.abs(e.scale - r) > 2 ** -52) || n.length === 2 && Math.abs(n[0].scale - n[1].scale) <= 2 ** -52) return null;
	let i = t.projectionMode.projection.edges.map(({ edge: t }) => Object.freeze({
		edge: t,
		coefficients: Object.freeze([Sp({
			bounds: e,
			edge: t,
			samples: n,
			scale: r
		})])
	}));
	return Object.freeze({
		bounds: Object.freeze({ ...e }),
		projection: Object.freeze({
			variables: t.projectionMode.projection.variables,
			baselineValues: Object.freeze([r]),
			variableSceneWeights: t.projectionMode.projection.variableSceneWeights,
			edges: Object.freeze(i)
		})
	});
}
//#endregion
//#region src/editor/text-manager/scaling/text-corner-scale-measurer.ts
var wp = .01, Tp = 8, Ep = 2, Dp = 1e-9;
function Op({ gesture: e, transform: t }) {
	return {
		left: e.fixedAnchor.x,
		top: e.fixedAnchor.y,
		originX: t.originX,
		originY: t.originY
	};
}
var kp = class {
	constructor({ canvasManager: e, gesture: t, target: n, transform: r }) {
		this.measurements = /* @__PURE__ */ new Map(), this.canvasManager = e, this.gesture = t, this.placement = e.getObjectPlacement({ object: n }), this.textbox = hp({ target: n }), this.base = Nl({ textbox: this.textbox }), this.minimumScale = Pl({ base: this.base }).proportionalScale, this.transform = r;
	}
	measure({ scale: e }) {
		let t = Math.max(this.minimumScale, e), n = this.measurements.get(t);
		if (n) return this.measurements.delete(t), this.measurements.set(t, n), n;
		let { bounds: r, canonicalState: i } = this._measureCanonicalState({ scale: t }), a = this._resolveProjectionSamples({
			bounds: r,
			scale: t
		}), o = Cp({
			bounds: r,
			gesture: this.gesture,
			samples: a,
			scale: t
		});
		if (!o) throw Error("Не удалось построить проекцию скейлинга текста");
		let s = Object.freeze({
			canonicalState: i,
			projection: o,
			scale: t
		});
		if (this.measurements.set(t, s), this.measurements.size > Ep) {
			let e = this.measurements.keys().next().value;
			if (typeof e != "number") throw Error("Кеш измерений текста не должен быть пустым");
			this.measurements.delete(e);
		}
		return s;
	}
	_resolveProjectionSamples({ bounds: e, scale: t }) {
		for (let n = 0; n < Tp; n += 1) {
			let r = wp * 2 ** n, i = Math.max(this.minimumScale, t - r), a = (i < t ? [i, t + r] : [t + r]).map((e) => Object.freeze({
				bounds: this._measureBounds({ scale: e }),
				scale: e
			}));
			if (a.some((t) => this.gesture.movingEdges.some((n) => Math.abs(t.bounds[n] - e[n]) > Dp))) return Object.freeze(a);
		}
		throw Error("Не удалось найти различимую геометрию углового скейлинга текста");
	}
	_measureBounds({ scale: e }) {
		return this._measureCanonicalState({ scale: e }).bounds;
	}
	_measureCanonicalState({ scale: e }) {
		Bl({
			textbox: this.textbox,
			canvasManager: this.canvasManager,
			base: this.base,
			widthScale: e,
			heightScale: e,
			placement: this.placement,
			anchorPlacement: Op({
				gesture: this.gesture,
				transform: this.transform
			}),
			shouldScaleFontSize: !0,
			shouldScalePadding: !0,
			shouldScaleRadii: !0,
			shouldRoundDimensions: !1
		});
		let t = z({ object: this.textbox });
		if (!t) throw Error("Не удалось измерить геометрию текста после скейлинга");
		return Object.freeze({
			canonicalState: Cd({ textbox: this.textbox }),
			bounds: t
		});
	}
	dispose() {
		this.measurements.clear(), this.textbox.dispose();
	}
}, Ap = 8, jp = 1e-7;
function Mp({ constraints: e, measurement: t, plan: n }) {
	let { bounds: r } = t.projection, i = (e) => e ? Math.abs(r[e.candidate.edge] - e.expectedPosition) <= n.verificationEpsilon : !0;
	return Object.freeze({
		x: i(e.x),
		y: i(e.y)
	});
}
function Np({ constraints: e, measurement: t, plan: n }) {
	let r = Mp({
		constraints: e,
		measurement: t,
		plan: n
	});
	return r.x && r.y;
}
function Pp({ constraints: e, measurement: t, plan: n }) {
	let [r] = qd({
		projection: Wd({
			bounds: t.projection.bounds,
			input: t.projection.projection
		}),
		rawValues: [t.scale],
		constraints: e,
		epsilon: n.verificationEpsilon
	})?.values ?? [];
	return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function Fp({ measuredScales: e, scale: t }) {
	return e.every((e) => Math.abs(e - t) > jp);
}
function Ip({ constraints: e, initialScale: t, measurer: n, plan: r, preferredScale: i }) {
	let a = lf({ constraints: e });
	if (a.length === 0) return null;
	let o = [];
	if (typeof i == "number" && Number.isFinite(i)) {
		let t = n.measure({ scale: i });
		if (o.push(t.scale), Np({
			constraints: e,
			measurement: t,
			plan: r
		})) return t;
	}
	let s = t;
	for (let t = 0; t < Ap; t += 1) {
		let t = n.measure({ scale: s });
		if (o.push(t.scale), Np({
			constraints: e,
			measurement: t,
			plan: r
		})) return t;
		let i = Pp({
			constraints: a,
			measurement: t,
			plan: r
		});
		if (i === null || !Fp({
			measuredScales: o,
			scale: i
		})) return null;
		s = i;
	}
	return null;
}
function Lp({ measurer: e, plan: t, preferredScale: n }) {
	let [r] = t.effectiveValues;
	return Number.isFinite(r) ? Ip({
		constraints: t.refinementCandidates,
		initialScale: r,
		measurer: e,
		plan: t,
		preferredScale: n
	}) : null;
}
function Rp({ plan: e }) {
	let t = [], n = /* @__PURE__ */ new Set(), r = (e, r) => {
		n.has(e) || !r[e] || (t.push(Object.freeze({
			x: e === "x" ? r.x : null,
			y: e === "y" ? r.y : null
		})), n.add(e));
	}, i = ["x", "y"];
	i.sort((t, n) => {
		let r = e.constraints[t]?.transition === "held", i = e.constraints[n]?.transition === "held";
		return Number(i) - Number(r);
	});
	for (let t of i) r(t, e.constraints);
	for (let t of i) r(t, e.refinementCandidates);
	return Object.freeze(t);
}
function zp({ measurement: e, plan: t }) {
	let { refinementCandidates: n } = t, r = Mp({
		constraints: n,
		measurement: e,
		plan: t
	});
	return Object.freeze({
		x: r.x ? n.x : null,
		y: r.y ? n.y : null
	});
}
function Bp({ measurer: e, plan: t, pointerMeasurement: n, preferredScale: r }) {
	let [i] = t.effectiveValues;
	if (typeof i != "number" || !Number.isFinite(i)) throw Error("План углового скейлинга текста должен содержать конечный множитель");
	if (typeof r == "number" && Number.isFinite(r)) {
		let n = e.measure({ scale: r }), i = zp({
			measurement: n,
			plan: t
		});
		if (i.x || i.y) return Object.freeze({
			constraints: i,
			measurement: n
		});
	}
	{
		let n = e.measure({ scale: i }), r = zp({
			measurement: n,
			plan: t
		});
		if (r.x || r.y) return Object.freeze({
			constraints: r,
			measurement: n
		});
	}
	let a = zp({
		measurement: n,
		plan: t
	});
	if (a.x || a.y) return Object.freeze({
		constraints: a,
		measurement: n
	});
	for (let n of Rp({ plan: t })) {
		let r = Ip({
			constraints: n,
			initialScale: i,
			measurer: e,
			plan: t
		});
		if (r) return Object.freeze({
			constraints: n,
			measurement: r
		});
	}
	return Object.freeze({
		constraints: a,
		measurement: n
	});
}
//#endregion
//#region src/editor/text-manager/scaling/text-corner-scale-interaction-controller.ts
var Vp = 1e-9, Hp = Object.freeze(b.createTextboxDefaultControls());
function Up({ transform: e }) {
	return e.action === "scale" && (e.corner === "tl" || e.corner === "tr" || e.corner === "bl" || e.corner === "br");
}
function Wp({ target: e, transform: t }) {
	let n = e.controls[t.corner], r = Hp[t.corner];
	return !n || !r || ![
		n.actionHandler === r.actionHandler,
		n.getActionHandler === r.getActionHandler,
		n.positionHandler === r.positionHandler,
		n.getTransformAnchorPoint === r.getTransformAnchorPoint,
		n.transformAnchorPoint === r.transformAnchorPoint
	].every(Boolean) ? !1 : [
		[n.x, r.x],
		[n.y, r.y],
		[n.offsetX, r.offsetX],
		[n.offsetY, r.offsetY]
	].every(([e, t]) => Number.isFinite(e) && Number.isFinite(t) && Math.abs(e - t) <= Vp);
}
function Gp(e) {
	if (!(e instanceof _d) || e.group || e.shapeNodeType === "text" || e.path || e.isEditing || e.flipX || e.flipY || e.locked || e.lockScalingX || e.lockScalingY) return !1;
	let t = e.scaleX ?? 1, n = e.scaleY ?? 1, r = e.skewX ?? 0, i = e.skewY ?? 0, a = e.strokeWidth ?? 0;
	return Number.isFinite(t) && Number.isFinite(n) && Number.isFinite(a) && Math.abs(t - 1) <= Vp && Math.abs(n - 1) <= Vp && Math.abs(r) <= Vp && Math.abs(i) <= Vp && Math.abs(a) <= Vp;
}
function Kp({ event: e }) {
	let { transform: t } = e;
	return !t || !Up({ transform: t }) || !Gp(t.target) || !Wp({
		target: t.target,
		transform: t
	}) || e.target && e.target !== t.target ? null : Object.freeze({
		target: t.target,
		transform: t
	});
}
function qp({ target: e, transform: t }) {
	return Object.freeze({
		angle: e.angle ?? 0,
		controlKey: t.corner,
		flipX: !!e.flipX,
		flipY: !!e.flipY,
		lockScalingFlip: !!e.lockScalingFlip,
		originX: t.originX,
		originY: t.originY,
		skewX: e.skewX ?? 0,
		skewY: e.skewY ?? 0
	});
}
function Jp({ event: e }) {
	return Object.freeze({
		ctrlKey: "ctrlKey" in e && e.ctrlKey === !0,
		shiftKey: "shiftKey" in e && e.shiftKey === !0
	});
}
function Yp({ session: e }) {
	let { protectedState: t, target: n, transform: r } = e;
	return r.target === n && r.corner === t.controlKey && r.originX === t.originX && r.originY === t.originY && Math.abs((n.angle ?? 0) - t.angle) <= Vp && Math.abs((n.skewX ?? 0) - t.skewX) <= Vp && Math.abs((n.skewY ?? 0) - t.skewY) <= Vp && !!n.flipX === t.flipX && !!n.flipY === t.flipY;
}
function Xp({ bounds: e, constraint: t, epsilon: n }) {
	return t ? Math.abs(e[t.candidate.edge] - t.expectedPosition) <= n : !0;
}
var Zp = class {
	constructor({ editor: e, scalingController: t }) {
		this.session = null, this.editor = e, this.scalingController = t;
	}
	beginGesture(e) {
		this.finishGesture();
		let t = Kp({ event: e }), n = e.scenePoint ?? e.pointer;
		if (!t || !n) return !1;
		t.target.setCoords();
		let r = bp({
			textbox: t.target,
			transform: t.transform,
			pointerStart: n
		});
		if (!r || !this.scalingController.beginStandaloneCornerScale(t)) return !1;
		try {
			this.session = this._createSession({
				gesture: r,
				resolved: t
			}), t.target.lockScalingFlip = !0;
		} catch (e) {
			throw this.scalingController.clearStandaloneCornerScale({ target: t.target }), e;
		}
		return !0;
	}
	handleObjectScaling(e) {
		return this._handleScale({
			event: e,
			pointSource: "object-scaling"
		});
	}
	handleCanvasMouseMove(e) {
		return this._handleScale({
			event: e,
			pointSource: "mouse-move"
		});
	}
	finishGesture({ continueWithExistingScaling: e = !1 } = {}) {
		let { session: t } = this;
		if (!t) return !1;
		t.target.lockScalingFlip = t.protectedState.lockScalingFlip;
		let n = t.runtime.finishSession();
		return t.measurer.dispose(), this.session = null, e ? this.scalingController.prepareStandaloneCornerScaleForLegacyCommit({ target: t.target }) : this.scalingController.clearStandaloneCornerScale({ target: t.target }), n.didCleanup && this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] }), !0;
	}
	finishGestureForTarget({ target: e }) {
		return !this.session || this.session.target !== e ? !1 : this.finishGesture();
	}
	interruptGesture({ event: e } = {}) {
		if (!this.session) return !1;
		try {
			this.editor.canvas.endCurrentTransform(e);
		} finally {
			this.finishGesture();
		}
		return !0;
	}
	_createSession({ gesture: e, resolved: t }) {
		let n = this.editor.snappingManager.captureScaleSnapEnvironment({
			activeObject: t.target,
			targetEdges: e.movingEdges
		}), r = gf({
			bounds: e.baselineBounds,
			fixedAnchor: e.fixedAnchor,
			projectionModes: [e.projectionMode],
			candidates: n.candidates,
			zoom: n.zoom
		}), i = new sp();
		return i.startSession({ baseline: r }), Object.freeze({
			gesture: e,
			measurer: new kp({
				canvasManager: this.editor.canvasManager,
				gesture: e,
				target: t.target,
				transform: t.transform
			}),
			protectedState: qp(t),
			runtime: i,
			state: { lastAppliedScale: null },
			target: t.target,
			transform: t.transform
		});
	}
	_handleScale({ event: e, pointSource: t }) {
		let { session: n } = this;
		if (!n) return !1;
		let r = e.e;
		if (!r) return this._continueWithExistingScaling();
		if (n.runtime.getDuplicateStep({ marker: r })) return !0;
		if (!this._belongsToCurrentGesture({
			event: e,
			session: n
		}) || !Yp({ session: n })) return this._continueWithExistingScaling();
		let i = t === "object-scaling" ? e.pointer : e.scenePoint;
		if (!i) return this._continueWithExistingScaling();
		let a = xp({
			gesture: n.gesture,
			pointer: i
		});
		return a === null ? this._continueWithExistingScaling() : this._applyScale({
			pointerEvent: r,
			scale: a,
			session: n
		});
	}
	_belongsToCurrentGesture({ event: e, session: t }) {
		return !(e.transform && e.transform !== t.transform || e.target && e.target !== t.target);
	}
	_applyScale({ pointerEvent: e, scale: t, session: n }) {
		try {
			let r = n.measurer.measure({ scale: t }), i = n.runtime.resolveScalePlan({
				marker: e,
				intent: Object.freeze({
					projectionMode: gp,
					values: Object.freeze([r.scale]),
					modifiers: Jp({ event: e })
				}),
				stepProjection: r.projection
			});
			if (i.kind === "duplicate") return !0;
			let a = this._resolveScaleStep({
				plan: i.plan,
				pointerMeasurement: r,
				session: n,
				token: i.token
			});
			this.editor.snappingManager.markScaleStepHandled({ marker: e });
			let o = this._applyAndVerifyScale({
				resolved: a,
				session: n,
				token: i.token
			});
			return this.editor.snappingManager.publishVerifiedScaleGuides({ guides: o }), !0;
		} catch (e) {
			throw this.finishGesture(), e;
		}
	}
	_resolveScaleStep({ plan: e, pointerMeasurement: t, session: n, token: r }) {
		if (!e.refinementCandidates.x && !e.refinementCandidates.y) return Object.freeze({
			measurement: t,
			plan: e
		});
		let i = this._resolvePreferredHeldScale({
			plan: e,
			session: n
		}), a = Lp({
			measurer: n.measurer,
			plan: e,
			preferredScale: i
		}), o = a ? Object.freeze({
			constraints: e.refinementCandidates,
			measurement: a
		}) : Bp({
			measurer: n.measurer,
			plan: e,
			pointerMeasurement: t,
			preferredScale: i
		}), s = n.runtime.refineScalePlan({
			token: r,
			refinement: Object.freeze({
				constraints: o.constraints,
				effectiveValues: Object.freeze([o.measurement.scale]),
				stepProjection: o.measurement.projection
			})
		});
		return Object.freeze({
			measurement: o.measurement,
			plan: s
		});
	}
	_resolvePreferredHeldScale({ plan: e, session: t }) {
		return e.constraints.x?.transition === "held" || e.constraints.y?.transition === "held" ? t.state.lastAppliedScale ?? void 0 : void 0;
	}
	_applyAndVerifyScale({ resolved: e, session: t, token: n }) {
		let r = this.scalingController.applyStandaloneCornerScale({
			fixedAnchor: t.gesture.fixedAnchor,
			scale: e.measurement.scale,
			target: t.target,
			transform: t.transform
		}), i = this._readFinalGeometry({
			matchesExpectedState: Td({
				actual: r.canonicalState,
				expected: e.measurement.canonicalState
			}),
			plan: e.plan,
			scale: r.scale,
			session: t
		}), a = t.runtime.verifyScalePlan({
			token: n,
			finalGeometry: i
		});
		return t.state.lastAppliedScale = r.scale, a.guides;
	}
	_readFinalGeometry({ matchesExpectedState: e, plan: t, scale: n, session: r }) {
		let i = z({ object: r.target });
		if (!i) throw Error("Текст должен иметь точные границы после скейлинга");
		let a = r.target.getPointByOrigin(r.transform.originX, r.transform.originY);
		return Object.freeze({
			bounds: i,
			fixedAnchor: Object.freeze({
				x: a.x,
				y: a.y
			}),
			measuredValues: Object.freeze([n]),
			domainVerdict: Object.freeze({
				x: Xp({
					bounds: i,
					constraint: t.constraints.x,
					epsilon: t.verificationEpsilon
				}) ? "satisfied" : "blocked",
				y: Xp({
					bounds: i,
					constraint: t.constraints.y,
					epsilon: t.verificationEpsilon
				}) ? "satisfied" : "blocked",
				protectedState: Yp({ session: r }) && e ? "preserved" : "changed"
			})
		});
	}
	_continueWithExistingScaling() {
		return this.finishGesture({ continueWithExistingScaling: !0 }), !1;
	}
}, Qp = 1e-9, $p = "text-width";
function em(e) {
	return e === "center" || e === .5;
}
function tm({ origin: e, expected: t }) {
	return e === t ? !0 : t === "left" ? e === 0 : e === 1;
}
function nm(e) {
	return e.action === "resizing" && (e.corner === "ml" || e.corner === "mr");
}
function rm({ textbox: e }) {
	return !!e.flipX || !!e.flipY || !!e.path || Math.abs(e.skewX ?? 0) > Qp || Math.abs(e.skewY ?? 0) > Qp;
}
function im({ textbox: e, controlKey: t, centered: n }) {
	let [r, i] = e.calcTransformMatrix(), a = n || t === "mr" ? 1 : -1, o = r * a, s = i * a;
	return !Number.isFinite(o) || !Number.isFinite(s) || Math.hypot(o, s) <= Qp ? null : Object.freeze({
		x: o,
		y: s
	});
}
function am({ axis: e, coefficient: t }) {
	let n = Math.abs(t) / 2;
	if (n <= Qp) return Object.freeze([]);
	let r = e === "x" ? ["left", "right"] : ["top", "bottom"];
	return Object.freeze([Object.freeze({
		edge: r[0],
		coefficients: Object.freeze([-n])
	}), Object.freeze({
		edge: r[1],
		coefficients: Object.freeze([n])
	})]);
}
function om({ axis: e, coefficient: t }) {
	if (Math.abs(t) <= Qp) return null;
	let n;
	return n = e === "x" ? t > 0 ? "right" : "left" : t > 0 ? "bottom" : "top", Object.freeze({
		edge: n,
		coefficients: Object.freeze([t])
	});
}
function sm({ centered: e, widthVector: t }) {
	return Object.freeze(e ? [...am({
		axis: "x",
		coefficient: t.x
	}), ...am({
		axis: "y",
		coefficient: t.y
	})] : [om({
		axis: "x",
		coefficient: t.x
	}), om({
		axis: "y",
		coefficient: t.y
	})].filter((e) => e !== null));
}
function cm({ baselineWidth: e, centered: t, widthVector: n }) {
	let r = sm({
		centered: t,
		widthVector: n
	}), i = Math.hypot(n.x, n.y) * (t ? .5 : 1);
	return Object.freeze([Object.freeze({
		id: $p,
		projection: Object.freeze({
			variables: Object.freeze(["text-width"]),
			baselineValues: Object.freeze([e]),
			variableSceneWeights: Object.freeze([i]),
			edges: Object.freeze(r)
		})
	})]);
}
function lm({ textbox: e, transform: t }) {
	if (!nm(t) || t.target !== e || e.group || rm({ textbox: e })) return null;
	let n = t.corner === "mr" ? "left" : "right", r = em(t.originX);
	if (!r && !tm({
		origin: t.originX,
		expected: n
	}) || !em(t.originY)) return null;
	let i = e.width;
	if (!Number.isFinite(i) || i <= 0) return null;
	let a = z({ object: e }), o = im({
		textbox: e,
		controlKey: t.corner,
		centered: r
	});
	if (!a || !o) return null;
	let s = e.getPointByOrigin(t.originX, t.originY);
	if (!Number.isFinite(s.x) || !Number.isFinite(s.y)) return null;
	let c = cm({
		baselineWidth: i,
		centered: r,
		widthVector: o
	}), l = c[0].projection.edges.map(({ edge: e }) => e);
	return Object.freeze({
		anchorOriginX: t.originX,
		anchorOriginY: t.originY,
		baselineBounds: a,
		baselineWidth: i,
		controlKey: t.corner,
		fixedAnchor: Object.freeze({
			x: s.x,
			y: s.y
		}),
		movingEdges: Object.freeze(l),
		projectionModes: c
	});
}
function um({ textbox: e, gesture: t }) {
	let n = z({ object: e }), { width: r } = e, { projectionModes: i } = t, [a] = i;
	return !n || !a || !Number.isFinite(r) || r <= 0 ? null : Object.freeze({
		bounds: Object.freeze({ ...n }),
		projection: Object.freeze({
			...a.projection,
			baselineValues: Object.freeze([r])
		})
	});
}
//#endregion
//#region src/editor/text-manager/scaling/text-width-resize-measurer.ts
var dm = class {
	constructor({ target: e, gesture: t }) {
		this.gesture = t, this.textbox = hp({
			target: e,
			options: { autoExpand: !1 }
		});
	}
	measure({ width: e }) {
		let t = hd({
			textbox: this.textbox,
			width: e
		}), { anchorOriginX: n, anchorOriginY: r, fixedAnchor: i } = this.gesture;
		this.textbox.setPositionByOrigin(new p(i.x, i.y), n, r), this.textbox.setCoords();
		let a = um({
			textbox: this.textbox,
			gesture: this.gesture
		});
		if (!a) throw Error("Не удалось измерить геометрию Textbox после переноса строк");
		return Object.freeze({
			projection: a,
			width: t
		});
	}
	dispose() {
		this.textbox.dispose();
	}
}, fm = 8, pm = 1e-7;
function mm({ measurement: e, plan: t }) {
	let { bounds: n } = e.projection;
	return [t.constraints.x, t.constraints.y].every((e) => {
		if (!e) return !0;
		let r = n[e.candidate.edge];
		return Math.abs(r - e.expectedPosition) <= t.verificationEpsilon;
	});
}
function hm({ measurement: e, plan: t, constraints: n }) {
	let [r] = qd({
		projection: Wd({
			bounds: e.projection.bounds,
			input: e.projection.projection
		}),
		rawValues: [e.width],
		constraints: n,
		epsilon: t.verificationEpsilon
	})?.values ?? [];
	return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function gm({ width: e, measuredWidths: t }) {
	return t.every((t) => Math.abs(t - e) > pm);
}
function _m({ plan: e, measurer: t }) {
	let [n] = e.effectiveValues;
	if (!Number.isFinite(n)) return null;
	let r = lf({ constraints: e.constraints });
	if (r.length === 0) return null;
	let i = [], a = n;
	for (let n = 0; n < fm; n += 1) {
		let n = t.measure({ width: a });
		if (i.push(n.width), mm({
			measurement: n,
			plan: e
		})) return n;
		let o = hm({
			measurement: n,
			plan: e,
			constraints: r
		});
		if (o === null || !gm({
			width: o,
			measuredWidths: i
		})) return null;
		a = o;
	}
	return null;
}
//#endregion
//#region src/editor/text-manager/scaling/text-width-resize-interaction-controller.ts
var vm = 1e-9;
function ym({ event: e }) {
	let { target: t } = e;
	return !(t instanceof _d) || t.group || t.shapeNodeType === "text" ? null : t;
}
function bm({ target: e, transform: t }) {
	return Object.freeze({
		angle: e.angle ?? 0,
		controlKey: t.corner,
		flipX: !!e.flipX,
		flipY: !!e.flipY,
		fontSize: e.fontSize ?? 16,
		originX: t.originX,
		originY: t.originY,
		paddingBottom: e.paddingBottom ?? 0,
		paddingLeft: e.paddingLeft ?? 0,
		paddingRight: e.paddingRight ?? 0,
		paddingTop: e.paddingTop ?? 0,
		radiusBottomLeft: e.radiusBottomLeft ?? 0,
		radiusBottomRight: e.radiusBottomRight ?? 0,
		radiusTopLeft: e.radiusTopLeft ?? 0,
		radiusTopRight: e.radiusTopRight ?? 0,
		scaleX: e.scaleX ?? 1,
		scaleY: e.scaleY ?? 1,
		skewX: e.skewX ?? 0,
		skewY: e.skewY ?? 0
	});
}
function xm({ transform: e }) {
	let t = (e) => e === "center" || e === .5;
	return t(e.originX) && t(e.originY);
}
function Sm({ session: e, scenePoint: t }) {
	let { target: n, transform: r } = e, { width: i, scaleX: a = 1 } = n;
	if (!Number.isFinite(i) || !Number.isFinite(a) || a <= 0) return null;
	let o = (n.paddingLeft ?? 0) + (n.paddingRight ?? 0);
	if (!t) {
		let e = i - o;
		return Number.isFinite(e) ? Math.max(1, e) : null;
	}
	let s = b.getLocalPoint(r, r.originX, r.originY, t.x, t.y), c = r.corner === "mr" ? 1 : -1;
	if (s.x * c <= 0) return null;
	let l = xm({ transform: r }) ? 2 : 1, u = (n.strokeWidth ?? 0) / (n.strokeUniform ? a : 1), d = Math.abs(s.x * l / a) - u - o;
	return Number.isFinite(d) ? Math.max(1, d) : null;
}
function Cm({ event: e }) {
	return !!(e && "ctrlKey" in e && e.ctrlKey === !0);
}
function wm({ session: e }) {
	let { protectedState: t, target: n, transform: r } = e;
	return r.target === n && r.corner === t.controlKey && r.originX === t.originX && r.originY === t.originY && Math.abs((n.angle ?? 0) - t.angle) <= vm && Math.abs((n.scaleX ?? 1) - t.scaleX) <= vm && Math.abs((n.scaleY ?? 1) - t.scaleY) <= vm;
}
function Tm({ session: e, width: t }) {
	let { fixedAnchor: n } = e.projection, { target: r, transform: i } = e;
	hd({
		textbox: r,
		width: t
	}), r.setPositionByOrigin(new p(n.x, n.y), i.originX, i.originY), r.setCoords(), r.dirty = !0, r.preserveExactTextGeometry = !1;
}
function Em({ constraint: e, bounds: t, epsilon: n }) {
	return e ? Math.abs(t[e.candidate.edge] - e.expectedPosition) <= n : !0;
}
function Dm({ session: e }) {
	let { protectedState: t, target: n } = e, r = [
		n.angle ?? 0,
		n.fontSize ?? 16,
		n.paddingBottom ?? 0,
		n.paddingLeft ?? 0,
		n.paddingRight ?? 0,
		n.paddingTop ?? 0,
		n.radiusBottomLeft ?? 0,
		n.radiusBottomRight ?? 0,
		n.radiusTopLeft ?? 0,
		n.radiusTopRight ?? 0,
		n.scaleX ?? 1,
		n.scaleY ?? 1,
		n.skewX ?? 0,
		n.skewY ?? 0
	], i = [
		t.angle,
		t.fontSize,
		t.paddingBottom,
		t.paddingLeft,
		t.paddingRight,
		t.paddingTop,
		t.radiusBottomLeft,
		t.radiusBottomRight,
		t.radiusTopLeft,
		t.radiusTopRight,
		t.scaleX,
		t.scaleY,
		t.skewX,
		t.skewY
	];
	return r.every((e, t) => Math.abs(e - i[t]) <= vm) && !!n.flipX === t.flipX && !!n.flipY === t.flipY;
}
function Om({ plan: e, session: t }) {
	let { target: n, transform: r } = t, i = z({ object: n }), { width: a } = n;
	if (!i || !Number.isFinite(a)) return null;
	let o = n.getPointByOrigin(r.originX, r.originY), s = Dm({ session: t }) ? "preserved" : "changed";
	return Object.freeze({
		bounds: i,
		fixedAnchor: Object.freeze({
			x: o.x,
			y: o.y
		}),
		measuredValues: Object.freeze([a]),
		domainVerdict: Object.freeze({
			x: Em({
				constraint: e.constraints.x,
				bounds: i,
				epsilon: e.verificationEpsilon
			}) ? "satisfied" : "blocked",
			y: Em({
				constraint: e.constraints.y,
				bounds: i,
				epsilon: e.verificationEpsilon
			}) ? "satisfied" : "blocked",
			protectedState: s
		})
	});
}
var km = class {
	constructor({ editor: e }) {
		this.session = null, this.editor = e;
	}
	beginGesture(e) {
		this.finishGesture();
		let t = ym({ event: e }), { transform: n } = e;
		if (!t || !n) return !1;
		t.setCoords();
		let r = lm({
			textbox: t,
			transform: n
		});
		if (!r) return !1;
		let i = this.editor.snappingManager.captureScaleSnapEnvironment({
			activeObject: t,
			targetEdges: r.movingEdges
		}), a = gf({
			bounds: r.baselineBounds,
			fixedAnchor: r.fixedAnchor,
			projectionModes: r.projectionModes,
			candidates: i.candidates,
			zoom: i.zoom
		}), o = new sp();
		return o.startSession({ baseline: a }), this.session = Object.freeze({
			measurer: new dm({
				target: t,
				gesture: r
			}),
			projection: r,
			protectedState: bm({
				target: t,
				transform: n
			}),
			runtime: o,
			target: t,
			transform: n
		}), !0;
	}
	handleObjectResizing(e) {
		try {
			return this._handleObjectResizing(e);
		} catch (e) {
			throw this.finishGesture(), e;
		}
	}
	_handleObjectResizing(e) {
		let { session: t } = this;
		if (!t) return !1;
		if (e.target !== t.target || e.transform !== t.transform || !wm({ session: t }) || !Dm({ session: t })) return this._finishUnsupportedResizeSession();
		let n = e.e ?? e, r = t.runtime.getDuplicateStep({ marker: n });
		if (r) {
			let e = r.verification?.guides ?? [];
			return r.verification && this.editor.snappingManager.publishVerifiedScaleGuides({ guides: e }), !0;
		}
		let i = this._measurePointerStep({
			event: e,
			session: t
		});
		return i ? (this._applyPointerStep({
			event: e,
			marker: n,
			measurement: i,
			session: t
		}), !0) : this._finishUnsupportedResizeSession();
	}
	_measurePointerStep({ event: e, session: t }) {
		let n = Sm({
			session: t,
			scenePoint: e.e ? this.editor.canvas.getScenePoint(e.e) : null
		});
		return n === null ? null : t.measurer.measure({ width: n });
	}
	_applyPointerStep({ event: e, marker: t, measurement: n, session: r }) {
		let i = r.runtime.resolveScalePlan({
			marker: t,
			stepProjection: n.projection,
			intent: Object.freeze({
				projectionMode: $p,
				values: Object.freeze([n.width]),
				modifiers: Object.freeze({
					ctrlKey: Cm({ event: e.e }),
					shiftKey: !1
				})
			})
		});
		if (i.kind === "duplicate") throw Error("Шаг изменения ширины не должен повторно становиться дубликатом после первой проверки");
		let a = this._resolveTextWidthStep({
			plan: i.plan,
			session: r,
			token: i.token,
			pointerWidth: n.width
		}), o = this._applyAndVerifyStep({
			plan: a.plan,
			session: r,
			token: i.token,
			width: a.width
		});
		if (!o) throw Error("Не удалось применить и проверить план изменения ширины текста");
		this.editor.snappingManager.publishVerifiedScaleGuides({ guides: o }), this.editor.canvas.requestRenderAll();
	}
	finishGesture() {
		let { session: e } = this, t = e?.runtime.finishSession().didCleanup ?? !1;
		return e?.measurer.dispose(), this.session = null, t && this.editor.snappingManager.publishVerifiedScaleGuides({ guides: [] }), t;
	}
	finishGestureForTarget({ target: e }) {
		return !this.session || this.session.target !== e ? !1 : (this.finishGesture(), !0);
	}
	interruptGesture({ event: e } = {}) {
		if (!this.session) return !1;
		try {
			this.editor.canvas.endCurrentTransform(e);
		} finally {
			this.finishGesture();
		}
		return !0;
	}
	_applyAndVerifyStep({ plan: e, session: t, token: n, width: r }) {
		Tm({
			session: t,
			width: r
		});
		let i = Om({
			plan: e,
			session: t
		});
		return i ? t.runtime.verifyScalePlan({
			token: n,
			finalGeometry: i
		}).guides : null;
	}
	_resolveTextWidthStep({ plan: e, session: t, token: n, pointerWidth: r }) {
		if (!e.constraints.x && !e.constraints.y) return Object.freeze({
			plan: e,
			width: r
		});
		let i = _m({
			plan: e,
			measurer: t.measurer
		});
		if (!i) return Object.freeze({
			plan: e,
			width: r
		});
		let a = t.runtime.refineScalePlan({
			token: n,
			refinement: Object.freeze({
				constraints: e.constraints,
				effectiveValues: Object.freeze([i.width]),
				stepProjection: i.projection
			})
		});
		return Object.freeze({
			plan: a,
			width: i.width
		});
	}
	_finishUnsupportedResizeSession() {
		return this.finishGesture(), !1;
	}
}, Am = 1e-9;
function jm({ value: e }) {
	return Number.isFinite(e) && Math.abs(e) <= Am;
}
function Mm({ selection: e, textbox: t }) {
	return [
		t.parent,
		t.path,
		t.isEditing,
		t.locked,
		t.lockScalingX,
		t.lockScalingY,
		t.flipX,
		t.flipY
	].some(Boolean) || t.group !== e || t.shapeNodeType === "text" ? !1 : [
		(t.scaleX ?? 1) - 1,
		(t.scaleY ?? 1) - 1,
		t.angle ?? 0,
		t.skewX ?? 0,
		t.skewY ?? 0,
		t.strokeWidth ?? 0
	].every((e) => jm({ value: e }));
}
function Nm({ selection: e }) {
	let t = [];
	for (let n of e.getObjects()) {
		if (n instanceof _ && !(n instanceof _d)) return null;
		if (n instanceof _d) {
			if (!Mm({
				selection: e,
				textbox: n
			})) return null;
			t.push(n);
		}
	}
	return t.length > 0 ? Object.freeze(t) : null;
}
//#endregion
//#region src/editor/text-manager/scaling/active-selection-scale-projection.ts
var Pm = 1e-9;
function Fm({ bounds: e, edge: t, sample: n, value: r, variableIndex: i }) {
	let a = n.values[i] - r;
	if (Math.abs(a) <= Pm) throw Error("Соседнее измерение текста должно менять выбранный множитель");
	return (n.bounds[t] - e[t]) / a;
}
function Im({ projectionMode: e, samples: t, values: n }) {
	let r = e.projection.variables.length;
	if (r < 1 || r > 2) throw Error("Скейлинг выделения с текстами должен иметь одну или две степени свободы");
	if (n.length !== r || t.length !== r) throw Error("Каждой переменной скейлинга текста должно соответствовать соседнее измерение");
	if (t.some((e) => e.values.length !== r)) throw Error("Соседние измерения текста должны использовать одинаковый набор множителей");
}
function Lm({ bounds: e, projectionMode: t, samples: n, values: r }) {
	Im({
		projectionMode: t,
		samples: n,
		values: r
	});
	let i = t.projection.edges.map(({ edge: t }) => {
		let i = n.map((n, i) => Fm({
			bounds: e,
			edge: t,
			sample: n,
			value: r[i],
			variableIndex: i
		}));
		return Object.freeze({
			edge: t,
			coefficients: Object.freeze(i)
		});
	});
	return Object.freeze({
		bounds: Object.freeze({ ...e }),
		projection: Object.freeze({
			variables: t.projection.variables,
			baselineValues: Object.freeze([...r]),
			variableSceneWeights: t.projection.variableSceneWeights,
			edges: Object.freeze(i)
		})
	});
}
//#endregion
//#region src/editor/text-manager/scaling/active-selection-scale-live-state.ts
function Rm({ styles: e }) {
	return JSON.parse(JSON.stringify(e));
}
function zm({ target: e }) {
	return Object.freeze({
		height: e.height,
		originX: e.originX,
		originY: e.originY,
		target: e,
		transform: Object.freeze({ ...C.saveObjectTransform(e) }),
		width: e.width
	});
}
function Bm({ state: e }) {
	let { target: t } = e;
	t.set({
		...e.transform,
		originX: e.originX,
		originY: e.originY
	}), t.width = e.width, t.height = e.height, t.dirty = !0, t.setCoords();
}
function Vm({ target: e }) {
	return Object.freeze({
		autoExpand: e.autoExpand,
		base: Nl({ textbox: e }),
		geometry: zm({ target: e }),
		preserveExactTextGeometry: e.preserveExactTextGeometry === !0,
		splitByGrapheme: e.splitByGrapheme,
		target: e
	});
}
function Hm({ state: e }) {
	let { base: t, target: n } = e;
	n.set({
		autoExpand: e.autoExpand,
		fontSize: t.fontSize,
		lineFontDefaults: vl({ lineFontDefaults: t.lineFontDefaults }),
		paddingBottom: t.padding.bottom,
		paddingLeft: t.padding.left,
		paddingRight: t.padding.right,
		paddingTop: t.padding.top,
		preserveExactTextGeometry: e.preserveExactTextGeometry,
		radiusBottomLeft: t.radii.bottomLeft,
		radiusBottomRight: t.radii.bottomRight,
		radiusTopLeft: t.radii.topLeft,
		radiusTopRight: t.radii.topRight,
		splitByGrapheme: e.splitByGrapheme,
		styles: Rm({ styles: t.styles }),
		width: t.width
	}), n.initDimensions(), Bm({ state: e.geometry });
}
function Um({ affineChildren: e, selection: t, texts: n, transform: r }) {
	return Object.freeze({
		affineChildren: Object.freeze(e.map((e) => zm({ target: e }))),
		selection: zm({ target: t }),
		texts: Object.freeze(n.map((e) => Vm({ target: e }))),
		transform: r,
		transformScaleX: r.scaleX,
		transformScaleY: r.scaleY
	});
}
function Wm({ state: e }) {
	let t = [];
	for (let n of e.texts) try {
		Hm({ state: n });
	} catch (e) {
		t.push(e);
	}
	for (let n of e.affineChildren) try {
		Bm({ state: n });
	} catch (e) {
		t.push(e);
	}
	try {
		Bm({ state: e.selection });
	} catch (e) {
		t.push(e);
	}
	e.transform.scaleX = e.transformScaleX, e.transform.scaleY = e.transformScaleY;
	let [n] = t;
	if (t.length > 0) throw n;
}
//#endregion
//#region src/editor/text-manager/scaling/active-selection-scale-measurer.ts
var Gm = .01, Km = 8, qm = 8, Jm = 16, Ym = 48, Xm = 1e-6;
function Zm({ bottom: e, left: t, right: n, top: r }) {
	if (![
		e,
		t,
		n,
		r
	].every(Number.isFinite) || n <= t || e <= r) throw Error("Измеренные границы выделения с текстами должны иметь конечный положительный размер");
	return Object.freeze({
		bottom: e,
		left: t,
		right: n,
		top: r,
		centerX: (t + n) / 2,
		centerY: (r + e) / 2
	});
}
function Qm({ baseline: e, bounds: t }) {
	let n = t.right - t.left, r = t.bottom - t.top;
	return Object.freeze({
		center: Object.freeze({
			x: t.centerX,
			y: t.centerY
		}),
		height: r,
		scaleX: n / e.width,
		scaleY: r / e.height,
		width: n
	});
}
function $m({ bounds: e }) {
	if (e.length < 2) throw Error("Измерение общего выделения требует минимум два объекта");
	return Zm({
		bottom: Math.max(...e.map(({ bottom: e }) => e)),
		left: Math.min(...e.map(({ left: e }) => e)),
		right: Math.max(...e.map(({ right: e }) => e)),
		top: Math.min(...e.map(({ top: e }) => e))
	});
}
function eh({ origin: e }) {
	if (e === "left" || e === "top") return -.5;
	if (e === "right" || e === "bottom") return .5;
	if (e === "center") return 0;
	if (typeof e == "number" && Number.isFinite(e)) return e - .5;
	throw Error("Скейлинг выделения с текстами требует поддерживаемую неподвижную точку");
}
function th({ bounds: e, fixedAnchor: t, transform: n }) {
	let r = e.right - e.left, i = e.bottom - e.top, a = e.centerX + eh({ origin: n.originX }) * r, o = e.centerY + eh({ origin: n.originY }) * i;
	return Object.freeze({
		x: t.x - a,
		y: t.y - o
	});
}
function nh({ fixedAnchor: e, multipliers: t, startCenter: n }) {
	return Object.freeze({
		x: e.x + (n.x - e.x) * t.x,
		y: e.y + (n.y - e.y) * t.y
	});
}
function rh({ children: e, translation: t }) {
	return Object.freeze(e.map(({ bounds: e, center: n, target: r }) => Object.freeze({
		bounds: Zm({
			bottom: e.bottom + t.y,
			left: e.left + t.x,
			right: e.right + t.x,
			top: e.top + t.y
		}),
		center: Object.freeze({
			x: n.x + t.x,
			y: n.y + t.y
		}),
		target: r
	})));
}
function ih({ bounds: e, matrix: t }) {
	let n = [
		new p(e.left, e.top),
		new p(e.right, e.top),
		new p(e.right, e.bottom),
		new p(e.left, e.bottom)
	].map((e) => e.transform(t));
	return Zm({
		bottom: Math.max(...n.map(({ y: e }) => e)),
		left: Math.min(...n.map(({ x: e }) => e)),
		right: Math.max(...n.map(({ x: e }) => e)),
		top: Math.min(...n.map(({ y: e }) => e))
	});
}
function Y({ first: e, second: t }) {
	return Number.isFinite(e) && Number.isFinite(t) && Math.abs(e - t) <= Xm;
}
function ah({ constraints: e, geometry: t }) {
	return e.every(({ edge: e, position: n }) => Y({
		first: e === "right" ? t.frame.scaleX : t.frame.scaleY,
		second: n
	}));
}
function oh({ first: e, second: t }) {
	return e.length === t.length ? e.every((e, n) => Y({
		first: e,
		second: t[n]
	})) : !1;
}
var sh = class {
	constructor({ affineChildren: e = [], canvasManager: t, children: n, domainSource: r = null, projection: i, selection: a, transform: o }) {
		if (this.canonicalMeasurements = /* @__PURE__ */ new Map(), this.pointerMeasurements = /* @__PURE__ */ new Map(), this.canonicalGeometries = /* @__PURE__ */ new Map(), this.lastConfirmedMeasurement = null, this.pendingMeasurement = null, n.length < 1) throw Error("Скейлинг состава с текстом требует хотя бы один текст");
		if (n.length + e.length + (r?.targets.length ?? 0) < 2) throw Error("Скейлинг общего выделения требует минимум два объекта");
		this.canvasManager = t, this.domainSource = r, this.selection = a, this.transform = o, this.projectionModes = bc({ projection: i }), this.baseline = this._captureBaseline({
			projection: i,
			selection: a
		}), this.items = Object.freeze(n.map((e) => this._createItem({ target: e }))), this.affineItems = Object.freeze(e.map((e) => this._createAffineItem({ target: e }))), this.minimums = this._resolveMinimumMultipliers(), this.confirmedLiveState = Um({
			affineChildren: e,
			selection: a,
			texts: n,
			transform: o
		});
	}
	measure({ mode: e, multipliers: t }) {
		let n = this._resolveSupportedMultipliers({
			mode: e,
			multipliers: t
		}), r = Vs({
			mode: e,
			multipliers: n
		}), i = this._createMeasurementKey({
			mode: e,
			values: r
		}), a = this.pointerMeasurements.get(i);
		if (a) return a;
		let o = this._resolvePointerGeometry({
			mode: e,
			rawMultipliers: t,
			requestedMultipliers: n
		}), s = this._measureCanonicalMultipliers({
			mode: e,
			multipliers: o.multipliers
		});
		return this._rememberMeasurement({
			cache: this.pointerMeasurements,
			key: i,
			measurement: s
		}), s;
	}
	measureValues({ mode: e, values: t }) {
		return this._measureCanonicalMultipliers({
			mode: e,
			multipliers: Hs({
				projectionMode: e,
				effectiveValues: t
			})
		});
	}
	apply({ measurement: e }) {
		try {
			this._applyMeasurement({ measurement: e }), this.pendingMeasurement = e;
		} catch (e) {
			try {
				this._restoreConfirmedLiveState();
			} catch {}
			throw e;
		}
	}
	hasConfirmedMeasurement() {
		return this.lastConfirmedMeasurement !== null;
	}
	getLastConfirmedMeasurement() {
		return this.lastConfirmedMeasurement;
	}
	confirmAppliedMeasurement() {
		let e = this.pendingMeasurement;
		if (!e) return !1;
		let t = this._captureCurrentLiveState();
		if (e.domainMeasurement) {
			if (!this.domainSource) throw Error("Подтверждение доменной геометрии требует её источник");
			this.domainSource.confirmAppliedState({ measurement: e.domainMeasurement });
		}
		return this.confirmedLiveState = t, this.lastConfirmedMeasurement = e, this.pendingMeasurement = null, !0;
	}
	restoreConfirmedMeasurement() {
		return this._restoreConfirmedLiveState(), this.pendingMeasurement = null, !0;
	}
	dispose() {
		this.canonicalGeometries.clear(), this.canonicalMeasurements.clear(), this.pointerMeasurements.clear(), this.items.forEach(({ measurementTextbox: e }) => e.dispose()), this.lastConfirmedMeasurement = null, this.pendingMeasurement = null;
	}
	_captureCurrentLiveState() {
		return Um({
			affineChildren: this.affineItems.map(({ target: e }) => e),
			selection: this.selection,
			texts: this.items.map(({ target: e }) => e),
			transform: this.transform
		});
	}
	_restoreConfirmedLiveState() {
		let e = !1, t;
		try {
			Wm({ state: this.confirmedLiveState });
		} catch (n) {
			e = !0, t = n;
		}
		try {
			this.domainSource?.restoreConfirmedState();
		} catch (n) {
			e || (t = n), e = !0;
		}
		if (e) throw t;
	}
	_applyMeasurement({ measurement: e }) {
		let { frame: t } = e;
		this._applySelectionFrame({ frame: t }), this._applyTextMeasurements({ measurement: e }), this._applyAffineMeasurements({ measurement: e }), this._applyDomainMeasurement({ measurement: e }), this.transform.scaleX = this.selection.scaleX, this.transform.scaleY = this.selection.scaleY, this.selection.setCoords(), this._assertAppliedMeasurement({ measurement: e });
	}
	_applySelectionFrame({ frame: e }) {
		let t = new p(this.baseline.fixedAnchor.x, this.baseline.fixedAnchor.y);
		this.selection.set({
			angle: this.baseline.angle,
			flipX: !1,
			flipY: !1,
			height: this.baseline.height,
			scaleX: e.scaleX,
			scaleY: e.scaleY,
			skewX: 0,
			skewY: 0,
			width: this.baseline.width
		}), this.selection.setPositionByOrigin(t, this.transform.originX, this.transform.originY);
	}
	_applyTextMeasurements({ measurement: e }) {
		let { frame: t } = e;
		e.children.forEach((n, r) => {
			let i = this.items[r];
			if (!i || i.target !== n.target) throw Error("Измеренное состояние должно соответствовать исходному порядку текстов");
			this._applyChildMeasurement({
				childMeasurement: n,
				frame: t,
				item: i,
				mode: e.mode
			});
		});
	}
	_applyAffineMeasurements({ measurement: e }) {
		let { frame: t } = e;
		e.affineChildren.forEach((e, n) => {
			let r = this.affineItems[n];
			if (!r || r.target !== e.target) throw Error("Линейная геометрия должна соответствовать исходному порядку объектов");
			this._applyAffineChildMeasurement({
				childMeasurement: e,
				frame: t,
				item: r
			});
		});
	}
	_applyDomainMeasurement({ measurement: e }) {
		if (e.domainMeasurement) {
			if (!this.domainSource) throw Error("Измеренная доменная геометрия должна иметь источник применения");
			this.domainSource.apply({
				children: e.domainChildren,
				frame: e.frame,
				measurement: e.domainMeasurement
			});
		}
	}
	_captureBaseline({ projection: e, selection: t }) {
		let n = [...t.calcTransformMatrix()];
		if (!n.every(Number.isFinite)) throw Error("Матрица выделения с текстами должна быть конечной");
		let r = new p(e.fixedAnchor.x, e.fixedAnchor.y).transform(C.invertTransform(n));
		return Object.freeze({
			angle: t.angle ?? 0,
			fixedAnchor: Object.freeze({ ...e.fixedAnchor }),
			fixedAnchorLocal: Object.freeze({
				x: r.x,
				y: r.y
			}),
			height: t.height,
			matrix: n,
			width: t.width
		});
	}
	_createItem({ target: e }) {
		let t = hp({ target: e });
		return Object.freeze({
			base: Nl({ textbox: e }),
			measurementTextbox: t,
			placement: this.canvasManager.getObjectPlacement({ object: e }),
			startCenter: Object.freeze({ ...e.getRelativeCenterPoint() }),
			target: e
		});
	}
	_createAffineItem({ target: e }) {
		let t = [
			e.parent,
			e.flipX,
			e.flipY,
			e.locked,
			e.lockScalingX,
			e.lockScalingY
		].some(Boolean), n = [
			e.angle ?? 0,
			e.skewX ?? 0,
			e.skewY ?? 0,
			e.strokeWidth ?? 0
		];
		if (e.group !== this.selection || t || n.some((e) => !Y({
			first: e,
			second: 0
		}))) throw Error("Линейный ребёнок должен иметь каноническое преобразование");
		let r = e.width * e.scaleX, i = e.height * e.scaleY;
		if (![r, i].every(Number.isFinite) || r <= 0 || i <= 0) throw Error("Линейный ребёнок должен иметь конечный положительный размер");
		return Object.freeze({
			height: i,
			scaleX: e.scaleX,
			scaleY: e.scaleY,
			startCenter: Object.freeze({ ...e.getRelativeCenterPoint() }),
			target: e,
			width: r
		});
	}
	_resolveMinimumMultipliers() {
		let e = 0, t = 0, n = 0;
		return this.items.forEach(({ base: r }) => {
			let i = Pl({ base: r });
			e = Math.max(e, i.widthScale), t = Math.max(t, i.fontScale), n = Math.max(n, i.proportionalScale);
		}), Object.freeze({
			font: t,
			proportional: n,
			width: e
		});
	}
	_resolveSupportedMultipliers({ mode: e, multipliers: t }) {
		if (e === "vertical") throw Error("Вертикальные боковые ручки скрыты для выделения с текстами");
		let n;
		if (e === "uniform") {
			let e = Math.max(this.minimums.proportional, t.x);
			n = Object.freeze({
				x: e,
				y: e
			});
		} else n = Object.freeze(e === "horizontal" ? {
			x: Math.max(this.minimums.width, t.x),
			y: 1
		} : {
			x: Math.max(this.minimums.width, t.x),
			y: Math.max(this.minimums.font, t.y)
		});
		let r = this.domainSource?.measure({
			mode: e,
			multipliers: n
		});
		return r ? (this._assertDomainMultipliers({
			mode: e,
			requested: n,
			resolved: r.multipliers
		}), r.multipliers) : n;
	}
	_assertDomainMultipliers({ mode: e, requested: t, resolved: n }) {
		if (![n.x, n.y].every(Number.isFinite) || Math.min(n.x, n.y) <= 0) throw Error("Доменный источник должен вернуть положительные конечные множители");
		if (n.x < t.x - Xm || n.y < t.y - Xm) throw Error("Доменный источник не должен ослаблять уже применённые ограничения текста");
		if (e === "uniform" && !Y({
			first: n.x,
			second: n.y
		})) throw Error("Пропорциональный скейлинг должен сохранить одинаковые множители");
		if (e === "horizontal" && !Y({
			first: n.y,
			second: 1
		})) throw Error("Горизонтальный скейлинг не должен менять вертикальный множитель");
	}
	_assertDomainChildren({ measurement: e }) {
		let t = this.domainSource?.targets;
		if (!t || t.length !== e.children.length) throw Error("Доменное измерение должно содержать все заявленные объекты");
		if (!e.children.every(({ target: e }, n) => e === t[n])) throw Error("Порядок доменных объектов должен совпадать с началом сессии");
	}
	_resolveProjectionMode({ mode: e }) {
		let t = this.projectionModes.find(({ id: t }) => t === e);
		if (!t) throw Error("Для текстового скейлинга должна существовать выбранная проекция");
		return t;
	}
	_measureCanonicalMultipliers({ mode: e, multipliers: t }) {
		let n = this._resolveSupportedMultipliers({
			mode: e,
			multipliers: t
		}), r = Vs({
			mode: e,
			multipliers: n
		}), i = this._createMeasurementKey({
			mode: e,
			values: r
		}), a = this.canonicalMeasurements.get(i);
		if (a) return a;
		let o = this._measureCanonicalGeometry({
			mode: e,
			multipliers: n
		}), s = this._resolveProjectionMode({ mode: e }), c = this._createProjectionSamples({
			geometry: o,
			projectionMode: s
		}), l = Lm({
			bounds: o.bounds,
			projectionMode: s,
			samples: c,
			values: o.values
		}), u = Object.freeze({
			...o,
			projection: l
		});
		return this._rememberMeasurement({
			cache: this.canonicalMeasurements,
			key: i,
			measurement: u
		}), u;
	}
	_rememberMeasurement({ cache: e, key: t, measurement: n }) {
		if (e.set(t, n), e.size <= Jm) return;
		let r = e.keys().next().value;
		if (typeof r != "string") throw Error("Кеш измерений выделения с текстами не должен быть пустым");
		e.delete(r);
	}
	_createMeasurementKey({ mode: e, values: t }) {
		return `${this.items.map(({ target: e }) => e.autoExpand === !1 ? "fixed" : "auto").join(":")}:${e}:${t.join(":")}`;
	}
	_resolvePointerGeometry({ mode: e, rawMultipliers: t, requestedMultipliers: n }) {
		let r = this._createPointerFrameConstraints({
			mode: e,
			rawMultipliers: t,
			requestedMultipliers: n
		}), i = this._measureCanonicalGeometry({
			mode: e,
			multipliers: n
		});
		if (r.length === 0) return i;
		for (let t = 0; t < qm; t += 1) {
			if (ah({
				constraints: r,
				geometry: i
			})) return i;
			let t = this._resolvePointerCorrection({
				constraints: r,
				geometry: i,
				mode: e
			});
			if (!t) return i;
			let n = this._measureCanonicalGeometry({
				mode: e,
				multipliers: t
			});
			if (oh({
				first: n.values,
				second: i.values
			})) return i;
			i = n;
		}
		return i;
	}
	_createPointerFrameConstraints({ mode: e, rawMultipliers: t, requestedMultipliers: n }) {
		let r = [], i = !Y({
			first: t.x,
			second: n.x
		}), a = !Y({
			first: t.y,
			second: n.y
		});
		return i || r.push({
			axis: "x",
			edge: "right",
			position: n.x
		}), e === "free" && !a && r.push({
			axis: "y",
			edge: "bottom",
			position: n.y
		}), Object.freeze(r.map((e) => Object.freeze(e)));
	}
	_resolvePointerCorrection({ constraints: e, geometry: t, mode: n }) {
		let r = this._resolveProjectionMode({ mode: n }), i = this._createNeighborGeometries({
			geometry: t,
			projectionMode: r
		}), a = n === "free" ? ["right", "bottom"] : ["right"], o = qd({
			projection: Wd({
				bounds: Zm({
					bottom: t.frame.scaleY,
					left: 0,
					right: t.frame.scaleX,
					top: 0
				}),
				input: {
					variables: r.projection.variables,
					baselineValues: t.values,
					variableSceneWeights: r.projection.variableSceneWeights,
					edges: a.map((e) => Object.freeze({
						edge: e,
						coefficients: Object.freeze(i.map((n, r) => {
							let i = e === "right" ? t.frame.scaleX : t.frame.scaleY, a = e === "right" ? n.frame.scaleX : n.frame.scaleY, o = n.values[r] - t.values[r];
							return (a - i) / o;
						}))
					}))
				}
			}),
			rawValues: t.values,
			constraints: e,
			epsilon: Xm
		});
		if (!o) return null;
		let s = Hs({
			projectionMode: n,
			effectiveValues: o.values
		});
		return this._resolveSupportedMultipliers({
			mode: n,
			multipliers: s
		});
	}
	_measureCanonicalGeometry({ mode: e, multipliers: t }) {
		let n = Vs({
			mode: e,
			multipliers: t
		}), r = this._createMeasurementKey({
			mode: e,
			values: n
		}), i = this.canonicalGeometries.get(r);
		if (i) return i;
		let a = this._createCanonicalGeometry({
			mode: e,
			multipliers: t
		});
		if (this.canonicalGeometries.set(r, a), this.canonicalGeometries.size > Ym) {
			let e = this.canonicalGeometries.keys().next().value;
			if (typeof e != "string") throw Error("Кеш геометрии текстов не должен быть пустым");
			this.canonicalGeometries.delete(e);
		}
		return a;
	}
	_createCanonicalGeometry({ mode: e, multipliers: t }) {
		let n = this.items.map((n) => this._measureChild({
			item: n,
			mode: e,
			multipliers: t
		})), r = this.affineItems.map((e) => this._measureAffineChild({
			item: e,
			multipliers: t
		})), i = this._measureDomainGeometry({
			mode: e,
			multipliers: t
		}), a = $m({ bounds: [
			...n.map(({ bounds: e }) => e),
			...r.map(({ bounds: e }) => e),
			...i?.children.map(({ bounds: e }) => e) ?? []
		] }), o = th({
			bounds: a,
			fixedAnchor: this.baseline.fixedAnchorLocal,
			transform: this.transform
		}), s = Zm({
			bottom: a.bottom + o.y,
			left: a.left + o.x,
			right: a.right + o.x,
			top: a.top + o.y
		});
		return Object.freeze({
			affineChildren: Object.freeze(r.map(({ bounds: e, ...t }) => Object.freeze({
				...t,
				center: Object.freeze({
					x: t.center.x + o.x,
					y: t.center.y + o.y
				})
			}))),
			bounds: ih({
				bounds: s,
				matrix: this.baseline.matrix
			}),
			children: Object.freeze(n.map(({ bounds: e, ...t }) => Object.freeze({
				...t,
				center: Object.freeze({
					x: t.center.x + o.x,
					y: t.center.y + o.y
				})
			}))),
			domainChildren: rh({
				children: i?.children ?? [],
				translation: o
			}),
			domainMeasurement: i,
			frame: Qm({
				baseline: this.baseline,
				bounds: s
			}),
			mode: e,
			multipliers: t,
			values: Vs({
				mode: e,
				multipliers: t
			})
		});
	}
	_measureDomainGeometry({ mode: e, multipliers: t }) {
		let n = this.domainSource?.measure({
			mode: e,
			multipliers: t
		}) ?? null;
		if (!n) return null;
		if (this._assertDomainChildren({ measurement: n }), this._assertDomainMultipliers({
			mode: e,
			requested: t,
			resolved: n.multipliers
		}), !(Y({
			first: n.multipliers.x,
			second: t.x
		}) && Y({
			first: n.multipliers.y,
			second: t.y
		}))) throw Error("Доменная геометрия должна соответствовать уже выбранным множителям");
		return n;
	}
	_measureAffineChild({ item: e, multipliers: t }) {
		let n = nh({
			fixedAnchor: this.baseline.fixedAnchorLocal,
			multipliers: t,
			startCenter: e.startCenter
		}), r = e.width * t.x, i = e.height * t.y;
		return Object.freeze({
			bounds: Zm({
				bottom: n.y + i / 2,
				left: n.x - r / 2,
				right: n.x + r / 2,
				top: n.y - i / 2
			}),
			center: n,
			scaleX: e.scaleX * t.x,
			scaleY: e.scaleY * t.y,
			target: e.target
		});
	}
	_measureChild({ item: e, mode: t, multipliers: n }) {
		e.measurementTextbox.autoExpand = e.target.autoExpand !== !1;
		let r = nh({
			fixedAnchor: this.baseline.fixedAnchorLocal,
			multipliers: n,
			startCenter: e.startCenter
		});
		Bl({
			textbox: e.measurementTextbox,
			canvasManager: this.canvasManager,
			base: e.base,
			widthScale: n.x,
			heightScale: n.y,
			placement: {
				left: r.x,
				top: r.y,
				originX: "center",
				originY: "center"
			},
			shouldScaleFontSize: n.y !== 1,
			shouldScalePadding: n.y !== 1,
			shouldScaleRadii: n.y !== 1,
			shouldDisableAutoExpandOnHorizontalChange: t === "horizontal" || t === "free",
			shouldRoundDimensions: !1
		});
		let i = e.measurementTextbox.getBoundingRect();
		return Object.freeze({
			bounds: Zm({
				bottom: i.top + i.height,
				left: i.left,
				right: i.left + i.width,
				top: i.top
			}),
			canonicalState: Cd({ textbox: e.measurementTextbox }),
			center: r,
			target: e.target
		});
	}
	_createProjectionSamples({ geometry: e, projectionMode: t }) {
		let n = this._createNeighborGeometries({
			geometry: e,
			projectionMode: t
		});
		return Object.freeze(n.map(({ bounds: e, values: t }) => Object.freeze({
			bounds: e,
			values: t
		})));
	}
	_createNeighborGeometries({ geometry: e, projectionMode: t }) {
		return Object.freeze(e.values.map((n, r) => this._createNeighborGeometry({
			geometry: e,
			projectionMode: t,
			variableIndex: r
		})));
	}
	_createNeighborGeometry({ geometry: e, projectionMode: t, variableIndex: n }) {
		for (let r = 0; r < Km; r += 1) {
			let i = [...e.values];
			i[n] += Gm * 2 ** r;
			let a = Hs({
				projectionMode: e.mode,
				effectiveValues: i
			}), o = this._measureCanonicalGeometry({
				mode: e.mode,
				multipliers: this._resolveSupportedMultipliers({
					mode: e.mode,
					multipliers: a
				})
			});
			if (t.projection.edges.some(({ edge: t }) => !Y({
				first: o.bounds[t],
				second: e.bounds[t]
			}))) return o;
		}
		throw Error("Не удалось найти различимую геометрию скейлинга выделения с текстами");
	}
	_applyChildMeasurement({ childMeasurement: e, frame: t, item: n, mode: r }) {
		let { target: i } = n;
		i.set({
			angle: 0,
			flipX: !1,
			flipY: !1,
			scaleX: 1,
			scaleY: 1,
			skewX: 0,
			skewY: 0
		}), Bl({
			textbox: i,
			canvasManager: this.canvasManager,
			base: n.base,
			widthScale: e.canonicalState.width / n.base.width,
			heightScale: e.canonicalState.fontSize / n.base.fontSize,
			placement: n.placement,
			shouldScaleFontSize: e.canonicalState.fontSize !== n.base.fontSize,
			shouldScalePadding: e.canonicalState.fontSize !== n.base.fontSize,
			shouldScaleRadii: e.canonicalState.fontSize !== n.base.fontSize,
			shouldDisableAutoExpandOnHorizontalChange: r === "horizontal" || r === "free",
			shouldRoundDimensions: !1
		}), i.set({ preserveExactTextGeometry: !0 }), this._applyChildFrameCompensation({
			center: e.center,
			frame: t,
			scaleX: 1,
			scaleY: 1,
			target: i
		});
	}
	_applyAffineChildMeasurement({ childMeasurement: e, frame: t, item: n }) {
		this._applyChildFrameCompensation({
			center: e.center,
			frame: t,
			scaleX: e.scaleX,
			scaleY: e.scaleY,
			target: n.target
		});
	}
	_applyChildFrameCompensation({ center: e, frame: t, scaleX: n, scaleY: r, target: i }) {
		i.set({
			scaleX: n / t.scaleX,
			scaleY: r / t.scaleY
		}), i.setPositionByOrigin(new p((e.x - t.center.x) / t.scaleX, (e.y - t.center.y) / t.scaleY), "center", "center"), i.setCoords();
	}
	_assertAppliedMeasurement({ measurement: e }) {
		let t = this.selection.getBoundingRect(), n = Zm({
			bottom: t.top + t.height,
			left: t.left,
			right: t.left + t.width,
			top: t.top
		});
		if (![
			"left",
			"right",
			"top",
			"bottom"
		].every((t) => Y({
			first: n[t],
			second: e.bounds[t]
		}))) throw Error("Рамка выделения должна совпасть с измеренной геометрией");
		let r = this._readVisibleChildrenLocalBounds({ measurement: e }), i = Zm({
			bottom: e.frame.center.y + e.frame.height / 2,
			left: e.frame.center.x - e.frame.width / 2,
			right: e.frame.center.x + e.frame.width / 2,
			top: e.frame.center.y - e.frame.height / 2
		});
		if (![
			"left",
			"right",
			"top",
			"bottom"
		].every((e) => Y({
			first: r[e],
			second: i[e]
		}))) throw Error("Видимые границы детей должны совпасть с измеренной рамкой");
		e.children.forEach(({ canonicalState: t, target: n }) => {
			let r = {
				...t,
				scaleX: 1 / e.frame.scaleX,
				scaleY: 1 / e.frame.scaleY
			};
			if (!Td({
				actual: Cd({ textbox: n }),
				expected: r
			})) throw Error("Живой текст должен совпасть с измеренным каноническим состоянием");
		}), this._assertAppliedAffineChildren({ measurement: e });
	}
	_assertAppliedAffineChildren({ measurement: e }) {
		e.affineChildren.forEach((t) => {
			let n = new p((t.center.x - e.frame.center.x) / e.frame.scaleX, (t.center.y - e.frame.center.y) / e.frame.scaleY), r = t.target.getRelativeCenterPoint(), i = Y({
				first: t.target.scaleX,
				second: t.scaleX / e.frame.scaleX
			}) && Y({
				first: t.target.scaleY,
				second: t.scaleY / e.frame.scaleY
			}), a = Y({
				first: r.x,
				second: n.x
			}) && Y({
				first: r.y,
				second: n.y
			});
			if (!i || !a) throw Error("Линейный ребёнок должен совпасть с измеренной геометрией");
		});
	}
	_readVisibleChildrenLocalBounds({ measurement: e }) {
		let t = C.invertTransform(this.baseline.matrix), n = [
			...e.children.map(({ target: e }) => e),
			...e.affineChildren.map(({ target: e }) => e),
			...e.domainChildren.map(({ target: e }) => e)
		].flatMap((e) => e.getCoords().map((e) => e.transform(t)));
		return Zm({
			bottom: Math.max(...n.map(({ y: e }) => e)),
			left: Math.min(...n.map(({ x: e }) => e)),
			right: Math.max(...n.map(({ x: e }) => e)),
			top: Math.min(...n.map(({ y: e }) => e))
		});
	}
}, ch = 8, lh = 1e-7;
function uh({ constraint: e, measurement: t, plan: n }) {
	return e ? Math.abs(t.bounds[e.candidate.edge] - e.expectedPosition) <= n.verificationEpsilon : !0;
}
function dh({ constraints: e, measurement: t, plan: n }) {
	return Object.freeze({
		x: uh({
			constraint: e.x,
			measurement: t,
			plan: n
		}) ? e.x : null,
		y: uh({
			constraint: e.y,
			measurement: t,
			plan: n
		}) ? e.y : null
	});
}
function fh({ constraints: e, measurement: t, plan: n }) {
	return e.every(({ edge: e, position: r }) => Math.abs(t.bounds[e] - r) <= n.verificationEpsilon);
}
function ph({ constraints: e, pointerMeasurement: t }) {
	let n = [...lf({ constraints: e })];
	if (t.projection.projection.variables.length !== 2) return Object.freeze(n);
	let r = new Set(n.map(({ axis: e }) => e));
	for (let { edge: e } of t.projection.projection.edges) {
		let i = Yd({ edge: e });
		r.has(i) || (n.push(Object.freeze({
			axis: i,
			edge: e,
			position: t.bounds[e]
		})), r.add(i));
	}
	return Object.freeze(n);
}
function mh({ measuredValues: e, values: t }) {
	return e.every((e) => e.length !== t.length || e.some((e, n) => Math.abs(e - t[n]) > lh));
}
function hh({ constraints: e, measurement: t, plan: n }) {
	let r = qd({
		projection: Wd({
			bounds: t.projection.bounds,
			input: t.projection.projection
		}),
		rawValues: t.values,
		constraints: e,
		epsilon: n.verificationEpsilon
	});
	return r ? Object.freeze([...r.values]) : null;
}
function gh({ constraints: e, initialValues: t, measurer: n, mode: r, plan: i, pointerMeasurement: a }) {
	let o = ph({
		constraints: e,
		pointerMeasurement: a
	});
	if (o.length === 0) return null;
	let s = [], c = t;
	for (let e = 0; e < ch; e += 1) {
		let e = n.measureValues({
			mode: r,
			values: c
		});
		if (s.push(e.values), fh({
			constraints: o,
			measurement: e,
			plan: i
		})) return e;
		let t = hh({
			constraints: o,
			measurement: e,
			plan: i
		});
		if (!t || !mh({
			measuredValues: s,
			values: t
		})) return null;
		c = t;
	}
	return null;
}
function _h({ plan: e }) {
	let t = ["x", "y"];
	t.sort((t, n) => Number(e.constraints[n]?.transition === "held") - Number(e.constraints[t]?.transition === "held"));
	let n = [], r = /* @__PURE__ */ new Set(), i = (e, t) => {
		r.has(e) || !t[e] || (n.push(Object.freeze({
			x: e === "x" ? t.x : null,
			y: e === "y" ? t.y : null
		})), r.add(e));
	};
	return t.forEach((t) => i(t, e.constraints)), t.forEach((t) => i(t, e.refinementCandidates)), Object.freeze(n);
}
function vh({ constraints: e, measurement: t }) {
	return Object.freeze({
		measurement: t,
		refinement: Object.freeze({
			constraints: e,
			effectiveValues: t.values,
			stepProjection: t.projection
		})
	});
}
function yh({ measurer: e, mode: t, plan: n }) {
	if (t !== "uniform") return null;
	let r = ["x", "y"].filter((e) => n.constraints[e]?.transition === "held");
	if (r.length === 0) return null;
	let i = e.getLastConfirmedMeasurement();
	if (!i || i.mode !== t) return null;
	let a = dh({
		constraints: n.refinementCandidates,
		measurement: i,
		plan: n
	});
	return r.every((e) => {
		let t = n.constraints[e], r = a[e];
		return !t || !r ? !1 : t.candidate.id === r.candidate.id && Math.abs(t.expectedPosition - r.expectedPosition) <= n.verificationEpsilon;
	}) ? vh({
		constraints: a,
		measurement: i
	}) : null;
}
function bh({ measurer: e, mode: t, plan: n, pointerMeasurement: r }) {
	let i = yh({
		measurer: e,
		mode: t,
		plan: n
	});
	if (i) return i;
	let a = n.refinementCandidates;
	if (!a.x && !a.y) return Object.freeze({
		measurement: r,
		refinement: null
	});
	let o = gh({
		constraints: a,
		initialValues: n.effectiveValues,
		measurer: e,
		mode: t,
		plan: n,
		pointerMeasurement: r
	});
	if (o) return vh({
		constraints: a,
		measurement: o
	});
	for (let i of _h({ plan: n })) {
		let a = gh({
			constraints: i,
			initialValues: n.effectiveValues,
			measurer: e,
			mode: t,
			plan: n,
			pointerMeasurement: r
		});
		if (a) return vh({
			constraints: i,
			measurement: a
		});
	}
	return vh({
		constraints: dh({
			constraints: a,
			measurement: r,
			plan: n
		}),
		measurement: r
	});
}
//#endregion
//#region src/editor/text-manager/scaling/active-selection-scaling-controller.ts
var xh = Object.freeze(/* @__PURE__ */ new Set([
	"tl",
	"tr",
	"bl",
	"br",
	"ml",
	"mr"
])), Sh = 1e-9;
function Ch({ actual: e, expected: t }) {
	return Number.isFinite(e) && Number.isFinite(t) && Math.abs(e - t) <= Sh;
}
function wh({ selection: e, target: t }) {
	if (!(t instanceof a) || t.group !== e || [
		t.parent,
		t.flipX,
		t.flipY,
		t.locked,
		t.lockScalingX,
		t.lockScalingY
	].some(Boolean)) return null;
	let n = [
		t.width,
		t.height,
		t.scaleX,
		t.scaleY
	];
	return !n.every(Number.isFinite) || Math.min(...n) <= 0 ? null : [
		t.angle ?? 0,
		t.skewX ?? 0,
		t.skewY ?? 0,
		t.strokeWidth ?? 0
	].every((e) => Ch({
		actual: e,
		expected: 0
	})) ? t : null;
}
function Th({ domainTargets: e = [], selection: t }) {
	if (!Ch({
		actual: t.scaleX ?? 1,
		expected: 1
	}) || !Ch({
		actual: t.scaleY ?? 1,
		expected: 1
	})) return null;
	let n = t.getObjects();
	if (n.length < 2) return null;
	let r = Nm({ selection: t });
	if (!r) return null;
	let i = new Set(r), a = new Set(e);
	if (a.size !== e.length || e.some((e) => e.group !== t || i.has(e))) return null;
	let o = [];
	for (let e of n) {
		if (i.has(e) || a.has(e)) continue;
		let n = wh({
			selection: t,
			target: e
		});
		if (!n) return null;
		o.push(n);
	}
	return e.some((e) => !n.includes(e)) ? null : Object.freeze({
		affineChildren: Object.freeze(o),
		children: Object.freeze([...n]),
		texts: r
	});
}
var Eh = class {
	constructor({ canvas: e, canvasManager: t }) {
		this.session = null, this.canvas = e, this.canvasManager = t;
	}
	supportsScaling({ domainTargets: e, selection: t }) {
		return Th({
			domainTargets: e,
			selection: t
		}) !== null;
	}
	beginScaling({ domainSource: e, projection: t, selection: n, transform: r }) {
		let i = Th({
			domainTargets: e?.targets,
			selection: n
		});
		if (!i || r.target !== n || !xh.has(r.corner)) return !1;
		if (this.session) throw Error("Сессия скейлинга выделения с текстом уже начата");
		let a = new sh({
			affineChildren: i.affineChildren,
			canvasManager: this.canvasManager,
			children: i.texts,
			domainSource: e,
			projection: t,
			selection: n,
			transform: r
		});
		return this.session = Object.freeze({
			children: i.children,
			measurer: a,
			selection: n,
			texts: i.texts,
			transform: r
		}), !0;
	}
	measureScale({ mode: e, multipliers: t, selection: n }) {
		return this._getSession({ selection: n }).measurer.measure({
			mode: e,
			multipliers: t
		});
	}
	resolveScaleStep({ mode: e, plan: t, pointerMeasurement: n, selection: r }) {
		let { measurer: i } = this._getSession({ selection: r });
		return bh({
			measurer: i,
			mode: e,
			plan: t,
			pointerMeasurement: n
		});
	}
	applyScalePreview({ measurement: e, selection: t }) {
		let { measurer: n } = this._getSession({ selection: t });
		return n.apply({ measurement: e }), this.canvas.requestRenderAll(), e.multipliers;
	}
	confirmScalePreview({ selection: e }) {
		let { measurer: t } = this._getSession({ selection: e });
		return t.confirmAppliedMeasurement();
	}
	commitScaling({ selection: e }) {
		let { session: t } = this;
		if (!t || t.selection !== e) return !1;
		if (!t.measurer.hasConfirmedMeasurement()) throw Error("Фиксации выделения с текстами должно предшествовать подтверждённое состояние");
		let n = [];
		try {
			if (this.canvas.getActiveObject() === e) throw Error("SelectionManager должен снять временную рамку до фиксации текстов");
			this._assertCommittedTexts({ texts: t.texts });
		} catch (e) {
			n.push(e);
		}
		for (let e of t.children) try {
			e.setCoords();
		} catch (e) {
			n.push(e);
		}
		let [r] = n;
		if (n.length > 0) throw r;
		return !0;
	}
	clearScaling({ selection: e }) {
		return this.session?.selection === e ? (this._clearSession({ selection: e }), !0) : !1;
	}
	hasConfirmedScalePreview({ selection: e }) {
		return this.session?.selection === e ? this.session.measurer.hasConfirmedMeasurement() : !1;
	}
	restoreScalePreview({ selection: e }) {
		if (this.session?.selection !== e) return !1;
		let t = this.session.measurer.restoreConfirmedMeasurement();
		return t && this.canvas.requestRenderAll(), t;
	}
	destroy() {
		this.session && this._clearSession({ selection: this.session.selection });
	}
	_getSession({ selection: e }) {
		let { session: t } = this;
		if (!t || t.selection !== e) throw Error("Скейлинг выделения с текстом должен начинаться с исходной сессии");
		return t;
	}
	_assertCommittedTexts({ texts: e }) {
		for (let t of e) if (![
			(t.scaleX ?? 1) - 1,
			(t.scaleY ?? 1) - 1,
			t.angle ?? 0,
			t.skewX ?? 0,
			t.skewY ?? 0
		].every((e) => Ch({
			actual: e,
			expected: 0
		}))) throw Error("После фиксации каждый текст должен иметь каноническое преобразование");
	}
	_clearSession({ selection: e }) {
		let { session: t } = this;
		!t || t.selection !== e || (t.measurer.dispose(), this.session = null);
	}
}, Dh = class t {
	constructor({ editor: n }) {
		this._handleMouseDown = (e) => {
			this.cornerScaleInteractionController.beginGesture(e), this.widthResizeInteractionController.beginGesture(e);
		}, this._handleScaleInteractionFinished = () => {
			this.cornerScaleInteractionController.finishGesture(), this.widthResizeInteractionController.finishGesture();
		}, this._handleObjectRemoved = (e) => {
			let { target: t } = e;
			t && (this.cornerScaleInteractionController.finishGestureForTarget({ target: t }), this.widthResizeInteractionController.finishGestureForTarget({ target: t }));
		}, this._handlePointerCancel = (e) => {
			this.cornerScaleInteractionController.interruptGesture({ event: e }), this.widthResizeInteractionController.interruptGesture({ event: e });
		}, this._handleWindowBlur = () => {
			this.cornerScaleInteractionController.interruptGesture(), this.widthResizeInteractionController.interruptGesture();
		}, this._handleObjectModified = (t) => {
			if (this.widthResizeInteractionController.finishGesture(), t.target instanceof e) {
				let e = t.target;
				if (this.editor.selectionManager.commitTextSelectionScale({
					selection: e,
					transform: t.transform
				})) {
					this.cornerScaleInteractionController.finishGesture();
					return;
				}
			}
			this.scalingController.handleObjectModified(t), this.cornerScaleInteractionController.finishGesture();
		}, this._handleObjectScaling = (e) => {
			this.cornerScaleInteractionController.handleObjectScaling(e) || this.scalingController.handleObjectScaling(e);
		}, this._handleCanvasMouseMove = (e) => {
			this.cornerScaleInteractionController.handleCanvasMouseMove(e) || this.scalingController.handleMouseMove(e);
		}, this._handleTextEditingEntered = (e) => {
			this.isTextEditingActive = !0;
			let { target: n } = e;
			if (!t._isTextbox(n)) return;
			let { canvasManager: r, historyManager: i } = this.editor;
			i.beginAction({ reason: "text-edit" }), n.__lineDefaultsPrevText = n.text ?? "", !t._isShapeOwnedTextbox(n) && this._ensureEditingPlacementState().set(n, r.getObjectPlacement({ object: n }));
		}, this._handleTextChanged = (e) => {
			let { target: n } = e;
			if (!t._isTextbox(n)) return;
			let r = t._isShapeOwnedTextbox(n), { text: i = "", uppercase: a, autoExpand: o } = n, s = !!a, c = o !== !1, l = i.toLocaleLowerCase(), u = r ? null : this.editingPlacementState?.get(n) ?? this.editor.canvasManager.getObjectPlacement({ object: n });
			if (s) {
				let e = md({ value: l });
				e !== i && n.set({ text: e }), n.textCaseRaw = l;
			} else n.textCaseRaw = i;
			if (!r && o === void 0 && (n.autoExpand = !0), r) {
				this.syncLineStylesWithText({ textbox: n }), n.preserveExactTextGeometry = !1;
				return;
			}
			this.syncLineStylesWithText({ textbox: n }), this._normalizeTextboxAfterContentChange({
				textbox: n,
				placement: u,
				shouldAutoExpand: c,
				shouldRefreshDimensions: !0
			}), n.preserveExactTextGeometry = !1;
		}, this._handleTextEditingExited = (e) => {
			let { target: n } = e;
			if (!t._isTextbox(n)) return;
			let r = t._isShapeOwnedTextbox(n);
			this.editingPlacementState?.delete(n), delete n.__lineDefaultsPrevText;
			let i = n.text ?? "";
			n.uppercase ? n.textCaseRaw = n.textCaseRaw ?? i.toLocaleLowerCase() : n.textCaseRaw = i, r || (El({ textbox: n }) && (n.preserveExactTextGeometry = !1, n.setCoords(), n.dirty = !0, this.canvas.requestRenderAll()), n.locked || n.set({
				lockMovementX: !1,
				lockMovementY: !1
			}));
			let { historyManager: a } = this.editor;
			a.endAction({ reason: "text-edit" }), a.stageCurrentStateForPendingSave({ reason: "text-edit" }), a.scheduleSaveState({
				delayMs: 50,
				reason: "text-edit"
			});
		}, this._handleObjectResizing = (e) => {
			if (this.widthResizeInteractionController.handleObjectResizing(e)) return;
			let { target: n, transform: r, e: i } = e;
			if (!t._isTextbox(n) || t._isShapeOwnedTextbox(n)) return;
			n.autoExpand = !1;
			let { paddingLeft: a = 0, paddingRight: o = 0 } = n, s = a + o;
			if (s !== 0) {
				let { width: e = 0 } = n, t = r?.originX ?? n.originX ?? "left", i = r?.originY ?? n.originY ?? "top", a = n.getPointByOrigin(t, i), o = Math.max(0, e - s);
				if (e !== o) {
					n.set({ width: o });
					let { width: r = 0 } = n;
					e !== r && (n.setPositionByOrigin(a, t, i), n.setCoords());
				}
			}
			this.editor.snappingManager.applyTextResizingSnap({
				target: n,
				transform: r,
				event: i ?? null
			}), n.preserveExactTextGeometry = !1;
		}, this.editor = n, this.canvas = n.canvas, this.fonts = n.options.fonts ?? [], this.scalingController = new zd({
			canvas: n.canvas,
			canvasManager: n.canvasManager,
			persistScaledTextbox: ({ target: e, style: t, shouldRoundDimensions: n }) => {
				if (!this.updateController.updateText({
					target: e,
					style: t,
					shouldRoundDimensions: n
				})) throw Error("Итоговый размер текста должен сохраниться через общий механизм обновления");
			}
		}), this.activeSelectionScalingController = new Eh({
			canvas: n.canvas,
			canvasManager: n.canvasManager
		}), this.cornerScaleInteractionController = new Zp({
			editor: n,
			scalingController: this.scalingController
		}), this.widthResizeInteractionController = new km({ editor: n }), this.updateController = new yd({ runtime: {
			canvas: this.canvas,
			canvasManager: n.canvasManager,
			historyManager: n.historyManager,
			resolveTextObject: (e) => this._resolveTextObject(e),
			normalizeTextboxAfterContentChange: (e) => this._normalizeTextboxAfterContentChange(e),
			restoreTextboxContentPlacement: (e) => this._restoreTextboxContentPlacement(e),
			syncLineStylesWithText: (e) => this.syncLineStylesWithText(e),
			getSnapshot: (e) => t._getSnapshot(e)
		} }), this.editingPlacementState = /* @__PURE__ */ new WeakMap(), this.isTextEditingActive = !1, this._bindEvents(), vd();
	}
	addText({ id: e = `background-textbox-${E()}`, text: n = "Новый текст", autoExpand: r = !0, fontFamily: i, fontSize: a = 48, bold: o = !1, italic: s = !1, underline: c = !1, uppercase: l = !1, strikethrough: u = !1, align: d = "left", color: f = "#000000", strokeColor: p, strokeWidth: m = 0, opacity: h = 1, backgroundColor: g, backgroundOpacity: _ = 1, paddingTop: v = 0, paddingRight: y = 0, paddingBottom: b = 0, paddingLeft: x = 0, radiusTopLeft: S = 0, radiusTopRight: C = 0, radiusBottomRight: w = 0, radiusBottomLeft: T = 0, ...D } = {}, { withoutSelection: O = !1, withoutSave: k = !1, withoutAdding: A = !1, emitLifecycleEvents: ee = !0 } = {}) {
		let { canvasManager: te, historyManager: ne } = this.editor, { canvas: re } = this;
		ne.suspendHistory();
		let ie = i ?? this._getDefaultFontFamily(), ae = pd({ width: m }), oe = fd({
			strokeColor: p,
			width: ae
		}), se = {
			id: e,
			fontFamily: ie,
			fontSize: a,
			fontWeight: o ? "bold" : "normal",
			fontStyle: s ? "italic" : "normal",
			underline: c,
			uppercase: l,
			linethrough: u,
			textAlign: d,
			fill: f,
			stroke: oe,
			strokeWidth: ae,
			strokeUniform: !0,
			opacity: h,
			backgroundColor: g,
			backgroundOpacity: _,
			paddingTop: v,
			paddingRight: y,
			paddingBottom: b,
			paddingLeft: x,
			radiusTopLeft: S,
			radiusTopRight: C,
			radiusBottomRight: w,
			radiusBottomLeft: T,
			...D
		}, j = new _d(n, se), ce = r !== !1;
		j.autoExpand = ce;
		let le = D.left !== void 0 || D.top !== void 0;
		if (j.textCaseRaw = j.text ?? "", l) {
			let e = md({ value: j.textCaseRaw });
			e !== j.text && j.set({ text: e });
		}
		El({ textbox: j }) && (j.dirty = !0);
		let ue;
		le && (ue = te.resolveObjectPlacement({
			object: j,
			left: D.left,
			top: D.top,
			originX: D.originX,
			originY: D.originY,
			fallbackPoint: te.getMontageAreaSceneCenter()
		}));
		let de = ce && t._hasWrappedLinesBeyondExplicitBreaks(j);
		return (le || de) && this._normalizeTextboxAfterContentChange({
			textbox: j,
			placement: ue,
			shouldAutoExpand: de,
			clampToMontage: le
		}), ue || te.centerObjectToMontageArea({ object: j }), A || re.add(j), O || re.setActiveObject(j), re.requestRenderAll(), ne.resumeHistory(), k || ne.saveState(), ee && re.fire("editor:text-added", {
			textbox: j,
			options: {
				...se,
				text: n,
				bold: o,
				italic: s,
				strikethrough: u,
				align: d,
				color: f,
				strokeColor: oe,
				strokeWidth: ae
			},
			flags: {
				withoutSelection: !!O,
				withoutSave: !!k,
				withoutAdding: !!A
			}
		}), j;
	}
	updateText({ target: e, style: t = {}, withoutSave: n, skipRender: r, selectionRange: i, emitLifecycleEvents: a = !0, syncLineStylesWithText: o = !0 } = {}) {
		return this.updateController.updateText({
			target: e,
			style: t,
			withoutSave: n,
			skipRender: r,
			selectionRange: i,
			emitLifecycleEvents: a,
			syncLineStylesWithText: o
		});
	}
	stylesFromArray(e, t) {
		return C.stylesFromArray(e, t);
	}
	getActiveTextEditingOwner() {
		let e = this.canvas.getActiveObject();
		return !t._isTextbox(e) || e.isEditing !== !0 ? null : t._isShapeOwnedTextbox(e) ? e.group ?? e : e;
	}
	exitActiveTextEditing() {
		let e = this.canvas.getActiveObject();
		return !t._isTextbox(e) || !e.isEditing ? !1 : (e.exitEditing(), this.canvas.requestRenderAll(), !0);
	}
	destroy() {
		let { canvas: e } = this;
		this.activeSelectionScalingController.destroy(), this.cornerScaleInteractionController.finishGesture(), this.widthResizeInteractionController.finishGesture(), e.off("object:scaling", this._handleObjectScaling), e.off("object:resizing", this._handleObjectResizing), e.off("object:modified", this._handleObjectModified), e.off("mouse:move", this._handleCanvasMouseMove), e.off("mouse:down", this._handleMouseDown), e.off("mouse:up", this._handleScaleInteractionFinished), e.off("object:removed", this._handleObjectRemoved), e.off("selection:created", this._handleScaleInteractionFinished), e.off("selection:updated", this._handleScaleInteractionFinished), e.off("selection:cleared", this._handleScaleInteractionFinished), e.off("text:editing:exited", this._handleTextEditingExited), e.off("text:editing:entered", this._handleTextEditingEntered), e.off("text:changed", this._handleTextChanged), window.removeEventListener("pointercancel", this._handlePointerCancel), window.removeEventListener("touchcancel", this._handlePointerCancel), window.removeEventListener("blur", this._handleWindowBlur);
	}
	commitStandaloneTextScale({ target: e, shouldDisableAutoExpandOnHorizontalChange: n = !1, shouldRoundDimensions: r = !0 }) {
		let i = this.scalingController.commitStandaloneTextScale({
			target: e,
			shouldDisableAutoExpandOnHorizontalChange: n,
			shouldRoundDimensions: r
		});
		if (!t._isTextbox(e)) return i;
		let a = e;
		if (a.group?.shapeComposite === !0) return i;
		let o = !!a.locked;
		return a.set({
			editable: !o,
			evented: !0,
			lockMovementX: o,
			lockMovementY: o,
			selectable: !0
		}), a.setCoords(), i;
	}
	supportsActiveSelectionScaling({ domainTargets: e, selection: t }) {
		return this.activeSelectionScalingController.supportsScaling({
			domainTargets: e,
			selection: t
		});
	}
	beginActiveSelectionScaling({ domainSource: e, projection: t, selection: n, transform: r }) {
		return this.activeSelectionScalingController.beginScaling({
			domainSource: e,
			projection: t,
			selection: n,
			transform: r
		});
	}
	measureActiveSelectionScale({ mode: e, multipliers: t, selection: n }) {
		return this.activeSelectionScalingController.measureScale({
			mode: e,
			multipliers: t,
			selection: n
		});
	}
	resolveActiveSelectionScaleStep({ mode: e, plan: t, pointerMeasurement: n, selection: r }) {
		return this.activeSelectionScalingController.resolveScaleStep({
			mode: e,
			plan: t,
			pointerMeasurement: n,
			selection: r
		});
	}
	applyActiveSelectionScalePreview({ measurement: e, selection: t }) {
		return this.activeSelectionScalingController.applyScalePreview({
			measurement: e,
			selection: t
		});
	}
	confirmActiveSelectionScalePreview({ selection: e }) {
		return this.activeSelectionScalingController.confirmScalePreview({ selection: e });
	}
	commitActiveSelectionScaling({ selection: e }) {
		return this.activeSelectionScalingController.commitScaling({ selection: e });
	}
	clearActiveSelectionScaling({ selection: e }) {
		return this.activeSelectionScalingController.clearScaling({ selection: e });
	}
	hasConfirmedActiveSelectionScale({ selection: e }) {
		return this.activeSelectionScalingController.hasConfirmedScalePreview({ selection: e });
	}
	restoreActiveSelectionScalePreview({ selection: e }) {
		return this.activeSelectionScalingController.restoreScalePreview({ selection: e });
	}
	handleStandaloneTextCornerScaling(e) {
		return this.cornerScaleInteractionController.handleObjectScaling(e);
	}
	_resolveTextObject(e) {
		if (e instanceof _) return e;
		let { canvas: n } = this;
		if (!e) {
			let e = n.getActiveObject();
			return t._isTextbox(e) ? e : null;
		}
		return typeof e == "string" ? n.getObjects().find((n) => t._isTextbox(n) && n.id === e) ?? null : null;
	}
	static _isTextbox(e) {
		return !!e && e instanceof _;
	}
	static _isShapeOwnedTextbox(e) {
		if (!t._isTextbox(e)) return !1;
		let n = e.group;
		return e.shapeNodeType === "text" && n?.shapeComposite === !0;
	}
	static _hasWrappedLinesBeyondExplicitBreaks(e) {
		let t = typeof e.text == "string" ? e.text : "";
		if (!t.length) return !1;
		let n = t.split("\n").length, { textLines: r } = e;
		return Array.isArray(r) && r.length > n;
	}
	_normalizeTextboxAfterContentChange({ textbox: e, placement: t, shouldAutoExpand: n, clampToMontage: r = !0, shouldRefreshDimensions: i = !1, shouldRoundDimensions: a = !0 }) {
		let o = !1;
		n && (o = this._autoExpandTextboxWidth(e, {
			placement: t ?? void 0,
			clampToMontage: r
		}));
		let s = !1, c = !1;
		!o && i && (s = this._recalculateTextboxDimensions({ textbox: e })), !o && a && (c = El({ textbox: e }));
		let l = !1;
		return !o && t && (this.editor.canvasManager.applyObjectPlacement({
			object: e,
			placement: t
		}), l = !0), (o || s || c) && (e.dirty = !0), (o || s || c || l) && e.setCoords(), o || s || c;
	}
	_recalculateTextboxDimensions({ textbox: e }) {
		let t = e.width ?? 0, n = e.height ?? 0;
		return e.initDimensions(), Math.abs((e.width ?? 0) - t) > .01 || Math.abs((e.height ?? 0) - n) > .01;
	}
	_restoreTextboxContentPlacement({ textbox: e, contentPlacement: t }) {
		let n = Sl({
			textbox: e,
			originX: t.originX,
			originY: t.originY
		}), r = this.editor.canvasManager.getObjectPlacement({
			object: e,
			originX: "center",
			originY: "center"
		}), i = t.left - n.left, a = t.top - n.top;
		if (Math.abs(i) <= .01 && Math.abs(a) <= .01) return !1;
		let o = new p(r.left + i, r.top + a), s = e;
		return typeof s.setXY == "function" ? s.setXY(o, "center", "center") : e.setPositionByOrigin(o, "center", "center"), e.setCoords(), !0;
	}
	_bindEvents() {
		let { canvas: e } = this;
		e.on("object:scaling", this._handleObjectScaling), e.on("object:resizing", this._handleObjectResizing), e.on("object:modified", this._handleObjectModified), e.on("mouse:move", this._handleCanvasMouseMove), e.on("mouse:down", this._handleMouseDown), e.on("mouse:up", this._handleScaleInteractionFinished), e.on("object:removed", this._handleObjectRemoved), e.on("selection:created", this._handleScaleInteractionFinished), e.on("selection:updated", this._handleScaleInteractionFinished), e.on("selection:cleared", this._handleScaleInteractionFinished), e.on("text:editing:entered", this._handleTextEditingEntered), e.on("text:editing:exited", this._handleTextEditingExited), e.on("text:changed", this._handleTextChanged), window.addEventListener("pointercancel", this._handlePointerCancel), window.addEventListener("touchcancel", this._handlePointerCancel), window.addEventListener("blur", this._handleWindowBlur);
	}
	syncLineStylesWithText({ textbox: e, previousText: t, currentText: n }) {
		let r = n ?? e.text ?? "", i = gl({
			textbox: e,
			previousText: t ?? e.__lineDefaultsPrevText ?? r,
			currentText: r
		});
		i.lineFontDefaultsChanged && (e.lineFontDefaults = i.lineFontDefaults), i.stylesChanged && (e.styles = i.styles, e.dirty = !0), e.__lineDefaultsPrevText = r;
	}
	_autoExpandTextboxWidth(e, { placement: t, clampToMontage: n = !0 } = {}) {
		let { canvasManager: r, montageArea: i } = this.editor;
		if (!i) return !1;
		let a = typeof e.text == "string" ? e.text : "";
		if (!a.length) return !1;
		let { left: o, width: s } = r.getMontageAreaSceneBounds();
		if (!Number.isFinite(s) || s <= 0) return !1;
		let c = Math.abs(e.scaleX ?? 1) || 1, l = e.paddingLeft ?? 0, u = e.paddingRight ?? 0, d = e.strokeWidth ?? 0, f = Math.max(1, s / c - l - u - d);
		if (!Number.isFinite(f) || f <= 0) return !1;
		let p = a.split("\n").length, m = !1;
		Math.abs((e.width ?? 0) - f) > .01 && (e.set({ width: f }), m = !0), e.initDimensions();
		let { textLines: h } = e, g = Array.isArray(h) && h.length > p, _ = Math.ceil(bl({
			textbox: e,
			text: a
		})), v = Math.min(e.minWidth ?? 1, f), y = Math.min(f, Math.max(_, v));
		g && (y = f), Math.abs((e.width ?? 0) - y) > .01 && (e.set({ width: y }), e.initDimensions(), m = !0), El({ textbox: e }) && (m = !0), t && r.applyObjectPlacement({
			object: e,
			placement: t
		});
		let b = !1;
		return n && (b = Cl({
			textbox: e,
			montageLeft: o,
			montageRight: o + s
		})), m || b;
	}
	_ensureEditingPlacementState() {
		return this.editingPlacementState ||= /* @__PURE__ */ new WeakMap(), this.editingPlacementState;
	}
	static _getSnapshot(e) {
		let t = ({ snapshot: e, entries: t }) => {
			Object.entries(t).forEach(([t, n]) => {
				n != null && (e[t] = n);
			});
		}, { id: n, text: r, textCaseRaw: i, uppercase: a, autoExpand: o, fontFamily: s, fontSize: c, fontWeight: l, fontStyle: u, underline: d, linethrough: f, textAlign: p, fill: m, stroke: h, strokeWidth: g, opacity: _, backgroundColor: v, backgroundOpacity: y, paddingTop: b, paddingRight: x, paddingBottom: S, paddingLeft: C, radiusTopLeft: w, radiusTopRight: T, radiusBottomRight: E, radiusBottomLeft: D, left: O, top: k, width: A, height: ee, angle: te, scaleX: ne, scaleY: re } = e, ie = {
			id: n,
			uppercase: !!a,
			textAlign: p
		};
		return t({
			snapshot: ie,
			entries: {
				text: r,
				textCaseRaw: i,
				autoExpand: o,
				fontFamily: s,
				fontSize: c,
				fontWeight: l,
				fontStyle: u,
				underline: d,
				linethrough: f,
				fill: m,
				stroke: h,
				strokeWidth: g,
				opacity: _,
				backgroundColor: v,
				backgroundOpacity: y,
				paddingTop: b,
				paddingRight: x,
				paddingBottom: S,
				paddingLeft: C,
				radiusTopLeft: w,
				radiusTopRight: T,
				radiusBottomRight: E,
				radiusBottomLeft: D,
				left: O,
				top: k,
				width: A,
				height: ee,
				angle: te,
				scaleX: ne,
				scaleY: re
			}
		}), ie;
	}
	_getDefaultFontFamily() {
		return this.fonts[0]?.family ?? "Arial";
	}
};
//#endregion
//#region src/editor/utils/active-selection-serialization.ts
function Oh({ object: e, selection: t, callback: n }) {
	if (!t || e.group !== t) return n();
	let r = C.saveObjectTransform(e);
	C.addTransformToObject(e, t.calcOwnMatrix());
	try {
		return n();
	} finally {
		e.set(r);
	}
}
//#endregion
//#region src/editor/utils/gradient.ts
var kh = ({ x1: e, y1: t, x2: n, y2: r }) => (Math.atan2(r - t, n - e) * 180 / Math.PI + 360) % 360, Ah = (e) => {
	if (!e || typeof e != "object") return null;
	let { type: t, coords: n, colorStops: r } = e, i = Array.isArray(r) ? r : [], a = i[0], o = i[i.length - 1], s = typeof a?.color == "string" ? a.color : void 0, c = typeof o?.color == "string" ? o.color : s, l = typeof a?.offset == "number" ? a.offset * 100 : void 0, u = typeof o?.offset == "number" ? o.offset * 100 : void 0, d = i.map((e) => ({
		color: typeof e.color == "string" ? e.color : "#000000",
		offset: typeof e.offset == "number" ? e.offset * 100 : 0
	}));
	if (!s || !c || !n) return null;
	if (t === "linear") {
		let { x1: e, y1: t, x2: r, y2: i } = n;
		if (typeof e == "number" && typeof t == "number" && typeof r == "number" && typeof i == "number") return {
			type: "linear",
			angle: kh({
				x1: e,
				y1: t,
				x2: r,
				y2: i
			}),
			startColor: s,
			endColor: c,
			startPosition: l,
			endPosition: u,
			colorStops: d
		};
	}
	if (t === "radial") {
		let { x1: e, y1: t, r2: r } = n;
		if (typeof e == "number" && typeof t == "number" && typeof r == "number") return {
			type: "radial",
			centerX: e * 100,
			centerY: t * 100,
			radius: r * 100,
			startColor: s,
			endColor: c,
			startPosition: l,
			endPosition: u,
			colorStops: d
		};
	}
	return null;
};
//#endregion
//#region src/editor/template-manager/background.ts
function jh({ objects: e }) {
	let t = e.findIndex((e) => e.id === "background");
	return t === -1 ? {
		backgroundObject: null,
		contentObjects: e
	} : {
		backgroundObject: e[t],
		contentObjects: e.filter((e, n) => n !== t)
	};
}
function Mh(e) {
	if (!(!e || typeof e != "object")) return { ...e };
}
function Nh({ fill: e, customData: t, backgroundManager: n }) {
	return typeof e == "string" ? (n.setColorBackground({
		color: e,
		customData: t,
		fromTemplate: !0,
		withoutSave: !0
	}), !0) : !1;
}
function Ph({ fill: e, customData: t, backgroundManager: n }) {
	let r = Ah(e);
	return r ? (n.setGradientBackground({
		gradient: r,
		customData: t,
		fromTemplate: !0,
		withoutSave: !0
	}), !0) : !1;
}
function Fh({ backgroundObject: e, customData: t, backgroundManager: n }) {
	return n.setPreparedImageBackground({
		image: e,
		customData: t,
		fromTemplate: !0,
		withoutSave: !0
	}), !0;
}
function Ih({ backgroundObject: e, backgroundManager: t, errorManager: n }) {
	try {
		let { fill: n, customData: r } = e, { backgroundType: i } = e, a = Mh(r);
		if (i === "color") return Nh({
			fill: n,
			customData: a,
			backgroundManager: t
		});
		if (i === "gradient") return Ph({
			fill: n,
			customData: a,
			backgroundManager: t
		});
		if (i === "image") return Fh({
			backgroundObject: e,
			customData: a,
			backgroundManager: t
		});
	} catch (e) {
		n.emitWarning({
			origin: "TemplateManager",
			method: "applyTemplate",
			code: su.TEMPLATE_MANAGER.APPLY_FAILED,
			message: "Не удалось применить фон из шаблона",
			data: e
		});
	}
	return !1;
}
//#endregion
//#region src/editor/template-manager/image-restoration.ts
var Lh = 1e-6;
function Rh({ image: e }) {
	let t = e.getOriginalSize();
	return {
		width: R({
			value: t.width,
			fallback: e.width || 0
		}),
		height: R({
			value: t.height,
			fallback: e.height || 0
		})
	};
}
function zh(e) {
	if (!e || typeof e != "object") return !1;
	let { source: t, sourceWidth: n, sourceHeight: r } = e;
	return typeof t == "string" && t.length > 0 && typeof n == "number" && Number.isFinite(n) && n > 0 && typeof r == "number" && Number.isFinite(r) && r > 0;
}
function Bh({ imageCrop: e, originalSerialized: t, sourceSize: n }) {
	return Math.abs(e.sourceWidth - n.width) <= Lh && Math.abs(e.sourceHeight - n.height) <= Lh && e.source === t.src;
}
function Vh({ serialized: e, sourceSize: t }) {
	let n = R({
		value: e.cropX,
		fallback: 0
	}), r = R({
		value: e.cropY,
		fallback: 0
	}), i = R({
		value: e.width,
		fallback: 0
	}), a = R({
		value: e.height,
		fallback: 0
	});
	return n >= 0 && r >= 0 && i > 0 && a > 0 && n + i <= t.width + Lh && r + a <= t.height + Lh;
}
function Hh({ serialized: e, originalSerialized: t, sourceSize: n }) {
	let r = Vh({
		serialized: e,
		sourceSize: n
	}), i = e.customData?.imageCrop;
	return i !== void 0 && !zh(i) ? "replace" : zh(i) ? r && Bh({
		imageCrop: i,
		originalSerialized: t,
		sourceSize: n
	}) ? "preserve" : "replace" : e.customData?.imageFit === "crop" ? r ? "preserve" : "replace" : "none";
}
function Uh({ customData: e }) {
	return e?.imageFit === "stretch" ? "stretch" : "contain";
}
function Wh({ nextProps: e, intrinsicWidth: t, intrinsicHeight: n, targetDisplayWidth: r, targetDisplayHeight: i }) {
	let a = r > 0 ? r / t : null, o = i > 0 ? i / n : null;
	a && a > 0 && (e.scaleX = a), o && o > 0 && (e.scaleY = o);
}
function Gh({ nextProps: e, intrinsicWidth: t, intrinsicHeight: n, targetDisplayWidth: r, targetDisplayHeight: i }) {
	if (r <= 0 || i <= 0) return;
	let a = Math.min(r / t, i / n);
	!Number.isFinite(a) || a <= 0 || (e.scaleX = a, e.scaleY = a);
}
function Kh({ intrinsicWidth: e, intrinsicHeight: t, targetDisplayWidth: n, targetDisplayHeight: r }) {
	let i = {
		cropX: 0,
		cropY: 0
	};
	if (e > 0 && (i.width = e), t > 0 && (i.height = t), e <= 0 || t <= 0 || n <= 0 || r <= 0) return i;
	let a = n / r, o = e / t, s = e, c = t;
	return o > a ? (s = t * a, i.cropX = (e - s) / 2) : (c = e / a, i.cropY = (t - c) / 2), i.width = s, i.height = c, i.scaleX = n / s, i.scaleY = r / c, i;
}
function qh({ imageFit: e, cropMode: t, intrinsicWidth: n, intrinsicHeight: r, targetWidth: i, targetHeight: a, baseScaleX: o, baseScaleY: s }) {
	if (t === "preserve") return {};
	let c = i * o, l = a * s;
	if (t === "replace") return Kh({
		intrinsicWidth: n,
		intrinsicHeight: r,
		targetDisplayWidth: c,
		targetDisplayHeight: l
	});
	let u = {
		cropX: 0,
		cropY: 0
	};
	if (n > 0 && (u.width = n), r > 0 && (u.height = r), n <= 0 || r <= 0) return u;
	let d = {
		nextProps: u,
		intrinsicWidth: n,
		intrinsicHeight: r,
		targetDisplayWidth: c,
		targetDisplayHeight: l
	};
	return e === "stretch" ? Wh(d) : Gh(d), u;
}
function Jh({ image: e, serialized: t, originalSerialized: n }) {
	let r = Rh({ image: e }), i = R({
		value: t.width,
		fallback: r.width
	}), a = R({
		value: t.height,
		fallback: r.height
	}), o = R({
		value: t.scaleX,
		fallback: e.scaleX || 1
	}), s = R({
		value: t.scaleY,
		fallback: e.scaleY || 1
	});
	return {
		nextProps: qh({
			imageFit: Uh({ customData: t.customData }),
			cropMode: Hh({
				serialized: t,
				originalSerialized: n,
				sourceSize: r
			}),
			intrinsicWidth: r.width,
			intrinsicHeight: r.height,
			targetWidth: i,
			targetHeight: a,
			baseScaleX: o,
			baseScaleY: s
		}),
		targetWidth: i,
		targetHeight: a,
		baseScaleX: o,
		baseScaleY: s,
		hasIntrinsicSize: r.width > 0 && r.height > 0
	};
}
function Yh({ image: e }) {
	let { customData: t } = e;
	if (!t || typeof t != "object") return;
	let n = t;
	if (!("imageCrop" in n) && !("imageFit" in n)) return;
	let r = { ...n };
	delete r.imageCrop, delete r.imageFit, e.set({ customData: Object.keys(r).length > 0 ? r : void 0 });
}
function Xh({ image: e, serialized: t, baseWidth: n, baseHeight: r, useRelativePositions: i }) {
	let a = R({
		value: t.left,
		fallback: e.left || 0
	}), o = R({
		value: t.top,
		fallback: e.top || 0
	});
	return i ? {
		x: a * (n || 1),
		y: o * (r || 1)
	} : {
		x: a,
		y: o
	};
}
function Zh({ image: e, serialized: t, plan: n, baseWidth: r, baseHeight: i, useRelativePositions: a }) {
	let o = {
		left: e.left,
		top: e.top,
		width: e.width,
		height: e.height,
		scaleX: e.scaleX,
		scaleY: e.scaleY
	}, s = Xh({
		image: e,
		serialized: t,
		baseWidth: r,
		baseHeight: i,
		useRelativePositions: a
	});
	e.set({
		left: s.x,
		top: s.y,
		width: n.targetWidth,
		height: n.targetHeight,
		scaleX: n.baseScaleX,
		scaleY: n.baseScaleY
	});
	let c = e.getPointByOrigin("center", "center");
	return e.set(o), {
		x: c.x,
		y: c.y
	};
}
function Qh({ image: e, center: t, baseWidth: n, baseHeight: r, useRelativePositions: i }) {
	e.setPositionByOrigin(new p(t.x, t.y), "center", "center"), i && e.set({
		left: R({
			value: e.left,
			fallback: 0
		}) / (n || 1),
		top: R({
			value: e.top,
			fallback: 0
		}) / (r || 1)
	});
}
function $h({ revived: e, serialized: t, originalSerialized: n, baseWidth: r, baseHeight: i, useRelativePositions: a }) {
	if ((typeof e.type == "string" ? e.type.toLowerCase() : "") !== "image") return;
	let o = e, s = Jh({
		image: o,
		serialized: t,
		originalSerialized: n
	});
	if (!s.hasIntrinsicSize) {
		o.set(s.nextProps), Yh({ image: o });
		return;
	}
	let c = Zh({
		image: o,
		serialized: t,
		plan: s,
		baseWidth: r,
		baseHeight: i,
		useRelativePositions: a
	});
	o.set(s.nextProps), Qh({
		image: o,
		center: c,
		baseWidth: r,
		baseHeight: i,
		useRelativePositions: a
	}), Yh({ image: o });
}
function eg({ object: e, serialized: t }) {
	if ((typeof e.type == "string" ? e.type.toLowerCase() : "") !== "image") return;
	let n = e, r = { ...t.customData }, i = R({
		value: t.scaleX,
		fallback: n.scaleX ?? 1
	}), a = R({
		value: t.scaleY,
		fallback: n.scaleY ?? 1
	});
	if (delete r.imageCrop, delete r.imageFit, Math.abs(i - a) > Lh && (r.imageFit = "stretch"), n.hasCrop()) {
		let e = Rh({ image: n });
		typeof t.src == "string" && t.src.length > 0 && e.width > 0 && e.height > 0 && (r.imageCrop = {
			source: t.src,
			sourceWidth: e.width,
			sourceHeight: e.height
		});
	}
	Object.keys(r).length > 0 ? t.customData = r : delete t.customData;
}
//#endregion
//#region src/editor/template-manager/index.ts
var tg = "_templateAnchorX", ng = "_templateAnchorY", rg = class t {
	constructor({ editor: e }) {
		this.editor = e;
	}
	serializeSelection({ templateId: n, previewId: r, meta: i = {}, withBackground: a = !1 } = {}) {
		let { canvas: o, montageArea: s, errorManager: c, backgroundManager: l } = this.editor, u = o.getActiveObject(), d = t._collectObjects(u), { backgroundObject: f } = l ?? {}, p = a && f ? [f] : [], m = [...d, ...p];
		if (!m.length) return c.emitWarning({
			origin: "TemplateManager",
			method: "serializeSelection",
			code: su.TEMPLATE_MANAGER.NO_OBJECTS_SELECTED,
			message: "Нет объектов для сериализации шаблона"
		}), null;
		let h = t._getBounds(s), g = t._getMontageSize({
			montageArea: s,
			bounds: h
		}), _ = g.width, v = g.height, y = u instanceof e ? u : null, b = m.map((e) => this._serializeObject({
			object: e,
			activeSelection: y,
			bounds: h,
			baseWidth: _,
			baseHeight: v
		})), x = typeof i.previewId == "string" ? i.previewId : void 0, S = {
			...i,
			baseWidth: _,
			baseHeight: v,
			positionsNormalized: !0,
			previewId: r ?? x
		};
		return {
			id: n ?? `template-${E()}`,
			meta: S,
			objects: b
		};
	}
	async applyTemplate({ template: e }) {
		let { montageArea: n, historyManager: r, errorManager: i, backgroundManager: a, imageManager: o } = this.editor, s = t._resolveApplyTemplateContext({
			template: e,
			montageArea: n,
			errorManager: i
		});
		if (!s) return null;
		let { templateId: c, meta: l, scale: u, montageBounds: d, useRelativePositions: f } = s, p = !1;
		r.suspendHistory();
		try {
			let n = await t._prepareTemplateObjectsForApply({
				template: e,
				imageManager: o,
				baseWidth: l.baseWidth,
				baseHeight: l.baseHeight,
				useRelativePositions: f,
				errorManager: i
			});
			if (!n) return null;
			let r = this._applyPreparedTemplateObjects({
				preparedTemplateObjects: n,
				template: e,
				backgroundManager: a,
				errorManager: i,
				scale: u,
				montageBounds: d,
				baseWidth: l.baseWidth,
				baseHeight: l.baseHeight,
				useRelativePositions: f
			});
			return r ? (p = r.shouldSaveHistory, r.insertedObjects) : null;
		} catch (e) {
			return i.emitError({
				origin: "TemplateManager",
				method: "applyTemplate",
				code: su.TEMPLATE_MANAGER.APPLY_FAILED,
				message: "Ошибка применения шаблона",
				data: {
					templateId: c,
					error: e
				}
			}), null;
		} finally {
			r.resumeHistory(), p && r.saveState();
		}
	}
	_applyPreparedTemplateObjects({ preparedTemplateObjects: e, template: n, backgroundManager: r, errorManager: i, scale: a, montageBounds: o, baseWidth: s, baseHeight: c, useRelativePositions: l }) {
		let { canvas: u } = this.editor, d = !1;
		e.backgroundObject && (d = Ih({
			backgroundObject: e.backgroundObject,
			backgroundManager: r,
			errorManager: i
		}));
		let f = this._insertTemplateContentObjects({
			objects: e.contentObjects,
			scale: a,
			bounds: o,
			baseWidth: s,
			baseHeight: c,
			useRelativePositions: l
		});
		return !f.length && !d ? null : (f.length && t._activateObjects({
			canvas: u,
			objects: f
		}), u.requestRenderAll(), u.fire("editor:template-applied", {
			template: n,
			objects: f,
			bounds: o
		}), {
			insertedObjects: f,
			shouldSaveHistory: f.length > 0 || d
		});
	}
	static _resolveApplyTemplateContext({ template: e, montageArea: n, errorManager: r }) {
		let { objects: i, meta: a, id: o } = e ?? {};
		if (!i?.length) return r.emitWarning({
			origin: "TemplateManager",
			method: "applyTemplate",
			code: su.TEMPLATE_MANAGER.INVALID_TEMPLATE,
			message: "Шаблон не содержит объектов"
		}), null;
		let s = t._getBounds(n);
		if (!s) return r.emitWarning({
			origin: "TemplateManager",
			method: "applyTemplate",
			code: su.TEMPLATE_MANAGER.INVALID_TARGET,
			message: "Не удалось определить границы монтажной области"
		}), null;
		let c = t._getMontageSize({
			montageArea: n,
			bounds: s
		}), l = t._normalizeMeta({
			meta: a,
			fallback: c
		});
		return {
			templateId: o,
			meta: l,
			scale: t._calculateScale({
				meta: l,
				target: c
			}),
			montageBounds: s,
			useRelativePositions: !!l.positionsNormalized
		};
	}
	_insertTemplateContentObjects({ objects: e, scale: t, bounds: n, baseWidth: r, baseHeight: i, useRelativePositions: a }) {
		let { canvas: o, shapeManager: s, textManager: c } = this.editor;
		return e.map((e) => {
			let l = e instanceof _ ? e : null, u = !1;
			l && (u = l.preserveExactTextGeometry === !0 || t !== 1 || (l.scaleX ?? 1) !== 1 || (l.scaleY ?? 1) !== 1);
			let d = l?.shouldRoundDimensionsOnInit;
			l && u && (l.shouldRoundDimensionsOnInit = !1);
			try {
				l?.preserveExactTextGeometry !== !0 && this._adaptTextboxWidth({
					object: e,
					baseWidth: r
				});
			} finally {
				l && (l.shouldRoundDimensionsOnInit = d);
			}
			return this._transformObject({
				object: e,
				scale: t,
				bounds: n,
				baseWidth: r,
				baseHeight: i,
				useRelativePositions: a
			}), u ? c.commitStandaloneTextScale({
				target: e,
				shouldRoundDimensions: !1
			}) : c.commitStandaloneTextScale({ target: e }), s.commitRehydratedShapeLayout({
				target: e,
				textScale: t
			}), ru({ rootObject: e }), o.add(e), e;
		});
	}
	static _collectObjects(t) {
		return t ? t instanceof e ? t.getObjects() : [t] : [];
	}
	static _getBounds(e) {
		if (!e) return null;
		try {
			e.setCoords();
			let n = t._getBoundingRect(e);
			return {
				left: n.left,
				top: n.top,
				width: n.width,
				height: n.height
			};
		} catch {
			return null;
		}
	}
	static _getBoundingRect(e) {
		return e.getBoundingRect(!1, !0);
	}
	static async _enlivenObjects({ objects: e, originalObjects: n, baseWidth: r, baseHeight: i, useRelativePositions: a }) {
		return (await Promise.all(e.map(async (e, o) => {
			let s = n[o] ?? e;
			if (t._hasSerializedSvgMarkup(e)) {
				let n = await t._reviveSvgObject(e);
				if (n) return $h({
					revived: n,
					serialized: e,
					originalSerialized: s,
					baseWidth: r,
					baseHeight: i,
					useRelativePositions: a
				}), n;
			}
			let c = (await C.enlivenObjects([e]))?.[0];
			return c ? ($h({
				revived: c,
				serialized: e,
				originalSerialized: s,
				baseWidth: r,
				baseHeight: i,
				useRelativePositions: a
			}), c) : null;
		}))).filter((e) => !!e);
	}
	static async _prepareTemplateObjectsForApply({ template: e, imageManager: n, baseWidth: r, baseHeight: i, useRelativePositions: a, errorManager: o }) {
		let s = await n.prepareSerializedImageSources({ state: e }), c = Array.isArray(s.objects) ? s.objects : [], l = await t._enlivenObjects({
			objects: c,
			originalObjects: e.objects,
			baseWidth: r,
			baseHeight: i,
			useRelativePositions: a
		});
		if (!l.length) return o.emitWarning({
			origin: "TemplateManager",
			method: "applyTemplate",
			code: su.TEMPLATE_MANAGER.INVALID_TEMPLATE,
			message: "Не удалось создать объекты шаблона"
		}), null;
		let { backgroundObject: u, contentObjects: d } = jh({ objects: l });
		return {
			backgroundObject: u,
			contentObjects: d
		};
	}
	static _hasSerializedSvgMarkup(e) {
		return typeof e.svgMarkup == "string" && !!e.svgMarkup.trim();
	}
	static async _reviveSvgObject(e) {
		let n = typeof e.svgMarkup == "string" ? e.svgMarkup : null;
		if (!n) return null;
		try {
			let r = await x(n), i = C.groupSVGElements(r.objects, r.options), a = await C.enlivenObjectEnlivables(t._prepareSerializableProps(e));
			return i.set(a), i.setCoords(), i;
		} catch {
			return null;
		}
	}
	static _prepareSerializableProps(e) {
		let t = { ...e };
		return delete t.svgMarkup, delete t.objects, delete t.path, delete t.paths, delete t.type, delete t.version, t;
	}
	static _isSvgObject(e) {
		return e.format === "svg";
	}
	static _extractSvgMarkup(e) {
		let n = e.toSVG;
		if (typeof n != "function") return null;
		try {
			let r = n.call(e);
			if (!r) return null;
			if (/<svg[\s>]/i.test(r)) return r;
			let { width: i, height: a } = t._getBoundingRect(e), o = i || e.width || 0, s = a || e.height || 0;
			return `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${o}"
          height="${s}"
          viewBox="0 0 ${o} ${s}">
            ${r}
        </svg>
      `;
		} catch {
			return null;
		}
	}
	_transformObject({ object: e, scale: n, bounds: r, baseWidth: i, baseHeight: a, useRelativePositions: o }) {
		let s = e, { x: c, y: l } = Sr({
			object: e,
			baseWidth: i,
			baseHeight: a,
			useRelativePositions: o
		}), { scaleX: u, scaleY: d } = e, f = R({
			value: u,
			fallback: 1
		}), p = R({
			value: d,
			fallback: 1
		}), m = Cr({
			normalizedX: c,
			normalizedY: l,
			bounds: t._getPositioningBounds({
				bounds: r,
				baseWidth: i,
				baseHeight: a,
				scale: n,
				useRelativePositions: o,
				anchorX: t._resolveAnchor(s, tg),
				anchorY: t._resolveAnchor(s, ng)
			})
		}), h = f * n, g = p * n, _ = e.originX ?? "center", v = e.originY ?? "center";
		e.set({
			scaleX: h,
			scaleY: g
		}), this.editor.canvasManager.applyObjectPlacement({
			object: e,
			placement: {
				left: m.x,
				top: m.y,
				originX: _,
				originY: v
			}
		}), delete s._templateAnchorX, delete s._templateAnchorY;
	}
	static _getPositioningBounds({ bounds: e, baseWidth: n, baseHeight: r, scale: i, useRelativePositions: a, anchorX: o, anchorY: s }) {
		if (!a) return e;
		let c = (n || e.width) * i, l = (r || e.height) * i, u = e.width - c, d = e.height - l;
		return {
			left: e.left + t._calculateAnchorOffset(o, u),
			top: e.top + t._calculateAnchorOffset(s, d),
			width: c,
			height: l
		};
	}
	static _calculateAnchorOffset(e, t) {
		return t <= 0 ? 0 : e === "end" ? t : e === "center" ? t / 2 : 0;
	}
	static _resolveAnchor(e, t) {
		let n = e[t];
		return n === "center" || n === "end" || n === "start" ? n : "start";
	}
	static _detectAnchor({ start: e, end: t }) {
		let n = e <= .05, r = t >= .95, i = e < 0, a = t > 1, o = t - e, s = Math.max(0, e), c = Math.max(0, 1 - t), l = Math.abs(s - c) <= .02;
		if (n && r || i && a) return l || o >= .9 ? "center" : s <= c ? "start" : "end";
		if (n || i) return "start";
		if (r || a) return "end";
		let u = s - c;
		return Math.abs(u) <= .1 ? "center" : u < 0 ? "start" : "end";
	}
	static _normalizeMeta({ meta: e, fallback: t }) {
		let { width: n, height: r } = t, { baseWidth: i = n, baseHeight: a = r, ...o } = e || {};
		return {
			baseWidth: i,
			baseHeight: a,
			...o
		};
	}
	static _calculateScale({ meta: e, target: t }) {
		let { width: n, height: r } = t, { baseWidth: i, baseHeight: a } = e, o = n / (i || n || 1), s = r / (a || r || 1);
		return Math.min(o, s);
	}
	static _activateObjects({ canvas: t, objects: n }) {
		if (!n.length) return;
		if (t.discardActiveObject(), n.length === 1) {
			t.setActiveObject(n[0]);
			return;
		}
		let r = new e(n, { canvas: t });
		t.setActiveObject(r);
	}
	_adaptTextboxWidth({ object: e, baseWidth: n }) {
		if (!(e instanceof _)) return;
		let r = typeof e.text == "string" ? e.text : "";
		if (!r) return;
		let i = R({
			value: n,
			fallback: 0
		}), a = R({
			value: e.width,
			fallback: 0
		});
		if (!i || !a) return;
		e.setCoords();
		let o = e, s = t._resolveAnchor(o, tg), c = typeof e.left == "number" ? e.left : null, l = e.originX ?? "center", u = e.originY ?? "center", d = e.getPointByOrigin(l, u), f = t._getBoundingRect(e), p = f.left + f.width / 2, m = f.left + f.width;
		e.set("width", i), e.initDimensions();
		let h = t._getLongestLineWidth({
			textbox: e,
			text: r
		}), g = h > a ? h + 1 : a;
		if (e.set("width", g), e.initDimensions(), e.setPositionByOrigin(d, l, u), e.setCoords(), c === null) return;
		let v = t._getBoundingRect(e), y = v.left + v.width / 2, b = v.left + v.width, x = c;
		s === "start" ? x += (f.left - v.left) / i : s === "center" ? x += (p - y) / i : s === "end" && (x += (m - b) / i), e.left = x;
	}
	static _getLongestLineWidth({ textbox: e, text: t }) {
		let { textLines: n } = e, r = Array.isArray(n) && n.length > 0 ? n.length : Math.max(t.split("\n").length, 1), i = 0;
		for (let t = 0; t < r; t += 1) {
			let n = e.getLineWidth(t);
			n > i && (i = n);
		}
		return i;
	}
	_serializeObject({ object: e, activeSelection: n, bounds: r, baseWidth: i, baseHeight: a }) {
		let o = Oh({
			object: e,
			selection: n,
			callback: () => {
				let t = e.toDatalessObject([...At]);
				return Object.assign(t, {
					angle: e.angle,
					height: e.height,
					left: e.left,
					scaleX: e.scaleX,
					scaleY: e.scaleY,
					skewX: e.skewX,
					skewY: e.skewY,
					strokeWidth: e.strokeWidth,
					top: e.top,
					width: e.width
				}), t;
			}
		});
		if (eg({
			object: e,
			serialized: o
		}), t._isSvgObject(e)) {
			let n = t._extractSvgMarkup(e);
			n && (o.svgMarkup = n, delete o.objects, delete o.path);
		}
		return this._applySerializedObjectPlacement({
			object: e,
			activeSelection: n,
			serialized: o,
			bounds: r,
			baseWidth: i,
			baseHeight: a
		}), o;
	}
	_applySerializedObjectPlacement({ object: e, activeSelection: n, serialized: r, bounds: i, baseWidth: a, baseHeight: o }) {
		if (!i) return;
		let { left: s, top: c, width: l, height: u } = i, d = t._getBoundingRect(e), f = a || l || 1, p = o || u || 1, m = this.editor.canvasManager.getObjectPlacement({ object: e }), h = n && e.group === n, g = h ? R({
			value: r.left,
			fallback: m.left
		}) : m.left, _ = h ? R({
			value: r.top,
			fallback: m.top
		}) : m.top, v = {
			x: (g - s) / f,
			y: (_ - c) / p
		}, y = (d.left - s) / f, b = (d.top - c) / p, x = y + d.width / f, S = b + d.height / p;
		r[tg] = t._detectAnchor({
			start: y,
			end: x
		}), r[ng] = t._detectAnchor({
			start: b,
			end: S
		}), r.left = v.x, r.top = v.y;
	}
	static _getMontageSize({ montageArea: e, bounds: t }) {
		let n = t?.width || 0, r = t?.height || 0;
		return e ? {
			width: e.getScaledWidth?.() || e.width || n,
			height: e.getScaledHeight?.() || e.height || r
		} : {
			width: n,
			height: r
		};
	}
	enlivenObjectEnlivables(e) {
		return C.enlivenObjectEnlivables(e);
	}
}, ig = ({ anchors: e, positions: t, threshold: n }) => {
	let r = 0, i = n + 1, a = null;
	for (let o of t) for (let t of e) {
		let e = Math.abs(t - o);
		e > n || e >= i || (r = t - o, i = e, a = t);
	}
	return {
		delta: r,
		guidePosition: a
	};
}, ag = ({ activeBounds: e, threshold: t, anchors: n }) => {
	let { left: r, right: i, centerX: a, top: o, bottom: s, centerY: c } = e, l = ig({
		anchors: n.vertical,
		positions: [
			r,
			a,
			i
		],
		threshold: t
	}), u = ig({
		anchors: n.horizontal,
		positions: [
			o,
			c,
			s
		],
		threshold: t
	}), d = [];
	return l.guidePosition !== null && d.push({
		type: "vertical",
		position: l.guidePosition
	}), u.guidePosition !== null && d.push({
		type: "horizontal",
		position: u.guidePosition
	}), {
		deltaX: l.delta,
		deltaY: u.delta,
		guides: d
	};
}, og = ({ distance: e }) => {
	if (!Number.isFinite(e)) throw Error("Display distance must be finite");
	return Math.round(Math.max(0, e));
}, sg = 1e-9, cg = ({ firstStart: e, firstEnd: t, secondStart: n, secondEnd: r }) => Math.min(t, r) - Math.max(e, n), lg = ({ bounds: e, axis: t }) => {
	let { left: n = 0, right: r = 0, top: i = 0, bottom: a = 0 } = e;
	return t === "vertical" ? {
		start: i,
		end: a
	} : {
		start: n,
		end: r
	};
}, ug = ({ items: e, axis: t }) => {
	for (let n = 1; n < e.length; n += 1) {
		let r = e[n], { bounds: i } = r, a = i[t], o = n - 1;
		for (; o >= 0;) {
			let n = e[o], { bounds: r } = n;
			if (r[t] <= a) break;
			e[o + 1] = n, --o;
		}
		e[o + 1] = r;
	}
}, dg = ({ items: e, index: t, axis: n, direction: r }) => {
	let i = e[t];
	if (!i) return null;
	let { bounds: a } = i, { start: o, end: s } = lg({
		bounds: a,
		axis: n
	});
	if (r === "prev") {
		for (let r = t - 1; r >= 0; --r) {
			let t = e[r];
			if (!t) continue;
			let { bounds: i } = t, { end: a } = lg({
				bounds: i,
				axis: n
			});
			if (o - a >= 0) return r;
		}
		return null;
	}
	for (let r = t + 1; r < e.length; r += 1) {
		let t = e[r];
		if (!t) continue;
		let { bounds: i } = t, { start: a } = lg({
			bounds: i,
			axis: n
		});
		if (a - s >= 0) return r;
	}
	return null;
}, fg = ({ items: e }) => {
	for (let t = 0; t < e.length; t += 1) {
		let { isActive: n } = e[t];
		if (n) return t;
	}
	return -1;
}, pg = ({ patternAxis: e, activeRangeStart: t, activeRangeEnd: n, tolerance: r = 0 }) => {
	let i = Math.min(t, n), a = Math.max(t, n);
	return e >= i - r && e <= a + r;
}, mg = ({ patternStart: e, patternEnd: t, activeStart: n, activeEnd: r }) => t <= n ? "before" : e >= r ? "after" : null, hg = ({ baseOption: e, candidateOption: t }) => {
	let { delta: n, guide: { distance: r } } = e, { delta: i, guide: { distance: a } } = t;
	return Math.abs(n - i) <= sg && r === a;
}, gg = ({ options: e }) => {
	let t = e[0];
	for (let n = 1; n < e.length; n += 1) {
		let r = e[n];
		if (r.diff < t.diff) {
			t = r;
			continue;
		}
		r.diff === t.diff && Math.abs(r.delta) < Math.abs(t.delta) && (t = r);
	}
	return t;
}, _g = ({ currentOption: e, nextOption: t }) => {
	if (!e) return !0;
	let { contextDistance: n, diff: r, delta: i } = e, { contextDistance: a, diff: o, delta: s } = t;
	return a < n ? !0 : a > n ? !1 : o < r ? !0 : o > r ? !1 : Math.abs(s) < Math.abs(i);
}, vg = ({ options: e }) => {
	let t = [], n = null, r = null;
	for (let i of e) {
		let { kind: e, side: a } = i;
		if (e !== "reference") {
			t.push(i);
			continue;
		}
		a === "before" && _g({
			currentOption: n,
			nextOption: i
		}) && (n = i), a === "after" && _g({
			currentOption: r,
			nextOption: i
		}) && (r = i);
	}
	return n && t.push(n), r && t.push(r), t;
}, yg = ({ options: e, side: t, baseOption: n }) => {
	let r = null;
	for (let i of e) if (i.side === t && hg({
		baseOption: n,
		candidateOption: i
	})) {
		if (!r || i.diff < r.diff) {
			r = i;
			continue;
		}
		!r || i.diff !== r.diff || Math.abs(i.delta) < Math.abs(r.delta) && (r = i);
	}
	return r;
}, bg = ({ option: e }) => {
	let { side: t, kind: n, guide: { distance: r } } = e;
	return {
		side: t,
		kind: n,
		distance: r
	};
}, xg = ({ option: e, context: t }) => {
	let { side: n, kind: r, distance: i } = t, { side: a, kind: o, guide: { distance: s } } = e;
	return n !== a || r !== o ? !1 : Math.abs(s - i) <= 0;
}, Sg = ({ options: e, context: t }) => {
	if (!t) return null;
	for (let n of e) if (xg({
		option: n,
		context: t
	})) return n;
	return null;
}, Cg = ({ options: e, bestOption: t, previousContext: n, switchDistance: r = 0 }) => {
	let i = Sg({
		options: e,
		context: n
	});
	if (!i) return t;
	let a = Math.max(0, r);
	return a === 0 || Math.abs(t.delta - i.delta) >= a ? t : i;
}, wg = ({ guide: e }) => {
	let { type: t, axis: n, refStart: r, refEnd: i, activeStart: a, activeEnd: o, distance: s } = e;
	return `${t}:${n}:${r}:${i}:${a}:${o}:${s}`;
}, Tg = ({ guides: e, seenGuideKeys: t, guide: n }) => {
	let r = wg({ guide: n });
	t.has(r) || (t.add(r), e.push(n));
}, Eg = ({ resolvedOptions: e, prioritizedOptions: t, primaryOption: n, hasReferenceOptions: r }) => {
	let i = yg({
		options: t,
		side: "before",
		baseOption: n
	}), a = yg({
		options: t,
		side: "after",
		baseOption: n
	}), o = yg({
		options: r ? e : t,
		side: "center",
		baseOption: n
	});
	if (i && a) return [i, a];
	let s = [n];
	return n.side === "before" && a && s.push(a), n.side === "after" && i && s.push(i), n.side === "center" && i && s.push(i), n.side === "center" && a && s.push(a), r && n.side !== "center" && o && s.push(o), s;
}, Dg = ({ selectedOptions: e }) => {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) Tg({
		guides: t,
		seenGuideKeys: n,
		guide: r.guide
	});
	return t;
}, Og = ({ selectedOptions: e, primaryOption: t }) => e.map((e) => ({
	guide: e.guide,
	identity: e.identity,
	isPrimary: e === t
})), kg = ({ options: e, previousContext: t = null, switchDistance: n = 0 }) => {
	if (!e.length) return {
		delta: 0,
		guides: [],
		context: null,
		selections: []
	};
	let r = vg({ options: e }), i = [];
	for (let e of r) e.kind === "reference" && i.push(e);
	let a = i.length > 0, o = a ? i : r, s = Cg({
		options: o,
		bestOption: gg({ options: o }),
		previousContext: t,
		switchDistance: n
	}), c = Eg({
		resolvedOptions: r,
		prioritizedOptions: o,
		primaryOption: s,
		hasReferenceOptions: a
	});
	return {
		delta: s.delta,
		guides: Dg({ selectedOptions: c }),
		context: bg({ option: s }),
		selections: Og({
			selectedOptions: c,
			primaryOption: s
		})
	};
}, Ag = ({ bounds: e, axis: t }) => {
	let { left: n, right: r, top: i, bottom: a, centerX: o, centerY: s } = e;
	return t === "vertical" ? {
		start: i,
		end: a,
		crossStart: n,
		crossEnd: r,
		guideAxis: o
	} : {
		start: n,
		end: r,
		crossStart: i,
		crossEnd: a,
		guideAxis: s
	};
}, jg = ({ kind: e, side: t, before: n = null, after: r = null, pattern: i = null }) => ({
	kind: e,
	side: t,
	before: n ? { ...n } : null,
	after: r ? { ...r } : null,
	pattern: i ? { ...i } : null
}), Mg = ({ activeGeometry: e, candidateBounds: t, axis: n }) => {
	let r = Ag({
		bounds: t,
		axis: n
	});
	return cg({
		firstStart: e.crossStart,
		firstEnd: e.crossEnd,
		secondStart: r.crossStart,
		secondEnd: r.crossEnd
	}) > 0;
}, Ng = ({ activeBounds: e, candidates: t, axis: n }) => {
	let r = Ag({
		bounds: e,
		axis: n
	}), i = [];
	for (let e of t) Mg({
		activeGeometry: r,
		candidateBounds: e,
		axis: n
	}) && i.push({
		bounds: e,
		isActive: !1
	});
	if (!i.length) return null;
	i.push({
		bounds: e,
		isActive: !0
	}), ug({
		items: i,
		axis: n === "vertical" ? "top" : "left"
	});
	let a = fg({ items: i });
	if (a === -1) return null;
	let o = dg({
		items: i,
		index: a,
		axis: n,
		direction: "prev"
	}), s = dg({
		items: i,
		index: a,
		axis: n,
		direction: "next"
	});
	return {
		before: o === null ? null : i[o].bounds,
		after: s === null ? null : i[s].bounds
	};
}, Pg = ({ first: e, second: t }) => !e || !t ? e === t : e.left === t.left && e.right === t.right && e.top === t.top && e.bottom === t.bottom && e.centerX === t.centerX && e.centerY === t.centerY, Fg = ({ selection: e, activeBounds: t, candidates: n, tolerance: r }) => {
	let { identity: i, guide: a } = e, o = Ng({
		activeBounds: t,
		candidates: n,
		axis: a.type
	});
	if (!o) return !1;
	if (i.kind === "center") return i.side === "center" && Pg({
		first: o.before,
		second: i.before
	}) && Pg({
		first: o.after,
		second: i.after
	});
	let s = i.side === "before" ? i.before : i.after;
	if (!Pg({
		first: i.side === "before" ? o.before : o.after,
		second: s
	})) return !1;
	let { pattern: c } = i;
	if (!c || c.type !== a.type || i.side === "center") return !1;
	let l = Ag({
		bounds: t,
		axis: a.type
	});
	return mg({
		patternStart: c.start,
		patternEnd: c.end,
		activeStart: l.start,
		activeEnd: l.end
	}) === i.side ? pg({
		patternAxis: c.axis,
		activeRangeStart: l.crossStart,
		activeRangeEnd: l.crossEnd,
		tolerance: r
	}) : !1;
}, Ig = ({ activeStart: e, activeEnd: t, beforeEdge: n, afterEdge: r, threshold: i }) => {
	let a = t - e, o = r - n - a;
	if (o < 0) return null;
	let s = o / 2, c = (n + r - (e + t)) / 2;
	return Math.abs(c) > i ? null : {
		delta: c,
		distance: og({ distance: s }),
		diff: 0,
		activeStart: e + c,
		activeEnd: t + c
	};
}, Lg = ({ activeBounds: e, neighbors: t, axis: n, threshold: r }) => {
	let { before: i, after: a } = t;
	if (!i || !a) return null;
	let o = Ag({
		bounds: e,
		axis: n
	}), s = Ag({
		bounds: i,
		axis: n
	}), c = Ag({
		bounds: a,
		axis: n
	}), l = c.start - s.end - (o.end - o.start);
	if (l < 0) return null;
	let u = l / 2;
	if (Math.max(Math.abs(o.start - s.end - u), Math.abs(c.start - o.end - u)) > r) return null;
	let d = Ig({
		activeStart: o.start,
		activeEnd: o.end,
		beforeEdge: s.end,
		afterEdge: c.start,
		threshold: r
	});
	return d ? {
		delta: d.delta,
		guide: {
			type: n,
			axis: o.guideAxis,
			refStart: s.end,
			refEnd: d.activeStart,
			activeStart: d.activeEnd,
			activeEnd: c.start,
			distance: d.distance
		},
		diff: d.diff,
		side: "center",
		kind: "center",
		contextDistance: 0,
		identity: jg({
			kind: "center",
			side: "center",
			before: i,
			after: a
		})
	} : null;
}, Rg = ({ currentGap: e, referenceGap: t, gapDirection: n, activeStart: r, activeEnd: i, threshold: a }) => {
	if (e < 0 || t < 0 || Math.abs(e - t) > a) return null;
	let o = t - e, s = o === 0 ? 0 : o / n;
	if (Math.abs(s) > a) return null;
	let c = e + s * n;
	return {
		delta: s,
		distance: og({ distance: t }),
		diff: Math.abs(c - t),
		adjustedStart: r + s,
		adjustedEnd: i + s
	};
}, zg = ({ active: e, neighbor: t, neighborBounds: n, pattern: r, candidate: i, axis: a, side: o }) => {
	let s = o === "before" ? t.end : i.adjustedEnd, c = o === "before" ? i.adjustedStart : t.start, l = o === "before" ? e.start - r.end : r.start - e.end;
	return {
		delta: i.delta,
		guide: {
			type: a,
			axis: e.guideAxis,
			refStart: r.start,
			refEnd: r.end,
			activeStart: s,
			activeEnd: c,
			distance: i.distance
		},
		diff: i.diff,
		side: o,
		kind: "reference",
		contextDistance: l,
		identity: jg({
			kind: "reference",
			side: o,
			before: o === "before" ? n : null,
			after: o === "after" ? n : null,
			pattern: r
		})
	};
}, Bg = ({ activeBounds: e, neighbors: t, pattern: n, axis: r, threshold: i }) => {
	if (n.type !== r) return null;
	let a = Ag({
		bounds: e,
		axis: r
	});
	if (!pg({
		patternAxis: n.axis,
		activeRangeStart: a.crossStart,
		activeRangeEnd: a.crossEnd,
		tolerance: i
	})) return null;
	let o = mg({
		patternStart: n.start,
		patternEnd: n.end,
		activeStart: a.start,
		activeEnd: a.end
	});
	if (!o) return null;
	let s = o === "before" ? t.before : t.after;
	if (!s) return null;
	let c = Ag({
		bounds: s,
		axis: r
	}), l = o === "before" ? a.start - c.end : c.start - a.end, u = o === "before" ? 1 : -1, d = Rg({
		currentGap: l,
		referenceGap: n.distance,
		gapDirection: u,
		activeStart: a.start,
		activeEnd: a.end,
		threshold: i
	});
	return d ? zg({
		active: a,
		neighbor: c,
		neighborBounds: s,
		pattern: n,
		candidate: d,
		axis: r,
		side: o
	}) : null;
}, Vg = ({ activeBounds: e, neighbors: t, patterns: n, axis: r, threshold: i }) => {
	let a = [], o = Lg({
		activeBounds: e,
		neighbors: t,
		axis: r,
		threshold: i
	});
	o && a.push(o);
	for (let o of n) {
		let n = Bg({
			activeBounds: e,
			neighbors: t,
			pattern: o,
			axis: r,
			threshold: i
		});
		n && a.push(n);
	}
	return a;
}, Hg = ({ activeBounds: e, candidates: t, threshold: n, patterns: r, previousContext: i = null, switchDistance: a = 0, axis: o }) => {
	let s = Ng({
		activeBounds: e,
		candidates: t,
		axis: o
	});
	return s ? kg({
		options: Vg({
			activeBounds: e,
			neighbors: s,
			patterns: r,
			axis: o,
			threshold: n
		}),
		previousContext: i,
		switchDistance: a
	}) : {
		delta: 0,
		guides: [],
		context: null,
		selections: []
	};
}, Ug = (e) => Hg({
	...e,
	axis: "vertical"
}), Wg = (e) => Hg({
	...e,
	axis: "horizontal"
}), Gg = ({ activeBounds: e, candidates: t, threshold: n, spacingPatterns: r, previousContexts: i, switchDistance: a = 0 }) => {
	let { vertical: o = null, horizontal: s = null } = i ?? {}, c = Ug({
		activeBounds: e,
		candidates: t,
		threshold: n,
		patterns: r.vertical,
		previousContext: o,
		switchDistance: a
	}), l = Wg({
		activeBounds: e,
		candidates: t,
		threshold: n,
		patterns: r.horizontal,
		previousContext: s,
		switchDistance: a
	}), u = [];
	for (let e of c.guides) u.push(e);
	for (let e of l.guides) u.push(e);
	return {
		deltaX: l.delta,
		deltaY: c.delta,
		guides: u,
		contexts: {
			vertical: c.context,
			horizontal: l.context
		}
	};
};
//#endregion
//#region src/editor/snapping-manager/scaling/scale-snap-candidates.ts
function Kg({ targetEdges: e, sources: t }) {
	qg({
		targetEdges: e,
		sources: t
	});
	let n = [];
	for (let r of t) {
		let t = Yg({ source: r });
		for (let i of t) for (let t of e) Xg(t) === i.axis && n.push(Object.freeze({
			id: `${r.id}:${i.key}->${t}`,
			axis: i.axis,
			edge: t,
			position: i.position,
			category: i.category
		}));
	}
	return Object.freeze(n);
}
function qg({ targetEdges: e, sources: t }) {
	if (!e.length) throw Error("Scale snap target edges must contain at least one edge");
	if (new Set(e).size !== e.length) throw Error("Scale snap target edges must be unique");
	let n = /* @__PURE__ */ new Set();
	for (let e of t) {
		if (!e.id.trim() || n.has(e.id)) throw Error(`Scale snap source id "${e.id}" must be non-empty and unique`);
		n.add(e.id), Jg({ source: e });
	}
}
function Jg({ source: e }) {
	let { left: t, right: n, top: r, bottom: i, centerX: a, centerY: o } = e.bounds;
	if (![
		t,
		n,
		r,
		i,
		a,
		o
	].every(Number.isFinite)) throw Error(`Scale snap source "${e.id}" bounds must be finite`);
	if (n < t || i < r) throw Error(`Scale snap source "${e.id}" bounds must be ordered`);
	let s = t + (n - t) / 2, c = r + (i - r) / 2;
	if (a !== s || o !== c) throw Error(`Scale snap source "${e.id}" centers must be derived from its edges`);
}
function Yg({ source: e }) {
	let { bounds: t, edgeCategory: n = "edge" } = e;
	return Object.freeze([
		{
			key: "left",
			axis: "x",
			position: t.left,
			category: n
		},
		{
			key: "center-x",
			axis: "x",
			position: t.centerX,
			category: "center"
		},
		{
			key: "right",
			axis: "x",
			position: t.right,
			category: n
		},
		{
			key: "top",
			axis: "y",
			position: t.top,
			category: n
		},
		{
			key: "center-y",
			axis: "y",
			position: t.centerY,
			category: "center"
		},
		{
			key: "bottom",
			axis: "y",
			position: t.bottom,
			category: n
		}
	]);
}
function Xg(e) {
	return e === "left" || e === "right" ? "x" : "y";
}
//#endregion
//#region src/editor/snapping-manager/scaling/image-scale-snapping-controller.ts
var Zg = Object.freeze({
	handled: !1,
	didFinishSession: !1
}), Qg = 1e-9, $g = class {
	constructor({ editor: e }) {
		this._session = null, this._editor = e;
	}
	startGesture({ event: e }) {
		this.finishGesture();
		let t = e_({ event: e }), n = e.scenePoint ?? e.pointer;
		if (!t || !n) return !1;
		let r = this._editor.snappingManager.startRectangularScaleSnappingSession({
			pointerStart: n,
			transform: t.projectionTransform
		});
		if (!r) return !1;
		let { projection: i, runtime: a } = r;
		return this._session = Object.freeze({
			projection: i,
			protectedState: n_(t),
			runtime: a,
			target: t.target,
			transform: t.transform
		}), !0;
	}
	handleObjectScaling({ event: e }) {
		return this._handleScaleStep({
			event: e,
			intentSource: "fabric-preview"
		});
	}
	handleCanvasMouseMove({ event: e }) {
		return this._handleScaleStep({
			event: e,
			intentSource: "pointer-projection"
		});
	}
	finishGesture() {
		let e = this._session?.runtime.finishSession().didCleanup ?? !1;
		return this._session = null, e;
	}
	interruptGesture({ event: e } = {}) {
		if (!this._session) return !1;
		try {
			this._editor.canvas.endCurrentTransform(e);
		} finally {
			this.finishGesture();
		}
		return !0;
	}
	finishGestureForTarget({ target: e }) {
		return !this._session || this._session.target !== e ? !1 : (this.finishGesture(), !0);
	}
	_handleScaleStep({ event: e, intentSource: t }) {
		let { _session: n } = this;
		if (!n) return Zg;
		let r = c_({ event: e }), i = n.runtime.getDuplicateStep({ marker: r });
		if (i) return l_({ duplicate: i });
		let a = e.e;
		if (!a || !r_({
			event: e,
			session: n
		})) return this._continueWithLegacyScale();
		if (wu({
			controlKey: n.projection.controlKey,
			pointerEvent: a,
			target: n.target
		})) return this._finishBeforeSkew();
		if (!i_({ session: n })) return this._continueWithLegacyScale();
		let o = lu({
			canvas: this._editor.canvas,
			event: e,
			intentSource: t,
			projection: n.projection,
			target: n.target
		});
		return o ? this._applyScaleStep({
			intent: o.intent,
			marker: r,
			mode: o.mode,
			session: n
		}) : this._continueWithLegacyScale();
	}
	_applyScaleStep({ intent: e, marker: t, mode: n, session: r }) {
		let i = r.runtime.resolveScalePlan({
			marker: t,
			intent: e
		});
		if (i.kind === "duplicate") throw Error("Шаг скейлинга изображения стал повторным после начальной проверки сессии");
		try {
			uu({
				plan: i.plan,
				projection: r.projection,
				target: r.target,
				transform: r.transform
			});
			let e = du({
				projection: r.projection,
				target: r.target
			}), t = fu({
				mode: n,
				multipliers: e,
				plan: i.plan,
				protectedStatePreserved: a_({
					mode: n,
					multipliers: e,
					session: r
				}),
				target: r.target,
				transform: r.transform
			}), a = r.runtime.verifyScalePlan({
				token: i.token,
				finalGeometry: t
			});
			return s_({ multipliers: e }) && (r.transform.actionPerformed = !0), u_({
				guides: a.guides,
				shouldPublishGuides: !0
			});
		} catch (e) {
			throw this.finishGesture(), e;
		}
	}
	_continueWithLegacyScale() {
		return Object.freeze({
			handled: !1,
			didFinishSession: this.finishGesture()
		});
	}
	_finishBeforeSkew() {
		return u_({
			guides: [],
			shouldPublishGuides: this.finishGesture()
		});
	}
};
function e_({ event: e }) {
	let { target: t, transform: n } = e;
	return !(t instanceof a) || !n || n.target !== t || !t_({ target: t }) || !Cu({
		target: t,
		transform: n
	}) ? null : Object.freeze({
		projectionTransform: Object.freeze({
			target: t,
			action: n.action,
			corner: n.corner,
			originX: n.originX,
			originY: n.originY,
			original: Object.freeze({
				scaleX: n.original.scaleX,
				scaleY: n.original.scaleY
			})
		}),
		target: t,
		transform: n
	});
}
function t_({ target: e }) {
	return [
		e.group,
		e.parent,
		e.flipX,
		e.flipY,
		e.lockScalingX,
		e.lockScalingY
	].some(Boolean) || ![
		e.width,
		e.height,
		e.angle ?? 0,
		e.skewX ?? 0,
		e.skewY ?? 0,
		e.strokeWidth ?? 0,
		e.cropX ?? 0,
		e.cropY ?? 0
	].every(Number.isFinite) || e.width <= 0 || e.height <= 0 || ![e.skewX ?? 0, e.skewY ?? 0].every((e) => Math.abs(e) <= Qg) ? !1 : e.strokeUniform ? Math.abs(e.strokeWidth ?? 0) <= Qg : !0;
}
function n_({ target: e, transform: t }) {
	return Object.freeze({
		action: t.action,
		angle: e.angle ?? 0,
		controlKey: t.corner,
		cropX: e.cropX ?? 0,
		cropY: e.cropY ?? 0,
		flipX: !!e.flipX,
		flipY: !!e.flipY,
		height: e.height,
		originX: t.originX,
		originY: t.originY,
		skewX: e.skewX ?? 0,
		skewY: e.skewY ?? 0,
		strokeUniform: !!e.strokeUniform,
		strokeWidth: e.strokeWidth ?? 0,
		targetOriginX: e.originX,
		targetOriginY: e.originY,
		width: e.width
	});
}
function r_({ event: e, session: t }) {
	return !(e.transform !== t.transform || e.target && e.target !== t.target);
}
function i_({ session: e }) {
	let { protectedState: t, target: n, transform: r } = e;
	return r.action === t.action && r.corner === t.controlKey && r.originX === t.originX && r.originY === t.originY && X({
		first: n.angle ?? 0,
		second: t.angle
	}) && X({
		first: n.skewX ?? 0,
		second: t.skewX
	}) && X({
		first: n.skewY ?? 0,
		second: t.skewY
	}) && !!n.flipX === t.flipX && !!n.flipY === t.flipY;
}
function a_({ mode: e, multipliers: t, session: n }) {
	return o_({ session: n }) ? e === "horizontal" ? X({
		first: t.y,
		second: 1
	}) : e === "vertical" ? X({
		first: t.x,
		second: 1
	}) : e === "uniform" ? X({
		first: t.x,
		second: t.y
	}) : !0 : !1;
}
function o_({ session: e }) {
	let { protectedState: t, target: n } = e;
	return i_({ session: e }) && X({
		first: n.width,
		second: t.width
	}) && X({
		first: n.height,
		second: t.height
	}) && X({
		first: n.cropX ?? 0,
		second: t.cropX
	}) && X({
		first: n.cropY ?? 0,
		second: t.cropY
	}) && X({
		first: n.strokeWidth ?? 0,
		second: t.strokeWidth
	}) && !!n.strokeUniform === t.strokeUniform && n.originX === t.targetOriginX && n.originY === t.targetOriginY;
}
function s_({ multipliers: e }) {
	return !X({
		first: e.x,
		second: 1
	}) || !X({
		first: e.y,
		second: 1
	});
}
function X({ first: e, second: t }) {
	return Number.isFinite(e) && Number.isFinite(t) && Math.abs(e - t) <= Qg;
}
function c_({ event: e }) {
	let { e: t } = e;
	return typeof t == "object" && t || typeof t == "function" ? t : e;
}
function l_({ duplicate: e }) {
	if (!e.verification) throw Error("Повторный шаг скейлинга изображения не может завершиться до проверки результата");
	return u_({
		guides: e.verification.guides,
		shouldPublishGuides: !1
	});
}
function u_({ guides: e, shouldPublishGuides: t }) {
	return Object.freeze({
		handled: !0,
		guides: Object.freeze([...e]),
		shouldPublishGuides: t
	});
}
//#endregion
//#region src/editor/snapping-manager/movement/movement-snap-candidates.ts
var d_ = 1e-9;
function f_({ sources: e, zoom: t }) {
	p_({
		sources: e,
		zoom: t
	});
	let n = [], r = [];
	for (let t of e) {
		for (let e of h_({ source: t })) n.push(Object.freeze({
			id: `${t.id}:${e.key}`,
			axis: e.axis,
			position: e.position,
			category: e.category,
			snapshotIndex: n.length
		}));
		t.useForSpacing && r.push(Object.freeze({
			id: t.id,
			bounds: m_({ bounds: t.bounds })
		}));
	}
	return Object.freeze({
		candidates: Object.freeze(n),
		spacingSources: Object.freeze(r),
		zoom: t
	});
}
function p_({ sources: e, zoom: t }) {
	if (!Number.isFinite(t) || t <= 0) throw Error("Movement snapping zoom must be a finite positive number");
	let n = /* @__PURE__ */ new Set();
	for (let t of e) {
		if (!t.id.trim() || n.has(t.id)) throw Error(`Movement snap source id "${t.id}" must be non-empty and unique`);
		n.add(t.id), m_({ bounds: t.bounds });
	}
}
function m_({ bounds: e }) {
	let { left: t, right: n, top: r, bottom: i, centerX: a, centerY: o } = e;
	if (![
		t,
		n,
		r,
		i,
		a,
		o
	].every(Number.isFinite) || n < t || i < r) throw Error("Movement snap source bounds must contain finite ordered values");
	let s = t + (n - t) / 2, c = r + (i - r) / 2;
	if (Math.abs(a - s) > d_ || Math.abs(o - c) > d_) throw Error("Movement snap source centers must be derived from its edges");
	return Object.freeze({
		left: t,
		right: n,
		top: r,
		bottom: i,
		centerX: a,
		centerY: o
	});
}
function h_({ source: e }) {
	let { bounds: t, edgeCategory: n = "edge" } = e;
	return Object.freeze([
		{
			key: "left",
			axis: "x",
			position: t.left,
			category: n
		},
		{
			key: "center-x",
			axis: "x",
			position: t.centerX,
			category: "center"
		},
		{
			key: "right",
			axis: "x",
			position: t.right,
			category: n
		},
		{
			key: "top",
			axis: "y",
			position: t.top,
			category: n
		},
		{
			key: "center-y",
			axis: "y",
			position: t.centerY,
			category: "center"
		},
		{
			key: "bottom",
			axis: "y",
			position: t.bottom,
			category: n
		}
	]);
}
//#endregion
//#region src/editor/snapping-manager/movement/spacing-patterns.ts
function g_({ sources: e, sourceIndex: t, primaryStart: n, primaryEnd: r }) {
	let i = e[t], a = n === "top" ? "left" : "top", o = r === "bottom" ? "right" : "bottom", s = null;
	for (let c = t + 1; c < e.length; c += 1) {
		let t = e[c], l = Math.max(i.bounds[a], t.bounds[a]), u = Math.min(i.bounds[o], t.bounds[o]), d = t.bounds[n] - i.bounds[r];
		u < l || d < 0 || s && d >= s.distance || (s = {
			source: t,
			distance: d,
			crossStart: l,
			crossEnd: u
		});
	}
	return s;
}
function __({ sources: e, type: t, primaryStart: n, primaryEnd: r }) {
	let i = [...e].sort((e, t) => e.bounds[n] - t.bounds[n] || e.id.localeCompare(t.id)), a = [];
	for (let e = 0; e < i.length; e += 1) {
		let o = i[e], s = g_({
			sources: i,
			sourceIndex: e,
			primaryStart: n,
			primaryEnd: r
		});
		s && a.push({
			beforeId: o.id,
			afterId: s.source.id,
			crossStart: s.crossStart,
			crossEnd: s.crossEnd,
			pattern: {
				type: t,
				axis: (s.crossStart + s.crossEnd) / 2,
				start: o.bounds[r],
				end: s.source.bounds[n],
				distance: s.distance
			}
		});
	}
	return a;
}
function v_({ bounds: e }) {
	let t = e.map((e, t) => ({
		id: `bounds:${t}`,
		bounds: e
	}));
	return {
		vertical: __({
			sources: t,
			type: "vertical",
			primaryStart: "top",
			primaryEnd: "bottom"
		}).map(({ pattern: e }) => e),
		horizontal: __({
			sources: t,
			type: "horizontal",
			primaryStart: "left",
			primaryEnd: "right"
		}).map(({ pattern: e }) => e)
	};
}
//#endregion
//#region src/editor/snapping-manager/movement/spacing-chains.ts
var y_ = .001, b_ = "movement-active-target";
function x_({ entry: e }) {
	let { pattern: t, beforeId: n, afterId: r } = e;
	return Object.freeze({
		id: `${t.type}:${n}:${r}`,
		type: t.type,
		axis: t.axis,
		beforeId: n,
		afterId: r,
		start: t.start,
		end: t.end,
		exactDistance: t.distance
	});
}
function S_({ entries: e, type: t }) {
	if (e.length < 2) return null;
	let n = e.map((e) => x_({ entry: e })), r = n.reduce((e, t) => e + t.exactDistance, 0) / n.length, i = n[0], a = n[n.length - 1], o = e[0].crossStart, s = e[0].crossEnd;
	for (let t = 1; t < e.length; t += 1) o = Math.max(o, e[t].crossStart), s = Math.min(s, e[t].crossEnd);
	return Object.freeze({
		id: `${t}:${i.beforeId}:${a.afterId}`,
		type: t,
		axis: (o + s) / 2,
		intervals: Object.freeze(n),
		exactRepresentative: r,
		displayDistance: og({ distance: r })
	});
}
function C_({ entries: e, type: t }) {
	let n = [], r = 0;
	for (; r < e.length;) {
		let i = r + 1, a = e[r].pattern.distance, o = a, s = og({ distance: a }), c = e[r].crossStart, l = e[r].crossEnd;
		for (; i < e.length;) {
			let t = e[i], { distance: n } = t.pattern, r = Math.min(a, n), u = Math.max(o, n), d = Math.max(c, t.crossStart), f = Math.min(l, t.crossEnd);
			if (u - r > y_ || og({ distance: n }) !== s || f < d) break;
			a = r, o = u, c = d, l = f, i += 1;
		}
		let u = S_({
			entries: e.slice(r, i),
			type: t
		});
		u && n.push(u), r = i;
	}
	return n;
}
function w_({ entries: e, type: t }) {
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
	for (let t of e) n.set(t.beforeId, t), r.add(t.afterId);
	for (let a of e) {
		if (r.has(a.beforeId)) continue;
		let o = [], s = a;
		for (let t = 0; s && t < e.length; t += 1) o.push(s), s = n.get(s.afterId);
		i.push(...C_({
			entries: o,
			type: t
		}));
	}
	return i;
}
function T_({ sources: e }) {
	let t = __({
		sources: e,
		type: "vertical",
		primaryStart: "top",
		primaryEnd: "bottom"
	}), n = __({
		sources: e,
		type: "horizontal",
		primaryStart: "left",
		primaryEnd: "right"
	});
	return Object.freeze({
		vertical: Object.freeze(w_({
			entries: t,
			type: "vertical"
		})),
		horizontal: Object.freeze(w_({
			entries: n,
			type: "horizontal"
		}))
	});
}
function E_({ chain: e, pattern: t }) {
	return t ? e.intervals.some((e) => e.type === t.type && e.axis === t.axis && e.start === t.start && e.end === t.end && e.exactDistance === t.distance) : !1;
}
function D_({ chain: e, sourceId: t }) {
	return e.intervals.some((e) => e.beforeId === t || e.afterId === t);
}
function O_({ chains: e, chainId: t }) {
	if (!t) return null;
	for (let n of [...e.horizontal, ...e.vertical]) if (n.id === t) return n;
	return null;
}
function k_({ interval: e, activeSourceId: t, activeBounds: n }) {
	let r = e.type === "horizontal", i = r ? n.left : n.top, a = r ? n.right : n.bottom;
	return {
		start: e.beforeId === t ? a : e.start,
		end: e.afterId === t ? i : e.end
	};
}
function A_({ chain: e, activeSourceId: t, activeBounds: n }) {
	if (!D_({
		chain: e,
		sourceId: t
	})) return [];
	let r = e.type === "horizontal" ? n.top : n.left, i = e.type === "horizontal" ? n.bottom : n.right;
	if (e.axis < r || e.axis > i) return [];
	let a = e.intervals.map((e) => k_({
		interval: e,
		activeSourceId: t,
		activeBounds: n
	})), o = [];
	for (let t = 1; t < a.length; t += 1) {
		let n = a[t - 1], r = a[t];
		o.push({
			type: e.type,
			axis: e.axis,
			refStart: n.start,
			refEnd: n.end,
			activeStart: r.start,
			activeEnd: r.end,
			distance: e.displayDistance
		});
	}
	return o;
}
function j_({ axis: e, baseline: t, bounds: n, threshold: r, selections: i, primarySelection: a }) {
	let o = M_({
		axis: e,
		baseline: t,
		bounds: n,
		threshold: r,
		primarySelection: a
	}), s = o ? F_({
		axis: e,
		baseline: t,
		bounds: n
	}) : I_({
		axis: e,
		bounds: n,
		identity: a.identity
	}), c = L_({
		axis: e,
		bounds: n,
		selections: i,
		exactDelta: s,
		spacingChain: o
	});
	if (!c.length) throw Error("Movement spacing constraint must keep its primary interval");
	return Object.freeze({
		chain: o,
		delta: s,
		selections: c
	});
}
function M_({ axis: e, baseline: t, bounds: n, threshold: r, primarySelection: i }) {
	let a = N_({
		chains: e === "x" ? t.spacingChains.horizontal : t.spacingChains.vertical,
		selection: i
	});
	if (!a) return null;
	let o = e === "x" ? "left" : "top";
	return Math.abs(t.bounds[o] - n[o]) <= r + 1e-9 ? a : null;
}
function N_({ chains: e, selection: t }) {
	for (let n of e) {
		if (!D_({
			chain: n,
			sourceId: "movement-active-target"
		})) continue;
		let { pattern: e } = t.identity;
		if (e && E_({
			chain: n,
			pattern: e
		}) || !e && P_({
			chain: n,
			selection: t
		})) return n;
	}
	return null;
}
function P_({ chain: e, selection: t }) {
	let { guide: n } = t, r = e.intervals.some((e) => Math.abs(e.start - n.refStart) <= 1e-9 && Math.abs(e.end - n.refEnd) <= 1e-9), i = e.intervals.some((e) => Math.abs(e.start - n.activeStart) <= 1e-9 && Math.abs(e.end - n.activeEnd) <= 1e-9);
	return r && i;
}
function F_({ axis: e, baseline: t, bounds: n }) {
	let r = e === "x" ? "left" : "top";
	return t.bounds[r] - n[r];
}
function I_({ axis: e, bounds: t, identity: n }) {
	let r = e === "x" ? "left" : "top", i = e === "x" ? "right" : "bottom", { before: a, after: o, pattern: s } = n;
	if (n.kind === "center") {
		if (!a || !o) throw Error("Centered movement spacing requires both exact neighbours");
		let e = t[i] - t[r], n = o[r] - a[i] - e;
		return a[i] + n / 2 - t[r];
	}
	if (!s) throw Error("Reference movement spacing requires an exact pattern");
	if (n.side === "before" && a) return a[i] + s.distance - t[r];
	if (n.side === "after" && o) return o[r] - s.distance - t[i];
	throw Error("Reference movement spacing requires the selected exact neighbour");
}
function L_({ axis: e, bounds: t, selections: n, exactDelta: r, spacingChain: i }) {
	let a = [];
	for (let o of n) {
		let n = I_({
			axis: e,
			bounds: t,
			identity: o.identity
		}), s = i && E_({
			chain: i,
			pattern: o.identity.pattern
		}), c = i && Math.abs(n - r) <= 1.000000001;
		i && !s && !c || !i && Math.abs(n - r) > 1e-9 || a.push(Object.freeze({
			...o,
			guide: R_({
				axis: e,
				bounds: t,
				selection: o,
				exactDelta: r
			})
		}));
	}
	return Object.freeze(a);
}
function R_({ axis: e, bounds: t, selection: n, exactDelta: r }) {
	let { guide: i, identity: a } = n, o = e === "x" ? "left" : "top", s = e === "x" ? "right" : "bottom", c = t[o] + r, l = t[s] + r;
	return a.kind === "center" ? Object.freeze({
		...i,
		refEnd: c,
		activeStart: l
	}) : a.side === "before" ? Object.freeze({
		...i,
		activeEnd: c
	}) : Object.freeze({
		...i,
		activeStart: l
	});
}
//#endregion
//#region src/editor/snapping-manager/movement/movement-spacing-verification.ts
function z_({ constraint: e, baseline: t }) {
	return e.transition === "held" ? t.thresholds.spacingRelease : t.thresholds.acquire;
}
function B_({ constraint: e, baseline: t, bounds: n }) {
	let r = z_({
		constraint: e,
		baseline: t
	});
	return e.selections.filter((e) => Fg({
		selection: e,
		activeBounds: n,
		candidates: t.spacingBounds,
		tolerance: r
	}));
}
function V_({ baseline: e, bounds: t, constraint: n }) {
	let r = B_({
		constraint: n,
		baseline: e,
		bounds: t
	}), i = r.find(({ isPrimary: e }) => e), a = O_({
		chains: e.spacingChains,
		chainId: n.chainId
	});
	if (!i || !a) return Object.freeze({
		guides: Object.freeze(r.map(({ guide: e }) => e)),
		usesChainAxis: !1
	});
	let o = A_({
		chain: a,
		activeSourceId: b_,
		activeBounds: t
	});
	return o.length ? Object.freeze({
		guides: Object.freeze(o),
		usesChainAxis: !0
	}) : Object.freeze({
		guides: Object.freeze(r.map(({ guide: e }) => e)),
		usesChainAxis: !1
	});
}
function H_({ baseline: e, bounds: t, guides: n, constraint: r, plan: i }) {
	let a = V_({
		baseline: e,
		bounds: t,
		constraint: r
	}), o = 0;
	a.usesChainAxis || (o = r.axis === "x" ? t.centerY - i.predictedBounds.centerY : t.centerX - i.predictedBounds.centerX);
	let s = new Set(n.map((e) => wg({ guide: e })));
	for (let e of a.guides) {
		let t = Object.freeze({
			...e,
			axis: e.axis + o
		}), r = wg({ guide: t });
		s.has(r) || (s.add(r), n.push(t));
	}
}
//#endregion
//#region src/editor/snapping-manager/movement/movement-snapping-resolver.ts
var U_ = .1, W_ = 1e-9, G_ = 3, K_ = Object.freeze({
	"domain-boundary": 0,
	edge: 1,
	center: 2
}), q_ = Object.freeze([
	"left",
	"centerX",
	"right"
]), J_ = Object.freeze([
	"top",
	"centerY",
	"bottom"
]), Y_ = Object.freeze({ kind: "free" }), X_ = Object.freeze({
	x: Y_,
	y: Y_
});
function Z_({ bounds: e, position: t, environment: n }) {
	let r = kv({ bounds: e }), i = Av({ position: t }), a = n.spacingSources.map(({ id: e, bounds: t }) => Object.freeze({
		id: e,
		bounds: kv({ bounds: t })
	})), o = a.map(({ bounds: e }) => e), s = v_({ bounds: [...o] }), c = Object.freeze({
		id: b_,
		bounds: r
	});
	return Object.freeze({
		bounds: r,
		position: i,
		candidates: n.candidates,
		spacingBounds: Object.freeze(o),
		spacingChains: T_({ sources: [...a, c] }),
		spacingPatterns: Object.freeze({
			vertical: Object.freeze(s.vertical.map((e) => Object.freeze({ ...e }))),
			horizontal: Object.freeze(s.horizontal.map((e) => Object.freeze({ ...e })))
		}),
		thresholds: jv({ zoom: n.zoom })
	});
}
function Q_({ baseline: e, intent: t, holdState: n }) {
	let r = Dv({ intent: t });
	if (Mv({
		baseline: e,
		holdState: n
	}), Ov({
		baseline: e,
		intent: r
	}), r.modifiers.ctrlKey) return ev({ rawIntent: r });
	let i = ov({
		baseline: e,
		intent: r,
		proposals: {
			x: tv({
				axis: "x",
				baseline: e,
				intent: r,
				hold: n.x
			}),
			y: tv({
				axis: "y",
				baseline: e,
				intent: r,
				hold: n.y
			})
		}
	}), a = vv({
		intent: r,
		proposals: i
	}), o = Ev({
		bounds: r.bounds,
		deltaX: a.left - r.position.left,
		deltaY: a.top - r.position.top
	}), s = bv({
		proposals: i,
		deltaX: a.left - r.position.left,
		deltaY: a.top - r.position.top
	});
	return Object.freeze({
		rawIntent: r,
		nextPosition: a,
		predictedBounds: o,
		constraints: s,
		verificationEpsilon: e.thresholds.verification
	});
}
function $_({ baseline: e, plan: t, finalGeometry: n }) {
	let r = kv({ bounds: n.bounds }), i = Av({ position: n.position }), a = Fv({
		first: e.bounds,
		second: r,
		epsilon: t.verificationEpsilon
	});
	return wv({
		baseline: e,
		plan: t,
		xVerified: Sv({
			baseline: e,
			constraint: t.constraints.x,
			plan: t,
			bounds: r,
			position: i,
			dimensionsPreserved: a
		}),
		yVerified: Sv({
			baseline: e,
			constraint: t.constraints.y,
			plan: t,
			bounds: r,
			position: i,
			dimensionsPreserved: a
		}),
		bounds: r
	});
}
function ev({ rawIntent: e }) {
	return Object.freeze({
		rawIntent: e,
		nextPosition: e.position,
		predictedBounds: e.bounds,
		constraints: Object.freeze({
			x: null,
			y: null
		}),
		verificationEpsilon: U_
	});
}
function tv({ axis: e, baseline: t, intent: n, hold: r }) {
	if (!n.axes[e]) return null;
	let i = nv({
		axis: e,
		baseline: t,
		intent: n,
		hold: r
	});
	if (i) return i;
	let a = cv({
		axis: e,
		bounds: n.bounds,
		candidates: t.candidates,
		threshold: t.thresholds.acquire
	}), o = fv({
		axis: e,
		baseline: t,
		bounds: n.bounds,
		threshold: t.thresholds.acquire,
		transition: "acquired"
	});
	return av({
		bounds: n.bounds,
		line: a,
		spacing: o
	});
}
function nv({ axis: e, baseline: t, intent: n, hold: r }) {
	return r.kind === "line" ? rv({
		axis: e,
		bounds: n.bounds,
		hold: r,
		releaseThreshold: t.thresholds.release
	}) : r.kind === "spacing" ? iv({
		axis: e,
		baseline: t,
		bounds: n.bounds,
		hold: r
	}) : null;
}
function rv({ axis: e, bounds: t, hold: n, releaseThreshold: r }) {
	let i = t[n.activeAnchor];
	return Math.abs(i - n.candidate.position) > r ? null : Object.freeze({
		kind: "line",
		axis: e,
		activeAnchor: n.activeAnchor,
		candidate: n.candidate,
		transition: "held"
	});
}
function iv({ axis: e, baseline: t, bounds: n, hold: r }) {
	let i = fv({
		axis: e,
		baseline: t,
		bounds: n,
		threshold: t.thresholds.spacingRelease,
		previousContext: r.context,
		transition: "held"
	});
	return !i || i.candidateId !== r.candidateId ? null : i;
}
function av({ bounds: e, line: t, spacing: n }) {
	return t ? n ? Math.abs(uv({
		constraint: t,
		bounds: e
	})) <= Math.abs(n.delta) + 1e-9 ? t : n : t : n;
}
function ov({ baseline: e, intent: t, proposals: n }) {
	let r = n;
	for (let n = 0; n < G_; n += 1) {
		let n = vv({
			intent: t,
			proposals: r
		}), i = Ev({
			bounds: t.bounds,
			deltaX: n.left - t.position.left,
			deltaY: n.top - t.position.top
		}), a = sv({
			proposal: r.x,
			baseline: e,
			intent: t,
			bounds: i
		}), o = sv({
			proposal: r.y,
			baseline: e,
			intent: t,
			bounds: i
		});
		if (a === r.x && o === r.y) return r;
		r = Object.freeze({
			x: a,
			y: o
		});
	}
	return r;
}
function sv({ proposal: e, baseline: t, intent: n, bounds: r }) {
	if (!e || e.kind === "line") return e;
	let i = B_({
		constraint: e,
		baseline: t,
		bounds: r
	});
	return i.some(({ isPrimary: e }) => e) ? i.length === e.selections.length ? e : Object.freeze({
		...e,
		selections: Object.freeze(i)
	}) : cv({
		axis: e.axis,
		bounds: n.bounds,
		candidates: t.candidates,
		threshold: t.thresholds.acquire
	});
}
function cv({ axis: e, bounds: t, candidates: n, threshold: r }) {
	let i = null, a = Infinity, o = e === "x" ? q_ : J_;
	for (let s = 0; s < o.length; s += 1) {
		let c = o[s];
		for (let o of n) {
			if (o.axis !== e) continue;
			let n = Math.abs(t[c] - o.position);
			n > r || lv({
				candidate: o,
				distance: n,
				current: i,
				currentDistance: a
			}) && (i = Object.freeze({
				kind: "line",
				axis: e,
				activeAnchor: c,
				candidate: o,
				transition: "acquired"
			}), a = n);
		}
	}
	return i;
}
function lv({ candidate: e, distance: t, current: n, currentDistance: r }) {
	if (!n) return !0;
	let i = t - r;
	if (i < -1e-9) return !0;
	if (i > 1e-9) return !1;
	let a = K_[e.category], o = K_[n.candidate.category];
	return a === o ? e.snapshotIndex < n.candidate.snapshotIndex : a < o;
}
function uv({ constraint: e, bounds: t }) {
	return e.candidate.position - t[e.activeAnchor];
}
function dv({ proposal: e, bounds: t }) {
	return e ? e.kind === "spacing" ? e.delta : uv({
		constraint: e,
		bounds: t
	}) : 0;
}
function fv({ axis: e, baseline: t, bounds: n, threshold: r, transition: i, previousContext: a = null }) {
	let o = hv({
		axis: e,
		baseline: t,
		bounds: n,
		threshold: r,
		previousContext: a
	});
	if (!o.context || !o.guides.length) return null;
	if (!o.selections.length) throw Error("Movement spacing result must describe its selected intervals");
	return pv({
		axis: e,
		baseline: t,
		bounds: n,
		threshold: r,
		transition: i,
		calculation: o
	});
}
function pv({ axis: e, baseline: t, bounds: n, threshold: r, transition: i, calculation: a }) {
	let o = Lv({ context: a.context });
	if (!o) throw Error("Movement spacing result must contain a context");
	let s = Iv({ selections: a.selections }), c = mv({ selections: s }), l = j_({
		axis: e,
		baseline: t,
		bounds: n,
		threshold: r,
		selections: s,
		primarySelection: c
	});
	return Object.freeze({
		kind: "spacing",
		axis: e,
		candidateId: gv({
			axis: e,
			chainId: l.chain?.id ?? null,
			identity: c.identity,
			context: o
		}),
		chainId: l.chain?.id ?? null,
		context: o,
		delta: l.delta,
		selections: l.selections,
		transition: i
	});
}
function mv({ selections: e }) {
	let t = e.filter(({ isPrimary: e }) => e);
	if (t.length !== 1) throw Error("Movement spacing result must identify exactly one primary interval");
	return t[0];
}
function hv({ axis: e, baseline: t, bounds: n, threshold: r, previousContext: i }) {
	let a = {
		activeBounds: n,
		candidates: t.spacingBounds.map((e) => ({ ...e })),
		threshold: r,
		patterns: e === "x" ? t.spacingPatterns.horizontal.map((e) => ({ ...e })) : t.spacingPatterns.vertical.map((e) => ({ ...e })),
		previousContext: i ? { ...i } : null,
		switchDistance: i ? Infinity : 0
	};
	return e === "x" ? Wg(a) : Ug(a);
}
function gv({ axis: e, chainId: t, identity: n, context: r }) {
	return JSON.stringify({
		axis: e,
		chainId: t,
		context: r,
		identity: n
	});
}
function _v(e, t) {
	return Math.abs(e - t) <= W_;
}
function vv({ intent: e, proposals: t }) {
	return Object.freeze({
		left: yv({
			value: e.position.left,
			delta: dv({
				proposal: t.x,
				bounds: e.bounds
			}),
			canSnap: e.axes.x,
			hasConstraint: !!t.x
		}),
		top: yv({
			value: e.position.top,
			delta: dv({
				proposal: t.y,
				bounds: e.bounds
			}),
			canSnap: e.axes.y,
			hasConstraint: !!t.y
		})
	});
}
function yv({ value: e, delta: t, canSnap: n, hasConstraint: r }) {
	return n ? r ? e + t : Math.round(e / 1) * 1 : e;
}
function bv({ proposals: e, deltaX: t, deltaY: n }) {
	return Object.freeze({
		x: xv({
			proposal: e.x,
			deltaX: t,
			deltaY: n
		}),
		y: xv({
			proposal: e.y,
			deltaX: t,
			deltaY: n
		})
	});
}
function xv({ proposal: e, deltaX: t, deltaY: n }) {
	return !e || e.kind === "line" ? e : Object.freeze({
		...e,
		selections: Object.freeze(e.selections.map((e) => {
			let { guide: r } = e, i = r.type === "horizontal" ? n : t;
			return Object.freeze({
				...e,
				guide: Object.freeze({
					...r,
					axis: r.axis + i
				})
			});
		}))
	});
}
function Sv({ baseline: e, constraint: t, plan: n, bounds: r, position: i, dimensionsPreserved: a }) {
	if (!t || !a) return !1;
	let o = t.axis === "x" ? i.left : i.top, s = t.axis === "x" ? n.nextPosition.left : n.nextPosition.top;
	return Math.abs(o - s) > n.verificationEpsilon || !Cv({
		axis: t.axis,
		bounds: r,
		plan: n
	}) ? !1 : t.kind === "spacing" ? B_({
		constraint: t,
		baseline: e,
		bounds: r
	}).some(({ isPrimary: e }) => e) : Math.abs(r[t.activeAnchor] - t.candidate.position) <= n.verificationEpsilon;
}
function Cv({ axis: e, bounds: t, plan: n }) {
	return (e === "x" ? [
		"left",
		"centerX",
		"right"
	] : [
		"top",
		"centerY",
		"bottom"
	]).every((e) => Math.abs(t[e] - n.predictedBounds[e]) <= n.verificationEpsilon);
}
function wv({ baseline: e, plan: t, xVerified: n, yVerified: r, bounds: i }) {
	let a = [], o = [], s = [], c = Tv({
		baseline: e,
		bounds: i,
		guides: a,
		spacingGuides: o,
		blockedAxes: s,
		constraint: t.constraints.x,
		plan: t,
		verified: n
	}), l = Tv({
		baseline: e,
		bounds: i,
		guides: a,
		spacingGuides: o,
		blockedAxes: s,
		constraint: t.constraints.y,
		plan: t,
		verified: r
	});
	return Object.freeze({
		guides: Object.freeze(a),
		spacingGuides: Object.freeze(o),
		blockedAxes: Object.freeze(s),
		holdState: Object.freeze({
			x: c,
			y: l
		})
	});
}
function Tv({ baseline: e, bounds: t, guides: n, spacingGuides: r, blockedAxes: i, constraint: a, plan: o, verified: s }) {
	return a ? s ? a.kind === "spacing" ? (H_({
		baseline: e,
		bounds: t,
		guides: r,
		constraint: a,
		plan: o
	}), Object.freeze({
		kind: "spacing",
		candidateId: a.candidateId,
		context: a.context
	})) : (n.push(Object.freeze({
		axis: a.axis,
		activeAnchor: a.activeAnchor,
		position: a.candidate.position,
		candidateId: a.candidate.id,
		category: a.candidate.category,
		snapshotIndex: a.candidate.snapshotIndex
	})), Object.freeze({
		kind: "line",
		candidate: a.candidate,
		activeAnchor: a.activeAnchor
	})) : (i.push(a.axis), Y_) : Y_;
}
function Ev({ bounds: e, deltaX: t, deltaY: n }) {
	return Object.freeze({
		left: e.left + t,
		right: e.right + t,
		top: e.top + n,
		bottom: e.bottom + n,
		centerX: e.centerX + t,
		centerY: e.centerY + n
	});
}
function Dv({ intent: e }) {
	return Object.freeze({
		bounds: kv({ bounds: e.bounds }),
		position: Av({ position: e.position }),
		axes: Object.freeze({
			x: e.axes.x,
			y: e.axes.y
		}),
		modifiers: Object.freeze({ ctrlKey: e.modifiers.ctrlKey })
	});
}
function Ov({ baseline: e, intent: t }) {
	let n = Ev({
		bounds: e.bounds,
		deltaX: t.position.left - e.position.left,
		deltaY: t.position.top - e.position.top
	});
	if (![
		"left",
		"centerX",
		"right",
		"top",
		"centerY",
		"bottom"
	].every((e) => _v(n[e], t.bounds[e]))) throw Error("Movement raw intent must be a translation of the gesture baseline");
}
function kv({ bounds: e }) {
	let { left: t, right: n, top: r, bottom: i, centerX: a, centerY: o } = e;
	if (![
		t,
		n,
		r,
		i,
		a,
		o
	].every(Number.isFinite) || n < t || i < r) throw Error("Movement snapping bounds must contain finite ordered values");
	let s = t + (n - t) / 2, c = r + (i - r) / 2;
	if (Math.abs(a - s) > W_ || Math.abs(o - c) > W_) throw Error("Movement snapping bounds centers must be derived from its edges");
	return Object.freeze({
		left: t,
		right: n,
		top: r,
		bottom: i,
		centerX: a,
		centerY: o
	});
}
function Av({ position: e }) {
	if (!Number.isFinite(e.left) || !Number.isFinite(e.top)) throw Error("Movement snapping target position must contain finite coordinates");
	return Object.freeze({
		left: e.left,
		top: e.top
	});
}
function jv({ zoom: e }) {
	return Object.freeze({
		acquire: 5 / e,
		release: 5 / e,
		spacingRelease: 10 / e,
		verification: U_
	});
}
function Mv({ baseline: e, holdState: t }) {
	Nv({
		axis: "x",
		baseline: e,
		hold: t.x
	}), Nv({
		axis: "y",
		baseline: e,
		hold: t.y
	});
}
function Nv({ axis: e, baseline: t, hold: n }) {
	if (n.kind === "free") return;
	if (n.kind === "spacing") {
		if (!n.candidateId.trim() || !Number.isFinite(n.context.distance) || n.context.distance < 0) throw Error(`Movement hold state contains an invalid ${e} spacing constraint`);
		return;
	}
	if (n.candidate.axis !== e || Pv({ anchor: n.activeAnchor }) !== e) throw Error(`Movement hold state contains an invalid ${e} constraint`);
	let r = t.candidates[n.candidate.snapshotIndex];
	if (!r || r.id !== n.candidate.id || r.position !== n.candidate.position) throw Error("Movement hold state candidate does not belong to the active baseline");
}
function Pv({ anchor: e }) {
	return e === "left" || e === "centerX" || e === "right" ? "x" : "y";
}
function Fv({ first: e, second: t, epsilon: n }) {
	let r = e.right - e.left, i = e.bottom - e.top, a = t.right - t.left, o = t.bottom - t.top;
	return Math.abs(r - a) <= n && Math.abs(i - o) <= n;
}
function Iv({ selections: e }) {
	return Object.freeze(e.map((e) => {
		let { identity: t } = e;
		return Object.freeze({
			guide: Object.freeze({ ...e.guide }),
			identity: Object.freeze({
				kind: t.kind,
				side: t.side,
				before: t.before ? kv({ bounds: t.before }) : null,
				after: t.after ? kv({ bounds: t.after }) : null,
				pattern: t.pattern ? Object.freeze({ ...t.pattern }) : null
			}),
			isPrimary: e.isPrimary
		});
	}));
}
function Lv({ context: e }) {
	return e ? Object.freeze({
		side: e.side,
		kind: e.kind,
		distance: e.distance
	}) : null;
}
function Rv({ guides: e }) {
	return e.map(({ axis: e, position: t }) => ({
		type: e === "x" ? "vertical" : "horizontal",
		position: t
	}));
}
//#endregion
//#region src/editor/snapping-manager/movement/movement-snapping-runtime.ts
var zv = 1, Bv = Object.freeze({ didCleanup: !1 }), Vv = class {
	constructor() {
		this._session = null, this._issuedTokens = /* @__PURE__ */ new WeakSet(), this._consumedTokens = /* @__PURE__ */ new WeakSet();
	}
	startSession({ baseline: e }) {
		if (this._session) throw Error("Movement snapping runtime already has an active session");
		this._session = {
			id: zv,
			baseline: e,
			holdState: X_,
			markerRecords: /* @__PURE__ */ new WeakMap(),
			pendingStep: null,
			nextStep: 1
		}, zv += 1;
	}
	getDuplicateStep({ marker: e }) {
		let t = this._getActiveSession().markerRecords.get(e);
		return t ? Hv({ record: t }) : null;
	}
	resolveMovementPlan({ marker: e, intent: t }) {
		let n = this._getActiveSession(), r = n.markerRecords.get(e);
		if (r) return Uv({
			first: r.plan.rawIntent,
			second: t
		}), Hv({ record: r });
		if (n.pendingStep) throw Error("Previous movement plan token must be verified before the next pointer marker");
		let i = Q_({
			baseline: n.baseline,
			intent: t,
			holdState: n.holdState
		}), a = this._createPlanToken({ session: n }), o = {
			token: a,
			plan: i,
			verification: null
		};
		return n.markerRecords.set(e, o), n.pendingStep = o, Object.freeze({
			kind: "planned",
			token: a,
			plan: i
		});
	}
	verifyMovementPlan({ token: e, finalGeometry: t }) {
		let n = this._getActiveSession();
		this._assertUsableToken({
			session: n,
			token: e
		});
		let { pendingStep: r } = n;
		if (!r) throw Error("Movement snapping runtime has no pointer step to verify");
		let i = $_({
			baseline: n.baseline,
			plan: r.plan,
			finalGeometry: t
		});
		return this._consumedTokens.add(e), r.verification = i, n.pendingStep = null, n.holdState = i.holdState, i;
	}
	finishSession() {
		let e = this._session;
		if (!e) return Bv;
		let t = e.pendingStep?.token;
		return t && this._consumedTokens.add(t), this._session = null, Object.freeze({ didCleanup: !0 });
	}
	_getActiveSession() {
		if (!this._session) throw Error("Movement snapping runtime has no active session");
		return this._session;
	}
	_createPlanToken({ session: e }) {
		let t = Object.freeze({
			sessionId: e.id,
			step: e.nextStep
		});
		return e.nextStep += 1, this._issuedTokens.add(t), t;
	}
	_assertUsableToken({ session: e, token: t }) {
		if (!this._issuedTokens.has(t)) throw Error("Foreign movement plan token");
		if (this._consumedTokens.has(t)) throw Error("Movement plan token has already been used");
		if (!e.pendingStep || e.pendingStep.token !== t) throw Error("Movement plan token does not belong to the current pointer step");
	}
};
function Hv({ record: e }) {
	return Object.freeze({
		kind: "duplicate",
		phase: e.verification ? "verified" : "pending",
		token: e.token,
		plan: e.plan,
		verification: e.verification
	});
}
function Uv({ first: e, second: t }) {
	let n = Wv({
		first: e.bounds,
		second: t.bounds
	}), r = e.position.left === t.position.left && e.position.top === t.position.top, i = e.axes.x === t.axes.x && e.axes.y === t.axes.y, a = e.modifiers.ctrlKey === t.modifiers.ctrlKey;
	if (!n || !r || !i || !a) throw Error("Native movement pointer marker was reused with a different raw intent");
}
function Wv({ first: e, second: t }) {
	return e.left === t.left && e.right === t.right && e.top === t.top && e.bottom === t.bottom && e.centerX === t.centerX && e.centerY === t.centerY;
}
//#endregion
//#region src/editor/utils/object-filter.ts
var Gv = [
	"montage-area",
	"background",
	"interaction-blocker"
], Kv = ({ activeObject: t }) => {
	let n = /* @__PURE__ */ new Set();
	return t ? (n.add(t), t instanceof e && t.getObjects().forEach((e) => n.add(e)), n) : n;
}, qv = ({ object: e, excluded: t, ignoredIds: n = Gv }) => {
	if (t.has(e)) return !0;
	let { visible: r = !0 } = e;
	if (!r) return !0;
	let { id: i } = e;
	return !!(i && n.includes(i));
}, Jv = Object.freeze({ handled: !1 }), Yv = class {
	constructor({ editor: e }) {
		this._runtime = new Vv(), this._activeTarget = null, this._editor = e;
	}
	startGesture({ target: e }) {
		if (this.finishGesture(), !this._isSupportedTarget(e)) return;
		let t = z({ object: e });
		if (!t) throw Error("Object movement snapping requires exact target bounds");
		let n = Z_({
			bounds: t,
			position: this._readTargetPosition({ target: e }),
			environment: this._captureEnvironment({ activeObject: e })
		});
		this._runtime.startSession({ baseline: n }), this._activeTarget = e;
	}
	handleObjectMoving({ event: e }) {
		let { target: t } = e, n = this._activeTarget;
		if (!t || !n || t !== n) return Jv;
		let r = Xv({ event: e }), i = this._runtime.getDuplicateStep({ marker: r });
		if (i) return Zv({ duplicate: i });
		let a = this._createRawIntent({
			target: n,
			event: e
		}), o = this._runtime.resolveMovementPlan({
			marker: r,
			intent: a
		});
		return o.kind === "duplicate" ? Zv({ duplicate: o }) : (this._applyMovementPlan({
			target: n,
			plan: o.plan
		}), Qv({ verification: this._runtime.verifyMovementPlan({
			token: o.token,
			finalGeometry: this._readFinalGeometry({ target: n })
		}) }));
	}
	finishGesture() {
		this._runtime.finishSession(), this._activeTarget = null;
	}
	finishGestureForTarget({ target: t }) {
		let n = this._activeTarget, r = n instanceof e && n.getObjects().includes(t);
		return t !== n && !r ? !1 : (this.finishGesture(), !0);
	}
	_isSupportedTarget(t) {
		return !t || t.group ? !1 : t instanceof e ? this._isSupportedActiveSelection({ selection: t }) : t instanceof a || t instanceof c || t instanceof _;
	}
	_isSupportedActiveSelection({ selection: e }) {
		let t = e.getObjects();
		return t.length < 2 || t.some((e) => e instanceof _) && (e.scaleX !== 1 || e.scaleY !== 1) ? !1 : t.every((e) => e.parent ? !1 : e instanceof a || e instanceof _ || L(e));
	}
	_createRawIntent({ target: e, event: t }) {
		let n = z({ object: e });
		if (!n) throw Error("Object movement snapping requires exact raw bounds");
		return {
			bounds: n,
			position: this._readTargetPosition({ target: e }),
			axes: {
				x: !e.lockMovementX,
				y: !e.lockMovementY
			},
			modifiers: { ctrlKey: !!t.e?.ctrlKey }
		};
	}
	_applyMovementPlan({ target: e, plan: t }) {
		let { left: n, top: r } = t.nextPosition;
		e.left === n && e.top === r || (e.set({
			left: n,
			top: r
		}), e.setCoords());
	}
	_readFinalGeometry({ target: e }) {
		let t = z({ object: e });
		if (!t) throw Error("Object movement snapping requires exact final bounds");
		return {
			bounds: t,
			position: this._readTargetPosition({ target: e })
		};
	}
	_readTargetPosition({ target: e }) {
		if (!Number.isFinite(e.left) || !Number.isFinite(e.top)) throw Error("Object movement snapping requires finite target position");
		return {
			left: e.left,
			top: e.top
		};
	}
	_captureEnvironment({ activeObject: e }) {
		let t = this._collectCandidateSources({ activeObject: e }), n = z({ object: this._editor.montageArea });
		return n && t.push({
			id: "montage-area",
			bounds: n,
			edgeCategory: "domain-boundary"
		}), f_({
			sources: t,
			zoom: this._editor.canvas.getZoom() || 1
		});
	}
	_collectCandidateSources({ activeObject: e }) {
		let t = Kv({ activeObject: e }), n = [];
		return this._editor.canvas.forEachObject((e) => {
			if (qv({
				object: e,
				excluded: t
			})) return;
			let r = z({ object: e });
			r && n.push({
				id: `object:${n.length}:${e.id ?? e.type}`,
				bounds: r,
				useForSpacing: !0
			});
		}), n;
	}
};
function Xv({ event: e }) {
	let { e: t } = e;
	return typeof t == "object" && t || typeof t == "function" ? t : e;
}
function Zv({ duplicate: e }) {
	if (!e.verification) throw Error("Duplicate movement step cannot be handled before verification");
	return Qv({ verification: e.verification });
}
function Qv({ verification: e }) {
	return Object.freeze({
		handled: !0,
		guides: Object.freeze(Rv({ guides: e.guides })),
		spacingGuides: Object.freeze([...e.spacingGuides])
	});
}
//#endregion
//#region src/editor/utils/render-utils.ts
var $v = ({ context: e, x: t, y: n, width: r, height: i, radius: a }) => {
	let o = Math.min(a, r / 2, i / 2);
	e.moveTo(t + o, n), e.lineTo(t + r - o, n), e.quadraticCurveTo(t + r, n, t + r, n + o), e.lineTo(t + r, n + i - o), e.quadraticCurveTo(t + r, n + i, t + r - o, n + i), e.lineTo(t + o, n + i), e.quadraticCurveTo(t, n + i, t, n + i - o), e.lineTo(t, n + o), e.quadraticCurveTo(t, n, t + o, n), e.closePath();
}, ey = ({ context: e, type: t, axis: n, start: r, end: i, text: a, zoom: o, color: s, textColor: c = "#ffffff", fontFamily: l = "sans-serif", lineWidth: u = 1, padding: d = 4, radius: f = 4, offsetAlongAxis: p = 0, offsetPerpendicular: m = 0 }) => {
	let h = o || 1, g = 12 / h, _ = d / h, v = f / h, y = (r + i) / 2 + p, b = t === "vertical" ? n + m : y, x = t === "vertical" ? y : n + m;
	e.save(), e.setLineDash([]), e.fillStyle = s, e.strokeStyle = s, e.lineWidth = u / h, e.font = `${g}px ${l}`, e.textAlign = "center", e.textBaseline = "middle";
	let S = e.measureText(a).width + _ * 2, C = g + _ * 2, w = b - S / 2, T = x - C / 2;
	e.beginPath(), $v({
		context: e,
		x: w,
		y: T,
		width: S,
		height: C,
		radius: v
	}), e.fill(), e.fillStyle = c, e.fillText(a, b, x), e.restore();
};
//#endregion
//#region src/editor/snapping-manager/guides/renderer.ts
function ty({ canvas: e, guideBounds: t, guides: n, spacingGuides: r }) {
	if (!n.length && !r.length) return;
	let i = e.getSelectionContext();
	if (!i) return;
	let a = t ?? ny({ canvas: e }), { viewportTransform: o } = e, s = e.getZoom() || 1;
	i.save();
	try {
		Array.isArray(o) && i.transform(...o), i.lineWidth = 1 / s, i.strokeStyle = Bd, i.setLineDash([4, 4]), ry({
			context: i,
			bounds: a,
			guides: n
		}), iy({
			context: i,
			zoom: s,
			guides: r
		});
	} finally {
		i.restore();
	}
}
function ny({ canvas: e }) {
	let { viewportTransform: t } = e, n = e.getWidth(), r = e.getHeight(), [i = 1, , , a = 1, o = 0, s = 0] = t ?? [];
	return {
		left: (0 - o) / i,
		top: (0 - s) / a,
		right: (n - o) / i,
		bottom: (r - s) / a
	};
}
function ry({ context: e, bounds: t, guides: n }) {
	let { left: r, right: i, top: a, bottom: o } = t;
	for (let t of n) e.beginPath(), t.type === "vertical" ? (e.moveTo(t.position, a), e.lineTo(t.position, o)) : (e.moveTo(r, t.position), e.lineTo(i, t.position)), e.stroke();
}
function iy({ context: e, zoom: t, guides: n }) {
	for (let r of n) ay({
		context: e,
		guide: r,
		zoom: t,
		distanceLabel: og({ distance: r.distance }).toString()
	});
}
var ay = ({ context: e, guide: t, zoom: n, distanceLabel: r }) => {
	let { type: i, axis: a, refStart: o, refEnd: s, activeStart: c, activeEnd: l } = t;
	e.beginPath(), i === "vertical" ? (e.moveTo(a, o), e.lineTo(a, s), e.moveTo(a, c), e.lineTo(a, l)) : (e.moveTo(o, a), e.lineTo(s, a), e.moveTo(c, a), e.lineTo(l, a)), e.stroke();
	let u = Bd;
	ey({
		context: e,
		type: i,
		axis: a,
		start: o,
		end: s,
		text: r,
		zoom: n,
		color: u,
		lineWidth: 1
	}), ey({
		context: e,
		type: i,
		axis: a,
		start: c,
		end: l,
		text: r,
		zoom: n,
		color: u,
		lineWidth: 1
	});
}, oy = .1;
function sy({ bounds: e, snapGuard: t }) {
	let { edge: n, position: r } = t;
	return Math.abs(n === "left" ? e.left - r : n === "right" ? e.right - r : n === "top" ? e.top - r : e.bottom - r);
}
function cy({ bounds: e, snapGuard: t }) {
	let { edge: n, position: r } = t;
	return n === "left" ? e.left >= r - oy : n === "right" ? e.right <= r + oy : n === "top" ? e.top >= r - oy : e.bottom <= r + oy;
}
function ly({ bounds: e, snapGuard: t }) {
	return sy({
		bounds: e,
		snapGuard: t
	}) <= oy;
}
//#endregion
//#region src/editor/snapping-manager/scaling/scaling-step-snap-guards.ts
var uy = .5, dy = 1e-6, fy = .02, py = 1e-6;
function my({ target: e, transform: t, rawScaleX: n, rawScaleY: r, effectiveWidth: i, effectiveHeight: a, fallbackScale: o, isUniform: s, preservePlacement: c, snapGuards: l }) {
	return hy({
		target: e,
		transform: t,
		rawScaleX: n,
		rawScaleY: r,
		effectiveWidth: i,
		effectiveHeight: a,
		preservePlacement: c,
		snapGuards: l
	}) || (Ty({
		target: e,
		rawScaleX: n,
		rawScaleY: r,
		effectiveWidth: i,
		effectiveHeight: a,
		candidates: Ky({
			rawScaleX: n,
			rawScaleY: r,
			effectiveWidth: i,
			effectiveHeight: a,
			isUniform: s
		}),
		preservePlacement: c,
		shouldPreferInsideCandidate: Ry({
			target: e,
			snapGuards: l
		}),
		snapGuards: l
	}) ?? o);
}
function hy({ target: e, transform: t, rawScaleX: n, rawScaleY: r, effectiveWidth: i, effectiveHeight: a, preservePlacement: o, snapGuards: s }) {
	return zy({
		target: e,
		snapGuards: s
	}) ? {
		scaleX: n,
		scaleY: r
	} : _y({
		target: e,
		effectiveWidth: i,
		effectiveHeight: a,
		transform: t,
		preservePlacement: o,
		snapGuards: s
	}) || gy({
		target: e,
		rawScaleX: n,
		rawScaleY: r,
		effectiveWidth: i,
		effectiveHeight: a,
		preservePlacement: o,
		snapGuards: s
	});
}
function gy({ target: e, rawScaleX: t, rawScaleY: n, effectiveWidth: r, effectiveHeight: i, preservePlacement: a, snapGuards: o }) {
	if (!By({
		target: e,
		snapGuards: o
	}) || Vy({
		target: e,
		snapGuards: o
	})) return null;
	let s = {
		scaleX: t,
		scaleY: n
	};
	return !vy({
		target: e,
		candidate: s,
		preservePlacement: a,
		maxDistance: uy,
		snapGuards: o
	}) || !by({
		target: e,
		candidate: s,
		effectiveWidth: r,
		effectiveHeight: i,
		snapGuards: o
	}) ? null : s;
}
function _y({ target: e, transform: t, effectiveWidth: n, effectiveHeight: r, preservePlacement: i, snapGuards: a }) {
	if (!Ry({
		target: e,
		snapGuards: a
	})) return null;
	let { scaleX: o, scaleY: s } = t?.original ?? {};
	if (typeof o != "number" || typeof s != "number" || !Number.isFinite(o) || !Number.isFinite(s)) return null;
	let c = {
		scaleX: o,
		scaleY: s
	}, l = vy({
		target: e,
		candidate: c,
		preservePlacement: i,
		snapGuards: a
	}), u = yy({
		target: e,
		candidate: c,
		effectiveWidth: n,
		effectiveHeight: r,
		snapGuards: a
	});
	return !l || !u ? null : c;
}
function vy({ target: e, candidate: t, preservePlacement: n, maxDistance: r = 1, snapGuards: i }) {
	let a = Qy({
		target: e,
		candidate: t,
		preservePlacement: n
	});
	if (!a) return !1;
	for (let e of i) if (sy({
		bounds: a,
		snapGuard: e
	}) > r) return !1;
	return !0;
}
function yy({ target: e, candidate: t, effectiveWidth: n, effectiveHeight: r, snapGuards: i }) {
	return xy({
		target: e,
		candidate: t,
		effectiveWidth: n,
		effectiveHeight: r,
		snapGuards: i,
		shouldRoundSourceLimit: !1
	});
}
function by({ target: e, candidate: t, effectiveWidth: n, effectiveHeight: r, snapGuards: i }) {
	return xy({
		target: e,
		candidate: t,
		effectiveWidth: n,
		effectiveHeight: r,
		snapGuards: i,
		shouldRoundSourceLimit: !0
	});
}
function xy({ target: e, candidate: t, effectiveWidth: n, effectiveHeight: r, snapGuards: i, shouldRoundSourceLimit: a }) {
	for (let o of i) {
		let i = Sy({
			candidate: t,
			effectiveWidth: n,
			effectiveHeight: r,
			snapGuard: o
		});
		if (!(a ? wy({
			target: e,
			displaySize: i,
			snapGuard: o
		}) : Py({
			target: e,
			displaySize: i,
			snapGuard: o
		}))) return !1;
	}
	return !0;
}
function Sy({ candidate: e, effectiveWidth: t, effectiveHeight: n, snapGuard: r }) {
	return r.type === "vertical" ? Math.abs(e.scaleX) * t : Math.abs(e.scaleY) * n;
}
function Cy({ rawScaleX: e, rawScaleY: t, effectiveWidth: n, effectiveHeight: r, snapGuard: i }) {
	return i.type === "vertical" ? Math.abs(e) * n : Math.abs(t) * r;
}
function wy({ target: e, displaySize: t, snapGuard: n }) {
	let r = Iy({
		target: e,
		snapGuard: n
	});
	if (r === null) return !1;
	let i = Math.round(r + dy);
	return Math.round(t) <= i;
}
function Ty({ target: e, rawScaleX: t, rawScaleY: n, effectiveWidth: r, effectiveHeight: i, candidates: a, preservePlacement: o, shouldPreferInsideCandidate: s, snapGuards: c }) {
	if (!s) return Ey({
		target: e,
		candidates: a,
		preservePlacement: o,
		snapGuards: c
	});
	let { insideCandidate: l, onGuideCandidate: u } = Dy({
		target: e,
		candidates: a,
		preservePlacement: o,
		snapGuards: c
	});
	return u && Ay({
		target: e,
		candidate: u,
		rawScaleX: t,
		rawScaleY: n,
		effectiveWidth: r,
		effectiveHeight: i,
		snapGuards: c
	}) ? u : l || u || null;
}
function Ey({ target: e, candidates: t, preservePlacement: n, snapGuards: r }) {
	let i = null;
	for (let a of t) {
		let t = Zy({
			target: e,
			candidate: a,
			preservePlacement: n,
			snapGuards: r
		});
		if (t.state === "on-guide") return a;
		t.state === "inside" && !i && (i = a);
	}
	return i;
}
function Dy({ target: e, candidates: t, preservePlacement: n, snapGuards: r }) {
	let i = t.map((t) => ({
		candidate: t,
		snapMatch: Zy({
			target: e,
			candidate: t,
			preservePlacement: n,
			snapGuards: r
		})
	}));
	return {
		insideCandidate: ky({ matches: i }),
		onGuideCandidate: Oy({ matches: i })
	};
}
function Oy({ matches: e }) {
	return e.find((e) => e.snapMatch.state === "on-guide")?.candidate ?? null;
}
function ky({ matches: e }) {
	let t = null, n = Infinity;
	for (let { candidate: r, snapMatch: i } of e) i.state === "inside" && (i.distance >= n || (t = r, n = i.distance));
	return t;
}
function Ay({ target: e, candidate: t, rawScaleX: n, rawScaleY: r, effectiveWidth: i, effectiveHeight: a, snapGuards: o }) {
	for (let s of o) if (!jy({
		target: e,
		candidate: t,
		rawScaleX: n,
		rawScaleY: r,
		effectiveWidth: i,
		effectiveHeight: a,
		snapGuard: s
	})) return !1;
	return !0;
}
function jy({ target: e, candidate: t, rawScaleX: n, rawScaleY: r, effectiveWidth: i, effectiveHeight: a, snapGuard: o }) {
	let s = Sy({
		candidate: t,
		effectiveWidth: i,
		effectiveHeight: a,
		snapGuard: o
	}), c = Cy({
		rawScaleX: n,
		rawScaleY: r,
		effectiveWidth: i,
		effectiveHeight: a,
		snapGuard: o
	});
	return !My({ displaySize: s }) || !Ny({
		displaySize: s,
		rawDisplaySize: c
	}) ? !1 : Py({
		target: e,
		displaySize: s,
		snapGuard: o
	});
}
function My({ displaySize: e }) {
	return Math.abs(e - Math.round(e)) <= dy;
}
function Ny({ displaySize: e, rawDisplaySize: t }) {
	return Math.abs(e - t) <= fy;
}
function Py({ target: e, displaySize: t, snapGuard: n }) {
	let r = Fy({
		target: e,
		snapGuard: n
	});
	return r === null ? !1 : Math.round(t) <= r;
}
function Fy({ target: e, snapGuard: t }) {
	let n = Iy({
		target: e,
		snapGuard: t
	});
	return n === null ? null : Math.round(n + dy);
}
function Iy({ target: e, snapGuard: t }) {
	let n = e, { cropSource: r } = n;
	if (!r) return null;
	let i = z({ object: r });
	if (!i) return null;
	let a = t.type === "vertical" ? Math.abs(n.cropSourceScaleX ?? 1) : Math.abs(n.cropSourceScaleY ?? 1);
	if (!Number.isFinite(a) || a <= 0) return null;
	let o = Ly({
		sourceBounds: i,
		snapGuard: t
	});
	return !Number.isFinite(o) || o <= 0 ? null : o / a;
}
function Ly({ sourceBounds: e, snapGuard: t }) {
	let { edge: n, position: r } = t;
	return n === "left" ? e.right - r : n === "right" ? r - e.left : n === "top" ? e.bottom - r : r - e.top;
}
function Ry({ target: e, snapGuards: t }) {
	return By({
		target: e,
		snapGuards: t
	}) ? !Vy({
		target: e,
		snapGuards: t
	}) : !1;
}
function zy({ target: e, snapGuards: t }) {
	if (By({
		target: e,
		snapGuards: t
	})) return !1;
	let n = kr({ object: e });
	if (!n) return !1;
	for (let e of t) if (!ly({
		bounds: n,
		snapGuard: e
	}) || !Gy({
		bounds: n,
		snapGuard: e
	})) return !1;
	return !0;
}
function By({ target: e, snapGuards: t }) {
	if (typeof e.getObjectDisplaySize != "function") return !1;
	let n = e, r = t.some((e) => e.type === "vertical" && !Wy({ scale: n.cropSourceScaleX })), i = t.some((e) => e.type === "horizontal" && !Wy({ scale: n.cropSourceScaleY }));
	return r || i;
}
function Vy({ target: e, snapGuards: t }) {
	let { cropSource: n } = e;
	if (!n) return !1;
	let r = kr({ object: n });
	return r ? t.some((e) => Hy({
		snapGuard: e,
		sourceBounds: r
	})) : !1;
}
function Hy({ snapGuard: e, sourceBounds: t }) {
	let { edge: n, position: r } = e, i = t.bottom;
	return n === "left" && (i = t.left), n === "right" && (i = t.right), n === "top" && (i = t.top), Uy({
		position: r,
		boundary: i
	});
}
function Uy({ position: e, boundary: t }) {
	return Math.abs(e - t) <= oy;
}
function Wy({ scale: e }) {
	return Math.abs(Math.abs(e ?? 1) - 1) <= py;
}
function Gy({ bounds: e, snapGuard: t }) {
	let n = t.type === "vertical" ? e.right - e.left : e.bottom - e.top;
	return !Number.isFinite(n) || n <= 0 ? !1 : Math.round(n) > 0;
}
function Ky({ rawScaleX: e, rawScaleY: t, effectiveWidth: n, effectiveHeight: r, isUniform: i }) {
	let a = qy({
		rawScale: e,
		effectiveSize: n
	}), o = qy({
		rawScale: t,
		effectiveSize: r
	});
	return i ? Yy({
		scaleXCandidates: a,
		scaleYCandidates: o,
		rawScale: e
	}) : Xy({
		scaleXCandidates: a,
		scaleYCandidates: o,
		rawScaleX: e,
		rawScaleY: t
	});
}
function qy({ rawScale: e, effectiveSize: t }) {
	if (t <= 0) return [e];
	let n = e < 0 ? -1 : 1, r = Math.abs(e) * t, i = Math.round(r), a = Math.floor(r), o = Math.ceil(r), s = [
		i,
		a,
		o,
		a - 1,
		o + 1
	], c = [];
	for (let e of s) Jy({
		candidates: c,
		scale: Math.max(1, e) / t * n
	});
	return c.sort((t, n) => Math.abs(t - e) - Math.abs(n - e)), c;
}
function Jy({ candidates: e, scale: t }) {
	Number.isFinite(t) && (e.includes(t) || e.push(t));
}
function Yy({ scaleXCandidates: e, scaleYCandidates: t, rawScale: n }) {
	let r = [...e];
	for (let e of t) Jy({
		candidates: r,
		scale: e
	});
	return r.sort((e, t) => Math.abs(e - n) - Math.abs(t - n)), r.map((e) => ({
		scaleX: e,
		scaleY: e
	}));
}
function Xy({ scaleXCandidates: e, scaleYCandidates: t, rawScaleX: n, rawScaleY: r }) {
	let i = [];
	for (let n of e) for (let e of t) i.push({
		scaleX: n,
		scaleY: e
	});
	return i.sort((e, t) => Math.abs(e.scaleX - n) + Math.abs(e.scaleY - r) - (Math.abs(t.scaleX - n) + Math.abs(t.scaleY - r))), i;
}
function Zy({ target: e, candidate: t, preservePlacement: n, snapGuards: r }) {
	let i = Qy({
		target: e,
		candidate: t,
		preservePlacement: n
	});
	return i ? $y({
		bounds: i,
		snapGuards: r
	}) : {
		state: "outside",
		distance: Infinity
	};
}
function Qy({ target: e, candidate: t, preservePlacement: n }) {
	let r = e.scaleX ?? 1, i = e.scaleY ?? 1, a = null;
	try {
		e.set({
			scaleX: t.scaleX,
			scaleY: t.scaleY
		}), n ? n.applyPlacement(n.placement) : e.setCoords(), a = kr({ object: e });
	} finally {
		e.set({
			scaleX: r,
			scaleY: i
		}), n ? n.applyPlacement(n.placement) : e.setCoords();
	}
	return a;
}
function $y({ bounds: e, snapGuards: t }) {
	let n = !0, r = 0;
	for (let i of t) {
		if (!cy({
			bounds: e,
			snapGuard: i
		})) return {
			state: "outside",
			distance: Infinity
		};
		ly({
			bounds: e,
			snapGuard: i
		}) || (n = !1), r = Math.max(r, sy({
			bounds: e,
			snapGuard: i
		}));
	}
	return {
		state: n ? "on-guide" : "inside",
		distance: r
	};
}
//#endregion
//#region src/editor/snapping-manager/pixel-grid.ts
function eb({ target: e }) {
	let t = typeof e.type == "string" ? e.type.toLowerCase() : "", n = e instanceof _ || t === "textbox" || t === "background-textbox";
	return !(e instanceof a) && !n;
}
function tb({ target: e, transform: t, roundX: n = !0, roundY: r = !0 }) {
	if (!n && !r) return;
	let { left: i = 0, top: a = 0 } = e, o = typeof t?.original?.left == "number" ? t.original.left : null, s = typeof t?.original?.top == "number" ? t.original.top : null;
	nb({
		target: e,
		left: i,
		top: a,
		shouldSnapX: n && (o === null || o !== i),
		shouldSnapY: r && (s === null || s !== a)
	});
}
function nb({ target: e, left: t, top: n, shouldSnapX: r, shouldSnapY: i }) {
	let a = Math.round(t / 1) * 1, o = Math.round(n / 1) * 1, s = {};
	r && a !== t && (s.left = a), i && o !== n && (s.top = o), !(!("left" in s) && !("top" in s)) && (e.set(s), e.setCoords());
}
function rb({ target: e }) {
	let { width: t = 0, height: n = 0, paddingTop: r = 0, paddingRight: i = 0, paddingBottom: a = 0, paddingLeft: o = 0, strokeWidth: s = 0 } = e;
	return {
		width: t + o + i + s,
		height: n + r + a + s
	};
}
function ib({ target: e, scaleX: t, scaleY: n }) {
	let r = e.getObjectDisplaySize?.();
	if (!r) return null;
	let i = Math.abs(t), a = Math.abs(n);
	return i <= 0 || a <= 0 || !Number.isFinite(r.width) || !Number.isFinite(r.height) || r.width <= 0 || r.height <= 0 ? null : {
		width: r.width / i,
		height: r.height / a
	};
}
function ab({ target: e, scaleX: t, scaleY: n }) {
	let r = ib({
		target: e,
		scaleX: t,
		scaleY: n
	});
	if (r) return r;
	if (e instanceof _) return rb({ target: e });
	let { width: i = 0, height: a = 0, strokeWidth: o = 0, strokeUniform: s = !1 } = e, c = s ? 0 : o;
	return {
		width: i + c,
		height: a + c
	};
}
function ob({ target: e, transform: t, preservePlacement: n, snapGuards: r = [] }) {
	let { scaleX: i = 1, scaleY: a = 1 } = e, o = sb({
		transform: t,
		rawScaleX: i,
		rawScaleY: a
	});
	if (!o.shouldRoundScaleX && !o.shouldRoundScaleY) return;
	let { width: s, height: c } = ab({
		target: e,
		scaleX: i,
		scaleY: a
	}), l = cb({
		rawScaleX: i,
		rawScaleY: a,
		snappedScale: db({
			target: e,
			transform: t,
			rawScaleX: i,
			rawScaleY: a,
			effectiveWidth: s,
			effectiveHeight: c,
			preservePlacement: n,
			snapGuards: r
		}),
		roundingState: o
	});
	l.scaleX === i && l.scaleY === a || lb({
		target: e,
		transform: t,
		preservePlacement: n,
		scale: l
	});
}
function sb({ transform: e, rawScaleX: t, rawScaleY: n }) {
	return {
		shouldRoundScaleX: ub({
			transform: e,
			axis: "x",
			rawScale: t
		}),
		shouldRoundScaleY: ub({
			transform: e,
			axis: "y",
			rawScale: n
		})
	};
}
function cb({ rawScaleX: e, rawScaleY: t, snappedScale: n, roundingState: r }) {
	let i = { ...n };
	return r.shouldRoundScaleX || (i.scaleX = e), r.shouldRoundScaleY || (i.scaleY = t), i;
}
function lb({ target: e, transform: t, preservePlacement: n, scale: r }) {
	e.set({
		scaleX: r.scaleX,
		scaleY: r.scaleY
	}), n && n.applyPlacement(n.placement), t && (t.scaleX = r.scaleX, t.scaleY = r.scaleY), e.setCoords();
}
function ub({ transform: e, axis: t, rawScale: n }) {
	if (!e) return !0;
	let r = t === "x" ? e.original?.scaleX : e.original?.scaleY;
	return typeof r == "number" ? r !== n : !0;
}
function db({ target: e, transform: t, rawScaleX: n, rawScaleY: r, effectiveWidth: i, effectiveHeight: a, preservePlacement: o, snapGuards: s }) {
	let c = fb({
		rawScaleX: n,
		rawScaleY: r,
		effectiveWidth: i,
		effectiveHeight: a
	});
	return s.length === 0 ? c : my({
		target: e,
		transform: t,
		rawScaleX: n,
		rawScaleY: r,
		effectiveWidth: i,
		effectiveHeight: a,
		fallbackScale: c,
		isUniform: n === r,
		preservePlacement: o,
		snapGuards: s
	});
}
function fb({ rawScaleX: e, rawScaleY: t, effectiveWidth: n, effectiveHeight: r }) {
	return e === t ? pb({
		rawScale: e,
		effectiveWidth: n,
		effectiveHeight: r
	}) : {
		scaleX: mb({
			rawScale: e,
			effectiveSize: n
		}),
		scaleY: mb({
			rawScale: t,
			effectiveSize: r
		})
	};
}
function pb({ rawScale: e, effectiveWidth: t, effectiveHeight: n }) {
	let r = mb({
		rawScale: e,
		effectiveSize: t
	}), i = mb({
		rawScale: e,
		effectiveSize: n
	}), a = Math.abs(r - e) <= Math.abs(i - e) ? r : i;
	return {
		scaleX: a,
		scaleY: a
	};
}
function mb({ rawScale: e, effectiveSize: t }) {
	return t <= 0 ? e : Math.max(1, Math.round(t * e)) / t;
}
//#endregion
//#region src/editor/crop-manager/domain/crop-resize-mode.ts
var hb = [
	"scale",
	"scaleX",
	"scaleY"
], gb = [
	"tl",
	"tr",
	"bl",
	"br",
	"ml",
	"mr",
	"mt",
	"mb"
];
function _b({ target: e, shiftKey: t = !1 }) {
	let n = e, r = n.cropActiveResizePreserveAspectRatio;
	if (typeof r == "boolean") return r;
	let i = n.preserveAspectRatio ?? !0;
	return t ? !i : i;
}
function vb({ transform: e }) {
	if (!e) return !1;
	let { action: t, corner: n } = e;
	return !!(t && hb.includes(t) || n && gb.includes(n));
}
//#endregion
//#region src/editor/snapping-manager/scaling/legacy-scale-snapping.ts
var yb = 1e-6;
function bb({ transform: e }) {
	let { corner: t = "", action: n = "" } = e, r = t === "ml" || t === "mr" || n === "scaleX", i = t === "mt" || t === "mb" || n === "scaleY", a = t === "tl" || t === "tr" || t === "bl" || t === "br" || n === "scale";
	return {
		isCornerHandle: a,
		shouldSnapX: r || a,
		shouldSnapY: i || a
	};
}
function xb({ target: e, transform: t }) {
	let { originX: n, originY: r } = t, { originX: i = "left", originY: a = "top", scaleX: o = 1, scaleY: s = 1 } = e;
	return {
		originX: n ?? i,
		originY: r ?? a,
		scaleX: o,
		scaleY: s
	};
}
function Sb({ target: e, event: t, isCornerHandle: n }) {
	return e.cropSource ? _b({
		target: e,
		shiftKey: t.e?.shiftKey
	}) : n;
}
function Cb({ bounds: e, corner: t, originX: n, originY: r, shouldSnapX: i, shouldSnapY: a, threshold: o, anchors: s }) {
	let c = Bb({
		bounds: e,
		corner: t,
		originX: n,
		shouldSnapX: i
	}), l = Vb({
		bounds: e,
		corner: t,
		originY: r,
		shouldSnapY: a
	}), u = Wb({
		anchors: s.vertical,
		candidates: c,
		threshold: o
	}), d = Wb({
		anchors: s.horizontal,
		candidates: l,
		threshold: o
	});
	return u.guidePosition === null && d.guidePosition === null ? null : {
		verticalSnap: u,
		horizontalSnap: d
	};
}
function wb(e) {
	return e.shouldUseUniformScaleSnap ? Eb(e) : Lb(e);
}
function Tb({ target: e, bounds: t, originX: n, verticalAnchors: r, threshold: i }) {
	let a = Wb({
		anchors: r,
		candidates: Bb({
			bounds: t,
			originX: n,
			shouldSnapX: !0
		}),
		threshold: i
	}), { guidePosition: o } = a;
	if (o === null) return null;
	let s = $b({
		bounds: t,
		originX: n,
		snap: a
	});
	if (s === null) return null;
	let c = ax({
		target: e,
		boundsWidth: s
	});
	return c === null ? null : {
		nextWidth: c,
		guide: {
			type: "vertical",
			position: o
		}
	};
}
function Eb({ target: e, bounds: t, originX: n, originY: r, scaleX: i, scaleY: a, originalScaleX: o, originalScaleY: s, verticalSnap: c, horizontalSnap: l }) {
	let u = Gb({
		bounds: t,
		originX: n,
		originY: r,
		verticalSnap: c,
		horizontalSnap: l
	});
	if (!u) return null;
	let { guide: d, scaleFactor: f, snapGuards: p } = u, m = Db({
		target: e,
		bounds: t,
		originX: n,
		originY: r,
		scaleX: i,
		scaleY: a,
		originalScaleX: o,
		originalScaleY: s,
		snapGuards: p
	}) ?? f;
	return {
		guides: [d],
		snapGuards: p,
		nextScaleX: i * m,
		nextScaleY: a * m
	};
}
function Db({ target: e, bounds: t, originX: n, originY: r, scaleX: i, scaleY: a, originalScaleX: o, originalScaleY: s, snapGuards: c }) {
	if (!Ob({ target: e })) return null;
	let l = kb({
		scaleX: i,
		scaleY: a,
		originalScaleX: o,
		originalScaleY: s,
		snapGuards: c
	});
	return l === null || !Ib({
		bounds: jb({
			bounds: t,
			originX: n,
			originY: r,
			scaleFactor: l
		}),
		snapGuards: c
	}) ? null : l;
}
function Ob({ target: e }) {
	return !!e.cropSource;
}
function kb({ scaleX: e, scaleY: t, originalScaleX: n, originalScaleY: r, snapGuards: i }) {
	let a = [];
	for (let o of i) {
		let i = Ab({
			snapGuard: o,
			scaleX: e,
			scaleY: t,
			originalScaleX: n,
			originalScaleY: r
		});
		if (i === null) return null;
		a.push(i);
	}
	let [o] = a;
	if (o === void 0 || !Number.isFinite(o) || o <= 0) return null;
	for (let e of a) if (Math.abs(e - o) > yb) return null;
	return o;
}
function Ab({ snapGuard: e, scaleX: t, scaleY: n, originalScaleX: r, originalScaleY: i }) {
	let a = e.type === "vertical" ? t : n, o = e.type === "vertical" ? r : i;
	return typeof o != "number" || !Number.isFinite(o) || !Number.isFinite(a) || Math.abs(a) <= yb ? null : o / a;
}
function jb({ bounds: e, originX: t, originY: n, scaleFactor: r }) {
	let i = Mb({
		bounds: e,
		originX: t,
		scaleFactor: r
	}), a = Nb({
		bounds: e,
		originY: n,
		scaleFactor: r
	});
	return {
		...i,
		...a,
		centerX: i.left + (i.right - i.left) / 2,
		centerY: a.top + (a.bottom - a.top) / 2
	};
}
function Mb({ bounds: e, originX: t, scaleFactor: n }) {
	let { left: r, right: i, centerX: a } = e, o = (i - r) * n, s = Pb({ originX: t });
	return s === "right" ? {
		left: i - o,
		right: i
	} : s === "center" ? {
		left: a - o / 2,
		right: a + o / 2
	} : {
		left: r,
		right: r + o
	};
}
function Nb({ bounds: e, originY: t, scaleFactor: n }) {
	let { top: r, bottom: i, centerY: a } = e, o = (i - r) * n, s = Fb({ originY: t });
	return s === "bottom" ? {
		top: i - o,
		bottom: i
	} : s === "center" ? {
		top: a - o / 2,
		bottom: a + o / 2
	} : {
		top: r,
		bottom: r + o
	};
}
function Pb({ originX: e }) {
	return e === "center" || e === "right" ? e : "left";
}
function Fb({ originY: e }) {
	return e === "center" || e === "bottom" ? e : "top";
}
function Ib({ bounds: e, snapGuards: t }) {
	for (let n of t) if (sy({
		bounds: e,
		snapGuard: n
	}) > 1) return !1;
	return !0;
}
function Lb(e) {
	let t = Rb(e), n = zb(e);
	if (!t && !n) return null;
	let r = [], i = [], a = null, o = null;
	return t && (r.push(t.guide), i.push(t.snapGuard), a = t.nextScale), n && (r.push(n.guide), i.push(n.snapGuard), o = n.nextScale), {
		guides: r,
		snapGuards: i,
		nextScaleX: a,
		nextScaleY: o
	};
}
function Rb({ target: e, bounds: t, originX: n, scaleX: r, scaleY: i, verticalSnap: a }) {
	let { guidePosition: o } = a;
	if (o === null) return null;
	let s = $b({
		bounds: t,
		originX: n,
		snap: a
	});
	if (s === null) return null;
	let { angle: c = 0 } = e, { width: l, height: u } = tx({ target: e }), d = nx({
		desiredWidth: s,
		baseWidth: l,
		baseHeight: u,
		scaleY: Math.abs(i) || 1,
		angle: c
	});
	if (d === null) return null;
	let f = Yb({
		type: "vertical",
		snap: a
	});
	return f ? {
		nextScale: d * (r < 0 ? -1 : 1),
		snapGuard: f,
		guide: {
			type: "vertical",
			position: o
		}
	} : null;
}
function zb({ target: e, bounds: t, originY: n, scaleX: r, scaleY: i, horizontalSnap: a }) {
	let { guidePosition: o } = a;
	if (o === null) return null;
	let s = ex({
		bounds: t,
		originY: n,
		snap: a
	});
	if (s === null) return null;
	let { angle: c = 0 } = e, { width: l, height: u } = tx({ target: e }), d = rx({
		desiredHeight: s,
		baseWidth: l,
		baseHeight: u,
		scaleX: Math.abs(r) || 1,
		angle: c
	});
	if (d === null) return null;
	let f = Yb({
		type: "horizontal",
		snap: a
	});
	return f ? {
		nextScale: d * (i < 0 ? -1 : 1),
		snapGuard: f,
		guide: {
			type: "horizontal",
			position: o
		}
	} : null;
}
function Bb({ bounds: e, corner: t = "", originX: n, shouldSnapX: r }) {
	let i = [];
	if (!r) return i;
	let { left: a, right: o } = e, s = "left";
	(n === "center" || n === "right") && (s = n);
	let c = Hb({ controlKey: t });
	return c && s !== "center" ? (i.push({
		edge: c,
		position: c === "left" ? a : o
	}), i) : (s === "left" && i.push({
		edge: "right",
		position: o
	}), s === "right" && i.push({
		edge: "left",
		position: a
	}), s === "center" && (i.push({
		edge: "left",
		position: a
	}), i.push({
		edge: "right",
		position: o
	})), i);
}
function Vb({ bounds: e, corner: t = "", originY: n, shouldSnapY: r }) {
	let i = [];
	if (!r) return i;
	let { top: a, bottom: o } = e, s = "top";
	(n === "center" || n === "bottom") && (s = n);
	let c = Ub({ controlKey: t });
	return c && s !== "center" ? (i.push({
		edge: c,
		position: c === "top" ? a : o
	}), i) : (s === "top" && i.push({
		edge: "bottom",
		position: o
	}), s === "bottom" && i.push({
		edge: "top",
		position: a
	}), s === "center" && (i.push({
		edge: "top",
		position: a
	}), i.push({
		edge: "bottom",
		position: o
	})), i);
}
function Hb({ controlKey: e }) {
	return e === "tl" || e === "bl" || e === "ml" ? "left" : e === "tr" || e === "br" || e === "mr" ? "right" : null;
}
function Ub({ controlKey: e }) {
	return e === "tl" || e === "tr" || e === "mt" ? "top" : e === "bl" || e === "br" || e === "mb" ? "bottom" : null;
}
function Wb({ anchors: e, candidates: t, threshold: n }) {
	let r = 0, i = n + 1, a = null, o = null;
	for (let s of t) {
		let { position: t } = s;
		for (let c of e) {
			let e = Math.abs(c - t);
			e > n || e >= i || (r = c - t, i = e, a = c, o = s);
		}
	}
	return {
		delta: r,
		guidePosition: a,
		candidate: o
	};
}
function Gb({ bounds: e, originX: t, originY: n, verticalSnap: r, horizontalSnap: i }) {
	let a = Xb({
		bounds: e,
		originX: t,
		snap: r
	}), o = Zb({
		bounds: e,
		originY: n,
		snap: i
	}), s = Qb({
		scaleFactorX: a,
		scaleFactorY: o,
		verticalSnap: r,
		horizontalSnap: i
	}), c = null;
	if (s === "x" && (c = Kb({
		type: "vertical",
		scaleFactor: a,
		snap: r
	})), s === "y" && (c = Kb({
		type: "horizontal",
		scaleFactor: o,
		snap: i
	})), !c) return null;
	let l = qb({
		scaleFactor: c.scaleFactor,
		scaleFactorX: a,
		scaleFactorY: o,
		verticalSnap: r,
		horizontalSnap: i
	});
	return l.length === 0 ? null : {
		guide: c.guide,
		snapGuards: l,
		scaleFactor: c.scaleFactor
	};
}
function Kb({ type: e, scaleFactor: t, snap: n }) {
	let { guidePosition: r } = n;
	if (t === null || r === null) return null;
	let i = Yb({
		type: e,
		snap: n
	});
	return i ? {
		scaleFactor: t,
		snapGuard: i,
		guide: {
			type: e,
			position: r
		}
	} : null;
}
function qb({ scaleFactor: e, scaleFactorX: t, scaleFactorY: n, verticalSnap: r, horizontalSnap: i }) {
	let a = [];
	return Jb({
		snapGuards: a,
		scaleFactor: e,
		axisScaleFactor: t,
		type: "vertical",
		snap: r
	}), Jb({
		snapGuards: a,
		scaleFactor: e,
		axisScaleFactor: n,
		type: "horizontal",
		snap: i
	}), a;
}
function Jb({ snapGuards: e, scaleFactor: t, axisScaleFactor: n, type: r, snap: i }) {
	if (n === null || Math.abs(n - t) > yb) return;
	let a = Yb({
		type: r,
		snap: i
	});
	a && e.push(a);
}
function Yb({ type: e, snap: t }) {
	let { candidate: n, guidePosition: r } = t;
	return !n || r === null ? null : {
		type: e,
		edge: n.edge,
		position: r
	};
}
function Xb({ bounds: e, originX: t, snap: n }) {
	let { left: r, right: i } = e, a = i - r;
	if (n.guidePosition === null || a <= 0) return null;
	let o = $b({
		bounds: e,
		originX: t,
		snap: n
	});
	if (o === null) return null;
	let s = o / a;
	return !Number.isFinite(s) || s <= 0 ? null : s;
}
function Zb({ bounds: e, originY: t, snap: n }) {
	let { top: r, bottom: i } = e, a = i - r;
	if (n.guidePosition === null || a <= 0) return null;
	let o = ex({
		bounds: e,
		originY: t,
		snap: n
	});
	if (o === null) return null;
	let s = o / a;
	return !Number.isFinite(s) || s <= 0 ? null : s;
}
function Qb({ scaleFactorX: e, scaleFactorY: t, verticalSnap: n, horizontalSnap: r }) {
	return e !== null && t === null ? "x" : t !== null && e === null ? "y" : e === null || t === null ? null : Math.abs(n.delta) <= Math.abs(r.delta) ? "x" : "y";
}
function $b({ bounds: e, originX: t, snap: n }) {
	let { left: r, right: i, centerX: a } = e, { candidate: o, guidePosition: s } = n;
	if (!o || s === null) return null;
	let c = "left";
	(t === "center" || t === "right") && (c = t);
	let { edge: l } = o, u = null;
	return c !== "center" && l === "left" && (u = i - s), c !== "center" && l === "right" && (u = s - r), c === "center" && l === "left" && (u = (a - s) * 2), c === "center" && l === "right" && (u = (s - a) * 2), u === null || !Number.isFinite(u) || u <= 0 ? null : u;
}
function ex({ bounds: e, originY: t, snap: n }) {
	let { top: r, bottom: i, centerY: a } = e, { candidate: o, guidePosition: s } = n;
	if (!o || s === null) return null;
	let c = "top";
	(t === "center" || t === "bottom") && (c = t);
	let { edge: l } = o, u = null;
	return c !== "center" && l === "top" && (u = i - s), c !== "center" && l === "bottom" && (u = s - r), c === "center" && l === "top" && (u = (a - s) * 2), c === "center" && l === "bottom" && (u = (s - a) * 2), u === null || !Number.isFinite(u) || u <= 0 ? null : u;
}
function tx({ target: e }) {
	let { width: t = 0, height: n = 0 } = e, r = t, i = n;
	if (e instanceof _) {
		let { paddingTop: a = 0, paddingRight: o = 0, paddingBottom: s = 0, paddingLeft: c = 0, strokeWidth: l = 0 } = e;
		r = t + c + o + l, i = n + a + s + l;
	}
	return {
		width: r,
		height: i
	};
}
function nx({ desiredWidth: e, baseWidth: t, baseHeight: n, scaleY: r, angle: i }) {
	return ix({
		desiredSize: e,
		baseAxisSize: t,
		scaledCrossAxisSize: n * r,
		angle: i
	});
}
function rx({ desiredHeight: e, baseWidth: t, baseHeight: n, scaleX: r, angle: i }) {
	return ix({
		desiredSize: e,
		baseAxisSize: n,
		scaledCrossAxisSize: t * r,
		angle: i
	});
}
function ix({ desiredSize: e, baseAxisSize: t, scaledCrossAxisSize: n, angle: r }) {
	let i = r * Math.PI / 180, a = Math.abs(Math.cos(i)), o = Math.abs(Math.sin(i)), s = t * a, c = n * o;
	if (s <= 0) return null;
	let l = (e - c) / s;
	return !Number.isFinite(l) || l <= 0 ? null : l;
}
function ax({ target: e, boundsWidth: t }) {
	let { paddingLeft: n = 0, paddingRight: r = 0, strokeWidth: i = 0 } = e, a = t - n - r - i;
	return !Number.isFinite(a) || a <= 0 ? null : Math.max(1, Math.round(a));
}
//#endregion
//#region src/editor/snapping-manager/guides/anchor-buckets.ts
var ox = ({ anchors: e, bounds: t }) => {
	let { left: n, right: r, centerX: i, top: a, bottom: o, centerY: s } = t;
	e.vertical.push(n, i, r), e.horizontal.push(a, s, o);
}, sx = class {
	constructor({ canvas: e }) {
		this.canvas = e;
	}
	resolve({ activeObject: e, mode: t }) {
		let n = Kv({ activeObject: e }), r = [], i = [];
		this.canvas.forEachObject((e) => {
			qv({
				object: e,
				excluded: n
			}) || r.push(e);
		});
		for (let n = 0; n < r.length; n += 1) {
			let a = r[n], o = this._resolveBounds({
				activeObject: e,
				mode: t,
				object: a
			});
			o && i.push({
				bounds: o,
				object: a,
				snapshotIndex: n
			});
		}
		return i;
	}
	_resolveBounds({ activeObject: e, mode: t, object: n }) {
		return t === "exact" || this._isActiveCropSource({
			activeObject: e,
			object: n
		}) ? z({ object: n }) : kr({ object: n });
	}
	_isActiveCropSource({ activeObject: e, object: t }) {
		return e?.cropSource === t;
	}
}, cx = class {
	constructor({ editor: e }) {
		this.anchors = {
			vertical: [],
			horizontal: []
		}, this.anchorBoundsMode = null, this.spacingPatterns = {
			vertical: [],
			horizontal: []
		}, this.spacingContexts = {
			vertical: null,
			horizontal: null
		}, this.cachedTargetBounds = [], this.activeGuides = [], this.activeSpacingGuides = [], this.guideBounds = null, this.handledScaleStepEvents = /* @__PURE__ */ new WeakSet(), this.editor = e;
		let { canvas: t } = e;
		this.canvas = t, this.movementSnappingController = new Yv({ editor: e }), this.imageScaleSnappingController = new $g({ editor: e }), this.snapTargetResolver = new sx({ canvas: t }), this._onMouseDown = this._handleMouseDown.bind(this), this._onMouseMove = this._handleMouseMove.bind(this), this._onObjectMoving = this._handleObjectMoving.bind(this), this._onObjectScaling = this._handleObjectScaling.bind(this), this._onInteractionFinished = this._handleInteractionFinished.bind(this), this._onInteractionCancelled = this._handleInteractionCancelled.bind(this), this._onObjectRemoved = this._handleObjectRemoved.bind(this), this._onBeforeRender = this._handleBeforeRender.bind(this), this._onAfterRender = this._handleAfterRender.bind(this), this._bindEvents();
	}
	destroy() {
		this._unbindEvents(), this._finishSnappingInteraction();
	}
	captureScaleSnapEnvironment({ activeObject: e, targetEdges: t }) {
		let n = [], r = this.snapTargetResolver.resolve({
			activeObject: e,
			mode: "exact"
		});
		for (let { bounds: e, object: t, snapshotIndex: i } of r) n.push({
			id: `object:${i}:${t.id ?? t.type}`,
			bounds: e
		});
		let i = z({ object: this.editor.montageArea });
		return i && n.push({
			id: "montage-area",
			bounds: i,
			edgeCategory: "domain-boundary"
		}), Object.freeze({
			candidates: Kg({
				targetEdges: t,
				sources: n
			}),
			zoom: this.canvas.getZoom() || 1
		});
	}
	startRectangularScaleSnappingSession({ pointerStart: e, transform: t }) {
		t.target.setCoords();
		let n = rc({
			pointerStart: e,
			transform: t
		});
		if (!n) return null;
		let r = bc({ projection: n }), i = this.captureScaleSnapEnvironment({
			activeObject: t.target,
			targetEdges: xc({ projectionModes: r })
		}), a = gf({
			bounds: n.baselineBounds,
			fixedAnchor: n.fixedAnchor,
			projectionModes: r,
			candidates: i.candidates,
			zoom: i.zoom
		}), o = new sp();
		return o.startSession({ baseline: a }), Object.freeze({
			projection: n,
			runtime: o
		});
	}
	markScaleStepHandled({ marker: e }) {
		this.handledScaleStepEvents.add(e);
	}
	publishVerifiedScaleGuides({ guides: e }) {
		this._applyGuides({
			guides: e.map(({ axis: e, position: t }) => ({
				type: e === "x" ? "vertical" : "horizontal",
				position: t
			})),
			spacingGuides: []
		});
	}
	_bindEvents() {
		let { canvas: e } = this;
		e.on("mouse:down", this._onMouseDown), e.on("mouse:move", this._onMouseMove), e.on("object:moving", this._onObjectMoving), e.on("object:scaling", this._onObjectScaling), e.on("mouse:up", this._onInteractionFinished), e.on("object:removed", this._onObjectRemoved), e.on("selection:created", this._onInteractionFinished), e.on("selection:updated", this._onInteractionFinished), e.on("selection:cleared", this._onInteractionFinished), e.on("before:render", this._onBeforeRender), e.on("after:render", this._onAfterRender), window.addEventListener("pointercancel", this._onInteractionCancelled), window.addEventListener("touchcancel", this._onInteractionCancelled), window.addEventListener("blur", this._onInteractionCancelled);
	}
	_unbindEvents() {
		let { canvas: e } = this;
		e.off("mouse:down", this._onMouseDown), e.off("mouse:move", this._onMouseMove), e.off("object:moving", this._onObjectMoving), e.off("object:scaling", this._onObjectScaling), e.off("mouse:up", this._onInteractionFinished), e.off("object:removed", this._onObjectRemoved), e.off("selection:created", this._onInteractionFinished), e.off("selection:updated", this._onInteractionFinished), e.off("selection:cleared", this._onInteractionFinished), e.off("before:render", this._onBeforeRender), e.off("after:render", this._onAfterRender), window.removeEventListener("pointercancel", this._onInteractionCancelled), window.removeEventListener("touchcancel", this._onInteractionCancelled), window.removeEventListener("blur", this._onInteractionCancelled);
	}
	_handleMouseDown(e) {
		let { target: t } = e;
		this._clearGuides(), this._clearAnchors();
		let n = !this.imageScaleSnappingController.startGesture({ event: e }) && e.transform?.action === "drag" ? t : null;
		this.movementSnappingController.startGesture({ target: n }), t && this._cacheAnchors({
			activeObject: t,
			mode: "rounded"
		});
	}
	_handleMouseMove(e) {
		let t;
		try {
			t = this.imageScaleSnappingController.handleCanvasMouseMove({ event: e });
		} catch (e) {
			throw this._finishSnappingInteraction(), e;
		}
		if (t.handled) {
			t.shouldPublishGuides && this.publishVerifiedScaleGuides({ guides: t.guides });
			return;
		}
		t.didFinishSession && this._clearGuides();
	}
	_handleObjectMoving(e) {
		let t = this.movementSnappingController.handleObjectMoving({ event: e });
		if (t.handled) {
			this._applyGuides({
				guides: [...t.guides],
				spacingGuides: [...t.spacingGuides]
			});
			return;
		}
		let n = this._resolveObjectMovementContext({ event: e });
		n && this._applyObjectMovementSnap(n);
	}
	_resolveObjectMovementContext({ event: e }) {
		let { target: t, transform: n } = e;
		if (!t) return this._clearSpacingContexts(), this._clearGuides(), null;
		if (this._shouldAbortObjectMoving({ event: e })) return null;
		let { canSnapX: r, canSnapY: i } = this._resolveMovementSnapAxes({
			target: t,
			transform: n
		});
		if (!r && !i) return this._clearSpacingContexts(), this._clearGuides(), null;
		tb({
			target: t,
			transform: n,
			roundX: r,
			roundY: i
		}), this._ensureAnchorBounds({
			activeObject: t,
			mode: "exact"
		});
		let a = z({ object: t });
		return a ? {
			target: t,
			activeBounds: a,
			threshold: 5 / (this.canvas.getZoom() || 1),
			canSnapX: r,
			canSnapY: i
		} : (this._clearSpacingContexts(), this._clearGuides(), null);
	}
	_resolveMovementSnapAxes({ target: e, transform: t }) {
		let n = this.editor.cropManager.isFrameOverflowingSource({
			target: e,
			axis: "x"
		}), r = this.editor.cropManager.isFrameOverflowingSource({
			target: e,
			axis: "y"
		}), i = n || r, a = t?.original?.left, o = t?.original?.top, s = typeof a != "number" || e.left !== a, c = typeof o != "number" || e.top !== o;
		return {
			canSnapX: !n && (!i || s),
			canSnapY: !r && (!i || c)
		};
	}
	_applyObjectMovementSnap({ target: e, transform: t, activeBounds: n, threshold: r, canSnapX: i, canSnapY: a }) {
		let o = this._applyMovementGuideSnap({
			target: e,
			activeBounds: n,
			threshold: r,
			canSnapX: i,
			canSnapY: a
		}), s = this.snapTargetResolver.resolve({
			activeObject: e,
			mode: "exact"
		}).map(({ bounds: e }) => e), c = this._calculateSpacingResult({
			activeBounds: o.activeBounds,
			candidateBounds: s,
			threshold: r,
			canSnapX: i,
			canSnapY: a
		});
		this.spacingContexts = c.contexts;
		let l = c.deltaX !== 0 || c.deltaY !== 0, u = this._applyMovementDelta({
			target: e,
			activeBounds: o.activeBounds,
			deltaX: c.deltaX,
			deltaY: c.deltaY
		});
		l || tb({
			target: e,
			transform: t,
			roundX: i && !o.hasGuideSnapX,
			roundY: a && !o.hasGuideSnapY
		});
		let d = z({ object: e }) ?? u;
		this._applyMovementVisualGuides({
			activeBounds: d,
			candidateBounds: s,
			threshold: r,
			canSnapX: i,
			canSnapY: a
		});
	}
	_applyMovementGuideSnap({ target: e, activeBounds: t, threshold: n, canSnapX: r, canSnapY: i }) {
		let a = ag({
			activeBounds: t,
			threshold: n,
			anchors: {
				vertical: r ? this.anchors.vertical : [],
				horizontal: i ? this.anchors.horizontal : []
			}
		}), o = a.deltaX !== 0 || a.guides.some((e) => e.type === "vertical"), s = a.deltaY !== 0 || a.guides.some((e) => e.type === "horizontal");
		return {
			activeBounds: this._applyMovementDelta({
				target: e,
				activeBounds: t,
				deltaX: a.deltaX,
				deltaY: a.deltaY
			}),
			hasGuideSnapX: o,
			hasGuideSnapY: s
		};
	}
	_handleObjectScaling(e) {
		let t;
		try {
			t = this.imageScaleSnappingController.handleObjectScaling({ event: e });
		} catch (e) {
			throw this._finishSnappingInteraction(), e;
		}
		if (t.handled) {
			t.shouldPublishGuides && this.publishVerifiedScaleGuides({ guides: t.guides });
			return;
		}
		if (e.e && this.handledScaleStepEvents.has(e.e) || this.editor.textManager.handleStandaloneTextCornerScaling(e)) return;
		let n = this._resolveObjectScalingTargetContext({ event: e });
		if (!n) return;
		let r = this._resolveObjectScalingPlanContext(n);
		r && this._applyObjectScalingSnapPlan(r);
	}
	_resolveObjectScalingTargetContext({ event: e }) {
		let { target: t, transform: n } = e;
		if (!t || !n) return this._clearGuides(), null;
		let r = eb({ target: t });
		if (this._shouldAbortObjectScaling({
			target: t,
			transform: n,
			event: e,
			canApplyPixelScalingStep: r
		}) || !this._hasObjectScaleChanged({
			target: t,
			transform: n
		})) return this._clearGuides(), null;
		let { shouldSnapX: i, shouldSnapY: a, isCornerHandle: o } = bb({ transform: n });
		return !i && !a ? (this._finishObjectScalingWithoutSnap({
			target: t,
			transform: n,
			canApplyPixelScalingStep: r
		}), null) : (this._ensureAnchorBounds({
			activeObject: t,
			mode: "rounded"
		}), {
			event: e,
			target: t,
			transform: n,
			canApplyPixelScalingStep: r,
			isCornerHandle: o,
			shouldSnapX: i,
			shouldSnapY: a
		});
	}
	_resolveObjectScalingPlanContext(e) {
		let { event: t, target: n, transform: r, canApplyPixelScalingStep: i, isCornerHandle: a } = e, o = this._resolveObjectScalingSnapGeometry(e);
		if (!o) return null;
		let { activeBounds: s, originX: c, originY: l, scaleX: u, scaleY: d, snapState: f } = o, p = Sb({
			target: n,
			event: t,
			isCornerHandle: a
		}), m = wb({
			target: n,
			bounds: s,
			originX: c,
			originY: l,
			scaleX: u,
			scaleY: d,
			originalScaleX: r.original?.scaleX,
			originalScaleY: r.original?.scaleY,
			shouldUseUniformScaleSnap: p,
			verticalSnap: f.verticalSnap,
			horizontalSnap: f.horizontalSnap
		});
		return m ? {
			...e,
			originX: c,
			originY: l,
			shouldUseUniformScale: p,
			scalePlan: m
		} : (this._finishObjectScalingWithoutSnap({
			target: n,
			transform: r,
			canApplyPixelScalingStep: i
		}), null);
	}
	_resolveObjectScalingSnapGeometry(e) {
		let { target: t, transform: n, canApplyPixelScalingStep: r, shouldSnapX: i, shouldSnapY: a } = e, o = kr({ object: t });
		if (!o) return this._finishObjectScalingWithoutSnap({
			target: t,
			transform: n,
			canApplyPixelScalingStep: r
		}), null;
		let s = xb({
			target: t,
			transform: n
		}), { originX: c, originY: l } = s, u = Cb({
			bounds: o,
			corner: n.corner,
			originX: c,
			originY: l,
			shouldSnapX: i,
			shouldSnapY: a,
			threshold: 5 / (this.canvas.getZoom() || 1),
			anchors: this.anchors
		});
		return u ? {
			activeBounds: o,
			...s,
			snapState: u
		} : (this._finishObjectScalingWithoutSnap({
			target: t,
			transform: n,
			canApplyPixelScalingStep: r
		}), null);
	}
	_applyObjectScalingSnapPlan({ target: e, transform: t, originX: n, originY: r, canApplyPixelScalingStep: i, shouldUseUniformScale: a, scalePlan: o }) {
		let s = a ? this.editor.cropManager.applyFrameSourceBoundScalePlan({
			target: e,
			transform: t,
			nextScaleX: o.nextScaleX,
			nextScaleY: o.nextScaleY
		}) : !1;
		s || this._applyScaleUpdatePlan({
			target: e,
			transform: t,
			originX: n,
			originY: r,
			plan: o
		}), i && !s && this._applyObjectScalingPixelStep({
			target: e,
			transform: t,
			originX: n,
			originY: r,
			snapGuards: o.snapGuards
		}), this.editor.cropManager.restoreFrameScaleAnchorAfterSnap({
			target: e,
			transform: t
		}), !this._shouldHideOverflowingCropFrameGuides({ target: e }) && this._applyGuides({
			guides: o.guides,
			spacingGuides: []
		});
	}
	_applyObjectScalingPixelStep({ target: e, transform: t, originX: n, originY: r, snapGuards: i }) {
		ob({
			target: e,
			transform: t,
			preservePlacement: {
				placement: this.editor.canvasManager.getObjectPlacement({
					object: e,
					originX: n,
					originY: r
				}),
				applyPlacement: (t) => {
					this.editor.canvasManager.applyObjectPlacement({
						object: e,
						placement: t
					});
				}
			},
			snapGuards: i
		});
	}
	_shouldAbortObjectMoving({ event: e }) {
		return e.e?.ctrlKey ? (this._clearSpacingContexts(), this._clearGuides(), !0) : !1;
	}
	_shouldAbortObjectScaling({ target: e, transform: t, event: n, canApplyPixelScalingStep: r }) {
		return n.e?.ctrlKey ? (this._clearGuides(), r && ob({
			target: e,
			transform: t
		}), !0) : !1;
	}
	_finishObjectScalingWithoutSnap({ target: e, transform: t, canApplyPixelScalingStep: n }) {
		n && ob({
			target: e,
			transform: t
		}), this._clearGuides();
	}
	_hasObjectScaleChanged({ target: e, transform: t }) {
		let n = t.original?.scaleX, r = t.original?.scaleY;
		return typeof n != "number" || typeof r != "number" ? !0 : e.scaleX !== n || e.scaleY !== r;
	}
	_shouldHideOverflowingCropFrameGuides({ target: e }) {
		return this.editor.cropManager.isFrameOverflowingSource({ target: e }) ? (this._clearGuides(), !0) : !1;
	}
	_applyMovementDelta({ target: e, activeBounds: t, deltaX: n, deltaY: r }) {
		if (n === 0 && r === 0) return t;
		let { left: i = 0, top: a = 0 } = e;
		return e.set({
			left: i + n,
			top: a + r
		}), e.setCoords(), z({ object: e }) ?? t;
	}
	_calculateSpacingResult({ activeBounds: e, candidateBounds: t, threshold: n, canSnapX: r, canSnapY: i }) {
		let a = Gg({
			activeBounds: e,
			candidates: t,
			threshold: this.spacingContexts.vertical || this.spacingContexts.horizontal ? 10 / (this.canvas.getZoom() || 1) : n,
			spacingPatterns: this.spacingPatterns,
			previousContexts: this.spacingContexts,
			switchDistance: 5
		});
		return r || (a.deltaX = 0, a.guides = a.guides.filter((e) => e.type !== "horizontal"), a.contexts.horizontal = null), i || (a.deltaY = 0, a.guides = a.guides.filter((e) => e.type !== "vertical"), a.contexts.vertical = null), a;
	}
	_applyMovementVisualGuides({ activeBounds: e, candidateBounds: t, threshold: n, canSnapX: r, canSnapY: i }) {
		let a = ag({
			activeBounds: e,
			threshold: n,
			anchors: {
				vertical: r ? this.anchors.vertical : [],
				horizontal: i ? this.anchors.horizontal : []
			}
		}), o = Gg({
			activeBounds: e,
			candidates: t,
			threshold: n,
			spacingPatterns: this.spacingPatterns,
			previousContexts: this.spacingContexts,
			switchDistance: 5
		});
		r || (o.deltaX = 0, o.guides = o.guides.filter((e) => e.type !== "horizontal"), o.contexts.horizontal = null), i || (o.deltaY = 0, o.guides = o.guides.filter((e) => e.type !== "vertical"), o.contexts.vertical = null), this.spacingContexts = o.contexts;
		let s = o.deltaX === 0 && o.deltaY === 0;
		this._applyGuides({
			guides: a.guides,
			spacingGuides: s ? o.guides : []
		});
	}
	_applyScaleUpdatePlan({ target: e, transform: t, originX: n, originY: r, plan: i }) {
		let { nextScaleX: a, nextScaleY: o } = i;
		if (a === null && o === null) return;
		let s = this.editor.canvasManager.getObjectPlacement({
			object: e,
			originX: n,
			originY: r
		}), c = {};
		a !== null && (c.scaleX = a, t.scaleX = a), o !== null && (c.scaleY = o, t.scaleY = o), e.set(c), this.editor.canvasManager.applyObjectPlacement({
			object: e,
			placement: s
		}), e.setCoords();
	}
	applyTextResizingSnap({ target: e, transform: t, event: n }) {
		let r = this._resolveTextResizingTargetContext({
			target: e,
			transform: t,
			event: n
		});
		if (!r) return;
		let i = Tb({
			target: r.target,
			bounds: r.activeBounds,
			originX: r.originX,
			verticalAnchors: r.verticalAnchors,
			threshold: r.threshold
		});
		if (!i) {
			this._clearGuides();
			return;
		}
		this._applyTextResizingSnapPlan({
			context: r,
			snapPlan: i
		});
	}
	_resolveTextResizingTargetContext({ target: e, transform: t, event: n }) {
		if (!e || !(e instanceof _)) return null;
		if (!t || n?.ctrlKey) return this._clearGuides(), null;
		let { corner: r = "" } = t;
		if (r !== "ml" && r !== "mr") return this._clearGuides(), null;
		this._ensureAnchorBounds({
			activeObject: e,
			mode: "rounded"
		});
		let i = kr({ object: e });
		return i ? {
			target: e,
			activeBounds: i,
			originX: t.originX ?? e.originX ?? "left",
			originY: t.originY ?? e.originY ?? "top",
			verticalAnchors: this.anchors.vertical,
			threshold: 5 / (this.canvas.getZoom() || 1)
		} : (this._clearGuides(), null);
	}
	_applyTextResizingSnapPlan({ context: e, snapPlan: t }) {
		let { target: n, originX: r, originY: i } = e, { guide: a, nextWidth: o } = t, { width: s = 0 } = n;
		if (o !== s) {
			let e = this.editor.canvasManager.getObjectPlacement({
				object: n,
				originX: r,
				originY: i
			});
			n.set({ width: o }), this.editor.canvasManager.applyObjectPlacement({
				object: n,
				placement: e
			});
		}
		this._applyGuides({
			guides: [a],
			spacingGuides: []
		});
	}
	_handleInteractionFinished() {
		this._finishSnappingInteraction();
	}
	_handleInteractionCancelled(e) {
		let t = e.type === "blur" ? void 0 : e;
		this.imageScaleSnappingController.interruptGesture({ event: t }), this._finishSnappingInteraction();
	}
	_handleObjectRemoved(e) {
		let { target: t } = e;
		if (!t) return;
		let n = this.movementSnappingController.finishGestureForTarget({ target: t }), r = this.imageScaleSnappingController.finishGestureForTarget({ target: t });
		!n && !r || this._finishSnappingInteraction();
	}
	_finishSnappingInteraction() {
		this.movementSnappingController.finishGesture(), this.imageScaleSnappingController.finishGesture(), this._clearGuides(), this._clearAnchors();
	}
	_handleBeforeRender() {
		let { canvas: e } = this, { contextTop: t } = e;
		t && e.clearContext(t);
	}
	_handleAfterRender() {
		ty({
			canvas: this.canvas,
			guideBounds: this.guideBounds,
			guides: this.activeGuides,
			spacingGuides: this.activeSpacingGuides
		});
	}
	_applyGuides({ guides: e, spacingGuides: t }) {
		if (!e.length && !t.length) {
			this._clearGuides();
			return;
		}
		this.activeGuides = e, this.activeSpacingGuides = t, this.canvas.requestRenderAll();
	}
	_clearGuides() {
		!this.activeGuides.length && !this.activeSpacingGuides.length || (this.activeGuides = [], this.activeSpacingGuides = [], this.canvas.requestRenderAll());
	}
	_clearAnchors() {
		this.anchors = {
			vertical: [],
			horizontal: []
		}, this.anchorBoundsMode = null, this.spacingPatterns = {
			vertical: [],
			horizontal: []
		}, this.cachedTargetBounds = [], this._clearSpacingContexts();
	}
	_clearSpacingContexts() {
		this.spacingContexts = {
			vertical: null,
			horizontal: null
		};
	}
	_ensureAnchorBounds({ activeObject: e, mode: t }) {
		(this.anchors.vertical.length || this.anchors.horizontal.length) && this.anchorBoundsMode === t || this._cacheAnchors({
			activeObject: e,
			mode: t
		});
	}
	_cacheAnchors({ activeObject: e, mode: t }) {
		let n = this.snapTargetResolver.resolve({
			activeObject: e,
			mode: t
		}), r = {
			vertical: [],
			horizontal: []
		}, i = [];
		for (let { bounds: e } of n) ox({
			anchors: r,
			bounds: e
		}), i.push(e);
		let { montageArea: a } = this.editor, o = t === "exact" ? z({ object: a }) : kr({ object: a });
		if (o) {
			ox({
				anchors: r,
				bounds: o
			});
			let { left: e, right: t, top: n, bottom: i } = o;
			this.guideBounds = {
				left: e,
				right: t,
				top: n,
				bottom: i
			};
		} else this.guideBounds = ny({ canvas: this.canvas });
		this.anchors = r, this.anchorBoundsMode = t, this.spacingPatterns = v_({ bounds: i }), this.cachedTargetBounds = i;
	}
}, lx = "#3D8BF4", ux = class e {
	constructor({ editor: e }) {
		this.activeGuides = [], this.isAltPressed = !1, this.pendingEvent = null, this.frameRequest = null, this.isToolbarHidden = !1, this.isTargetMontageArea = !1, this.lastMouseEvent = null, this.editor = e, this.canvas = e.canvas, this._onMouseMove = this._handleMouseMove.bind(this), this._onBeforeRender = this._handleBeforeRender.bind(this), this._onAfterRender = this._handleAfterRender.bind(this), this._onSelectionCleared = this._handleSelectionCleared.bind(this), this._onKeyDown = this._handleKeyDown.bind(this), this._onKeyUp = this._handleKeyUp.bind(this), this._onWindowBlur = this._handleWindowBlur.bind(this), this._bindEvents();
	}
	destroy() {
		this._unbindEvents(), this._cancelScheduledUpdate(), this._clearGuides();
	}
	_bindEvents() {
		let { canvas: e } = this;
		e.on("mouse:move", this._onMouseMove), e.on("before:render", this._onBeforeRender), e.on("after:render", this._onAfterRender), e.on("selection:cleared", this._onSelectionCleared), window.addEventListener("keydown", this._onKeyDown), window.addEventListener("keyup", this._onKeyUp), window.addEventListener("blur", this._onWindowBlur);
	}
	_unbindEvents() {
		let { canvas: e } = this;
		e.off("mouse:move", this._onMouseMove), e.off("before:render", this._onBeforeRender), e.off("after:render", this._onAfterRender), e.off("selection:cleared", this._onSelectionCleared), window.removeEventListener("keydown", this._onKeyDown), window.removeEventListener("keyup", this._onKeyUp), window.removeEventListener("blur", this._onWindowBlur);
	}
	_handleKeyDown(e) {
		(e.altKey || e.key === "Alt") && (this.isAltPressed = !0, this.lastMouseEvent && (this.pendingEvent = this.lastMouseEvent, this._scheduleUpdate()));
	}
	_handleKeyUp(e) {
		this.isAltPressed && (e.key === "Alt" || !e.altKey) && (this.isAltPressed = !1, this._clearGuides());
	}
	_handleWindowBlur() {
		this.isAltPressed = !1, this._clearGuides();
	}
	_handleSelectionCleared() {
		this._clearGuides();
	}
	_handleMouseMove(e) {
		let { e: t } = e;
		this.lastMouseEvent = e;
		let n = !!t?.altKey;
		if (this.isAltPressed = n, !n) {
			this._clearGuides();
			return;
		}
		let { canvas: r } = this;
		if (!r.getActiveObjects().length) {
			this._clearGuides();
			return;
		}
		this._hideToolbar(), this.pendingEvent = e, this._scheduleUpdate();
	}
	_scheduleUpdate() {
		this.frameRequest === null && (this.frameRequest = window.requestAnimationFrame(() => {
			this.frameRequest = null, this._processPending();
		}));
	}
	_cancelScheduledUpdate() {
		this.frameRequest !== null && (window.cancelAnimationFrame(this.frameRequest), this.frameRequest = null);
	}
	_processPending() {
		let e = this.pendingEvent;
		this.pendingEvent = null, this._updateGuides({ event: e });
	}
	_updateGuides({ event: t }) {
		if (!this.isAltPressed || !t) {
			this._clearGuides();
			return;
		}
		let { canvas: n } = this, r = n.getActiveObject();
		if (!r) {
			this._clearGuides();
			return;
		}
		let i = z({ object: r });
		if (!i) {
			this._clearGuides();
			return;
		}
		let a = this._resolveMeasurementTargetContext({
			event: t,
			activeObject: r
		});
		if (!a) {
			this._clearGuides();
			return;
		}
		let { targetBounds: o, targetIsMontageArea: s } = a;
		if (s && e._isOutsideBounds({
			activeBounds: i,
			targetBounds: o
		})) {
			this._clearGuides();
			return;
		}
		let c = e._buildGuides({
			activeBounds: i,
			targetBounds: o,
			targetIsMontageArea: s
		});
		if (!c.length) {
			this._clearGuides();
			return;
		}
		this.isTargetMontageArea = s, this.activeGuides = c, this._hideToolbar(), n.requestRenderAll();
	}
	_resolveMeasurementTargetContext({ event: t, activeObject: n }) {
		let r = e._resolveTarget({
			event: t,
			activeObject: n
		}), { montageArea: i } = this.editor, a = r ?? i, o = z({ object: a });
		return o ? {
			targetBounds: o,
			targetIsMontageArea: a === i
		} : null;
	}
	static _isOutsideBounds({ activeBounds: e, targetBounds: t }) {
		return e.right <= t.left || e.left >= t.right || e.bottom <= t.top || e.top >= t.bottom;
	}
	static _resolveTarget({ event: e, activeObject: t }) {
		let { target: n } = e, r = Kv({ activeObject: t });
		return n && !qv({
			object: n,
			excluded: r
		}) ? n : null;
	}
	static _buildGuides({ activeBounds: t, targetBounds: n, targetIsMontageArea: r }) {
		let i = e._buildHorizontalGuides({
			activeBounds: t,
			targetBounds: n,
			targetIsMontageArea: r
		}), a = e._buildVerticalGuides({
			activeBounds: t,
			targetBounds: n,
			targetIsMontageArea: r
		});
		return [...i, ...a];
	}
	static _buildHorizontalGuides({ activeBounds: e, targetBounds: t, targetIsMontageArea: n }) {
		let r = [], { left: i = 0, right: a = 0, top: o = 0, bottom: s = 0, centerY: c = 0 } = e, { left: l = 0, right: u = 0, top: d = 0, bottom: f = 0, centerY: p = 0 } = t, m = Math.max(o, d), h = Math.min(s, f), g = h >= m ? (m + h) / 2 : (c + p) / 2;
		if (l >= a) {
			if (n) return r;
			let e = l - a;
			return e > 0 && r.push({
				type: "horizontal",
				axis: g,
				start: a,
				end: l,
				distance: e
			}), r;
		}
		if (u <= i) {
			if (n) return r;
			let e = i - u;
			return e > 0 && r.push({
				type: "horizontal",
				axis: g,
				start: u,
				end: i,
				distance: e
			}), r;
		}
		if (!n) return r;
		let _ = i < l, v = a > u, y = Math.min(i, l), b = Math.max(i, l), x = b - y;
		x > 0 && !_ && r.push({
			type: "horizontal",
			axis: g,
			start: y,
			end: b,
			distance: x
		});
		let S = Math.min(a, u), C = Math.max(a, u), w = C - S;
		return w > 0 && !v && r.push({
			type: "horizontal",
			axis: g,
			start: S,
			end: C,
			distance: w
		}), r;
	}
	static _buildVerticalGuides({ activeBounds: e, targetBounds: t, targetIsMontageArea: n }) {
		let r = [], { top: i = 0, bottom: a = 0, left: o = 0, right: s = 0, centerX: c = 0 } = e, { top: l = 0, bottom: u = 0, left: d = 0, right: f = 0, centerX: p = 0 } = t, m = Math.max(o, d), h = Math.min(s, f), g = h >= m ? (m + h) / 2 : (c + p) / 2;
		if (l >= a) {
			if (n) return r;
			let e = l - a;
			return e > 0 && r.push({
				type: "vertical",
				axis: g,
				start: a,
				end: l,
				distance: e
			}), r;
		}
		if (u <= i) {
			if (n) return r;
			let e = i - u;
			return e > 0 && r.push({
				type: "vertical",
				axis: g,
				start: u,
				end: i,
				distance: e
			}), r;
		}
		if (!n) return r;
		let _ = i < l, v = a > u, y = Math.min(i, l), b = Math.max(i, l), x = b - y;
		x > 0 && !_ && r.push({
			type: "vertical",
			axis: g,
			start: y,
			end: b,
			distance: x
		});
		let S = Math.min(a, u), C = Math.max(a, u), w = C - S;
		return w > 0 && !v && r.push({
			type: "vertical",
			axis: g,
			start: S,
			end: C,
			distance: w
		}), r;
	}
	_clearGuides() {
		if (!this.activeGuides.length) {
			this._showToolbar();
			return;
		}
		this.activeGuides = [], this.isTargetMontageArea = !1, this.canvas.requestRenderAll(), this._showToolbar();
	}
	_handleBeforeRender() {
		let { canvas: e } = this, { contextTop: t } = e;
		t && e.clearContext(t);
	}
	_handleAfterRender() {
		if (!this.activeGuides.length) return;
		let { canvas: e } = this, t = e.getSelectionContext();
		if (!t) return;
		let { viewportTransform: n } = e, r = e.getZoom() || 1, i = this.activeGuides.some((e) => e.type === "vertical"), a = this.activeGuides.some((e) => e.type === "horizontal"), o = i && a && !this.isTargetMontageArea, s = o ? 12 / r : 0, c = this.activeGuides.map((e) => ({
			guide: e,
			label: og({ distance: e.distance }).toString()
		}));
		t.save();
		try {
			Array.isArray(n) && t.transform(...n), t.lineWidth = 1 / r, t.strokeStyle = lx, t.setLineDash([]), this._drawMeasurementGuides({
				context: t,
				renderGuides: c,
				zoom: r,
				labelOffset: s,
				hasBothDirections: o
			});
		} finally {
			t.restore();
		}
	}
	_drawMeasurementGuides({ context: e, renderGuides: t, zoom: n, labelOffset: r, hasBothDirections: i }) {
		for (let { guide: a, label: o } of t) {
			let { type: t, axis: s, start: c, end: l } = a, u = Math.abs(l - c), d = i ? (c <= l ? -1 : 1) * (u / 2 + r) : 0;
			e.beginPath(), t === "vertical" ? (e.moveTo(s, c), e.lineTo(s, l)) : (e.moveTo(c, s), e.lineTo(l, s)), e.stroke(), ey({
				context: e,
				type: t,
				axis: s,
				start: c,
				end: l,
				text: o,
				zoom: n,
				color: lx,
				lineWidth: 1,
				offsetAlongAxis: d,
				offsetPerpendicular: 0
			});
		}
	}
	_hideToolbar() {
		if (this.isToolbarHidden) return;
		let { toolbar: e } = this.editor;
		e?.hideTemporarily?.(), this.isToolbarHidden = !0;
	}
	_showToolbar() {
		if (!this.isToolbarHidden) return;
		let { toolbar: e } = this.editor;
		e?.showAfterTemporary?.(), this.isToolbarHidden = !1;
	}
}, dx = 16, fx = 16, px = Mn, mx = Nn, hx = dx;
function gx({ sourceSize: e, size: t, aspectRatio: n, allowOverflow: r }) {
	return t ? wx({
		size: t,
		sourceSize: e,
		allowOverflow: r
	}) : n ? Cx({
		aspectRatio: n,
		sourceSize: e
	}) : {
		width: e.width,
		height: e.height
	};
}
function _x({ source: e, aspectRatio: t }) {
	let n = Math.abs(e.scaleX ?? 1), r = Math.abs(e.scaleY ?? 1);
	return {
		width: t.width / n,
		height: t.height / r
	};
}
function Z({ source: e }) {
	return {
		width: e.width,
		height: e.height
	};
}
function vx({ source: e, frame: t }) {
	let n = e.calcTransformMatrix(), r = C.invertTransform(n), i = t.calcTransformMatrix();
	return xx({ points: Sx({ frame: t }).map((e) => e.transform(i).transform(r)) });
}
function yx({ source: e, frame: t }) {
	Tx({
		source: e,
		frame: t
	}), Dx({
		source: e,
		frame: t
	});
}
function bx({ source: e, frame: t }) {
	Ex({
		source: e,
		frame: t
	}), Dx({
		source: e,
		frame: t
	});
}
function xx({ points: e }) {
	let t = Math.min(...e.map((e) => e.x)), n = Math.min(...e.map((e) => e.y)), r = Math.max(...e.map((e) => e.x)), i = Math.max(...e.map((e) => e.y));
	return {
		left: t,
		top: n,
		width: r - t,
		height: i - n
	};
}
function Sx({ frame: e }) {
	let t = e.width / 2, n = e.height / 2;
	return [
		new p(-t, -n),
		new p(t, -n),
		new p(t, n),
		new p(-t, n)
	];
}
function Cx({ sourceSize: e, aspectRatio: t }) {
	let n = e.width / e.height, r = t.width / t.height;
	return r >= n ? {
		width: e.width,
		height: e.width / r
	} : {
		width: e.height * r,
		height: e.height
	};
}
function wx({ size: e, sourceSize: t, allowOverflow: n }) {
	let r = n ? px : Math.min(t.width, px), i = n ? mx : Math.min(t.height, mx);
	return {
		width: jx({
			value: e.width,
			min: dx,
			max: r
		}),
		height: jx({
			value: e.height,
			min: fx,
			max: i
		})
	};
}
function Tx({ source: e, frame: t }) {
	let n = vx({
		source: e,
		frame: t
	}), r = Z({ source: e }), i = r.width / Math.max(n.width, dx), a = r.height / Math.max(n.height, fx);
	i < 1 && t.set({ scaleX: (t.scaleX ?? 1) * i }), a < 1 && t.set({ scaleY: (t.scaleY ?? 1) * a }), t.setCoords();
}
function Ex({ source: e, frame: t }) {
	let n = vx({
		source: e,
		frame: t
	}), r = Z({ source: e }), i = r.width / Math.max(n.width, dx), a = r.height / Math.max(n.height, fx), o = Math.min(i, a);
	o < 1 && t.set({
		scaleX: (t.scaleX ?? 1) * o,
		scaleY: (t.scaleY ?? 1) * o
	}), t.setCoords();
}
function Dx({ source: e, frame: t }) {
	let n = vx({
		source: e,
		frame: t
	}), r = Ox({ sourceSize: Z({ source: e }) }), i = kx({ rect: n }), a = Ax({
		rect: n,
		sourceBounds: r
	}), o = new p(i.x + a.x, i.y + a.y).transform(e.calcTransformMatrix());
	t.setPositionByOrigin(o, "center", "center"), t.setCoords();
}
function Ox({ sourceSize: e }) {
	return {
		left: -e.width / 2,
		top: -e.height / 2,
		width: e.width,
		height: e.height
	};
}
function kx({ rect: e }) {
	return new p(e.left + e.width / 2, e.top + e.height / 2);
}
function Ax({ rect: e, sourceBounds: t }) {
	let n = t.left + t.width, r = t.top + t.height, i = 0, a = 0;
	return e.left < t.left && (i = t.left - e.left), e.left + e.width > n && (i = n - e.left - e.width), e.top < t.top && (a = t.top - e.top), e.top + e.height > r && (a = r - e.top - e.height), new p(i, a);
}
function jx({ value: e, min: t, max: n }) {
	return Math.max(t, Math.min(n, e));
}
//#endregion
//#region src/editor/crop-manager/domain/crop-source-scale.ts
var Mx = 1, Nx = 1e-9, Px = {
	tl: {
		x: "max",
		y: "max"
	},
	tr: {
		x: "min",
		y: "max"
	},
	bl: {
		x: "max",
		y: "min"
	},
	br: {
		x: "min",
		y: "min"
	},
	ml: { x: "max" },
	mr: { x: "min" },
	mt: { y: "max" },
	mb: { y: "min" }
}, Fx = {
	x: {
		left: "min",
		center: "center",
		right: "max",
		0: "min",
		.5: "center",
		1: "max"
	},
	y: {
		top: "min",
		center: "center",
		bottom: "max",
		0: "min",
		.5: "center",
		1: "max"
	}
};
function Ix({ source: e, transform: t, axis: n }) {
	let r = Lx({
		transform: t,
		axis: n
	});
	return !(n === "x" ? e?.flipX === !0 : e?.flipY === !0) || r === "center" ? r : r === "min" ? "max" : "min";
}
function Lx({ transform: e, axis: t }) {
	let { corner: n } = e, r = t === "x" ? e.originX : e.originY, i = Fx[t][String(r)];
	return i === "center" ? i : Px[n]?.[t] || (i ?? "center");
}
function Rx({ sourceSize: e, startRect: t, anchorX: n, anchorY: r }) {
	let i = Math.max(1, t.width), a = Math.max(1, t.height);
	if (Kx({
		sourceSize: e,
		rect: t,
		axis: "x"
	}) || Kx({
		sourceSize: e,
		rect: t,
		axis: "y"
	})) return 1;
	let o = Yx({
		sourceSize: e,
		rect: t,
		axis: "x",
		anchor: n
	}), s = Yx({
		sourceSize: e,
		rect: t,
		axis: "y",
		anchor: r
	}), c = Math.min(o / i, s / a), l = Math.min(e.width / i, e.height / a), u = Math.min(c, l);
	return (u - 1) * Math.min(i, a) <= Mx ? 1 : Math.max(1, u);
}
function zx({ sourceSize: e, startRect: t, anchorX: n, anchorY: r }) {
	let i = Math.max(1, t.width), a = Math.max(1, t.height);
	if (Kx({
		sourceSize: e,
		rect: t,
		axis: "x"
	}) || Kx({
		sourceSize: e,
		rect: t,
		axis: "y"
	})) return null;
	let o = Vx({
		sourceSize: e,
		startRect: t,
		axis: "x",
		anchor: n
	}), s = Vx({
		sourceSize: e,
		startRect: t,
		axis: "y",
		anchor: r
	}), c = Math.max(1, Math.min(o.scale, s.scale));
	return (c - 1) * Math.min(i, a) <= Mx ? null : {
		scale: c,
		rect: Hx({
			sourceSize: e,
			startRect: t,
			anchorX: n,
			anchorY: r,
			widthLimit: o,
			heightLimit: s,
			scale: c
		})
	};
}
function Bx({ sourceSize: e, startRect: t, axis: n, anchor: r }) {
	let i = Math.max(1, Jx({
		rect: t,
		axis: n
	}));
	if (Kx({
		sourceSize: e,
		rect: t,
		axis: n
	})) return 1;
	let a = Yx({
		sourceSize: e,
		rect: t,
		axis: n,
		anchor: r
	}), o = qx({
		sourceSize: e,
		axis: n
	}), s = Math.min(a, o) / i;
	return (s - 1) * i <= Mx ? 1 : Math.max(1, s);
}
function Vx({ sourceSize: e, startRect: t, axis: n, anchor: r }) {
	let i = qx({
		sourceSize: e,
		axis: n
	}), a = Math.max(1, Jx({
		rect: t,
		axis: n
	})), o = Yx({
		sourceSize: e,
		rect: t,
		axis: n,
		anchor: r
	}), s = Math.min(i, Math.max(1, Math.round(o)));
	return {
		sizeLimit: s,
		scale: s / a
	};
}
function Hx({ sourceSize: e, startRect: t, anchorX: n, anchorY: r, widthLimit: i, heightLimit: a, scale: o }) {
	let s = t.width * o, c = t.height * o;
	return {
		left: Ux({
			sourceSize: e,
			startRect: t,
			axis: "x",
			anchor: n,
			nextLength: s,
			shouldSnapToSource: Wx({
				scale: o,
				limit: i.scale
			})
		}),
		top: Ux({
			sourceSize: e,
			startRect: t,
			axis: "y",
			anchor: r,
			nextLength: c,
			shouldSnapToSource: Wx({
				scale: o,
				limit: a.scale
			})
		}),
		width: s,
		height: c
	};
}
function Ux({ sourceSize: e, startRect: t, axis: n, anchor: r, nextLength: i, shouldSnapToSource: a }) {
	let o = qx({
		sourceSize: e,
		axis: n
	}), s = -o / 2, c = o / 2, l = n === "x" ? t.left : t.top, u = Jx({
		rect: t,
		axis: n
	});
	return a ? r === "min" ? c - i : r === "max" ? s : s + (o - i) / 2 : Gx({
		start: l,
		length: u,
		nextLength: i,
		anchor: r
	});
}
function Wx({ scale: e, limit: t }) {
	return Math.abs(e - t) <= Nx;
}
function Gx({ start: e, length: t, nextLength: n, anchor: r }) {
	return r === "min" ? e : r === "max" ? e + t - n : e + (t - n) / 2;
}
function Kx({ sourceSize: e, rect: t, axis: n }) {
	let r = qx({
		sourceSize: e,
		axis: n
	}), i = Jx({
		rect: t,
		axis: n
	});
	return Math.round(i) >= Math.round(r);
}
function qx({ sourceSize: e, axis: t }) {
	return t === "x" ? e.width : e.height;
}
function Jx({ rect: e, axis: t }) {
	return t === "x" ? e.width : e.height;
}
function Yx({ sourceSize: e, rect: t, axis: n, anchor: r }) {
	let i = n === "x" ? e.width : e.height, a = n === "x" ? t.left : t.top, o = n === "x" ? t.width : t.height, s = -i / 2, c = i / 2, l = a + o, u = a + o / 2;
	return r === "min" ? c - Xx({
		value: a,
		boundary: s
	}) : r === "max" ? Xx({
		value: l,
		boundary: c
	}) - s : Math.min(u - s, c - u) * 2;
}
function Xx({ value: e, boundary: t }) {
	return Math.abs(e - t) <= Mx ? t : e;
}
//#endregion
//#region src/editor/crop-manager/domain/crop-frame-size.ts
function Zx({ frame: e, scaleX: t = e.scaleX ?? 1, scaleY: n = e.scaleY ?? 1 }) {
	let r = Math.abs(e.cropSourceScaleX ?? 1) || 1, i = Math.abs(e.cropSourceScaleY ?? 1) || 1;
	return {
		width: Math.max(1, e.width * Math.abs(t) / r),
		height: Math.max(1, e.height * Math.abs(n) / i)
	};
}
//#endregion
//#region src/editor/crop-manager/interaction/crop-controls.ts
var Qx = .001, $x = 1e-9, eS = [
	"tl",
	"tr",
	"bl",
	"br"
], tS = [
	"ml",
	"mr",
	"mt",
	"mb"
], nS = {
	ml: "w-resize",
	mr: "e-resize",
	mt: "n-resize",
	mb: "s-resize"
};
function rS({ transform: e }) {
	let { originX: t, originY: n } = e;
	return (t === "center" || t === .5) && (n === "center" || n === .5);
}
function iS({ transform: e, x: t, y: n }) {
	let r = e, { target: i } = r, { scaleX: a = 1, scaleY: o = 1 } = i;
	if (cS({
		transform: r,
		x: t,
		y: n
	})) return lS({ transform: r }), !0;
	let s = b.getLocalPoint(r, r.originX, r.originY, t, n);
	return dS({ transform: r }), hS({
		transform: r,
		localPoint: s
	}), a !== i.scaleX || o !== i.scaleY;
}
function aS({ transform: e, x: t, y: n }) {
	let r = e, { target: i } = r, { scaleX: a = 1, scaleY: o = 1 } = i;
	if (cS({
		transform: r,
		x: t,
		y: n
	})) return lS({ transform: r }), !0;
	let s = b.getLocalPoint(r, r.originX, r.originY, t, n);
	return dS({ transform: r }), ES({
		transform: r,
		localPoint: s
	}), a !== i.scaleX || o !== i.scaleY;
}
function oS({ transform: e, axis: t, x: n, y: r }) {
	let i = e, { target: a } = i, o = t === "x" ? a.scaleX ?? 1 : a.scaleY ?? 1;
	if (cS({
		transform: i,
		x: n,
		y: r
	})) return uS({
		transform: i,
		axis: t
	}), !0;
	let s = b.getLocalPoint(i, i.originX, i.originY, n, r);
	return dS({ transform: i }), gS({
		transform: i,
		axis: t,
		localPoint: s
	}), t === "x" ? o !== a.scaleX : o !== a.scaleY;
}
function sS({ transform: e, axis: t, x: n, y: r }) {
	let i = e, { target: a } = i, { scaleX: o = 1, scaleY: s = 1 } = a;
	if (cS({
		transform: i,
		x: n,
		y: r
	})) return lS({ transform: i }), !0;
	let c = b.getLocalPoint(i, i.originX, i.originY, n, r);
	return dS({ transform: i }), _S({
		transform: i,
		axis: t,
		localPoint: c
	}), o !== a.scaleX || s !== a.scaleY;
}
function cS({ transform: e, x: t, y: n }) {
	return Math.abs(t - e.ex) <= Qx && Math.abs(n - e.ey) <= Qx;
}
function lS({ transform: e }) {
	e.target.set({
		scaleX: e.original.scaleX,
		scaleY: e.original.scaleY
	});
}
function uS({ transform: e, axis: t }) {
	if (t === "x") {
		e.target.set("scaleX", e.original.scaleX);
		return;
	}
	e.target.set("scaleY", e.original.scaleY);
}
function dS({ transform: e }) {
	let { signX: t, signY: n } = fS({ controlKey: e.corner });
	e.signX === void 0 && (e.signX = t), e.signY === void 0 && (e.signY = n);
}
function fS({ controlKey: e }) {
	return {
		signX: pS({ controlKey: e }),
		signY: mS({ controlKey: e })
	};
}
function pS({ controlKey: e }) {
	return e === "tl" || e === "bl" || e === "ml" ? -1 : 1;
}
function mS({ controlKey: e }) {
	return e === "tl" || e === "tr" || e === "mt" ? -1 : 1;
}
function hS({ transform: e, localPoint: t }) {
	let { target: n } = e;
	yS({ transform: e });
	let r = vS({
		transform: e,
		axis: "x",
		localPoint: t
	}), i = vS({
		transform: e,
		axis: "y",
		localPoint: t
	});
	n.lockScalingX || n.set("scaleX", r.scale), n.lockScalingY || n.set("scaleY", i.scale), (r.sourceClamped || i.sourceClamped) && bS({
		transform: e,
		preserveAspectRatio: !1
	});
}
function gS({ transform: e, axis: t, localPoint: n }) {
	let { target: r } = e;
	if (t === "x" && r.lockScalingX || t === "y" && r.lockScalingY) return;
	yS({ transform: e });
	let i = vS({
		transform: e,
		axis: t,
		localPoint: n
	});
	t === "x" ? r.set("scaleX", i.scale) : r.set("scaleY", i.scale), i.sourceClamped && bS({
		transform: e,
		preserveAspectRatio: !1
	});
}
function _S({ transform: e, axis: t, localPoint: n }) {
	let { target: r } = e;
	if (r.lockScalingX || r.lockScalingY) return;
	let i = vS({
		transform: e,
		axis: t,
		localPoint: n,
		constrainToSource: !1
	}), a = t === "x" ? e.original.scaleX : e.original.scaleY, o = AS({
		target: r,
		transform: e,
		scale: a > 0 ? i.scale / a : 1,
		forceMinimum: FS({
			transform: e,
			axis: t,
			localPoint: n
		})
	});
	r.set("scaleX", o.scaleX), r.set("scaleY", o.scaleY);
}
function vS({ transform: e, axis: t, localPoint: n, constrainToSource: r = !0 }) {
	let { target: i } = e, a = kS({ target: i }), o = PS({ target: i }), s = t === "x" ? i.scaleX ?? 1 : i.scaleY ?? 1, c = t === "x" ? e.original.scaleX : e.original.scaleY, l = t === "x" ? n.x : n.y, u = t === "x" ? a.x : a.y, d = t === "x" ? o.minScaleX : o.minScaleY, f = r ? wS({
		target: i,
		transform: e,
		axis: t
	}) : null, p = CS({
		axis: t,
		limits: o,
		sourceMaximumScale: f
	});
	if (FS({
		transform: e,
		axis: t,
		localPoint: n
	})) return {
		scale: d,
		sourceClamped: !1
	};
	let m = Math.abs((l || 0) * s / u);
	rS({ transform: e }) && (m *= 2);
	let h = SS({
		target: i,
		axis: t,
		scale: BS({
			value: m,
			min: d,
			max: p
		}),
		maximumScale: p,
		sourceMaximumScale: f
	});
	return {
		scale: h,
		sourceClamped: xS({
			scale: h,
			maximumScale: p,
			sourceMaximumScale: f,
			originalScale: c
		})
	};
}
function yS({ transform: e }) {
	e.cropSourceScaleClamped = !1, e.cropSourceBoundScale = null, e.cropSourceScaleAnchorX = void 0, e.cropSourceScaleAnchorY = void 0, e.cropSourceScalePreserveAspectRatio = void 0;
}
function bS({ transform: e, preserveAspectRatio: t }) {
	let { target: n } = e;
	e.cropSourceScaleClamped = !0, e.cropSourceScalePreserveAspectRatio = t, e.cropSourceScaleAnchorX = NS({
		target: n,
		transform: e,
		axis: "x"
	}), e.cropSourceScaleAnchorY = NS({
		target: n,
		transform: e,
		axis: "y"
	}), e.cropSourceBoundScale = {
		scaleX: n.scaleX ?? 1,
		scaleY: n.scaleY ?? 1
	};
}
function xS({ scale: e, maximumScale: t, sourceMaximumScale: n, originalScale: r }) {
	return n === null || Math.abs(t - n) > $x || Math.abs(e - n) > $x ? !1 : Math.abs(Math.abs(r) - n) > $x;
}
function SS({ target: e, axis: t, scale: n, maximumScale: r, sourceMaximumScale: i }) {
	return i === null || Math.abs(r - i) > $x ? n : TS({
		target: e,
		axis: t,
		fromScale: n,
		toScale: i
	}) <= 1.000001 ? i : n;
}
function CS({ axis: e, limits: t, sourceMaximumScale: n }) {
	let r = e === "x" ? t.minScaleX : t.minScaleY, i = e === "x" ? t.maxScaleX : t.maxScaleY;
	return n === null ? i : Math.max(r, Math.min(i, n));
}
function wS({ target: e, transform: t, axis: n }) {
	let r = MS({
		target: e,
		transform: t
	});
	if (!r) return null;
	let i = n === "x" ? t.original.scaleX : t.original.scaleY, a = Bx({
		sourceSize: r.sourceSize,
		startRect: r.startRect,
		axis: n,
		anchor: NS({
			target: e,
			transform: t,
			axis: n
		})
	});
	return Math.abs(i) * a;
}
function TS({ target: e, axis: t, fromScale: n, toScale: r }) {
	let i = e, a = t === "x" ? Math.abs(i.cropSourceScaleX ?? 1) || 1 : Math.abs(i.cropSourceScaleY ?? 1) || 1, o = t === "x" ? e.width : e.height;
	return Math.abs(r - n) * Math.max(1, o) / a;
}
function ES({ transform: e, localPoint: t }) {
	let { target: n } = e;
	if (n.lockScalingX || n.lockScalingY) return;
	let r = AS({
		target: n,
		transform: e,
		scale: DS({
			transform: e,
			localPoint: t,
			dimensions: kS({ target: n })
		}),
		forceMinimum: IS({
			transform: e,
			localPoint: t
		})
	});
	n.set("scaleX", r.scaleX), n.set("scaleY", r.scaleY);
}
function DS({ transform: e, localPoint: t, dimensions: n }) {
	let r = "gestureScale" in e && typeof e.gestureScale == "number" ? e.gestureScale : null;
	if (r !== null) return r;
	let i = Math.abs(t.x) + Math.abs(t.y), a = OS({
		transform: e,
		dimensions: n
	}), o = a > 0 ? i / a : 1;
	return rS({ transform: e }) && (o *= 2), o;
}
function OS({ transform: e, dimensions: t }) {
	let { target: n, original: r } = e, i = n.scaleX ?? 1, a = n.scaleY ?? 1;
	return Math.abs(t.x * r.scaleX / i) + Math.abs(t.y * r.scaleY / a);
}
function kS({ target: e }) {
	let t = Math.abs(e.scaleX ?? 1), n = Math.abs(e.scaleY ?? 1);
	return {
		x: Math.max(1, e.width * t),
		y: Math.max(1, e.height * n)
	};
}
function AS({ target: e, transform: t, scale: n, forceMinimum: r }) {
	let i = Zx({
		frame: e,
		scaleX: t.original.scaleX,
		scaleY: t.original.scaleY
	}), a = Math.max(dx / i.width, fx / i.height), o = Math.min(px / i.width, mx / i.height), s = jS({
		target: e,
		transform: t
	}), c = Math.max(a, Math.min(o, s ?? o));
	t.cropSourceScaleClamped = !r && n > c, t.cropSourceScalePreserveAspectRatio = t.cropSourceScaleClamped;
	let l = a;
	r || (l = BS({
		value: n,
		min: a,
		max: c
	}));
	let u = t.original.scaleX * l, d = t.original.scaleY * l;
	return t.cropSourceScaleClamped ? (t.cropSourceScaleAnchorX = NS({
		target: e,
		transform: t,
		axis: "x"
	}), t.cropSourceScaleAnchorY = NS({
		target: e,
		transform: t,
		axis: "y"
	}), t.cropSourceBoundScale = {
		scaleX: u,
		scaleY: d
	}) : (t.cropSourceBoundScale = null, t.cropSourceScaleAnchorX = void 0, t.cropSourceScaleAnchorY = void 0, t.cropSourceScalePreserveAspectRatio = void 0), {
		scaleX: u,
		scaleY: d
	};
}
function jS({ target: e, transform: t }) {
	let n = MS({
		target: e,
		transform: t
	});
	return n ? Rx({
		sourceSize: n.sourceSize,
		startRect: n.startRect,
		anchorX: NS({
			target: e,
			transform: t,
			axis: "x"
		}),
		anchorY: NS({
			target: e,
			transform: t,
			axis: "y"
		})
	}) : null;
}
function MS({ target: e, transform: t }) {
	if (t.cropSourceScaleBounds !== void 0) return t.cropSourceScaleBounds;
	let n = e;
	return n.cropAllowFrameOverflow !== !1 || !n.cropSource ? (t.cropSourceScaleBounds = null, null) : (t.cropSourceScaleBounds = {
		sourceSize: Z({ source: n.cropSource }),
		startRect: vx({
			source: n.cropSource,
			frame: n
		})
	}, t.cropSourceScaleBounds);
}
function NS({ target: e, transform: t, axis: n }) {
	let r = e.cropSource;
	return Ix({
		source: r,
		transform: t,
		axis: n
	});
}
function PS({ target: e }) {
	let t = e, n = Math.abs(t.cropSourceScaleX ?? 1) || 1, r = Math.abs(t.cropSourceScaleY ?? 1) || 1, i = Math.max(1, e.width), a = Math.max(1, e.height);
	return {
		minScaleX: dx * n / i,
		maxScaleX: px * n / i,
		minScaleY: fx * r / a,
		maxScaleY: mx * r / a
	};
}
function FS({ transform: e, axis: t, localPoint: n }) {
	let { target: r } = e;
	if (!r.lockScalingFlip) return !1;
	let i = t === "x" ? e.signX ?? 1 : e.signY ?? 1, a = t === "x" ? n.x : n.y;
	return i !== Math.sign(a || i);
}
function IS({ transform: e, localPoint: t }) {
	return FS({
		transform: e,
		axis: "x",
		localPoint: t
	}) || FS({
		transform: e,
		axis: "y",
		localPoint: t
	});
}
function LS({ eventData: e, target: t }) {
	return _b({
		target: t,
		shiftKey: e.shiftKey
	});
}
function RS() {
	let e = b.wrapWithFireEvent("scaling", b.wrapWithFixedAnchor((e, t, n, r) => iS({
		transform: t,
		x: n,
		y: r
	}))), t = b.wrapWithFireEvent("scaling", b.wrapWithFixedAnchor((e, t, n, r) => aS({
		transform: t,
		x: n,
		y: r
	})));
	return (n, r, i, a) => LS({
		eventData: n,
		target: r.target
	}) ? t(n, r, i, a) : e(n, r, i, a);
}
function zS({ axis: e }) {
	let t = b.wrapWithFireEvent("scaling", b.wrapWithFixedAnchor((t, n, r, i) => oS({
		transform: n,
		axis: e,
		x: r,
		y: i
	}))), n = b.wrapWithFireEvent("scaling", b.wrapWithFixedAnchor((t, n, r, i) => sS({
		transform: n,
		axis: e,
		x: r,
		y: i
	})));
	return (e, r, i, a) => LS({
		eventData: e,
		target: r.target
	}) ? n(e, r, i, a) : t(e, r, i, a);
}
function BS({ value: e, min: t, max: n }) {
	return Math.max(t, Math.min(n, e));
}
function VS({ control: e, actionHandler: t, cursorStyleHandler: n, getActionName: i }) {
	let a = {
		...e,
		actionHandler: t
	};
	n && Object.assign(a, { cursorStyleHandler: n }), i && Object.assign(a, { getActionName: i });
	let o = new r(a);
	return o.cropResizeControl = !0, o;
}
function HS({ controlKey: e }) {
	return nS[e];
}
function US({ axis: e }) {
	return e === "x" ? "scaleX" : "scaleY";
}
function WS({ target: e }) {
	let t = { ...e.controls }, n = !1, r = RS(), i = zS({ axis: "x" }), a = zS({ axis: "y" });
	eS.forEach((i) => {
		let a = e.controls[i];
		a && (a.cropResizeControl || (t[i] = VS({
			control: a,
			actionHandler: r
		}), n = !0));
	}), tS.forEach((r) => {
		let o = e.controls[r];
		if (!o || o.cropResizeControl) return;
		let s = r === "ml" || r === "mr", c = s ? i : a, l = s ? "x" : "y";
		t[r] = VS({
			control: o,
			actionHandler: c,
			cursorStyleHandler: () => HS({ controlKey: r }),
			getActionName: () => US({ axis: l })
		}), n = !0;
	}), n && (e.controls = t);
}
//#endregion
//#region src/editor/crop-manager/domain/crop-frame.ts
var GS = "rgba(47, 128, 237, 0.42)", KS = class extends g {
	constructor(e) {
		let { showGrid: t, source: n = null, allowFrameOverflow: r = !0, sourceScaleX: i = 1, sourceScaleY: a = 1, preserveAspectRatio: o = !0, ...s } = e;
		super(s), this._showGrid = t, this.cropSource = n, this.cropAllowFrameOverflow = r, this.cropSourceScaleX = i, this.cropSourceScaleY = a, this.preserveAspectRatio = o, this.cropActiveResizePreserveAspectRatio = null;
	}
	_render(e) {
		super._render(e), this._showGrid && YS({
			ctx: e,
			width: this.width,
			height: this.height
		});
	}
	getObjectDisplaySize() {
		return Zx({ frame: this });
	}
	getObjectSnappingBounds() {
		return ZS({ frame: this });
	}
};
function qS({ source: e, cropSize: t, showGrid: n, allowFrameOverflow: r, preserveAspectRatio: i }) {
	let a = e.getCenterPoint(), o = e.scaleX ?? 1, s = e.scaleY ?? 1, c = new KS({
		id: `crop-frame-${E()}`,
		left: a.x,
		top: a.y,
		width: t.width,
		height: t.height,
		originX: "center",
		originY: "center",
		scaleX: o,
		scaleY: s,
		angle: e.angle ?? 0,
		fill: "rgba(47, 128, 237, 0.08)",
		stroke: "#2f80ed",
		strokeWidth: 1,
		strokeDashArray: [6, 4],
		strokeUniform: !0,
		objectCaching: !1,
		noScaleCache: !0,
		selectable: !0,
		evented: !0,
		lockRotation: !0,
		lockScalingFlip: !0,
		lockSkewingX: !0,
		lockSkewingY: !0,
		excludeFromExport: !0,
		showGrid: n,
		source: e,
		allowFrameOverflow: r,
		preserveAspectRatio: i,
		sourceScaleX: o,
		sourceScaleY: s
	});
	return c.setControlsVisibility({ mtr: !1 }), WS({ target: c }), c;
}
function JS({ frame: e, preserveAspectRatio: t }) {
	if (!(e instanceof KS)) throw Error("Crop session frame должен быть CropFrame");
	e.cropActiveResizePreserveAspectRatio = t;
}
function YS({ ctx: e, width: t, height: n }) {
	if (!(t <= 0 || n <= 0)) {
		e.save(), e.strokeStyle = GS, e.lineWidth = 1, e.setLineDash([]);
		for (let r = 1; r <= 2; r += 1) {
			let i = -t / 2 + t * r / 3, a = -n / 2 + n * r / 3;
			XS({
				ctx: e,
				x: i,
				height: n
			}), $S({
				ctx: e,
				y: a,
				width: t
			});
		}
		e.restore();
	}
}
function XS({ ctx: e, x: t, height: n }) {
	e.beginPath(), e.moveTo(t, -n / 2), e.lineTo(t, n / 2), e.stroke();
}
function ZS({ frame: e }) {
	let t = e.calcTransformMatrix(), n = e.width / 2, r = e.height / 2;
	return QS({ points: [
		new p(-n, -r),
		new p(n, -r),
		new p(n, r),
		new p(-n, r)
	].map((e) => e.transform(t)) });
}
function QS({ points: e }) {
	let t = Math.min(...e.map((e) => e.x)), n = Math.max(...e.map((e) => e.x)), r = Math.min(...e.map((e) => e.y)), i = Math.max(...e.map((e) => e.y));
	return {
		left: t,
		right: n,
		top: r,
		bottom: i,
		centerX: t + (n - t) / 2,
		centerY: r + (i - r) / 2
	};
}
function $S({ ctx: e, y: t, width: n }) {
	e.beginPath(), e.moveTo(-n / 2, t), e.lineTo(n / 2, t), e.stroke();
}
//#endregion
//#region src/editor/crop-manager/domain/crop-frame-transform-state.ts
function eC({ source: e, frame: t, rect: n, scale: r }) {
	let i = new p(n.left + n.width / 2, n.top + n.height / 2).transform(e.calcTransformMatrix()), a = t.translateToOriginPoint(i, t.originX, t.originY);
	return {
		left: a.x,
		top: a.y,
		scaleX: r.scaleX,
		scaleY: r.scaleY
	};
}
function tC({ frame: e }) {
	return {
		left: e.left,
		top: e.top,
		scaleX: e.scaleX ?? 1,
		scaleY: e.scaleY ?? 1
	};
}
function nC({ frame: e, state: t }) {
	e.set({
		left: t.left,
		top: t.top,
		scaleX: t.scaleX,
		scaleY: t.scaleY
	}), e.setCoords();
}
//#endregion
//#region src/editor/crop-manager/domain/crop-result.ts
var rC = 1e-6;
function iC({ session: e }) {
	return e.mode === "canvas" ? lC({ session: e }) : uC({
		target: e.target,
		frame: e.frame
	});
}
function aC({ rect: e, sourceSize: t }) {
	let n = Math.max(0, oC({ value: e.width })), r = Math.max(0, oC({ value: e.height }));
	return {
		left: sC({
			start: e.left,
			length: n,
			sourceLength: t?.width
		}),
		top: sC({
			start: e.top,
			length: r,
			sourceLength: t?.height
		}),
		width: n,
		height: r
	};
}
function oC({ value: e }) {
	return Math.round(e + rC);
}
function sC({ start: e, length: t, sourceLength: n }) {
	let r = oC({ value: e });
	if (n === void 0) return r;
	let i = Math.max(0, oC({ value: n })), a = Math.max(0, i - t);
	return Math.min(Math.max(0, r), a);
}
function cC({ rect: e }) {
	return e.width >= hx && e.height >= hx;
}
function lC({ session: e }) {
	let t = vx({
		source: e.source,
		frame: e.frame
	}), n = Z({ source: e.source });
	return {
		left: t.left + n.width / 2,
		top: t.top + n.height / 2,
		width: t.width,
		height: t.height
	};
}
function uC({ target: e, frame: t }) {
	let n = vx({
		source: e,
		frame: t
	}), r = -e.width / 2, i = -e.height / 2;
	return {
		left: n.left - r,
		top: n.top - i,
		width: n.width,
		height: n.height
	};
}
//#endregion
//#region src/editor/crop-manager/domain/crop-dimming-overlay.ts
var dC = "#000000", fC = .25, pC = 1, mC = class extends g {
	constructor({ canvas: e, frame: t, previousOverlayImage: n, previousOverlayVpt: r, previousControlsAboveOverlay: i }) {
		super({
			left: 0,
			top: 0,
			width: pC,
			height: pC,
			originX: "center",
			originY: "center",
			fill: dC,
			opacity: fC,
			stroke: null,
			strokeWidth: 0,
			selectable: !1,
			evented: !1,
			hasBorders: !1,
			hasControls: !1,
			objectCaching: !1,
			excludeFromExport: !0
		}), this._canvas = e, this._frame = t, this.previousOverlayImage = n, this.previousOverlayVpt = r, this.previousControlsAboveOverlay = i;
	}
	_render(e) {
		let t = _C({
			canvas: this._canvas,
			overlay: this
		}), n = vC({
			canvas: this._canvas,
			frame: this._frame,
			overlay: this
		});
		e.beginPath(), bC({
			ctx: e,
			points: t
		}), bC({
			ctx: e,
			points: n
		}), e.fillStyle = dC, e.fill("evenodd");
	}
};
function hC({ canvas: e, frame: t }) {
	e.overlayImage = new mC({
		canvas: e,
		frame: t,
		previousOverlayImage: e.overlayImage,
		previousOverlayVpt: e.overlayVpt,
		previousControlsAboveOverlay: e.controlsAboveOverlay
	}), e.overlayVpt = !1, e.controlsAboveOverlay = !0;
}
function gC({ canvas: e }) {
	let t = e.overlayImage;
	t instanceof mC && (e.overlayImage = t.previousOverlayImage, e.overlayVpt = t.previousOverlayVpt, e.controlsAboveOverlay = t.previousControlsAboveOverlay);
}
function _C({ canvas: e, overlay: t }) {
	let n = C.invertTransform(t.calcTransformMatrix()), r = e.getWidth(), i = e.getHeight();
	return [
		new p(0, 0),
		new p(r, 0),
		new p(r, i),
		new p(0, i)
	].map((e) => e.transform(n));
}
function vC({ canvas: e, frame: t, overlay: n }) {
	let r = C.invertTransform(n.calcTransformMatrix()), i = t.calcTransformMatrix();
	return yC({ rect: t }).map((t) => t.transform(i).transform(e.viewportTransform).transform(r));
}
function yC({ rect: e }) {
	let t = e.width / 2, n = e.height / 2;
	return [
		new p(-t, -n),
		new p(t, -n),
		new p(t, n),
		new p(-t, n)
	];
}
function bC({ ctx: e, points: t }) {
	let [n, ...r] = t;
	e.moveTo(n.x, n.y), r.forEach((t) => {
		e.lineTo(t.x, t.y);
	}), e.closePath();
}
//#endregion
//#region src/editor/crop-manager/mutation/crop-apply.ts
function xC({ editor: e, frame: t, rect: n }) {
	return cC({ rect: n }) ? (kC({
		editor: e,
		frame: t,
		offset: new p(-n.left, -n.top)
	}), e.canvasManager.setResolutionWidth(n.width, { withoutSave: !0 }), e.canvasManager.setResolutionHeight(n.height, { withoutSave: !0 }), e.canvas.renderAll(), {
		mode: "canvas",
		target: null,
		rect: n
	}) : null;
}
function SC({ editor: e, target: t, frame: n, rect: r }) {
	if (!cC({ rect: r })) return null;
	let i = CC({
		target: t,
		frame: n,
		rect: r
	});
	return i ? (e.canvas.renderAll(), {
		mode: "image",
		target: t,
		rect: i
	}) : null;
}
function CC({ target: e, frame: t, rect: n }) {
	let r = Math.max(hx, n.width), i = Math.max(hx, n.height), a = {
		width: r,
		height: i
	};
	if (wC({
		target: e,
		rect: n
	})) TC({
		target: e,
		size: a,
		rect: n
	});
	else {
		let t = EC({
			target: e,
			size: a,
			rect: n
		});
		if (!t) return null;
		e.setElement(t, a), e.set({
			cropX: 0,
			cropY: 0,
			width: r,
			height: i
		});
	}
	return e.setPositionByOrigin(t.getCenterPoint(), "center", "center"), e.setCoords(), {
		left: n.left,
		top: n.top,
		width: r,
		height: i
	};
}
function wC({ target: e, rect: t }) {
	return t.left >= 0 && t.top >= 0 && t.left + t.width <= e.width && t.top + t.height <= e.height;
}
function TC({ target: e, size: t, rect: n }) {
	let r = (e.cropX ?? 0) + n.left, i = (e.cropY ?? 0) + n.top;
	e.set({
		cropX: r,
		cropY: i,
		width: t.width,
		height: t.height
	});
}
function EC({ target: e, size: t, rect: n }) {
	let r = e.getElement(), i = DC({ target: e });
	if (!r || !i) return null;
	let a = i.createElement("canvas");
	a.width = Math.round(t.width), a.height = Math.round(t.height);
	let o = a.getContext("2d");
	if (!o) return null;
	let s = OC({
		target: e,
		size: t,
		rect: n
	});
	return s && o.drawImage(r, s.sourceX, s.sourceY, s.sourceWidth, s.sourceHeight, s.destinationX, s.destinationY, s.sourceWidth, s.sourceHeight), a;
}
function DC({ target: e }) {
	let t = e.canvas?.getElement();
	return t?.ownerDocument ? t.ownerDocument : typeof document < "u" ? document : null;
}
function OC({ target: e, size: t, rect: n }) {
	let r = Math.max(0, n.left), i = Math.max(0, n.top), a = Math.min(e.width, n.left + t.width), o = Math.min(e.height, n.top + t.height), s = a - r, c = o - i;
	return s <= 0 || c <= 0 ? null : {
		sourceX: (e.cropX ?? 0) + r,
		sourceY: (e.cropY ?? 0) + i,
		sourceWidth: s,
		sourceHeight: c,
		destinationX: r - n.left,
		destinationY: i - n.top
	};
}
function kC({ editor: e, frame: t, offset: n }) {
	e.canvasManager.getObjects().forEach((e) => {
		e !== t && (e.set({
			left: (e.left ?? 0) + n.x,
			top: (e.top ?? 0) + n.y
		}), e.setCoords());
	});
}
//#endregion
//#region src/editor/crop-manager/index.ts
var AC = {
	allowFrameOverflow: !0,
	showGrid: !0,
	showDimmedArea: !0,
	cancelOnSelectionClear: !0,
	preserveAspectRatio: !0
}, jC = .5, MC = 1e-9, NC = 1, PC = class {
	constructor({ editor: e }) {
		this._handleCropFrameChanged = (e) => {
			let { _session: t } = this;
			if (!t) return;
			t.effectivePreserveAspectRatio = this._getEffectivePreserveAspectRatio(e);
			let n = this._restoreSourceBoundFrameIfNeeded({
				session: t,
				event: e
			});
			this._clampFrameIfNeeded({
				session: t,
				preserveAspectRatio: t.effectivePreserveAspectRatio
			}), this._restoreFrameScaleAnchorFromEventIfNeeded({
				session: t,
				event: e
			}), n || this._rememberSourceBoundFrameIfNeeded({
				session: t,
				event: e
			}), vb({ transform: e?.transform }) && (this._activeResizePreserveAspectRatio = t.effectivePreserveAspectRatio), this.editor.canvas.fire("editor:crop:changed", this.getState()), this.editor.canvas.requestRenderAll();
		}, this._handleCropFrameModified = (e) => {
			this._handleCropFrameChanged(e);
			let { _session: t } = this;
			t && (JS({
				frame: t.frame,
				preserveAspectRatio: null
			}), this._activeResizePreserveAspectRatio = null, t.effectivePreserveAspectRatio = t.options.preserveAspectRatio);
		}, this._handleCanvasSelectionChanged = () => {
			let { _session: e } = this;
			e && e.options.cancelOnSelectionClear && (this._isSpacePanActive() || this.editor.canvas.getActiveObject() !== e.frame && this.cancel());
		}, this._handleCanvasMouseDownBefore = ({ target: e }) => {
			let { _session: t } = this;
			if (!t || !t.options.cancelOnSelectionClear || this._isSpacePanActive() || e === t.frame) return;
			let n = null;
			t.mode === "image" && (n = t.target), this._cancelFromPointerDown({ nextActiveObject: n });
		}, this.editor = e, this._session = null, this._activeResizePreserveAspectRatio = null;
	}
	get isActive() {
		return !!this._session;
	}
	getState() {
		let { _session: e } = this;
		if (!e) return null;
		let t = iC({ session: e }), n = e.options.allowFrameOverflow ? void 0 : Z({ source: e.source });
		return {
			mode: e.mode,
			frame: e.frame,
			options: e.options,
			target: e.target,
			effectivePreserveAspectRatio: e.effectivePreserveAspectRatio,
			rect: aC({
				rect: t,
				sourceSize: n
			})
		};
	}
	get effectivePreserveAspectRatio() {
		return this._session?.effectivePreserveAspectRatio ?? !0;
	}
	_getEffectivePreserveAspectRatio(e) {
		let { _session: t } = this;
		return t ? this._isSourceScaleClamped({ event: e }) ? e?.transform?.cropSourceScalePreserveAspectRatio ?? !0 : _b({
			target: t.frame,
			shiftKey: e?.e?.shiftKey
		}) : !0;
	}
	isFrameOverflowingSource({ target: e, axis: t }) {
		let { _session: n } = this;
		if (!n || !e || n.options.allowFrameOverflow || n.frame !== e) return !1;
		let r = vx({
			source: n.source,
			frame: n.frame
		}), i = Z({ source: n.source }), a = -i.width / 2 - jC, o = -i.height / 2 - jC, s = i.width / 2 + jC, c = i.height / 2 + jC, l = r.left < a || r.left + r.width > s, u = r.top < o || r.top + r.height > c;
		return t !== "y" && l || t !== "x" && u;
	}
	isFrameSourceScaleClamped({ target: e, transform: t }) {
		let { _session: n } = this;
		return !n || !e || !t || n.frame !== e ? !1 : t.cropSourceScaleClamped === !0;
	}
	applyFrameSourceBoundScalePlan({ target: e, transform: t, nextScaleX: n, nextScaleY: r }) {
		let { _session: i } = this;
		if (!i || !e || !t || i.frame !== e) return !1;
		let a = this._resolveSourceBoundScalePlan({
			target: e,
			source: i.source,
			transform: t,
			nextScaleX: n,
			nextScaleY: r
		});
		return a ? (this._markSourceBoundScalePlan({
			transform: t,
			plan: a
		}), nC({
			frame: i.frame,
			state: eC({
				source: i.source,
				frame: i.frame,
				rect: a.rect,
				scale: a.scale
			})
		}), !0) : !1;
	}
	restoreFrameScaleAnchorAfterSnap({ target: e, transform: t }) {
		let { _session: n } = this;
		return !n || !e || !t || n.frame !== e ? !1 : this._restoreFrameScaleAnchorFromTransform({
			session: n,
			transform: t
		});
	}
	startCanvasCrop(e = {}) {
		this.cancel();
		let t = this._createCanvasSession({
			source: this.editor.montageArea,
			options: e
		});
		return this._activateSession({ session: t }), this.getState();
	}
	startImageCrop(e = {}) {
		this.cancel();
		let t = e.target ?? this.editor.canvas.getActiveObject();
		if (!(t instanceof a)) return this._emitInvalidImageTargetError({ target: t }), null;
		if (t.locked) return this._emitLockedImageTargetError({ target: t }), null;
		let n = this._createImageSession({
			target: t,
			options: e
		});
		return this._activateSession({ session: n }), this.getState();
	}
	setAspectRatio({ aspectRatio: e }) {
		let { _session: t } = this;
		if (!t) return null;
		let n = gx({
			sourceSize: Z({ source: t.source }),
			aspectRatio: (e && t.mode === "image" ? _x({
				source: t.source,
				aspectRatio: e
			}) : e) ?? void 0,
			allowOverflow: t.options.allowFrameOverflow
		});
		return this._applyFrameSize({
			session: t,
			size: n
		}), this.getState();
	}
	setSize({ size: e }) {
		let { _session: t } = this;
		if (!t) return null;
		let n = gx({
			sourceSize: Z({ source: t.source }),
			size: e,
			allowOverflow: t.options.allowFrameOverflow
		});
		return this._applyFrameSize({
			session: t,
			size: n
		}), this.getState();
	}
	setPreserveAspectRatio({ preserveAspectRatio: e, keepCurrentResizeMode: t = !1 }) {
		let { _session: n } = this;
		if (!n) return null;
		let r = this._activeResizePreserveAspectRatio;
		return n.options.preserveAspectRatio = e, this._setFramePreserveAspectRatio({
			frame: n.frame,
			preserveAspectRatio: e
		}), JS({
			frame: n.frame,
			preserveAspectRatio: null
		}), n.effectivePreserveAspectRatio = e, t && r !== null && (n.effectivePreserveAspectRatio = r, JS({
			frame: n.frame,
			preserveAspectRatio: r
		})), this.editor.canvas.requestRenderAll(), this.getState();
	}
	resetFrameToSource({ target: e } = {}) {
		let { _session: t } = this;
		if (!t) return null;
		let n = e === void 0 && t.mode === "image";
		if (t.frame !== e && !n) return null;
		let r = Z({ source: t.source }), i = r;
		if (t.options.preserveAspectRatio) {
			if (!(t.frame instanceof KS)) throw Error("Crop session frame должен быть CropFrame");
			i = gx({
				sourceSize: r,
				aspectRatio: t.frame.getObjectDisplaySize(),
				allowOverflow: t.options.allowFrameOverflow
			});
		}
		return this._applyFrameSize({
			session: t,
			size: i
		}), this.getState();
	}
	fitFrame({ type: e }) {
		let { _session: t } = this;
		if (!t) return null;
		if (!t.options.allowFrameOverflow) {
			let e = this.resetFrameToSource({ target: t.frame });
			return e ? (this.editor.canvas.fire("editor:crop:changed", e), e) : null;
		}
		this.editor.transformManager.fitObject({
			object: t.frame,
			type: e,
			withoutSave: !0,
			fitAsOneObject: !0
		}), this._clampFrameIfNeeded({
			session: t,
			preserveAspectRatio: !0
		});
		let n = this.getState();
		return n ? (this.editor.canvas.fire("editor:crop:changed", n), this.editor.canvas.requestRenderAll(), n) : null;
	}
	apply() {
		let { _session: e } = this;
		if (!e) return null;
		let t = this._applySessionCrop({ session: e });
		return this._finishSession({ nextActiveObject: t?.target ?? null }), t ? (this.editor.historyManager.saveState(), this.editor.canvas.fire("editor:crop:applied", t), t) : null;
	}
	cancel() {
		let { _session: e } = this;
		return e ? (this._finishSession({ nextActiveObject: e.previousActiveObject }), this.editor.canvas.fire("editor:crop:cancelled", {
			mode: e.mode,
			target: e.target
		}), !0) : !1;
	}
	destroy() {
		this.cancel();
	}
	_createCanvasSession({ source: e, options: t }) {
		let n = this._resolveSessionOptions({ options: t });
		return {
			mode: "canvas",
			source: e,
			target: null,
			frame: this._createCropFrameForSource({
				source: e,
				options: t,
				sessionOptions: n
			}),
			options: n,
			previousActiveObject: this.editor.canvas.getActiveObject() ?? null,
			interactivity: [],
			sourceBoundFrameState: null,
			effectivePreserveAspectRatio: n.preserveAspectRatio
		};
	}
	_createImageSession({ target: e, options: t }) {
		let n = this._resolveSessionOptions({ options: t });
		return {
			mode: "image",
			source: e,
			target: e,
			frame: this._createCropFrameForSource({
				source: e,
				options: t,
				sessionOptions: n
			}),
			options: n,
			previousActiveObject: this.editor.canvas.getActiveObject() ?? null,
			interactivity: [],
			sourceBoundFrameState: null,
			effectivePreserveAspectRatio: n.preserveAspectRatio
		};
	}
	_resolveSessionOptions({ options: e }) {
		return {
			allowFrameOverflow: e.allowFrameOverflow ?? AC.allowFrameOverflow,
			showGrid: e.showGrid ?? AC.showGrid,
			showDimmedArea: e.showDimmedArea ?? AC.showDimmedArea,
			cancelOnSelectionClear: e.cancelOnSelectionClear ?? AC.cancelOnSelectionClear,
			preserveAspectRatio: e.preserveAspectRatio ?? AC.preserveAspectRatio
		};
	}
	_createCropFrameForSource({ source: e, options: t, sessionOptions: n }) {
		let r = Z({ source: e }), i = t.aspectRatio && e instanceof a ? _x({
			source: e,
			aspectRatio: t.aspectRatio
		}) : t.aspectRatio;
		return qS({
			source: e,
			cropSize: gx({
				sourceSize: r,
				size: t.size,
				aspectRatio: i,
				allowOverflow: n.allowFrameOverflow
			}),
			showGrid: n.showGrid,
			allowFrameOverflow: n.allowFrameOverflow,
			preserveAspectRatio: n.preserveAspectRatio
		});
	}
	_setFramePreserveAspectRatio({ frame: e, preserveAspectRatio: t }) {
		if (!(e instanceof KS)) throw Error("Crop session frame должен быть CropFrame");
		e.preserveAspectRatio = t;
	}
	_activateSession({ session: e }) {
		let { canvas: t, historyManager: n } = this.editor;
		n.suspendHistory(), this.editor.toolbar.hideTemporarily(), e.interactivity = this._disableSceneObjects(), this._session = e, e.options.showDimmedArea && hC({
			canvas: t,
			frame: e.frame
		}), this._bindCropFrameEvents({ frame: e.frame }), t.add(e.frame), t.bringObjectToFront(e.frame), t.setActiveObject(e.frame), this._clampFrameIfNeeded({ session: e }), this._bindCanvasSelectionEvents({ session: e }), t.requestRenderAll(), t.fire("editor:crop:started", this.getState());
	}
	_bindCropFrameEvents({ frame: e }) {
		e.on("moving", this._handleCropFrameChanged), e.on("scaling", this._handleCropFrameChanged), e.on("modified", this._handleCropFrameModified);
	}
	_unbindCropFrameEvents({ frame: e }) {
		e.off("moving", this._handleCropFrameChanged), e.off("scaling", this._handleCropFrameChanged), e.off("modified", this._handleCropFrameModified);
	}
	_bindCanvasSelectionEvents({ session: e }) {
		e.options.cancelOnSelectionClear && (this.editor.canvas.on("mouse:down:before", this._handleCanvasMouseDownBefore), this.editor.canvas.on("selection:cleared", this._handleCanvasSelectionChanged), this.editor.canvas.on("selection:updated", this._handleCanvasSelectionChanged));
	}
	_unbindCanvasSelectionEvents() {
		this.editor.canvas.off("mouse:down:before", this._handleCanvasMouseDownBefore), this.editor.canvas.off("selection:cleared", this._handleCanvasSelectionChanged), this.editor.canvas.off("selection:updated", this._handleCanvasSelectionChanged);
	}
	_restoreSourceBoundFrameIfNeeded({ session: e, event: t }) {
		if (!this._isSourceScaleClamped({ event: t })) return e.sourceBoundFrameState = null, !1;
		let n = this._getSourceBoundFrameStateFromEvent({
			session: e,
			event: t
		}) ?? e.sourceBoundFrameState;
		return n ? (nC({
			frame: e.frame,
			state: n
		}), !0) : !1;
	}
	_getSourceBoundFrameStateFromEvent({ session: e, event: t }) {
		let n = t?.transform?.cropSourceBoundScale;
		if (!n || !Number.isFinite(n.scaleX) || !Number.isFinite(n.scaleY)) return null;
		let r = this._getSourceBoundRectFromEvent({
			source: e.source,
			event: t
		});
		return r ? eC({
			source: e.source,
			frame: e.frame,
			rect: r,
			scale: n
		}) : {
			left: e.frame.left,
			top: e.frame.top,
			scaleX: n.scaleX,
			scaleY: n.scaleY
		};
	}
	_getSourceBoundRectFromEvent({ source: e, event: t }) {
		let n = t?.transform, r = n?.cropSourceBoundScale, i = n?.cropSourceScaleBounds, a = n?.original?.scaleX, o = n?.original?.scaleY;
		return !r || !i || typeof a != "number" || typeof o != "number" || !Number.isFinite(a) || !Number.isFinite(o) || a === 0 || o === 0 ? null : this._getAnchoredSourceBoundRectFromEvent({
			source: e,
			event: t,
			size: {
				width: i.startRect.width * Math.abs(r.scaleX / a),
				height: i.startRect.height * Math.abs(r.scaleY / o)
			}
		});
	}
	_restoreFrameScaleAnchorFromEventIfNeeded({ session: e, event: t }) {
		let { transform: n } = t ?? {};
		return n ? this._restoreFrameScaleAnchorFromTransform({
			session: e,
			transform: n
		}) : !1;
	}
	_restoreFrameScaleAnchorFromTransform({ session: e, transform: t }) {
		let n = iC({ session: e }), r = this._getAnchoredSourceBoundRectFromTransform({
			source: e.source,
			transform: t,
			size: {
				width: n.width,
				height: n.height
			}
		});
		return r ? (nC({
			frame: e.frame,
			state: eC({
				source: e.source,
				frame: e.frame,
				rect: r,
				scale: {
					scaleX: e.frame.scaleX ?? 1,
					scaleY: e.frame.scaleY ?? 1
				}
			})
		}), !0) : !1;
	}
	_getAnchoredSourceBoundRectFromEvent({ source: e, event: t, size: n }) {
		let { transform: r } = t ?? {};
		return r ? this._getAnchoredSourceBoundRectFromTransform({
			source: e,
			transform: r,
			size: n
		}) : null;
	}
	_getAnchoredSourceBoundRectFromTransform({ source: e, transform: t, size: n }) {
		let { cropSourceScaleBounds: r } = t;
		return r ? this._getAnchoredSourceBoundRect({
			bounds: r,
			size: n,
			anchorX: t.cropSourceScaleAnchorX ?? Ix({
				source: e,
				transform: t,
				axis: "x"
			}),
			anchorY: t.cropSourceScaleAnchorY ?? Ix({
				source: e,
				transform: t,
				axis: "y"
			})
		}) : null;
	}
	_getAnchoredSourceBoundRect({ bounds: e, size: t, anchorX: n, anchorY: r }) {
		return {
			left: this._resolveAnchoredSourceBoundStart({
				start: e.startRect.left,
				length: e.startRect.width,
				nextLength: t.width,
				anchor: n
			}),
			top: this._resolveAnchoredSourceBoundStart({
				start: e.startRect.top,
				length: e.startRect.height,
				nextLength: t.height,
				anchor: r
			}),
			width: t.width,
			height: t.height
		};
	}
	_resolveAnchoredSourceBoundStart({ start: e, length: t, nextLength: n, anchor: r }) {
		return r === "min" ? e : r === "max" ? e + t - n : e + (t - n) / 2;
	}
	_rememberSourceBoundFrameIfNeeded({ session: e, event: t }) {
		if (!this._isSourceScaleClamped({ event: t })) {
			e.sourceBoundFrameState = null;
			return;
		}
		e.sourceBoundFrameState = tC({ frame: e.frame });
	}
	_isSourceScaleClamped({ event: e }) {
		return e?.transform?.cropSourceScaleClamped === !0;
	}
	_resolveSourceBoundScalePlan({ target: e, source: t, transform: n, nextScaleX: r, nextScaleY: i }) {
		let { cropSourceScaleBounds: a } = n, o = n.original?.scaleX, s = n.original?.scaleY;
		if (!a || typeof o != "number" || typeof s != "number" || o === 0 || s === 0) return null;
		let c = r ?? e.scaleX ?? o, l = i ?? e.scaleY ?? s;
		if (!Number.isFinite(c) || !Number.isFinite(l)) return null;
		let u = n.cropSourceScaleAnchorX ?? Ix({
			source: t,
			transform: n,
			axis: "x"
		}), d = n.cropSourceScaleAnchorY ?? Ix({
			source: t,
			transform: n,
			axis: "y"
		}), f = zx({
			sourceSize: a.sourceSize,
			startRect: a.startRect,
			anchorX: u,
			anchorY: d
		});
		if (!f) return null;
		let p = Math.max(Math.abs(c / o), Math.abs(l / s)), m = Math.max(0, f.scale - p) * Math.min(a.startRect.width, a.startRect.height);
		if (p <= f.scale + MC && m > NC) return null;
		let h = {
			scaleX: o * f.scale,
			scaleY: s * f.scale
		};
		return {
			anchorX: u,
			anchorY: d,
			rect: f.rect,
			scale: h
		};
	}
	_markSourceBoundScalePlan({ transform: e, plan: t }) {
		e.cropSourceScaleClamped = !0, e.cropSourceScalePreserveAspectRatio = !0, e.cropSourceScaleAnchorX = t.anchorX, e.cropSourceScaleAnchorY = t.anchorY, e.cropSourceBoundScale = t.scale, e.scaleX = t.scale.scaleX, e.scaleY = t.scale.scaleY;
	}
	_isSpacePanActive() {
		return !!this.editor.listeners?.isSpacePressed;
	}
	_cancelFromPointerDown({ nextActiveObject: e }) {
		let { _session: t } = this;
		if (!t) return;
		let { canvas: n } = this.editor, r = n, i = r.skipTargetFind, a = {
			mode: t.mode,
			target: t.target
		};
		r.skipTargetFind = !0, r._targetInfo = {
			subTargets: [],
			currentSubTargets: []
		}, this._finishSession({ nextActiveObject: null }), this._deferPointerDownSelectionRestore({
			nextActiveObject: e,
			previousSkipTargetFind: i
		}), this.editor.canvas.fire("editor:crop:cancelled", a);
	}
	_deferPointerDownSelectionRestore({ nextActiveObject: e, previousSkipTargetFind: t }) {
		let n = () => {
			let n = this.editor.canvas;
			n.skipTargetFind = t, this._restoreActiveObject({ object: e }), this.editor.canvas.requestRenderAll();
		};
		if (typeof window > "u") {
			n();
			return;
		}
		window.setTimeout(n, 0);
	}
	_applyFrameSize({ session: e, size: t }) {
		e.frame.set({
			width: t.width,
			height: t.height,
			scaleX: e.source.scaleX ?? 1,
			scaleY: e.source.scaleY ?? 1
		}), e.frame.setCoords(), this._clampFrameIfNeeded({ session: e }), this.editor.canvas.requestRenderAll();
	}
	_clampFrameIfNeeded({ session: e, preserveAspectRatio: t = !1 }) {
		if (!e.options.allowFrameOverflow) {
			if (t) {
				bx({
					source: e.source,
					frame: e.frame
				});
				return;
			}
			yx({
				source: e.source,
				frame: e.frame
			});
		}
	}
	_applySessionCrop({ session: e }) {
		let t = e.options.allowFrameOverflow ? void 0 : Z({ source: e.source }), n = aC({
			rect: iC({ session: e }),
			sourceSize: t
		});
		return e.mode === "canvas" ? xC({
			editor: this.editor,
			frame: e.frame,
			rect: n
		}) : SC({
			editor: this.editor,
			target: e.target,
			frame: e.frame,
			rect: n
		});
	}
	_finishSession({ nextActiveObject: e }) {
		let { _session: t } = this;
		t && (this._unbindCropFrameEvents({ frame: t.frame }), this._unbindCanvasSelectionEvents(), gC({ canvas: this.editor.canvas }), this.editor.canvas.remove(t.frame), this._restoreSceneObjects({ interactivity: t.interactivity }), this.editor.historyManager.resumeHistory(), this._activeResizePreserveAspectRatio = null, this._session = null, this._restoreActiveObject({ object: e }), this.editor.toolbar.showAfterTemporary(), this.editor.canvas.requestRenderAll());
	}
	_disableSceneObjects() {
		return this.editor.canvasManager.getObjects().map((e) => {
			let t = {
				object: e,
				selectable: !!e.selectable,
				evented: !!e.evented
			};
			return e.set({
				selectable: !1,
				evented: !1
			}), t;
		});
	}
	_restoreSceneObjects({ interactivity: e }) {
		e.forEach((e) => {
			e.object.set({
				selectable: e.selectable,
				evented: e.evented
			}), e.object.setCoords();
		});
	}
	_restoreActiveObject({ object: e }) {
		let { canvas: t } = this.editor;
		if (!e) {
			t.discardActiveObject();
			return;
		}
		if (!t.getObjects().includes(e)) {
			t.discardActiveObject();
			return;
		}
		t.setActiveObject(e);
	}
	_emitInvalidImageTargetError({ target: e }) {
		this.editor.errorManager.emitError({
			origin: "CropManager",
			method: "startImageCrop",
			code: su.CROP_MANAGER.INVALID_IMAGE_TARGET,
			message: "Для кропа изображения нужно выбрать raster image объект.",
			data: {
				targetType: e?.type,
				targetId: e?.id
			}
		});
	}
	_emitLockedImageTargetError({ target: e }) {
		this.editor.errorManager.emitError({
			origin: "CropManager",
			method: "startImageCrop",
			code: su.CROP_MANAGER.LOCKED_IMAGE_TARGET,
			message: "Заблокированное изображение нельзя обрезать.",
			data: {
				targetType: e.type,
				targetId: e.id
			}
		});
	}
}, FC = class e {
	constructor(e, t) {
		this.options = t, this.containerId = e, this.editorId = `${e}-${E()}`, this.init();
	}
	async init() {
		let { editorContainerWidth: e, editorContainerHeight: n, canvasWrapperWidth: r, canvasWrapperHeight: i, canvasCSSWidth: a, canvasCSSHeight: o, initialImage: s, initialState: c, scaleType: l, showRotationAngle: u, showObjectSizeOnScale: d, showViewportScrollbars: f, _onReadyCallback: p } = this.options;
		if (we.apply(), this.canvas = new t(this.containerId, this.options), this.moduleLoader = new ie(), this.workerManager = new oe(), this.errorManager = new id({ editor: this }), this.historyManager = new tn({ editor: this }), this.toolbar = new ht({ editor: this }), this.transformManager = new yr({ editor: this }), this.zoomManager = new br({ editor: this }), this.canvasManager = new vr({ editor: this }), this.imageManager = new mr({ editor: this }), this.layerManager = new si({ editor: this }), this.shapeManager = new nu({ editor: this }), this.interactionBlocker = new ai({ editor: this }), this.backgroundManager = new oi({ editor: this }), this.clipboardManager = new iu({ editor: this }), this.objectLockManager = new au({ editor: this }), this.groupingManager = new ou({ editor: this }), this.selectionManager = new nd({ editor: this }), this.deletionManager = new rd({ editor: this }), this.panConstraintManager = new od({ editor: this }), this.snappingManager = new cx({ editor: this }), this.measurementManager = new ux({ editor: this }), this.fontManager = new Te(this.options.fonts ?? []), this.textManager = new Dh({ editor: this }), this.templateManager = new rg({ editor: this }), this.cropManager = new PC({ editor: this }), u && (this.angleIndicator = new yt({ editor: this })), d && (this.objectSizeIndicator = new St({ editor: this })), this._createMontageArea(), this._createClippingArea(), this.interactionBlocker.ensureOverlay(), this.listeners = new re({
			editor: this,
			options: this.options
		}), this.canvasManager.setEditorContainerWidth(e), this.canvasManager.setEditorContainerHeight(n), this.canvasManager.setCanvasWrapperWidth(r), this.canvasManager.setCanvasWrapperHeight(i), this.canvasManager.setCanvasCSSWidth(a), this.canvasManager.setCanvasCSSHeight(o), this.canvasManager.updateCanvas(), this.zoomManager.calculateAndApplyDefaultZoom(), f && (this.viewportScrollbars = new Ot({ editor: this })), await this.fontManager.loadFonts(), c) {
			this.historyManager.suspendHistory();
			try {
				let e = await this.imageManager.prepareSerializedImageSources({ state: c });
				await this.historyManager.loadStateFromFullState(e);
			} catch (e) {
				if (s?.source) {
					let { source: e, scale: t = `image-${l}`, withoutSave: n = !0, ...r } = s;
					await this.imageManager.importImage({
						source: e,
						scale: t,
						withoutSave: n,
						...r
					});
				}
				this.errorManager.emitError({
					origin: "ImageEditor",
					method: "init",
					code: "INITIAL_STATE_LOAD_FAILED",
					message: "Не удалось загрузить состояние редактора. Попытка импортировать начальное изображение.",
					data: e
				});
			} finally {
				this.historyManager.resumeHistory();
			}
		} else if (s?.source) {
			let { source: e, scale: t = `image-${l}`, withoutSave: n = !0, ...r } = s;
			await this.imageManager.importImage({
				source: e,
				scale: t,
				withoutSave: n,
				...r
			});
		}
		this.historyManager.saveState(), console.log("editor:ready"), this.canvas.fire("editor:ready", this), typeof p == "function" && p(this);
	}
	_createMontageArea() {
		let { montageAreaWidth: t, montageAreaHeight: n } = this.options, r = new p(t / 2, n / 2);
		this.montageArea = jr({
			canvas: this.canvas,
			centerPoint: r,
			options: {
				width: t,
				height: n,
				fill: e._createMosaicPattern(),
				stroke: null,
				strokeWidth: 0,
				selectable: !1,
				hasBorders: !1,
				hasControls: !1,
				evented: !1,
				id: "montage-area",
				originX: "center",
				originY: "center",
				objectCaching: !1,
				noScaleCache: !0
			},
			flags: { withoutSelection: !0 }
		});
	}
	_createClippingArea() {
		let { montageAreaWidth: e, montageAreaHeight: t } = this.options, n = new p(e / 2, t / 2);
		this.canvas.clipPath = jr({
			canvas: this.canvas,
			centerPoint: n,
			options: {
				id: "area-clip",
				width: e,
				height: t,
				stroke: null,
				strokeWidth: 0,
				hasBorders: !1,
				hasControls: !1,
				selectable: !1,
				evented: !1,
				originX: "center",
				originY: "center"
			},
			flags: {
				withoutSelection: !0,
				withoutAdding: !0
			}
		});
	}
	destroy() {
		this.listeners.destroy(), this.shapeManager?.destroy(), this.textManager?.destroy(), this.selectionManager.destroy(), this.snappingManager?.destroy(), this.measurementManager?.destroy(), this.toolbar.destroy(), this.angleIndicator?.destroy(), this.objectSizeIndicator?.destroy(), this.viewportScrollbars?.destroy(), this.cropManager?.destroy(), this.canvas.dispose(), this.workerManager.worker.terminate(), this.imageManager.revokeBlobUrls(), this.errorManager.cleanBuffer();
	}
	static _createMosaicPattern() {
		let e = document.createElement("canvas");
		e.width = 20, e.height = 20;
		let t = e.getContext("2d");
		return t.fillStyle = "#ddd", t.fillRect(0, 0, 40, 40), t.fillStyle = "#ccc", t.fillRect(0, 0, 10, 10), t.fillRect(10, 10, 10, 10), new f({
			source: e,
			repeat: "repeat"
		});
	}
}, Q = (/* @__PURE__ */ "U+0000-00FF.U+0100-02BA.U+02BB-02BC.U+02BD-02C5.U+02C7-02CC.U+02CE-02D7.U+02DD-02FF.U+02C6.U+02DC.U+0304.U+0308.U+0329.U+1D00-1DBF.U+1E00-1E9F.U+1EF2-1EFF.U+2000-206F.U+2020.U+20A0-20AB.U+20AD-20C0.U+2113.U+2122.U+2191.U+2193.U+2212.U+2215.U+2C60-2C7F.U+A720-A7FF.U+FEFF.U+FFFD".split(".")).join(", "), $ = [
	"U+0301",
	"U+0400-052F",
	"U+1C80-1C8A",
	"U+20B4",
	"U+2DE0-2DFF",
	"U+A640-A69F",
	"U+FE2E-FE2F",
	"U+2116"
].join(", "), IC = {
	preserveObjectStacking: !0,
	controlsAboveOverlay: !0,
	centeredRotation: !0,
	enableRetinaScaling: !1,
	selectionKey: ["ctrlKey", "metaKey"],
	montageAreaWidth: 512,
	montageAreaHeight: 512,
	canvasBackstoreWidth: "auto",
	canvasBackstoreHeight: "auto",
	canvasCSSWidth: "100%",
	canvasCSSHeight: "100%",
	canvasWrapperWidth: "100%",
	canvasWrapperHeight: "100%",
	editorContainerWidth: "fit-content",
	editorContainerHeight: "100%",
	maxHistoryLength: 50,
	scaleType: "contain",
	acceptContentTypes: [
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/svg+xml",
		"image/webp"
	],
	showToolbar: !0,
	toolbar: {
		lockedActions: [{
			name: "Разблокировать",
			handle: "unlock"
		}],
		actions: [
			{
				name: "Создать копию",
				handle: "copyPaste"
			},
			{
				name: "Заблокировать",
				handle: "lock"
			},
			{
				name: "На передний план",
				handle: "bringToFront"
			},
			{
				name: "На задний план",
				handle: "sendToBack"
			},
			{
				name: "На один уровень вверх",
				handle: "bringForward"
			},
			{
				name: "На один уровень вниз",
				handle: "sendBackwards"
			},
			{
				name: "Удалить",
				handle: "delete"
			}
		]
	},
	initialState: null,
	initialImage: null,
	defaultScale: .5,
	minZoom: .1,
	maxZoom: 2,
	zoomRatio: .1,
	overlayMaskColor: "rgba(136, 136, 136, 0.6)",
	showRotationAngle: !0,
	showObjectSizeOnScale: !0,
	showViewportScrollbars: !0,
	adaptCanvasToContainerOnResize: !0,
	mouseWheelZooming: !0,
	canvasDragging: !0,
	copyObjectsByHotkey: !0,
	cutObjectsByHotkey: !0,
	duplicateObjectsByHotkey: !0,
	pasteImageFromClipboard: !0,
	undoRedoByHotKeys: !0,
	selectAllByHotkey: !0,
	deleteObjectsByHotkey: !0,
	resetObjectFitByDoubleClick: !0,
	keyboardIgnoreSelectors: [],
	fonts: [
		{
			family: "Arial",
			source: "local(\"Arial\"), local(\"Liberation Sans\"), local(\"DejaVu Sans\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap"
			}
		},
		{
			family: "Alegreya Sans",
			source: "url(https://fonts.gstatic.com/s/alegreyasans/v26/5aUz9_-1phKLFgshYDvh6Vwt7V5tvXVX.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Alegreya Sans",
			source: "url(https://fonts.gstatic.com/s/alegreyasans/v26/5aUz9_-1phKLFgshYDvh6Vwt7VptvQ.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Alegreya Sans",
			source: "url(https://fonts.gstatic.com/s/alegreyasans/v26/5aUu9_-1phKLFgshYDvh6Vwt5eFIqE52i1dC.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Alegreya Sans",
			source: "url(https://fonts.gstatic.com/s/alegreyasans/v26/5aUu9_-1phKLFgshYDvh6Vwt5eFIqEp2iw.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Oswald",
			source: "url(https://fonts.gstatic.com/s/oswald/v57/TK3iWkUHHAIjg752HT8Ghe4.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "200 700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Oswald",
			source: "url(https://fonts.gstatic.com/s/oswald/v57/TK3iWkUHHAIjg752GT8G.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "200 700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Caveat",
			source: "url(https://fonts.gstatic.com/s/caveat/v23/Wnz6HAc5bAfYB2Q7YjYYmg8.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400 700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Caveat",
			source: "url(https://fonts.gstatic.com/s/caveat/v23/Wnz6HAc5bAfYB2Q7ZjYY.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400 700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Cormorant",
			source: "url(https://fonts.gstatic.com/s/cormorant/v24/H4clBXOCl9bbnla_nHIq65u9uqc.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Cormorant",
			source: "url(https://fonts.gstatic.com/s/cormorant/v24/H4clBXOCl9bbnla_nHIq75u9.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Comfortaa",
			source: "url(https://fonts.gstatic.com/s/comfortaa/v47/1Ptsg8LJRfWJmhDAuUs4SYFqPfE.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Comfortaa",
			source: "url(https://fonts.gstatic.com/s/comfortaa/v47/1Ptsg8LJRfWJmhDAuUs4TYFq.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Didact Gothic",
			source: "url(https://fonts.gstatic.com/s/didactgothic/v21/ahcfv8qz1zt6hCC5G4F_P4ASlU-YpnLl.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Didact Gothic",
			source: "url(https://fonts.gstatic.com/s/didactgothic/v21/ahcfv8qz1zt6hCC5G4F_P4ASlUuYpg.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Arimo",
			source: "url(https://fonts.gstatic.com/s/arimo/v35/P5sMzZCDf9_T_10dxCF8jA.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400 700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Arimo",
			source: "url(https://fonts.gstatic.com/s/arimo/v35/P5sMzZCDf9_T_10ZxCE.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400 700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Bitter",
			source: "url(https://fonts.gstatic.com/s/bitter/v40/rax8HiqOu8IVPmn7e4xpPDk.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Bitter",
			source: "url(https://fonts.gstatic.com/s/bitter/v40/rax8HiqOu8IVPmn7f4xp.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Anonymous Pro",
			source: "url(https://fonts.gstatic.com/s/anonymouspro/v22/rP2Bp2a15UIB7Un-bOeISG3pHl829RH9.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Anonymous Pro",
			source: "url(https://fonts.gstatic.com/s/anonymouspro/v22/rP2Bp2a15UIB7Un-bOeISG3pHls29Q.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Anonymous Pro",
			source: "url(https://fonts.gstatic.com/s/anonymouspro/v22/rP2cp2a15UIB7Un-bOeISG3pFuAT4Crc7ZOy.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Anonymous Pro",
			source: "url(https://fonts.gstatic.com/s/anonymouspro/v22/rP2cp2a15UIB7Un-bOeISG3pFuAT4C7c7Q.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "El Messiri",
			source: "url(https://fonts.gstatic.com/s/elmessiri/v25/K2F0fZBRmr9vQ1pHEey6MomAAhLz.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400 700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "El Messiri",
			source: "url(https://fonts.gstatic.com/s/elmessiri/v25/K2F0fZBRmr9vQ1pHEey6Mo2AAg.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400 700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Exo 2",
			source: "url(https://fonts.gstatic.com/s/exo2/v26/7cHmv4okm5zmbtYsK-4E4Q.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Exo 2",
			source: "url(https://fonts.gstatic.com/s/exo2/v26/7cHmv4okm5zmbtYoK-4.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9C4kDNxMZdWfMOD5Vn9LjNYTLHdQ.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9C4kDNxMZdWfMOD5Vn9LjJYTI.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnWKneQhf6TF0.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "200",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnWKneRhf6.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "200",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnPKreQhf6TF0.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnPKreRhf6.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9E4kDNxMZdWfMOD5Vvk4jLeTY.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9E4kDNxMZdWfMOD5Vvl4jL.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnZKveQhf6TF0.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "500",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnZKveRhf6.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "500",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnSKzeQhf6TF0.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "600",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnSKzeRhf6.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "600",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnLK3eQhf6TF0.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnLK3eRhf6.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnMK7eQhf6TF0.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "800",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnMK7eRhf6.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "800",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnFK_eQhf6TF0.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Fira Sans",
			source: "url(https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnFK_eRhf6.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Istok Web",
			source: "url(https://fonts.gstatic.com/s/istokweb/v26/3qTvojGmgSyUukBzKslpAmt_xkI.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Istok Web",
			source: "url(https://fonts.gstatic.com/s/istokweb/v26/3qTvojGmgSyUukBzKslpBmt_.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Istok Web",
			source: "url(https://fonts.gstatic.com/s/istokweb/v26/3qTqojGmgSyUukBzKslhvU5q_WMVUBc.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Istok Web",
			source: "url(https://fonts.gstatic.com/s/istokweb/v26/3qTqojGmgSyUukBzKslhvU5q-WMV.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Jost",
			source: "url(https://fonts.gstatic.com/s/jost/v20/92zatBhPNqw73oDd4iYl.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Jost",
			source: "url(https://fonts.gstatic.com/s/jost/v20/92zatBhPNqw73oTd4g.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Jura",
			source: "url(https://fonts.gstatic.com/s/jura/v34/z7NbdRfiaC4VXcBJURRD.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Jura",
			source: "url(https://fonts.gstatic.com/s/jura/v34/z7NbdRfiaC4VXcRJUQ.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Lobster",
			source: "url(https://fonts.gstatic.com/s/lobster/v32/neILzCirqoswsqX9zoamM5Ez.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Lobster",
			source: "url(https://fonts.gstatic.com/s/lobster/v32/neILzCirqoswsqX9zoKmMw.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Manrope",
			source: "url(https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggOxSuXd.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "200 800",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Manrope",
			source: "url(https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSg.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "200 800",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Montserrat",
			source: "url(https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459W1hyzbi.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Montserrat",
			source: "url(https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Neucha",
			source: "url(https://fonts.gstatic.com/s/neucha/v18/q5uGsou0JOdh94bfuQltOxU.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Neucha",
			source: "url(https://fonts.gstatic.com/s/neucha/v18/q5uGsou0JOdh94bfvQlt.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Noto Serif",
			source: "url(https://fonts.gstatic.com/s/notoserif/v33/ga6daw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTYf-D33Esw.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Noto Serif",
			source: "url(https://fonts.gstatic.com/s/notoserif/v33/ga6daw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTYf6D30.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Open Sans",
			source: "url(https://fonts.gstatic.com/s/opensans/v44/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSumu1aB.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 800",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Open Sans",
			source: "url(https://fonts.gstatic.com/s/opensans/v44/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 800",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "PT Serif",
			source: "url(https://fonts.gstatic.com/s/ptserif/v19/EJRVQgYoZZY2vCFuvAFSzr-tdg.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "PT Serif",
			source: "url(https://fonts.gstatic.com/s/ptserif/v19/EJRVQgYoZZY2vCFuvAFWzr8.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "PT Serif",
			source: "url(https://fonts.gstatic.com/s/ptserif/v19/EJRSQgYoZZY2vCFuvAnt66qWVyvHpA.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "PT Serif",
			source: "url(https://fonts.gstatic.com/s/ptserif/v19/EJRSQgYoZZY2vCFuvAnt66qSVys.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "700",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Playfair",
			source: "url(https://fonts.gstatic.com/s/playfair/v10/0nk2C9D7PO4KhmUJ5_zTZ-wCMUXynAK-5UQzVItagFk.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Playfair",
			source: "url(https://fonts.gstatic.com/s/playfair/v10/0nk2C9D7PO4KhmUJ5_zTZ-wCMUXynAK-5UQzUIta.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "300 900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Press Start 2P",
			source: "url(https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nRivN04w.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Press Start 2P",
			source: "url(https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "400",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Raleway",
			source: "url(https://fonts.gstatic.com/s/raleway/v37/1Ptug8zYS_SKggPNyCkIT5lu.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Raleway",
			source: "url(https://fonts.gstatic.com/s/raleway/v37/1Ptug8zYS_SKggPNyC0ITw.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: Q
			}
		},
		{
			family: "Roboto",
			source: "url(https://fonts.gstatic.com/s/roboto/v50/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3iUBGEe.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: $
			}
		},
		{
			family: "Roboto",
			source: "url(https://fonts.gstatic.com/s/roboto/v50/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2) format(\"woff2\")",
			descriptors: {
				style: "normal",
				weight: "100 900",
				display: "swap",
				unicodeRange: Q
			}
		}
	]
};
//#endregion
//#region src/main.ts
function LC(e, t = {}) {
	let n = {
		...IC,
		...t
	}, r = document.getElementById(e);
	if (!r) return Promise.reject(/* @__PURE__ */ Error(`Контейнер с ID "${e}" не найден.`));
	let i = document.createElement("canvas");
	return i.id = `${e}-canvas`, r.appendChild(i), n.editorContainer = r, new Promise((t) => {
		n._onReadyCallback = t;
		let r = new FC(i.id, n);
		window[e] = r;
	});
}
//#endregion
export { LC as default };

//# sourceMappingURL=main.js.map