import { Trans } from '@lingui/macro'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { CurrencyContext } from 'contexts/currencyContext'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'
import FormattedNumberInput from '../../inputs/FormattedNumberInput'
import PayInputSubText from './PayInputSubText'
import { PayProjectFormContext } from './payProjectFormContext'

export type PayButtonProps = {
  disabled?: boolean
  wrapperStyle?: CSSProperties
}

export function PayProjectForm({ disabled }: { disabled?: boolean }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    currencyMetadata,
    currencies: { USD, ETH },
  } = useContext(CurrencyContext)
  const { PayButton, form: payProjectForm } = useContext(PayProjectFormContext)
  const {
    payAmount,
    setPayAmount,
    payInCurrency,
    setPayInCurrency,
    error,
    setError,
  } = payProjectForm ?? {}

  const togglePayInCurrency = () => {
    const newPayInCurrency = payInCurrency === ETH ? USD : ETH
    setPayInCurrency?.(newPayInCurrency)
  }

  if (!PayButton) return null

  return (
    <>
      <div style={{ height: '22px' }}>
        {error ? (
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
              setError?.(Number(val) <= 0)
              setPayAmount?.(val ?? '0')
            }}
            value={payAmount}
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
            amount={payAmount}
          />
        </div>

        <PayButton wrapperStyle={{ flex: 1 }} disabled={disabled} />
      </div>
    </>
  )
}
