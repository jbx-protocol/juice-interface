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
  const tokenTextSingular = capitalize ? t`Token` : t`token`
  const tokenTextPlural = capitalize ? t`Tokens` : t`tokens`
  const tokenText = plural ? tokenTextPlural : tokenTextSingular

  if (includeTokenWord) {
    return tokenSymbol ? `${tokenSymbol} ${tokenText}` : tokenText
  }

  return tokenSymbol ?? tokenText
}
