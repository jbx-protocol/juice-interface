import { NATIVE_TOKEN_DECIMALS, getTokenAToBQuote } from 'juice-sdk-core'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import {
  useJBRulesetContext,
  useJBTokenContext,
  useNativeTokenSymbol,
} from 'juice-sdk-react'

import { FixedInt } from 'fpnum'
import { V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { formatUnits } from 'viem'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectSelector } from 'packages/v4/components/ProjectDashboard/redux/hooks'
import { useV4UserNftCredits } from 'packages/v4/contexts/V4UserNftCreditsProvider'

export const useProjectPaymentTokens = (): {
  receivedTickets: string | null
  receivedTokenSymbolText: string
} => {
  const { payAmount, chosenNftRewards, allNftRewards } = useProjectSelector(state => state.projectCart)
  const { ruleset, rulesetMetadata } = useJBRulesetContext()
  const nativeTokenSymbol = useNativeTokenSymbol()
  const tokenA = { symbol: nativeTokenSymbol, decimals: 18 }
  const { token } = useJBTokenContext()
  const { data: nftCreditsData } = useV4UserNftCredits()
  const converter = useCurrencyConverter()
  
  // Calculate effective payment amount after NFT credits (same logic as usePayAmounts)
  const effectivePayAmountWei: number = (() => {
    if (!payAmount) return 0

    const payAmountWei = parseWad(payAmount.amount)
    
    if (!nftCreditsData || !chosenNftRewards.length) {
      return parseFloat(fromWad(payAmountWei))
    }

    // Calculate total value of NFTs in cart
    const cartNftValue = chosenNftRewards.reduce((total, nft) => {
      const tier = allNftRewards.find(reward => reward.id === nft.id)
      const contributionFloor = tier?.contributionFloor ?? 0
      return total + (contributionFloor * nft.quantity)
    }, 0)

    const cartNftValueWei = parseWad(cartNftValue)

    // Only apply credits if there are NFTs in cart with sufficient value
    if (cartNftValueWei.eq(0)) return parseFloat(fromWad(payAmountWei))

    // Credits can only be applied up to the value of NFTs in cart
    const maxApplicableCredits = cartNftValueWei.lt(nftCreditsData) 
      ? cartNftValueWei 
      : nftCreditsData

    // And only up to the total pay amount
    const nftCreditsApplied = payAmountWei.lt(maxApplicableCredits)
      ? payAmountWei
      : maxApplicableCredits

    const totalAfterCredits = payAmountWei.sub(nftCreditsApplied)
    return parseFloat(fromWad(totalAfterCredits))
  })()

  if (payAmount?.currency === V4_CURRENCY_USD) {
    // convert to wei first
    // TODO support usd payments
  }

  const amountBQuote = ruleset.data && rulesetMetadata.data && effectivePayAmountWei > 0
    ? getTokenAToBQuote(
        FixedInt.parse(effectivePayAmountWei.toString(), tokenA.decimals),
        {
          weight: ruleset.data.weight,
          reservedPercent: rulesetMetadata.data.reservedPercent,
        },
      )
    : null

  const receivedTickets: string | null = amountBQuote?.payerTokens
    ? formatUnits(amountBQuote?.payerTokens, token.data?.decimals ?? NATIVE_TOKEN_DECIMALS)
    : null
    
  const receivedTokenSymbolText = tokenSymbolText({
    tokenSymbol: token.data?.symbol,
    capitalize: false,
    plural: receivedTickets !== '1',
  })

  return {
    receivedTickets,
    receivedTokenSymbolText:
      receivedTokenSymbolText === 'tokens'
        ? 'Project Token Credits'
        : `${receivedTokenSymbolText} Token`,
  }
}
