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
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { useContext } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { hasNftRewards, sumTierFloors } from 'utils/nftRewards'
import { useModalFromUrlQuery } from '../modals/hooks/useModalFromUrlQuery'
import { NftTierCard } from './NftTierCard'

function RewardTiersLoadingSkeleton() {
  const isMobile = useMobile()

  return (
    <Row className="mt-4" gutter={isMobile ? 8 : 24}>
      {[...Array(3)]?.map((_, index) => (
        <Col md={8} xs={8} key={`rewardTierLoading-${index}`}>
          <NftTierCard loading />
        </Col>
      ))}
    </Row>
  )
}

function Header() {
  return (
    <>
      <SectionHeader className="mb-0" text={t`Unlockable NFTs`} />
      <span className="text-xs text-grey-500 dark:text-grey-300">
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
  const isMobile = useMobile()

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

  const handleTierDeselect = (tierId: number | undefined) => {
    if (tierId === undefined || !rewardTiers || !payMetadata) return
    const idxToRemove = payMetadata.tierIdsToMint.indexOf(tierId)
    const newSelectedTierIds = payMetadata.tierIdsToMint
    newSelectedTierIds.splice(idxToRemove, 1)

    setPayMetadata?.({
      tierIdsToMint: newSelectedTierIds,
    })

    const newPayAmount = sumTierFloors(
      rewardTiers,
      newSelectedTierIds,
    ).toString()

    setPayAmount?.(newPayAmount)
    validatePayAmount?.(newPayAmount)
  }

  const handleTierSelect = (tierId: number | undefined) => {
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
    <Space direction="vertical" size="large" className="w-full">
      <Header />

      {nftsLoading ? (
        <RewardTiersLoadingSkeleton />
      ) : (
        <div
          className={
            // hax to make scrollbars look nice
            '-mt-3 -ml-3 -mr-5 max-h-[950px] overflow-auto pb-3 pt-3 pl-3 pr-5 md:max-h-[620px]'
          }
        >
          <Row gutter={isMobile ? 12 : 24}>
            {renderRewardTiers?.map(rewardTier => (
              <Col
                className="mb-4"
                md={8}
                xs={12}
                key={`${rewardTier.contributionFloor}-${rewardTier.name}`}
              >
                <NftTierCard
                  rewardTier={rewardTier}
                  quantitySelected={
                    payMetadata?.tierIdsToMint.filter(
                      id => id === rewardTier.id ?? -1,
                    ).length
                  }
                  maxQuantity={rewardTier.remainingSupply}
                  onClick={() => handleTierSelect(rewardTier.id)}
                  onRemove={() => handleTierDeselect(rewardTier.id)}
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
