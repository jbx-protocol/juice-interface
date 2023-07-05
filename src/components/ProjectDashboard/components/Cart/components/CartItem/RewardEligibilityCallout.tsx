import { Transition } from '@headlessui/react'
import {
  InformationCircleIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Plural, Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useRewardEligibilityCallout } from '../../hooks/useRewardEligibilityCallout'

const RewardPlural = ({ rewardCount }: { rewardCount: number }) => (
  <Plural value={rewardCount} one="reward" other="rewards" />
)

export const RewardEligibilityCallout = () => {
  const { eligibleRewards, dismissed, dismiss, addEligibleRewards } =
    useRewardEligibilityCallout()

  const visible = !!eligibleRewards.length && !dismissed

  return (
    <Transition
      show={visible}
      enter="transition ease-in-out duration-500 transform"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in-out duration-500 transform"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-4"
    >
      <div className="flex gap-3 rounded-lg border border-bluebs-100 bg-bluebs-25 p-4 text-base font-medium text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400">
        <InformationCircleIcon className="h-6 w-6" />
        <div className="flex flex-1 flex-col gap-4">
          <span>
            <Trans>
              You are eligible for {eligibleRewards.length}{' '}
              <RewardPlural rewardCount={eligibleRewards.length} /> (NFT)
            </Trans>
          </span>
          <div className="flex gap-4">
            <Button
              className="flex items-center gap-2"
              type="primary"
              icon={<PlusIcon className="h-5 w-5" />}
              onClick={addEligibleRewards}
            >
              <Trans>
                Add <RewardPlural rewardCount={eligibleRewards.length} />
              </Trans>
            </Button>
            <Button type="link" onClick={dismiss}>
              <Trans>Dismiss</Trans>
            </Button>
          </div>
        </div>

        <XMarkIcon
          role="button"
          className="h-5 w-5 flex-shrink-0"
          onClick={dismiss}
        />
      </div>
    </Transition>
  )
}
