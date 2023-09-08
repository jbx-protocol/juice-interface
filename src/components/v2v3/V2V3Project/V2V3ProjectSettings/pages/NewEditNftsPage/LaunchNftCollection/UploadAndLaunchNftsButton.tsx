import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useState } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { pinNftCollectionMetadata, pinNftRewards } from 'utils/nftRewards'
import {
  EditingFundingCycleConfig,
  useEditingFundingCycleConfig,
} from '../../ReconfigureFundingCycleSettingsPage/hooks/useEditingFundingCycleConfig'
import { useReconfigureFundingCycle } from '../../ReconfigureFundingCycleSettingsPage/hooks/useReconfigureFundingCycle'

export function UploadAndLaunchNftsButton({
  className,
}: {
  className?: string
}) {
  const [ipfsUploading, setIpfsUploading] = useState<boolean>(false)

  const {
    projectMetadata: { logoUri },
  } = useAppSelector(state => state.editingV2Project)

  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const { reconfigureLoading, reconfigureFundingCycle } =
    useReconfigureFundingCycle({
      editingFundingCycleConfig,
      memo: 'First NFT collection',
      launchedNewNfts: true,
    })

  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingNftRewards,
    editingMustStartAtOrAfter,
  } = editingFundingCycleConfig

  const uploadNftsToIpfs = async () => {
    setIpfsUploading(true)
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
    const latestEditingData: EditingFundingCycleConfig = {
      editingPayoutGroupedSplits,
      editingReservedTokensGroupedSplits,
      editingFundingCycleMetadata,
      editingFundingCycleData,
      editingFundAccessConstraints,
      editingNftRewards: editingNftRewards
        ? {
            ...editingNftRewards,
            collectionMetadata: {
              ...editingNftRewards.collectionMetadata,
              uri: nftCollectionMetadataUri,
            },
            CIDs: rewardTiersCIDs,
          }
        : undefined,
      editingMustStartAtOrAfter,
    }
    reconfigureFundingCycle(latestEditingData)
    setIpfsUploading(false)
  }

  return (
    <Button
      type="primary"
      onClick={uploadNftsToIpfs}
      loading={ipfsUploading || reconfigureLoading}
      className={className}
    >
      <Trans>Deploy NFT collection</Trans>
    </Button>
  )
}
