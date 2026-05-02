import type { CanvasPos } from './data'

export const GRID_UNIT = 20 // px at zoom 1.0
export const MIN_TILE_UNITS = 2 // minimum tile width/height in grid units

export interface Viewport {
  offsetX: number
  offsetY: number
  zoom: number
}

export function gridSnap(value: number, unit: number = GRID_UNIT): number {
  return Math.round(value / unit) * unit
}

export function toPixels(gridUnits: number, zoom = 1): number {
  return gridUnits * GRID_UNIT * zoom
}

export function toGrid(pixels: number, zoom = 1): number {
  return pixels / (GRID_UNIT * zoom)
}

export function fitToScreen(
  tiles: CanvasPos[],
  viewport: { w: number; h: number },
  padding = 40,
): Viewport {
  if (tiles.length === 0) return { offsetX: 0, offsetY: 0, zoom: 1 }

  const minX = Math.min(...tiles.map(t => t.x))
  const minY = Math.min(...tiles.map(t => t.y))
  const maxX = Math.max(...tiles.map(t => t.x + t.w))
  const maxY = Math.max(...tiles.map(t => t.y + t.h))

  const contentW = (maxX - minX) * GRID_UNIT
  const contentH = (maxY - minY) * GRID_UNIT

  const scaleX = (viewport.w - padding * 2) / contentW
  const scaleY = (viewport.h - padding * 2) / contentH
  const zoom = Math.min(scaleX, scaleY, 3)

  const scaledW = contentW * zoom
  const scaledH = contentH * zoom

  const offsetX = (viewport.w - scaledW) / 2 - minX * GRID_UNIT * zoom
  const offsetY = (viewport.h - scaledH) / 2 - minY * GRID_UNIT * zoom

  return { offsetX, offsetY, zoom }
}

export function clampTileSize(pos: CanvasPos): CanvasPos {
  return {
    ...pos,
    w: Math.max(pos.w, MIN_TILE_UNITS),
    h: Math.max(pos.h, MIN_TILE_UNITS),
  }
}
