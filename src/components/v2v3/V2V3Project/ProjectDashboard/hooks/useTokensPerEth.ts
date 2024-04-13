import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { CurrencyContext } from 'contexts/shared/CurrencyContext'
import { BigNumber } from 'ethers'
import useWeiConverter from 'hooks/useWeiConverter'
import { CurrencyOption } from 'models/currencyOption'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useContext, useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { formatIssuanceRate, weightAmountPermyriad } from 'utils/v2v3/math'

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
      return exchangeRate
        ? formattedNum(formatIssuanceRate(exchangeRate))
        : undefined
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
