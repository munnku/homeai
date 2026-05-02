'use client'

export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile: full screen — safe-area insets applied here */}
      <div className="phone-mobile" style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {children}
      </div>

      {/* Desktop: shown via CSS media query wrapper below */}
      <style>{`
        @media (min-width: 520px) {
          .phone-mobile {
            display: none !important;
          }
          .phone-desktop {
            display: flex !important;
          }
        }
        @media (max-width: 519px) {
          .phone-desktop { display: none !important; }
        }
      `}</style>

      <div className="phone-desktop" style={{
        display: 'none',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}>
        <div style={{
          width: 390,
          height: 844,
          borderRadius: 52,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.26), 0 0 0 11px #2a2a2a, 0 0 0 13px #1a1a1a',
        }}>
          {/* Notch */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 120, height: 32, background: '#1a1a1a',
            borderRadius: '0 0 18px 18px', zIndex: 1000,
          }} />
          {/* Status bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 44,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            padding: '0 24px 6px', zIndex: 999,
            fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
            fontFamily: 'var(--font-rounded)',
          }}>
            <span>9:41</span>
            <span>●●●</span>
          </div>
          {/* Content — starts below status bar so children never overlap the notch */}
          <div style={{
            position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
            overflow: 'hidden',
          }}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
