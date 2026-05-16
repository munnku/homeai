import type { AIProvider, RecognitionResult, ChatMessage } from './provider'
import { fetchWithTimeout, assertOk } from './http'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export class GeminiProvider implements AIProvider {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async recognizeImage(imageBase64: string, mimeType: string): Promise<RecognitionResult> {
    const res = await fetchWithTimeout(`${GEMINI_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
            { text: '画像に写っている物の名前を日本語で答えてください。JSONで {"name": "主な物の名前", "suggestions": ["候補1", "候補2", "候補3"]} の形式で返してください。物が複数あれば最も目立つものを選んでください。' }
          ]
        }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    })

    await assertOk(res, 'Gemini')

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    try {
      const parsed = JSON.parse(text)
      return {
        name: parsed.name ?? '',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        confidence: 0.9
      }
    } catch {
      return { name: '', suggestions: [], confidence: 0 }
    }
  }

  async chat(messages: ChatMessage[], context: string): Promise<string> {
    const systemPrompt = `あなたは家庭の物管理アシスタントです。以下は現在登録されている家の持ち物データです:\n\n${context}\n\nこのデータをもとに、ユーザーの質問に日本語で簡潔に答えてください。`

    // Gemini v1beta has no system role; inject as priming user/model turn
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'わかりました。お手伝いします。' }] },
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    ]

    const res = await fetchWithTimeout(`${GEMINI_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    })
    await assertOk(res, 'Gemini')
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '応答を取得できませんでした。'
  }
}
