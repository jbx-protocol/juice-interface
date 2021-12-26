export type Language = Record<string, Record<string, string>>

// List of languages supported on Juicebox
export const Languages: Language = {
  en: { value: 'en', name: 'english', short: 'EN', long: 'English' },
  zh: { value: 'zh', name: 'chinese', short: '中文', long: '中文' },
  ru: { value: 'ru', name: 'russian', short: 'RUS', long: 'Pусский' },
  es: { value: 'es', name: 'spanish', short: 'ESP', long: 'Español' },
  tr: { value: 'tr', name: 'turkish', short: 'TUR', long: 'Türkçe' },
}
