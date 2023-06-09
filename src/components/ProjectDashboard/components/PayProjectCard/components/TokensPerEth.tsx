import { Trans } from '@lingui/macro'
import { useTokensPerEth } from '../hooks/useTokensPerEth'

export const TokensPerEth = ({
  currencyAmount,
}: {
  currencyAmount:
    | {
        amount: string
        currency: 'eth' | 'usd'
      }
    | undefined
}) => {
  const { currencyText, receivedTickets, receivedTokenSymbolText } =
    useTokensPerEth(currencyAmount)
  return (
    <Trans>
      Receive {receivedTickets} {receivedTokenSymbolText}/1 {currencyText}
    </Trans>
  )
}
