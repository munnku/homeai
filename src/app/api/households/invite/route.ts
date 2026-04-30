import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/households/invite — create an invite link
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { household_id } = await req.json()
  if (!household_id) return NextResponse.json({ error: 'household_id is required' }, { status: 400 })

  // Verify caller is a member
  const { data: membership } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('household_id', household_id)
    .eq('user_id', user.id)
    .single()

  if (!membership) return NextResponse.json({ error: 'Not a member' }, { status: 403 })

  const { data: invite, error } = await supabase
    .from('household_invites')
    .insert({ household_id, created_by: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`
  return NextResponse.json({ url, expires_at: invite.expires_at }, { status: 201 })
}
