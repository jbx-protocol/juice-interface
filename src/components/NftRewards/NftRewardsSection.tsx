import { t, Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import {
  NftPostPayModal,
  NFT_PAYMENT_CONFIRMED_QUERY_PARAM,
} from 'components/NftRewards/NftPostPayModal'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import SectionHeader from 'components/SectionHeader'
import { CurrencyContext } from 'contexts/currencyContext'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { NftRewardTier } from 'models/nftRewardTier'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { getNftRewardTier, hasNftRewards } from 'utils/nftRewards'
import { useModalFromUrlQuery } from '../modals/hooks/useModalFromUrlQuery'
import { RewardTier } from './RewardTier'

function RewardTiersLoadingSkeleton() {
  const isMobile = useMobile()

  return (
    <Row style={{ marginTop: '15px' }} gutter={isMobile ? 8 : 24}>
      {[...Array(3)]?.map((_, index) => (
        <Col md={8} xs={8} key={`rewardTierLoading-${index}`}>
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
      <SectionHeader text={t`Unlockable NFTs`} style={{ marginBottom: 0 }} />
      <span
        style={{
          color: colors.text.tertiary,
          fontSize: '0.75rem',
        }}
      >
        <Trans>Contribute funds to receive NFTs.</Trans>
      </span>
    </>
  )
}

export function NftRewardsSection() {
  const {
    nftRewards: { rewardTiers },
    loading: nftsLoading,
  } = useContext(NftRewardsContext)
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)
  const { form: payProjectForm } = useContext(PayProjectFormContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const [selectedIndex, setSelectedIndex] = useState<number>()

  const { visible: nftPostPayModalVisible, hide: hideNftPostPayModal } =
    useModalFromUrlQuery(NFT_PAYMENT_CONFIRMED_QUERY_PARAM)
  const {
    payAmount,
    payInCurrency,
    setPayAmount,
    setPayInCurrency,
    setPayMetadata,
  } = payProjectForm ?? {}

  const converter = useCurrencyConverter()
  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

  const selectTier = useCallback(
    (tierIndex: number) => {
      const tierId = rewardTiers?.[tierIndex]?.id
      if (!tierId) return

      setPayMetadata?.({ tierIdsToMint: [tierId] })
      setSelectedIndex(tierIndex)
    },
    [setPayMetadata, rewardTiers],
  )

  const deselectTier = useCallback(() => {
    setPayAmount?.('0')
    setPayMetadata?.(undefined)
    setSelectedIndex(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPayMetadata])

  // sets highest eligible NFT based on pay input amount
  useEffect(() => {
    if (!rewardTiers || !payAmountETH) return

    // if the already selected tier's floor is equal to pay input, we dont want to change the selected tier
    if (
      selectedIndex !== undefined &&
      parseFloat(payAmountETH) === rewardTiers[selectedIndex].contributionFloor
    )
      return
    const highestEligibleRewardTier = getNftRewardTier({
      nftRewardTiers: rewardTiers,
      payAmountETH: parseFloat(payAmountETH),
    })

    // set selected as highest reward tier above a certain amount
    if (highestEligibleRewardTier) {
      selectTier(rewardTiers.indexOf(highestEligibleRewardTier))
    } else {
      deselectTier()
    }
  }, [payAmountETH, rewardTiers, deselectTier, selectTier, selectedIndex])

  const handleSelected = (rewardTier: NftRewardTier, idx: number) => {
    selectTier(idx)
    setPayAmount?.(rewardTier.contributionFloor.toString())
    setPayInCurrency?.(ETH)
  }

  if (!hasNftRewards(fundingCycleMetadata)) {
    return null
  }

  const renderRewardTiers = [...(rewardTiers ?? [])]?.sort(
    (a, b) => a.contributionFloor - b.contributionFloor,
  )

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Header />

      {nftsLoading ? (
        <RewardTiersLoadingSkeleton />
      ) : (
        <div
          style={{
            overflow: 'auto',
            maxHeight: 400,
            paddingBottom: '12px',
            // hax to make scrollbars look nice
            marginTop: '-12px',
            paddingTop: '12px',
            paddingLeft: '12px',
            marginLeft: '-12px',

            marginRight: '-20px',
            paddingRight: '20px',
          }}
        >
          <Row gutter={24}>
            {renderRewardTiers?.map((rewardTier, idx) => (
              <Col
                md={8}
                xs={8}
                key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
                style={{ marginBottom: '15px' }}
              >
                <RewardTier
                  rewardTier={rewardTier}
                  rewardTierUpperLimit={
                    rewardTiers?.[idx + 1]?.contributionFloor
                  }
                  isSelected={idx === selectedIndex}
                  onClick={() => handleSelected(rewardTier, idx)}
                  onRemove={deselectTier}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {projectMetadata?.nftPaymentSuccessModal?.content && (
        <NftPostPayModal
          open={nftPostPayModalVisible}
          onClose={hideNftPostPayModal}
          config={projectMetadata.nftPaymentSuccessModal}
        />
      )}
    </Space>
  )
}
