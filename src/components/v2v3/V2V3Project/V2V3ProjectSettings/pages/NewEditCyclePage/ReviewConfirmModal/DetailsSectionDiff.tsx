import { t } from '@lingui/macro'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { DurationValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItems/DurationValue'

import {
  CONTROLLER_CONFIG_EXPLANATION,
  RECONFIG_RULES_EXPLANATION,
  TERMINAL_CONFIG_EXPLANATION,
} from 'components/strings'
import { AllowedValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/RulesListItems/AllowedValue'
import { BallotStrategyValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/RulesListItems/BallotStrategyValue'
import { DiffSection } from './DiffSection'
import { useDetailsSectionValues } from './hooks/useDetailsSectionValues'

export function DetailsSectionDiff() {
  const {
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
        // className='text-xs'
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
        helperText={RECONFIG_RULES_EXPLANATION}
        // className='text-xs'
      />
    </>
  )

  const advancedOptions = (
    <>
      <FundingCycleListItem
        name={t`Payments disabled`}
        value={<span className="capitalize">{newPausePay.toString()}</span>}
        oldValue={
          pausePayHasDiff ? (
            <span className="capitalize">{currentPausePay.toString()}</span>
          ) : undefined
        }
        className="text-xs"
      />
      <FundingCycleListItem
        name={t`Enable set payment terminal`}
        value={<AllowedValue value={newSetTerminals} />}
        oldValue={
          allowSetTerminalsHasDiff ? (
            <AllowedValue value={currentSetTerminals} />
          ) : undefined
        }
        helperText={TERMINAL_CONFIG_EXPLANATION}
        className="text-xs"
      />
      <FundingCycleListItem
        name={t`Enable set controller`}
        value={<AllowedValue value={newSetController} />}
        oldValue={
          allowSetControllerHasDiff ? (
            <AllowedValue value={currentSetController} />
          ) : undefined
        }
        helperText={CONTROLLER_CONFIG_EXPLANATION}
        className="text-xs"
      />
    </>
  )

  return <DiffSection content={content} advancedOptions={advancedOptions} />
}
