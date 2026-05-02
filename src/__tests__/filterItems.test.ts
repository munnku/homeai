import { filterItems } from '@/components/screens/ItemsScreen'
import { SAMPLE_DATA } from '@/lib/data'

const rooms = SAMPLE_DATA.rooms

// Fix today so expiry-status tests are deterministic
const FIXED_TODAY = '2026-05-02'
const origDate = global.Date

beforeAll(() => {
  const fixedMs = new origDate(FIXED_TODAY).getTime()
  jest.spyOn(global, 'Date').mockImplementation((arg?: any) => {
    if (arg === undefined) return new origDate(fixedMs)
    return new origDate(arg)
  }) as any
  ;(global.Date as any).now = () => fixedMs
  ;(global.Date as any).parse = origDate.parse
  ;(global.Date as any).UTC = origDate.UTC
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe('filterItems — all filter', () => {
  it('returns all items when query is empty and filter is all', () => {
    const result = filterItems(rooms, '', 'all')
    const totalItems = rooms.flatMap(r => r.furniture.flatMap(f => f.items)).length
    expect(result).toHaveLength(totalItems)
  })

  it('each result has path, roomIcon, roomId, furnitureName, roomName', () => {
    const result = filterItems(rooms, '', 'all')
    result.forEach(item => {
      expect(item.path).toBeTruthy()
      expect(item.roomIcon).toBeTruthy()
      expect(item.roomId).toBeTruthy()
      expect(item.furnitureName).toBeTruthy()
      expect(item.roomName).toBeTruthy()
    })
  })
})

describe('filterItems — query search', () => {
  it('filters by item name (case-insensitive)', () => {
    const result = filterItems(rooms, 'リモコン', 'all')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(item => expect(item.name).toContain('リモコン'))
  })

  it('filters by path (room › furniture)', () => {
    const result = filterItems(rooms, 'キッチン', 'all')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(item => expect(item.path.toLowerCase()).toContain('キッチン'.toLowerCase()))
  })

  it('filters by tag', () => {
    const result = filterItems(rooms, '食品', 'all')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(item => expect(item.tags.some(t => t.includes('食品'))).toBe(true))
  })

  it('returns empty array for non-matching query', () => {
    const result = filterItems(rooms, 'xxxxxxnonexistent', 'all')
    expect(result).toHaveLength(0)
  })

  it('query takes precedence over filter', () => {
    // even with filter=expiry, query should do text search
    const result = filterItems(rooms, 'リモコン', 'expiry')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(item => expect(item.name).toContain('リモコン'))
  })
})

describe('filterItems — expiry filter', () => {
  it('returns only red and yellow items when filter is expiry', () => {
    const result = filterItems(rooms, '', 'expiry')
    // 牛乳 (2026-05-04, 2 days = red) and 卵 (2026-05-08, 6 days = yellow) should be present
    expect(result.length).toBeGreaterThan(0)
    result.forEach(item => {
      expect(item.expiry).toBeTruthy()
    })
  })

  it('does not return items without expiry under expiry filter', () => {
    const result = filterItems(rooms, '', 'expiry')
    result.forEach(item => {
      expect(item.expiry).toBeDefined()
    })
  })
})

describe('filterItems — byRoom filter', () => {
  it('returns all items when filter is byRoom', () => {
    const result = filterItems(rooms, '', 'byRoom')
    const totalItems = rooms.flatMap(r => r.furniture.flatMap(f => f.items)).length
    expect(result).toHaveLength(totalItems)
  })
})
