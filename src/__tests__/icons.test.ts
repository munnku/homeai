import { getRoomIcon } from '@/components/ui/Icons'

describe('getRoomIcon', () => {
  it('returns a function for each valid key', () => {
    const keys = ['living', 'kitchen', 'bedroom', 'bathroom', 'child', 'storage']
    keys.forEach(key => {
      const Icon = getRoomIcon(key)
      expect(typeof Icon).toBe('function')
    })
  })

  it('returns a fallback (IconStorage) for unknown keys', () => {
    const IconUnknown = getRoomIcon('unknown-room')
    const IconStorage = getRoomIcon('storage')
    expect(IconUnknown).toBe(IconStorage)
  })

  it('returns different functions for different keys', () => {
    const living = getRoomIcon('living')
    const kitchen = getRoomIcon('kitchen')
    expect(living).not.toBe(kitchen)
  })
})
