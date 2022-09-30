import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import PayInputGroup from 'components/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/Project/ProjectHeader'
import { TextButton } from 'components/TextButton'
import { V2BugNoticeBanner } from 'components/v2v3/V2V3Project/banners/V2BugNoticeBanner'
import VolumeChart from 'components/VolumeChart'
import { CV_V2 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { V2V3_PROJECT_IDS } from 'constants/v2v3/projectIds'
import { CurrencyContext } from 'contexts/currencyContext'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/ProjectQueuedFundingCycle'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { CurrencyOption } from 'models/currencyOption'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { fromWad } from 'utils/format/formatNumber'
import { getNftRewardTier } from 'utils/nftRewards'
import { v2v3ProjectRoute } from 'utils/routes'
import { weightedAmount } from 'utils/v2v3/math'
import { NftRewardsSection } from '../../NftRewards/NftRewardsSection'
import { NftPostPayModal } from '../shared/NftPostPayModal'
import { RelaunchFundingCycleBanner } from './banners/RelaunchFundingCycleBanner'
import NewDeployModal from './modals/NewDeployModal'
import { V2V3DownloadActivityModal } from './modals/V2V3ProjectTokenBalancesModal/V2V3ProjectTokenBalancesModal'
import ProjectActivity from './ProjectActivity'
import TreasuryStats from './TreasuryStats'
import { V2V3FundingCycleSection } from './V2V3FundingCycleSection'
import V2ManageTokensSection from './V2V3ManageTokensSection'
import V2PayButton from './V2V3PayButton'
import { V2V3ProjectHeaderActions } from './V2V3ProjectHeaderActions/V2V3ProjectHeaderActions'

const GUTTER_PX = 40

const AllAssetsButton = ({ onClick }: { onClick: VoidFunction }) => {
  return (
    <TextButton
      onClick={onClick}
      style={{ fontWeight: 400, fontSize: '0.8rem' }}
    >
      <Trans>All assets</Trans>
    </TextButton>
  )
}

export function V2V3Project({
  singleColumnLayout,
}: {
  singleColumnLayout?: boolean
}) {
  const {
    createdAt,
    fundingCycle,
    fundingCycleMetadata,
    isPreviewMode,
    tokenSymbol,
    tokenAddress,
    projectOwnerAddress,
    handle,
  } = useContext(V2V3ProjectContext)
  const { projectMetadata, isArchived, projectId, cv } = useContext(
    ProjectMetadataContext,
  )
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const [newDeployModalVisible, setNewDeployModalVisible] =
    useState<boolean>(false)
  const [nftPostPayModalVisible, setNftPostPayModalVisible] =
    useState<boolean>(false)

  const [balancesModalVisible, setBalancesModalVisible] =
    useState<boolean>(false)
  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<CurrencyOption>(ETH)

  // Checks URL to see if user was just directed from project deploy
  const { replace: routerReplace, query } = useRouter()

  /**
   * When the router is ready,
   * check if the user was just redirected from:
   * - project deploy, or;
   * - successful NFT rewards payment.
   *
   * This should only run once: on initial load.
   *
   * The reason for this useEffect is because `query` doesn't appear to
   * update when `router.replace` is called to remove the query params.
   */
  useEffect(() => {
    if (query.newDeploy === 'true') {
      setNewDeployModalVisible(true)
    }
    if (query.nftPurchaseConfirmed === 'true') {
      setNftPostPayModalVisible(true)
    }
  }, [query])

  const isMobile = useMobile()
  const canReconfigureFundingCycles = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )
  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })
  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  const converter = useCurrencyConverter()

  const isOwner = useIsUserAddress(projectOwnerAddress)

  const colSizeMd = singleColumnLayout ? 24 : 12

  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const hasQueuedFundingCycle = queuedFundingCycle?.number.gt(0)

  // If a V2 project has no current or queued FC, we assume that
  // it's because it's using the old bugged contracts.
  // TODO probably should check the contract address instead.
  const showV2BugNoticeBanner =
    !isPreviewMode &&
    cv === CV_V2 &&
    hasCurrentFundingCycle === false &&
    hasQueuedFundingCycle === false

  const showRelaunchFundingCycleBanner =
    showV2BugNoticeBanner && canReconfigureFundingCycles

  const canEditProjectHandle = isOwner && !isPreviewMode && !handle

  const nftRewardsEnabled = featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)

  const {
    nftRewards: { rewardTiers: nftRewardTiers },
  } = useContext(NftRewardsContext)
  const hasNftRewards = Boolean(nftRewardTiers?.length)
  const showNftSection = nftRewardsEnabled && hasNftRewards

  const isEligibleForNft =
    nftRewardTiers && payAmount
      ? Boolean(
          getNftRewardTier({
            nftRewardTiers: nftRewardTiers,
            payAmountETH: parseFloat(payAmount),
          }),
        )
      : false

  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

  if (projectId === undefined) return null

  // Change URL without refreshing page
  const removeQueryParams = () => {
    // `Next` `query.nftPurchaseConfirmed` not updating unless a new
    // `nftPurchaseConfirmed` value is given
    const newQuery: Record<string, string> = {}
    Object.keys(query).forEach((key: string) => {
      if (key !== 'projectId') {
        newQuery[key] = 'null'
      }
    })

    routerReplace(
      {
        pathname: v2v3ProjectRoute({ projectId }),
        query: newQuery,
      },
      undefined,
      { shallow: true },
    )
  }

  const closeNewDeployModal = () => {
    removeQueryParams()
    setNewDeployModalVisible(false)
  }

  const closeNftPostPayModal = () => {
    removeQueryParams()
    setNftPostPayModalVisible(false)
  }

  // Temporarily disable pay for V2 projects until V2 contracts have been redeployed
  const payIsDisabledPreV2Redeploy = () => {
    // Do not disable pay for projects with these ids
    const exceptionProjectIds = [V2V3_PROJECT_IDS.MOON_MARS]

    if (exceptionProjectIds.includes(projectId)) return false

    // disable if there's no current funding cycle
    return !hasCurrentFundingCycle
  }

  const handleNftSelected = (payAmountETH: string) => {
    setPayAmount(payAmountETH)
    setPayInCurrency(ETH)
  }

  return (
    <Space direction="vertical" size={GUTTER_PX} style={{ width: '100%' }}>
      {showV2BugNoticeBanner || showRelaunchFundingCycleBanner ? (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {showV2BugNoticeBanner && <V2BugNoticeBanner />}
          {showRelaunchFundingCycleBanner && <RelaunchFundingCycleBanner />}
        </Space>
      ) : null}

      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
        isArchived={isArchived}
        handle={handle}
        projectOwnerAddress={projectOwnerAddress}
        canEditProjectHandle={canEditProjectHandle}
        projectId={projectId}
      />

      <Row gutter={GUTTER_PX} align={'bottom'}>
        <Col md={colSizeMd} xs={24}>
          <TreasuryStats />
          <div style={{ textAlign: 'right' }}>
            <AllAssetsButton onClick={() => setBalancesModalVisible(true)} />
          </div>
        </Col>
        <Col md={colSizeMd} xs={24}>
          <PayInputGroup
            payAmountETH={payAmount}
            onPayAmountChange={setPayAmount}
            payInCurrency={payInCurrency}
            onPayInCurrencyChange={setPayInCurrency}
            PayButton={V2PayButton}
            reservedRate={fundingCycleMetadata?.reservedRate.toNumber()}
            weight={fundingCycle?.weight}
            weightingFn={weightedAmount}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            disabled={isPreviewMode || payIsDisabledPreV2Redeploy()}
            isEligibleForNft={isEligibleForNft}
          />
          {(isMobile && showNftSection) || isPreviewMode ? (
            <div style={{ marginTop: '30px' }}>
              <NftRewardsSection
                payAmountETH={payAmountETH}
                onNftSelected={handleNftSelected}
              />
            </div>
          ) : null}
        </Col>
      </Row>
      <Row gutter={GUTTER_PX}>
        <Col md={colSizeMd} xs={24}>
          <Space
            direction="vertical"
            size={GUTTER_PX}
            style={{ width: '100%' }}
          >
            {!isPreviewMode ? (
              <VolumeChart
                style={{ height: 240 }}
                createdAt={createdAt}
                projectId={projectId}
                cv={CV_V2}
              />
            ) : null}
            <V2ManageTokensSection />
            <V2V3FundingCycleSection />
          </Space>
        </Col>

        {!isPreviewMode ? (
          <Col
            md={colSizeMd}
            xs={24}
            style={{ marginTop: isMobile ? GUTTER_PX : 0 }}
          >
            <Space size="large" direction="vertical" style={{ width: '100%' }}>
              {!isMobile && showNftSection ? (
                <NftRewardsSection
                  payAmountETH={payAmountETH}
                  onNftSelected={handleNftSelected}
                />
              ) : null}
              <ProjectActivity />
            </Space>
          </Col>
        ) : null}
      </Row>
      <NewDeployModal
        visible={newDeployModalVisible}
        onClose={closeNewDeployModal}
      />
      {projectMetadata?.nftPaymentSuccessModal?.content ? (
        <NftPostPayModal
          visible={nftPostPayModalVisible}
          onClose={closeNftPostPayModal}
          config={projectMetadata.nftPaymentSuccessModal}
        />
      ) : null}
      <V2V3DownloadActivityModal
        visible={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
      />
    </Space>
  )
}
