import { t, Trans } from '@lingui/macro'
import { Button, Empty } from 'antd'
import { Callout } from 'components/Callout/Callout'
import Loading from 'components/Loading'
import TransactionModal from 'components/modals/TransactionModal'
import { RewardsList } from 'components/NftRewards/RewardsList/RewardsList'
import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectMetadata'
import { useUpdateCurrentCollection } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/EditNftsPage/hooks/useUpdateCurrentCollection'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { useCallback, useMemo, useState } from 'react'
import { TransactionSuccessModal } from '../../../TransactionSuccessModal'
import { useEditingNfts } from '../hooks/useEditingNfts'

export function EditNftsSection() {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const { rewardTiers, setRewardTiers, editedRewardTierIds, loading } =
    useEditingNfts()
  const { value: hasExistingNfts } = useHasNftRewards()
  const { updateExistingCollection, txLoading } = useUpdateCurrentCollection({
    editedRewardTierIds,
    rewardTiers,
    onConfirmed: () => setSuccessModalOpen(true),
  })
  const { projectMetadata } = useProjectMetadata()

  const showNftRewards = useMemo(() => {
    // disable juicecrowd nft rewards
    if (projectMetadata?.domain === 'juicecrowd') {
      return false
    }

    return hasExistingNfts
  }, [hasExistingNfts, projectMetadata?.domain])

  const onNftFormSaved = useCallback(async () => {
    if (!rewardTiers) return

    setSubmitLoading(true)
    await updateExistingCollection()
    setSubmitLoading(false)
  }, [rewardTiers, updateExistingCollection])

  if (loading) return <Loading className="mt-20" />

  return (
    <>
      <Callout.Info className="text-primary mb-5 bg-smoke-100 dark:bg-slate-500">
        <Trans>Changes to NFTs will take effect immediately.</Trans>
      </Callout.Info>

      <div className="mb-8">
        <RewardsList
          value={rewardTiers}
          onChange={setRewardTiers}
          allowCreate
          withEditWarning
        />

        {rewardTiers?.length === 0 && (
          <Empty
            className="mb-0"
            description={t`No NFTs`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      {showNftRewards && rewardTiers?.length === 0 && (
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
          <Trans>Edit NFTs</Trans>
        </span>
      </Button>
      <TransactionModal transactionPending open={txLoading} />
      <TransactionSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        content={
          <>
            <div className="w-80 pt-1 text-2xl font-medium">
              <Trans>Your NFTs have been edited successfully</Trans>
            </div>
            <div className="text-secondary pb-6">
              <Trans>
                New NFTs will available on your project page shortly.
              </Trans>
            </div>
          </>
        }
      />
    </>
  )
}
