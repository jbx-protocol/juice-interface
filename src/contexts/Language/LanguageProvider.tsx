import { i18n } from '@lingui/core'
import {
  detect,
  fromNavigator,
  fromStorage,
  fromUrl,
} from '@lingui/detect-locale'
import { I18nProvider } from '@lingui/react'
import defaultLocale from 'locales/en/messages'
import { ReactNode } from 'react'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from 'constants/locale'

const getLocale = (): string => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

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
    const { messages } = await import(`../../locales/${locale}/messages`)

    i18n.load(locale, messages)
    i18n.activate(locale)
  } catch (e) {
    console.error(`Error loading locale "${locale}:"`, e)
    // fall back to default locale
    activateDefaultLocale()
  }
}

const locale = getLocale()
if (locale === DEFAULT_LOCALE) {
  activateDefaultLocale()
} else {
  dynamicActivate(locale)
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
