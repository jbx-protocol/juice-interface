import { Trans, t } from '@lingui/macro'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { currentCycleRemainingLengthTooltip } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesPanelTooltips'
import { UpcomingCycleChangesCallout } from 'components/Project/ProjectTabs/CyclesPayoutsTab/UpcomingCycleChangesCallout'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { ProjectChainSelect } from 'packages/v4/components/ProjectDashboard/ProjectChainSelect'
import { RulesetCountdownProvider } from 'packages/v4/contexts/RulesetCountdownProvider'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useRulesetCountdown } from '../../hooks/useRulesetCountdown'
import { useV4CurrentUpcomingSubPanel } from '../../hooks/useV4CurrentUpcomingSubPanel'
import { useCyclesPanelSelectedChain } from './contexts/CyclesPanelSelectedChainContext'
import { useV4UpcomingRulesetHasChanges } from './hooks/useV4UpcomingRulesetHasChanges'
import { V4ConfigurationDisplayCard } from './V4ConfigurationDisplayCard'
import { V4PayoutsSubPanel } from './V4PayoutsSubPanel'

function CountdownClock({ rulesetUnlocked }: { rulesetUnlocked: boolean }) {
  const { timeRemainingText } = useRulesetCountdown()

  const remainingTime = rulesetUnlocked ? '-' : timeRemainingText

  if (!remainingTime) {
    return <Skeleton className="w-40" />
  }
  return <>{remainingTime}</>
}

export const V4CurrentUpcomingSubPanel = ({
  id,
}: {
  id: 'current' | 'upcoming'
}) => {
  const [rulesetCrossChainDiffModalOpen, setRulesetCrossChainDiffModalOpen] = useState<boolean>(false)

  const info = useV4CurrentUpcomingSubPanel(id)
  const { hasChanges, loading } = useV4UpcomingRulesetHasChanges()
  const { selectedChainId, setSelectedChainId } = useCyclesPanelSelectedChain()
  // const { data: rulesetsDiffAcrossChains } = useProjectRulesetsDiffAcrossChains({ rulesetNumber: info.rulesetNumber} )

  const rulesetLengthTooltip =
    info.type === 'current' ? currentCycleRemainingLengthTooltip : undefined

  const rulesetLengthValue = info.rulesetLength?.toString()

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

  const openRulesetCrossChainDiffModal = () => {
    setRulesetCrossChainDiffModalOpen(true)
  }

  return (
    <>
      <div>
        <div className="absolute left-32 top-[-6px]">
          { selectedChainId ?
            <div className="flex items-center gap-1">
              <ProjectChainSelect 
                value={selectedChainId} 
                onChange={(chainId) => setSelectedChainId(chainId)} 
              />
              {/* { rulesetsDiffAcrossChains?.length ? 
                <Tooltip
                  title={
                    <span>This project's other chain instances have different rulesets. <strong onClick={() => openRulesetCrossChainDiffModal()}>See more</strong></span>
                  }
                >
                  <ExclamationTriangleIcon
                    className='flex text-warning-500 h-6 w-6'
                  />
                </Tooltip>
              : null} */}
            </div>
          : null }
        </div>
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
              title={t`Ruleset #`}
              description={info.rulesetNumber?.toString() ?? <Skeleton />}
            />
            <TitleDescriptionDisplayCard
              className="w-full md:w-fit"
              title={t`Status`}
              description={
                info.status?.toString() ?? <Skeleton className="w-22" />
              }
              tooltip={rulesetStatusTooltip}
            />

            {info.type === 'current' ? (
              <TitleDescriptionDisplayCard
                className="col-span-2 md:flex-1"
                title={t`Remaining time`}
                description={
                  <RulesetCountdownProvider>
                    <CountdownClock
                      rulesetUnlocked={Boolean(info.rulesetUnlocked)}
                    />
                  </RulesetCountdownProvider>
                }
                tooltip={rulesetLengthTooltip}
              />
            ) : (
              <TitleDescriptionDisplayCard
                className="col-span-2 md:flex-1"
                title={t`Ruleset duration`}
                description={
                  info.rulesetLength?.toString() ?? <Skeleton className="w-40" />
                }
                tooltip={rulesetLengthTooltip}
              />
            )}
          </div>
          {/* Gets data from useV4CurrentUpcomingConfigurationPanel */}
          <V4ConfigurationDisplayCard type={info.type} />
        </div>

        <V4PayoutsSubPanel className="mt-12" type={id} />
      </div>
      {/* <RulesetCrossChainDiffModal
        open={rulesetCrossChainDiffModalOpen} 
        onClose={() => setRulesetCrossChainDiffModalOpen(false)}
        rulesetsDiffAcrossChains={rulesetsDiffAcrossChains} 
      /> */}
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
