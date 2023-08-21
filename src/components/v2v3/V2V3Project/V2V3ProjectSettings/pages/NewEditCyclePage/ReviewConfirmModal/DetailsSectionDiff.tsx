import { Trans, t } from '@lingui/macro'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { DurationValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItems/DurationValue'

import { AllowedValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/RulesListItems/AllowedValue'
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

  const content = (
    <>
      <FundingCycleListItem
        name={t`Duration`}
        value={<DurationValue duration={newDuration} />}
        oldValue={
          durationHasDiff ? (
            <DurationValue duration={currentDuration} />
          ) : undefined
        }
      />
      <FundingCycleListItem
        name={t`Edit deadline`}
        value={
          <BallotStrategyValue
            ballotStrategy={newBallot}
            warningText={undefined}
          />
        }
        oldValue={
          currentBallot && ballotHasDiff ? (
            <BallotStrategyValue
              ballotStrategy={currentBallot}
              warningText={undefined}
            />
          ) : undefined
        }
      />
    </>
  )

  const advancedOptions = advancedOptionsHasDiff ? (
    <>
      <FundingCycleListItem
        name={t`Payments disabled`}
        value={<span className="capitalize">{newPausePay.toString()}</span>}
        oldValue={
          pausePayHasDiff ? (
            <span className="capitalize">{currentPausePay.toString()}</span>
          ) : undefined
        }
      />
      <FundingCycleListItem
        name={t`Enable set payment terminal`}
        value={<AllowedValue value={newSetTerminals} />}
        oldValue={
          allowSetTerminalsHasDiff ? (
            <AllowedValue value={currentSetTerminals} />
          ) : undefined
        }
      />
      <FundingCycleListItem
        name={t`Enable set controller`}
        value={<AllowedValue value={newSetController} />}
        oldValue={
          allowSetControllerHasDiff ? (
            <AllowedValue value={currentSetController} />
          ) : undefined
        }
      />
    </>
  ) : undefined

  return <DiffSection content={content} advancedOptions={advancedOptions} />
}
