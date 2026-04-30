import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/nodes/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { data, error } = await supabase.from('nodes').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/nodes/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  // Fetch current node for history
  const { data: current } = await supabase.from('nodes').select('*').eq('id', id).single()
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: updated, error } = await supabase
    .from('nodes')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Record history for moves
  if (body.parent_id !== undefined && body.parent_id !== current.parent_id) {
    await supabase.from('node_history').insert({
      node_id: id,
      action: 'moved',
      from_parent_id: current.parent_id,
      to_parent_id: body.parent_id,
      performed_by: user.id
    })
  }

  // Record history for rename
  if (body.name !== undefined && body.name !== current.name) {
    await supabase.from('node_history').insert({
      node_id: id,
      action: 'renamed',
      metadata: { old_name: current.name, new_name: body.name },
      performed_by: user.id
    })
  }

  // Record archive (disposal)
  if (body.archived === true && !current.archived) {
    await supabase.from('node_history').insert({
      node_id: id,
      action: 'disposed',
      from_parent_id: current.parent_id,
      performed_by: user.id
    })
  }

  return NextResponse.json(updated)
}

// DELETE /api/nodes/[id] — hard delete (use PATCH archived:true for soft delete)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await supabase.from('nodes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
