import InputAccessoryButton from 'components/InputAccessoryButton'
import { CurrencyContext } from 'contexts/currencyContext'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { useContext } from 'react'

import FormattedNumberInput from '../../inputs/FormattedNumberInput'
import PayInputSubText from './PayInputSubText'
import { PayProjectFormContext } from './payProjectFormContext'

export function PayProjectForm({ disabled }: { disabled?: boolean }) {
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
        <div className="h-5">
          <span className="text-xs text-error-600 dark:text-error-500">
            {errorMessage}
          </span>
        </div>
      )}
      <div className="flex w-full flex-wrap gap-2">
        <div className="min-w-[50%] flex-[2]">
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
          wrapperClassName="flex-1 max-w-full"
          disabled={disabled || errorMessage !== ''}
        />
      </div>
    </>
  )
}
