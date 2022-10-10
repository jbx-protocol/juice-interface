import { BigNumber } from '@ethersproject/bignumber'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useReconfigureV2V3FundingCycleTx } from 'hooks/v2v3/transactor/ReconfigureV2V3FundingCycleTx'
import { CV2V3 } from 'models/cv'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'pages/create/tabs/ReviewDeployTab/DeployProjectWithNftsButton'
import { useCallback, useContext, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
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
  } else if (
    parseInt(fromWad(newFundingCycleWeight)) ===
    parseInt(fromWad(currentFundingCycleWeight))
  ) {
    // If the weight is unchanged, send weight=0 to the contract
    return BigNumber.from(0)
  }

  // else, return the new weight
  return newFundingCycleWeight
}

export const useReconfigureFundingCycle = ({
  editingProjectData,
  memo,
}: {
  editingProjectData: EditingProjectData
  memo: string
}) => {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const {
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(NftRewardsContext)

  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)

  const reconfigureV2V3FundingCycleTx = useReconfigureV2V3FundingCycleTx()

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

    const txSuccessful = await reconfigureV2V3FundingCycleTx(
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
              cv: cv as CV2V3,
              projectId: String(projectId),
            })
          }
          setReconfigureTxLoading(false)
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
    reconfigureV2V3FundingCycleTx,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    nftRewardsCids,
    fundingCycle,
    memo,
    projectId,
    cv,
  ])

  return { reconfigureLoading: reconfigureTxLoading, reconfigureFundingCycle }
}
