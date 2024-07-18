import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { currentCycleRemainingLengthTooltip } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesPanelTooltips'
import { UpcomingCycleChangesCallout } from 'components/Project/ProjectTabs/CyclesPayoutsTab/UpcomingCycleChangesCallout'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { useV4CurrentUpcomingSubPanel } from '../../hooks/useV4CurrentUpcomingSubPanel'
import { useV4UpcomingRulesetHasChanges } from './hooks/useV4UpcomingRulesetHasChanges'
import { V4ConfigurationDisplayCard } from './V4ConfigurationDisplayCard'
import { V4PayoutsSubPanel } from './V4PayoutsSubPanel'

const CYCLE_NUMBER_INDEX = 0
const STATUS_INDEX = 1
const CYCLE_LENGTH_INDEX = 2

export const V4CurrentUpcomingSubPanel = ({
  id,
}: {
  id: 'current' | 'upcoming'
}) => {
  const info = useV4CurrentUpcomingSubPanel(id)
  const { hasChanges, loading } = useV4UpcomingRulesetHasChanges()

  const topPanelsInfo = useMemo(() => {
    const topPanelInfo = [
      {
        title: t`Ruleset #`,
        value: info.rulesetNumber,
      },
      {
        title: t`Status`,
        value: info.status,
      },
    ]
    if (info.type === 'current') {
      topPanelInfo.push({
        title: t`Remaining time`,
        value: info.remainingTime,
      })
    }
    if (info.type === 'upcoming') {
      topPanelInfo.push({
        title: t`Ruleset duration`,
        value: info.rulesetLength,
      })
    }
    return topPanelInfo
  }, [
    info.rulesetLength,
    info.rulesetNumber,
    info.remainingTime,
    info.status,
    info.type,
  ])

  const rulesetLengthTooltip =
    info.type === 'current' ? currentCycleRemainingLengthTooltip : undefined

  const rulesetLengthValue = topPanelsInfo[CYCLE_LENGTH_INDEX].value?.toString()

  const rulesetStatusTooltip = info.currentRulesetUnlocked ? (
    <Trans>The project's rules are unlocked and can change at any time.</Trans>
  ) : (
    <Trans>
      This project's rules will be locked in place for {rulesetLengthValue}.
    </Trans>
  )

  const hasNoUpcomingRuleset =
    info.type === 'upcoming' &&
    info.currentRulesetUnlocked &&
    /**
     * Always show 'upcoming' tab if it's FC 1
     * (which happens when Scheduled Launch is used,
     * mustStartAtOrAfter is in the future)
     */
    info.rulesetNumber !== 1 &&
    !info.hasPendingConfiguration

  if (hasNoUpcomingRuleset) {
    return (
      <div>
        <div
          className={twMerge(
            'flex items-center gap-2 rounded-lg py-2 px-3.5 text-sm font-medium shadow-sm',
            'bg-smoke-75 text-smoke-700 dark:bg-slate-400 dark:text-slate-200',
          )}
        >
          <InformationCircleIcon className="h-5 w-5" />
          <Trans>
            This project has no upcoming ruleset. Its rules can change at any
            time.
          </Trans>
        </div>
      </div>
    )
  }

  const upcomingRulesetChangesCalloutText = hasChanges
    ? t`This ruleset has upcoming changes`
    : t`This ruleset has no upcoming changes`

  return (
    <div>
      <div className="flex flex-col gap-4">
        {id === 'upcoming' && (
          <UpcomingCycleChangesCallout
            text={upcomingRulesetChangesCalloutText}
            loading={loading}
            hasChanges={hasChanges}
          />
        )}

        <div className="grid grid-cols-2 gap-4 md:flex">
          <TitleDescriptionDisplayCard
            className="w-full md:max-w-[127px]"
            title={topPanelsInfo[CYCLE_NUMBER_INDEX].title}
            description={
              topPanelsInfo[CYCLE_NUMBER_INDEX].value?.toString() ?? <Skeleton />
            }
          />
          <TitleDescriptionDisplayCard
            className="w-full md:w-fit"
            title={topPanelsInfo[STATUS_INDEX].title}
            description={
              topPanelsInfo[STATUS_INDEX].value?.toString() ?? <Skeleton className="w-22" />
            }
            tooltip={rulesetStatusTooltip}
          />
          <TitleDescriptionDisplayCard
            className="col-span-2 md:flex-1"
            title={topPanelsInfo[CYCLE_LENGTH_INDEX].title}
            description={
              topPanelsInfo[CYCLE_LENGTH_INDEX].value?.toString() ?? (
                <Skeleton className="w-40" />
              )
            }
            tooltip={rulesetLengthTooltip}
          />
        </div>
        <V4ConfigurationDisplayCard type={info.type} />
      </div>

      <V4PayoutsSubPanel className="mt-12" type={id} />
    </div>
  )
}

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={twMerge(
      'h-8 w-12 animate-pulse rounded-lg bg-smoke-200 dark:bg-slate-500',
      className,
    )}
  />
)
