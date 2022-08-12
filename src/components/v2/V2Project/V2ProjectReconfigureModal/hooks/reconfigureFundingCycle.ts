import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useReconfigureV2FundingCycleTx } from 'hooks/v2/transactor/ReconfigureV2FundingCycleTx'
import { useCallback, useContext, useState } from 'react'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'pages/create/tabs/ReviewDeployTab/DeployProjectWithNftsButton'
import { BigNumber } from '@ethersproject/bignumber'
import { revalidateProject } from 'utils/revalidateProject'

import { EditingProjectData } from './editingProjectData'

/**
 * Return the value of the `weight` argument to send in the transaction.
 */
const getWeightArgument = ({
  currentFundingCycleWeight,
  newFundingCycleWeight,
}: {
  currentFundingCycleWeight: BigNumber
  newFundingCycleWeight: BigNumber
}): BigNumber => {
  if (newFundingCycleWeight.eq(BigNumber.from(0))) {
    // if desired weight is 0 (no tokens), send weight=1 to the contract
    return BigNumber.from(1)
  } else if (newFundingCycleWeight.eq(currentFundingCycleWeight)) {
    // If the weight is unchanged, send weight=0 to the contract
    return BigNumber.from(0)
  }

  // else, return the new weight
  return newFundingCycleWeight
}

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
    nftRewards: { CIDs: nftRewardsCids },
    fundingCycle,
    projectId,
  } = useContext(V2ProjectContext)

  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)

  const reconfigureV2FundingCycleTx = useReconfigureV2FundingCycleTx()

  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
  } = editingProjectData

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

    // Projects with NFT rewards need useDataSourceForPay to be true for NFT rewards to work
    const fundingCycleMetadata = nftRewardsCids?.length
      ? {
          ...editingFundingCycleMetadata,
          ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
        }
      : editingFundingCycleMetadata

    const weight = getWeightArgument({
      currentFundingCycleWeight: fundingCycle.weight,
      newFundingCycleWeight: editingFundingCycleData.weight,
    })

    const txSuccessful = await reconfigureV2FundingCycleTx(
      {
        fundingCycleData: {
          ...editingFundingCycleData,
          weight,
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
