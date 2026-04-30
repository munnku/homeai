import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'

// POST /api/qr/sheet
// Body: { node_ids: string[] }
// Returns: JSON with QR data URLs for PDF generation
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Paid plan only
  const isPaid = (user.user_metadata?.plan ?? 'free') === 'paid'
  if (!isPaid) {
    return NextResponse.json({ error: 'QRシート印刷は有料プランの機能です。' }, { status: 403 })
  }

  const { node_ids } = await req.json()
  if (!Array.isArray(node_ids) || node_ids.length === 0) {
    return NextResponse.json({ error: 'node_ids is required' }, { status: 400 })
  }
  if (node_ids.length > 20) {
    return NextResponse.json({ error: '一度に生成できるQRは20枚までです。' }, { status: 400 })
  }

  const { data: nodes, error } = await supabase
    .from('nodes')
    .select('id, name, parent_id, qr_uuid')
    .in('id', node_ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const items = await Promise.all(
    nodes.map(async (node) => {
      // Generate QR UUID if not yet set
      let qrUuid = node.qr_uuid
      if (!qrUuid) {
        const { data: updated } = await supabase
          .from('nodes')
          .update({ qr_uuid: crypto.randomUUID() })
          .eq('id', node.id)
          .select('qr_uuid')
          .single()
        qrUuid = updated?.qr_uuid ?? crypto.randomUUID()
      }

      const url = `${appUrl}/scan/${qrUuid}`
      const qrDataUrl = await QRCode.toDataURL(url, { width: 200, margin: 1 })

      // Get location path
      const path = await getAncestorNames(supabase, node.parent_id)
      const location = path.join(' > ')

      return { id: node.id, name: node.name, location, qrDataUrl, url }
    })
  )

  return NextResponse.json({ items })
}

async function getAncestorNames(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>,
  parentId: string | null
): Promise<string[]> {
  if (!parentId) return []
  const names: string[] = []
  let currentId: string | null = parentId

  while (currentId) {
    const { data } = await supabase
      .from('nodes')
      .select('id, name, parent_id')
      .eq('id', currentId)
      .single()
    if (!data) break
    names.unshift(data.name)
    currentId = data.parent_id
  }

  return names
}
