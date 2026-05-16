'use client'

import type { ReactNode } from 'react'

/**
 * Renders children exactly once.
 * - Mobile (<520px): full-viewport with safe-area insets
 * - Desktop (≥520px): centered phone-frame mockup (390×844)
 *
 * Using CSS-only layout switching avoids the state/effect duplication
 * that occurs when children are rendered twice.
 */
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        /* ── Page centering wrapper ── */
        .phone-page {
          width: 100%;
          height: 100%;
        }
        /* ── Phone container ── */
        .phone-root {
          width: 100%;
          height: 100dvh;
          position: relative;
          overflow: hidden;
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        /* Decorative frame elements — hidden on mobile */
        .phone-deco { display: none; }
        /* Content layer */
        .phone-content {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        @media (min-width: 520px) {
          .phone-page {
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            padding: 32px 16px;
          }
          .phone-root {
            width: 390px;
            height: 844px;
            border-radius: 52px;
            padding: 0;
            box-shadow: 0 32px 80px rgba(0,0,0,0.26),
                        0 0 0 11px #2a2a2a,
                        0 0 0 13px #1a1a1a;
            flex-shrink: 0;
          }
          .phone-deco { display: block; }
          /* Push content below the decorative status bar */
          .phone-content { top: 44px; }
        }
      `}</style>

      <div className="phone-page">
        <div className="phone-root">
          {/* Decorative chrome — visually only, hidden from screen readers */}
          <div className="phone-deco" aria-hidden="true">
            {/* Notch */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 120, height: 32, background: '#1a1a1a',
              borderRadius: '0 0 18px 18px', zIndex: 1000, pointerEvents: 'none',
            }} />
            {/* Status bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 44,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              padding: '0 24px 6px', zIndex: 999, pointerEvents: 'none',
              fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
              fontFamily: 'var(--font-rounded)',
            }}>
              <span>9:41</span>
              <span>●●●</span>
            </div>
          </div>

          {/* App content — rendered once */}
          <div className="phone-content">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
