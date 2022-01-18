import { i18n } from '@lingui/core'
import {
  detect,
  fromUrl,
  fromStorage,
  fromNavigator,
} from '@lingui/detect-locale'
import { I18nProvider } from '@lingui/react'
import { ReactNode, useEffect } from 'react'
import { en, zh, ru, tr, es } from 'make-plural/plurals'

import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from 'constants/locale'

// load plural configs
i18n.loadLocaleData({
  en: { plurals: en },
  zh: { plurals: zh },
  ru: { plurals: ru },
  tr: { plurals: tr },
  // pt: { plurals: pt },
  es: { plurals: es },
})

const getLocale = (): string => {
  let locale =
    detect(fromUrl('lang'), fromStorage('lang'), fromNavigator()) ??
    DEFAULT_LOCALE

  if (!SUPPORTED_LOCALES.includes(locale)) {
    locale = DEFAULT_LOCALE
  }

  return locale
}

async function dynamicActivate(locale: string) {
  const { messages } = await import(`../locales/${locale}/messages`)
  i18n.load(locale, messages)
  i18n.activate(locale)
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  useEffect(() => {
    dynamicActivate(getLocale())
  }, [])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
