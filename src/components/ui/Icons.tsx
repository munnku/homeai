// All icons use a single unified muted colour (--icon) by default.
// Override with `color` prop only for active / semantic states.

type P = { size?: number; color?: string }

const d = (color?: string) => color ?? 'var(--icon)'

export function IconHome({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

export function IconSearch({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={11} cy={11} r={8} />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function IconBox({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1={12} y1={22.08} x2={12} y2={12} />
    </svg>
  )
}

export function IconSettings({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={3} />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

export function IconPlus({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2.5} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconChevronRight({ size = 16, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function IconChevronDown({ size = 16, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function IconArrowLeft({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

export function IconCamera({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx={12} cy={13} r={4} />
    </svg>
  )
}

export function IconQR({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={3} width={7} height={7} />
      <rect x={14} y={3} width={7} height={7} />
      <rect x={3} y={14} width={7} height={7} />
      <rect x={5} y={5} width={3} height={3} fill={d(color)} stroke="none" />
      <rect x={16} y={5} width={3} height={3} fill={d(color)} stroke="none" />
      <rect x={5} y={16} width={3} height={3} fill={d(color)} stroke="none" />
      <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17v3" />
    </svg>
  )
}

export function IconEdit({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export function IconTrash({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

export function IconMove({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 9 2 12 5 15" />
      <polyline points="9 5 12 2 15 5" />
      <polyline points="15 19 12 22 9 19" />
      <polyline points="19 9 22 12 19 15" />
      <line x1={2} y1={12} x2={22} y2={12} />
      <line x1={12} y1={2} x2={12} y2={22} />
    </svg>
  )
}

export function IconGrid({ size = 20, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={3} width={7} height={7} />
      <rect x={14} y={3} width={7} height={7} />
      <rect x={14} y={14} width={7} height={7} />
      <rect x={3} y={14} width={7} height={7} />
    </svg>
  )
}

export function IconList({ size = 20, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={8} y1={6} x2={21} y2={6} />
      <line x1={8} y1={12} x2={21} y2={12} />
      <line x1={8} y1={18} x2={21} y2={18} />
      <line x1={3} y1={6} x2={3.01} y2={6} />
      <line x1={3} y1={12} x2={3.01} y2={12} />
      <line x1={3} y1={18} x2={3.01} y2={18} />
    </svg>
  )
}

export function IconSend({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={d(color)} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1={22} y1={2} x2={11} y2={13} />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}
