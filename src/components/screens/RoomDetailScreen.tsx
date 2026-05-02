'use client'

import { useState } from 'react'
import { expiryStatus, type Room, type Furniture, type Item, type FlatItem } from '@/lib/data'
import { Header } from '@/components/ui/Header'
import { Badge } from '@/components/ui/Badge'
import { IconChevronDown, IconPlus, IconGrid, IconList, IconBox, getRoomIcon } from '@/components/ui/Icons'

interface Props {
  room: Room
  onBack: () => void
  onItemClick: (item: FlatItem) => void
  onFurnitureClick: (furniture: Furniture) => void
}

// ─── List view (accordion) ────────────────────────────────────────────────

function ListViewFurniture({
  room, onItemClick,
}: { room: Room; onItemClick: (item: FlatItem) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {room.furniture.map(furniture => (
        <div
          key={furniture.id}
          className="glass"
          style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}
        >
          {/* Furniture header */}
          <button
            onClick={() => setExpanded(p => ({ ...p, [furniture.id]: !p[furniture.id] }))}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: expanded[furniture.id] ? '1px solid var(--border)' : 'none',
              textAlign: 'left',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 'var(--r-sm)',
              background: 'rgba(160,88,48,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IconBox size={18} color="#A05830" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{furniture.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                {furniture.items.length}点
              </div>
            </div>
            <div style={{
              transform: expanded[furniture.id] ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'var(--ease-fast)',
            }}>
              <IconChevronDown size={18} color="var(--text-tertiary)" />
            </div>
          </button>

          {/* Items */}
          <div style={{
            maxHeight: expanded[furniture.id] ? 600 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ padding: '0 16px' }}>
              {furniture.items.map((item, i) => {
                const status = expiryStatus(item.expiry)
                return (
                  <button
                    key={item.id}
                    onClick={() => onItemClick({
                      ...item, path: `${room.name} › ${furniture.name}`,
                      roomIcon: room.icon, roomId: room.id,
                      furnitureId: furniture.id,
                      furnitureName: furniture.name, roomName: room.name,
                    })}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 0',
                      background: 'none', border: 'none',
                      borderBottom: i < furniture.items.length - 1 ? `1px solid var(--border)` : 'none',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: 'rgba(160,88,48,0.10)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IconBox size={16} color="#A05830" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, fontSize: 13,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {item.name}
                      </div>
                      {item.expiry && (
                        <div style={{
                          fontSize: 11, marginTop: 2,
                          color: status === 'red' ? 'var(--red)' : status === 'yellow' ? 'var(--yellow)' : 'var(--green)',
                        }}>
                          期限: {item.expiry}
                        </div>
                      )}
                    </div>
                    {status === 'red' && <Badge color="red">期限近い</Badge>}
                    {status === 'yellow' && <Badge color="yellow">1週間以内</Badge>}
                  </button>
                )
              })}
            </div>
            <button style={{
              width: '100%', padding: '12px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'var(--accent-dark)', fontWeight: 700, fontSize: 13,
              borderTop: '1px solid var(--border)',
              fontFamily: 'var(--font-rounded)',
            }}>
              <IconPlus size={15} color="var(--accent-dark)" />
              アイテムを追加
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Tile view (grid) ────────────────────────────────────────────────────

function TileViewFurniture({
  room, onItemClick, onFurnitureClick,
}: { room: Room; onItemClick: (item: FlatItem) => void; onFurnitureClick: (f: Furniture) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Furniture tiles in 2-column grid — tap to navigate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        {room.furniture.map(furniture => {
          const hasAlert = furniture.items.some(i => expiryStatus(i.expiry) === 'red')

          return (
            <button
              key={furniture.id}
              onClick={() => onFurnitureClick(furniture)}
              className="glass"
              style={{
                borderRadius: 'var(--r-lg)',
                padding: '16px 14px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 8,
                cursor: 'pointer',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass)',
                transition: 'var(--ease)',
                position: 'relative',
              }}
            >
              {hasAlert && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--red)',
                }} />
              )}
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--r)',
                background: 'rgba(160,88,48,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconBox size={24} color="#A05830" />
              </div>
              <div style={{
                fontWeight: 700, fontSize: 13, textAlign: 'center',
                color: 'var(--text-primary)', lineHeight: 1.3,
              }}>
                {furniture.name}
              </div>
              <div style={{
                fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500,
              }}>
                {furniture.items.length}点
              </div>
            </button>
          )
        })}
      </div>

      {/* Add furniture */}
      <button style={{
        width: '100%', padding: '14px',
        background: 'transparent',
        border: '1.5px dashed var(--border-strong)',
        borderRadius: 'var(--r-lg)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        color: 'var(--accent-dark)', fontWeight: 700, fontSize: 14,
        fontFamily: 'var(--font-rounded)',
      }}>
        <IconPlus size={17} color="var(--accent-dark)" />
        家具・収納を追加
      </button>
    </div>
  )
}

// ─── Main screen ─────────────────────────────────────────────────────────

export function RoomDetailScreen({ room, onBack, onItemClick, onFurnitureClick }: Props) {
  const [viewMode, setViewMode] = useState<'list' | 'tile'>('list')
  const allItems = room.furniture.flatMap(f => f.items)
  const redCount = allItems.filter(i => expiryStatus(i.expiry) === 'red').length
  const yellowCount = allItems.filter(i => expiryStatus(i.expiry) === 'yellow').length

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <Header
        title={room.name}
        onBack={onBack}
        right={
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
              {room.itemCount}点
            </span>
            {/* List/Tile toggle */}
            <div style={{
              display: 'flex',
              borderRadius: 9,
              background: 'rgba(160,120,80,0.10)',
              padding: 2, gap: 2,
            }}>
              {(['list', 'tile'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    border: 'none', cursor: 'pointer',
                    background: viewMode === mode ? 'var(--glass-strong)' : 'transparent',
                    boxShadow: viewMode === mode ? 'var(--glass-shadow)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'var(--ease-fast)',
                  }}
                >
                  {mode === 'list'
                    ? <IconList size={14} color={viewMode === mode ? 'var(--icon-active)' : 'var(--icon)'} />
                    : <IconGrid size={14} color={viewMode === mode ? 'var(--icon-active)' : 'var(--icon)'} />
                  }
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Alert strip */}
      {(redCount > 0 || yellowCount > 0) && (
        <div style={{
          margin: '10px 16px 0',
          padding: '10px 14px',
          borderRadius: 'var(--r)',
          background: redCount > 0 ? 'var(--red-light)' : 'var(--yellow-light)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16, color: redCount > 0 ? 'var(--red)' : 'var(--yellow)' }}>!</span>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: redCount > 0 ? 'var(--red)' : 'var(--yellow)',
          }}>
            {redCount > 0
              ? `${redCount}点の期限切れ間近アイテムがあります`
              : `${yellowCount}点が1週間以内に期限切れ`
            }
          </span>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>
        {viewMode === 'list'
          ? <ListViewFurniture room={room} onItemClick={onItemClick} />
          : <TileViewFurniture room={room} onItemClick={onItemClick} onFurnitureClick={onFurnitureClick} />
        }
      </div>
    </div>
  )
}
