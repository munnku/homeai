'use client'

import { useState } from 'react'
import { SAMPLE_DATA, expiryStatus, type Room, type CanvasPos } from '@/lib/data'
import { getRoomIcon } from '@/components/ui/Icons'
import { CanvasEngine } from '@/components/canvas/CanvasEngine'
import { CanvasTile } from '@/components/canvas/CanvasTile'
import { EditModeButton } from '@/components/canvas/EditModeButton'

interface Props {
  onRoomClick: (room: Room) => void
}

function RoomIcon({ iconKey, size }: { iconKey: string; size: number }) {
  const Icon = getRoomIcon(iconKey)
  return <Icon size={size} color="#7A4820" />
}

export function FloorPlanScreen({ onRoomClick }: Props) {
  const rooms = SAMPLE_DATA.rooms
  const [editMode, setEditMode] = useState(false)
  const [positions, setPositions] = useState<Record<string, CanvasPos>>(
    () => Object.fromEntries(rooms.map(r => [r.id, r.canvasPos]))
  )

  const alertCount = rooms
    .flatMap(r => r.furniture.flatMap(f => f.items))
    .filter(i => expiryStatus(i.expiry) === 'red').length

  const tilePosArr = rooms.map(r => positions[r.id])

  function moveRoom(id: string, newPos: CanvasPos) {
    setPositions(prev => ({ ...prev, [id]: newPos }))
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: '16px 16px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 800,
            fontSize: 22,
            fontFamily: 'var(--font-rounded)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            Homy-shelf
          </div>
          {alertCount > 0 && !editMode && (
            <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, marginTop: 2 }}>
              ⚠ 期限切れ間近 {alertCount}点
            </div>
          )}
        </div>
        {editMode && (
          <div style={{
            padding: '6px 12px',
            borderRadius: 'var(--r-full)',
            background: 'var(--accent-light)',
            border: '1px solid rgba(160,88,48,0.2)',
            fontSize: 11, fontWeight: 700, color: 'var(--accent-dark)',
            fontFamily: 'var(--font-rounded)',
          }}>
            編集中
          </div>
        )}
      </div>

      {/* Canvas area */}
      <div style={{
        flex: 1,
        paddingBottom: 'var(--tab-bar-h)',
        position: 'relative',
      }}>
        <CanvasEngine tiles={tilePosArr} editMode={editMode}>
          {rooms.map(room => {
            const hasAlert = room.furniture
              .flatMap(f => f.items)
              .some(i => expiryStatus(i.expiry) === 'red')

            return (
              <CanvasTile
                key={room.id}
                pos={positions[room.id]}
                label={room.name}
                icon={<RoomIcon iconKey={room.icon} size={positions[room.id].h >= 2 ? 26 : 18} />}
                badge={`${room.itemCount}点`}
                hasAlert={hasAlert}
                onTap={() => onRoomClick(room)}
                onMove={(newPos) => moveRoom(room.id, newPos)}
              />
            )
          })}
        </CanvasEngine>

        <EditModeButton editMode={editMode} onToggle={() => setEditMode(p => !p)} />
      </div>
    </div>
  )
}
