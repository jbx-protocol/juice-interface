import { useCallback, useEffect, useMemo, useState } from 'react'

import { StopOutlined } from '@ant-design/icons'
import { RadioGroup } from '@headlessui/react'
import { t } from '@lingui/macro'
import { Callout } from 'components/Callout/Callout'
import { DeleteConfirmationModal } from 'components/modals/DeleteConfirmationModal'
import { SwitchToUnlimitedModal } from 'components/PayoutsTable/SwitchToUnlimitedModal'
import { useModal } from 'hooks/useModal'
import { TreasurySelection } from 'models/treasurySelection'
import { usePayoutsTable } from 'packages/v2v3/components/shared/PayoutsTable/hooks/usePayoutsTable'
import { ConvertAmountsModal } from 'packages/v4/components/PayoutsTable/ConvertAmountsModal'
import { ReduxPayoutLimit } from 'packages/v4/models/fundAccessLimits'
import { convertV4CurrencyOptionToV2V3 } from 'packages/v4/utils/currency'
import { transformV2V3SplitsToV4 } from 'packages/v4/utils/launchProjectTransformers'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { fromWad } from 'utils/format/formatNumber'
import { Icons } from '../../../Icons'
import { RadioCard } from './RadioCard'

const treasuryOptions = () => [
  { name: t`None`, value: 'zero', icon: <StopOutlined /> },
  { name: t`Limited`, value: 'amount', icon: <Icons.Target /> },
  { name: t`Unlimited`, value: 'unlimited', icon: <Icons.Infinity /> },
]

export function TreasuryOptionsRadio() {
  const initialTreasurySelection = useAppSelector(
    state => state.creatingV2Project.treasurySelection,
  )
  const dispatch = useAppDispatch()

  const [treasuryOption, setTreasuryOption] = useState<TreasurySelection>(
    initialTreasurySelection ?? 'zero',
  )

  const {
    distributionLimit,
    currency,
    setDistributionLimit,
    payoutSplits,
    setCurrency,
    setPayoutSplits,
  } = usePayoutsTable()

  const switchingToAmountsModal = useModal()
  const switchingToUnlimitedModal = useModal()
  const switchingToZeroAmountsModal = useModal()

  const calloutText = useMemo(() => {
    switch (treasuryOption) {
      case 'amount':
        return t`A fixed amount of ETH can be paid out from your project each ruleset. You can send specific ETH amounts (or ETH amounts based on USD values) to one or more recipients. Any remaining ETH will stay in your project for token cash outs or use in future rulesets.`
      case 'unlimited':
        return t`All of your project's ETH can be paid out at any time. You can send percentages of that ETH to one or more recipients.`
      case 'zero':
        return t`None of your project's ETH can be paid out. All ETH will stay in your project for token cash outs or use in future rulesets.`
    }
  }, [treasuryOption])

  const switchToAmountsPayoutSelection = useCallback(
    (newDistributionLimit: ReduxPayoutLimit) => {
      setDistributionLimit(parseInt(fromWad(newDistributionLimit.amount)))
      setCurrency(convertV4CurrencyOptionToV2V3(newDistributionLimit.currency))
      setTreasuryOption('amount')
      switchingToAmountsModal.close()
    },
    [setDistributionLimit, setCurrency, switchingToAmountsModal],
  )

  const switchToUnlimitedPayouts = useCallback(() => {
    setDistributionLimit(undefined)
    setTreasuryOption('unlimited')
    switchingToUnlimitedModal.close()
  }, [setDistributionLimit, switchingToUnlimitedModal])

  const switchToZeroPayoutSelection = useCallback(() => {
    setPayoutSplits([])
    setDistributionLimit(0)
    setTreasuryOption('zero')
    switchingToZeroAmountsModal.close()
  }, [setDistributionLimit, setPayoutSplits, switchingToZeroAmountsModal])

  const onTreasuryOptionChange = useCallback(
    (option: TreasurySelection) => {
      const currentOption = treasuryOption
      const payoutsCreated = Boolean(payoutSplits.length)
      if (option === currentOption) return
      if (option === 'amount' && payoutsCreated) {
        switchingToAmountsModal.open()
        return
      } else if (option === 'amount' && !payoutsCreated) {
        setDistributionLimit(0)
      }

      if (option === 'unlimited' && payoutsCreated) {
        switchingToUnlimitedModal.open()
        return
      } else if (option === 'unlimited' && !payoutsCreated) {
        switchToUnlimitedPayouts()
      }

      if (option === 'zero' && payoutsCreated) {
        switchingToZeroAmountsModal.open()
        return
      } else if (option === 'zero' && !payoutsCreated) {
        switchToZeroPayoutSelection()
      }

      dispatch(creatingV2ProjectActions.setTreasurySelection(option))
      setTreasuryOption(option)
    },
    [
      treasuryOption,
      payoutSplits.length,
      dispatch,
      switchingToAmountsModal,
      setDistributionLimit,
      switchingToUnlimitedModal,
      switchToUnlimitedPayouts,
      switchingToZeroAmountsModal,
      switchToZeroPayoutSelection,
    ],
  )

  useEffect(() => {
    if (distributionLimit === undefined) {
      setTreasuryOption('unlimited')
    } else if (distributionLimit > 0) {
      setTreasuryOption('amount')
    }
  }, [distributionLimit])

  return (
    <>
      <RadioGroup
        className="flex flex-col gap-3 pb-6 md:flex-row"
        value={treasuryOption}
        onChange={onTreasuryOptionChange}
      >
        {treasuryOptions().map(option => (
          <RadioGroup.Option
            className="flex-1 cursor-pointer"
            key={option.name}
            value={option.value}
          >
            {({ checked }) => (
              <RadioCard
                icon={option.icon}
                title={option.name}
                checked={checked}
              />
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
      {calloutText && (
        <Callout.Info className="mb-10 mt-4" noIcon>
          {calloutText}
        </Callout.Info>
      )}
      <DeleteConfirmationModal
        body={t`Choosing 'None' will clear your payout recipients and reset other payout options.`}
        open={switchingToZeroAmountsModal.visible}
        onOk={switchToZeroPayoutSelection}
        onCancel={switchingToZeroAmountsModal.close}
      />
      <SwitchToUnlimitedModal
        open={switchingToUnlimitedModal.visible}
        onOk={switchToUnlimitedPayouts}
        onClose={switchingToUnlimitedModal.close}
      />
      <ConvertAmountsModal
        open={switchingToAmountsModal.visible}
        onOk={switchToAmountsPayoutSelection}
        onCancel={switchingToAmountsModal.close}
        splits={transformV2V3SplitsToV4({ v2v3Splits: payoutSplits })}
      />
    </>
  )
}
