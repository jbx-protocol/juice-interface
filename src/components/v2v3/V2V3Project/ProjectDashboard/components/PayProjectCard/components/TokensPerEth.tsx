import { Trans } from '@lingui/macro'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useTokensPerEth } from '../../../hooks/useTokensPerEth'

export const TokensPerEth = ({
  currencyAmount,
}: {
  currencyAmount:
    | {
        amount: number // NOTE this is actually a `string | undefined` from what I can tell. Too scared to change it atm.
        currency: V2V3CurrencyOption
      }
    | undefined
}) => {
  const { currencyText, receivedTickets, receivedTokenSymbolText } =
    useTokensPerEth({
      amount: parseFloat(currencyAmount?.amount?.toString() || '1'),
      currency: currencyAmount?.currency || V2V3_CURRENCY_ETH,
    })

  const suffix =
    !currencyAmount || !currencyAmount.amount ? (
      <Trans>per {currencyText} paid</Trans>
    ) : (
      ''
    )
  return (
    <Trans>
      Receive {receivedTickets} {receivedTokenSymbolText} {suffix}
    </Trans>
  )
}
