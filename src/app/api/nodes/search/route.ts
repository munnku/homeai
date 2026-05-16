import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAncestorNamesBatch } from '@/lib/supabase/ancestors'

// GET /api/nodes/search?household_id=&q=
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const household_id = searchParams.get('household_id')
  const q = searchParams.get('q')?.trim()

  if (!household_id) return NextResponse.json({ error: 'household_id is required' }, { status: 400 })
  if (!q) return NextResponse.json([])

  const { data, error } = await supabase
    .from('nodes')
    .select('id, household_id, parent_id, name, type, description, photo_url, qr_uuid, metadata, archived, created_at, updated_at')
    .eq('household_id', household_id)
    .eq('archived', false)
    .textSearch('search_vector', q, { type: 'plain', config: 'simple' })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const pathMap = await getAncestorNamesBatch(supabase, data.map(n => n.parent_id))
  const enriched = data.map(node => ({ ...node, path: pathMap.get(node.parent_id) ?? [] }))

  return NextResponse.json(enriched)
}
