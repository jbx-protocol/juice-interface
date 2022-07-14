import { Space } from 'antd'
import Loading from 'components/Loading'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { getNftRewardTier } from 'utils/v2/nftRewards'

import { RewardTier } from './RewardTier'

export function NftRewardsSection({
  payAmountETH,
  onPayAmountChange,
}: {
  payAmountETH: string
  onPayAmountChange: (payAmount: string) => void
}) {
  const {
    nftRewards: { CIDs, rewardTiers },
  } = useContext(V2ProjectContext)

  const [selectedIndex, setSelectedIndex] = useState<number>()

  // const nftRewardTiers = MOCK_NFTs

  if (!rewardTiers || rewardTiers.length < 1) return null

  const renderRewardTier = (rewardTier: NftRewardTier, index: number) => {
    const isSelected = index === selectedIndex
    return (
      <RewardTier
        key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
        rewardTier={rewardTier}
        rewardTierUpperLimit={rewardTiers[index + 1]?.contributionFloor}
        isSelected={isSelected}
        onClick={() => {
          setSelectedIndex(isSelected ? undefined : index)
          onPayAmountChange(
            isSelected ? '0' : rewardTier.contributionFloor.toString(),
          )
        }}
      />
    )
  }

  useEffect(() => {
    if (!rewardTiers) return
    const highestEligibleRewardTier = getNftRewardTier({
      nftRewardTiers: rewardTiers,
      payAmountETH: parseFloat(payAmountETH),
    })

    // set selected as highest reward tier above a certain amount
    if (highestEligibleRewardTier) {
      setSelectedIndex(rewardTiers.indexOf(highestEligibleRewardTier))
    } else {
      setSelectedIndex(undefined)
    }
  }, [payAmountETH, rewardTiers])

  return (
    <div style={{ marginTop: 5 }}>
      <div style={{ fontSize: '0.7rem' }}>+ NFT</div>
      {CIDs && !rewardTiers.length ? (
        <Loading />
      ) : (
        <Space size={'large'}>{rewardTiers.map(renderRewardTier)}</Space>
      )}
    </div>
  )
}
