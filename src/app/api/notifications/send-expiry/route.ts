import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import webpush from 'web-push'

// POST /api/notifications/send-expiry
// Called by Supabase cron via pg_notify listener or external cron
// Secured with CRON_SECRET header
export async function POST(req: NextRequest) {
  if (!process.env.VAPID_SUBJECT || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID not configured' }, { status: 500 })
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const today = new Date()
  const threeDaysFromNow = new Date(today)
  threeDaysFromNow.setDate(today.getDate() + 3)

  const todayStr = today.toISOString().split('T')[0]
  const thresholdStr = threeDaysFromNow.toISOString().split('T')[0]

  // Find nodes with expiry within 3 days
  const { data: expiringNodes, error } = await supabase
    .from('nodes')
    .select('id, name, household_id, metadata')
    .eq('archived', false)
    .not('metadata->expiry_date', 'is', null)
    .lte('metadata->>expiry_date', thresholdStr)
    .gte('metadata->>expiry_date', todayStr)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!expiringNodes?.length) return NextResponse.json({ sent: 0 })

  // Group by household
  const byHousehold = expiringNodes.reduce<Record<string, typeof expiringNodes>>((acc, node) => {
    acc[node.household_id] = acc[node.household_id] ?? []
    acc[node.household_id].push(node)
    return acc
  }, {})

  let sentCount = 0

  for (const [householdId, nodes] of Object.entries(byHousehold)) {
    // Get all members of this household
    const { data: members } = await supabase
      .from('household_members')
      .select('user_id')
      .eq('household_id', householdId)

    if (!members?.length) continue

    const userIds = members.map(m => m.user_id)

    // Get push subscriptions for those users
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('user_id, subscription')
      .in('user_id', userIds)

    if (!subscriptions?.length) continue

    const payload = JSON.stringify({
      title: '賞味期限のお知らせ',
      body: nodes.map(n => {
        const expiry = n.metadata?.expiry_date
        const daysLeft = expiry
          ? Math.ceil((new Date(expiry).getTime() - today.getTime()) / 86400000)
          : 0
        return `${n.name}（${daysLeft === 0 ? '今日' : `${daysLeft}日後`}期限）`
      }).join('、'),
      icon: '/icon-192.png',
      url: '/app'
    })

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub.subscription as webpush.PushSubscription, payload)
        sentCount++
      } catch {
        // Subscription may have expired — remove it
        await supabase.from('push_subscriptions').delete().eq('user_id', sub.user_id)
      }
    }
  }

  return NextResponse.json({ sent: sentCount, nodes: expiringNodes.length })
}
