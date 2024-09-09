import { FixedInt } from 'fpnum'
import { getTokenAToBQuote, NATIVE_TOKEN_DECIMALS } from 'juice-sdk-core'
import {
  useJBRulesetContext,
  useJBTokenContext,
  useNativeTokenSymbol,
} from 'juice-sdk-react'
import { useProjectSelector } from 'packages/v4/components/ProjectDashboard/redux/hooks'
import { V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { formatUnits } from 'viem'

export const useProjectPaymentTokens = () => {
  const payAmount = useProjectSelector(state => state.projectCart.payAmount)
  const { ruleset, rulesetMetadata } = useJBRulesetContext()
  const nativeTokenSymbol = useNativeTokenSymbol()
  const tokenA = { symbol: nativeTokenSymbol, decimals: 18 }
  const { token } = useJBTokenContext()

  let payAmountWei = payAmount?.amount
  if (payAmount?.currency === V4_CURRENCY_USD) {
    // convert to wei first
    // TODO support usd payments
  }

  const amountBQuote =
    ruleset.data && rulesetMetadata.data && payAmountWei
      ? getTokenAToBQuote(
          FixedInt.parse(payAmountWei.toString(), tokenA.decimals),
          {
            weight: ruleset.data.weight,
            reservedPercent: rulesetMetadata.data.reservedPercent,
          },
        )
      : null

  const receivedTickets =
    amountBQuote?.payerTokens
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
        ? 'Project'
        : receivedTokenSymbolText,
  }
}
