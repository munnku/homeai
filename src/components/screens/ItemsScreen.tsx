'use client'

import { useState } from 'react'
import { SAMPLE_DATA, expiryStatus, type Room, type Item, type FlatItem } from '@/lib/data'
import { IconSearch, IconChevronDown, IconChevronRight, IconBox, getRoomIcon } from '@/components/ui/Icons'
import { Badge } from '@/components/ui/Badge'

interface Props {
  onItemClick: (item: FlatItem) => void
}

export type ItemFilter = 'all' | 'expiry' | 'byRoom'

export function filterItems(
  rooms: Room[],
  query: string,
  filter: ItemFilter,
): FlatItem[] {
  const flat: FlatItem[] = rooms.flatMap(room =>
    room.furniture.flatMap(f =>
      f.items.map(item => ({
        ...item,
        path: `${room.name} › ${f.name}`,
        roomIcon: room.icon,
        roomId: room.id,
        furnitureName: f.name,
        roomName: room.name,
      }))
    )
  )

  if (query.trim()) {
    const q = query.toLowerCase()
    return flat.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  if (filter === 'expiry') {
    return flat.filter(item => {
      const s = expiryStatus(item.expiry)
      return s === 'red' || s === 'yellow'
    })
  }

  return flat
}

function ExpiryAlertSection({ rooms }: { rooms: Room[] }) {
  const alerts = rooms.flatMap(room =>
    room.furniture.flatMap(f =>
      f.items
        .filter(item => expiryStatus(item.expiry) === 'red' || expiryStatus(item.expiry) === 'yellow')
        .map(item => ({
          ...item,
          roomName: room.name,
          status: expiryStatus(item.expiry) as 'red' | 'yellow',
        }))
    )
  )

  if (alerts.length === 0) return null

  return (
    <div style={{
      background: 'rgba(217,80,80,0.07)',
      border: '1px solid rgba(217,80,80,0.18)',
      borderRadius: 'var(--r-lg)',
      padding: '12px 14px',
      marginBottom: 12,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: 'var(--red)',
        marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        期限アラート {alerts.length}件
      </div>
      {alerts.map((item, i) => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 0',
          borderTop: i > 0 ? '1px solid rgba(217,80,80,0.10)' : 'none',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: item.status === 'red' ? 'var(--red)' : 'var(--yellow)',
            flexShrink: 0,
          }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: item.status === 'red' ? 'var(--red)' : 'var(--yellow)',
          }}>
            {item.expiry}
          </span>
        </div>
      ))}
    </div>
  )
}

function RoomGroup({
  room,
  onItemClick,
  defaultExpanded = false,
}: {
  room: Room
  onItemClick: (item: FlatItem) => void
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const RoomIcon = getRoomIcon(room.icon)

  return (
    <div style={{
      background: 'var(--glass-warm)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid var(--glass-warm-border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      marginBottom: 8,
    }}>
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px',
          background: 'rgba(245,225,200,0.3)',
          border: 'none', cursor: 'pointer',
          borderBottom: expanded ? '1px solid var(--glass-warm-border)' : 'none',
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'rgba(160,88,48,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <RoomIcon size={16} color="#A05830" />
        </div>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', textAlign: 'left' }}>
          {room.name}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, marginRight: 6 }}>
          {room.itemCount}点
        </span>
        <div style={{
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'var(--ease-fast)',
        }}>
          <IconChevronDown size={14} color="var(--text-tertiary)" />
        </div>
      </button>

      {expanded && (
        <div>
          {room.furniture.flatMap(f =>
            f.items.map((item, i, arr) => {
              const status = expiryStatus(item.expiry)
              const flatItem: FlatItem = {
                ...item,
                path: `${room.name} › ${f.name}`,
                roomIcon: room.icon,
                roomId: room.id,
                furnitureName: f.name,
                roomName: room.name,
              }
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(flatItem)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    background: 'none', border: 'none',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'rgba(160,88,48,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <IconBox size={14} color="#A05830" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
                      {f.name}
                    </div>
                  </div>
                  {status === 'red' && <Badge color="red">期限近い</Badge>}
                  {status === 'yellow' && <Badge color="yellow">1週間以内</Badge>}
                  <IconChevronRight size={12} color="var(--text-tertiary)" />
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

function SearchResults({ items, onItemClick }: { items: FlatItem[]; onItemClick: (item: FlatItem) => void }) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)' }}>
        <IconBox size={40} color="var(--text-tertiary)" />
        <div style={{ fontWeight: 600, marginTop: 12 }}>見つかりませんでした</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>別のキーワードで試してみてください</div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--glass-warm)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid var(--glass-warm-border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
    }}>
      {items.map((item, i) => {
        const status = expiryStatus(item.expiry)
        const RoomIcon = getRoomIcon(item.roomIcon)
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item)}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              background: 'none', border: 'none',
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <RoomIcon size={20} color="#A05830" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{item.path}</div>
            </div>
            {status === 'red' && <Badge color="red">期限近い</Badge>}
            {status === 'yellow' && <Badge color="yellow">1週間以内</Badge>}
            <IconChevronRight size={12} color="var(--text-tertiary)" />
          </button>
        )
      })}
    </div>
  )
}

export function ItemsScreen({ onItemClick }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ItemFilter>('all')
  const rooms = SAMPLE_DATA.rooms

  const isSearching = query.trim().length > 0
  const searchResults = isSearching ? filterItems(rooms, query, filter) : []

  const filters: { id: ItemFilter; label: string }[] = [
    { id: 'all',    label: 'すべて' },
    { id: 'expiry', label: '⚠ 期限近い' },
    { id: 'byRoom', label: '部屋別' },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>

      {/* Sticky header */}
      <div className="glass-strong" style={{
        padding: '14px 16px 10px',
        borderBottom: '1px solid var(--border)',
        borderRadius: 0,
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        flexShrink: 0,
      }}>
        <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 10 }}>アイテム</div>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--glass-warm)',
          border: '1px solid var(--glass-warm-border)',
          borderRadius: 'var(--r-full)',
          padding: '9px 14px',
          marginBottom: 10,
        }}>
          <IconSearch size={15} color="var(--text-tertiary)" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="アイテム名・場所・タグで検索"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 14, fontFamily: 'var(--font-rounded)',
              color: 'var(--text-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--text-tertiary)',
                border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
          )}
        </div>

        {/* Filter chips */}
        {!isSearching && (
          <div style={{ display: 'flex', gap: 6 }}>
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--r-full)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-rounded)',
                  fontSize: 12, fontWeight: 700,
                  background: filter === f.id ? 'var(--accent)' : 'rgba(160,120,80,0.10)',
                  color: filter === f.id ? '#fff' : 'var(--text-secondary)',
                  transition: 'var(--ease-fast)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', paddingBottom: 'calc(var(--tab-bar-h) + 14px)' }}>

        {isSearching ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 10 }}>
              {searchResults.length}件の結果
            </div>
            <SearchResults items={searchResults} onItemClick={onItemClick} />
          </>
        ) : (
          <>
            {filter !== 'expiry' && <ExpiryAlertSection rooms={rooms} />}

            {filter === 'expiry' ? (
              <SearchResults
                items={filterItems(rooms, '', 'expiry')}
                onItemClick={onItemClick}
              />
            ) : (
              rooms.map(room => (
                <RoomGroup
                  key={room.id}
                  room={room}
                  onItemClick={onItemClick}
                  defaultExpanded={filter === 'all'}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
