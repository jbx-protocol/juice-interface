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

export const MOCK_NFTs: NFTRewardTier[] = [
  {
    name: 'Popcorn Banny',
    description: 'This Banny loves to watch shit go down in the Discord. ',
    imageUrl:
      'https://jbx.mypinata.cloud/ipfs/QmW7TPgipVPag1W1iZPcJDE4YRv9Mb5wY9AvxgFcPaFEXH',
    paymentThreshold: 0.1,
    maxSupply: 10,
    externalLink: 'https://juicebox.money',
  },
  {
    name: 'Penguin dude',
    description:
      "This NFT gives you an unbelievable amount of shit IRL. And it's a penguin wearing a hat.",
    imageUrl:
      'http://www.artrights.me/wp-content/uploads/2021/09/unnamed-1.png',
    paymentThreshold: 1,
    maxSupply: 10,
    externalLink: 'https://juicebox.money',
  },
  {
    name: 'Elon Musk',
    description:
      'Elon Musk is playing his part in curbing declining birth rates.',
    imageUrl:
      'https://cms.qz.com/wp-content/uploads/2022/04/2022-04-05T124700Z_1953872473_RC20HT92RUJ9_RTRMADP_3_MUSK-TWITTER-BOARD-2-e1650904633294.jpg?quality=75&strip=all&w=1200&h=900&crop=1',
    paymentThreshold: 10,
    maxSupply: 10,
    externalLink: 'https://juicebox.money',
  },
]
