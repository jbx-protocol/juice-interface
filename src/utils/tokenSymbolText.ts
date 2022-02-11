import { t } from '@lingui/macro'

// Function to return {tokenSymbol} and/or 'tokens', translated and (possibly) capitalized
export const tokenSymbolText = (
  tokenSymbol?: string,
  capitalize?: boolean,
  plural?: boolean,
  includeTokenWord?: boolean,
) => {
  // e.g. 'JBX' or 'Token'
  if (!includeTokenWord) {
    if (!plural) {
      return capitalize ? tokenSymbol ?? t`Token` : tokenSymbol ?? t`token`
    } else {
      return capitalize ? tokenSymbol ?? t`Tokens` : tokenSymbol ?? t`tokens`
    }
  }
  // e.g. 'JBX token'
  if (!plural) {
    return capitalize
      ? tokenSymbol
        ? tokenSymbol + ' ' + t`token`
        : t`Token`
      : tokenSymbol
      ? tokenSymbol + ' ' + t`token`
      : t`token`
  }
  //e.g. 'JBX tokens'
  return capitalize
    ? tokenSymbol
      ? tokenSymbol + ' ' + t`tokens`
      : t`Tokens`
    : tokenSymbol
    ? tokenSymbol + ' ' + t`tokens`
    : t`tokens`
}
