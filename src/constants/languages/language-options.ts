export type Language = Record<string, Record<string, string>>

// List of languages supported on Juicebox
export const Languages: Language = {
  en: { code: 'en', name: 'english', short: 'EN', long: 'English' },
  zh: { code: 'zh', name: 'chinese', short: '中文', long: '中文' },
  ru: { code: 'ru', name: 'russian', short: 'RU', long: 'Pусский' },
  tr: { code: 'tr', name: 'turkish', short: 'TR', long: 'Türkçe' },
  pt: { code: 'pt', name: 'portuguese', short: 'PT', long: 'Português' },
  es: { code: 'es', name: 'spanish', short: 'ES', long: 'Español' },
  fr: { code: 'fr', name: 'french', short: 'FR', long: 'Français' },
}
