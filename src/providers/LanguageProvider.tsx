import { i18n } from '@lingui/core'
import {
  detect,
  fromUrl,
  fromStorage,
  fromNavigator,
} from '@lingui/detect-locale'
import { I18nProvider } from '@lingui/react'
import { ReactNode, useEffect } from 'react'
import { en, zh, ru, tr, es, pt, fr } from 'make-plural/plurals'
import defaultLocale from 'locales/en/messages'

import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from 'constants/locale'

// load plural configs
i18n.loadLocaleData({
  en: { plurals: en },
  zh: { plurals: zh },
  ru: { plurals: ru },
  tr: { plurals: tr },
  pt: { plurals: pt },
  es: { plurals: es },
  fr: { plurals: fr },
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

const activateDefaultLocale = () => {
  const { messages } = defaultLocale
  i18n.load(DEFAULT_LOCALE, messages)
  i18n.activate(DEFAULT_LOCALE)
}

const dynamicActivate = async (locale: string) => {
  try {
    const { messages } = await import(`../locales/${locale}/messages`)

    i18n.load(locale, messages)
    i18n.activate(locale)
  } catch (e) {
    console.error(`Error loading locale "${locale}:"`, e)
    // fall back to default locale
    activateDefaultLocale()
  }
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  useEffect(() => {
    const locale = getLocale()
    if (locale === DEFAULT_LOCALE) {
      return activateDefaultLocale()
    }

    dynamicActivate(locale)
  }, [])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
