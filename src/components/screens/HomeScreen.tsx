'use client'

import { useState } from 'react'
import { SAMPLE_DATA, expiryStatus, type Room } from '@/lib/data'
import { IconSearch, IconGrid, IconList } from '@/components/ui/Icons'

const GRID_COLS = 4
const CELL = 82  // px per grid cell
const GAP  = 8

interface Props {
  onRoomClick: (room: Room) => void
  onSearchFocus: () => void
  onAddClick: () => void
}

function FloorPlanGrid({ rooms, onRoomClick }: { rooms: Room[]; onRoomClick: (r: Room) => void }) {
  const gridH = GRID_COLS * CELL + (GRID_COLS - 1) * GAP

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
      gridAutoRows: CELL,
      gap: GAP,
      width: '100%',
      minHeight: gridH,
    }}>
      {rooms.map(room => {
        const { col, row, w, h } = room.gridPos
        const hasAlert = room.furniture.flatMap(f => f.items)
          .some(i => expiryStatus(i.expiry) === 'red')

        return (
          <button
            key={room.id}
            onClick={() => onRoomClick(room)}
            style={{
              gridColumn: `${col} / span ${w}`,
              gridRow: `${row} / span ${h}`,
              borderRadius: 'var(--r)',
              background: 'var(--glass)',
              backdropFilter: 'blur(16px) saturate(140%)',
              WebkitBackdropFilter: 'blur(16px) saturate(140%)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              transition: 'var(--ease)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {hasAlert && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--red)',
              }} />
            )}
            <div style={{ fontSize: h > 1 ? 30 : 22, lineHeight: 1 }}>{room.icon}</div>
            <div style={{
              fontWeight: 700,
              fontSize: h > 1 ? 13 : 11,
              color: 'var(--text-primary)',
              textAlign: 'center',
              padding: '0 6px',
              lineHeight: 1.3,
            }}>
              {room.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              {room.itemCount}点
            </div>
          </button>
        )
      })}
    </div>
  )
}

function RoomListView({ rooms, onRoomClick }: { rooms: Room[]; onRoomClick: (r: Room) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rooms.map(room => (
        <button
          key={room.id}
          onClick={() => onRoomClick(room)}
          className="glass"
          style={{
            borderRadius: 'var(--r)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass)',
            width: '100%',
            textAlign: 'left',
            transition: 'var(--ease)',
          }}
        >
          <div style={{
            width: 44, height: 44,
            borderRadius: 'var(--r-sm)',
            background: 'rgba(232,168,124,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            {room.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{room.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
              {room.itemCount}点のアイテム
            </div>
          </div>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
               stroke="var(--icon)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export function HomeScreen({ onRoomClick, onSearchFocus }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const rooms = SAMPLE_DATA.rooms

  const alertCount = rooms
    .flatMap(r => r.furniture.flatMap(f => f.items))
    .filter(i => expiryStatus(i.expiry) === 'red').length

  const recentItems = [
    { name: 'リモコン（テレビ）', room: 'リビング', emoji: '📺' },
    { name: '牛乳',               room: 'キッチン',  emoji: '🥛' },
    { name: 'HDMIケーブル',       room: 'リビング',  emoji: '🔌' },
    { name: '冬用コート',         room: '寝室',      emoji: '🧥' },
  ]

  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflowY: 'auto',
      paddingBottom: 'var(--tab-bar-h)',
    }}>
      {/* Search bar */}
      <div style={{ padding: '14px 16px 8px' }}>
        <button
          onClick={onSearchFocus}
          className="glass"
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 10,
            borderRadius: 'var(--r-full)',
            padding: '11px 16px',
            cursor: 'text',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass)',
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
            color: 'var(--accent-text)',
            fontSize: 11, fontWeight: 700,
          }}>
            AI
          </span>
        </button>
      </div>

      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '4px 16px 10px', gap: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{SAMPLE_DATA.household}</div>
          {alertCount > 0 && (
            <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, marginTop: 1 }}>
              ⚠ 期限切れ間近 {alertCount}点
            </div>
          )}
        </div>
        {/* View toggle */}
        <div style={{
          display: 'flex',
          borderRadius: 'var(--r-sm)',
          background: 'rgba(160,120,80,0.10)',
          padding: 3, gap: 2,
        }}>
          {(['grid', 'list'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: 32, height: 32,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: viewMode === mode ? 'var(--glass-strong)' : 'transparent',
                boxShadow: viewMode === mode ? 'var(--glass-shadow)' : 'none',
                color: viewMode === mode ? 'var(--icon-active)' : 'var(--icon)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'var(--ease-fast)',
              }}
            >
              {mode === 'grid' ? <IconGrid size={16} color={viewMode === mode ? 'var(--icon-active)' : 'var(--icon)'} /> : <IconList size={16} color={viewMode === mode ? 'var(--icon-active)' : 'var(--icon)'} />}
            </button>
          ))}
        </div>
      </div>

      {/* Grid / List */}
      <div style={{ padding: '0 16px 20px' }}>
        {viewMode === 'grid'
          ? <FloorPlanGrid rooms={rooms} onRoomClick={onRoomClick} />
          : <RoomListView rooms={rooms} onRoomClick={onRoomClick} />
        }
      </div>

      {/* Recently added */}
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{
          fontWeight: 700, fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 10,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          最近の登録
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {recentItems.map((item, i) => (
            <div
              key={i}
              className="glass"
              style={{
                flexShrink: 0, width: 96,
                borderRadius: 'var(--r)',
                padding: '12px 10px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 22 }}>{item.emoji}</div>
              <div style={{
                fontSize: 11, fontWeight: 600, textAlign: 'center',
                color: 'var(--text-primary)', lineHeight: 1.3,
              }}>
                {item.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{item.room}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
