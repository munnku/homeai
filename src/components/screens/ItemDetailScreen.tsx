'use client'

import { useState } from 'react'
import { expiryStatus, daysUntilExpiry, SAMPLE_DATA, type FlatItem } from '@/lib/data'
import { Header } from '@/components/ui/Header'
import { Badge } from '@/components/ui/Badge'
import { IconEdit, IconTrash, IconMove, IconQR, IconChevronRight, IconBox, getRoomIcon } from '@/components/ui/Icons'

interface Props {
  item: FlatItem
  onBack: () => void
  onViewInFloorPlan?: () => void
}

function MetaCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{
      background: 'rgba(255,253,250,0.5)',
      borderRadius: 'var(--r-sm)',
      padding: '10px 12px',
      border: '1px solid var(--border)',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)',
        marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: color ?? 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  )
}

function ActionBtn({
  label, Icon, onClick, color, bg,
}: { label: string; Icon: React.FC<{ size?: number; color?: string }>; onClick?: () => void; color: string; bg: string }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flex: 1, padding: '12px 8px',
        borderRadius: 'var(--r)',
        border: 'none', background: bg,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'var(--ease-fast)',
        fontFamily: 'var(--font-rounded)',
      }}
    >
      <Icon size={20} color={color} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
    </button>
  )
}

export function ItemDetailScreen({ item, onBack, onViewInFloorPlan }: Props) {
  const [showMove, setShowMove] = useState(false)
  const status = expiryStatus(item.expiry)
  const days = daysUntilExpiry(item.expiry)

  const history = [
    { date: '2026-04-28', action: '登録', by: '田中 太郎' },
    { date: '2026-04-20', action: 'リビングから移動', by: '田中 花子' },
    { date: '2026-03-10', action: '登録', by: '田中 太郎' },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <Header
        title="アイテム詳細"
        onBack={onBack}
        right={
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <IconEdit size={20} color="var(--text-tertiary)" />
          </button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* Photo area */}
        <div style={{
          margin: '16px',
          height: 170, borderRadius: 'var(--r-xl)',
          background: 'rgba(196,168,130,0.08)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 8, cursor: 'pointer',
          border: '1.5px dashed var(--border-strong)',
        }}>
          <IconBox size={40} color="var(--text-tertiary)" />
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
            タップして写真を追加
          </span>
        </div>

        {/* Main info */}
        <div className="glass" style={{
          margin: '0 16px 16px',
          borderRadius: 'var(--r-xl)',
          padding: '20px',
        }}>
          <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
            {item.name}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 13, color: 'var(--text-secondary)',
            marginBottom: 16, flexWrap: 'wrap',
          }}>
            <span style={{ fontWeight: 600 }}>{item.roomName}</span>
            <IconChevronRight size={12} color="var(--text-tertiary)" />
            <span style={{ fontWeight: 600 }}>{item.furnitureName}</span>
          </div>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {item.count !== undefined && (
              <MetaCell label="数量" value={`${item.count}個`} />
            )}
            {item.expiry && (
              <MetaCell
                label="賞味期限"
                value={item.expiry}
                color={status === 'red' ? 'var(--red)' : status === 'yellow' ? 'var(--yellow)' : 'var(--green)'}
              />
            )}
            {item.tags.length > 0 && (
              <MetaCell label="タグ" value={item.tags.join(', ')} />
            )}
            <MetaCell label="登録日" value="2026-04-28" />
          </div>

          {/* Memo */}
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
              marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              メモ
            </div>
            <div style={{
              background: 'rgba(196,168,130,0.08)',
              borderRadius: 10, padding: '10px 12px',
              fontSize: 13, color: 'var(--text-tertiary)', minHeight: 44,
            }}>
              メモを追加…
            </div>
          </div>

          {/* Expiry warning */}
          {status === 'red' && (
            <div style={{
              marginTop: 14, padding: '10px 14px', borderRadius: 'var(--r)',
              background: 'var(--red-light)', color: 'var(--red)',
              fontSize: 13, fontWeight: 700,
            }}>
              ⚠️ 期限まであと{days}日！早めに消費してください
            </div>
          )}

          {/* QR button */}
          <button style={{
            width: '100%', marginTop: 16,
            padding: '12px', borderRadius: 'var(--r)',
            border: '1px solid var(--border-strong)',
            background: 'rgba(255,253,250,0.6)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-rounded)',
          }}>
            <IconQR size={18} />
            QRコードを表示・ダウンロード
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, padding: '0 16px', marginBottom: 10 }}>
          <ActionBtn label="移動する"   Icon={IconMove}  onClick={() => setShowMove(true)} color="var(--accent-dark)" bg="var(--accent-light)" />
          <ActionBtn label="処分する"   Icon={IconTrash} onClick={undefined}                 color="var(--red)"        bg="var(--red-light)"   />
          <ActionBtn label="編集する"   Icon={IconEdit}  onClick={undefined}                 color="var(--text-secondary)" bg="rgba(196,168,130,0.10)" />
        </div>

        {/* View in floor plan */}
        {onViewInFloorPlan && (
          <div style={{ padding: '0 16px', marginBottom: 16 }}>
            <button
              onClick={onViewInFloorPlan}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--r)',
                border: '1.5px solid var(--glass-warm-border)',
                background: 'var(--glass-warm)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-rounded)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="8" height="8" rx="1.5" />
                <rect x="14" y="2" width="8" height="4" rx="1.5" />
                <rect x="14" y="10" width="3" height="3" rx="1" />
                <rect x="2" y="14" width="8" height="4" rx="1.5" />
                <rect x="14" y="16" width="8" height="6" rx="1.5" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-dark)' }}>
                間取り図で見る
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {item.roomName} › {item.furnitureName}
              </span>
            </button>
          </div>
        )}

        {/* Move history */}
        <div style={{ margin: '0 16px 24px' }}>
          <div style={{
            fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)',
            marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            移動履歴
          </div>
          <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'var(--accent)' : 'var(--border-strong)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{h.action}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{h.by}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{h.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Move modal */}
      {showMove && (
        <div
          onClick={() => setShowMove(false)}
          style={{
            position: 'absolute', inset: 0, zIndex: 400,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass-strong"
            style={{
              width: '100%',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 40px',
              animation: 'slideUp 0.24s ease',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>
              移動先を選択
            </div>
            {SAMPLE_DATA.rooms.map(r => (
              <div
                key={r.id}
                onClick={() => setShowMove(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                {(() => { const I = getRoomIcon(r.icon); return <I size={18} color="#A05830" /> })()}
                <span style={{ fontWeight: 600 }}>{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
