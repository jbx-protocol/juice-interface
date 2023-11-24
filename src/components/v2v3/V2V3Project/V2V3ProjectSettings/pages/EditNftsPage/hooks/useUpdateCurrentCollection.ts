import { t } from '@lingui/macro'
import { NEW_NFT_ID_LOWER_LIMIT } from 'components/NftRewards/RewardsList/AddEditRewardModal'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useAdjustTiersTx } from 'hooks/JB721Delegate/transactor/useAdjustTiersTx'
import { NftRewardTier } from 'models/nftRewards'
import { useCallback, useContext, useState } from 'react'
import { buildJB721TierParams, pinNftRewards } from 'utils/nftRewards'
import { emitErrorNotification } from 'utils/notifications'

export function useUpdateCurrentCollection({
  rewardTiers,
  editedRewardTierIds,
  onConfirmed,
}: {
  rewardTiers: NftRewardTier[] | undefined
  editedRewardTierIds: number[]
  onConfirmed?: VoidFunction
}) {
  const adjustTiersTx = useAdjustTiersTx()
  const { version } = useContext(JB721DelegateContractsContext)

  const [txLoading, setTxLoading] = useState<boolean>(false)

  const updateExistingCollection = useCallback(async () => {
    if (!rewardTiers || !version) {
      emitErrorNotification(t`There are no NFT tiers to update.`)
      return
    }

    const newRewardTiers = rewardTiers.filter(
      rewardTier =>
        rewardTier.id > NEW_NFT_ID_LOWER_LIMIT || // rewardTiers with id > NEW_NFT_ID_LOWER_LIMIT are new
        editedRewardTierIds.includes(rewardTier.id),
    )

    // upload new rewardTiers and get their CIDs
    const rewardTiersCIDs = await pinNftRewards(newRewardTiers)

    const newTiers = buildJB721TierParams({
      cids: rewardTiersCIDs,
      rewardTiers: newRewardTiers,
      version,
    })

    if (!newTiers) {
      emitErrorNotification(
        t`Your project's NFT contract version is not supported.`,
      )
      return
    }

    return await adjustTiersTx(
      {
        newTiers,
        tierIdsChanged: editedRewardTierIds,
      },
      {
        onConfirmed: () => {
          setTxLoading(false)
          onConfirmed?.()
        },
        onDone: () => {
          setTxLoading(true)
        },
        onCancelled: () => {
          setTxLoading(false)
        },
      },
    )
  }, [editedRewardTierIds, adjustTiersTx, rewardTiers, version, onConfirmed])

  return {
    updateExistingCollection,
    txLoading,
  }
}
