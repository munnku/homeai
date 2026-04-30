import { t, ja } from '@/lib/i18n'

describe('i18n', () => {
  it('returns Japanese translations by default', () => {
    const translations = t('ja')
    expect(translations.app.name).toBe('HomeAI')
    expect(translations.node.types.room).toBe('部屋')
  })

  it('has all node types translated', () => {
    const types = ja.node.types
    expect(Object.keys(types)).toEqual(['room', 'furniture', 'container', 'item'])
    Object.values(types).forEach(v => expect(typeof v).toBe('string'))
  })

  it('has all history actions covered in node actions', () => {
    const actions = ja.node.actions
    expect(actions.add).toBeTruthy()
    expect(actions.move).toBeTruthy()
    expect(actions.dispose).toBeTruthy()
  })
})
