import { useContext, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { CurrencyContext } from 'contexts/currencyContext'

import { CurrencyOption } from 'models/currencyOption'

import { WeightFunction } from 'utils/math'

import { ThemeContext } from 'contexts/themeContext'

import { Trans } from '@lingui/macro'

import PayInputSubText from './PayInputSubText'

export type PayButtonProps = {
  payAmount: string
  payInCurrency: CurrencyOption
  onError?: (error?: Error) => void
  disabled?: boolean
}

export default function PayInputGroup({
  PayButton,
  reservedRate,
  weight,
  tokenSymbol,
  tokenAddress,
  weightingFn,
  disabled,
}: {
  PayButton: (props: PayButtonProps) => JSX.Element | null
  reservedRate: number | undefined
  weight: BigNumber | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  weightingFn: WeightFunction
  disabled?: boolean
}) {
  const {
    currencyMetadata,
    currencies: { USD, ETH },
  } = useContext(CurrencyContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<CurrencyOption>(ETH)
  const [isErrorField, setIsErrorField] = useState<boolean>(false)

  const togglePayInCurrency = () => {
    const newPayInCurrency = payInCurrency === ETH ? USD : ETH
    setPayInCurrency(newPayInCurrency)
  }

  return (
    <>
      {isErrorField && (
        <span style={{ color: colors.text.failure, fontSize: '0.7rem' }}>
          <Trans>Pay amount must be greater than 0.</Trans>
        </span>
      )}
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ flex: 3, minWidth: '50%' }}>
          <FormattedNumberInput
            placeholder="0"
            onChange={val => {
              setIsErrorField(Number(val) <= 0)
              setPayAmount(val ?? '0')
            }}
            value={payAmount}
            min={0}
            accessory={
              <InputAccessoryButton
                withArrow={true}
                content={currencyMetadata[payInCurrency ?? ETH].name}
                onClick={togglePayInCurrency}
              />
            }
          />
          <PayInputSubText
            payInCurrency={payInCurrency ?? ETH}
            amount={payAmount}
            reservedRate={reservedRate}
            weight={weight}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            weightingFn={weightingFn}
          />
        </div>

        <PayButton
          payAmount={payAmount}
          payInCurrency={payInCurrency}
          onError={() => setIsErrorField(true)}
          disabled={disabled}
        />
      </div>
    </>
  )
}
