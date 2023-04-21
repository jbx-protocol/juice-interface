export const SUPPORTED_LOCALES = ['en', 'zh']
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

type Language = {
  code: keyof typeof SUPPORTED_LANGUAGES
  name: string
  short: string
  long: string
}

export const DEFAULT_LOCALE: SupportedLocale = 'en'

// List of languages supported on Juicebox
export const SUPPORTED_LANGUAGES: Record<SupportedLocale, Language> = {
  en: { code: 'en', name: 'english', short: 'EN', long: 'English' },
  zh: { code: 'zh', name: 'chinese', short: '中文', long: '中文' },
}
