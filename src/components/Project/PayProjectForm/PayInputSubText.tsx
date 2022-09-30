import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useContext, useMemo } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { CurrencyContext } from 'contexts/currencyContext'

import { Tooltip } from 'antd'
import AMMPrices from 'components/AMMPrices'
import { ThemeContext } from 'contexts/themeContext'

import useWeiConverter from 'hooks/WeiConverter'
import { CurrencyOption } from 'models/currencyOption'
import { formattedNum } from 'utils/format/formatNumber'
import { formatIssuanceRate } from 'utils/v2v3/math'
import { PayProjectFormContext } from './PayProjectFormContext'

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
    theme: { colors },
  } = useContext(ThemeContext)
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
    <div
      style={{
        marginTop: '0.3rem',
        fontSize: '.65rem',
        width: '100%',
        color: colors.text.secondary,
      }}
    >
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
              overlayStyle={{ minWidth: '300px' }}
              overlayInnerStyle={{ padding: '1rem' }}
            >
              <span
                style={{
                  cursor: 'default',
                  paddingTop: '0.5rem',
                  paddingBottom: '1px',
                  borderBottom: '1px dashed' + colors.stroke.secondary,
                }}
              >
                buy {tokenText} on exchange.
              </span>
            </Tooltip>
          </Trans>
        </div>
      )}
    </div>
  )
}
