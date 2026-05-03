'use client'

import { useState } from 'react'
import { SAMPLE_DATA } from '@/lib/data'
import { Header } from '@/components/ui/Header'
import { IconCamera, IconQR } from '@/components/ui/Icons'
import { Badge } from '@/components/ui/Badge'

type Step = 0 | 1 | 2 | 3

const PROGRESS = [0, 33, 66, 100]

export function AddScreen() {
  const [step, setStep] = useState<Step>(0)
  const [mode, setMode] = useState<'camera' | 'text' | null>(null)
  const [itemName, setItemName] = useState('')
  const [candidates, setCandidates] = useState<string[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function reset() {
    setStep(0)
    setMode(null)
    setItemName('')
    setCandidates([])
    setSelectedRoom(null)
    setSaved(false)
  }

  function simulateAI() {
    setStep(1)
    setTimeout(() => {
      setCandidates(['リモコン（テレビ）', 'テレビリモコン', '赤外線リモコン'])
      setItemName('リモコン（テレビ）')
      setStep(2)
    }, 1800)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(reset, 1500)
  }

  if (saved) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        paddingBottom: 'var(--tab-bar-h)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div className="emoji" style={{ fontSize: 60 }}>✅</div>
        <div style={{ fontWeight: 800, fontSize: 22 }}>登録しました！</div>
        <div style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
          {itemName} → {SAMPLE_DATA.rooms.find(r => r.id === selectedRoom)?.name ?? 'リビング'}
        </div>
      </div>
    )
  }

  const stepTitle: Record<Step, string> = {
    0: '物を登録する',
    1: 'AI認識中…',
    2: 'AI認識結果',
    3: '場所を選択',
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
    }}>
      <Header
        title={stepTitle[step]}
        onBack={step > 0 ? () => setStep(s => (s - 1) as Step) : undefined}
      />

      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(196,168,130,0.15)', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${PROGRESS[step]}%`,
          background: 'var(--accent-grad)',
          transition: 'width 0.4s ease',
          borderRadius: '0 3px 3px 0',
        }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', paddingBottom: 'calc(var(--tab-bar-h) + 24px)' }}>

        {/* Step 0: Choose mode */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>
              どちらで登録しますか？
            </div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: 14, marginBottom: 6 }}>
              カメラで撮るだけでAIが自動認識します
            </div>

            <button
              onClick={simulateAI}
              className="glass"
              style={{
                borderRadius: 'var(--r-xl)', padding: 20,
                cursor: 'pointer', border: '1px solid var(--glass-border)',
                display: 'flex', gap: 16, alignItems: 'center', textAlign: 'left',
                transition: 'var(--ease)',
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: 'var(--r)',
                background: 'var(--accent-grad)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconCamera size={24} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>カメラで撮影</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  AIが物の名前を自動認識
                </div>
                <div style={{ marginTop: 6 }}>
                  <Badge color="accent">おすすめ</Badge>
                </div>
              </div>
            </button>

            <button
              onClick={() => { setMode('text'); setStep(2) }}
              className="glass"
              style={{
                borderRadius: 'var(--r-xl)', padding: 20,
                cursor: 'pointer', border: '1px solid var(--glass-border)',
                display: 'flex', gap: 16, alignItems: 'center', textAlign: 'left',
              }}
            >
              <div className="emoji" style={{
                width: 54, height: 54, borderRadius: 'var(--r)',
                background: 'rgba(196,168,130,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: 24,
              }}>✏️</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>テキストで入力</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  名前を直接入力する
                </div>
              </div>
            </button>

            <button
              className="glass"
              style={{
                borderRadius: 'var(--r-xl)', padding: 20,
                cursor: 'pointer', border: '1px solid var(--glass-border)',
                display: 'flex', gap: 16, alignItems: 'center', textAlign: 'left',
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: 'var(--r)',
                background: 'rgba(196,168,130,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconQR size={24} color="var(--icon)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>QRスキャン</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  場所のQRから登録
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Step 1: AI processing */}
        {step === 1 && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: 300, gap: 24,
          }}>
            <div style={{
              width: '100%', maxWidth: 280, aspectRatio: '4/3',
              background: '#1a1a1a', borderRadius: 'var(--r-xl)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 20,
                border: '2px solid var(--accent)',
                borderRadius: 'var(--r)',
                animation: 'pulse-border 1.5s infinite',
              }} />
              <div className="emoji" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 40 }}>📷</div>
              <div style={{
                position: 'absolute', left: 20, right: 20, height: 2,
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                animation: 'scan-line 1.5s linear infinite',
              }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>AIが認識しています…</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: `bounce 1.2s ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode !== 'text' && candidates.length > 0 && (
              <>
                <div style={{
                  background: 'var(--green-light)',
                  borderRadius: 'var(--r)',
                  padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>
                    AIが認識しました！（信頼度94%）
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)' }}>
                  候補から選ぶか、編集してください
                </div>
                {candidates.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setItemName(c)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--r)',
                      background: itemName === c ? 'var(--accent-light)' : 'var(--glass)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: itemName === c ? '1.5px solid var(--accent)' : '1px solid var(--glass-border)',
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'var(--ease-fast)',
                      fontFamily: 'var(--font-rounded)',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{c}</span>
                    {i === 0 && <Badge color="accent">最有力</Badge>}
                    {itemName === c && <span style={{ fontSize: 18 }}>✓</span>}
                  </button>
                ))}
              </>
            )}

            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
                marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                アイテム名
              </div>
              <input
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="アイテム名を入力"
                style={{
                  width: '100%', padding: '14px 16px',
                  borderRadius: 'var(--r)', border: '1px solid var(--border-strong)',
                  background: 'rgba(255,253,250,0.7)',
                  fontSize: 15, fontFamily: 'var(--font-rounded)',
                  fontWeight: 600, outline: 'none',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
                  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  数量
                </div>
                <input type="number" placeholder="1" style={{
                  width: '100%', padding: '12px 14px',
                  borderRadius: 'var(--r-sm)', border: '1px solid var(--border-strong)',
                  background: 'rgba(255,253,250,0.7)',
                  fontSize: 14, fontFamily: 'var(--font-rounded)',
                  outline: 'none', color: 'var(--text-primary)',
                }} />
              </div>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
                  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  賞味期限（任意）
                </div>
                <input type="date" style={{
                  width: '100%', padding: '12px 14px',
                  borderRadius: 'var(--r-sm)', border: '1px solid var(--border-strong)',
                  background: 'rgba(255,253,250,0.7)',
                  fontSize: 13, fontFamily: 'var(--font-rounded)',
                  outline: 'none', color: 'var(--text-primary)',
                }} />
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!itemName}
              style={{
                width: '100%', padding: '16px',
                borderRadius: 'var(--r-lg)', border: 'none',
                background: itemName ? 'var(--accent-grad)' : 'rgba(196,168,130,0.15)',
                color: itemName ? '#fff' : 'var(--text-tertiary)',
                fontWeight: 800, fontSize: 16,
                cursor: itemName ? 'pointer' : 'not-allowed',
                transition: 'var(--ease-fast)',
                fontFamily: 'var(--font-rounded)',
              }}
            >
              場所を選択する →
            </button>
          </div>
        )}

        {/* Step 3: Select location */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>
              「{itemName}」の場所
            </div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: 14, marginBottom: 8 }}>
              保管場所の部屋を選んでください
            </div>
            {SAMPLE_DATA.rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className="glass"
                style={{
                  borderRadius: 'var(--r-lg)', padding: '14px 16px',
                  border: selectedRoom === room.id
                    ? '1.5px solid var(--accent)'
                    : '1px solid var(--glass-border)',
                  background: selectedRoom === room.id ? 'rgba(232,168,124,0.10)' : 'var(--glass)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'var(--ease-fast)',
                  textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{room.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{room.itemCount}点</div>
                </div>
                {selectedRoom === room.id && <span style={{ fontSize: 20, color: 'var(--accent-dark)' }}>✓</span>}
              </button>
            ))}
            <button
              onClick={handleSave}
              disabled={!selectedRoom}
              style={{
                width: '100%', padding: '16px', marginTop: 8,
                borderRadius: 'var(--r-lg)', border: 'none',
                background: selectedRoom ? 'var(--accent-grad)' : 'rgba(196,168,130,0.15)',
                color: selectedRoom ? '#fff' : 'var(--text-tertiary)',
                fontWeight: 800, fontSize: 16,
                cursor: selectedRoom ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-rounded)',
              }}
            >
              ✅ 登録する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
