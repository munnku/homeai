'use client'

import { expiryStatus, type Room, type Furniture, type FlatItem } from '@/lib/data'
import { Header } from '@/components/ui/Header'
import { Badge } from '@/components/ui/Badge'
import { IconPlus } from '@/components/ui/Icons'

interface Props {
  room: Room
  furniture: Furniture
  onBack: () => void
  onItemClick: (item: FlatItem) => void
}

export function FurnitureDetailScreen({ room, furniture, onBack, onItemClick }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <Header
        title={furniture.name}
        onBack={onBack}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 100px' }}>
        {/* Room breadcrumb */}
        <div style={{
          fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600,
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span className="emoji">{room.icon}</span>
          <span>{room.name}</span>
          <span style={{ margin: '0 2px' }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>{furniture.name}</span>
        </div>

        {/* Item grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}>
          {furniture.items.map(item => {
            const status = expiryStatus(item.expiry)
            return (
              <button
                key={item.id}
                onClick={() => onItemClick({
                  ...item,
                  path: `${room.name} › ${furniture.name}`,
                  roomIcon: room.icon,
                  roomId: room.id,
                  furnitureName: furniture.name,
                  roomName: room.name,
                })}
                className="glass"
                style={{
                  borderRadius: 'var(--r-lg)',
                  padding: '16px 10px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8,
                  cursor: 'pointer',
                  border: `1px solid ${status === 'red' ? 'var(--red)' : 'var(--glass-border)'}`,
                  transition: 'var(--ease-fast)',
                  position: 'relative',
                }}
              >
                {status === 'red' && (
                  <div style={{
                    position: 'absolute', top: 7, right: 7,
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--red)',
                  }} />
                )}
                <div className="emoji" style={{ fontSize: 26 }}>📦</div>
                <div style={{
                  fontSize: 11, fontWeight: 600, textAlign: 'center',
                  color: 'var(--text-primary)', lineHeight: 1.35,
                }}>
                  {item.name}
                </div>
                {item.count !== undefined && (
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{item.count}個</div>
                )}
                {item.expiry && (
                  <Badge color={status === 'red' ? 'red' : status === 'yellow' ? 'yellow' : 'green'}>
                    {item.expiry}
                  </Badge>
                )}
              </button>
            )
          })}

          {/* Add button */}
          <button
            className="glass"
            style={{
              borderRadius: 'var(--r-lg)',
              padding: '16px 10px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
              cursor: 'pointer',
              border: '1.5px dashed var(--border-strong)',
              background: 'transparent',
              boxShadow: 'none',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconPlus size={18} color="var(--accent-dark)" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-dark)' }}>
              追加
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
