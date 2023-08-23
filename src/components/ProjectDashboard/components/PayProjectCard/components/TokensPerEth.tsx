import { Trans } from '@lingui/macro'
import { useTokensPerEth } from 'components/ProjectDashboard/hooks/useTokensPerEth'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'

export const TokensPerEth = ({
  currencyAmount,
}: {
  currencyAmount:
    | {
        amount: number
        currency: V2V3CurrencyOption
      }
    | undefined
}) => {
  const { currencyText, receivedTickets, receivedTokenSymbolText } =
    useTokensPerEth(currencyAmount)

  const suffix = !currencyAmount ? `/1 ${currencyText}` : ''
  return (
    <Trans>
      Receive {receivedTickets} {receivedTokenSymbolText}
      {suffix}
    </Trans>
  )
}
