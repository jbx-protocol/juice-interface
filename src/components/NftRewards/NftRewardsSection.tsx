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
import { useCallback, useContext, useEffect, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import {
  getNftRewardTier,
  hasNftRewards,
  tierIdsFromTierIndices,
} from 'utils/nftRewards'
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

  const [selectedIndices, setSelectedIndices] = useState<number[]>([])

  const { visible: nftPostPayModalVisible, hide: hideNftPostPayModal } =
    useModalFromUrlQuery(NFT_PAYMENT_CONFIRMED_QUERY_PARAM)
  const {
    payAmount,
    payInCurrency,
    setPayAmount,
    setPayInCurrency,
    setPayMetadata,
    validatePayAmount,
  } = payProjectForm ?? {}

  const converter = useCurrencyConverter()
  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

  const tierIdsFromIndices = (indices: number[]) => {
    if (!rewardTiers) return []
    return tierIdsFromTierIndices({
      rewardTiers,
      indices,
    })
  }

  const sumSelectedTiers = (newSelectedIndices: number[]) => {
    return newSelectedIndices.reduce((subSum, index) => {
      return subSum + (rewardTiers?.[index]?.contributionFloor ?? 0)
    }, 0)
  }

  const selectTier = useCallback(
    (tierIndex: number) => {
      const tierId = rewardTiers?.[tierIndex]?.id
      if (tierId === undefined || !rewardTiers) return
      const newSelectedIndices = [...selectedIndices, tierIndex]
      setSelectedIndices(newSelectedIndices)
      setPayMetadata?.({
        tierIdsToMint: tierIdsFromIndices(newSelectedIndices),
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setPayMetadata, rewardTiers, selectedIndices],
  )

  const deselectTier = useCallback(
    tierIndex => {
      const selectedIndex = selectedIndices.indexOf(tierIndex)
      const newSelectedIndices =
        selectedIndices.length > 1
          ? [
              ...selectedIndices.slice(0, selectedIndex),
              ...selectedIndices.slice(selectedIndex + 1),
            ]
          : []

      setPayMetadata?.({
        tierIdsToMint: tierIdsFromIndices(newSelectedIndices),
      })
      setSelectedIndices(newSelectedIndices)

      const newPayAmount = sumSelectedTiers(newSelectedIndices).toString()
      setPayAmount?.(newPayAmount)
      validatePayAmount?.(newPayAmount)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setPayMetadata, selectedIndices],
  )

  // sets highest eligible NFT based on pay input amount when pay input amount increases from 0
  useEffect(() => {
    if (!rewardTiers || !payAmountETH || selectedIndices.length > 0) return

    const highestEligibleRewardTier = getNftRewardTier({
      nftRewardTiers: rewardTiers,
      payAmountETH: parseFloat(payAmountETH),
    })

    // set selected as highest reward tier above a certain amount
    if (highestEligibleRewardTier) {
      selectTier(rewardTiers.indexOf(highestEligibleRewardTier))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndices, payAmountETH])

  // sets pay input when selected nft's sum to greater than the current pay input amount
  useEffect(() => {
    if (sumSelectedTiers(selectedIndices) > parseFloat(payAmountETH ?? '0')) {
      const newPayAmount = sumSelectedTiers(selectedIndices).toString()
      setPayAmount?.(newPayAmount)
      validatePayAmount?.(newPayAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndices])

  // deselects nft's when pay input amount is changed and drops below the sum of the nft amounts
  useEffect(() => {
    if (
      selectedIndices.length > 0 &&
      parseFloat(payAmountETH ?? '0') < sumSelectedTiers(selectedIndices)
    ) {
      setSelectedIndices([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payAmountETH])

  const handleSelected = (idx: number) => {
    selectTier(idx)
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
                  tierRank={idx + 1}
                  rewardTier={rewardTier}
                  rewardTierUpperLimit={
                    rewardTiers?.[idx + 1]?.contributionFloor
                  }
                  isSelected={selectedIndices.includes(idx)}
                  onClick={() => handleSelected(idx)}
                  onRemove={() => deselectTier(idx)}
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
