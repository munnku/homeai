'use client'

import { useState, useRef, useEffect } from 'react'
import { ALL_ITEMS_FLAT, expiryStatus, type FlatItem } from '@/lib/data'
import { IconSearch, IconChevronRight, IconSend } from '@/components/ui/Icons'
import { Badge } from '@/components/ui/Badge'

interface Props {
  onItemClick: (item: FlatItem) => void
  initialFocus?: boolean
}

type ChatMessage = { role: 'user' | 'assistant'; text: string }

const INITIAL_MESSAGES: ChatMessage[] = [
  { role: 'assistant', text: 'こんにちは！何かお探しですか？「電池どこ？」のように話しかけてください。' },
]

function simulateAIResponse(query: string): string {
  if (query.includes('電池')) return '電池はリビングのサイドテーブルにあります。単3電池が4本残っています！'
  if (query.includes('リモコン')) return 'リモコンはリビングのテレビ台にあります。テレビ用とエアコン用の2つがあります。'
  if (query.includes('牛乳') || query.includes('ミルク')) return '⚠ 牛乳はキッチンの冷蔵庫にあります。賞味期限が2026-05-04と近いです！'
  return `「${query}」で検索しましたが、該当アイテムが見つかりませんでした。テキスト検索をお試しください。`
}

export function SearchScreen({ onItemClick, initialFocus = false }: Props) {
  const [mode, setMode] = useState<'text' | 'ai'>('text')
  const [query, setQuery] = useState('')
  const [aiInput, setAiInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [typing, setTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialFocus) inputRef.current?.focus()
  }, [initialFocus])

  useEffect(() => {
    if (chatBottomRef.current)
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const results = query.trim()
    ? ALL_ITEMS_FLAT.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.path.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(t => t.includes(query))
      )
    : []

  function sendAI() {
    const text = aiInput.trim()
    if (!text) return
    setMessages(p => [...p, { role: 'user', text }])
    setAiInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(p => [...p, { role: 'assistant', text: simulateAIResponse(text) }])
      setTyping(false)
    }, 1100)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>

      {/* Sticky search header */}
      <div className="glass-strong" style={{
        padding: '16px 16px 12px',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        borderRadius: 0,
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
      }}>
        <div style={{ fontWeight: 800, fontSize: 24, marginBottom: 12 }}>検索</div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(160,120,80,0.09)',
          borderRadius: 'var(--r)',
          padding: 3, marginBottom: 12, gap: 3,
        }}>
          {(['text', 'ai'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '8px', borderRadius: 'var(--r-sm)',
                border: 'none', cursor: 'pointer',
                background: mode === m ? 'var(--glass-strong)' : 'transparent',
                boxShadow: mode === m ? 'var(--glass-shadow)' : 'none',
                fontWeight: 700, fontSize: 13,
                color: mode === m ? 'var(--text-primary)' : 'var(--text-tertiary)',
                transition: 'var(--ease-fast)',
                fontFamily: 'var(--font-rounded)',
              }}
            >
              {m === 'text' ? '🔍 テキスト検索' : '✨ AIチャット'}
            </button>
          ))}
        </div>

        {/* Text search input */}
        {mode === 'text' && (
          <div className="glass" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            borderRadius: 'var(--r-full)',
            padding: '10px 16px',
          }}>
            <IconSearch size={16} color="var(--text-tertiary)" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="アイテム名・場所・タグで検索"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 14, fontFamily: 'var(--font-rounded)',
                color: 'var(--text-primary)',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--text-tertiary)',
                  border: 'none', cursor: 'pointer',
                  color: '#fff', fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 80px' }}>

        {/* Text search results */}
        {mode === 'text' && (
          <>
            {!query && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 10 }}>
                  最近の検索
                </div>
                {['リモコン', '電池', '牛乳'].map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(t)}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 0',
                      background: 'none', border: 'none',
                      borderBottom: `1px solid var(--border)`,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span className="emoji" style={{ fontSize: 16, color: 'var(--text-tertiary)' }}>🕐</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{t}</span>
                  </button>
                ))}
              </div>
            )}

            {query && (
              <>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 10,
                }}>
                  {results.length}件の結果
                </div>
                {results.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                    <div className="emoji" style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontWeight: 600 }}>見つかりませんでした</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>AIチャットで試してみましょう</div>
                  </div>
                ) : (
                  <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                    {results.map((item, i) => {
                      const status = expiryStatus(item.expiry)
                      return (
                        <button
                          key={item.id}
                          onClick={() => onItemClick(item)}
                          style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 16px',
                            background: 'none', border: 'none',
                            borderBottom: i < results.length - 1 ? `1px solid var(--border)` : 'none',
                            cursor: 'pointer', textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: 22 }}>{item.roomIcon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontWeight: 700, fontSize: 14,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                              {item.path}
                            </div>
                          </div>
                          {status === 'red' && <Badge color="red">期限近い</Badge>}
                          <IconChevronRight size={14} color="var(--text-tertiary)" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* AI chat */}
        {mode === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeUp 0.22s ease',
              }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'var(--accent-grad)'
                    : 'var(--glass)',
                  backdropFilter: msg.role === 'assistant' ? 'blur(16px)' : 'none',
                  WebkitBackdropFilter: msg.role === 'assistant' ? 'blur(16px)' : 'none',
                  border: msg.role === 'assistant' ? '1px solid var(--glass-border)' : 'none',
                  boxShadow: msg.role === 'assistant' ? 'var(--glass-shadow)' : 'none',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: 14, lineHeight: 1.55, fontWeight: 500,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex' }}>
                <div className="glass" style={{
                  padding: '10px 16px',
                  borderRadius: '18px 18px 18px 4px',
                }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 16 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--text-tertiary)',
                        animation: `bounce 1.2s ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* AI input */}
      {mode === 'ai' && (
        <div className="glass-strong" style={{
          padding: '10px 16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 10, alignItems: 'center',
          borderRadius: 0,
          borderLeft: 'none', borderRight: 'none', borderBottom: 'none',
        }}>
          <input
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendAI()}
            placeholder="「電池どこ？」のように聞いてください"
            style={{
              flex: 1, padding: '10px 16px',
              borderRadius: 'var(--r-full)',
              border: '1px solid var(--border-strong)',
              background: 'rgba(255,253,250,0.7)',
              fontSize: 14, fontFamily: 'var(--font-rounded)',
              outline: 'none', color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={sendAI}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--accent-grad)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconSend size={17} color="#fff" />
          </button>
        </div>
      )}
    </div>
  )
}
