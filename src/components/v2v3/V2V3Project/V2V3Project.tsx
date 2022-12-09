import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import { useModalFromUrlQuery } from 'components/modals/hooks/useModalFromUrlQuery'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { TextButton } from 'components/TextButton'
import VolumeChart from 'components/VolumeChart'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { V2V3PayProjectFormProvider } from 'providers/v2v3/V2V3PayProjectFormProvider'
import { useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import { hasNftRewards } from 'utils/nftRewards'
import { NftRewardsSection } from '../../NftRewards/NftRewardsSection'
import { ProjectBanners } from './banners/ProjectBanners'
import { ManageNftsSection } from './ManageNftsSection/ManageNftsSection'
import NewDeployModal, { NEW_DEPLOY_QUERY_PARAM } from './modals/NewDeployModal'
import { V2V3ProjectTokenBalancesModal } from './modals/V2V3ProjectTokenBalancesModal/V2V3ProjectTokenBalancesModal'
import ProjectActivity from './ProjectActivity'
import TreasuryStats from './TreasuryStats'
import { V2V3FundingCycleSection } from './V2V3FundingCycleSection'
import { V2V3ManageTokensSection } from './V2V3ManageTokensSection'
import { V2V3ProjectHeaderActions } from './V2V3ProjectHeaderActions/V2V3ProjectHeaderActions'

const GUTTER_PX = 40

const AllAssetsButton = () => {
  const [balancesModalVisible, setBalancesModalVisible] =
    useState<boolean>(false)

  return (
    <>
      <TextButton onClick={() => setBalancesModalVisible(true)}>
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
    fundingCycleMetadata,
  } = useContext(V2V3ProjectContext)
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const { visible: newDeployModalVisible, hide: hideNewDeployModal } =
    useModalFromUrlQuery(NEW_DEPLOY_QUERY_PARAM)

  const isMobile = useMobile()
  const isOwner = useIsUserAddress(projectOwnerAddress)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  const canEditProjectHandle = isOwner && !isPreviewMode && !handle

  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)

  const payProjectFormDisabled =
    isPreviewMode || !hasCurrentFundingCycle || !isPrimaryETHTerminalValid

  const showNftSection = hasNftRewards(fundingCycleMetadata)

  const colSizeMd = isPreviewMode ? 24 : 12

  if (projectId === undefined) return null

  return (
    <Space direction="vertical" size={GUTTER_PX} className="w-full">
      <ProjectBanners />

      <ProjectHeader
        actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
        handle={handle}
        projectOwnerAddress={projectOwnerAddress}
        canEditProjectHandle={canEditProjectHandle}
      />

      <V2V3PayProjectFormProvider>
        <Space direction="vertical" size={GUTTER_PX} className="w-full">
          <Row className="gap-y-10" gutter={GUTTER_PX} align={'bottom'}>
            <Col md={colSizeMd} xs={24}>
              <section>
                <TreasuryStats />
                <div className="text-right">
                  <AllAssetsButton />
                </div>
              </section>
            </Col>

            <Col md={colSizeMd} xs={24}>
              <section>
                <PayProjectForm disabled={payProjectFormDisabled} />
              </section>
              {(isMobile && showNftSection) || isPreviewMode ? (
                <section className="mt-7">
                  <NftRewardsSection />
                </section>
              ) : null}
            </Col>
          </Row>

          <Row gutter={GUTTER_PX}>
            <Col md={colSizeMd} xs={24}>
              <Space direction="vertical" size={GUTTER_PX} className="w-full">
                {!isPreviewMode && pv ? (
                  <section>
                    <VolumeChart
                      // TODO: Change this
                      style={{ height: 240 }}
                      createdAt={createdAt}
                      projectId={projectId}
                      pv={pv}
                    />
                  </section>
                ) : null}
                <section>
                  <V2V3ManageTokensSection />
                </section>

                <ManageNftsSection />

                <section>
                  <V2V3FundingCycleSection />
                </section>
              </Space>
            </Col>

            {!isPreviewMode ? (
              <Col
                className={classNames(isMobile ? 'mt-10' : '')}
                md={colSizeMd}
                xs={24}
              >
                <div className="flex flex-col gap-12">
                  {!isMobile && showNftSection ? <NftRewardsSection /> : null}
                  <section>
                    <ProjectActivity />
                  </section>
                </div>
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
