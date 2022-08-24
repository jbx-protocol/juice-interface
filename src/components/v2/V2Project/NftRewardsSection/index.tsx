import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import SectionHeader from 'components/SectionHeader'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useMobile from 'hooks/Mobile'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { getNftRewardTier } from 'utils/v2/nftRewards'

import { MAX_NFT_REWARD_TIERS } from 'components/v2/shared/FundingCycleConfigurationDrawers/NftDrawer'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { RewardTier } from './RewardTier'

export function NftRewardsSection({
  payAmountETH,
  onPayAmountChange,
}: {
  payAmountETH: string
  onPayAmountChange: (payAmount: string) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    nftRewards: { CIDs, rewardTiers, loading: nftsLoading },
  } = useContext(V2ProjectContext)

  const isMobile = useMobile()

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

  const hasCIDs = Boolean(CIDs?.length)

  if ((!hasCIDs && !nftsLoading) || !nftRewardsEnabled) {
    return null
  }

  const renderRewardTier = (rewardTier: NftRewardTier, index: number) => {
    const isSelected = index === selectedIndex
    if (!rewardTiers) return

    const nextRewardTier = rewardTiers[index + 1]

    return (
      <Col
        md={8}
        xs={8}
        key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
      >
        <RewardTier
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
      </Col>
    )
  }

  function RewardTiersLoadingSkeleton() {
    return (
      <Row style={{ marginTop: '15px' }} gutter={isMobile ? 8 : 24}>
        {[...Array(MAX_NFT_REWARD_TIERS)]?.map(index => (
          <Col md={8} xs={8} key={index}>
            <RewardTier loading />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <div style={{ width: 'unset' }}>
      <SectionHeader
        text={t`Unlockable NFT rewards`}
        style={{ marginBottom: 0 }}
      />
      <span
        style={{
          color: colors.text.tertiary,
          fontSize: '0.69rem',
        }}
      >
        <Trans>Contribute to unlock an NFT reward.</Trans>
      </span>
      {!nftsLoading ? (
        <Row style={{ marginTop: '15px' }} gutter={isMobile ? 8 : 24}>
          {rewardTiers?.map(renderRewardTier)}
        </Row>
      ) : (
        <RewardTiersLoadingSkeleton />
      )}
    </div>
  )
}
