import { t, Trans } from '@lingui/macro'
import { Button, Empty, Space } from 'antd'
import NftRewardTierModal from 'components/v2/shared/FundingCycleConfigurationDrawers/NftDrawer/NftRewardTierModal'
import { ThemeContext } from 'contexts/themeContext'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'

import { useForm } from 'antd/lib/form/Form'
import { NftRewardTier } from 'models/nftRewardTier'
import { useCallback, useContext, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import {
  uploadNftCollectionMetadataToIPFS,
  uploadNftRewardsToIPFS,
} from 'utils/ipfs'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
  MAX_NFT_REWARD_TIERS,
  sortNftRewardTiers,
} from 'utils/nftRewards'

import { shadowCard } from 'constants/styles/shadowCard'

import { MinimalCollapse } from 'components/MinimalCollapse'
import TooltipIcon from 'components/TooltipIcon'
import FundingCycleDrawer from '../FundingCycleDrawer'
import { AddRewardTierButton } from './AddRewardTierButton'
import { NftMarketplaceCustomizationForm } from './NftMarketplaceCustomizationForm'
import NftRewardTierCard from './NftRewardTierCard'

export const NFT_REWARDS_EXPLAINATION: JSX.Element = (
  <Trans>
    Reward contributors with NFTs when they meet your configured funding
    criteria.
  </Trans>
)

export type MarketplaceFormFields = {
  collectionName: string
  collectionSymbol: string
  collectionDescription: string
}

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

  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [rewardTiers, setRewardTiers] = useState<NftRewardTier[]>(
    savedRewardTiers ?? [],
  )

  const onNftFormSaved = useCallback(async () => {
    setSubmitLoading(true)
    const marketplaceFormValues = marketplaceForm.getFieldsValue(true)
    const collectionName = marketplaceFormValues.collectionName

    const [rewardTiersCIDs, nftCollectionMetadataCID] = await Promise.all([
      uploadNftRewardsToIPFS(rewardTiers),
      uploadNftCollectionMetadataToIPFS({
        collectionName:
          marketplaceFormValues.collectionName ??
          defaultNftCollectionName(projectName),
        collectionDescription:
          marketplaceFormValues.collectionDescription ??
          defaultNftCollectionDescription(projectName),
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
      editingV2ProjectActions.setNftRewardsSymbol(
        marketplaceFormValues.collectionDescription,
      ),
    )
    dispatch(editingV2ProjectActions.setNftRewardTiers(rewardTiers))
    dispatch(
      editingV2ProjectActions.setNftRewardsCollectionMetadataCID(
        nftCollectionMetadataCID,
      ),
    )
    // Store cid (link to nfts on IPFS) to be used later in the deploy tx
    dispatch(editingV2ProjectActions.setNftRewardsCIDs(rewardTiersCIDs))
    setSubmitLoading(false)
    onClose?.()
  }, [
    rewardTiers,
    dispatch,
    onClose,
    marketplaceForm,
    projectName,
    logoUri,
    infoUri,
  ])

  const handleAddRewardTier = (newRewardTier: NftRewardTier) => {
    setRewardTiers(sortNftRewardTiers([...rewardTiers, newRewardTier]))
  }

  const handleEditRewardTier = ({
    index,
    newRewardTier,
  }: {
    index: number
    newRewardTier: NftRewardTier
  }) => {
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
        onClose={onClose}
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
            <NftMarketplaceCustomizationForm form={marketplaceForm} />
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
    </>
  )
}
