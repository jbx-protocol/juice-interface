import { CurrencyContext } from 'contexts/CurrencyContext'
import { BigNumber, utils } from 'ethers'
import useWeiConverter from 'hooks/useWeiConverter'
import { CurrencyOption } from 'models/currencyOption'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'packages/v2v3/utils/currency'
import { weightAmountPermyriad } from 'packages/v2v3/utils/math'
import { useCallback, useContext, useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useTokensPerEth(
  currencyAmount: { amount: number; currency: V2V3CurrencyOption } | undefined,
) {
  const amount = useMemo(
    () =>
      currencyAmount && currencyAmount.amount && !isNaN(currencyAmount.amount)
        ? currencyAmount.amount
        : undefined,
    [currencyAmount],
  )
  const currency = useMemo(
    () =>
      currencyAmount
        ? currencyAmount?.currency === V2V3_CURRENCY_USD
          ? V2V3_CURRENCY_USD
          : V2V3_CURRENCY_ETH
        : undefined,
    [currencyAmount],
  )

  const { currencyMetadata } = useContext(CurrencyContext)
  const { fundingCycle, fundingCycleMetadata, tokenSymbol } =
    useProjectContext()
  const { reservedRate: reservedRateBigNumber } = fundingCycleMetadata ?? {}
  const reservedRate = reservedRateBigNumber?.toNumber()
  const { weight } = fundingCycle ?? {}

  const weiPayAmt = useWeiConverter<CurrencyOption>({
    currency,
    amount: amount?.toString(),
  })

  const formatReceivedTickets = useCallback(
    (wei: BigNumber): string | undefined => {
      const exchangeRate = weightAmountPermyriad(
        weight,
        reservedRate,
        wei,
        'payer',
      )
      const rate = BigNumber.from(exchangeRate)
      return formattedNum(utils.formatUnits(rate, 18))
    },
    [weight, reservedRate],
  )

  const receivedTickets = useMemo(
    () => formatReceivedTickets(weiPayAmt),
    [formatReceivedTickets, weiPayAmt],
  )

  const receivedTokenSymbolText = useMemo(
    () =>
      tokenSymbolText({
        tokenSymbol,
        capitalize: false,
        plural: receivedTickets !== '1',
      }),
    [tokenSymbol, receivedTickets],
  )

  const currencyText = useMemo(
    () =>
      currencyMetadata[
        currency === V2V3_CURRENCY_USD ? V2V3_CURRENCY_USD : V2V3_CURRENCY_ETH
      ]?.name,
    [currency, currencyMetadata],
  )

  return {
    receivedTickets,
    receivedTokenSymbolText,
    currencyText,
  }
}
