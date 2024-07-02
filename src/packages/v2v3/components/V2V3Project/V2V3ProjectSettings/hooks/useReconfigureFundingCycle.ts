import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { ethers } from 'ethers'
import { revalidateProject } from 'lib/api/nextjs'
import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useReconfigureV2V3FundingCycleWithNftsTx } from 'packages/v2v3/hooks/JB721Delegate/transactor/useReconfigureV2V3FundingCycleWithNftsTx'
import {
  ReconfigureFundingCycleTxParams,
  useReconfigureV2V3FundingCycleTx,
} from 'packages/v2v3/hooks/transactor/useReconfigureV2V3FundingCycleTx'
import {
  WEIGHT_UNCHANGED,
  WEIGHT_ZERO,
  deriveNextIssuanceRate,
} from 'packages/v2v3/utils/fundingCycle'
import { useCallback, useContext, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'utils/nftFundingCycleMetadataOverrides'
import { reloadWindow } from 'utils/windowUtils'
import { EditingFundingCycleConfig } from './useEditingFundingCycleConfig'
import { useResolveEditCycleConflicts } from './useResolveEditCycleConflicts'

/**
 * Return the value of the `weight` argument to send in the transaction.
 */
const getWeightArgument = ({
  currentWeightAfterDiscountRate,
  newWeight,
}: {
  currentWeightAfterDiscountRate: bigint
  newWeight: bigint
}): bigint => {
  if (newWeight === BigInt(0)) {
    // if desired weight is 0 (no tokens), send weight=1 to the contract
    return BigInt(WEIGHT_ZERO)
  } else if (
    parseInt(fromWad(newWeight)) ===
    parseInt(fromWad(currentWeightAfterDiscountRate))
  ) {
    // If the weight is unchanged, send weight=0 to the contract
    return BigInt(WEIGHT_UNCHANGED)
  }

  // else, return the new weight
  return newWeight
}

/**
 * Return a function to initiate a transaction to reconfigure a project's funding cycle.
 *
 * @dev Used in two places:
 *    1. Edit cycle form
 *    2. NFT page - edit dataSource-related attributes of the cycle
 */
export const useReconfigureFundingCycle = ({
  editingFundingCycleConfig,
  memo,
  launchedNewNfts,
  removeDatasource,
  onComplete,
}: {
  editingFundingCycleConfig: EditingFundingCycleConfig
  memo: string
  launchedNewNfts?: boolean
  removeDatasource?: boolean
  onComplete?: VoidFunction
}) => {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const {
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(NftRewardsContext)

  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)
  const [txPending, setTxPending] = useState<boolean>(false)

  const reconfigureV2V3FundingCycleTx = useReconfigureV2V3FundingCycleTx()
  const reconfigureV2V3FundingCycleWithNftsTx =
    useReconfigureV2V3FundingCycleWithNftsTx()
  const resolveEditCycleConflicts = useResolveEditCycleConflicts()

  // If given a latestEditingData, will use that. Else, will use redux store
  const reconfigureFundingCycle = useCallback(
    async (latestEditingData?: EditingFundingCycleConfig) => {
      const {
        editingPayoutGroupedSplits,
        editingReservedTokensGroupedSplits,
        editingFundingCycleMetadata,
        editingFundingCycleData,
        editingFundAccessConstraints,
        editingNftRewards,
        editingMustStartAtOrAfter,
      } = latestEditingData ?? editingFundingCycleConfig

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
        currentWeightAfterDiscountRate: deriveNextIssuanceRate({
          weight: BigInt(0),
          previousFC: fundingCycle,
        }),
        newWeight: editingFundingCycleData.weight,
      })

      const reconfigureFundingCycleData: ReconfigureFundingCycleTxParams =
        resolveEditCycleConflicts({
          fundingCycleData: {
            ...editingFundingCycleData,
            weight,
          },
          fundingCycleMetadata: {
            ...fundingCycleMetadata,
            dataSource: removeDatasource
              ? ethers.ZeroAddress
              : fundingCycleMetadata.dataSource,
          },
          fundAccessConstraints: editingFundAccessConstraints,
          groupedSplits: [
            editingPayoutGroupedSplits,
            editingReservedTokensGroupedSplits,
          ],
          memo,
          mustStartAtOrAfter: editingMustStartAtOrAfter,
          launchedNewNfts,
        })

      const txOpts = {
        onDone() {
          setTxPending(true)
        },
        async onConfirmed() {
          if (projectId) {
            await revalidateProject({
              pv: PV_V2,
              projectId: String(projectId),
            })
          }
          setReconfigureTxLoading(false)
          setTxPending(false)
          if (onComplete) {
            onComplete()
          } else {
            reloadWindow()
          }
        },
        onCancelled() {
          setTxPending(false)
        },
        onError() {
          setTxPending(false)
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
        setTxPending(false)
      }
    },
    [
      editingFundingCycleConfig,
      reconfigureV2V3FundingCycleTx,
      reconfigureV2V3FundingCycleWithNftsTx,
      launchedNewNfts,
      nftRewardsCids,
      fundingCycle,
      removeDatasource,
      memo,
      onComplete,
      projectId,
      resolveEditCycleConflicts,
    ],
  )

  return {
    reconfigureLoading: reconfigureTxLoading,
    reconfigureFundingCycle,
    txPending,
  }
}
