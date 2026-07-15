import { JB_721_TIER_PARAMS_V4, NftRewardTier } from 'models/nftRewards'
import { buildJB721TierParams, pinNftRewards } from 'utils/nftRewards'

import { NEW_NFT_ID_LOWER_LIMIT } from 'components/NftRewards/RewardsList/AddEditRewardModal'
import { useJBRulesetContext } from '@bananapus/nana-sdk-react'
import { jb721TiersHookAbi, jb721TiersHookV5Abi } from '@bananapus/nana-sdk-core'
import { JB721DelegateVersion, jb721TierConfigToV6 } from 'models/JB721Delegate'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { useCallback } from 'react'
import { encodeFunctionData } from 'viem'

/**
 * Hook to prepare the transaction data for updating NFT collection (adjusting tiers)
 */
export function usePopulateNftUpdateTx() {
  const {
    rulesetMetadata: { data: rulesetMetadata },
  } = useJBRulesetContext()
  const { version } = useV4V5Version()

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
        version:
          version === 6
            ? JB721DelegateVersion.JB721DELEGATE_V6
            : version === 5
            ? JB721DelegateVersion.JB721DELEGATE_V5
            : JB721DelegateVersion.JB721DELEGATE_V4,
      }) as JB_721_TIER_PARAMS_V4[]

      const tierIdsToRemove = editedRewardTierIds.map(id => BigInt(id))

      // The v6 hook's adjustTiers takes a different tier config shape
      // (nested flags tuple + splitPercent/splits) than v4/v5.
      const data =
        version === 6
          ? encodeFunctionData({
              abi: jb721TiersHookAbi,
              functionName: 'adjustTiers',
              args: [tiersToAdd.map(jb721TierConfigToV6), tierIdsToRemove],
            })
          : encodeFunctionData({
              abi: jb721TiersHookV5Abi,
              functionName: 'adjustTiers',
              args: [tiersToAdd, tierIdsToRemove],
            })

      return {
        to: rulesetMetadata.dataHook,
        data,
        value: '0',
      }
    },
    [rulesetMetadata?.dataHook, version],
  )

  return { populateTransaction }
}
