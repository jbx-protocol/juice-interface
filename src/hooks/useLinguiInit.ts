// https://github.com/lingui/js-lingui/pull/1541

import { i18n, Messages } from '@lingui/core'
import { useEffect } from 'react'

export const useLingUiInit = (messages: Messages, locale: string) => {
  const isClient = typeof window !== 'undefined'

  if (!isClient && locale !== i18n.locale) {
    // there is single instance of i18n on the server
    i18n.loadAndActivate({ locale, messages })
  }
  if (isClient && i18n.locale === undefined) {
    // first client render
    i18n.loadAndActivate({ locale, messages })
  }

  useEffect(() => {
    const localeDidChange = locale !== i18n.locale
    if (localeDidChange) {
      i18n.loadAndActivate({ locale, messages })
    }
  }, [locale, messages])

  return i18n
}
