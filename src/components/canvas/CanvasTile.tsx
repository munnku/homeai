'use client'

import { GRID_UNIT } from '@/lib/canvas'
import type { CanvasPos } from '@/lib/data'

export type HighlightState = 'none' | 'pulsing' | 'highlighted'

interface Props {
  pos: CanvasPos
  label: string
  icon: React.ReactNode
  badge?: string
  hasAlert?: boolean
  editMode?: boolean
  highlight?: HighlightState
  onTap?: () => void
  children?: React.ReactNode // edge handles injected by parent
}

export function CanvasTile({
  pos,
  label,
  icon,
  badge,
  hasAlert = false,
  editMode = false,
  highlight = 'none',
  onTap,
  children,
}: Props) {
  const px = pos.x * GRID_UNIT
  const py = pos.y * GRID_UNIT
  const pw = pos.w * GRID_UNIT
  const ph = pos.h * GRID_UNIT
  const tall = pos.h >= 2

  const borderColor =
    highlight === 'highlighted' ? 'var(--accent)' :
    editMode ? 'rgba(160,88,48,0.3)' : 'transparent'

  return (
    <div
      style={{
        position: 'absolute',
        left: px,
        top: py,
        width: pw,
        height: ph,
        borderRadius: 14,
        background: editMode ? 'rgba(253,248,240,0.88)' : 'rgba(253,248,240,0.95)',
        border: `2px solid ${borderColor}`,
        boxShadow: editMode
          ? '0 2px 8px rgba(80,48,18,0.10)'
          : '0 1px 4px rgba(80,48,18,0.08)',
        cursor: editMode ? 'grab' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tall ? 6 : 3,
        userSelect: 'none',
        animation: highlight === 'pulsing' ? 'tilePulse 0.8s ease-in-out 3' : undefined,
        zIndex: 1,
      }}
      onClick={editMode ? undefined : onTap}
    >
      {/* Alert dot */}
      {hasAlert && !editMode && (
        <div style={{
          position: 'absolute', top: 7, right: 8,
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--red)',
          boxShadow: '0 0 0 2px rgba(253,248,240,0.9)',
        }} />
      )}

      {icon}

      <div style={{
        fontWeight: 700,
        fontSize: tall ? 12 : 10,
        color: 'rgba(55,30,10,0.82)',
        textAlign: 'center',
        padding: '0 4px',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        fontFamily: 'var(--font-rounded)',
      }}>
        {label}
      </div>

      {badge && tall && (
        <div style={{ fontSize: 10, color: 'rgba(55,30,10,0.38)', fontWeight: 600 }}>
          {badge}
        </div>
      )}

      {/* Resize handles and other edit controls injected by parent */}
      {children}
    </div>
  )
}
