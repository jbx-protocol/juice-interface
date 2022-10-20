import { useAppSelector } from 'hooks/AppSelector'
import { useCallback } from 'react'
import {
  defaultNftCollectionDescription,
  uploadNftCollectionMetadataToIPFS,
  uploadNftRewardsToIPFS,
} from 'utils/nftRewards'

/**
 * Hook that returns a function that uploads NFT rewards to IPFS.
 * @returns A function that uploads NFT rewards to IPFS.
 */
export const useUploadNftRewards = () => {
  const {
    nftRewards,
    projectMetadata: { name: projectName, logoUri, infoUri },
  } = useAppSelector(state => state.editingV2Project)

  return useCallback(async () => {
    const [rewardTiersCids, nftCollectionMetadataCid] = await Promise.all([
      uploadNftRewardsToIPFS(nftRewards.rewardTiers),
      uploadNftCollectionMetadataToIPFS({
        collectionName:
          nftRewards.collectionMetadata.name ??
          defaultNftCollectionDescription(projectName),
        collectionDescription:
          nftRewards.collectionMetadata.description ??
          defaultNftCollectionDescription(projectName),
        collectionLogoUri: logoUri,
        collectionInfoUri: infoUri,
      }),
    ])

    if (rewardTiersCids.length !== nftRewards.rewardTiers.length) {
      console.error('Failed to upload all reward tiers', {
        rewardTiersCids,
        inputRewardTiers: nftRewards.rewardTiers,
      })
      throw new Error('Failed to upload all nft reward tiers')
    }
    if (!nftCollectionMetadataCid.length) {
      console.error('Failed to upload nft collection metadata', {
        nftCollectionMetadataCid,
        inputNftCollectionMetadata: nftRewards.collectionMetadata,
      })
      throw new Error('Failed to upload nft collection metadata')
    }

    return {
      rewardTiers: rewardTiersCids,
      nfCollectionMetadata: nftCollectionMetadataCid,
    }
  }, [
    infoUri,
    logoUri,
    nftRewards.collectionMetadata,
    nftRewards.rewardTiers,
    projectName,
  ])
}
