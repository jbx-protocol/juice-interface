import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import {
  NftPostPayModal,
  NFT_PAYMENT_CONFIRMED_QUERY_PARAM,
} from 'components/NftRewards/NftPostPayModal'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import SectionHeader from 'components/SectionHeader'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { CurrencyContext } from 'contexts/currencyContext'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { NftRewardTier } from 'models/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { fromWad } from 'utils/format/formatNumber'
import { getNftRewardTier, MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import { useModalFromUrlQuery } from '../modals/hooks/useModalFromUrlQuery'
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

function Header() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <>
      <SectionHeader
        text={t`Unlockable NFT rewards`}
        style={{ marginBottom: 0 }}
      />
      <span
        style={{
          color: colors.text.tertiary,
          fontSize: '0.75rem',
        }}
      >
        <Trans>Contribute to unlock an NFT reward.</Trans>
      </span>
    </>
  )
}

export function NftRewardsSection() {
  const {
    nftRewards: { CIDs, rewardTiers },
    loading: nftsLoading,
  } = useContext(NftRewardsContext)
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)
  const { form: payProjectForm } = useContext(PayProjectFormContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const { payAmount, payInCurrency, setPayAmount, setPayInCurrency } =
    payProjectForm ?? {}
  const [selectedIndex, setSelectedIndex] = useState<number>()

  const { visible: nftPostPayModalVisible, hide: hideNftPostPayModal } =
    useModalFromUrlQuery(NFT_PAYMENT_CONFIRMED_QUERY_PARAM)

  const converter = useCurrencyConverter()
  const isMobile = useMobile()
  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

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

  const handleSelected = (rewardTier: NftRewardTier, idx: number) => {
    setSelectedIndex(idx)
    setPayAmount?.(rewardTier.contributionFloor.toString())
    setPayInCurrency?.(ETH)
  }

  const nftRewardsEnabled = featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)
  const hasCIDs = Boolean(CIDs?.length)

  if (!hasCIDs || !nftRewardsEnabled) {
    return null
  }

  const renderRewardTiers = [...(rewardTiers ?? [])]?.sort(
    (a, b) => a.contributionFloor - b.contributionFloor,
  )

  return (
    <div style={{ width: 'unset' }}>
      <Header />

      {nftsLoading ? (
        <RewardTiersLoadingSkeleton />
      ) : (
        <Row style={{ marginTop: '15px' }} gutter={isMobile ? 8 : 24}>
          {renderRewardTiers?.map((rewardTier, idx) => (
            <Col
              md={8}
              xs={8}
              key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
            >
              <RewardTier
                tierRank={idx + 1}
                rewardTier={rewardTier}
                rewardTierUpperLimit={rewardTiers?.[idx + 1]?.contributionFloor}
                isSelected={idx === selectedIndex}
                onClick={() => handleSelected(rewardTier, idx)}
              />
            </Col>
          ))}
        </Row>
      )}

      {projectMetadata?.nftPaymentSuccessModal?.content && (
        <NftPostPayModal
          open={nftPostPayModalVisible}
          onClose={hideNftPostPayModal}
          config={projectMetadata.nftPaymentSuccessModal}
        />
      )}
    </div>
  )
}
