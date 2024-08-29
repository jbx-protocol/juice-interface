import { Trans, t } from '@lingui/macro'

import { FundingCycleListItem } from 'components/FundingCycleListItem'
import { DiffSection } from './DiffSection'
import { ApprovalStrategyValue } from './FormattedRulesetValues/DetailsSection/ApprovalStrategyValue'
import { DurationValue } from './FormattedRulesetValues/DetailsSection/DurationValue'
import { useDetailsSectionValues } from './hooks/useDetailsSectionValues'

export const emptySectionClasses = 'text-sm text-secondary pt-2 pb-3'

export function DetailsSectionDiff() {
  const {
    advancedOptionsHasDiff,
    sectionHasDiff,

    currentDuration,
    newDuration,
    durationHasDiff,

    currentBallot,
    newBallot,
    ballotHasDiff,

    newPausePay,
    currentPausePay,
    pausePayHasDiff,

    newSetTerminals,
    currentSetTerminals,
    allowSetTerminalsHasDiff,

    newAllowTerminalMigration,
    currentAllowTerminalMigration,
    allowTerminalMigrationHasDiff,

    newSetController,
    currentSetController,
    allowSetControllerHasDiff,
  } = useDetailsSectionValues()

  if (!sectionHasDiff) {
    return (
      <div className={emptySectionClasses}>
        <Trans>No edits were made to cycle details for this cycle.</Trans>
      </div>
    )
  }

  return (
    <DiffSection
      content={
        <>
          {durationHasDiff && (
            <FundingCycleListItem
              name={t`Duration`}
              value={<DurationValue duration={newDuration} />}
              oldValue={<DurationValue duration={currentDuration} />}
            />
          )}
          {ballotHasDiff && currentBallot && (
            <FundingCycleListItem
              name={t`Edit deadline`}
              value={
                <ApprovalStrategyValue
                  approvalStrategy={newBallot}
                  warningText={undefined}
                />
              }
              oldValue={
                <ApprovalStrategyValue
                  approvalStrategy={currentBallot}
                  warningText={undefined}
                />
              }
            />
          )}
        </>
      }
      advancedOptions={
        advancedOptionsHasDiff && (
          <>
            {pausePayHasDiff && (
              <FundingCycleListItem
                name={t`Payments disabled`}
                value={
                  <span className="capitalize">{newPausePay.toString()}</span>
                }
                oldValue={
                  <span className="capitalize">
                    {currentPausePay.toString()}
                  </span>
                }
              />
            )}
            {allowSetTerminalsHasDiff && (
              <FundingCycleListItem
                name={t`Enable payment terminal config`}
                value={
                  <span className="capitalize">
                    {newSetTerminals.toString()}
                  </span>
                }
                oldValue={
                  <span className="capitalize">
                    {currentSetTerminals.toString()}
                  </span>
                }
              />
            )}
            {allowTerminalMigrationHasDiff && (
              <FundingCycleListItem
                name={t`Enable payment terminal migrations`}
                value={
                  <span className="capitalize">
                    {newAllowTerminalMigration.toString()}
                  </span>
                }
                oldValue={
                  <span className="capitalize">
                    {currentAllowTerminalMigration.toString()}
                  </span>
                }
              />
            )}
            {allowSetControllerHasDiff && (
              <FundingCycleListItem
                name={t`Enable controller config`}
                value={
                  <span className="capitalize">
                    {newSetController.toString()}
                  </span>
                }
                oldValue={
                  <span className="capitalize">
                    {currentSetController.toString()}
                  </span>
                }
              />
            )}
          </>
        )
      }
    />
  )
}
