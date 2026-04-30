import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ qr_uuid: string }>
}

// /scan/[qr_uuid] — resolve QR code to node detail page
export default async function ScanPage({ params }: Props) {
  const { qr_uuid } = await params
  const supabase = await createClient()

  const { data: node } = await supabase
    .from('nodes')
    .select('id')
    .eq('qr_uuid', qr_uuid)
    .single()

  if (!node) redirect('/app?error=qr_not_found')

  redirect(`/app/nodes/${node.id}`)
}
