import { Messages } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { useLingUiInit } from 'hooks/useLinguiInit'
import React from 'react'

export type I18nProviderProps = {
  children: React.ReactNode
  i18n?: { messages: Messages; locale: string }
}

let i18nSingleton: { messages: Messages; locale: string } | undefined
export const defaultI18n = { messages: {}, locale: 'en' }

export const LanguageProvider: React.FC<I18nProviderProps> = ({
  children,
  i18n: _i18n,
}) => {
  if (_i18n) {
    i18nSingleton = _i18n
  } else {
    _i18n = i18nSingleton || defaultI18n
  }

  if (!_i18n)
    throw new Error(
      'i18n must be provided at least once. This is usually done in _app.tsx',
    )

  const messages = _i18n?.messages ?? []
  const locale = _i18n?.locale ?? 'en'
  const i18n = useLingUiInit(messages, locale)

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
