import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { CurrencyContext } from 'contexts/shared/CurrencyContext'
import { BigNumber, utils } from 'ethers'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import useWeiConverter from 'hooks/useWeiConverter'
import { CurrencyOption } from 'models/currencyOption'
import { useCallback, useContext, useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { formatIssuanceRate, weightAmountPermyriad } from 'utils/v2v3/math'

export function useTokensPerEth(
  currencyAmount: { amount: string; currency: 'eth' | 'usd' } | undefined,
) {
  const amount =
    currencyAmount &&
    currencyAmount.amount.length &&
    !isNaN(+currencyAmount.amount)
      ? currencyAmount.amount
      : undefined
  const currency = currencyAmount
    ? currencyAmount?.currency === 'usd'
      ? V2V3_CURRENCY_USD
      : V2V3_CURRENCY_ETH
    : undefined

  const { currencyMetadata } = useContext(CurrencyContext)
  const { fundingCycle, fundingCycleMetadata, tokenSymbol } =
    useProjectContext()
  const { reservedRate: reservedRateBigNumber } = fundingCycleMetadata ?? {}
  const reservedRate = reservedRateBigNumber?.toNumber()
  const { weight } = fundingCycle ?? {}

  const converter = useCurrencyConverter()

  const weiPayAmt = useWeiConverter<CurrencyOption>({
    currency,
    amount,
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

  const receivedTickets = useMemo(() => {
    if (weiPayAmt.gt(0)) {
      return formatReceivedTickets(weiPayAmt)
    }
    return formatReceivedTickets(
      (currency === V2V3_CURRENCY_ETH
        ? utils.parseEther('1')
        : converter.usdToWei('1')) ?? BigNumber.from(0),
    )
  }, [converter, currency, formatReceivedTickets, weiPayAmt])

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
