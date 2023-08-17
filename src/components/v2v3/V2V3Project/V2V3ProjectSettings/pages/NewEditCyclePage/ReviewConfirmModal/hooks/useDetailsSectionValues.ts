import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { otherUnitToSeconds } from 'utils/format/formatTime'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

export const useDetailsSectionValues = () => {
  const { editCycleForm } = useEditCycleFormContext()

  const {
    fundingCycle: currentFundingCycle,
    fundingCycleMetadata: currentFundingCycleMetadata,
  } = useContext(V2V3ProjectContext)

  const currentDuration = currentFundingCycle?.duration
  const newDurationSeconds = otherUnitToSeconds({
    duration: editCycleForm?.getFieldValue('duration'),
    unit: editCycleForm?.getFieldValue('durationUnit').value,
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

  const newSetController = Boolean(
    editCycleForm?.getFieldValue('allowSetController'),
  )
  const currentSetController = Boolean(
    currentFundingCycleMetadata?.global.allowSetController,
  )
  const allowSetControllerHasDiff = currentSetController !== newSetController

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

    newSetController,
    currentSetController,
    allowSetControllerHasDiff,
  }
}
