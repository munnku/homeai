import { expiryStatus, daysUntilExpiry, SAMPLE_DATA } from '@/lib/data'

// Fix "today" so tests are date-independent
const FIXED_TODAY = '2026-05-02'
const origDateNow = Date.now
const origDate = global.Date

beforeAll(() => {
  const fixedMs = new Date(FIXED_TODAY).getTime()
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

describe('daysUntilExpiry', () => {
  it('returns null when dateStr is undefined', () => {
    expect(daysUntilExpiry(undefined)).toBeNull()
  })

  it('returns 0 or negative for same-day expiry', () => {
    const days = daysUntilExpiry(FIXED_TODAY)
    expect(days).toBeLessThanOrEqual(1)
  })

  it('returns 2 for 2 days ahead', () => {
    expect(daysUntilExpiry('2026-05-04')).toBe(2)
  })

  it('returns 7 for 7 days ahead', () => {
    expect(daysUntilExpiry('2026-05-09')).toBe(7)
  })

  it('returns 30 for 30 days ahead', () => {
    expect(daysUntilExpiry('2026-06-01')).toBe(30)
  })
})

describe('expiryStatus', () => {
  it('returns null when dateStr is undefined', () => {
    expect(expiryStatus(undefined)).toBeNull()
  })

  it('returns red when expiry is today (0 days)', () => {
    expect(expiryStatus(FIXED_TODAY)).toBe('red')
  })

  it('returns red when expiry is 2 days away', () => {
    expect(expiryStatus('2026-05-04')).toBe('red')
  })

  it('returns yellow when expiry is 3 days away', () => {
    expect(expiryStatus('2026-05-05')).toBe('yellow')
  })

  it('returns yellow when expiry is 7 days away', () => {
    expect(expiryStatus('2026-05-09')).toBe('yellow')
  })

  it('returns ok when expiry is 8 days away', () => {
    expect(expiryStatus('2026-05-10')).toBe('ok')
  })

  it('returns ok when expiry is far in the future', () => {
    expect(expiryStatus('2027-01-01')).toBe('ok')
  })
})

describe('SAMPLE_DATA structure', () => {
  it('has 6 rooms', () => {
    expect(SAMPLE_DATA.rooms).toHaveLength(6)
  })

  it('all rooms have icon keys (not emojis)', () => {
    const keys = ['living', 'kitchen', 'bedroom', 'bathroom', 'child', 'storage']
    SAMPLE_DATA.rooms.forEach(room => {
      expect(keys).toContain(room.icon)
    })
  })

  it('all rooms have furniture with items', () => {
    SAMPLE_DATA.rooms.forEach(room => {
      expect(room.furniture.length).toBeGreaterThan(0)
      room.furniture.forEach(f => {
        expect(f.items.length).toBeGreaterThan(0)
      })
    })
  })
})
