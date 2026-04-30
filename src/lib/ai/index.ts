import { GeminiProvider } from './gemini'
import { OpenRouterProvider } from './openrouter'
import type { AIProvider } from './provider'

export type { AIProvider, RecognitionResult, ChatMessage } from './provider'

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'gemini'

  if (provider === 'openrouter') {
    const key = process.env.OPENROUTER_API_KEY
    if (!key) throw new Error('OPENROUTER_API_KEY is not set')
    return new OpenRouterProvider(key)
  }

  const key = process.env.GOOGLE_AI_API_KEY
  if (!key) throw new Error('GOOGLE_AI_API_KEY is not set')
  return new GeminiProvider(key)
}
