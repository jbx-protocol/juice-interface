import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import SectionHeader from 'components/SectionHeader'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { CurrencyContext } from 'contexts/currencyContext'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ThemeContext } from 'contexts/themeContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { NftRewardTier } from 'models/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { fromWad } from 'utils/format/formatNumber'
import { getNftRewardTier, MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
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
  const { form: payProjectForm } = useContext(PayProjectFormContext)
  const { payAmount, payInCurrency, setPayAmount, setPayInCurrency } =
    payProjectForm ?? {}

  const [selectedIndex, setSelectedIndex] = useState<number>()

  const converter = useCurrencyConverter()
  const isMobile = useMobile()

  const nftRewardsEnabled = featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)
  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

  const hasCIDs = Boolean(CIDs?.length)

  const handleSelected = (rewardTier: NftRewardTier, idx: number) => {
    setSelectedIndex(idx)
    setPayAmount?.(rewardTier.contributionFloor.toString())
    setPayInCurrency?.(ETH)
  }

  useEffect(() => {
    if (!rewardTiers || !payAmountETH) return

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

  if ((!hasCIDs && !nftsLoading) || !nftRewardsEnabled) {
    return null
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
          {rewardTiers
            ?.sort((a, b) => a.contributionFloor - b.contributionFloor)
            .map((rewardTier, idx) => (
              <Col
                md={8}
                xs={8}
                key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
              >
                <RewardTier
                  tierRank={idx + 1}
                  rewardTier={rewardTier}
                  rewardTierUpperLimit={rewardTiers[idx + 1]?.contributionFloor}
                  isSelected={idx === selectedIndex}
                  onClick={() => handleSelected(rewardTier, idx)}
                />
              </Col>
            ))}
        </Row>
      )}
    </div>
  )
}
