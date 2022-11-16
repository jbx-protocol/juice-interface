import { t } from '@lingui/macro'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { CurrencyContext } from 'contexts/currencyContext'
import { ThemeContext } from 'contexts/themeContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import FormattedNumberInput from '../../inputs/FormattedNumberInput'
import PayInputSubText from './PayInputSubText'
import { PayProjectFormContext } from './payProjectFormContext'

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
    errorMessage,
    setErrorMessage,
  } = payProjectForm ?? {}

  const { userAddress } = useWallet()
  const converter = useCurrencyConverter()
  const { data: userBalanceWei } = useEthBalanceQuery(userAddress)

  const userBalanceUsd = converter.wadToCurrency(userBalanceWei, 'USD', 'ETH')

  const togglePayInCurrency = () => {
    const newPayInCurrency = payInCurrency === ETH ? USD : ETH
    setPayInCurrency?.(newPayInCurrency)
  }

  /**
   * Validate a given pay amount, and set the error message if invalid.
   */
  const validatePayAmount = (newPayAmount: string): void => {
    const payAmountWei = parseWad(newPayAmount)
    const balanceToCompare =
      payInCurrency === ETH ? userBalanceWei : userBalanceUsd

    if (payAmountWei.lte(0)) {
      return setErrorMessage?.(t`Payment amount can't be 0`)
    }

    if (balanceToCompare?.lte(payAmountWei)) {
      return setErrorMessage?.(
        t`Payment amount can't exceed your wallet balance.`,
      )
    }

    // clear previous error message if no new error was encountered.
    setErrorMessage?.('')
  }

  const onPayAmountChange = (value?: string): void => {
    const newPayAmount = value ?? '0'
    setPayAmount?.(newPayAmount)
    validatePayAmount(newPayAmount)
  }

  if (!PayButton) return null

  return (
    <>
      {errorMessage && (
        <div style={{ height: '22px' }}>
          <span style={{ color: colors.text.failure, fontSize: '0.75rem' }}>
            {errorMessage}
          </span>
        </div>
      )}
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
            onChange={onPayAmountChange}
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

        <PayButton
          wrapperStyle={{ flex: 1, maxWidth: '100%' }}
          disabled={disabled || errorMessage !== ''}
        />
      </div>
    </>
  )
}
