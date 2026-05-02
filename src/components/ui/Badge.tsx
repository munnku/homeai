type Color = 'accent' | 'red' | 'yellow' | 'green'

const styles: Record<Color, { bg: string; text: string }> = {
  accent: { bg: 'var(--accent-light)',  text: 'var(--accent-text)' },
  red:    { bg: 'var(--red-light)',     text: 'var(--red)' },
  yellow: { bg: 'var(--yellow-light)',  text: 'var(--yellow)' },
  green:  { bg: 'var(--green-light)',   text: 'var(--green)' },
}

export function Badge({ children, color = 'accent' }: { children: React.ReactNode; color?: Color }) {
  const s = styles[color]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 'var(--r-full)',
      fontSize: 11,
      fontWeight: 700,
      background: s.bg,
      color: s.text,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}
