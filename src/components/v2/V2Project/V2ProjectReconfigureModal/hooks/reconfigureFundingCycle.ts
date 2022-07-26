import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useReconfigureV2FundingCycleTx } from 'hooks/v2/transactor/ReconfigureV2FundingCycleTx'
import { useCallback, useContext, useState } from 'react'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'pages/create/tabs/ReviewDeployTab/DeployProjectWithNftsButton'
import { BigNumber } from '@ethersproject/bignumber'
import { revalidateProject } from 'utils/revalidateProject'

import { EditingProjectData } from './editingProjectData'

export const useReconfigureFundingCycle = ({
  editingProjectData,
  memo,
  exit,
}: {
  editingProjectData: EditingProjectData
  memo: string
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
    fundingCycle,
    projectId,
  } = useContext(V2ProjectContext)

  const reconfigureV2FundingCycleTx = useReconfigureV2FundingCycleTx()
  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)

  // If weight is 0, we send weight=1 to the contract
  // If weight has not been modified, we send weight=0 to the contract
  const getWeightForReconfigCall = ({
    currentFundingCycleWeight,
    newFundingCycleWeight,
  }: {
    currentFundingCycleWeight: BigNumber
    newFundingCycleWeight: BigNumber
  }): BigNumber => {
    if (newFundingCycleWeight.eq(BigNumber.from(0))) {
      return BigNumber.from(1)
    } else if (
      !currentFundingCycleWeight ||
      newFundingCycleWeight.eq(currentFundingCycleWeight)
    ) {
      return BigNumber.from(0)
    }
    return currentFundingCycleWeight
  }

  const reconfigureFundingCycle = useCallback(async () => {
    setReconfigureTxLoading(true)
    if (
      !(
        fundingCycle &&
        editingFundingCycleData &&
        editingFundingCycleMetadata &&
        editingFundAccessConstraints
      )
    ) {
      setReconfigureTxLoading(false)
      throw new Error('Error deploying project.')
    }

    const newFundingCycleWeight = editingFundingCycleData.weight

    // Projects with NFT rewards need useDataSourceForPay to be true for NFT rewards to work
    const fundingCycleMetadata = nftRewardsCids?.length
      ? {
          ...editingFundingCycleMetadata,
          ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
        }
      : editingFundingCycleMetadata

    const currentFundingCycleWeight = fundingCycle.weight
    const weightForReconfigCall = getWeightForReconfigCall({
      currentFundingCycleWeight,
      newFundingCycleWeight,
    })

    const txSuccessful = await reconfigureV2FundingCycleTx(
      {
        fundingCycleData: {
          ...editingFundingCycleData,
          weight: weightForReconfigCall,
        },
        fundingCycleMetadata,
        fundAccessConstraints: editingFundAccessConstraints,
        groupedSplits: [
          editingPayoutGroupedSplits,
          editingReservedTokensGroupedSplits,
        ],
        memo,
      },
      {
        onDone() {
          console.info(
            'Reconfigure transaction executed. Awaiting confirmation...',
          )
        },
        async onConfirmed() {
          if (projectId) {
            await revalidateProject({
              cv: '2',
              projectId: String(projectId),
            })
          }
          setReconfigureTxLoading(false)
          exit()
        },
      },
    )

    if (!txSuccessful) {
      setReconfigureTxLoading(false)
    }
  }, [
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingFundAccessConstraints,
    reconfigureV2FundingCycleTx,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    nftRewardsCids,
    fundingCycle,
    memo,
    projectId,
    exit,
  ])

  return { reconfigureLoading: reconfigureTxLoading, reconfigureFundingCycle }
}
