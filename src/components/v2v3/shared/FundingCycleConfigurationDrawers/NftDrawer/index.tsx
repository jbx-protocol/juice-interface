import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Empty, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import NftRewardTierModal from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/NftRewardTierModal'
import { shadowCard } from 'constants/styles/shadowCard'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useNftRewardsAdjustTiersTx } from 'hooks/v2v3/transactor/NftRewardsAdjustTiersTx'
import { NftRewardTier } from 'models/nftRewardTier'
import { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { withHttps } from 'utils/externalLink'
import {
  buildJB721TierParams,
  MAX_NFT_REWARD_TIERS,
  tiersEqual,
  uploadNftCollectionMetadataToIPFS,
  uploadNftRewardsToIPFS,
} from 'utils/nftRewards'
import { reloadWindow } from 'utils/windowUtils'
import FundingCycleDrawer from '../FundingCycleDrawer'
import { useFundingCycleDrawer } from '../useFundingCycleDrawer'
import { AddRewardTierButton } from './AddRewardTierButton'
import { EditCollectionDetailsSection } from './EditCollectionDetailsSection'
import { MarketplaceFormFields, NftPostPayModalFormFields } from './formFields'
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
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const {
    theme,
    theme: { colors },
  } = useContext(ThemeContext)

  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  // a list of the `tierRanks` (IDs) of tiers that have been edited
  const [editedRewardTierIds, setEditedRewardTierIds] = useState<number[]>([])

  const [marketplaceForm] = useForm<MarketplaceFormFields>()
  const [postPayModalForm] = useForm<NftPostPayModalFormFields>()

  const dispatch = useAppDispatch()
  const {
    nftRewards,
    projectMetadata: { logoUri, infoUri },
  } = useAppSelector(state => state.editingV2Project)
  const [rewardTiers, setRewardTiers] = useState<NftRewardTier[]>()

  // Load the redux state into the state variable
  useEffect(() => {
    setRewardTiers(nftRewards.rewardTiers)
  }, [nftRewards.rewardTiers])

  const editingRewardTierIDsPush = (tierId: number | undefined) => {
    // only need to send tiers that have changed to adjustTiers
    // when id == undefined, tier is new
    if (!tierId || editedRewardTierIds.includes(tierId)) return
    setEditedRewardTierIds([...editedRewardTierIds, tierId])
  }

  const nftRewardsAdjustTiersTx = useNftRewardsAdjustTiersTx({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  const {
    handleDrawerCloseClick,
    emitDrawerClose,
    setFormUpdated,
    unsavedChangesModalVisible,
    closeModal,
  } = useFundingCycleDrawer(onClose)

  // When project didn't have any NFTs before reconfiguring.
  //    i.e. reconfiguring with a new NFT collection (calls `721Deployer.reconfigureFundingCyclesOf`
  //         when executing reconfiguration on settings page)
  const saveNewCollection = useCallback(async () => {
    if (!rewardTiers) return // TODO emit error notificaiton

    const marketplaceFormValues = marketplaceForm.getFieldsValue(true)
    const collectionName = marketplaceFormValues.collectionName
    const postPayModalContent = postPayModalForm.getFieldValue('content')

    const [rewardTiersCIDs, nftCollectionMetadataUri] = await Promise.all([
      uploadNftRewardsToIPFS(rewardTiers),
      uploadNftCollectionMetadataToIPFS({
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

  // When projects with NFTs are reconfiguring those NFTs
  // Calls `dataSource.adjustTiers`
  const saveEditedCollection = useCallback(async () => {
    if (!fundingCycleMetadata || !rewardTiers) return // TODO emit error notificaiton

    dispatch(editingV2ProjectActions.setNftRewardTiers(rewardTiers))
    const newRewardTiers = rewardTiers.filter(
      rewardTier =>
        rewardTier.id === undefined ||
        editedRewardTierIds.includes(rewardTier.id),
    ) // rewardTiers with id==undefined are new

    // upload new rewardTiers and get their CIDs
    const rewardTiersCIDs = await uploadNftRewardsToIPFS(newRewardTiers)

    const newTiers = buildJB721TierParams({
      cids: rewardTiersCIDs,
      rewardTiers: newRewardTiers,
    })
    await nftRewardsAdjustTiersTx(
      {
        newTiers,
        tierIdsChanged: editedRewardTierIds,
      },
      {
        onConfirmed: () => {
          // reloading because if you go to edit again before new tiers have
          // loaded from contracts it could cause problems (no tier.id's)
          reloadWindow()
        },
      },
    )
    dispatch(editingV2ProjectActions.setNftRewardsCIDs(rewardTiersCIDs))
  }, [
    dispatch,
    editedRewardTierIds,
    fundingCycleMetadata,
    nftRewardsAdjustTiersTx,
    rewardTiers,
  ])

  const onNftFormSaved = useCallback(async () => {
    if (!rewardTiers) return

    setSubmitLoading(true)
    if (
      fundingCycleMetadata?.dataSource &&
      fundingCycleMetadata.dataSource !== constants.AddressZero
    ) {
      await saveEditedCollection()
    } else {
      await saveNewCollection()
    }

    setSubmitLoading(false)
    setFormUpdated(false)
    onClose?.()
  }, [
    rewardTiers,
    fundingCycleMetadata,
    saveNewCollection,
    saveEditedCollection,
    onClose,
    setFormUpdated,
  ])

  const handleAddRewardTier = (newRewardTier: NftRewardTier) => {
    const newRewardTiers = [...(rewardTiers ?? []), newRewardTier]
    setRewardTiers(newRewardTiers)
    setFormUpdated(true)
  }

  const handleEditRewardTier = ({
    index,
    newRewardTier,
  }: {
    index: number
    newRewardTier: NftRewardTier
  }) => {
    if (
      rewardTiers &&
      !tiersEqual({ tier1: newRewardTier, tier2: rewardTiers[index] })
    ) {
      setFormUpdated(true)
      editingRewardTierIDsPush(rewardTiers[index].id)
    }

    const newRewardTiers = rewardTiers?.map((tier, i) =>
      i === index
        ? {
            ...tier,
            ...newRewardTier,
          }
        : tier,
    ) ?? [newRewardTier]
    setRewardTiers(newRewardTiers)
  }

  const handleDeleteRewardTier = (tierIndex: number) => {
    if (!rewardTiers) return
    const newRewardTiers = [
      ...rewardTiers.slice(0, tierIndex),
      ...rewardTiers.slice(tierIndex + 1),
    ]
    setRewardTiers(newRewardTiers)
    editingRewardTierIDsPush(rewardTiers[tierIndex].id)
  }

  // Determine if a give `contributionFloor` already exists in the current array of `rewardTiers`
  const validateContributionFloor = (contributionFloor: number) => {
    if (!rewardTiers) return true
    return (
      rewardTiers?.filter(
        (tier: NftRewardTier) => tier.contributionFloor == contributionFloor,
      ).length === 0
    )
  }

  return (
    <>
      <FundingCycleDrawer
        title={t`NFTs`}
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
          <h2>Edit NFT tiers</h2>
          <p>{NFT_REWARDS_EXPLAINATION}</p>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {rewardTiers?.map((rewardTier, index) => (
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
            disabled={rewardTiers && rewardTiers.length >= MAX_NFT_REWARD_TIERS}
            style={{ marginBottom: 30 }}
          />

          <Button
            onClick={onNftFormSaved}
            htmlType="submit"
            type="primary"
            loading={submitLoading}
            style={{ marginTop: 30 }}
          >
            <span>
              <Trans>Deploy NFTs</Trans>
            </span>
          </Button>
        </div>

        <div
          style={{
            padding: '2rem',
            marginBottom: 10,
            ...shadowCard(theme),
            color: colors.text.primary,
          }}
        >
          <h2>Edit collection details</h2>

          <EditCollectionDetailsSection />
        </div>

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
      </FundingCycleDrawer>
    </>
  )
}
