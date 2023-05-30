import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../ui'

export const NftRewardsCard = ({ className }: { className?: string }) => {
  return (
    <DisplayCard className={twMerge('flex flex-col gap-2', className)}>
      <div className="font-medium">
        <Trans>NFTs & Rewards</Trans>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative z-0 flex">
          <PlaceholderSquare className="z-20 bg-bluebs-400" />
          <PlaceholderSquare className="z-10 -ml-[18px] bg-juice-400" />
          <PlaceholderSquare className="-ml-[18px] bg-melon-600" />
        </div>
        <div>
          <button className="flex items-center rounded-2xl bg-grey-100 py-1 pl-3 pr-2.5 text-sm text-grey-700">
            View all <ArrowRightIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </DisplayCard>
  )
}

const PlaceholderSquare = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'h-14 w-14 rounded-lg border-4 border-white bg-grey-400',
        className,
      )}
    ></div>
  )
}
