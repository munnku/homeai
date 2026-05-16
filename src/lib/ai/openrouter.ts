import type { AIProvider, RecognitionResult, ChatMessage } from './provider'
import { fetchWithTimeout, assertOk } from './http'

const MODEL = 'qwen/qwen2.5-vl-7b-instruct'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export class OpenRouterProvider implements AIProvider {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private post(body: unknown): Promise<Response> {
    return fetchWithTimeout(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  async recognizeImage(imageBase64: string, mimeType: string): Promise<RecognitionResult> {
    const res = await this.post({
      model: MODEL,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
          { type: 'text', text: '画像に写っている物の名前を日本語で答えてください。JSONで {"name": "主な物の名前", "suggestions": ["候補1", "候補2", "候補3"]} の形式で返してください。' }
        ]
      }],
      response_format: { type: 'json_object' }
    })

    await assertOk(res, 'OpenRouter')

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content ?? '{}'
    try {
      const parsed = JSON.parse(text)
      return {
        name: parsed.name ?? '',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        confidence: 0.85
      }
    } catch {
      return { name: '', suggestions: [], confidence: 0 }
    }
  }

  async chat(messages: ChatMessage[], context: string): Promise<string> {
    const systemContent = `あなたは家庭の物管理アシスタントです。以下は現在登録されている家の持ち物データです:\n\n${context}\n\nこのデータをもとに、ユーザーの質問に日本語で簡潔に答えてください。`

    const res = await this.post({
      model: MODEL,
      messages: [
        { role: 'system', content: systemContent },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ]
    })

    await assertOk(res, 'OpenRouter')
    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? '応答を取得できませんでした。'
  }
}
