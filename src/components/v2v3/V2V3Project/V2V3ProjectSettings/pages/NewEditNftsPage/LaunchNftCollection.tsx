import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { NftRewardsPage } from 'components/Create/components'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { pinNftCollectionMetadata, pinNftRewards } from 'utils/nftRewards'
import { useEditingFundingCycleConfig } from '../ReconfigureFundingCycleSettingsPage/hooks/useEditingFundingCycleConfig'
import { useReconfigureFundingCycle } from '../ReconfigureFundingCycleSettingsPage/hooks/useReconfigureFundingCycle'

export function LaunchNftCollection() {
  const {
    projectMetadata: { logoUri },
  } = useAppSelector(state => state.editingV2Project)
  const dispatch = useDispatch()

  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const { reconfigureLoading, reconfigureFundingCycle } =
    useReconfigureFundingCycle({
      editingFundingCycleConfig,
      memo: 'First NFT collection',
      launchedNewNfts: true,
    })

  const onNftDeploy = async () => {
    const newRewardTiers =
      editingFundingCycleConfig.editingNftRewards?.rewardTiers
    const collectionName =
      editingFundingCycleConfig.editingNftRewards?.collectionMetadata.name ?? ''
    const collectionDescription =
      editingFundingCycleConfig.editingNftRewards?.collectionMetadata
        .description ?? ''
    const collectionLogoUri = logoUri ?? ''
    const collectionInfoUri =
      editingFundingCycleConfig.editingNftRewards?.collectionMetadata.uri ?? ''

    const [rewardTiersCIDs, nftCollectionMetadataUri] = await Promise.all([
      newRewardTiers ? pinNftRewards(newRewardTiers) : [],
      pinNftCollectionMetadata({
        collectionName,
        collectionDescription,
        collectionLogoUri,
        collectionInfoUri,
      }),
    ])
    console.info('rewardTiersCIDs: ', rewardTiersCIDs)
    console.info('nftCollectionMetadataUri: ', nftCollectionMetadataUri)
    dispatch(editingV2ProjectActions.setNftRewardsCIDs(rewardTiersCIDs))
    dispatch(
      editingV2ProjectActions.setNftRewardsCollectionMetadataUri(
        nftCollectionMetadataUri,
      ),
    )
    reconfigureFundingCycle()
  }

  return (
    <NftRewardsPage
      okButton={
        <Button
          type="primary"
          onClick={onNftDeploy}
          loading={reconfigureLoading}
          className="mt-10"
        >
          <Trans>Deploy NFT collection</Trans>
        </Button>
      }
    />
  )
}
