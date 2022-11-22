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
import { useContext } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { hasNftRewards, sumTierFloors } from 'utils/nftRewards'

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

  const { visible: nftPostPayModalVisible, hide: hideNftPostPayModal } =
    useModalFromUrlQuery(NFT_PAYMENT_CONFIRMED_QUERY_PARAM)
  const {
    payAmount,
    payMetadata,
    payInCurrency,
    setPayAmount,
    setPayInCurrency,
    setPayMetadata,
    validatePayAmount,
  } = payProjectForm ?? {}

  const converter = useCurrencyConverter()
  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

  const onTierDeselect = (tierId: number | undefined) => {
    // Note: We don't reset the pay amount on deselecting to allow the user to make a payment without minting a NFT

    if (tierId === undefined || !rewardTiers || !payMetadata) return

    const newSelectedTierIds = [...payMetadata.tierIdsToMint].filter(
      selectedTierId => selectedTierId !== tierId,
    )

    setPayMetadata?.({
      tierIdsToMint: newSelectedTierIds,
      dontMint: !newSelectedTierIds.length,
    })
  }

  const onTierSelect = (tierId: number | undefined) => {
    if (!tierId || !rewardTiers) return

    const newSelectedTierIds = [...(payMetadata?.tierIdsToMint ?? []), tierId]
    setPayMetadata?.({
      tierIdsToMint: newSelectedTierIds,
      dontMint: false,
    })

    setPayInCurrency?.(ETH)

    // sets pay input when selected nft's sum to greater than the current pay input amount
    const sumSelectedTiers = sumTierFloors(rewardTiers, newSelectedTierIds)
    if (sumSelectedTiers > parseFloat(payAmountETH ?? '0')) {
      const newPayAmount = sumSelectedTiers.toString()
      setPayAmount?.(newPayAmount)
      validatePayAmount?.(newPayAmount)
    }
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
                  isSelected={payMetadata?.tierIdsToMint.includes(
                    rewardTier.id ?? -1,
                  )}
                  onClick={() => onTierSelect(rewardTier.id)}
                  onRemove={() => onTierDeselect(rewardTier.id)}
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
