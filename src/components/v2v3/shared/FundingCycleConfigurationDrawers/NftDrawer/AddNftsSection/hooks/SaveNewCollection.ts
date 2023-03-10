import { FormInstance } from 'antd'
import { JB721GovernanceType, NftRewardTier } from 'models/nftRewards'
import { useCallback } from 'react'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { withHttps } from 'utils/externalLink'
import { pinNftCollectionMetadata, pinNftRewards } from 'utils/nftRewards'
import { emitErrorNotification } from 'utils/notifications'

// When project didn't have any NFTs before reconfiguring.
//    i.e. reconfiguring with a new NFT collection (calls `721Deployer.reconfigureFundingCyclesOf`
//         when executing reconfiguration on settings page)
export function useSaveNewCollection({
  rewardTiers,
  marketplaceForm,
  postPayModalForm,
}: {
  rewardTiers: NftRewardTier[] | undefined
  marketplaceForm: FormInstance
  postPayModalForm: FormInstance
}) {
  const {
    projectMetadata: { logoUri, infoUri },
  } = useAppSelector(state => state.editingV2Project)
  const dispatch = useAppDispatch()

  const saveNewCollection = useCallback(async () => {
    if (!rewardTiers) {
      emitErrorNotification('You must add an NFT tier.')
      return
    }

    const marketplaceFormValues = marketplaceForm.getFieldsValue(true)
    const collectionName = marketplaceFormValues.collectionName
    const governance =
      marketplaceFormValues.onChainGovernance ?? JB721GovernanceType.NONE
    const postPayModalContent = postPayModalForm.getFieldValue('content')

    const [rewardTiersCIDs, nftCollectionMetadataUri] = await Promise.all([
      pinNftRewards(rewardTiers),
      pinNftCollectionMetadata({
        collectionName: marketplaceFormValues.collectionName,
        collectionDescription: marketplaceFormValues.collectionDescription,
        collectionLogoUri: logoUri,
        collectionInfoUri: infoUri,
      }),
    ])

    dispatch(editingV2ProjectActions.setNftRewardsName(collectionName))
    dispatch(
      editingV2ProjectActions.setNftRewardsSymbol(
        marketplaceFormValues.collectionSymbol,
      ),
    )
    dispatch(
      editingV2ProjectActions.setNftRewardsCollectionDescription(
        marketplaceFormValues.collectionDescription,
      ),
    )
    dispatch(editingV2ProjectActions.setNftRewardTiers(rewardTiers))
    dispatch(
      editingV2ProjectActions.setNftRewardsCollectionMetadataUri(
        nftCollectionMetadataUri,
      ),
    )
    dispatch(
      editingV2ProjectActions.setNftPostPayModalConfig(
        postPayModalContent
          ? {
              ctaLink: withHttps(postPayModalForm.getFieldValue('ctaLink')),
              ctaText: postPayModalForm.getFieldValue('ctaText'),
              content: postPayModalContent,
            }
          : undefined,
      ),
    )
    dispatch(editingV2ProjectActions.setNftRewardsGovernance(governance))
    // Store cid (link to nfts on IPFS) to be used later in the deploy tx
    dispatch(editingV2ProjectActions.setNftRewardsCIDs(rewardTiersCIDs))
  }, [
    dispatch,
    infoUri,
    logoUri,
    marketplaceForm,
    postPayModalForm,
    rewardTiers,
  ])

  return saveNewCollection
}
