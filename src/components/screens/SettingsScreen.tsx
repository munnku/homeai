'use client'

import { useState } from 'react'
import { IconChevronRight } from '@/components/ui/Icons'

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      padding: '0 4px', marginBottom: 6, marginTop: 20,
    }}>
      {title}
    </div>
  )
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--glass-warm)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid var(--glass-warm-border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}

function SettingsRow({
  label, value, onPress, isLast = false, destructive = false,
}: {
  label: string
  value?: string
  onPress?: () => void
  isLast?: boolean
  destructive?: boolean
}) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onPress}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center',
        padding: '13px 16px',
        background: pressed ? 'rgba(160,88,48,0.05)' : 'none',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        cursor: onPress ? 'pointer' : 'default',
        fontFamily: 'var(--font-rounded)',
        transition: 'background 0.1s',
        textAlign: 'left',
      }}
    >
      <span style={{
        flex: 1,
        fontSize: 14, fontWeight: 600,
        color: destructive ? 'var(--red)' : 'var(--text-primary)',
      }}>
        {label}
      </span>
      {value && (
        <span style={{
          fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500,
          marginRight: onPress ? 6 : 0,
        }}>
          {value}
        </span>
      )}
      {onPress && !destructive && (
        <IconChevronRight size={14} color="var(--text-tertiary)" />
      )}
    </button>
  )
}

function SettingsToggle({
  label, enabled, isLast = false,
}: {
  label: string
  enabled: boolean
  isLast?: boolean
}) {
  const [on, setOn] = useState(enabled)
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '13px 16px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
        {label}
      </span>
      <button
        onClick={() => setOn(p => !p)}
        style={{
          width: 44, height: 26,
          borderRadius: 13,
          background: on ? 'var(--accent)' : 'rgba(160,120,80,0.20)',
          border: 'none', cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3, left: on ? 21 : 3,
          width: 20, height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

export function SettingsScreen() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>

      {/* Sticky header */}
      <div className="glass-strong" style={{
        padding: '14px 16px 14px',
        borderBottom: '1px solid var(--border)',
        borderRadius: 0,
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        flexShrink: 0,
      }}>
        <div style={{ fontWeight: 800, fontSize: 22 }}>設定</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', paddingBottom: 'calc(var(--tab-bar-h) + 16px)' }}>

        {/* Account card */}
        <div style={{
          background: 'var(--accent-grad)',
          borderRadius: 'var(--r-xl)',
          padding: '18px 20px',
          marginTop: 12,
          marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontSize: 22, fontWeight: 700, color: '#fff',
          }}>
            田
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>田中 太郎</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: 500 }}>
              tanaka@example.com
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <IconChevronRight size={16} color="rgba(255,255,255,0.7)" />
          </div>
        </div>

        {/* 世帯設定 */}
        <SectionHeader title="世帯設定" />
        <SettingsCard>
          <SettingsRow label="世帯名" value="田中家" onPress={() => {}} />
          <SettingsRow label="メンバー管理" value="2人" onPress={() => {}} />
          <SettingsRow label="招待コード" onPress={() => {}} isLast />
        </SettingsCard>

        {/* 通知設定 */}
        <SectionHeader title="通知設定" />
        <SettingsCard>
          <SettingsToggle label="期限アラート" enabled={true} />
          <SettingsToggle label="7日前に通知" enabled={true} />
          <SettingsToggle label="3日前に通知" enabled={true} />
          <SettingsToggle label="追加・移動の通知" enabled={false} isLast />
        </SettingsCard>

        {/* 表示設定 */}
        <SectionHeader title="表示設定" />
        <SettingsCard>
          <SettingsRow label="言語" value="日本語" onPress={() => {}} />
          <SettingsRow label="文字の大きさ" value="標準" onPress={() => {}} isLast />
        </SettingsCard>

        {/* アプリ情報 */}
        <SectionHeader title="アプリ情報" />
        <SettingsCard>
          <SettingsRow label="バージョン" value="1.0.0" />
          <SettingsRow label="利用規約" onPress={() => {}} />
          <SettingsRow label="プライバシーポリシー" onPress={() => {}} />
          <SettingsRow label="ライセンス" onPress={() => {}} isLast />
        </SettingsCard>

        {/* アカウント */}
        <SectionHeader title="アカウント" />
        <SettingsCard>
          <SettingsRow label="アカウント設定" onPress={() => {}} />
          <SettingsRow label="ログアウト" onPress={() => {}} destructive isLast />
        </SettingsCard>

      </div>
    </div>
  )
}
