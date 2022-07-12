import { NFTRewardTier } from 'models/v2/nftRewardTier'
import { useEffect, useState } from 'react'
import { getNFTRewardTier, MOCK_NFTs } from 'utils/v2/nftRewards'

import { RewardTier } from './RewardTier'

export function NFTRewardsSection({
  payAmount,
  setPayAmount,
}: {
  payAmount: string
  setPayAmount: (payAmount: string) => void
}) {
  // const {
  //   nftRewardTiers TODO (when NFT contracts are available)
  // } = useContext(V2ProjectContext)

  const [selectedIndex, setSelectedIndex] = useState<number>()

  const nftRewardTiers = MOCK_NFTs

  if (!nftRewardTiers || nftRewardTiers.length < 1) return null

  const renderRewardTier = (rewardTier: NFTRewardTier, index: number) => {
    const isSelected = index === selectedIndex
    return (
      <RewardTier
        key={index}
        rewardTier={rewardTier}
        nextRewardTier={nftRewardTiers[index + 1]}
        isSelected={isSelected}
        onClick={e => {
          e.stopPropagation()
          setSelectedIndex(isSelected ? undefined : index)
          setPayAmount(
            isSelected ? '0' : rewardTier.paymentThreshold.toString(),
          )
        }}
      />
    )
  }

  useEffect(() => {
    const highestEligibleRewardTier = getNFTRewardTier({
      nftRewardTiers,
      ethPayAmount: parseFloat(payAmount),
    })

    // set selected as highest reward tier above a certain amount
    if (highestEligibleRewardTier) {
      setSelectedIndex(nftRewardTiers.indexOf(highestEligibleRewardTier))
    } else {
      setSelectedIndex(undefined)
    }
  }, [payAmount, nftRewardTiers])

  return (
    <div style={{ marginTop: 5 }}>
      {/* <SectionHeader
        text={
          <TooltipLabel
            label={t`NFT rewards`}
            tip={t`Receive an NFT for contributing above a certain amount.`}
          />
        }
      /> */}
      <span style={{ fontSize: 12 }}>+NFT</span>
      <div
        style={{
          display: 'flex',
        }}
      >
        {nftRewardTiers.map(renderRewardTier)}
      </div>
    </div>
  )
}
