'use client'

import { useDrag } from '@use-gesture/react'
import { gridSnap, clampTileSize, GRID_UNIT } from '@/lib/canvas'
import type { CanvasPos } from '@/lib/data'
import { useCanvasCtx } from './CanvasContext'

interface Props {
  pos: CanvasPos
  onResize: (newPos: CanvasPos) => void
}

type Edge = 'top' | 'bottom' | 'left' | 'right'

const HANDLE_SIZE = 28
const HANDLE_THICKNESS = 6

function EdgeHandle({ edge, pos, zoom, onResize }: {
  edge: Edge
  pos: CanvasPos
  zoom: number
  onResize: (newPos: CanvasPos) => void
}) {
  const bind = useDrag(({ movement: [mx, my], last }) => {
    const dm = edge === 'left' || edge === 'right' ? mx : my
    const gridDelta = gridSnap(dm / zoom, GRID_UNIT) / GRID_UNIT

    let next: CanvasPos = { ...pos }
    switch (edge) {
      case 'top':
        next = { ...pos, y: pos.y + gridDelta, h: pos.h - gridDelta }
        break
      case 'bottom':
        next = { ...pos, h: pos.h + gridDelta }
        break
      case 'left':
        next = { ...pos, x: pos.x + gridDelta, w: pos.w - gridDelta }
        break
      case 'right':
        next = { ...pos, w: pos.w + gridDelta }
        break
    }

    const clamped = clampTileSize(next)
    // Prevent negative x/y
    clamped.x = Math.max(0, clamped.x)
    clamped.y = Math.max(0, clamped.y)

    if (last) {
      onResize(clamped)
    }
  }, { pointer: { touch: true } })

  const pw = pos.w * GRID_UNIT
  const ph = pos.h * GRID_UNIT

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    background: 'var(--accent)',
    borderRadius: 4,
    zIndex: 20,
    touchAction: 'none',
    cursor: edge === 'top' || edge === 'bottom' ? 'ns-resize' : 'ew-resize',
  }

  const edgeStyle: React.CSSProperties = (() => {
    switch (edge) {
      case 'top':    return { top: -3, left: pw / 2 - HANDLE_SIZE / 2, width: HANDLE_SIZE, height: HANDLE_THICKNESS }
      case 'bottom': return { bottom: -3, left: pw / 2 - HANDLE_SIZE / 2, width: HANDLE_SIZE, height: HANDLE_THICKNESS }
      case 'left':   return { left: -3, top: ph / 2 - HANDLE_SIZE / 2, width: HANDLE_THICKNESS, height: HANDLE_SIZE }
      case 'right':  return { right: -3, top: ph / 2 - HANDLE_SIZE / 2, width: HANDLE_THICKNESS, height: HANDLE_SIZE }
    }
  })()

  return <div {...bind()} data-edge-handle="true" style={{ ...baseStyle, ...edgeStyle }} />
}

export function EdgeHandles({ pos, onResize }: Props) {
  const { zoom } = useCanvasCtx()

  return (
    <>
      {(['top', 'bottom', 'left', 'right'] as Edge[]).map(edge => (
        <EdgeHandle key={edge} edge={edge} pos={pos} zoom={zoom} onResize={onResize} />
      ))}
    </>
  )
}
