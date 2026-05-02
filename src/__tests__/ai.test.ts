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

  it('defaults name to empty string when JSON is missing name field', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"suggestions":["候補1"]}' }] } }]
      })
    })
    const provider = new GeminiProvider('test-key')
    const result = await provider.recognizeImage('base64', 'image/jpeg')
    expect(result.name).toBe('')
    expect(result.suggestions).toEqual(['候補1'])
  })

  it('defaults suggestions to empty array when JSON is missing suggestions field', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"name":"本棚"}' }] } }]
      })
    })
    const provider = new GeminiProvider('test-key')
    const result = await provider.recognizeImage('base64', 'image/jpeg')
    expect(result.name).toBe('本棚')
    expect(result.suggestions).toEqual([])
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

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    const provider = new GeminiProvider('test-key')
    await expect(
      provider.chat([{ role: 'user', content: 'どこ？' }], 'context')
    ).rejects.toThrow('Gemini API error: 500')
  })

  it('returns fallback text when candidates is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [] })
    })
    const provider = new GeminiProvider('test-key')
    const reply = await provider.chat([{ role: 'user', content: 'test' }], '')
    expect(reply).toBe('応答を取得できませんでした。')
  })

  it('maps assistant role to model role in request body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'ok' }] } }]
      })
    })
    const provider = new GeminiProvider('test-key')
    await provider.chat(
      [
        { role: 'user', content: 'question' },
        { role: 'assistant', content: 'answer' }
      ],
      'ctx'
    )
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    const lastTwo = body.contents.slice(-2)
    expect(lastTwo[0].role).toBe('user')
    expect(lastTwo[1].role).toBe('model')
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

  it('returns confidence of 0.85', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"name":"テレビ","suggestions":[]}' } }]
      })
    })
    const provider = new OpenRouterProvider('test-key')
    const result = await provider.recognizeImage('base64', 'image/jpeg')
    expect(result.confidence).toBe(0.85)
  })

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })
    const provider = new OpenRouterProvider('test-key')
    await expect(provider.recognizeImage('base64', 'image/jpeg')).rejects.toThrow('OpenRouter API error: 401')
  })

  it('sends image as data URL in request body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"name":"テスト","suggestions":[]}' } }]
      })
    })
    const provider = new OpenRouterProvider('test-key')
    await provider.recognizeImage('abc123', 'image/png')
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    const imageContent = body.messages[0].content[0]
    expect(imageContent.image_url.url).toBe('data:image/png;base64,abc123')
  })
})

describe('OpenRouterProvider.chat', () => {
  it('returns assistant reply', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'テレビはリビングの棚にあります。' } }]
      })
    })
    const provider = new OpenRouterProvider('test-key')
    const reply = await provider.chat(
      [{ role: 'user', content: 'テレビはどこ？' }],
      '- リビング > 棚 > テレビ'
    )
    expect(reply).toContain('テレビ')
  })

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 503 })
    const provider = new OpenRouterProvider('test-key')
    await expect(
      provider.chat([{ role: 'user', content: 'test' }], 'ctx')
    ).rejects.toThrow('OpenRouter API error: 503')
  })

  it('returns fallback text when choices is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [] })
    })
    const provider = new OpenRouterProvider('test-key')
    const reply = await provider.chat([{ role: 'user', content: 'test' }], '')
    expect(reply).toBe('応答を取得できませんでした。')
  })

  it('sends Authorization header with bearer token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] })
    })
    const provider = new OpenRouterProvider('my-secret-key')
    await provider.chat([{ role: 'user', content: 'hi' }], '')
    const headers = mockFetch.mock.calls[0][1].headers
    expect(headers['Authorization']).toBe('Bearer my-secret-key')
  })
})
