export interface RecognitionResult {
  name: string
  suggestions: string[]
  confidence: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIProvider {
  recognizeImage(imageBase64: string, mimeType: string): Promise<RecognitionResult>
  chat(messages: ChatMessage[], context: string): Promise<string>
}
