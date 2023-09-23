import { useForm } from 'antd/lib/form/Form'
import { NftRewardsFormProps } from 'components/NftRewards/AddNftCollectionForm'
import { JB721GovernanceType } from 'models/nftRewards'
import { useState } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { DEFAULT_NFT_FLAGS } from 'redux/slices/editingV2Project'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
  pinNftCollectionMetadata,
  pinNftRewards,
} from 'utils/nftRewards'
import {
  EditingFundingCycleConfig,
  useEditingFundingCycleConfig,
} from '../../../../hooks/useEditingFundingCycleConfig'
import { useReconfigureFundingCycle } from '../../../../hooks/useReconfigureFundingCycle'

export const useLaunchNftsForm = () => {
  const [form] = useForm<NftRewardsFormProps>()

  const [ipfsUploading, setIpfsUploading] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const {
    projectMetadata: { logoUri, name: projectName },
  } = useAppSelector(state => state.editingV2Project)

  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const {
    reconfigureLoading,
    reconfigureFundingCycle,
    txPending: launchTxPending,
  } = useReconfigureFundingCycle({
    editingFundingCycleConfig,
    memo: 'First NFT collection',
    launchedNewNfts: true,
    onComplete: () => setSuccessModalOpen(true),
  })

  const launchButtonLoading = ipfsUploading || reconfigureLoading

  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingMustStartAtOrAfter,
  } = editingFundingCycleConfig

  const launchCollection = async () => {
    setIpfsUploading(true)
    const formValues = form.getFieldsValue(true) as NftRewardsFormProps
    const newRewardTiers = formValues.rewards
    const collectionName =
      formValues.collectionName ?? defaultNftCollectionName(projectName)
    const collectionDescription =
      formValues.collectionDescription ??
      defaultNftCollectionDescription(projectName)
    const collectionLogoUri = logoUri ?? ''
    const collectionInfoUri = ''

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
      editingNftRewards: {
        rewardTiers: newRewardTiers,
        collectionMetadata: {
          uri: nftCollectionMetadataUri,
          symbol: formValues.collectionSymbol,
          name: collectionName,
          description: collectionDescription,
        },
        CIDs: rewardTiersCIDs,
        postPayModal: {
          ctaText: formValues.postPayButtonText,
          ctaLink: formValues.postPayButtonLink,
          content: formValues.postPayMessage,
        },
        flags: {
          ...DEFAULT_NFT_FLAGS,
          preventOverspending:
            formValues.preventOverspending ??
            DEFAULT_NFT_FLAGS.preventOverspending,
        },
        governanceType:
          formValues.onChainGovernance ?? JB721GovernanceType.NONE,
      },
      editingMustStartAtOrAfter,
    }
    reconfigureFundingCycle(latestEditingData)
    setIpfsUploading(false)
  }

  return {
    form,
    launchButtonLoading,
    launchCollection,
    successModalOpen,
    setSuccessModalOpen,
    launchTxPending,
  }
}
