import { getApprovalStrategyByAddress } from 'packages/v4/utils/approvalHooks'
import { otherUnitToSeconds } from 'utils/format/formatTime'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

export const useDetailsSectionValues = () => {

  const { editCycleForm, initialFormData } = useEditCycleFormContext()

  const currentDuration = otherUnitToSeconds({
    duration: initialFormData?.duration ?? 0,
    unit: initialFormData?.durationUnit.value,
  })
    
  const newDuration = otherUnitToSeconds({
    duration: editCycleForm?.getFieldValue('duration'),
    unit: editCycleForm?.getFieldValue('durationUnit')?.value,
  })
  
  const durationHasDiff = newDuration !== currentDuration

  const newBallot = getApprovalStrategyByAddress(
    editCycleForm?.getFieldValue('approvalHook'),
  )
  const currentBallot = initialFormData
    ? getApprovalStrategyByAddress(initialFormData.approvalHook)
    : undefined
  const ballotHasDiff = newBallot?.address !== currentBallot?.address

  const newPausePay = Boolean(editCycleForm?.getFieldValue('pausePay'))
  const currentPausePay = Boolean(initialFormData?.pausePay)
  const pausePayHasDiff = currentPausePay !== newPausePay

  const newSetTerminals = Boolean(
    editCycleForm?.getFieldValue('allowSetTerminals'),
  )
  const currentSetTerminals = Boolean(
    initialFormData?.allowSetTerminals,
  )
  const allowSetTerminalsHasDiff = currentSetTerminals !== newSetTerminals

  const newAllowTerminalMigration = Boolean(
    editCycleForm?.getFieldValue('allowTerminalMigration'),
  )
  const currentAllowTerminalMigration = Boolean(
    initialFormData?.allowTerminalMigration,
  )
  const allowTerminalMigrationHasDiff =
    currentAllowTerminalMigration !== newAllowTerminalMigration

  const newSetController = Boolean(
    editCycleForm?.getFieldValue('allowSetController'),
  )
  const currentSetController = Boolean(
    initialFormData?.allowSetController,
  )
  const allowSetControllerHasDiff = currentSetController !== newSetController

  const advancedOptionsHasDiff =
    pausePayHasDiff ||
    allowSetTerminalsHasDiff ||
    allowSetControllerHasDiff ||
    allowTerminalMigrationHasDiff

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

    newSetController,
    currentSetController,
    allowSetControllerHasDiff,

    advancedOptionsHasDiff,
    sectionHasDiff,
  }
}
