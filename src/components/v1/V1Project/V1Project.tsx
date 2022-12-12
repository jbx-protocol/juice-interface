import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Row, Skeleton } from 'antd'
import { Callout } from 'components/Callout'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { useRelaunchV1ViaV3Create } from 'hooks/v1/RelaunchV1ViaV3Create'
import { V1OperatorPermission } from 'models/v1/permissions'
import Link from 'next/link'
import { V1PayProjectFormProvider } from 'providers/v1/V1PayProjectFormProvider'
import { lazy, Suspense, useContext, useState } from 'react'
import FundingCycles from './FundingCycles'
import ProjectActivity from './ProjectActivity'
import { TokensSection } from './TokensSection'
import { TreasuryStatsSection } from './TreasuryStatsSection'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'

const VolumeChart = lazy(() => import('components/VolumeChart'))

const gutter = 40

const RelaunchV1ProjectCallout = ({ className }: { className?: string }) => {
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const { isReady, relaunch } = useRelaunchV1ViaV3Create()
  const isLoading = !isReady

  const hasUpgradePermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.Configure,
  )

  if (isHidden || !hasUpgradePermission) {
    return null
  }

  return (
    <Callout.Info className={className} collapsible={false}>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <strong>
            <Trans>Upgrade to V3</Trans>
          </strong>
          <p>
            <Trans>
              Re-launch your Juicebox project using the v3 contracts.{' '}
              {/* TODO: Add link */}
              <Link href="#TODO">What's new in V3.</Link>
            </Trans>
          </p>
          {isLoading ? (
            <Skeleton.Button active className="w-40" />
          ) : (
            <Button className="max-w-min" type="primary" onClick={relaunch}>
              <Trans>Re-launch project</Trans>
            </Button>
          )}
        </div>
        <CloseOutlined
          className="h-11 w-11"
          onClick={() => setIsHidden(true)}
        />
      </div>
    </Callout.Info>
  )
}

export function V1Project({ column }: { column?: boolean }) {
  const { createdAt, handle, isPreviewMode, owner } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <>
      <RelaunchV1ProjectCallout className="mb-8 pb-6" />
      <ProjectHeader
        handle={handle}
        projectOwnerAddress={owner}
        actions={<V1ProjectHeaderActions />}
      />

      <Row gutter={gutter} align="bottom">
        <Col className="mt-10" xs={24} md={column ? 24 : 12}>
          <TreasuryStatsSection />
        </Col>

        <Col className="mt-10" xs={24} md={column ? 24 : 12}>
          <V1PayProjectFormProvider>
            <PayProjectForm />
          </V1PayProjectFormProvider>
        </Col>
      </Row>

      <Row className="pb-10" gutter={gutter}>
        <Col xs={24} md={column ? 24 : 12} className="mt-10">
          {projectId && (
            <div className="mb-10">
              <Suspense fallback={<LoadingOutlined />}>
                <VolumeChart
                  // TODO: Remove later
                  style={{ height: 240 }}
                  projectId={projectId}
                  createdAt={createdAt}
                  pv={PV_V1}
                />
              </Suspense>
            </div>
          )}

          <div className="mb-10">
            <TokensSection />
          </div>

          <FundingCycles />
        </Col>
        {!isPreviewMode ? (
          <Col className="mt-10" xs={24} md={column ? 24 : 12}>
            <ProjectActivity />
          </Col>
        ) : null}
      </Row>
    </>
  )
}
