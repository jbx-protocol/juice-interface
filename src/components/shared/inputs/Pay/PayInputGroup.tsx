import { useContext, useState } from 'react'
import { BigNumber } from 'ethers'

import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { CurrencyContext } from 'contexts/currencyContext'

import PayInputSubText from './PayInputSubText'

export type PayButtonProps = {
  payAmount: string
  payInCurrency: number
}

export default function PayInputGroup({
  PayButton,
  reservedRate,
  weight,
  tokenSymbol,
  tokenAddress,
}: {
  PayButton: (props: PayButtonProps) => JSX.Element | null
  reservedRate?: number
  weight?: BigNumber
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
}) {
  const {
    currencyMetadata,
    currencies: { currencyUSD, currencyETH },
  } = useContext(CurrencyContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<number>(currencyETH)

  const togglePayInCurrency = () => {
    const newPayInCurrency =
      payInCurrency === currencyETH ? currencyUSD : currencyETH
    setPayInCurrency(newPayInCurrency)
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <div style={{ flex: 1, marginRight: 10 }}>
        <FormattedNumberInput
          placeholder="0"
          onChange={val => {
            setPayAmount(val ?? '0')
          }}
          value={payAmount}
          min={0}
          accessory={
            <InputAccessoryButton
              withArrow={true}
              content={currencyMetadata[payInCurrency ?? currencyETH].name}
              onClick={togglePayInCurrency}
            />
          }
        />
        <PayInputSubText
          payInCurrency={payInCurrency ?? currencyETH}
          amount={payAmount}
          reservedRate={reservedRate}
          weight={weight}
          tokenSymbol={tokenSymbol}
          tokenAddress={tokenAddress}
        />
      </div>

      <div style={{ textAlign: 'center', minWidth: 150 }}>
        <PayButton payAmount={payAmount} payInCurrency={payInCurrency} />
      </div>
    </div>
  )
}
