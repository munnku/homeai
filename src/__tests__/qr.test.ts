import { generateQRDataUrl } from '@/lib/qr'

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqrdata')
}))

import QRCode from 'qrcode'
const mockToDataURL = QRCode.toDataURL as jest.Mock

const originalEnv = process.env

beforeEach(() => {
  process.env = { ...originalEnv }
  jest.clearAllMocks()
  mockToDataURL.mockResolvedValue('data:image/png;base64,mockqrdata')
})

afterAll(() => {
  process.env = originalEnv
})

describe('generateQRDataUrl', () => {
  it('uses NEXT_PUBLIC_APP_URL when set', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://homeai.example.com'
    await generateQRDataUrl('uuid-123')
    expect(mockToDataURL).toHaveBeenCalledWith(
      'https://homeai.example.com/scan/uuid-123',
      expect.any(Object)
    )
  })

  it('constructs /scan/:uuid path from the uuid argument', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.test'
    await generateQRDataUrl('abc-def-456')
    const [url] = mockToDataURL.mock.calls[0]
    expect(url).toContain('/scan/abc-def-456')
  })

  it('returns the data URL from qrcode library', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.test'
    const result = await generateQRDataUrl('uuid-789')
    expect(result).toBe('data:image/png;base64,mockqrdata')
  })

  it('passes width 200 and correct colors to qrcode', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.test'
    await generateQRDataUrl('uuid-000')
    const [, options] = mockToDataURL.mock.calls[0]
    expect(options.width).toBe(200)
    expect(options.color.dark).toBe('#000000')
    expect(options.color.light).toBe('#ffffff')
  })

  it('falls back to window.location.origin when NEXT_PUBLIC_APP_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    ;(global as any).window = { location: { origin: 'https://fallback.example.com' } }
    await generateQRDataUrl('uuid-fallback')
    expect(mockToDataURL).toHaveBeenCalledWith(
      'https://fallback.example.com/scan/uuid-fallback',
      expect.any(Object)
    )
    delete (global as any).window
  })
})
