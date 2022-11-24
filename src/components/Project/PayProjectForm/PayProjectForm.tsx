import InputAccessoryButton from 'components/InputAccessoryButton'
import { CurrencyContext } from 'contexts/currencyContext'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

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
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)
  const { PayButton, form: payProjectForm } = useContext(PayProjectFormContext)
  const {
    payAmount,
    setPayAmount,
    setPayMetadata,
    payInCurrency,
    setPayInCurrency,
    errorMessage,
    validatePayAmount,
  } = payProjectForm ?? {}

  const togglePayInCurrency = () => {
    const newPayInCurrency = payInCurrency === ETH ? USD : ETH
    setPayInCurrency?.(newPayInCurrency)
  }

  const onPayAmountChange = (value?: string): void => {
    const newPayAmount = value ?? '0'
    setPayAmount?.(newPayAmount)
    validatePayAmount?.(newPayAmount)

    // TODO block pay input / notify user if NFTs still loading?
    if (!rewardTiers) return

    // Get ID of the most expensive reward tier that can be afforded by the current pay amount
    const highestAffordableTierId = rewardTiers
      .filter(tier => tier.contributionFloor <= parseFloat(newPayAmount))
      .sort((a, b) =>
        a.contributionFloor > b.contributionFloor ? -1 : 1,
      )[0]?.id

    const tierIdsToMint =
      highestAffordableTierId !== undefined ? [highestAffordableTierId] : []

    setPayMetadata?.({
      tierIdsToMint,
    })
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
