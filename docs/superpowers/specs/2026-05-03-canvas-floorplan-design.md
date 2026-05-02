# Canvas Floor Plan Design

**Date:** 2026-05-03
**PRD:** munnku/homeai #18
**Issues:** #19–#26

---

## Overview

Replace the fixed CSS Grid floor plan (HomeScreen) with a free-placement canvas editor. Room tiles and furniture tiles are rounded-rectangle divs positioned absolutely within a CSS-transform viewport. Users can freely arrange, resize, zoom, and pan their floor plan layout.

---

## Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Canvas rendering | CSS Transforms + div | No new deps; Tailwind works; sufficient for ≤20 rooms / ≤50 furniture |
| Gesture handling | @use-gesture/react | Handles pinch+pan+longpress edge cases; ~20KB |
| Grid unit | 20px @ zoom 1.0 | Fine enough for detail, coarse enough for finger accuracy |
| Long press threshold | 300ms | Distinguishes tap-to-navigate from drag-to-move |

---

## Data Model

### CanvasPos (replaces GridPos)

```ts
interface CanvasPos {
  x: number  // left edge, in grid units
  y: number  // top edge, in grid units
  w: number  // width, in grid units
  h: number  // height, in grid units
}
```

Both `Room` and `Furniture` use `CanvasPos`. Minimum tile size: 2×2 grid units.

### App.tsx stack change

```ts
// room stack item gains one optional field
{ type: 'room', room: Room, highlightFurnitureId?: string }
```

---

## Components

### CanvasEngine

Manages the viewport transform. Accepts children (tiles) and renders them inside a CSS-transformed container.

**State:** `{ offsetX: number, offsetY: number, zoom: number }`

**Gestures (via @use-gesture/react):**
- `useDrag` on the canvas background → pan (updates offsetX/offsetY)
- `usePinch` on the canvas container → zoom (0.25×–3×, centered on pinch midpoint)

**CSS applied to inner container:**
```
transform: translate(${offsetX}px, ${offsetY}px) scale(${zoom})
transform-origin: 0 0
```

**On mount:** calls `fitToScreen(tiles, viewportSize)` to set initial zoom and offset so all tiles are centered and visible.

**iOS Safari:** all interactive elements set `touch-action: none` to prevent scroll interference.

---

### CanvasTile

Rounded-rectangle tile for both rooms and furniture.

**Props:** `pos: CanvasPos`, `label: string`, `icon: ReactNode`, `editMode: boolean`, `highlight: HighlightState`, `onTap: () => void`

**Positioning:** `position: absolute`, `left: pos.x * UNIT`, `top: pos.y * UNIT`, `width: pos.w * UNIT`, `height: pos.h * UNIT`

**In view mode:** short tap fires `onTap` (navigate).

**In edit mode:** long press (>300ms) enters drag; short tap (<300ms) does nothing.

**Drag state machine (edit mode):**
```
IDLE → (touch start) → PRESSING
PRESSING → (300ms elapsed) → DRAGGING  (grid-snapped position tracks pointer)
PRESSING → (<300ms release) → TAP (ignored in edit mode)
DRAGGING → (release) → IDLE  (saves new CanvasPos to parent state)
```

---

### EdgeHandles

Shown only in edit mode. Four handles (top, bottom, left, right) on each tile.

Each handle uses `useDrag`. Dragging a handle moves only the corresponding edge, snapping to grid. Resize is clamped to minimum 2×2 grid units. On release, saves updated `CanvasPos`.

---

### ZoomPanControls

Floating UI (bottom-left of screen):
- **+** button → zoom in by 0.25×
- **−** button → zoom out by 0.25×
- **⊡** button → call `fitToScreen()` and reset viewport

---

### EditModeButton

Floating pencil icon (bottom-right). Toggles `editMode` boolean. Visual state change (filled vs outline icon) indicates current mode.

---

### AddTileModal

Bottom sheet modal. Opens when + button is tapped in edit mode.

**Fields:**
- Name: text input
- Icon: grid of available icons. Room context: living, kitchen, bedroom, bathroom, child, storage. Furniture context: sofa, desk, bed, shelf, fridge, drawer (new furniture icons to be added to Icons.tsx).

