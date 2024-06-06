import { PV_V2 } from 'constants/pv'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber, constants } from 'ethers'
import { useReconfigureV2V3FundingCycleWithNftsTx } from 'hooks/JB721Delegate/transactor/useReconfigureV2V3FundingCycleWithNftsTx'
import {
  ReconfigureFundingCycleTxParams,
  useReconfigureV2V3FundingCycleTx,
} from 'hooks/v2v3/transactor/useReconfigureV2V3FundingCycleTx'
import { revalidateProject } from 'lib/api/nextjs'
import { useCallback, useContext, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'utils/nftFundingCycleMetadataOverrides'
import {
  WEIGHT_UNCHANGED,
  WEIGHT_ZERO,
  deriveNextIssuanceRate,
} from 'utils/v2v3/fundingCycle'
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
  currentWeightAfterDiscountRate: BigNumber
  newWeight: BigNumber
}): BigNumber => {
  if (newWeight.eq(BigNumber.from(0))) {
    // if desired weight is 0 (no tokens), send weight=1 to the contract
    return BigNumber.from(WEIGHT_ZERO)
  } else if (
    parseInt(fromWad(newWeight)) ===
    parseInt(fromWad(currentWeightAfterDiscountRate))
  ) {
    // If the weight is unchanged, send weight=0 to the contract
    return BigNumber.from(WEIGHT_UNCHANGED)
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
          weight: BigNumber.from(0),
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
              ? constants.AddressZero
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
