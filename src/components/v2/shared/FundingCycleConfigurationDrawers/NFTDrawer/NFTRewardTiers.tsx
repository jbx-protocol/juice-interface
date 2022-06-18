import { Space } from 'antd'
import { NFTRewardTier } from 'models/v2/nftRewardTier'

import NFTRewardTierCard from './NFTRewardTierCard'

export default function NFTRewardTiers({
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
