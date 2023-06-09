import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../ui'
import { SmallNftSquare } from './SmallNftSquare'

export const NftRewardsCard = ({ className }: { className?: string }) => {
  const {
    nftRewards: { rewardTiers },
    loading: nftsLoading,
  } = useContext(NftRewardsContext)
  return (
    <DisplayCard className={twMerge('flex flex-col gap-2', className)}>
      <div className="font-medium">
        <Trans>NFTs & Rewards</Trans>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative z-0 flex">
          <SmallNftSquare
            nftReward={rewardTiers?.[0]}
            loading={nftsLoading}
            className="z-20 h-14 w-14 bg-bluebs-400"
          />
          <SmallNftSquare
            nftReward={rewardTiers?.[1]}
            loading={nftsLoading}
            className="z-10 -ml-[18px] h-14 w-14 bg-juice-400"
          />
          <SmallNftSquare
            nftReward={rewardTiers?.[2]}
            loading={nftsLoading}
            className="-ml-[18px] h-14 w-14 bg-melon-600"
          />
        </div>
        <div>
          <button className="flex items-center rounded-2xl bg-grey-100 py-1 pl-3 pr-2.5 text-sm text-grey-700 dark:bg-slate-500 dark:text-slate-100">
            View all <ArrowRightIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </DisplayCard>
  )
}
