import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import AMMPrices from 'components/AMMPrices'
import { CurrencyContext } from 'contexts/currencyContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useWeiConverter from 'hooks/WeiConverter'
import { CurrencyOption } from 'models/currencyOption'
import { useContext, useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { formatIssuanceRate } from 'utils/v2v3/math'
import { PayProjectFormContext } from './payProjectFormContext'

/**
 * Help text shown below the Pay input field.
 *
 * If the user has entered an amount, display
 * the amount of project tokens they will receive.
 *
 * Else, display the exchange rate of the user selected currency to project token.
 */
export default function PayInputSubText({
  payInCurrency,
  amount,
}: {
  payInCurrency: CurrencyOption
  amount: string | undefined
}) {
  const {
    currencyMetadata,
    currencies: { ETH },
  } = useContext(CurrencyContext)
  const {
    reservedRate,
    weight,
    tokenSymbol,
    tokenAddress,
    weightingFn,
    isEligibleForNft,
  } = useContext(PayProjectFormContext)

  const converter = useCurrencyConverter()
  const weiPayAmt = useWeiConverter<CurrencyOption>({
    currency: payInCurrency,
    amount: amount,
  })

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const receiveText = useMemo(() => {
    const formatReceivedTickets = (wei: BigNumber): string | undefined => {
      const exchangeRate = weightingFn?.(weight, reservedRate, wei, 'payer')
      return exchangeRate
        ? formattedNum(formatIssuanceRate(exchangeRate))
        : undefined
    }

    if (weiPayAmt?.gt(0)) {
      const receivedTickets = formatReceivedTickets(weiPayAmt)
      const tokenReceiveText = tokenSymbolText({
        tokenSymbol,
        capitalize: false,
        plural: receivedTickets !== '1',
      })

      return `${receivedTickets} ${tokenReceiveText} ${
        isEligibleForNft ? '+ NFT' : ''
      }`
    }

    const receivedTickets = formatReceivedTickets(
      (payInCurrency === ETH ? parseEther('1') : converter.usdToWei('1')) ??
        BigNumber.from(0),
    )

    const tokenReceiveText = tokenSymbolText({
      tokenSymbol,
      capitalize: false,
      plural: receivedTickets !== '1',
    })

    return `${receivedTickets} ${tokenReceiveText}/1 ${currencyMetadata[payInCurrency]?.name}`
  }, [
    converter,
    payInCurrency,
    weiPayAmt,
    weight,
    currencyMetadata,
    ETH,
    reservedRate,
    tokenSymbol,
    isEligibleForNft,
    weightingFn,
  ])

  return (
    <div className="mt-1 w-full text-xs text-grey-500 dark:text-grey-300">
      <span>
        <Trans>Receive {receiveText}</Trans>
      </span>
      {tokenSymbol && tokenAddress && (
        <div>
          <Trans>
            or{' '}
            <Tooltip
              title={
                <AMMPrices
                  mode="buy"
                  tokenSymbol={tokenSymbol}
                  tokenAddress={tokenAddress}
                />
              }
              placement="bottomLeft"
              overlayClassName="min-w-[300px]"
              overlayInnerStyle={{ padding: '1rem' }}
            >
              <span className="cursor-default border border-t-0 border-l-0 border-r-0 border-b border-solid border-b-grey-300 pt-2 pb-4 dark:border-b-slate-200">
                buy {tokenText} on exchange.
              </span>
            </Tooltip>
          </Trans>
        </div>
      )}
    </div>
  )
}
