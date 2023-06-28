import { ArrowRightIcon } from '@heroicons/react/24/solid'
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

const PREVIEW_CARDS_COUNT = 3

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
    // skeletons for loading state
    if (nftsLoading || !rewardTiers) {
      return Array(PREVIEW_CARDS_COUNT)
        .fill(0)
        .map(() => ({
          Component: SmallNftSquare,
          props: {
            border: true,
            loading: true,
            className: 'h-full w-full bg-grey-100 dark:bg-slate-500',
          },
        }))
    }

    return rewardTiers.slice(0, PREVIEW_CARDS_COUNT).map(nftReward => ({
      Component: SmallNftSquare,
      props: {
        border: true,
        nftReward,
        className: 'h-full w-full',
      },
    }))
  }, [nftsLoading, rewardTiers])

  const tooltipText = (
    <Trans>See the NFTs and rewards offered by this project.</Trans>
  )

  return (
    <DisplayCard
      className={twMerge('flex cursor-pointer flex-col gap-2', className)}
      onClick={openNftRewardsTab}
    >
      <div className="text-base font-medium">
        <Tooltip title={tooltipText}>
          <span>
            <Trans>NFTs & Rewards</Trans>
          </span>
        </Tooltip>
      </div>
      <div className="flex items-center gap-3">
        <HoverPreview>
          <StackedComponents
            components={NftComponents}
            size="60px"
            className={nftsLoading ? 'animate-pulse' : ''}
          />
        </HoverPreview>
        <div>
          <button className="flex items-center gap-1 whitespace-nowrap rounded-2xl bg-smoke-100 py-1 pl-3 pr-2.5 text-sm text-smoke-700 transition-colors hover:bg-smoke-200 dark:bg-slate-500 dark:text-slate-100 hover:dark:bg-slate-400">
            <Trans>View all</Trans>{' '}
            <ArrowRightIcon className="h-3 w-3 flex-shrink-0 stroke-2" />
          </button>
        </div>
      </div>
    </DisplayCard>
  )
}
