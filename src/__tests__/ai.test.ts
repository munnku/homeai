import { GeminiProvider } from '@/lib/ai/gemini'
import { OpenRouterProvider } from '@/lib/ai/openrouter'

const mockFetch = jest.fn()
global.fetch = mockFetch

afterEach(() => jest.clearAllMocks())

describe('GeminiProvider.recognizeImage', () => {
  it('returns parsed name and suggestions', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{
          content: { parts: [{ text: '{"name":"はさみ","suggestions":["はさみ","カッター","ナイフ"]}' }] }
        }]
      })
    })

    const provider = new GeminiProvider('test-key')
    const result = await provider.recognizeImage('base64data', 'image/jpeg')

    expect(result.name).toBe('はさみ')
    expect(result.suggestions).toHaveLength(3)
    expect(result.confidence).toBeGreaterThan(0)
  })

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429 })
    const provider = new GeminiProvider('test-key')
    await expect(provider.recognizeImage('base64', 'image/jpeg')).rejects.toThrow('Gemini API error: 429')
  })
})

describe('OpenRouterProvider.recognizeImage', () => {
  it('returns parsed result', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: { content: '{"name":"リモコン","suggestions":["リモコン","コントローラー"]}' }
        }]
      })
    })

    const provider = new OpenRouterProvider('test-key')
    const result = await provider.recognizeImage('base64', 'image/jpeg')

    expect(result.name).toBe('リモコン')
    expect(result.suggestions).toContain('コントローラー')
  })
})

describe('GeminiProvider.chat', () => {
  it('returns assistant reply', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{
          content: { parts: [{ text: 'はさみはリビングのテレビ棚2段目にあります。' }] }
        }]
      })
    })

    const provider = new GeminiProvider('test-key')
    const reply = await provider.chat(
      [{ role: 'user', content: 'はさみはどこ？' }],
      '- リビング > テレビ棚 > 2段目 > はさみ'
    )

    expect(reply).toContain('はさみ')
  })
})
