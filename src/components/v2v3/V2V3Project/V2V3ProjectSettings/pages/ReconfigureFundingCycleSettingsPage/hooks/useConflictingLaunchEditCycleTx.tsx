import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/useProjectQueuedFundingCycle'
import { ReconfigureFundingCycleTxParams } from 'hooks/v2v3/transactor/useReconfigureV2V3FundingCycleTx'
import { useContext } from 'react'

/**
 * This hook is necessary to run before cycle-related tx's in NFT settings (`/settings/nfts`):
 *    e.g. launch nfts, edit useDataSourceForRedemption
 *
 *   @hasConflictingEditCycleTx
 *      - Determines if there is a conflicting `reconfigureFundingCyclesOf` tx
 *        called from the edit cycle page of the settings (`/settings/cycle`)
 *      - Since the launch Nfts Tx can only be called once, we can assume that
 *        if ANY queued cycle exists, we merge all its attributes minus the NFT specific ones
 *
 *    @mergeAlreadyQueuedEditCycleTx
 *      - If there is a conflicting prior tx ( @hasConflictingEditCycleTx ), it merges all of the
 *        already queued data from that tx, minus the NFT specific ones we want to change from the /nfts tx
 *
 */
export const useConflictingEditCycleTx = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const { data: queuedCycle } = useProjectQueuedFundingCycle({ projectId })

  if (!queuedCycle)
    return {
      hasConflictingEditCycleTx: false,
      mergeAlreadyQueuedEditCycleTx: (data: ReconfigureFundingCycleTxParams) =>
        data,
    }

  const queuedCycleData = queuedCycle[0]
  const queuedCycleMetadata = queuedCycle[1]

  const mergeAlreadyQueuedEditCycleTx = (
    nftTxData: ReconfigureFundingCycleTxParams,
  ) => {
    const data = nftTxData
    data.fundingCycleMetadata = {
      ...queuedCycleMetadata,
      useDataSourceForPay: nftTxData.fundingCycleMetadata.useDataSourceForPay,
      useDataSourceForRedeem:
        nftTxData.fundingCycleMetadata.useDataSourceForRedeem,
      dataSource: nftTxData.fundingCycleMetadata.dataSource,
    }
    data.fundingCycleData = {
      ...queuedCycleData,
    }

    // fundAccessConstraints?!?:
    //  https://discord.com/channels/939317843059679252/1080714793595441182/1151822556907712593

    return data
  }

  return {
    hasConflictingEditCycleTx: true,
    mergeAlreadyQueuedEditCycleTx,
  }
}
