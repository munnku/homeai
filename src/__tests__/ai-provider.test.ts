import { getAIProvider } from '@/lib/ai'

describe('getAIProvider', () => {
  const original = process.env

  beforeEach(() => {
    process.env = { ...original }
  })

  afterAll(() => {
    process.env = original
  })

  it('returns GeminiProvider when AI_PROVIDER=gemini', () => {
    process.env.AI_PROVIDER = 'gemini'
    process.env.GOOGLE_AI_API_KEY = 'test'
    const provider = getAIProvider()
    expect(provider.constructor.name).toBe('GeminiProvider')
  })

  it('returns OpenRouterProvider when AI_PROVIDER=openrouter', () => {
    process.env.AI_PROVIDER = 'openrouter'
    process.env.OPENROUTER_API_KEY = 'test'
    const provider = getAIProvider()
    expect(provider.constructor.name).toBe('OpenRouterProvider')
  })

  it('throws when Gemini key is missing', () => {
    process.env.AI_PROVIDER = 'gemini'
    delete process.env.GOOGLE_AI_API_KEY
    expect(() => getAIProvider()).toThrow('GOOGLE_AI_API_KEY is not set')
  })

  it('throws when OpenRouter key is missing', () => {
    process.env.AI_PROVIDER = 'openrouter'
    delete process.env.OPENROUTER_API_KEY
    expect(() => getAIProvider()).toThrow('OPENROUTER_API_KEY is not set')
  })
})
