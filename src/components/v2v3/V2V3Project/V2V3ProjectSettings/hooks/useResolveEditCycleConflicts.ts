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
 * Determines if there's an NFT conflict between the current and queued funding cycle metadata.
 * A conflict arises if there are differences in the NFT related attributes.
 *
 * @param {V2V3FundingCycleMetadata} currentFcMetadata - The current funding cycle metadata.
 * @param {V2V3FundingCycleMetadata} queuedFcMetadata - The queued funding cycle metadata.
 * @returns {boolean} - Whether a conflict exists or not.
 */
function hasNftConflict(
  currentFcMetadata: V2V3FundingCycleMetadata,
  queuedFcMetadata: V2V3FundingCycleMetadata,
): boolean {
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

export const useResolveEditCycleConflicts = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { data: queuedCycle } = useProjectQueuedFundingCycle({ projectId })

  if (!queuedCycle || !fundingCycleMetadata) {
    return (data: ReconfigureFundingCycleTxParams) => data
  }

  const queuedFcData: V2V3FundingCycleData = queuedCycle[0]
  const queuedFcMetadata: V2V3FundingCycleMetadata = queuedCycle[1]

  /**
   * Resolves any potential conflicts in the reconfiguration of funding cycles.
   * It merges the given data with the data from a queued cycle, taking into account any NFT specific conflicts.
   *
   * @param {ReconfigureFundingCycleTxParams} data - The data for reconfiguring the funding cycle.
   * @returns {ReconfigureFundingCycleTxParams} - The modified data after resolving conflicts.
   */
  return (data: ReconfigureFundingCycleTxParams) => {
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
    } else {
      return {
        ...data,
        fundingCycleMetadata: {
          ...queuedFcMetadata,
          ...data.fundingCycleMetadata,
        },
        fundingCycleData: {
          ...queuedFcData,
          ...data.fundingCycleData,
        },
      }
    }
  }
}
