import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/useProjectQueuedFundingCycle'
import { ReconfigureFundingCycleTxParams } from 'hooks/v2v3/transactor/useReconfigureV2V3FundingCycleTx'
import { useContext } from 'react'

/**
 * This hook is necessary to run before edit cycle tx's (`/settings/cycle`):
 *   @hasConflictingNftTx
 *      - Determines if there is a conflicting `reconfigureFundingCyclesOf` tx
 *        called from the NFT page of the settings (`/settings/nft`)
 *
 *    @mergeAlreadyQueuedNftTx
 *      - If there is a conflicting prior tx ( @hasConflictingNftTx ), it merges the attributes
 *        handled by the NFT tx into given data from an edit cycle tx
 *
 */
export const useConflictingNftSettingsTx = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { data: queuedCycle } = useProjectQueuedFundingCycle({ projectId })

  if (!queuedCycle || !fundingCycleMetadata)
    return {
      hasConflictingNftTx: false,
      mergeAlreadyQueuedNftTx: (data: ReconfigureFundingCycleTxParams) => data,
    }

  const queuedFcMetadata = queuedCycle[1]

  // Check if the queued cycle has any NFT specific diff's compared to the current cycle
  const useDataSourceForPayHasDiff =
    queuedFcMetadata.useDataSourceForPay !==
    fundingCycleMetadata.useDataSourceForPay
  const useDataSourceForRedeemHasDiff =
    queuedFcMetadata.useDataSourceForRedeem !==
    fundingCycleMetadata.useDataSourceForRedeem
  const useDataSourceHasDiff =
    queuedFcMetadata.dataSource !== fundingCycleMetadata.dataSource

  const hasConflictingNftTx =
    useDataSourceForPayHasDiff ||
    useDataSourceForRedeemHasDiff ||
    useDataSourceHasDiff

  const mergeAlreadyQueuedNftTx = (
    editCycleTxData: ReconfigureFundingCycleTxParams,
  ) => {
    const data = editCycleTxData
    data.fundingCycleMetadata = {
      ...editCycleTxData.fundingCycleMetadata,
      useDataSourceForPay: queuedFcMetadata.useDataSourceForPay,
      useDataSourceForRedeem: queuedFcMetadata.useDataSourceForRedeem,
      dataSource: queuedFcMetadata.dataSource,
    }

    return data
  }

  return {
    hasConflictingNftTx,
    mergeAlreadyQueuedNftTx,
  }
}
