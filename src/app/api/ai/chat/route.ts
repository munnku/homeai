import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai'
import type { ChatMessage } from '@/lib/ai'
import { getAncestorNamesBatch } from '@/lib/supabase/ancestors'

// POST /api/ai/chat
// Body: { household_id: string, messages: ChatMessage[] }
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Paid plan only
  const isPaid = (user.user_metadata?.plan ?? 'free') === 'paid'
  if (!isPaid) {
    return NextResponse.json(
      { error: 'AIチャットは有料プランの機能です。' },
      { status: 403 }
    )
  }

  const { household_id, messages } = await req.json() as {
    household_id: string
    messages: ChatMessage[]
  }

  if (!household_id || !messages?.length) {
    return NextResponse.json({ error: 'household_id and messages are required' }, { status: 400 })
  }

  // RAG: full-text search on the last user message
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
  let context = ''

  if (lastUserMessage) {
    const { data: searchResults } = await supabase
      .from('nodes')
      .select('id, name, type, parent_id, description, metadata')
      .eq('household_id', household_id)
      .eq('archived', false)
      .textSearch('search_vector', lastUserMessage.content, { type: 'plain', config: 'simple' })
      .limit(20)

    if (searchResults?.length) {
      const pathMap = await getAncestorNamesBatch(supabase, searchResults.map(n => n.parent_id))
      const contextLines = searchResults.map((node) => {
        const path = pathMap.get(node.parent_id) ?? []
        const location = [...path, node.name].join(' > ')
        const meta = node.metadata
          ? Object.entries(node.metadata)
              .filter(([k]) => k !== 'serial_number')
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')
          : ''
        return `- ${location}${meta ? ` (${meta})` : ''}`
      })
      context = contextLines.join('\n')
    }
  }

  const ai = getAIProvider()
  const reply = await ai.chat(messages, context)
  return NextResponse.json({ reply })
}
