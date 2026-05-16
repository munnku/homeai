import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai'

const FREE_DAILY_LIMIT = 10

// POST /api/ai/recognize
// Body: { image_base64: string, mime_type: string }
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Rate limit check for free users — atomic to prevent race conditions
  const isPaid = (user.user_metadata?.plan ?? 'free') === 'paid'
  if (!isPaid) {
    const today = new Date().toISOString().split('T')[0]
    const { data: newCount, error: rpcError } = await supabase
      .rpc('increment_ai_usage', {
        p_user_id: user.id,
        p_date: today,
        p_limit: FREE_DAILY_LIMIT,
      })

    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 })
    if ((newCount ?? -1) < 0) {
      return NextResponse.json(
        { error: `無料プランは1日${FREE_DAILY_LIMIT}回までです。有料プランにアップグレードしてください。` },
        { status: 429 }
      )
    }
  }

  const { image_base64, mime_type } = await req.json()
  if (!image_base64 || !mime_type) {
    return NextResponse.json({ error: 'image_base64 and mime_type are required' }, { status: 400 })
  }

  const ai = getAIProvider()
  const result = await ai.recognizeImage(image_base64, mime_type)
  return NextResponse.json(result)
}
