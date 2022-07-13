import { Space } from 'antd'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useEffect, useState } from 'react'
import { getNftRewardTier, MOCK_NFTs } from 'utils/v2/nftRewards'

import { RewardTier } from './RewardTier'

export function NftRewardsSection({
  payAmountETH,
  onPayAmountChange,
}: {
  payAmountETH: string
  onPayAmountChange: (payAmount: string) => void
}) {
  // const {
  //   nftRewardTiers TODO (when NFT contracts are available)
  // } = useContext(V2ProjectContext)

  const [selectedIndex, setSelectedIndex] = useState<number>()

  const nftRewardTiers = MOCK_NFTs

  if (!nftRewardTiers || nftRewardTiers.length < 1) return null

  const renderRewardTier = (rewardTier: NftRewardTier, index: number) => {
    const isSelected = index === selectedIndex
    return (
      <RewardTier
        key={`${rewardTier.paymentThreshold}-${rewardTier.name}`}
        rewardTier={rewardTier}
        rewardTierUpperLimit={nftRewardTiers[index + 1]?.paymentThreshold}
        isSelected={isSelected}
        onClick={() => {
          setSelectedIndex(isSelected ? undefined : index)
          onPayAmountChange(
            isSelected ? '0' : rewardTier.paymentThreshold.toString(),
          )
        }}
      />
    )
  }

  useEffect(() => {
    const highestEligibleRewardTier = getNftRewardTier({
      nftRewardTiers,
      payAmountETH: parseFloat(payAmountETH),
    })

    // set selected as highest reward tier above a certain amount
    if (highestEligibleRewardTier) {
      setSelectedIndex(nftRewardTiers.indexOf(highestEligibleRewardTier))
    } else {
      setSelectedIndex(undefined)
    }
  }, [payAmountETH, nftRewardTiers])

  return (
    <div style={{ marginTop: 5 }}>
      <div style={{ fontSize: '0.7rem' }}>+ NFT</div>
      <Space size={'large'}>{nftRewardTiers.map(renderRewardTier)}</Space>
    </div>
  )
}
