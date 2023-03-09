import { t } from '@lingui/macro'
import { NEW_NFT_ID_LOWER_LIMIT } from 'components/Create/components/RewardsList/AddEditRewardModal'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useAdjustTiersTx } from 'hooks/JB721Delegate/transactor/AdjustTiersTx'
import { NftRewardTier } from 'models/nftRewards'
import { useCallback, useContext } from 'react'
import { buildJB721TierParams, pinNftRewards } from 'utils/nftRewards'
import { emitErrorNotification } from 'utils/notifications'
import { reloadWindow } from 'utils/windowUtils'

export function useUpdateCurrentCollection({
  rewardTiers,
  editedRewardTierIds,
}: {
  rewardTiers: NftRewardTier[] | undefined
  editedRewardTierIds: number[]
}) {
  const adjustTiersTx = useAdjustTiersTx()
  const { version } = useContext(JB721DelegateContractsContext)

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

    await adjustTiersTx(
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
  }, [editedRewardTierIds, adjustTiersTx, rewardTiers, version])

  return updateExistingCollection
}
