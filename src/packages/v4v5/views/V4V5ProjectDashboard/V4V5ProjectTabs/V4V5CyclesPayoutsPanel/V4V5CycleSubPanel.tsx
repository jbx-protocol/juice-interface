import { Trans, t } from '@lingui/macro'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { CountdownCallout } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CountdownCallout'
import { currentCycleRemainingLengthTooltip } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesPanelTooltips'
import { UpcomingCycleChangesCallout } from 'components/Project/ProjectTabs/CyclesPayoutsTab/UpcomingCycleChangesCallout'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { RulesetCountdownProvider } from 'packages/v4v5/contexts/RulesetCountdownProvider'
import { twMerge } from 'tailwind-merge'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'
import { useRulesetCountdown } from '../../hooks/useRulesetCountdown'
import { useCyclesPanelSelectedCycle } from './contexts/CyclesPanelSelectedCycleContext'
import { useV4V5UpcomingRulesetHasChanges } from './hooks/useV4V5UpcomingRulesetHasChanges'
import { V4V5CycleConfigurationDisplayCard } from './V4V5CycleConfigurationDisplayCard'
import { V4V5PayoutsSubPanel } from './V4V5PayoutsSubPanel'
import { RulesetDiffSection } from './components/RulesetDiffSection'

function CountdownClock({ rulesetUnlocked }: { rulesetUnlocked: boolean }) {
  const { timeRemainingText } = useRulesetCountdown()

  const remainingTime = rulesetUnlocked ? '-' : timeRemainingText

  if (!remainingTime) {
    return <Skeleton className="w-40" />
  }
  return <>{remainingTime}</>
}

export const V4V5CycleSubPanel = () => {
  const {
    selectedRuleset,
    selectedRulesetMetadata,
    selectedCycleNumber,
    selectedCycleStatus,
    previousRuleset,
    previousRulesetMetadata,
    currentRuleset,
    isLoading,
  } = useCyclesPanelSelectedCycle()

  const { hasChanges, loading: hasChangesLoading } = useV4V5UpcomingRulesetHasChanges()

  const isCurrentCycle = selectedCycleStatus === 'current'
  const isUpcomingCycle = selectedCycleStatus === 'upcoming'
  const isPastCycle = selectedCycleStatus === 'past'

  const rulesetUnlocked = selectedRuleset?.duration === 0
  const currentRulesetUnlocked = currentRuleset?.duration === 0

  const rulesetLengthTooltip = isCurrentCycle
    ? currentCycleRemainingLengthTooltip
    : undefined

  const rulesetLength = selectedRuleset?.duration
    ? timeSecondsToDateString(selectedRuleset.duration, 'short')
    : undefined

  const status = rulesetUnlocked ? t`Unlocked` : t`Locked`

  const rulesetStatusTooltip = rulesetUnlocked ? (
    <Trans>The project's rules are unlocked and can change at any time.</Trans>
  ) : (
    <Trans>
      This project's rules will be locked in place for {rulesetLength}.
    </Trans>
  )

  // Show "no upcoming ruleset" message only for upcoming tab when conditions met
  const hasNoUpcomingRuleset =
    isUpcomingCycle &&
    currentRulesetUnlocked &&
    selectedCycleNumber !== 0 &&
    !hasChanges

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 md:flex">
          <TitleDescriptionDisplayCard
            className="w-full md:max-w-[127px]"
            title={t`Cycle #`}
            description={<Skeleton />}
          />
          <TitleDescriptionDisplayCard
            className="w-full md:w-fit"
            title={t`Status`}
            description={<Skeleton className="w-22" />}
          />
          <TitleDescriptionDisplayCard
            className="col-span-2 md:flex-1"
            title={t`Duration`}
            description={<Skeleton className="w-40" />}
          />
        </div>
      </div>
    )
  }

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
    <>
      <div>
        <div className="flex flex-col gap-4">
          {/* Scheduled launch callout */}
          {isUpcomingCycle && selectedCycleNumber === 1 && (
            <CountdownCallout cycleStart={selectedRuleset?.start} />
          )}

          {/* Upcoming changes callout */}
          {isUpcomingCycle && selectedCycleNumber !== 1 && (
            <UpcomingCycleChangesCallout
              text={upcomingRulesetChangesCalloutText}
              loading={hasChangesLoading}
              hasChanges={hasChanges}
            />
          )}

          {/* Past cycle info banner */}
          {isPastCycle && (
            <div
              className={twMerge(
                'flex items-center gap-2 rounded-lg py-2 px-3.5 text-sm font-medium',
                'bg-smoke-100 text-smoke-600 dark:bg-slate-600 dark:text-slate-300',
              )}
            >
              <InformationCircleIcon className="h-5 w-5" />
              <Trans>
                You are viewing a past ruleset. This cycle has ended.
              </Trans>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 md:flex">
            <TitleDescriptionDisplayCard
              className="w-full md:max-w-[127px]"
              title={t`Cycle #`}
              description={selectedCycleNumber?.toString() ?? <Skeleton />}
            />
            <TitleDescriptionDisplayCard
              className="w-full md:w-fit"
              title={t`Status`}
              description={status ?? <Skeleton className="w-22" />}
              tooltip={rulesetStatusTooltip}
            />

            {isCurrentCycle ? (
              <TitleDescriptionDisplayCard
                className="col-span-2 md:flex-1"
                title={t`Remaining time`}
                description={
                  <RulesetCountdownProvider>
                    <CountdownClock rulesetUnlocked={Boolean(rulesetUnlocked)} />
                  </RulesetCountdownProvider>
                }
                tooltip={rulesetLengthTooltip}
              />
            ) : (
              <TitleDescriptionDisplayCard
                className="col-span-2 md:flex-1"
                title={t`Ruleset duration`}
                description={rulesetLength ?? <Skeleton className="w-40" />}
                tooltip={rulesetLengthTooltip}
              />
            )}
          </div>

          {/* Configuration display card */}
          <V4V5CycleConfigurationDisplayCard
            ruleset={selectedRuleset}
            rulesetMetadata={selectedRulesetMetadata}
            cycleStatus={selectedCycleStatus}
          />

          {/* Diff section showing changes from previous cycle */}
          {previousRuleset && selectedCycleNumber && selectedCycleNumber > 1 && (
            <RulesetDiffSection
              currentRuleset={selectedRuleset}
              currentMetadata={selectedRulesetMetadata}
              previousRuleset={previousRuleset}
              previousMetadata={previousRulesetMetadata}
              previousCycleNumber={selectedCycleNumber - 1}
            />
          )}
        </div>

        {/* Payouts section - only show for current cycle */}
        {isCurrentCycle && (
          <V4V5PayoutsSubPanel className="mt-12" type="current" />
        )}
      </div>
    </>
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
