import type { ReactNode } from 'react'
import { IconArrowLeft } from './Icons'

interface HeaderProps {
  title: string
  onBack?: () => void
  /** Accessible label for the back button (defaults to "戻る") */
  backLabel?: string
  right?: ReactNode
}

export function Header({ title, onBack, backLabel = '戻る', right }: HeaderProps) {
  return (
    <header
      className="glass-strong"
      style={{
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 10,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label={backLabel}
          style={{
            width: 36, height: 36,
            borderRadius: 'var(--r-sm)',
            border: 'none',
            background: 'rgba(255,253,250,0.7)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'var(--ease-fast)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <IconArrowLeft size={18} color="var(--text-secondary)" />
        </button>
      )}
      <h1 style={{
        flex: 1,
        margin: 0,
        fontWeight: 700,
        fontSize: 17,
        color: 'var(--text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-rounded)',
      }}>
        {title}
      </h1>
      {right}
    </header>
  )
}
