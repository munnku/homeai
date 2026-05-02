import { simulateAIResponse } from '@/components/screens/SearchScreen'

describe('simulateAIResponse', () => {
  it('responds to 電池 query', () => {
    const res = simulateAIResponse('電池どこ？')
    expect(res).toContain('電池')
    expect(res).toContain('リビング')
  })

  it('responds to リモコン query', () => {
    const res = simulateAIResponse('リモコンは？')
    expect(res).toContain('リモコン')
    expect(res).toContain('リビング')
  })

  it('responds to 牛乳 query', () => {
    const res = simulateAIResponse('牛乳の場所')
    expect(res).toContain('牛乳')
    expect(res).toContain('冷蔵庫')
  })

  it('responds to ミルク as alias for 牛乳', () => {
    const res = simulateAIResponse('ミルクある？')
    expect(res).toContain('牛乳')
  })

  it('returns fallback message for unrecognized query', () => {
    const res = simulateAIResponse('ドラゴン')
    expect(res).toContain('ドラゴン')
    expect(res).toContain('見つかりませんでした')
  })

  it('returns a string for any input', () => {
    expect(typeof simulateAIResponse('')).toBe('string')
    expect(typeof simulateAIResponse('anything random')).toBe('string')
  })
})
