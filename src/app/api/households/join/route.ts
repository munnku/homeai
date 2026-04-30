import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/households/join — join via invite token
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'token is required' }, { status: 400 })

  const { data: invite, error: inviteError } = await supabase
    .from('household_invites')
    .select('*')
    .eq('token', token)
    .single()

  if (inviteError || !invite) return NextResponse.json({ error: 'Invalid invite' }, { status: 404 })
  if (invite.used_at) return NextResponse.json({ error: 'Invite already used' }, { status: 410 })
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 410 })
  }

  // Check already a member
  const { data: existing } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('household_id', invite.household_id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    await supabase.from('household_members').insert({
      household_id: invite.household_id,
      user_id: user.id
    })
  }

  // Mark invite as used
  await supabase
    .from('household_invites')
    .update({ used_at: new Date().toISOString() })
    .eq('id', invite.id)

  return NextResponse.json({ household_id: invite.household_id })
}
