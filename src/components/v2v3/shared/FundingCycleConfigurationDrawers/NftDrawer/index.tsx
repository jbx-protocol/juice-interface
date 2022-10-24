import { t, Trans } from '@lingui/macro'
import { Button, Empty, Space } from 'antd'
import NftRewardTierModal from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/NftRewardTierModal'
import { ThemeContext } from 'contexts/themeContext'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'

import { useForm } from 'antd/lib/form/Form'
import { NftRewardTier } from 'models/nftRewardTier'
import { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import {
  buildNftTxArg,
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
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useNftRewardsAdjustTiersTx } from 'hooks/v2v3/transactor/NftRewardsAdjustTiersTx'
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
  open,
  onClose,
  isCreate,
}: {
  open: boolean
  onClose: VoidFunction
  isCreate?: boolean
}) {
  const {
    theme,
    theme: { colors },
  } = useContext(ThemeContext)

  const dispatch = useAppDispatch()
  const {
    nftRewards,
    projectMetadata: { name: projectName, logoUri, infoUri },
  } = useAppSelector(state => state.editingV2Project)

  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const [marketplaceForm] = useForm<MarketplaceFormFields>()
  const [postPayModalForm] = useForm<NftPostPayModalFormFields>()

  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [rewardTiers, setRewardTiers] = useState<NftRewardTier[]>(
    nftRewards?.rewardTiers ?? [],
  )
  // a list of the `tierRanks` (IDs) of tiers that have been edited
  const [editedRewardTiers, setEditedRewardTiers] = useState<number[]>([])

  const nftRewardsAdjustTiersTx = useNftRewardsAdjustTiersTx()

  useEffect(() => setRewardTiers(nftRewards?.rewardTiers ?? []), [nftRewards])

  const {
    handleDrawerCloseClick,
    emitDrawerClose,
    setFormUpdated,
    unsavedChangesModalVisible,
    closeModal,
  } = useFundingCycleDrawer(onClose)

  const onNftFormSaved = useCallback(async () => {
    setSubmitLoading(true)
    // no metadata is changed in reconfig
    if (isCreate) {
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
    } else {
      const rewardTiersCIDs = await uploadNftRewardsToIPFS(rewardTiers)
      // adjustTiers hook
      const txSuccessful = await nftRewardsAdjustTiersTx(
        {
          dataSourceAddress: fundingCycleMetadata?.dataSource,
          nftRewards: buildNftTxArg({ cids: rewardTiersCIDs, rewardTiers }),
          tierIdsChanged: editedRewardTiers,
        },
        // txOpts,
      )

      if (!txSuccessful) {
        throw new Error('Transaction failed.')
      }
      dispatch(editingV2ProjectActions.setNftRewardsCIDs(rewardTiersCIDs))
    }
    setSubmitLoading(false)
    setFormUpdated(false)
    onClose?.()
  }, [
    postPayModalForm,
    rewardTiers,
    fundingCycleMetadata,
    nftRewardsAdjustTiersTx,
    editedRewardTiers,
    dispatch,
    onClose,
    marketplaceForm,
    setFormUpdated,
    projectName,
    logoUri,
    infoUri,
    isCreate,
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
      setEditedRewardTiers([...editedRewardTiers, index + 1])
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
        open={open}
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
          {
            isCreate ? (
              <>
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
              </>
            ) : null
            // Can't modify marketplaceForm in reconfig because `adjustTiers` doesnt cover it. Needs a `setContractUri` call

            // Can't modify postPayForm from reconfigureFundingCycle because it's a property of project metadata.
            // TODO: add setting in settings->project details to modify postPayForm
          }
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
        open={addTierModalVisible}
        validateContributionFloor={validateContributionFloor}
        onChange={handleAddRewardTier}
        mode="Add"
        onClose={() => setAddTierModalVisible(false)}
        isCreate
      />
      <UnsavedChangesModal
        open={unsavedChangesModalVisible}
        onOk={() => {
          closeModal()
          emitDrawerClose()
        }}
        onCancel={closeModal}
      />
    </>
  )
}
