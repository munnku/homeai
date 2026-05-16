import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/nodes?household_id=&parent_id=&include_archived=
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const household_id = searchParams.get('household_id')
  const parent_id = searchParams.get('parent_id')
  const include_archived = searchParams.get('include_archived') === 'true'

  if (!household_id) return NextResponse.json({ error: 'household_id is required' }, { status: 400 })

  let query = supabase
    .from('nodes')
    .select('id, household_id, parent_id, name, type, description, photo_url, qr_uuid, position, metadata, archived, archived_at, created_by, created_at, updated_at')
    .eq('household_id', household_id)
    .order('type')
    .order('name')

  if (parent_id === 'null' || parent_id === null) {
    query = query.is('parent_id', null)
  } else if (parent_id) {
    query = query.eq('parent_id', parent_id)
  }

  if (!include_archived) {
    query = query.eq('archived', false)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/nodes — create a node
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { household_id, name, type, parent_id, description, metadata } = body

  if (!household_id || !name || !type) {
    return NextResponse.json({ error: 'household_id, name, type are required' }, { status: 400 })
  }

  const { data: node, error } = await supabase
    .from('nodes')
    .insert({ household_id, name, type, parent_id, description, metadata, created_by: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('node_history').insert({
    node_id: node.id,
    action: 'created',
    to_parent_id: parent_id ?? null,
    performed_by: user.id
  })

  return NextResponse.json(node, { status: 201 })
}
