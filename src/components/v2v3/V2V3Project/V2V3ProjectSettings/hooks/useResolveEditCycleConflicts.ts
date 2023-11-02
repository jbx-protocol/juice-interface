import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/useProjectQueuedFundingCycle'
import { ReconfigureFundingCycleTxParams } from 'hooks/v2v3/transactor/useReconfigureV2V3FundingCycleTx'
import {
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'

/**
 * Determines if a "Launch NFTs" (NftDeployer.reconfigureFundingCycleOf) has been called
 * in the same cycle as an "Edit cycle" (reconfigureFundingCycleOf) tx.
 *
 * If so, we need to pass the new delegate and other NFT-related data into the subsequent
 * "Edit cycle" tx so they are not overriden and lost.
 *
 * @param {V2V3FundingCycleMetadata} currentFcMetadata - The current funding cycle metadata.
 * @param {V2V3FundingCycleMetadata} queuedFcMetadata - The queued funding cycle metadata.
 * @returns {boolean} - Whether a conflict exists or not.
 */
function hasNftConflict(
  currentFcMetadata: V2V3FundingCycleMetadata,
  queuedFcMetadata: V2V3FundingCycleMetadata,
): boolean {
  // if the queued cycle's NFT data has any changes to the current cycle, return true.
  const useDataSourceForPayHasDiff =
    queuedFcMetadata.useDataSourceForPay !==
    currentFcMetadata.useDataSourceForPay
  const useDataSourceForRedeemHasDiff =
    queuedFcMetadata.useDataSourceForRedeem !==
    currentFcMetadata.useDataSourceForRedeem
  const useDataSourceHasDiff =
    queuedFcMetadata.dataSource !== currentFcMetadata.dataSource

  return (
    useDataSourceForPayHasDiff ||
    useDataSourceForRedeemHasDiff ||
    useDataSourceHasDiff
  )
}

/**
 *
 * @returns
 */
export const useResolveEditCycleConflicts = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const { data: queuedCycle } = useProjectQueuedFundingCycle({ projectId })

  // If no queued cycle, no resolving needs to be done. Return current data
  if (!queuedCycle || !fundingCycleMetadata) {
    return (data: ReconfigureFundingCycleTxParams) => data
  }

  const queuedFcData: V2V3FundingCycleData = queuedCycle[0]
  const queuedFcMetadata: V2V3FundingCycleMetadata = queuedCycle[1]

  return (
    data: ReconfigureFundingCycleTxParams & { launchedNewNfts?: boolean },
  ) => {
    // Calling from "Edit cycle" and an NFT tx has be called same cycle: pass that previously queued NFT data into this "Edit cycle" tx
    if (hasNftConflict(fundingCycleMetadata, queuedFcMetadata)) {
      return {
        ...data,
        fundingCycleMetadata: {
          ...data.fundingCycleMetadata,
          useDataSourceForPay: queuedFcMetadata.useDataSourceForPay,
          useDataSourceForRedeem: queuedFcMetadata.useDataSourceForRedeem,
          dataSource: queuedFcMetadata.dataSource,
        },
      }
    }
    // Calling from "Launch NFTs" and an "Edit cycle" tx has be called same cycle: pass that previously queued data into this "Launch NFTs" tx
    if (data.launchedNewNfts) {
      return {
        ...data,
        fundingCycleMetadata: {
          ...data.fundingCycleMetadata,
          ...queuedFcMetadata,
        },
        fundingCycleData: {
          ...data.fundingCycleData,
          ...queuedFcData,
        },
      }
      // Calling "Edit cycle" when a previously "Edit cycle" tx exists: ignore the old tx data, return the new one
    } else return data
  }
}
