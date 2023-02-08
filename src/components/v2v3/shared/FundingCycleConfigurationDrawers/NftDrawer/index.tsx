import { t, Trans } from '@lingui/macro'
import { Button, Empty, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import NftRewardTierModal from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/NftRewardTierModal'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'
import { useNftRewardsAdjustTiersTx } from 'hooks/JB721Delegate/transactor/NftRewardsAdjustTiersTx'
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
import { useFundingCycleDrawer } from '../hooks/FundingCycleDrawer'
import { AddRewardTierButton } from './AddRewardTierButton'
import { EditCollectionDetailsSection } from './EditCollectionDetailsSection'
import { MarketplaceFormFields, NftPostPayModalFormFields } from './formFields'
import { NftCollectionDetailsForm } from './NftCollectionDetailsForm'
import NftRewardTierCard from './NftRewardTierCard'

const NFT_REWARDS_EXPLAINATION: JSX.Element = (
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
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  // a list of the `tierRanks` (IDs) of tiers that have been edited
  const [editedRewardTierIds, setEditedRewardTierIds] = useState<number[]>([])

  const [marketplaceForm] = useForm<MarketplaceFormFields>()
  const [postPayModalForm] = useForm<NftPostPayModalFormFields>()

  const hasExistingNfts = useHasNftRewards()

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

    if (hasExistingNfts) {
      await saveEditedCollection()
    } else {
      await saveNewCollection()
    }

    setSubmitLoading(false)

    setFormUpdated(false)
    onClose?.()
  }, [
    rewardTiers,
    saveNewCollection,
    saveEditedCollection,
    onClose,
    setFormUpdated,
    hasExistingNfts,
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

  return (
    <>
      <FundingCycleDrawer
        title={t`NFTs`}
        open={open}
        onClose={handleDrawerCloseClick}
      >
        <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]">
          {hasExistingNfts ? <h2>Edit NFTs</h2> : <h2>Add NFTs</h2>}
          <p>{NFT_REWARDS_EXPLAINATION}</p>

          <Space direction="vertical" size="large" className="w-full">
            {rewardTiers?.map((rewardTier, index) => (
              <NftRewardTierCard
                key={index}
                rewardTier={rewardTier}
                onChange={newRewardTier =>
                  handleEditRewardTier({ newRewardTier, index })
                }
                onDelete={() => handleDeleteRewardTier(index)}
              />
            ))}
          </Space>

          {rewardTiers?.length === 0 && (
            <Empty
              className="mb-0"
              description={t`No NFTs`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

          <AddRewardTierButton
            className="mb-8"
            onClick={() => {
              setAddTierModalVisible(true)
            }}
            disabled={rewardTiers && rewardTiers.length >= MAX_NFT_REWARD_TIERS}
          />

          {!hasExistingNfts && (
            <NftCollectionDetailsForm form={marketplaceForm} />
          )}

          <Button
            className="mt-7"
            onClick={onNftFormSaved}
            htmlType="submit"
            type="primary"
            loading={submitLoading}
          >
            <span>
              {hasExistingNfts ? (
                <Trans>Deploy NFTs</Trans>
              ) : (
                <Trans>Save NFTs</Trans>
              )}
            </span>
          </Button>
        </div>

        {hasExistingNfts && (
          <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]">
            <h2>Edit collection details</h2>

            <EditCollectionDetailsSection />
          </div>
        )}

        <NftRewardTierModal
          open={addTierModalVisible}
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
