# TextManager

`TextManager` owns standalone text creation, updates, editing, canonical size changes, and the text-driven part of unified scaling for supported `ActiveSelection` compositions. These compositions may contain standalone texts, direct images, and the full mixed set of an image, a canonical unrotated shape, and standalone text. It keeps text layout rules out of `SnappingManager` and `SelectionManager`.

## Responsibility split

- [`index.ts`](./index.ts) is the facade and event boundary. It routes creation, updates, editing, standalone resizing, standalone corner scaling, and supported text-driven selection commits.
- [`background-textbox.ts`](./background-textbox.ts) defines the editor's standalone text object and its persisted geometry.
- [`text-update-controller.ts`](./text-update-controller.ts) applies programmatic text and style updates.
- [`scaling/text-width-resize-interaction-controller.ts`](./scaling/text-width-resize-interaction-controller.ts) owns unified width changes through `ml` and `mr` for one standalone text object.
- [`scaling/text-corner-scale-interaction-controller.ts`](./scaling/text-corner-scale-interaction-controller.ts) owns unified corner scaling for one standalone text object.
- [`scaling/active-selection-scaling-controller.ts`](./scaling/active-selection-scaling-controller.ts) owns text-driven eligibility, measurement state, canonical text application, commit, and cleanup for a supported `ActiveSelection`.
- [`scaling/active-selection-text-children.ts`](./scaling/active-selection-text-children.ts) contains the shared eligibility check for canonical standalone text children.
- [`scaling/active-selection-scale-measurer.ts`](./scaling/active-selection-scale-measurer.ts) measures every selected text on a detached object, projects direct images from the same immutable baseline, accepts exact shape geometry from its domain source, and combines all results into one exact selection frame.
- [`scaling/active-selection-scale-plan.ts`](./scaling/active-selection-scale-plan.ts) refines the shared snapping plan against actual wrapping and canonical text geometry.
- [`scaling/text-scaling-materialization.ts`](./scaling/text-scaling-materialization.ts) applies measured width, font size, padding, corner radii, and placement without leaving accumulated Fabric scale on the text.

## Standalone text resizing

Width resizing supports `ml` and `mr`. The interaction keeps font size unchanged, measures wrapping before changing the live object, respects the longest unbreakable line, preserves the opposite side or centre, and publishes a guide only after the final edge has been verified.

Corner scaling supports `tl`, `tr`, `bl`, and `br`. Proportional scaling changes width, font size, padding, and corner radii together. The result is measured on a detached `BackgroundTextbox`, applied once to the live object, and committed with `scaleX` and `scaleY` equal to `1`. Fractional canonical geometry is preserved through history, copying, and templates.

Nested text, text owned by a shape, text on a path, editing text, locked text, skew, flip, nonzero stroke width, and custom control behaviour remain on the existing path.

## Text-driven ActiveSelection scaling

`SelectionManager` owns the browser gesture, shared snapping session, common plan, application, verification, and coordinated commit. `TextManager` owns standalone text measurement and canonical text commit. In the full mixed composition, `ShapeManager` separately owns shape layout, minimum size, and canonical shape commit. This boundary keeps both domain rule sets out of the shared snapping code and prevents either domain manager from starting a second snapping session for the same pointer step.

A supported text-driven selection contains at least one direct top-level `BackgroundTextbox` and at least two objects in total. It may contain canonical standalone texts and canonical direct `FabricImage` children, or it may be the full mixed composition with at least one image, one canonical unrotated shape, and one canonical standalone text. The selection and every text must have unit scale; texts must also have zero angle, skew, flip, and stroke width, no path or parent, no editing or locked state, and no locked scale axis. Images may retain a positive finite scale but must have zero angle, skew, flip, and stroke width, no parent, and no locked scale axis. Shapes must use complete canonical geometry with unit scale and zero angle, skew, or flip. The selection supports `ml`, `mr`, `tl`, `tr`, `bl`, and `br`. The vertical side controls stay hidden because height-only resizing has no standalone text contract.

