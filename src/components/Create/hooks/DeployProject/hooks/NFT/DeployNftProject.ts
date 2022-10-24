import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useLaunchProjectWithNftsTx } from 'hooks/v2v3/transactor/LaunchProjectWithNftsTx'
import { TransactionCallbacks } from 'models/transaction'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'pages/create/tabs/ReviewDeployTab/DeployProjectWithNftsButton'
import { useCallback, useMemo } from 'react'
import { buildNftTxArg } from 'utils/nftRewards'

/**
 * Hook that returns a function that deploys a project with NFT rewards.

 * The distinction is made between standard and NFT projects because the NFT
 * project contract uses more gas.
 * @returns A function that deploys a project with NFT rewards.
  */
export const useDeployNftProject = () => {
  const launchProjectWithNftsTx = useLaunchProjectWithNftsTx()
  const {
    projectMetadata,
    nftRewards,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2V3FundAccessConstraintsSelector()

  const collectionName = useMemo(
    () =>
      nftRewards.collectionMetadata.name
        ? nftRewards.collectionMetadata.name
        : projectMetadata.name,
    [nftRewards.collectionMetadata.name, projectMetadata.name],
  )
  const collectionSymbol = useMemo(
    () => nftRewards.collectionMetadata.symbol ?? '',
    [nftRewards.collectionMetadata.symbol],
  )

  /**
   * Deploy a project with NFT rewards.
   * @param metadataCid IPFS CID of the project metadata.
   * @param rewardTierCids IPFS CIDs of the reward tiers.
   * @param nftCollectionMetadataCid IPFS CID of the NFT collection metadata.
   */
  const deployNftProjectCallback = useCallback(
    async ({
      metadataCid,
      rewardTierCids,
      nftCollectionMetadataCid,

      onDone,
      onConfirmed,
      onCancelled,
    }: {
      metadataCid: string
      rewardTierCids: string[]
      nftCollectionMetadataCid: string
    } & Pick<
      TransactionCallbacks,
      'onCancelled' | 'onConfirmed' | 'onDone'
    >) => {
      if (!collectionName) throw new Error('No collection name or project name')
      if (!rewardTierCids.length) throw new Error('No reward tiers')

      const groupedSplits = [payoutGroupedSplits, reservedTokensGroupedSplits]

      return await launchProjectWithNftsTx(
        {
          collectionCID: nftCollectionMetadataCid,
          collectionName,
          collectionSymbol,
          projectMetadataCID: metadataCid,
          fundingCycleData,
          fundingCycleMetadata: {
            ...fundingCycleMetadata,
            ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
          },
          fundAccessConstraints,
          groupedSplits,
          nftRewards: buildNftTxArg({
            cids: rewardTierCids,
            rewardTiers: nftRewards.rewardTiers,
          }),
        },
        {
          onDone,
          onConfirmed,
          onCancelled,
        },
      )
    },
    [
      collectionName,
      payoutGroupedSplits,
      reservedTokensGroupedSplits,
      launchProjectWithNftsTx,
      collectionSymbol,
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      nftRewards.rewardTiers,
    ],
  )

  return deployNftProjectCallback
}
