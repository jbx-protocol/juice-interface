import { JB_721_TIER_PARAMS_V4, NftRewardTier } from 'models/nftRewards'
import { buildJB721TierParams, pinNftRewards } from 'utils/nftRewards'

import { NEW_NFT_ID_LOWER_LIMIT } from 'components/NftRewards/RewardsList/AddEditRewardModal'
import { jb721TiersHookAbi, useJBRulesetContext } from 'juice-sdk-react'
import { JB721DelegateVersion } from 'models/JB721Delegate'
import { useCallback } from 'react'
import { encodeFunctionData } from 'viem'

/**
 * Hook to prepare the transaction data for updating NFT collection (adjusting tiers)
 */
export function usePopulateNftUpdateTx() {
  const {
    rulesetMetadata: { data: rulesetMetadata },
  } = useJBRulesetContext()

  const populateTransaction = useCallback(
    async (rewardTiers: NftRewardTier[], editedRewardTierIds: number[]) => {
      if (!rulesetMetadata?.dataHook) {
        throw new Error('NFT hook address is required')
      }

      const newRewardTiers = rewardTiers.filter(
        rewardTier =>
          rewardTier.id > NEW_NFT_ID_LOWER_LIMIT || // rewardTiers with id > NEW_NFT_ID_LOWER_LIMIT are new
          editedRewardTierIds.includes(rewardTier.id),
      )

      // upload new rewardTiers and get their CIDs
      const rewardTiersCIDs = await pinNftRewards(newRewardTiers)

      const tiersToAdd = buildJB721TierParams({
        cids: rewardTiersCIDs,
        rewardTiers: newRewardTiers,
        version: JB721DelegateVersion.JB721DELEGATE_V4,
      }) as JB_721_TIER_PARAMS_V4[]

      const data = encodeFunctionData({
        abi: jb721TiersHookAbi,
        functionName: 'adjustTiers',
        args: [tiersToAdd, editedRewardTierIds.map(id => BigInt(id))],
      })

      return {
        to: rulesetMetadata.dataHook,
        data,
        value: '0',
      }
    },
    [rulesetMetadata?.dataHook],
  )

  return { populateTransaction }
}
