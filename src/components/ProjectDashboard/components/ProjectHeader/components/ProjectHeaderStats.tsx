import { t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { useProjectHeader } from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { TRENDING_WINDOW_DAYS } from 'pages/projects/RankingExplanation'
import { useCallback } from 'react'
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
        <ProjectHeaderStat label={t`Payments`} stat={payments} />
      </a>
      <ProjectHeaderStat
        label={t`Total volume`}
        stat={<ETHAmount amount={totalVolume} precision={2} />}
      />
      {last7DaysPercent !== 0 && last7DaysPercent !== Infinity ? (
        <ProjectHeaderStat
          label={<Trans>last {TRENDING_WINDOW_DAYS} days</Trans>}
          stat={`+${last7DaysPercent}%`}
          data-testid="project-header-trending-perc"
        />
      ) : null}
    </div>
  )
}
