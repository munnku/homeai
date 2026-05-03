'use client'

import { IconEdit } from '@/components/ui/Icons'

interface Props {
  editMode: boolean
  onToggle: () => void
}

export function EditModeButton({ editMode, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'absolute',
        bottom: 'calc(var(--tab-bar-h) + 16px)',
        right: 16,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `2px solid ${editMode ? 'var(--accent)' : 'var(--glass-warm-border)'}`,
        background: editMode ? 'var(--accent-light)' : 'var(--glass-warm)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        transition: 'background 0.15s, border-color 0.15s',
        boxShadow: '0 2px 8px rgba(80,48,18,0.12)',
      }}
      aria-label={editMode ? '編集完了' : 'レイアウトを編集'}
    >
      <IconEdit size={18} color={editMode ? 'var(--accent-dark)' : 'var(--text-secondary)'} />
    </button>
  )
}
