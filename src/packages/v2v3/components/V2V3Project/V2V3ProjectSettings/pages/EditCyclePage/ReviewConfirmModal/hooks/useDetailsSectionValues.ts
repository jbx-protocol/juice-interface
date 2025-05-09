import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { getBallotStrategyByAddress } from 'packages/v2v3/utils/ballotStrategies'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/v2v3/creatingV2Project'
import { otherUnitToSeconds } from 'utils/format/formatTime'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

export const useDetailsSectionValues = () => {
  const {
    fundingCycle: currentFundingCycle,
    fundingCycleMetadata: currentFundingCycleMetadata,
  } = useContext(V2V3ProjectContext)

  const { editCycleForm } = useEditCycleFormContext()

  const currentDuration = currentFundingCycle?.duration
  const newDurationSeconds = otherUnitToSeconds({
    duration: editCycleForm?.getFieldValue('duration'),
    unit: editCycleForm?.getFieldValue('durationUnit')?.value,
  })
  const newDuration = BigNumber.from(newDurationSeconds)
  const durationHasDiff = !newDuration.eq(currentDuration ?? 0)

  const newBallot = getBallotStrategyByAddress(
    editCycleForm?.getFieldValue('ballot'),
  )
  const currentBallot = currentFundingCycle
    ? getBallotStrategyByAddress(currentFundingCycle.ballot)
    : undefined
  const ballotHasDiff = newBallot?.address !== currentBallot?.address

  const newPausePay = Boolean(editCycleForm?.getFieldValue('pausePay'))
  const currentPausePay = Boolean(currentFundingCycleMetadata?.pausePay)
  const pausePayHasDiff = currentPausePay !== newPausePay

  const newSetTerminals = Boolean(
    editCycleForm?.getFieldValue('allowSetTerminals'),
  )
  const currentSetTerminals = Boolean(
    currentFundingCycleMetadata?.global.allowSetTerminals,
  )
  const allowSetTerminalsHasDiff = currentSetTerminals !== newSetTerminals

  const newAllowTerminalMigration = Boolean(
    editCycleForm?.getFieldValue('allowTerminalMigration'),
  )
  const currentAllowTerminalMigration = Boolean(
    currentFundingCycleMetadata?.allowTerminalMigration,
  )
  const allowTerminalMigrationHasDiff =
    currentAllowTerminalMigration !== newAllowTerminalMigration

  const newAllowControllerMigration = Boolean(
    editCycleForm?.getFieldValue('allowControllerMigration'),
  )
  const currentAllowControllerMigration = Boolean(
    currentFundingCycleMetadata?.allowControllerMigration,
  )
  const allowControllerMigrationHasDiff =
    currentAllowControllerMigration !== newAllowControllerMigration

  const newSetController = Boolean(
    editCycleForm?.getFieldValue('allowSetController'),
  )
  const currentSetController = Boolean(
    currentFundingCycleMetadata?.global.allowSetController,
  )
  const allowSetControllerHasDiff = currentSetController !== newSetController

  const mustStartAtOrAfter = editCycleForm?.getFieldValue('mustStartAtOrAfter')
  const hasMustStartAtOrAfter =
    mustStartAtOrAfter !== DEFAULT_MUST_START_AT_OR_AFTER

  const advancedOptionsHasDiff =
    pausePayHasDiff ||
    allowSetTerminalsHasDiff ||
    allowSetControllerHasDiff ||
    allowControllerMigrationHasDiff ||
    allowTerminalMigrationHasDiff ||
    hasMustStartAtOrAfter

  const sectionHasDiff =
    durationHasDiff || ballotHasDiff || advancedOptionsHasDiff

  return {
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

    advancedOptionsHasDiff,
    sectionHasDiff,

    mustStartAtOrAfter,
    hasMustStartAtOrAfter,
  }
}
