'use client'

interface Props {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFitAll: () => void
}

const btnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: '1.5px solid var(--glass-warm-border)',
  background: 'var(--glass-warm)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  cursor: 'pointer',
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-rounded)',
  transition: 'opacity 0.15s',
}

export function ZoomPanControls({ zoom, onZoomIn, onZoomOut, onFitAll }: Props) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 16,
      left: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      zIndex: 20,
    }}>
      <button
        onClick={onZoomIn}
        style={{ ...btnStyle, opacity: zoom >= 3 ? 0.4 : 1 }}
        disabled={zoom >= 3}
        aria-label="ズームイン"
      >＋</button>
      <button
        onClick={onZoomOut}
        style={{ ...btnStyle, opacity: zoom <= 0.25 ? 0.4 : 1 }}
        disabled={zoom <= 0.25}
        aria-label="ズームアウト"
      >－</button>
      <button
        onClick={onFitAll}
        style={btnStyle}
        aria-label="全体表示"
        title="全体表示"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="10" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="1" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
    </div>
  )
}
