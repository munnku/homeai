'use client'

import { IconHome, IconSparkle, IconBox, IconSettings, IconPlus } from './Icons'

export type Tab = 'home' | 'search' | 'items' | 'settings'

interface TabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onAdd: () => void
}

type TabEntry =
  | { kind: 'tab'; id: Tab; label: string; Icon: React.FC<{ size?: number; color?: string }> }
  | { kind: 'fab' }

const tabs: TabEntry[] = [
  { kind: 'tab', id: 'home',     label: 'ホーム',   Icon: IconHome },
  { kind: 'tab', id: 'search',   label: 'AIチャット', Icon: IconSparkle },
  { kind: 'fab' },
  { kind: 'tab', id: 'items',    label: 'アイテム', Icon: IconBox },
  { kind: 'tab', id: 'settings', label: '設定',     Icon: IconSettings },
]

export function TabBar({ activeTab, onTabChange, onAdd }: TabBarProps) {
  return (
    <div className="glass-strong" style={{
      height: 'var(--tab-bar-h)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      zIndex: 200,
      paddingBottom: 10,
      borderRadius: 0,
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'none',
    }}>
      {tabs.map((tab, i) => {
        if (tab.kind === 'fab') {
          return (
            <button
              key="fab"
              onClick={onAdd}
              style={{
                width: 52, height: 52,
                borderRadius: '50%',
                background: 'var(--accent-grad)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 18px rgba(200, 130, 80, 0.38)`,
                transform: 'translateY(-8px)',
                transition: 'var(--ease)',
                flexShrink: 0,
              }}
            >
              <IconPlus size={24} color="#fff" />
            </button>
          )
        }

        const isActive = activeTab === tab.id
        const Icon = tab.Icon!
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              color: isActive ? 'var(--icon-active)' : 'var(--icon)',
              transition: 'var(--ease-fast)',
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
              position: 'relative',
            }}
          >
            <Icon size={22} color={isActive ? 'var(--icon-active)' : 'var(--icon)'} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>
              {tab.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: -4,
                width: 4, height: 4,
                borderRadius: '50%',
                background: 'var(--icon-active)',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
