import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useReconfigureV2FundingCycleTx } from 'hooks/v2/transactor/ReconfigureV2FundingCycleTx'
import { useCallback, useContext, useState } from 'react'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'pages/create/tabs/ReviewDeployTab/DeployProjectWithNftsButton'

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

  const {
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(V2ProjectContext)

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

    // Projects with NFT rewards need useDataSourceForPay to be true for NFT rewards to work
    const fundingCycleMetadata = nftRewardsCids?.length
      ? {
          ...editingFundingCycleMetadata,
          ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
        }
      : editingFundingCycleMetadata

    const txSuccessful = await reconfigureV2FundingCycleTx(
      {
        fundingCycleData: editingFundingCycleData,
        fundingCycleMetadata,
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
    nftRewardsCids,
    exit,
    reconfigureV2FundingCycleTx,
  ])

  return { reconfigureLoading: reconfigureTxLoading, reconfigureFundingCycle }
}
