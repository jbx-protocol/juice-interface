import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import ProjectHeader from 'components/Project/ProjectHeader'
import { TextButton } from 'components/TextButton'
import VolumeChart from 'components/VolumeChart'
import { CV_V2 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { useRouter } from 'next/router'
import { V2V3PayProjectFormProvider } from 'providers/v2v3/V2V3PayProjectFormProvider'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { v2v3ProjectRoute } from 'utils/routes'
import { NftRewardsSection } from '../../NftRewards/NftRewardsSection'
import { NftPostPayModal } from '../shared/NftPostPayModal'
import { ProjectBanners } from './banners/ProjectBanners'
import NewDeployModal from './modals/NewDeployModal'
import { V2V3ProjectTokenBalancesModal } from './modals/V2V3ProjectTokenBalancesModal/V2V3ProjectTokenBalancesModal'
import ProjectActivity from './ProjectActivity'
import TreasuryStats from './TreasuryStats'
import { V2V3FundingCycleSection } from './V2V3FundingCycleSection'
import V2ManageTokensSection from './V2V3ManageTokensSection'
import { V2V3ProjectHeaderActions } from './V2V3ProjectHeaderActions/V2V3ProjectHeaderActions'

const GUTTER_PX = 40

const AllAssetsButton = () => {
  const [balancesModalVisible, setBalancesModalVisible] =
    useState<boolean>(false)

  return (
    <>
      <TextButton
        onClick={() => setBalancesModalVisible(true)}
        style={{ fontWeight: 400, fontSize: '0.8rem' }}
      >
        <Trans>All assets</Trans>
      </TextButton>
      <V2V3ProjectTokenBalancesModal
        visible={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
      />
    </>
  )
}

export function V2V3Project() {
  const {
    createdAt,
    fundingCycle,
    isPreviewMode,
    projectOwnerAddress,
    handle,
  } = useContext(V2V3ProjectContext)
  const { projectMetadata, isArchived, projectId } = useContext(
    ProjectMetadataContext,
  )
  const {
    nftRewards: { rewardTiers: nftRewardTiers },
  } = useContext(NftRewardsContext)

  const [newDeployModalVisible, setNewDeployModalVisible] =
    useState<boolean>(false)
  const [nftPostPayModalVisible, setNftPostPayModalVisible] =
    useState<boolean>(false)

  // Checks URL to see if user was just directed from project deploy
  const { replace: routerReplace, query } = useRouter()

  const isMobile = useMobile()
  const isOwner = useIsUserAddress(projectOwnerAddress)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  const canEditProjectHandle = isOwner && !isPreviewMode && !handle

  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)

  const payProjectFormDisabled =
    isPreviewMode || !hasCurrentFundingCycle || !isPrimaryETHTerminalValid

  const nftRewardsEnabled = featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)
  const hasNftRewards = Boolean(nftRewardTiers?.length)
  const showNftSection = nftRewardsEnabled && hasNftRewards

  const colSizeMd = isPreviewMode ? 24 : 12

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

  if (projectId === undefined) return null

  return (
    <Space direction="vertical" size={GUTTER_PX} style={{ width: '100%' }}>
      <ProjectBanners />

      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
        isArchived={isArchived}
        handle={handle}
        projectOwnerAddress={projectOwnerAddress}
        canEditProjectHandle={canEditProjectHandle}
        projectId={projectId}
      />

      <V2V3PayProjectFormProvider>
        <Space direction="vertical" size={GUTTER_PX} style={{ width: '100%' }}>
          <Row gutter={GUTTER_PX} align={'bottom'}>
            <Col md={colSizeMd} xs={24}>
              <TreasuryStats />
              <div style={{ textAlign: 'right' }}>
                <AllAssetsButton />
              </div>
            </Col>

            <Col md={colSizeMd} xs={24}>
              <PayProjectForm disabled={payProjectFormDisabled} />
              {(isMobile && showNftSection) || isPreviewMode ? (
                <div style={{ marginTop: '30px' }}>
                  <NftRewardsSection />
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
                <Space
                  size="large"
                  direction="vertical"
                  style={{ width: '100%' }}
                >
                  {!isMobile && showNftSection ? <NftRewardsSection /> : null}
                  <ProjectActivity />
                </Space>
              </Col>
            ) : null}
          </Row>
        </Space>
      </V2V3PayProjectFormProvider>

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
    </Space>
  )
}
