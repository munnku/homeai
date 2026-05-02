'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useGesture } from '@use-gesture/react'
import { fitToScreen, GRID_UNIT, type Viewport } from '@/lib/canvas'
import type { CanvasPos } from '@/lib/data'
import { ZoomPanControls } from './ZoomPanControls'
import { GridBackground } from './GridBackground'
import { CanvasContext } from './CanvasContext'

interface Props {
  tiles: CanvasPos[]
  editMode?: boolean
  children: React.ReactNode
}

export function CanvasEngine({ tiles, editMode = false, children }: Props) {
  const canvasW = tiles.length > 0 ? Math.max(...tiles.map(t => (t.x + t.w) * GRID_UNIT)) : 400
  const canvasH = tiles.length > 0 ? Math.max(...tiles.map(t => (t.y + t.h) * GRID_UNIT)) : 300

  const containerRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<Viewport>({ offsetX: 0, offsetY: 0, zoom: 1 })
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    if (width === 0 || height === 0) return
    setViewport(fitToScreen(tiles, { w: width, h: height }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fitAll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    setViewport(fitToScreen(tiles, { w: width, h: height }))
  }, [tiles])

  function zoomAtCenter(delta: number) {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const cx = width / 2
    const cy = height / 2
    setViewport(v => {
      const newZoom = Math.min(Math.max(v.zoom + delta, 0.25), 3)
      const canvasX = (cx - v.offsetX) / v.zoom
      const canvasY = (cy - v.offsetY) / v.zoom
      return { zoom: newZoom, offsetX: cx - canvasX * newZoom, offsetY: cy - canvasY * newZoom }
    })
  }

  useGesture(
    {
      onDrag: ({ event, delta: [dx, dy], touches, canceled }) => {
        if (canceled || touches > 1) return
        // Don't pan when drag originates from a tile in edit mode
        const target = event?.target as HTMLElement | null
        if (editMode && target?.closest('[data-tile]')) return
        setViewport(v => ({ ...v, offsetX: v.offsetX + dx, offsetY: v.offsetY + dy }))
      },
      onPinch: ({ offset: [scale], origin: [ox, oy], first, memo }) => {
        const base: Viewport = first ? { ...viewportRef.current } : memo
        const newZoom = Math.min(Math.max(base.zoom * scale, 0.25), 3)
        const canvasX = (ox - base.offsetX) / base.zoom
        const canvasY = (oy - base.offsetY) / base.zoom
        setViewport({
          zoom: newZoom,
          offsetX: ox - canvasX * newZoom,
          offsetY: oy - canvasY * newZoom,
        })
        return base
      },
    },
    {
      target: containerRef,
      drag: { filterTaps: true, pointer: { touch: true } },
      pinch: { scaleBounds: { min: 0.25, max: 3 }, rubberband: false },
    },
  )

  return (
    <CanvasContext.Provider value={{ zoom: viewport.zoom, editMode }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            willChange: 'transform',
            width: canvasW,
            height: canvasH,
          }}
        >
          {editMode && <GridBackground />}
          {children}
        </div>
        <ZoomPanControls
          zoom={viewport.zoom}
          onZoomIn={() => zoomAtCenter(0.25)}
          onZoomOut={() => zoomAtCenter(-0.25)}
          onFitAll={fitAll}
        />
      </div>
    </CanvasContext.Provider>
  )
}