At the start of a gesture, the measurer stores the immutable selection frame, fixed point, child placement, and canonical text and image geometry. For every unconstrained pointer step it measures all texts on detached objects, projects images from the same baseline, requests the exact constrained shape geometry from `ShapeManager` when the composition contains a shape, and returns one combined frame. The shared runtime may then refine a selected guide against that measured frame before any live child is changed. An applied measurement remains pending until `SelectionManager` verifies the exact combined result. Only then is a direct snapshot of the selection and its live children promoted to the confirmed state; a failed step restores that snapshot without repeating domain application. During hold, the last confirmed measurement is reused until the runtime releases the guide, so pointer micro-movements cannot change the selection frame, child geometry, font size, or size indicator.

Horizontal scaling changes each text width and placement without changing font size. Proportional corner scaling changes width, font size, padding, and corner radii together. Free corner scaling follows both pointer axes and verifies each reached guide independently. A real width change made by horizontal or free scaling disables `autoExpand`, matching standalone manual width changes. Measurement caches include the current `autoExpand` state, so switching between proportional and free modes cannot restore geometry calculated before that state changed. Direct images follow the same local frame by changing only their calculated position and scale; source dimensions, crop, angle, skew, flip, and origin remain unchanged. Shape geometry returned by `ShapeManager` is merged into the same measured frame and applied through the domain source after all constraints have been resolved. During the gesture, canonical child geometry is combined with an inverse child scale so the temporary selection frame remains visually correct. On `object:modified`, `SelectionManager` removes the old frame, asks `TextManager` to validate the confirmed canonical geometry while retaining its rollback snapshot, prepares shape geometry when required, and then creates the replacement `ActiveSelection` with its original rotation and unit scale. The retained text snapshot is cleared only after that replacement exists.

If the user presses Shift on a side control after a confirmed scale step, the last confirmed state is restored and committed before the current Fabric transform ends. Skew is not applied in that case; continuing it in the same gesture would require rebuilding the Fabric transform for the new canonical selection frame. A later gesture starts with a fresh snapping session. A shape is accepted only as part of the explicit full mixed composition with an image and standalone text. Individually rotated shape or text children, noncanonical image children, flipped or skewed children or selection frames, nested objects, `Group`, `CropFrame`, and unknown compositions remain on the existing snapping path.

## Persisted and transient state

`preserveExactTextGeometry` is persisted when unified corner scaling or supported selection scaling produces exact fractional text geometry. Restoration must keep the serialized width and height instead of recalculating them from font metrics. For every fixed-width standalone text, the serialized width remains the source of truth during restoration; a newly measured `dynamicMinWidth` constrains live resizing but must not change undo or redo geometry.

Detached measurement objects, cached measurements, the current fixed point, held guides, and the temporary `ActiveSelection` are transient. During a coordinated commit, the confirmed rollback snapshot is retained until the replacement `ActiveSelection` has been created and is cleared during finalization after that geometry commit point. Other transient state is cleared on cancellation, selection changes, child removal, a new gesture, window blur, and manager destruction.

## Before changing this manager

- Keep text layout and minimum-size rules in `TextManager`; shared snapping code should receive measured geometry, not reimplement wrapping.
- Measure nonlinear text geometry before mutating the live object and verify the final scene bounds after applying it.
- Keep persisted exact geometry separate from transient measurement state.
- Route a new selection composition through one gesture owner before enabling unified snapping for it.
- Cover intermediate hold states, every supported control, Ctrl and Shift behaviour, minimum size, `mouseup`, history, interruption, copying, and template restoration.

## Validation

For focused changes in this manager, run:

```bash
npm run typecheck
npx eslint --no-cache src/editor/text-manager e2e/models/text e2e/models/selection
npm run test -- specs/src/editor/text-manager specs/src/editor/selection-manager --runInBand
npx playwright test e2e/tests/snapping-manager/text e2e/tests/snapping-manager/selection --project=chromium --workers=1
```

Also run the changed-code audit used by this project:

```bash
{ rtk npx fallow audit --format json --quiet 2>/dev/null || true; } | head -c 12000
```
