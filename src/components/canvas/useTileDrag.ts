'use client'

import { useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { gridSnap, toGrid, GRID_UNIT } from '@/lib/canvas'
import type { CanvasPos } from '@/lib/data'

const LONG_PRESS_MS = 300

interface Options {
  pos: CanvasPos
  zoom: number
  editMode: boolean
  onMove: (newPos: CanvasPos) => void
  onTap?: () => void
}

export type DragState = 'idle' | 'pressing' | 'dragging'

export function useTileDrag({ pos, zoom, editMode, onMove, onTap }: Options) {
  const [dragState, setDragState] = useState<DragState>('idle')
  const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 })
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDraggingRef = useRef(false)

  const bind = useDrag(
    ({ event, first, last, movement: [mx, my], cancel }) => {
      if (!editMode) {
        // View mode: let canvas pan handle this
        return
      }

      if (first) {
        isDraggingRef.current = false
        setDragState('pressing')
        longPressTimer.current = setTimeout(() => {
          isDraggingRef.current = true
          setDragState('dragging')
        }, LONG_PRESS_MS)
      }

      if (!first && !last) {
        if (!isDraggingRef.current) {
          // Cancel drag if moved too much before long-press triggers
          const dist = Math.sqrt(mx * mx + my * my)
          if (dist > 10) {
            if (longPressTimer.current) clearTimeout(longPressTimer.current)
            cancel()
            setDragState('idle')
            return
          }
        }
        if (isDraggingRef.current) {
          event?.stopPropagation()
          // Convert screen delta to grid units, accounting for zoom
          const gx = gridSnap(pos.x * GRID_UNIT + mx / zoom, GRID_UNIT) / GRID_UNIT
          const gy = gridSnap(pos.y * GRID_UNIT + my / zoom, GRID_UNIT) / GRID_UNIT
          setDragOffset({
            dx: gx - pos.x,
            dy: gy - pos.y,
          })
        }
      }

      if (last) {
        if (longPressTimer.current) clearTimeout(longPressTimer.current)

        if (isDraggingRef.current) {
          // Commit new position
          const gx = Math.max(0, gridSnap(pos.x * GRID_UNIT + mx / zoom, GRID_UNIT) / GRID_UNIT)
          const gy = Math.max(0, gridSnap(pos.y * GRID_UNIT + my / zoom, GRID_UNIT) / GRID_UNIT)
          onMove({ ...pos, x: gx, y: gy })
        } else {
          // Short tap in edit mode — do nothing (no navigation)
          onTap?.()
        }

        isDraggingRef.current = false
        setDragState('idle')
        setDragOffset({ dx: 0, dy: 0 })
      }
    },
    {
      filterTaps: false,
      pointer: { touch: true },
      threshold: 0, // detect from first movement
    },
  )

  const activePosX = pos.x + (dragState === 'dragging' ? dragOffset.dx : 0)
  const activePosY = pos.y + (dragState === 'dragging' ? dragOffset.dy : 0)
  const activePos: CanvasPos = { ...pos, x: activePosX, y: activePosY }

  return { bind, dragState, activePos }
}
