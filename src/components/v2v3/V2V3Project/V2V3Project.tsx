import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import ScrollToTopButton from 'components/buttons/ScrollToTopButton'
import { TextButton } from 'components/buttons/TextButton'
import { useModalFromUrlQuery } from 'components/modals/hooks/ModalFromUrlQuery'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { V2V3PayProjectFormProvider } from 'components/v2v3/V2V3Project/V2V3PayButton/V2V3ConfirmPayModal/V2V3PayProjectFormProvider'
import VolumeChart from 'components/VolumeChart'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'
import useMobile from 'hooks/Mobile'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import { NftRewardsSection } from '../../NftRewards/NftRewardsSection'
import { ProjectBanners } from './banners/ProjectBanners'
import { ManageNftsSection } from './ManageNftsSection/ManageNftsSection'
import NewDeployModal, { NEW_DEPLOY_QUERY_PARAM } from './modals/NewDeployModal'
import { V2V3ProjectTokenBalancesModal } from './modals/V2V3ProjectTokenBalancesModal'
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
  const { createdAt, fundingCycle, projectOwnerAddress, handle } =
    useContext(V2V3ProjectContext)
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const { visible: newDeployModalVisible, hide: hideNewDeployModal } =
    useModalFromUrlQuery(NEW_DEPLOY_QUERY_PARAM)

  const isMobile = useMobile()
  const { isConnected } = useWallet()
  const isOwner = useIsUserAddress(projectOwnerAddress)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  const canEditProjectHandle = isOwner && !handle

  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)

  const payProjectFormDisabled =
    !hasCurrentFundingCycle || !isPrimaryETHTerminalValid

  const { value: hasNftRewards } = useHasNftRewards()

  const colSizeMd = 12

  if (projectId === undefined) return null

  return (
    <Space direction="vertical" size={GUTTER_PX} className="w-full">
      <ProjectBanners />

      <ProjectHeader
        actions={<V2V3ProjectHeaderActions />}
        handle={handle}
        projectOwnerAddress={projectOwnerAddress}
        canEditProjectHandle={canEditProjectHandle}
      />

      <V2V3PayProjectFormProvider>
        <div className="my-0 mx-auto flex max-w-5xl flex-col gap-y-5 p-5">
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
              {isMobile && hasNftRewards ? (
                <section className="mt-7">
                  <NftRewardsSection />
                </section>
              ) : null}
            </Col>
          </Row>

          <Row gutter={GUTTER_PX}>
            <Col md={colSizeMd} xs={24}>
              <Space direction="vertical" size={GUTTER_PX} className="w-full">
                {pv ? (
                  <section>
                    <VolumeChart
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

                {hasNftRewards && isConnected ? (
                  <section>
                    <ManageNftsSection />
                  </section>
                ) : null}
                <section>
                  <V2V3FundingCycleSection />
                </section>
              </Space>
            </Col>

            <Col
              className={classNames(isMobile ? 'mt-10' : '')}
              md={colSizeMd}
              xs={24}
            >
              <div className="flex flex-col gap-12">
                {!isMobile && hasNftRewards ? <NftRewardsSection /> : null}
                <section>
                  <ProjectActivity />
                </section>
              </div>
            </Col>
          </Row>

          <div className="mt-12 text-center">
            <ScrollToTopButton />
          </div>
        </div>
      </V2V3PayProjectFormProvider>

      <NewDeployModal
        open={newDeployModalVisible}
        onClose={hideNewDeployModal}
      />
    </Space>
  )
}
