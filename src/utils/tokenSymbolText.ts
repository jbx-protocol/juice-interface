import { t } from '@lingui/macro'

// Function to return {tokenSymbol} and/or 'tokens', translated and (possibly) capitalized
export const tokenSymbolText = ({
  tokenSymbol,
  capitalize,
  plural,
  includeTokenWord,
}: {
  tokenSymbol?: string
  capitalize?: boolean
  plural?: boolean
  includeTokenWord?: boolean
}) => {
  const defaultTokenTextSingular = capitalize ? t`Token` : t`token`
  const defaultTokenTextPlural = capitalize ? t`Tokens` : t`tokens`
  const defaultTokenText = plural ? defaultTokenTextPlural : defaultTokenTextSingular

  if (includeTokenWord) {
    return tokenSymbol ? `${tokenSymbol} ${defaultTokenText}` : defaultTokenText
  }

  return tokenSymbol ?? defaultTokenText
}
