import { Messages } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { useLingUiInit } from 'hooks/useLinguiInit'
import React from 'react'

export type I18nProviderProps = {
  children: React.ReactNode
  i18n: { messages: Messages; locale: string }
}

export const LanguageProvider: React.FC<I18nProviderProps> = ({
  children,
  i18n: _i18n,
}) => {
  const messages = _i18n?.messages ?? []
  const locale = _i18n?.locale ?? 'en'
  const i18n = useLingUiInit(messages, locale)

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
