import type { ReactNode } from 'react'

type Color = 'accent' | 'red' | 'yellow' | 'green'

const styles: Record<Color, { bg: string; text: string; border: string }> = {
  accent: { bg: 'var(--accent-light)',  text: 'var(--accent-text)',  border: 'rgba(196,132,90,0.20)' },
  red:    { bg: 'var(--red-light)',     text: 'var(--red)',          border: 'rgba(217,80,80,0.22)' },
  yellow: { bg: 'var(--yellow-light)',  text: 'var(--yellow)',       border: 'rgba(196,144,16,0.22)' },
  green:  { bg: 'var(--green-light)',   text: 'var(--green)',        border: 'rgba(80,160,112,0.22)' },
}

interface BadgeProps {
  children: ReactNode
  color?: Color
  /** Accessible label override when the visual text isn't descriptive enough */
  'aria-label'?: string
}

export function Badge({ children, color = 'accent', 'aria-label': ariaLabel }: BadgeProps) {
  const s = styles[color]
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 'var(--r-full)',
        fontSize: 11,
        fontWeight: 700,
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
