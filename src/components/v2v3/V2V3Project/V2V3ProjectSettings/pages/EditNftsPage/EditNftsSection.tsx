import { t, Trans } from '@lingui/macro'
import { Button, Empty, Space } from 'antd'
import { Callout } from 'components/Callout'
import { AddEditRewardModal } from 'components/Create/components/RewardsList/AddEditRewardModal'
import Loading from 'components/Loading'
import { AddRewardTierButton } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/AddNftsSection/AddRewardTierButton'
import NftRewardTierCard from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/AddNftsSection/NftRewardTierCard'
import { useUpdateCurrentCollection } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/EditNftsPage/hooks/UpdateCurrentCollection'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'
import { NftRewardTier } from 'models/nftRewardTier'
import { useCallback, useState } from 'react'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import { useEditingNfts } from './hooks/EditingNfts'

export function EditNftsSection() {
  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const {
    rewardTiers,
    addRewardTier,
    editRewardTier,
    deleteRewardTier,
    editedRewardTierIds,
    loading,
  } = useEditingNfts()
  const { value: hasExistingNfts } = useHasNftRewards()
  const updateExistingCollection = useUpdateCurrentCollection({
    editedRewardTierIds,
    rewardTiers,
  })

  const onNftFormSaved = useCallback(async () => {
    if (!rewardTiers) return

    setSubmitLoading(true)
    await updateExistingCollection()
    setSubmitLoading(false)
  }, [rewardTiers, updateExistingCollection])

  if (loading) return <Loading />

  return (
    <>
      <Callout.Info className="text-primary mb-5 bg-smoke-100 dark:bg-slate-500">
        <Trans>Changes to NFTs will take effect immediately.</Trans>
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

      <Button
        onClick={onNftFormSaved}
        htmlType="submit"
        type="primary"
        loading={submitLoading}
      >
        <span>
          <Trans>Deploy edited NFTs</Trans>
        </span>
      </Button>

      <AddEditRewardModal
        open={addTierModalVisible}
        onOk={(reward: NftRewardTier) => {
          setAddTierModalVisible(false)
          addRewardTier(reward)
        }}
        onCancel={() => setAddTierModalVisible(false)}
      />
    </>
  )
}
