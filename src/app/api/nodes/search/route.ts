import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    .select('*')
    .eq('household_id', household_id)
    .eq('archived', false)
    .textSearch('search_vector', q, { type: 'plain', config: 'simple' })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enrich results with ancestor path
  const enriched = await Promise.all(data.map(async (node) => {
    const path = await getAncestorPath(supabase, node.parent_id)
    return { ...node, path }
  }))

  return NextResponse.json(enriched)
}

async function getAncestorPath(supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>, parentId: string | null): Promise<string[]> {
  if (!parentId) return []
  const path: string[] = []
  let currentId: string | null = parentId

  while (currentId) {
    const { data } = await supabase
      .from('nodes')
      .select('id, name, parent_id')
      .eq('id', currentId)
      .single()

    if (!data) break
    path.unshift(data.name)
    currentId = data.parent_id
  }

  return path
}
