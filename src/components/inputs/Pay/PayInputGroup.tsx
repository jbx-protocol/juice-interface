import { CSSProperties, useContext, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { CurrencyContext } from 'contexts/currencyContext'

import { CurrencyOption } from 'models/currencyOption'

import { WeightFunction } from 'utils/math'

import { ThemeContext } from 'contexts/themeContext'

import { Trans } from '@lingui/macro'

import PayInputSubText from './PayInputSubText'

export type PayButtonProps = {
  payAmount: string
  payInCurrency: CurrencyOption
  onError: (error?: Error) => void
  disabled?: boolean
  wrapperStyle?: CSSProperties
}

export default function PayInputGroup({
  payAmountETH,
  payInCurrency,
  onPayAmountChange,
  onPayInCurrencyChange,
  PayButton,
  reservedRate,
  weight,
  tokenSymbol,
  tokenAddress,
  weightingFn,
  disabled,
}: {
  payAmountETH: string
  payInCurrency: CurrencyOption
  onPayAmountChange: (payAmount: string) => void
  onPayInCurrencyChange: (currency: CurrencyOption) => void
  PayButton: (props: PayButtonProps) => JSX.Element | null
  reservedRate: number | undefined
  weight: BigNumber | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  weightingFn: WeightFunction
  disabled?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const {
    currencyMetadata,
    currencies: { USD, ETH },
  } = useContext(CurrencyContext)

  const [isErrorField, setIsErrorField] = useState<boolean>(false)

  const togglePayInCurrency = () => {
    const newPayInCurrency = payInCurrency === ETH ? USD : ETH
    onPayInCurrencyChange(newPayInCurrency)
  }

  return (
    <>
      <div style={{ height: '22px' }}>
        {isErrorField ? (
          <span style={{ color: colors.text.failure, fontSize: '0.7rem' }}>
            <Trans>Pay amount must be greater than 0.</Trans>
          </span>
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ flex: 2, minWidth: '50%' }}>
          <FormattedNumberInput
            placeholder="0"
            onChange={val => {
              setIsErrorField(Number(val) <= 0)
              onPayAmountChange(val ?? '0')
            }}
            value={payAmountETH}
            min={0}
            disabled={disabled}
            accessory={
              <InputAccessoryButton
                withArrow
                content={currencyMetadata[payInCurrency ?? ETH].name}
                onClick={togglePayInCurrency}
                disabled={disabled}
              />
            }
          />
          <PayInputSubText
            payInCurrency={payInCurrency ?? ETH}
            amount={payAmountETH}
            reservedRate={reservedRate}
            weight={weight}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            weightingFn={weightingFn}
          />
        </div>

        <PayButton
          wrapperStyle={{ flex: 1 }}
          payAmount={payAmountETH}
          payInCurrency={payInCurrency}
          onError={() => setIsErrorField(true)}
          disabled={disabled}
        />
      </div>
    </>
  )
}
