import { NFTRewardTier } from 'models/v2/nftRewardTier'

// Returns the highest NFT reward tier that a payer is eligible given their pay amount
export function maxEligibleRewardTier({
  ethPayAmount,
  nftRewardTiers,
}: {
  ethPayAmount: number
  nftRewardTiers: NFTRewardTier[]
}) {
  let nftReward: NFTRewardTier | null = null
  // all nft's who's thresholds are below the pay amount
  const eligibleNftRewards = nftRewardTiers.filter(rewardTier => {
    return rewardTier.paymentThreshold <= ethPayAmount
  })
  if (eligibleNftRewards.length) {
    // take the maximum which is the only one received by payer
    nftReward = eligibleNftRewards.reduce((prev, curr) => {
      return prev.paymentThreshold > curr.paymentThreshold ? prev : curr
    })
  }
  return nftReward
}
