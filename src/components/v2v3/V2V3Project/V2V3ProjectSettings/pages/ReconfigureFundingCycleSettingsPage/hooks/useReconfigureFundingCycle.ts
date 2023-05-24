import { PV_V2 } from 'constants/pv'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useReconfigureV2V3FundingCycleWithNftsTx } from 'hooks/JB721Delegate/transactor/useReconfigureV2V3FundingCycleWithNftsTx'
import {
  ReconfigureFundingCycleTxParams,
  useReconfigureV2V3FundingCycleTx,
} from 'hooks/v2v3/transactor/useReconfigureV2V3FundingCycleTx'
import { revalidateProject } from 'lib/api/nextjs'
import { useCallback, useContext, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'utils/nftFundingCycleMetadataOverrides'
import { WEIGHT_UNCHANGED, WEIGHT_ZERO } from 'utils/v2v3/fundingCycle'
import { reloadWindow } from 'utils/windowUtils'
import { EditingFundingCycleConfig } from './useEditingFundingCycleConfig'

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
    return BigNumber.from(WEIGHT_ZERO)
  } else if (
    parseInt(fromWad(newFundingCycleWeight)) ===
    parseInt(fromWad(currentFundingCycleWeight))
  ) {
    // If the weight is unchanged, send weight=0 to the contract
    return BigNumber.from(WEIGHT_UNCHANGED)
  }

  // else, return the new weight
  return newFundingCycleWeight
}

export const useReconfigureFundingCycle = ({
  editingFundingCycleConfig,
  memo,
  launchedNewNfts,
}: {
  editingFundingCycleConfig: EditingFundingCycleConfig
  memo: string
  launchedNewNfts?: boolean
}) => {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const {
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(NftRewardsContext)

  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)

  const reconfigureV2V3FundingCycleTx = useReconfigureV2V3FundingCycleTx()
  const reconfigureV2V3FundingCycleWithNftsTx =
    useReconfigureV2V3FundingCycleWithNftsTx()

  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingNftRewards,
    editingMustStartAtOrAfter,
  } = editingFundingCycleConfig

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

    const reconfigureFundingCycleData: ReconfigureFundingCycleTxParams = {
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
      mustStartAtOrAfter: editingMustStartAtOrAfter,
    }

    const txOpts = {
      async onConfirmed() {
        if (projectId) {
          await revalidateProject({
            pv: PV_V2,
            projectId: String(projectId),
          })
        }
        setReconfigureTxLoading(false)
        reloadWindow()
      },
    }

    let txSuccessful: boolean
    if (launchedNewNfts && editingNftRewards?.rewardTiers) {
      txSuccessful = await reconfigureV2V3FundingCycleWithNftsTx(
        {
          reconfigureData: reconfigureFundingCycleData,
          tiered721DelegateData: editingNftRewards,
        },
        txOpts,
      )
    } else {
      txSuccessful = await reconfigureV2V3FundingCycleTx(
        reconfigureFundingCycleData,
        txOpts,
      )
    }

    if (!txSuccessful) {
      setReconfigureTxLoading(false)
    }
  }, [
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingFundAccessConstraints,
    reconfigureV2V3FundingCycleTx,
    reconfigureV2V3FundingCycleWithNftsTx,
    launchedNewNfts,
    editingNftRewards,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingMustStartAtOrAfter,
    nftRewardsCids,
    fundingCycle,
    memo,
    projectId,
  ])

  return { reconfigureLoading: reconfigureTxLoading, reconfigureFundingCycle }
}
