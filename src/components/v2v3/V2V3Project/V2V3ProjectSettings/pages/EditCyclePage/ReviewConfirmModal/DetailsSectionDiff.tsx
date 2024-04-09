import { Trans, t } from '@lingui/macro'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { DurationValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItems/DurationValue'

import { BallotStrategyValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/RulesListItems/BallotStrategyValue'
import { DiffSection } from './DiffSection'
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

    newAllowControllerMigration,
    currentAllowControllerMigration,
    allowControllerMigrationHasDiff,

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
                <BallotStrategyValue
                  ballotStrategy={newBallot}
                  warningText={undefined}
                />
              }
              oldValue={
                <BallotStrategyValue
                  ballotStrategy={currentBallot}
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
            {allowControllerMigrationHasDiff && (
              <FundingCycleListItem
                name={t`Enable controller migrations`}
                value={
                  <span className="capitalize">
                    {newAllowControllerMigration.toString()}
                  </span>
                }
                oldValue={
                  <span className="capitalize">
                    {currentAllowControllerMigration.toString()}
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
