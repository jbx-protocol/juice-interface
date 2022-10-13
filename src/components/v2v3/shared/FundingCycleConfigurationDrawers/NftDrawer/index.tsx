import { t, Trans } from '@lingui/macro'
import { Button, Empty, Space } from 'antd'
import NftRewardTierModal from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/NftRewardTierModal'
import { ThemeContext } from 'contexts/themeContext'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'

import { useForm } from 'antd/lib/form/Form'
import { NftRewardTier } from 'models/nftRewardTier'
import { useCallback, useContext, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
  MAX_NFT_REWARD_TIERS,
  sortNftRewardTiers,
  tiersEqual,
  uploadNftCollectionMetadataToIPFS,
  uploadNftRewardsToIPFS,
} from 'utils/nftRewards'

import { shadowCard } from 'constants/styles/shadowCard'

import { MinimalCollapse } from 'components/MinimalCollapse'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import TooltipIcon from 'components/TooltipIcon'
import { withHttps } from 'utils/externalLink'
import FundingCycleDrawer from '../FundingCycleDrawer'
import { useFundingCycleDrawer } from '../useFundingCycleDrawer'
import { AddRewardTierButton } from './AddRewardTierButton'
import { MarketplaceFormFields, NftPostPayModalFormFields } from './formFields'
import { NftMarketplaceCustomizationForm } from './NftMarketplaceCustomizationForm'
import { NftPostPayModalForm } from './NftPostPayModalForm'
import { NftPostPayModalPreviewButton } from './NftPostPayModalPreviewButton'
import NftRewardTierCard from './NftRewardTierCard'

export const NFT_REWARDS_EXPLAINATION: JSX.Element = (
  <Trans>
    Reward contributors with NFTs when they meet your configured funding
    criteria.
  </Trans>
)

