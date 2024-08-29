import { useCallback } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  defaultNftCollectionDescription,
  pinNftCollectionMetadata,
  pinNftRewards,
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
    if (!nftRewards?.rewardTiers || !nftRewards?.collectionMetadata) return

    const [rewardTiersCids, nftCollectionMetadataCid] = await Promise.all([
      pinNftRewards(nftRewards.rewardTiers),
      pinNftCollectionMetadata({
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
      console.error('Failed to upload all NFT tiers', {
        rewardTiersCids,
        inputRewardTiers: nftRewards.rewardTiers,
      })
      throw new Error('Failed to upload all NFT tiers')
    }
    if (!nftCollectionMetadataCid.length) {
      console.error('Failed to upload NFT collection metadata', {
        nftCollectionMetadataCid,
        inputNftCollectionMetadata: nftRewards.collectionMetadata,
      })
      throw new Error('Failed to upload NFT collection metadata')
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
