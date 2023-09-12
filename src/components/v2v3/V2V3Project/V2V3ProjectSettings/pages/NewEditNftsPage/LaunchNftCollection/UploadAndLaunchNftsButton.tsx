import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import TransactionModal from 'components/modals/TransactionModal'
import { useState } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { pinNftCollectionMetadata, pinNftRewards } from 'utils/nftRewards'
import { TransactionSuccessModal } from '../../../TransactionSuccessModal'
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
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const {
    projectMetadata: { logoUri },
  } = useAppSelector(state => state.editingV2Project)

  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const { reconfigureLoading, reconfigureFundingCycle, txPending } =
    useReconfigureFundingCycle({
      editingFundingCycleConfig,
      memo: 'First NFT collection',
      launchedNewNfts: true,
      onComplete: () => setSuccessModalOpen(true),
    })

  const buttonLoading = ipfsUploading || reconfigureLoading

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
    <>
      <Button
        type="primary"
        onClick={uploadNftsToIpfs}
        loading={buttonLoading}
        className={className}
      >
        <Trans>Deploy NFT collection</Trans>
      </Button>
      <TransactionModal transactionPending open={txPending} />
      <TransactionSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        content={
          <>
            <div className="w-80 pt-1 text-2xl font-medium">
              <Trans>Your new NFTs have been deployed</Trans>
            </div>
            <div className="text-secondary pb-6">
              <Trans>
                New NFTs will be available in your next cycle as long as it
                starts after your edit deadline.
              </Trans>
            </div>
          </>
        }
      />
    </>
  )
}
