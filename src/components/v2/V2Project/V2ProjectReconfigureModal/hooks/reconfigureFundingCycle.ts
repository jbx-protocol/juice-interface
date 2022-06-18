import { useReconfigureV2FundingCycleTx } from 'hooks/v2/transactor/ReconfigureV2FundingCycleTx'
import { useCallback, useState } from 'react'

import { EditingProjectData } from './editingProjectData'

export const useReconfigureFundingCycle = ({
  editingProjectData,
  exit,
}: {
  editingProjectData: EditingProjectData
  exit: VoidFunction
}) => {
  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
  } = editingProjectData
  const reconfigureV2FundingCycleTx = useReconfigureV2FundingCycleTx()
  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)

  const reconfigureFundingCycle = useCallback(async () => {
    setReconfigureTxLoading(true)
    if (
      !(
        editingFundingCycleData &&
        editingFundingCycleMetadata &&
        editingFundAccessConstraints
      )
    ) {
      setReconfigureTxLoading(false)
      throw new Error('Error deploying project.')
    }

    const txSuccessful = await reconfigureV2FundingCycleTx(
      {
        fundingCycleData: editingFundingCycleData,
        fundingCycleMetadata: editingFundingCycleMetadata,
        fundAccessConstraints: editingFundAccessConstraints,
        groupedSplits: [
          editingPayoutGroupedSplits,
          editingReservedTokensGroupedSplits,
        ],
      },
      {
        onDone() {
          console.info(
            'Reconfigure transaction executed. Awaiting confirmation...',
          )
        },
        onConfirmed() {
          setReconfigureTxLoading(false)
          exit()
        },
      },
    )

    if (!txSuccessful) {
      setReconfigureTxLoading(false)
    }
  }, [
    editingFundAccessConstraints,
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    exit,
    reconfigureV2FundingCycleTx,
  ])

  return { reconfigureLoading: reconfigureTxLoading, reconfigureFundingCycle }
}