export default function NftDrawer({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const {
    theme,
    theme: { colors },
  } = useContext(ThemeContext)
  const dispatch = useAppDispatch()
  const {
    nftRewards: { rewardTiers: savedRewardTiers },
    projectMetadata: { name: projectName, logoUri, infoUri },
  } = useAppSelector(state => state.editingV2Project)

  const [marketplaceForm] = useForm<MarketplaceFormFields>()
  const [postPayModalForm] = useForm<NftPostPayModalFormFields>()

  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [rewardTiers, setRewardTiers] = useState<NftRewardTier[]>(
    savedRewardTiers ?? [],
  )

  const {
    handleDrawerCloseClick,
    emitDrawerClose,
    setFormUpdated,
    unsavedChangesModalVisible,
    closeModal,
  } = useFundingCycleDrawer(onClose)

  const onNftFormSaved = useCallback(async () => {
    setSubmitLoading(true)
    const marketplaceFormValues = marketplaceForm.getFieldsValue(true)
    const collectionName = marketplaceFormValues.collectionName

    const [rewardTiersCIDs, nftCollectionMetadataCID] = await Promise.all([
      uploadNftRewardsToIPFS(rewardTiers),
      uploadNftCollectionMetadataToIPFS({
        collectionName: marketplaceFormValues.collectionName?.length
          ? marketplaceFormValues.collectionName
          : defaultNftCollectionName(projectName),
        collectionDescription: marketplaceFormValues.collectionDescription
          ?.length
          ? marketplaceFormValues.collectionDescription
          : defaultNftCollectionDescription(projectName),
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
      editingV2ProjectActions.setNftRewardsCollectionMetadataCID(
        nftCollectionMetadataCID,
      ),
    )

    const postPayModalContent = postPayModalForm.getFieldValue('content')
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
    // Store cid (link to nfts on IPFS) to be used later in the deploy tx
    dispatch(editingV2ProjectActions.setNftRewardsCIDs(rewardTiersCIDs))
    setSubmitLoading(false)
    setFormUpdated(false)
    onClose?.()
  }, [
    postPayModalForm,
    rewardTiers,
    dispatch,
    onClose,
    marketplaceForm,
    setFormUpdated,
    projectName,
    logoUri,
    infoUri,
  ])

  const handleAddRewardTier = (newRewardTier: NftRewardTier) => {
    setRewardTiers(sortNftRewardTiers([...rewardTiers, newRewardTier]))
    setFormUpdated(true)
  }

  const handleEditRewardTier = ({
    index,
    newRewardTier,
  }: {
    index: number
    newRewardTier: NftRewardTier
  }) => {
    if (!tiersEqual({ tier1: newRewardTier, tier2: rewardTiers[index] })) {
      setFormUpdated(true)
    }
    const newRewardTiers = rewardTiers.map((tier, i) =>
      i === index
        ? {
            ...tier,
            ...newRewardTier,
          }
        : tier,
    )
    setRewardTiers(newRewardTiers)
  }

  const handleDeleteRewardTier = (tierIndex: number) => {
    setRewardTiers([
      ...rewardTiers.slice(0, tierIndex),
      ...rewardTiers.slice(tierIndex + 1),
    ])
  }

  // Determine if a give `contributionFloor` already exists in the current array of `rewardTiers`
  const validateContributionFloor = (contributionFloor: number) =>
    rewardTiers.filter(
      (tier: NftRewardTier) => tier.contributionFloor == contributionFloor,
    ).length === 0

  return (
    <>
      <FundingCycleDrawer
        title={t`NFT rewards`}
        visible={visible}
        onClose={handleDrawerCloseClick}
      >
        <div
          style={{
            padding: '2rem',
            marginBottom: 10,
            ...shadowCard(theme),
            color: colors.text.primary,
          }}
        >
          <p>{NFT_REWARDS_EXPLAINATION}</p>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {rewardTiers.map((rewardTier, index) => (
              <NftRewardTierCard
                key={index}
                rewardTier={rewardTier}
                validateContributionFloor={validateContributionFloor}
                onChange={newRewardTier =>
                  handleEditRewardTier({ newRewardTier, index })
                }
                onDelete={() => handleDeleteRewardTier(index)}
              />
            ))}
          </Space>

          {rewardTiers?.length === 0 && (
            <Empty
              description={t`No NFT reward tiers`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginBottom: 0 }}
            />
          )}

          <AddRewardTierButton
            onClick={() => {
              setAddTierModalVisible(true)
            }}
            disabled={rewardTiers.length >= MAX_NFT_REWARD_TIERS}
            style={{ marginBottom: 30 }}
          />
          <MinimalCollapse
            header={
              <>
                <Trans>Marketplace customizations</Trans>
                <TooltipIcon
                  tip={t`Customize how your NFT collection will appear on NFT marketplaces (like OpenSea).`}
                  iconStyle={{ marginLeft: 10 }}
                />
              </>
            }
          >
            <NftMarketplaceCustomizationForm
              form={marketplaceForm}
              onFormUpdated={setFormUpdated}
            />
          </MinimalCollapse>
          <MinimalCollapse
            header={
              <>
                <Trans>Payment success popup</Trans>
                <TooltipIcon
                  tip={t`Show your contributors a message after they receive their NFT reward.`}
                  iconStyle={{ marginLeft: 10 }}
                />
              </>
            }
            style={{ marginTop: '1rem' }}
          >
            <NftPostPayModalForm
              form={postPayModalForm}
              onFormUpdated={setFormUpdated}
            />
            <NftPostPayModalPreviewButton form={postPayModalForm} />
          </MinimalCollapse>
        </div>
        <Button
          onClick={onNftFormSaved}
          htmlType="submit"
          type="primary"
          loading={submitLoading}
          style={{ marginTop: 30 }}
        >
          <span>
            <Trans>Save NFT rewards</Trans>
          </span>
        </Button>
      </FundingCycleDrawer>
      <NftRewardTierModal
        visible={addTierModalVisible}
        validateContributionFloor={validateContributionFloor}
        onChange={handleAddRewardTier}
        mode="Add"
        onClose={() => setAddTierModalVisible(false)}
        isCreate
      />
      <UnsavedChangesModal
        visible={unsavedChangesModalVisible}
        onOk={() => {
          closeModal()
          emitDrawerClose()
        }}
        onCancel={closeModal}
      />
    </>
  )
}
