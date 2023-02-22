import { t, Trans } from '@lingui/macro'
import { Button, Empty, Form, Space } from 'antd'
import { useCallback, useState } from 'react'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import { useFundingCycleDrawer } from '../../hooks/FundingCycleDrawer'
import { NftCollectionDetailsFormItems } from '../shared/NftCollectionDetailsFormItems'
import { AddRewardTierButton } from './AddRewardTierButton'
import { useAddNfts } from './hooks/AddNfts'
import { useSaveNewCollection } from './hooks/SaveNewCollection'
import NftRewardTierCard from './NftRewardTierCard'
import NftRewardTierModal from './NftRewardTierModal/NftRewardTierModal'

export function AddNftsSection({ onClose }: { onClose: VoidFunction }) {
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
  } = useAddNfts({ setFormUpdated })
  const saveNewCollection = useSaveNewCollection({
    rewardTiers,
    marketplaceForm,
    postPayModalForm,
  })

  const onNftFormSaved = useCallback(async () => {
    const collectionName = marketplaceForm.getFieldValue('collectionName')
    const collectionSymbol = marketplaceForm.getFieldValue('collectionSymbol')
    if (!rewardTiers || !collectionName || !collectionSymbol) return

    setSubmitLoading(true)

    await saveNewCollection()

    setSubmitLoading(false)
    setFormUpdated(false)

    onClose?.()
  }, [rewardTiers, saveNewCollection, onClose, setFormUpdated, marketplaceForm])

  return (
    <>
      <p>
        <Trans>
          Reward contributors with NFTs when they fund your project.
        </Trans>
      </p>

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

      {/* Hack - this whole thing should be a form */}
      <Form
        layout="vertical"
        colon={false}
        form={marketplaceForm}
        className="mb-5"
      >
        <NftCollectionDetailsFormItems />
      </Form>

      <Button
        onClick={onNftFormSaved}
        htmlType="submit"
        type="primary"
        loading={submitLoading}
      >
        <span>
          <Trans>Save NFTs</Trans>
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
