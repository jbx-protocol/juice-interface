import { t } from '@lingui/macro'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { CurrencyContext } from 'contexts/currencyContext'
import { ThemeContext } from 'contexts/themeContext'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import FormattedNumberInput from '../../inputs/FormattedNumberInput'
import PayInputSubText from './PayInputSubText'
import { PayProjectFormContext } from './payProjectFormContext'

export function PayProjectForm({ disabled }: { disabled?: boolean }) {
  const { userAddress } = useWallet()
  const { data: balance } = useEthBalanceQuery(userAddress)
  const formattedBalance = parseFloat(fromWad(balance))
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

  const togglePayInCurrency = () => {
    const newPayInCurrency = payInCurrency === ETH ? USD : ETH
    setPayInCurrency?.(newPayInCurrency)
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
            onChange={val => {
              setPayAmount?.(val ?? '0')
              if (Number(val) <= 0) {
                setErrorMessage?.(t`Payment amount can't be 0`)
              } else if (Number(val) > formattedBalance) {
                setErrorMessage?.(
                  t`Payment amount can't exceed your wallet balance.`,
                )
              } else {
                setErrorMessage?.('')
              }
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

        <PayButton
          wrapperStyle={{ flex: 1 }}
          disabled={disabled || errorMessage !== ''}
        />
      </div>
    </>
  )
}
