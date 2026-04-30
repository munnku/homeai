import { ja } from './ja'

export const locales = { ja } as const
export type Locale = keyof typeof locales

export function t(locale: Locale = 'ja') {
  return locales[locale]
}

export { ja }
