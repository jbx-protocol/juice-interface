import { LoadingOutlined } from '@ant-design/icons'
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

import { FEATURE_FLAGS } from 'constants/featureFlags'
import { CurrencyContext } from 'contexts/currencyContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currencyOption'
import { parseWad } from 'utils/formatNumber'
import { RewardTier } from './RewardTier'

export function NftRewardsSection({
  payAmountETH,
  payInCurrency,
  onPayAmountChange,
}: {
  payAmountETH: string
  payInCurrency: CurrencyOption
  onPayAmountChange: (payAmount: string) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    currencies: { USD },
  } = useContext(CurrencyContext)
  const converter = useCurrencyConverter()

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

  if (!CIDs || CIDs.length < 1 || !nftRewardsEnabled) return null

  const loading = nftsLoading || (CIDs.length && !rewardTiers?.length)

  const renderRewardTier = (rewardTier: NftRewardTier, index: number) => {
    const isSelected = index === selectedIndex
    if (!rewardTiers) return

    const nextRewardTier = rewardTiers[index + 1]

    const handleSelected = () => {
      setSelectedIndex(index)
      // update pay input with NFT's contribution floor
      onPayAmountChange(
        (payInCurrency === USD // convert to USD if USD selected in pay input
          ? converter
              .weiToUsd(parseWad(rewardTier.contributionFloor))
              ?.add(1) //-> adds 1USD to ensure ETH amount is above the contributionFloor
              ?.toNumber() ?? 0
          : rewardTier.contributionFloor
        ).toString(),
      )
    }

    return (
      <Col
        md={8}
        xs={8}
        key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
      >
        {!loading ? (
          <RewardTier
            rewardTier={rewardTier}
            rewardTierUpperLimit={nextRewardTier?.contributionFloor}
            isSelected={isSelected}
            onClick={handleSelected}
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
        <Row style={{ marginTop: '15px' }} gutter={isMobile ? 8 : 24}>
          {rewardTiers.map(renderRewardTier)}
        </Row>
      ) : null}
    </div>
  )
}
