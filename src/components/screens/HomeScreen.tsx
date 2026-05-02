'use client'

import { useState } from 'react'
import { SAMPLE_DATA, expiryStatus, type Room, type GridPos } from '@/lib/data'
import { IconSearch, IconEdit, getRoomIcon } from '@/components/ui/Icons'

const GRID_COLS = 4
const CELL_H   = 82

interface Props {
  onRoomClick: (room: Room) => void
  onSearchFocus: () => void
  onAddClick: () => void
}

function RoomIcon({ iconKey, size }: { iconKey: string; size: number }) {
  const Icon = getRoomIcon(iconKey)
  return <Icon size={size} color="#7A4820" />
}

export function HomeScreen({ onRoomClick, onSearchFocus }: Props) {
  const rooms = SAMPLE_DATA.rooms

  // Layout positions are stored separately so they can be swapped
  const [layouts, setLayouts] = useState<Record<string, GridPos>>(
    () => Object.fromEntries(rooms.map(r => [r.id, r.gridPos]))
  )
  const [editMode,   setEditMode]   = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const alertCount = rooms
    .flatMap(r => r.furniture.flatMap(f => f.items))
    .filter(i => expiryStatus(i.expiry) === 'red').length

  function handleRoomTap(room: Room) {
    if (!editMode) { onRoomClick(room); return }

    if (!selectedId) { setSelectedId(room.id); return }
    if (selectedId === room.id) { setSelectedId(null); return }

    // Swap grid positions between two rooms
    setLayouts(prev => ({
      ...prev,
      [selectedId]: { ...prev[room.id] },
      [room.id]:    { ...prev[selectedId] },
    }))
    setSelectedId(null)
  }

  function toggleEdit() {
    setEditMode(p => !p)
    setSelectedId(null)
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflowY: 'auto',
      paddingBottom: 'var(--tab-bar-h)',
    }}>

      {/* Search bar */}
      <div style={{ padding: '16px 16px 8px' }}>
        <button
          onClick={onSearchFocus}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 10,
            borderRadius: 'var(--r-full)',
            padding: '11px 16px',
            cursor: 'pointer',
            border: '1px solid var(--glass-warm-border)',
            background: 'var(--glass-warm)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            fontFamily: 'var(--font-rounded)',
          }}
        >
          <IconSearch size={17} color="var(--text-tertiary)" />
          <span style={{ flex: 1, fontSize: 14, color: 'var(--text-tertiary)', fontWeight: 500, textAlign: 'left' }}>
            どこ？AIに聞くか検索…
          </span>
          <span style={{
            padding: '3px 10px',
            borderRadius: 'var(--r-full)',
            background: 'var(--accent-light)',
            color: 'var(--accent-dark)',
            fontSize: 11, fontWeight: 800,
          }}>
            AI
          </span>
        </button>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '4px 16px 12px', gap: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{SAMPLE_DATA.household}</div>
          {alertCount > 0 && !editMode && (
            <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, marginTop: 2 }}>
              ⚠ 期限切れ間近 {alertCount}点
            </div>
          )}
        </div>
        <button
          onClick={toggleEdit}
          style={{
            padding: '7px 14px',
            borderRadius: 'var(--r-full)',
            border: `1.5px solid ${editMode ? 'var(--accent)' : 'var(--border-strong)'}`,
            background: editMode ? 'var(--accent-light)' : 'transparent',
            cursor: 'pointer',
            fontSize: 12, fontWeight: 700,
            color: editMode ? 'var(--accent-dark)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-rounded)',
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'var(--ease-fast)',
          }}
        >
          <IconEdit size={13} color={editMode ? 'var(--accent-dark)' : 'var(--text-secondary)'} />
          {editMode ? '完了' : 'レイアウト'}
        </button>
      </div>

      {/* Edit mode hint */}
      {editMode && (
        <div style={{
          margin: '0 16px 10px',
          padding: '9px 14px',
          borderRadius: 'var(--r)',
          background: 'var(--accent-light)',
          border: '1px solid rgba(160,88,48,0.2)',
          fontSize: 12, fontWeight: 600, color: 'var(--accent-dark)',
          textAlign: 'center',
        }}>
          {selectedId
            ? '移動先の部屋をタップしてください'
            : '動かしたい部屋をタップ → 入れ替え先をタップ'}
        </div>
      )}

      {/* Floor plan */}
      <div style={{ padding: '0 16px 20px' }}>
        {/* Outer wall */}
        <div style={{
          border: '2.5px solid rgba(80,48,18,0.5)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'rgba(80,48,18,0.14)',  // gap = wall colour
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridAutoRows: CELL_H,
          gap: '1.5px',
        }}>
          {rooms.map(room => {
            const { col, row, w, h } = layouts[room.id]
            const hasAlert = room.furniture
              .flatMap(f => f.items)
              .some(i => expiryStatus(i.expiry) === 'red')
            const isSelected = selectedId === room.id
            const isFaded   = editMode && selectedId !== null && !isSelected

            return (
              <button
                key={room.id}
                onClick={() => handleRoomTap(room)}
                style={{
                  gridColumn: `${col} / span ${w}`,
                  gridRow:    `${row} / span ${h}`,
                  background: isSelected
                    ? 'rgba(200,145,70,0.22)'
                    : 'rgba(253,248,240,0.93)',
                  outline: isSelected ? '2px solid var(--accent)' : 'none',
                  outlineOffset: '-2px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: h > 1 ? 6 : 3,
                  position: 'relative',
                  opacity: isFaded ? 0.45 : 1,
                  transition: 'opacity 0.15s, background 0.15s',
                }}
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
                {/* Drag grip in edit mode */}
                {editMode && (
                  <div style={{
                    position: 'absolute', top: 5, right: 6,
                    fontSize: 10, color: 'rgba(80,48,18,0.3)',
                    lineHeight: 1,
                  }}>
                    ⠿
                  </div>
                )}
                <RoomIcon iconKey={room.icon} size={h > 1 ? 26 : 18} />
                <div style={{
                  fontWeight: 700,
                  fontSize: h > 1 ? 13 : 10,
                  color: 'rgba(55,30,10,0.82)',
                  textAlign: 'center',
                  padding: '0 4px',
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                }}>
                  {room.name}
                </div>
                {h > 1 && (
                  <div style={{ fontSize: 10, color: 'rgba(55,30,10,0.38)', fontWeight: 600 }}>
                    {room.itemCount}点
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Item count row for small cells */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          marginTop: 8,
          fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500,
        }}>
          計 {rooms.reduce((s, r) => s + r.itemCount, 0)}点のアイテム
        </div>
      </div>
    </div>
  )
}
