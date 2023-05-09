import { plural, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import Loading from 'components/Loading'
import { CurrencyContext } from 'contexts/shared/CurrencyContext'
import { BigNumber, utils } from 'ethers'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import useWeiConverter from 'hooks/useWeiConverter'
import { CurrencyOption } from 'models/currencyOption'
import { lazy, Suspense, useContext, useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { formatIssuanceRate } from 'utils/v2v3/math'
import { PayProjectFormContext } from './payProjectFormContext'
const AMMPrices = lazy(() => import('components/AMMPrices'))

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
  const { reservedRate, weight, tokenSymbol, tokenAddress, weightingFn, form } =
    useContext(PayProjectFormContext)

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
      const nftCount = form?.payMetadata?.tierIdsToMint.length
      const nftText = nftCount
        ? plural(nftCount, {
            one: '+ # NFT',
            other: '+ # NFTs',
          })
        : ''

      return `${receivedTickets} ${tokenReceiveText} ${nftText}`
    }

    const receivedTickets = formatReceivedTickets(
      (payInCurrency === ETH
        ? utils.parseEther('1')
        : converter.usdToWei('1')) ?? BigNumber.from(0),
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
    form?.payMetadata?.tierIdsToMint.length,
    weightingFn,
  ])

  return (
    <div className="mt-2 w-full text-xs text-grey-500 dark:text-grey-300">
      <span>
        <Trans>Receive {receiveText}</Trans>
      </span>
      {tokenSymbol && tokenAddress && (
        <div>
          <Trans>
            or{' '}
            <Tooltip
              title={
                <Suspense fallback={<Loading />}>
                  <AMMPrices
                    mode="buy"
                    tokenSymbol={tokenSymbol}
                    tokenAddress={tokenAddress}
                  />
                </Suspense>
              }
              placement="bottomLeft"
              overlayClassName="min-w-xs"
              overlayInnerStyle={{ padding: '1rem' }}
            >
              <span className="cursor-default border-0 border-b border-dashed border-b-grey-300 pt-2 dark:border-b-slate-200">
                buy {tokenText} on an exchange.
              </span>
            </Tooltip>
          </Trans>
        </div>
      )}
    </div>
  )
}
