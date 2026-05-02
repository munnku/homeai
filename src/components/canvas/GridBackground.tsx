'use client'

import { GRID_UNIT } from '@/lib/canvas'

export function GridBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '-500px',
        backgroundImage: `radial-gradient(circle, rgba(80,48,18,0.18) 1px, transparent 1px)`,
        backgroundSize: `${GRID_UNIT}px ${GRID_UNIT}px`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
