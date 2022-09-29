import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import PayInputGroup from 'components/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/Project/ProjectHeader'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
// TODO: Do we still need lazy loading?
import VolumeChart from 'components/VolumeChart'

import { useContext, useEffect, useState } from 'react'

import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/ProjectQueuedFundingCycle'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/EditProjectDetailsTx'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useRouter } from 'next/router'
import { weightedAmount } from 'utils/v2v3/math'

import { useIsUserAddress } from 'hooks/IsUserAddress'

import { TextButton } from 'components/TextButton'
import V2BugNotice from 'components/V2BugNotice'
import { CurrencyContext } from 'contexts/currencyContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { CurrencyOption } from 'models/currencyOption'
import { featureFlagEnabled } from 'utils/featureFlags'
import { fromWad } from 'utils/format/formatNumber'
import { v2v3ProjectRoute } from 'utils/routes'

import { V2V3_PROJECT_IDS } from 'constants/v2v3/projectIds'
import { RelaunchFundingCycleBanner } from './banners/RelaunchFundingCycleBanner'
import NewDeployModal from './modals/NewDeployModal'
import { V2V3DownloadActivityModal } from './modals/V2V3ProjectTokenBalancesModal/V2V3ProjectTokenBalancesModal'
import ProjectActivity from './ProjectActivity'
import TreasuryStats from './TreasuryStats'
import { V2V3FundingCycleSection } from './V2V3FundingCycleSection'
import V2ManageTokensSection from './V2V3ManageTokensSection'
import V2PayButton from './V2V3PayButton'
import { V2V3ProjectHeaderActions } from './V2V3ProjectHeaderActions/V2V3ProjectHeaderActions'

import { CV_V2 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { getNftRewardTier } from 'utils/nftRewards'
import { NftRewardsSection } from '../../NftRewards/NftRewardsSection'
import { NftPostPayModal } from '../shared/NftPostPayModal'

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
    loading,
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
  const {
    data: queuedFundingCycleResponse,
    loading: queuedFundingCycleLoading,
  } = useProjectQueuedFundingCycle({
    projectId,
  })
  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  const converter = useCurrencyConverter()
  const editV2ProjectDetailsTx = useEditProjectDetailsTx()
  const hasEditPermission = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )
  const isOwner = useIsUserAddress(projectOwnerAddress)

  const colSizeMd = singleColumnLayout ? 24 : 12

  const allFundingCyclesLoading =
    loading.fundingCycleLoading || queuedFundingCycleLoading
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const hasQueuedFundingCycle = queuedFundingCycle?.number.gt(0)
  const showRelaunchFundingCycleBanner =
    !allFundingCyclesLoading &&
    !hasCurrentFundingCycle &&
    !hasQueuedFundingCycle &&
    cv === CV_V2 &&
    canReconfigureFundingCycles

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
      {showRelaunchFundingCycleBanner && <RelaunchFundingCycleBanner />}

      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
        isArchived={isArchived}
        handle={handle}
        projectOwnerAddress={projectOwnerAddress}
        canEditProjectHandle={canEditProjectHandle}
        projectId={projectId}
      />
      {!isPreviewMode &&
        hasCurrentFundingCycle === false &&
        hasQueuedFundingCycle === false &&
        cv === CV_V2 && <V2BugNotice />}
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
        owner={projectOwnerAddress}
        projectMetadata={projectMetadata}
        projectName={projectMetadata?.name}
        hasEditPermissions={hasEditPermission}
        visible={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
        storeCidTx={editV2ProjectDetailsTx}
      />
    </Space>
  )
}
