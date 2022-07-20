import { Space } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { getNftRewardTier } from 'utils/v2/nftRewards'

import { RewardTier } from './RewardTier'
import { FEATURE_FLAGS } from 'constants/featureFlags'

export function NftRewardsSection({
  payAmountETH,
  onPayAmountChange,
}: {
  payAmountETH: string
  onPayAmountChange: (payAmount: string) => void
}) {
  const {
    nftRewards: { CIDs, rewardTiers, loading: nftsLoading },
  } = useContext(V2ProjectContext)

  const [selectedIndex, setSelectedIndex] = useState<number>()

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

  const nftRewardsEnabled = featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)

  if (!CIDs || CIDs.length < 1 || !nftRewardsEnabled) return null

  const renderRewardTier = (rewardTier: NftRewardTier, index: number) => {
    const isSelected = index === selectedIndex
    if (!rewardTiers) return

    const nextRewardTier = rewardTiers[index + 1]

    return (
      <RewardTier
        key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
        rewardTier={rewardTier}
        rewardTierUpperLimit={nextRewardTier?.contributionFloor}
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

  const loading = nftsLoading || (CIDs.length && !rewardTiers?.length)

  return (
    <div>
      <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>
        + NFT {loading && <LoadingOutlined />}
      </div>
      {!loading && rewardTiers && (
        <Space size="middle">{rewardTiers.map(renderRewardTier)}</Space>
      )}
    </div>
  )
}
