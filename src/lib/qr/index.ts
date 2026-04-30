'use client'

import QRCode from 'qrcode'

export async function generateQRDataUrl(qrUuid: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
  const url = `${appUrl}/scan/${qrUuid}`
  return QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
}