On confirm: new tile added at default position (top-left of current viewport, snapped to grid).
On cancel: no state change.

---

### GridBackground

Rendered inside CanvasEngine in edit mode only. Subtle dot grid at 20px intervals (scales with zoom). Provides visual alignment reference.

---

## Utility Functions

All pure functions, all unit-tested.

```ts
gridSnap(value: number, unit: number): number
// Rounds value to nearest multiple of unit

fitToScreen(tiles: CanvasPos[], viewport: { w: number, h: number }): Viewport
// Returns { offsetX, offsetY, zoom } so all tiles fit centered with padding

toPixels(gridUnits: number, zoom: number): number
toGrid(pixels: number, zoom: number): number
```

---

## Screens

### FloorPlanScreen (replaces HomeScreen)

- Header: "Homy-shelf" brand text (search bar removed)
- Body: CanvasEngine with one CanvasTile per Room
- Floating EditModeButton (bottom-right)
- ZoomPanControls (bottom-left)
- In edit mode: GridBackground + EdgeHandles on tiles + AddTileModal trigger
- Tapping a tile (view mode) → pushes `{ type: 'room', room }` to stack → RoomCanvasScreen

### RoomCanvasScreen (new)

- Header: room name + back button
- Body: CanvasEngine with one CanvasTile per Furniture, canvas size proportional to room's CanvasPos w×h
- Same edit interactions as FloorPlanScreen
- Accepts `highlightFurnitureId?: string` prop
- On mount with highlightFurnitureId: activates HighlightSystem on that tile; initial viewport centers on the highlighted tile at zoom 1.0× (overrides the default fitToScreen-all behavior)
- Tapping a furniture tile (view mode) → FurnitureDetailScreen (existing behavior)

---

## Highlight System

Activated when `RoomCanvasScreen` receives a `highlightFurnitureId`.

**State transitions:**
```
none → pulsing → highlighted
```

- **pulsing:** CSS keyframe animation — scale 1→1.06→1, opacity 1→0.7→1 — runs 3 times over 800ms total
- **highlighted:** amber border `2px solid #c8913a` remains until the screen is unmounted
- Transitions are managed by a `useHighlight(id)` hook that takes the furniture id and returns the current `HighlightState`

---

## Navigation: "View in Floor Plan"

**Entry point:** ItemDetailScreen — new button below existing action buttons.

**Flow:**
1. User taps "間取り図で見る" on ItemDetailScreen
2. App.tsx: `pushRoom(item.roomId, item.furnitureId)`
3. Stack gains: `{ type: 'room', room, highlightFurnitureId: item.furnitureId }`
4. RoomCanvasScreen renders with highlight active
5. `fitToScreen` zooms/pans to show the highlighted furniture tile centered

---

## Gesture Conflict Resolution

| Touch target | View mode | Edit mode |
|-------------|-----------|-----------|
| Tile (<300ms tap) | Navigate | Nothing |
| Tile (>300ms long press) | Nothing | Drag tile |
| Canvas background (1-finger) | Pan | Pan |
| Anywhere (2-finger pinch) | Zoom | Zoom |
| Edge handle | Hidden | Resize tile |

Pan on canvas background uses `useDrag` bound to the outer wrapper (not tiles). Tiles stop event propagation in edit mode to prevent pan from triggering during a drag.

---

## Testing

Only pure utility functions are unit-tested. Component behavior is verified via the running app.

| Test | What it verifies |
|------|-----------------|
| `gridSnap` | Positive, negative, fractional inputs snap correctly |
| `fitToScreen` | zoom and offset center all tiles with padding |
| `toPixels / toGrid` | Round-trip conversion is consistent |
| `useHighlight` | State transitions: none → pulsing → highlighted on timer |
| EdgeHandle clamp | Resize below 2×2 minimum is clamped |
| DragAndDrop state machine | Tap (<300ms) stays TAP; long press (>300ms) enters DRAGGING |

---

## Out of Scope

- Backend persistence of canvas state
- Undo/redo
- Tile rotation
- Multi-floor layouts
- Drag-and-drop items between rooms via canvas
