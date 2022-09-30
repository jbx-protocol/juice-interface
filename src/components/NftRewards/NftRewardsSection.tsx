import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import SectionHeader from 'components/SectionHeader'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { NftRewardTier } from 'models/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { getNftRewardTier, MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'

import { usePayProjectForm } from 'components/Project/PayProjectForm/usePayProjectForm'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { CurrencyContext } from 'contexts/currencyContext'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { fromWad } from 'utils/format/formatNumber'
import { RewardTier } from './RewardTier'

function RewardTiersLoadingSkeleton() {
  const isMobile = useMobile()

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

export function NftRewardsSection() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    nftRewards: { CIDs, rewardTiers, loading: nftsLoading },
  } = useContext(NftRewardsContext)
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)
  const converter = useCurrencyConverter()
  const { payAmount, payInCurrency, setPayAmount, setPayInCurrency } =
    usePayProjectForm()

  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

  const [selectedIndex, setSelectedIndex] = useState<number>()

  const isMobile = useMobile()

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

    const handleSelected = () => {
      setSelectedIndex(index)
      setPayAmount(rewardTier.contributionFloor.toString())
      setPayInCurrency(ETH)
    }

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
          onClick={handleSelected}
        />
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
      {nftsLoading ? (
        <RewardTiersLoadingSkeleton />
      ) : (
        <Row style={{ marginTop: '15px' }} gutter={isMobile ? 8 : 24}>
          {rewardTiers?.map(renderRewardTier)}
        </Row>
      )}
    </div>
  )
}
