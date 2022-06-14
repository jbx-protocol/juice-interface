import { Space } from 'antd'
import { NFTRewardTier } from 'models/v2/nftRewardTier'

import NFTRewardTierCard from './NFTRewardTierCard'

// const DUMMY_REWARD_TIERS: NFTRewardTier[] = [
//   {
//     NFT: '/assets/quint.gif',
//     name: 'Quint reward',
//     externalLink: 'https://johnnydao.money',
//     description: 'The most magical NFT in the Bannyverse.',
//     criteria: 1,
//   },
//   {
//     NFT: '/assets/pina.png',
//     name: 'Pina reward',
//     externalLink: 'https://juicebox.money/#/peel',
//     description:
//       'An excellent character indeed! Use this in the Metaverse n shit',
//     criteria: 2,
//   },
// ]

export default function NFTRewardTiersList({
  rewardTiers,
  setRewardTiers,
}: {
  rewardTiers: NFTRewardTier[]
  setRewardTiers: (rewardTiers: NFTRewardTier[]) => void
}) {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {rewardTiers.map((_, index) => (
        <NFTRewardTierCard
          key={index}
          tierIndex={index}
          rewardTiers={rewardTiers}
          setRewardTiers={setRewardTiers}
        />
      ))}
    </Space>
  )
}
