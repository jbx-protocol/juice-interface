import { t } from '@lingui/macro'

// Functions to return {tokenSymbol} and/or 'tokens', translated and (possibly) capitalized

export const singleTokenShort = (tokenSymbol?: string, capitalize?: boolean) =>
  capitalize ? tokenSymbol ?? t`Token` : tokenSymbol ?? t`token`

export const pluralTokenShort = (tokenSymbol?: string, capitalize?: boolean) =>
  capitalize ? tokenSymbol ?? t`Tokens` : tokenSymbol ?? t`tokens`

export const singleTokenLong = (tokenSymbol?: string, capitalize?: boolean) =>
  capitalize
    ? tokenSymbol
      ? tokenSymbol + ' ' + t`token`
      : t`Token`
    : tokenSymbol
    ? tokenSymbol + ' ' + t`token`
    : t`token`

export const pluralTokenLong = (tokenSymbol?: string, capitalize?: boolean) =>
  capitalize
    ? tokenSymbol
      ? tokenSymbol + ' ' + t`tokens`
      : t`Tokens`
    : tokenSymbol
    ? tokenSymbol + ' ' + t`tokens`
    : t`tokens`
