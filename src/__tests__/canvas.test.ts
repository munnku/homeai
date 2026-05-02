import { gridSnap, toPixels, toGrid, fitToScreen, clampTileSize, GRID_UNIT } from '@/lib/canvas'
import type { CanvasPos } from '@/lib/data'

describe('gridSnap', () => {
  it('snaps positive value to nearest grid unit', () => {
    expect(gridSnap(25, GRID_UNIT)).toBe(20)
    expect(gridSnap(35, GRID_UNIT)).toBe(40)
  })

  it('snaps to exact grid unit when already aligned', () => {
    expect(gridSnap(40, GRID_UNIT)).toBe(40)
  })

  it('snaps negative values correctly', () => {
    expect(gridSnap(-25, GRID_UNIT)).toBe(-20)
    expect(gridSnap(-35, GRID_UNIT)).toBe(-40)
  })

  it('snaps fractional pixel values', () => {
    expect(gridSnap(10.6, GRID_UNIT)).toBe(20)
    expect(gridSnap(9.4, GRID_UNIT)).toBe(0)
  })
})

describe('toPixels / toGrid', () => {
  it('converts grid units to pixels at zoom 1', () => {
    expect(toPixels(3)).toBe(60)
  })

  it('converts grid units to pixels with zoom', () => {
    expect(toPixels(3, 2)).toBe(120)
  })

  it('converts pixels to grid units at zoom 1', () => {
    expect(toGrid(60)).toBe(3)
  })

  it('round-trips correctly: toGrid(toPixels(n)) === n', () => {
    expect(toGrid(toPixels(5))).toBe(5)
    expect(toGrid(toPixels(5, 1.5), 1.5)).toBe(5)
  })
})

describe('fitToScreen', () => {
  const tiles: CanvasPos[] = [
    { x: 0, y: 0, w: 2, h: 2 },
    { x: 2, y: 0, w: 2, h: 1 },
    { x: 0, y: 2, w: 2, h: 1 },
  ]

  it('returns zoom 1 for empty tiles array', () => {
    const result = fitToScreen([], { w: 400, h: 600 })
    expect(result.zoom).toBe(1)
  })

  it('returns positive zoom for normal tile set', () => {
    const result = fitToScreen(tiles, { w: 400, h: 600 })
    expect(result.zoom).toBeGreaterThan(0)
    expect(result.zoom).toBeLessThanOrEqual(3)
  })

  it('centers tiles in viewport (offsetX positive when canvas narrower than viewport)', () => {
    const result = fitToScreen(tiles, { w: 400, h: 600 })
    expect(result.offsetX).toBeGreaterThan(0)
    expect(result.offsetY).toBeGreaterThan(0)
  })

  it('respects padding — zoom does not exceed screen bounds minus padding', () => {
    const padding = 40
    const viewport = { w: 400, h: 600 }
    const result = fitToScreen(tiles, viewport, padding)
    const contentW = 4 * GRID_UNIT * result.zoom
    const contentH = 3 * GRID_UNIT * result.zoom
    expect(contentW).toBeLessThanOrEqual(viewport.w - padding * 2 + 0.01)
    expect(contentH).toBeLessThanOrEqual(viewport.h - padding * 2 + 0.01)
  })
})

describe('clampTileSize', () => {
  it('keeps size unchanged when above minimum', () => {
    const pos: CanvasPos = { x: 0, y: 0, w: 4, h: 3 }
    expect(clampTileSize(pos)).toEqual(pos)
  })

  it('clamps width below minimum to minimum', () => {
    const pos: CanvasPos = { x: 0, y: 0, w: 1, h: 3 }
    expect(clampTileSize(pos).w).toBe(2)
  })

  it('clamps height below minimum to minimum', () => {
    const pos: CanvasPos = { x: 0, y: 0, w: 3, h: 1 }
    expect(clampTileSize(pos).h).toBe(2)
  })

  it('does not change x, y', () => {
    const pos: CanvasPos = { x: 5, y: 3, w: 1, h: 1 }
    const result = clampTileSize(pos)
    expect(result.x).toBe(5)
    expect(result.y).toBe(3)
  })
})
