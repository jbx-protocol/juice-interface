import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftRewardsAdjustTiersTx } from 'hooks/JB721Delegate/transactor/NftRewardsAdjustTiersTx'
import { NftRewardTier } from 'models/nftRewardTier'
import { useCallback, useContext } from 'react'
import { buildJB721TierParams, pinNftRewards } from 'utils/nftRewards'
import { reloadWindow } from 'utils/windowUtils'

export function useUpdateCurrentCollection({
  rewardTiers,
  editedRewardTierIds,
}: {
  rewardTiers: NftRewardTier[] | undefined
  editedRewardTierIds: number[]
}) {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const nftRewardsAdjustTiersTx = useNftRewardsAdjustTiersTx({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  const updateExistingCollection = useCallback(async () => {
    if (!fundingCycleMetadata || !rewardTiers) return // TODO emit error notificaiton

    const newRewardTiers = rewardTiers.filter(
      rewardTier =>
        rewardTier.id === undefined ||
        editedRewardTierIds.includes(rewardTier.id),
    ) // rewardTiers with id==undefined are new

    // upload new rewardTiers and get their CIDs
    const rewardTiersCIDs = await pinNftRewards(newRewardTiers)

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
  }, [
    editedRewardTierIds,
    fundingCycleMetadata,
    nftRewardsAdjustTiersTx,
    rewardTiers,
  ])

  return updateExistingCollection
}
