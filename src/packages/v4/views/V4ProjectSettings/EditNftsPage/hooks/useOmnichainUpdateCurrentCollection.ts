import { Address, encodeFunctionData } from 'viem'
import { JBChainId, createSalt } from 'juice-sdk-core'
import { JB_721_TIER_PARAMS_V4, NftRewardTier } from 'models/nftRewards'
import { buildJB721TierParams, pinNftRewards } from 'utils/nftRewards'
import { jb721TiersHookAbi, useGetRelayrTxBundle, useGetRelayrTxQuote, useJBRulesetContext, useSendRelayrTx } from 'juice-sdk-react'

import { JB721DelegateVersion } from 'models/JB721Delegate'
import { useWallet } from 'hooks/Wallet'

export function useOmnichainUpdateCurrentCollection() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  
  // Get NFT hook address from context
  const { rulesetMetadata: { data: rulesetMetadata } } = useJBRulesetContext()
  const nftHookAddress = rulesetMetadata?.dataHook as Address | undefined

  /**
   * Fetch a Relayr quote for adjusting NFT tiers across multiple chains
   */
  async function getUpdateQuote(
    rewardTiers: NftRewardTier[],
    editedRewardTierIds: number[],
    chainIds: JBChainId[],
  ) {
    if (!userAddress) return
    if (!nftHookAddress) return Promise.reject(new Error('NFT hook address not found'))
    if (!rewardTiers.length) return Promise.reject(new Error('No NFT tiers'))

    // Pin any new tiers and build params
    const newTiers = rewardTiers.filter(
      t => t.id > 0 || editedRewardTierIds.includes(t.id),
    )
    const tierCids = await pinNftRewards(newTiers)
    const tierParams = buildJB721TierParams({
      cids: tierCids,
      rewardTiers: newTiers,
      version: JB721DelegateVersion.JB721DELEGATE_V4,
    })

    // Common salt
    const salt = createSalt()

    const txs = chainIds.map(chainId => {
      // Use the correct abi and function name
      const encoded = encodeFunctionData({
        abi: jb721TiersHookAbi,
        functionName: 'adjustTiers',
        args: [tierParams as JB_721_TIER_PARAMS_V4[], editedRewardTierIds.map(i => BigInt(i))]
      })
      
      // Use the NFT hook address from the ruleset context
      // Note: This assumes the same hook address is used across all chains
      // If different addresses per chain are needed, you'll need to modify this logic
      return {
        data: { from: userAddress, to: nftHookAddress, value: 0n, gas: 300_000n * BigInt(chainIds.length), data: encoded },
        chainId,
      }
    })

    return getRelayrTxQuote(txs)
  }

  return { getUpdateQuote, sendRelayrTx, relayrBundle }
}
