import { t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { useProjectHeader } from 'components/ProjectDashboard/hooks'
import { TRENDING_WINDOW_DAYS } from 'pages/projects/RankingExplanation'
import { ProjectHeaderStat } from './ProjectHeaderStat'

export function ProjectHeaderStats() {
  const { payments, totalVolume, last7DaysPercent } = useProjectHeader()

  return (
    <div className="flex shrink-0 gap-12">
      <ProjectHeaderStat label={t`Payments`} stat={payments} />
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
