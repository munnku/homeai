'use client'

import { useState } from 'react'
import { IconPlus } from '@/components/ui/Icons'
import { getRoomIcon, getFurnitureIcon, type RoomIconKey, type FurnitureIconKey } from '@/components/ui/Icons'
import type { CanvasPos } from '@/lib/data'

type TileKind = 'room' | 'furniture'

interface Props {
  kind: TileKind
  onAdd: (name: string, icon: string, pos: CanvasPos) => void
}

const ROOM_ICONS: RoomIconKey[] = ['living', 'kitchen', 'bedroom', 'bathroom', 'child', 'storage']
const FURNITURE_ICONS: FurnitureIconKey[] = ['sofa', 'desk', 'bed', 'shelf', 'fridge', 'drawer']

const ROOM_LABELS: Record<RoomIconKey, string> = {
  living: 'リビング', kitchen: 'キッチン', bedroom: '寝室',
  bathroom: '洗面所', child: '子供部屋', storage: '納戸',
}
const FURNITURE_LABELS: Record<FurnitureIconKey, string> = {
  sofa: 'ソファ', desk: '机', bed: 'ベッド',
  shelf: '棚', fridge: '冷蔵庫', drawer: '引き出し',
}

export function AddTileButton({ kind, onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string>(kind === 'room' ? 'living' : 'shelf')

  const icons = kind === 'room' ? ROOM_ICONS : FURNITURE_ICONS
  const labels = kind === 'room' ? ROOM_LABELS : FURNITURE_LABELS
  const getIcon = kind === 'room' ? getRoomIcon : getFurnitureIcon

  function handleAdd() {
    const label = name.trim() || labels[selectedIcon as keyof typeof labels] || selectedIcon
    onAdd(label, selectedIcon, { x: 0, y: 0, w: 3, h: 2 })
    setName('')
    setSelectedIcon(kind === 'room' ? 'living' : 'shelf')
    setOpen(false)
  }

  return (
    <>
      {/* Floating + button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'absolute',
          bottom: 68,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '2px solid var(--accent)',
          background: 'var(--accent-light)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          boxShadow: '0 2px 8px rgba(80,48,18,0.15)',
        }}
        aria-label={kind === 'room' ? '部屋を追加' : '家具を追加'}
      >
        <IconPlus size={18} color="var(--accent-dark)" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(40,20,8,0.5)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(150deg, #F5EAE0 0%, #FDF8F2 100%)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 36px',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16, fontFamily: 'var(--font-rounded)' }}>
              {kind === 'room' ? '部屋を追加' : '家具を追加'}
            </div>

            {/* Name input */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>名前</div>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={labels[selectedIcon as keyof typeof labels]}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1.5px solid var(--glass-warm-border)',
                  background: 'rgba(255,255,255,0.7)',
                  fontSize: 15,
                  fontFamily: 'var(--font-rounded)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Icon picker */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>アイコン</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {icons.map(key => {
                  const Icon = getIcon(key)
                  const isSelected = selectedIcon === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedIcon(key)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        padding: '8px 4px',
                        borderRadius: 12,
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
                        background: isSelected ? 'var(--accent-light)' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={20} color={isSelected ? 'var(--accent-dark)' : 'var(--text-secondary)'} />
                      <span style={{ fontSize: 9, color: isSelected ? 'var(--accent-dark)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                        {labels[key as keyof typeof labels]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleAdd}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 14,
                border: 'none',
                background: 'var(--accent-grad)',
                color: 'white',
                fontSize: 15,
                fontWeight: 800,
                fontFamily: 'var(--font-rounded)',
                cursor: 'pointer',
              }}
            >
              追加
            </button>
          </div>
        </div>
      )}
    </>
  )
}
