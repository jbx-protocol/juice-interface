import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import { useModalFromUrlQuery } from 'components/modals/hooks/useModalFromUrlQuery'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { TextButton } from 'components/TextButton'
import VolumeChart from 'components/VolumeChart'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { V2V3PayProjectFormProvider } from 'providers/v2v3/V2V3PayProjectFormProvider'
import { useContext, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { NftRewardsSection } from '../../NftRewards/NftRewardsSection'
import { ProjectBanners } from './banners/ProjectBanners'
import NewDeployModal, { NEW_DEPLOY_QUERY_PARAM } from './modals/NewDeployModal'
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
        open={balancesModalVisible}
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
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const {
    nftRewards: { rewardTiers: nftRewardTiers },
  } = useContext(NftRewardsContext)

  const { visible: newDeployModalVisible, hide: hideNewDeployModal } =
    useModalFromUrlQuery(NEW_DEPLOY_QUERY_PARAM)

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

  if (projectId === undefined) return null

  return (
    <Space direction="vertical" size={GUTTER_PX} style={{ width: '100%' }}>
      <ProjectBanners />

      <ProjectHeader
        actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
        handle={handle}
        projectOwnerAddress={projectOwnerAddress}
        canEditProjectHandle={canEditProjectHandle}
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
                {!isPreviewMode && cv ? (
                  <VolumeChart
                    style={{ height: 240 }}
                    createdAt={createdAt}
                    projectId={projectId}
                    cv={cv}
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
        open={newDeployModalVisible}
        onClose={hideNewDeployModal}
      />
    </Space>
  )
}
