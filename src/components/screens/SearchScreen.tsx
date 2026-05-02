'use client'

import { useState, useRef, useEffect } from 'react'
import { IconSend, IconSparkle } from '@/components/ui/Icons'

type ChatMessage = { role: 'user' | 'assistant'; text: string }

export const INITIAL_MESSAGES: ChatMessage[] = [
  { role: 'assistant', text: 'こんにちは！何かお探しですか？「電池どこ？」のように話しかけてください。' },
]

export function simulateAIResponse(query: string): string {
  if (query.includes('電池')) return '電池はリビングのサイドテーブルにあります。単3電池が4本残っています！'
  if (query.includes('リモコン')) return 'リモコンはリビングのテレビ台にあります。テレビ用とエアコン用の2つがあります。'
  if (query.includes('牛乳') || query.includes('ミルク')) return '⚠ 牛乳はキッチンの冷蔵庫にあります。賞味期限が2026-05-04と近いです！'
  return `「${query}」で検索しましたが、該当アイテムが見つかりませんでした。テキスト検索はアイテムタブからお試しください。`
}

export function SearchScreen() {
  const [aiInput, setAiInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [typing, setTyping] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatBottomRef.current)
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    <div style={{ position: 'absolute', inset: 0, paddingBottom: 'var(--tab-bar-h)', display: 'flex', flexDirection: 'column' }}>

      {/* Sticky header */}
      <div className="glass-strong" style={{
        padding: '16px 16px 14px',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        borderRadius: 0,
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <IconSparkle size={20} color="var(--accent-dark)" />
          <div style={{ fontWeight: 800, fontSize: 22 }}>AIチャット</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          どこに何があるか、AIに聞いてみましょう
        </div>
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeUp 0.22s ease',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginRight: 8, marginTop: 2,
                }}>
                  <IconSparkle size={14} color="var(--accent-dark)" />
                </div>
              )}
              <div style={{
                maxWidth: '76%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'var(--accent-grad)'
                  : 'var(--glass-warm)',
                backdropFilter: msg.role === 'assistant' ? 'blur(14px)' : 'none',
                WebkitBackdropFilter: msg.role === 'assistant' ? 'blur(14px)' : 'none',
                border: msg.role === 'assistant' ? '1px solid var(--glass-warm-border)' : 'none',
                boxShadow: msg.role === 'assistant' ? 'var(--glass-shadow)' : 'none',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                fontSize: 14, lineHeight: 1.55, fontWeight: 500,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconSparkle size={14} color="var(--accent-dark)" />
              </div>
              <div style={{
                padding: '10px 16px',
                borderRadius: '18px 18px 18px 4px',
                background: 'var(--glass-warm)',
                border: '1px solid var(--glass-warm-border)',
              }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 16 }}>
                  {[0, 1, 2].map(i => (
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
      </div>

      {/* Input area */}
      <div className="glass-strong" style={{
        padding: '10px 16px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 10, alignItems: 'center',
        borderRadius: 0,
        borderLeft: 'none', borderRight: 'none', borderBottom: 'none',
        flexShrink: 0,
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
    </div>
  )
}
