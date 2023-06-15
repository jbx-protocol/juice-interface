import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useContext, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../ui'
import StackedComponents from '../ui/StackedComponents'
import { SmallNftSquare } from './SmallNftSquare'

export const NftRewardsCard = ({ className }: { className?: string }) => {
  const {
    nftRewards: { rewardTiers },
    loading: nftsLoading,
  } = useContext(NftRewardsContext)
  const { setProjectPageTab } = useProjectPageQueries()

  const NftComponents = useMemo(() => {
    return (rewardTiers ?? []).map(nft => ({
      Component: SmallNftSquare,
      props: {
        border: true,
        nftReward: nft,
        loading: nftsLoading,
        className: 'h-full w-full',
      },
    }))
  }, [nftsLoading, rewardTiers])
  const tooltipText = (
    <Trans>See the NFTs and rewards offered by this project.</Trans>
  )
  return (
    <DisplayCard className={twMerge('flex flex-col gap-2', className)}>
      <div className="font-medium">
        <Tooltip title={tooltipText}>
          <span>
            <Trans>NFTs & Rewards</Trans>
          </span>
        </Tooltip>
      </div>
      <div className="flex items-center gap-3">
        <StackedComponents components={NftComponents} size="56px" />
        <div>
          <button
            className="flex items-center rounded-2xl bg-grey-100 py-1 pl-3 pr-2.5 text-sm text-grey-700 dark:bg-slate-500 dark:text-slate-100"
            onClick={() => setProjectPageTab('nft_rewards')}
          >
            View all <ArrowRightIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </DisplayCard>
  )
}
