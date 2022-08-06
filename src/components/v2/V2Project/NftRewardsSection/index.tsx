import { Col, Row } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { getNftRewardTier } from 'utils/v2/nftRewards'
import { t, Trans } from '@lingui/macro'
import SectionHeader from 'components/SectionHeader'
import { ThemeContext } from 'contexts/themeContext'

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
    theme: { colors },
  } = useContext(ThemeContext)
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

  const loading = nftsLoading || (CIDs.length && !rewardTiers?.length)

  const renderRewardTier = (rewardTier: NftRewardTier, index: number) => {
    const isSelected = index === selectedIndex
    const notEligible = rewardTier.contributionFloor > parseFloat(payAmountETH)
    if (!rewardTiers) return

    const nextRewardTier = rewardTiers[index + 1]

    return (
      <Col md={8} xs={8}>
        {!loading ? (
          <RewardTier
            key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
            rewardTier={rewardTier}
            rewardTierUpperLimit={nextRewardTier?.contributionFloor}
            isSelected={isSelected}
            notEligible={notEligible}
            onClick={() => {
              setSelectedIndex(isSelected ? undefined : index)
              onPayAmountChange(
                isSelected ? '0' : rewardTier.contributionFloor.toString(),
              )
            }}
          />
        ) : (
          <LoadingOutlined />
        )}
      </Col>
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
      {rewardTiers ? (
        <Row style={{ marginTop: '15px' }} gutter={24}>
          {rewardTiers.map(renderRewardTier)}
        </Row>
      ) : null}
    </div>
  )
}
