'use client'

import { useState, useMemo } from 'react'
import { SAMPLE_DATA, expiryStatus, type Room, type CanvasPos } from '@/lib/data'
import { getRoomIcon } from '@/components/ui/Icons'
import { CanvasEngine } from '@/components/canvas/CanvasEngine'
import { CanvasTile } from '@/components/canvas/CanvasTile'
import { EdgeHandles } from '@/components/canvas/EdgeHandles'
import { EditModeButton } from '@/components/canvas/EditModeButton'
import { AddTileButton } from '@/components/canvas/AddTileModal'

interface RoomTile {
  id: string
  name: string
  icon: string
  pos: CanvasPos
  itemCount: number
  roomRef: Room | null
}

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

  const [tiles, setTiles] = useState<RoomTile[]>(
    () => rooms.map(r => ({ id: r.id, name: r.name, icon: r.icon, pos: r.canvasPos, itemCount: r.itemCount, roomRef: r }))
  )

  const alertCount = useMemo(
    () => rooms.flatMap(r => r.furniture.flatMap(f => f.items)).filter(i => expiryStatus(i.expiry) === 'red').length,
    [rooms]
  )

  const tilePosArr = tiles.map(t => t.pos)

  function moveRoom(id: string, newPos: CanvasPos) {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, pos: newPos } : t))
  }

  function resizeRoom(id: string, newPos: CanvasPos) {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, pos: newPos } : t))
  }

  function addRoom(name: string, icon: string, pos: CanvasPos) {
    const id = `room-${Date.now()}`
    setTiles(prev => [...prev, { id, name, icon, pos, itemCount: 0, roomRef: null }])
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
      <div style={{ flex: 1, paddingBottom: 'var(--tab-bar-h)', position: 'relative' }}>
        <CanvasEngine tiles={tilePosArr} editMode={editMode}>
          {tiles.map(tile => {
            const hasAlert = tile.roomRef?.furniture
              .flatMap(f => f.items)
              .some(i => expiryStatus(i.expiry) === 'red') ?? false

            return (
              <CanvasTile
                key={tile.id}
                pos={tile.pos}
                label={tile.name}
                icon={<RoomIcon iconKey={tile.icon} size={tile.pos.h >= 2 ? 26 : 18} />}
                badge={tile.itemCount > 0 ? `${tile.itemCount}点` : undefined}
                hasAlert={hasAlert}
                onTap={tile.roomRef ? () => onRoomClick(tile.roomRef!) : undefined}
                onMove={(newPos) => moveRoom(tile.id, newPos)}
              >
                {editMode && (
                  <EdgeHandles pos={tile.pos} onResize={(newPos) => resizeRoom(tile.id, newPos)} />
                )}
              </CanvasTile>
            )
          })}
        </CanvasEngine>

        <EditModeButton editMode={editMode} onToggle={() => setEditMode(p => !p)} />
        {editMode && <AddTileButton kind="room" onAdd={addRoom} />}
      </div>
    </div>
  )
}
