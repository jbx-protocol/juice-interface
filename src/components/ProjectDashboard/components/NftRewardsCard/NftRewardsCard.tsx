import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useCallback, useContext, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../ui'
import StackedComponents from '../ui/StackedComponents'
import { HoverPreview } from './HoverPreview'
import { SmallNftSquare } from './SmallNftSquare'

export const NftRewardsCard = ({ className }: { className?: string }) => {
  const {
    nftRewards: { rewardTiers },
    loading: nftsLoading,
  } = useContext(NftRewardsContext)
  const { setProjectPageTab } = useProjectPageQueries()

  const openNftRewardsTab = useCallback(
    () => setProjectPageTab('nft_rewards'),
    [setProjectPageTab],
  )

  const NftComponents = useMemo(() => {
    return (rewardTiers ?? []).slice(0, 3).map(nft => ({
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
        <HoverPreview>
          <StackedComponents
            className="cursor-pointer"
            components={NftComponents}
            size="56px"
            onClick={openNftRewardsTab}
          />
        </HoverPreview>
        <div>
          <button
            className="flex items-center whitespace-nowrap rounded-2xl bg-grey-100 py-1 pl-3 pr-2.5 text-sm text-grey-700 dark:bg-slate-500 dark:text-slate-100"
            onClick={openNftRewardsTab}
          >
            View all <ArrowRightIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </DisplayCard>
  )
}
