import { t, Trans } from '@lingui/macro'
import { Button, Empty, Form, Space } from 'antd'
import { Callout } from 'components/Callout'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'
import { useCallback, useState } from 'react'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import { useFundingCycleDrawer } from '../../hooks/FundingCycleDrawer'
import { NftCollectionDetailsFormItems } from '../shared/NftCollectionDetailsFormItems'
import { AddRewardTierButton } from './AddRewardTierButton'
import { useEditingNfts } from './hooks/EditingNfts'
import { useSaveNewCollection } from './hooks/SaveNewCollection'
import { useUpdateExistingCollection } from './hooks/UpdateExistingCollection'
import NftRewardTierCard from './NftRewardTierCard'
import NftRewardTierModal from './NftRewardTierModal/NftRewardTierModal'

export function EditNftsSection({ onClose }: { onClose: VoidFunction }) {
  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const { setFormUpdated } = useFundingCycleDrawer(onClose)

  const {
    rewardTiers,
    marketplaceForm,
    postPayModalForm,
    addRewardTier,
    editRewardTier,
    deleteRewardTier,
    editedRewardTierIds,
  } = useEditingNfts({ setFormUpdated })
  const hasExistingNfts = useHasNftRewards()
  const saveNewCollection = useSaveNewCollection({
    rewardTiers,
    marketplaceForm,
    postPayModalForm,
  })
  const updateExistingCollection = useUpdateExistingCollection({
    editedRewardTierIds,
    rewardTiers,
  })

  const onNftFormSaved = useCallback(async () => {
    if (!rewardTiers) return

    setSubmitLoading(true)

    if (hasExistingNfts) {
      await updateExistingCollection()
    } else {
      await saveNewCollection()
    }

    setSubmitLoading(false)
    setFormUpdated(false)

    onClose?.()
  }, [
    rewardTiers,
    saveNewCollection,
    updateExistingCollection,
    onClose,
    setFormUpdated,
    hasExistingNfts,
  ])

  return (
    <>
      {hasExistingNfts ? <h2>Edit NFTs</h2> : <h2>Add NFTs</h2>}
      <p>
        <Trans>
          Reward contributors with NFTs when they fund your project.
        </Trans>
      </p>
      <Callout.Info className="mb-5 bg-smoke-100 dark:bg-slate-500">
        <Trans>Changes to your collection will take effect immediately.</Trans>
      </Callout.Info>

      {rewardTiers && rewardTiers.length > 0 && (
        <Space direction="vertical" size="large" className="w-full">
          {rewardTiers?.map((rewardTier, index) => (
            <NftRewardTierCard
              key={index}
              rewardTier={rewardTier}
              onChange={newRewardTier =>
                editRewardTier({ newRewardTier, index })
              }
              onDelete={() => deleteRewardTier(index)}
            />
          ))}
        </Space>
      )}

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

      {hasExistingNfts && rewardTiers?.length === 0 && (
        <Callout.Warning className="mb-5 bg-smoke-100 dark:bg-slate-500">
          <Trans>
            <p>
              You're about to delete all NFTs from your collection. This will
              take effect immediately, and you can add NFTs back to the
              collection at any time.
            </p>
            <p>
              If you want to COMPLETELY detach NFTs from your project, you can
              do so in the <strong>Danger Zone</strong> section below.
            </p>
          </Trans>
        </Callout.Warning>
      )}

      {!hasExistingNfts && (
        // Hack - this whole thing should be a form
        <Form
          layout="vertical"
          colon={false}
          form={marketplaceForm}
          className="mb-5"
        >
          <NftCollectionDetailsFormItems />
        </Form>
      )}

      <Button
        onClick={onNftFormSaved}
        htmlType="submit"
        type="primary"
        loading={submitLoading}
      >
        <span>
          {hasExistingNfts ? (
            <Trans>Deploy edited NFTs</Trans>
          ) : (
            <Trans>Save NFTs</Trans>
          )}
        </span>
      </Button>

      <NftRewardTierModal
        open={addTierModalVisible}
        onChange={addRewardTier}
        mode="Add"
        onClose={() => setAddTierModalVisible(false)}
        isCreate
      />
    </>
  )
}
