import { BigNumber } from '@ethersproject/bignumber'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { TRENDING_WINDOW_DAYS } from 'components/Projects/RankingExplanation'
import { useProjectHeader } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectHeader'
import { useProjectPageQueries } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries'
import { PropsWithChildren, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { ProjectHeaderStat } from './ProjectHeaderStat'

export function ProjectHeaderStats() {
  const { payments, totalVolume, last7DaysPercent } = useProjectHeader()
  const { setProjectPageTab } = useProjectPageQueries()

  const openActivityTab = useCallback(
    () => setProjectPageTab('activity'),
    [setProjectPageTab],
  )

  return (
    <div className="flex min-w-0 gap-12 md:shrink-0">
      <a role="button" onClick={openActivityTab}>
        <ProjectHeaderStat label={t`Payments`} stat={payments ?? 0} />
      </a>
      <ProjectHeaderStat
        label={t`Total raised`}
        stat={
          <ETHAmount amount={totalVolume ?? BigNumber.from(0)} precision={2} />
        }
      />
      {last7DaysPercent !== Infinity ? (
        <ProjectHeaderStat
          label={<Trans>last {TRENDING_WINDOW_DAYS} days</Trans>}
          stat={
            <StatBadge type={last7DaysPercent > 0 ? 'trending' : 'stagnant'}>
              {last7DaysPercent}%
            </StatBadge>
          }
          data-testid="project-header-trending-perc"
        />
      ) : null}
    </div>
  )
}

type StatBadgeProps = {
  type: 'trending' | 'stagnant'
}

const StatBadge: React.FC<PropsWithChildren<StatBadgeProps>> = ({
  type,
  children,
}) => {
  return (
    <div
      className={twMerge(
        'ml-auto flex w-fit items-center gap-0.5 rounded-2xl border py-1.5 pl-2.5 pr-3 text-base font-medium leading-none',
        type === 'trending'
          ? 'border-melon-100 bg-melon-50 text-melon-700 dark:border-melon-800 dark:bg-melon-950 dark:text-melon-400'
          : 'border-split-100 bg-split-50 text-split-800 dark:border-split-800 dark:bg-split-950 dark:text-split-400',
      )}
    >
      <ArrowTrendingUpIcon className="h-4 w-4 stroke-2" />
      {children}
    </div>
  )
}
