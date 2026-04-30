import type { AIProvider, RecognitionResult, ChatMessage } from './provider'

const MODEL = 'qwen/qwen2.5-vl-7b-instruct'

export class OpenRouterProvider implements AIProvider {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async recognizeImage(imageBase64: string, mimeType: string): Promise<RecognitionResult> {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}` }
            },
            {
              type: 'text',
              text: '画像に写っている物の名前を日本語で答えてください。JSONで {"name": "主な物の名前", "suggestions": ["候補1", "候補2", "候補3"]} の形式で返してください。'
            }
          ]
        }],
        response_format: { type: 'json_object' }
      })
    })

    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`)

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(text)

    return {
      name: parsed.name ?? '',
      suggestions: parsed.suggestions ?? [],
      confidence: 0.85
    }
  }

  async chat(messages: ChatMessage[], context: string): Promise<string> {
    const systemContent = `あなたは家庭の物管理アシスタントです。以下は現在登録されている家の持ち物データです:\n\n${context}\n\nこのデータをもとに、ユーザーの質問に日本語で簡潔に答えてください。`

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemContent },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ]
      })
    })

    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`)
    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? '応答を取得できませんでした。'
  }
}
