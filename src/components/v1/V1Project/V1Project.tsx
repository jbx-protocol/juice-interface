import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Row, Skeleton } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { ErrorBoundaryCallout } from 'components/Callout/ErrorBoundaryCallout'
import ExternalLink from 'components/ExternalLink'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import ScrollToTopButton from 'components/buttons/ScrollToTopButton'
import { PayProjectForm } from 'components/v1/V1Project/PayProjectForm/PayProjectForm'
import { V1PayProjectFormProvider } from 'components/v1/V1Project/V1PayProjectFormProvider'
import { V1_V3_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/useV1ConnectedWalletHasPermission'
import { useRelaunchV1ViaV3Create } from 'hooks/v1/useRelaunchV1ViaV3Create'
import { V1OperatorPermission } from 'models/v1/permissions'
import { Suspense, lazy, useContext, useState } from 'react'
import FundingCycles from './FundingCycles'
import { V1ProjectActivity } from './ProjectActivity'
import { TokensSection } from './TokensSection'
import { TreasuryStatsSection } from './TreasuryStatsSection'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'

const VolumeChart = lazy(() => import('components/VolumeChart'))

const gutter = 40

const RelaunchV1ProjectCallout = ({ className }: { className?: string }) => {
  const { currentPayoutMods } = useContext(V1ProjectContext)

  const [isHidden, setIsHidden] = useState<boolean>(false)
  const { isReady, relaunch } = useRelaunchV1ViaV3Create()
  const isLoading = !isReady

  const hasUpgradePermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.Configure,
  )
  const payoutModsLoading = currentPayoutMods === undefined
  const projectMigratedToV3 = Boolean(
    currentPayoutMods?.some(
      payout => payout.allocator === V1_V3_ALLOCATOR_ADDRESS,
    ),
  )

  if (
    payoutModsLoading ||
    projectMigratedToV3 ||
    isHidden ||
    !hasUpgradePermission
  ) {
    return null
  }

  return (
    <Callout.Info className={className} collapsible={false}>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <strong>
            <Trans>Re-launch on V3</Trans>
          </strong>
          <p className="mb-0">
            <Trans>
              Re-launch your Juicebox project using the v3 contracts.{' '}
            </Trans>
          </p>
          <p className="mb-1">
            <Trans>
              We recommend visiting the{' '}
              <ExternalLink href="https://discord.gg/6jXrJSyDFf">
                Juicebox Discord
              </ExternalLink>{' '}
              for help and advice on this process.
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

export function V1Project() {
  const { createdAt, handle, owner } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <div>
      <div className="mx-auto my-0 max-w-5xl p-5">
        <RelaunchV1ProjectCallout className="mb-8 pb-6" />
      </div>
      <ProjectHeader
        handle={handle}
        projectOwnerAddress={owner}
        actions={<V1ProjectHeaderActions />}
      />

      <div className="my-0 mx-auto flex max-w-5xl flex-col gap-y-5 p-5">
        <Row gutter={gutter} align="bottom">
          <Col className="mt-10" xs={24} md={12}>
            <TreasuryStatsSection />
          </Col>

          <Col className="mt-10" xs={24} md={12}>
            <V1PayProjectFormProvider>
              <PayProjectForm />
            </V1PayProjectFormProvider>
          </Col>
        </Row>

        <Row className="pb-10" gutter={gutter}>
          <Col xs={24} md={12} className="mt-10">
            {projectId && (
              <div className="mb-10">
                <Suspense fallback={<LoadingOutlined />}>
                  <ErrorBoundaryCallout
                    message={<Trans>Volume chart failed to load.</Trans>}
                  >
                    <VolumeChart
                      height={240}
                      projectId={projectId}
                      createdAt={createdAt}
                      pv={PV_V1}
                    />
                  </ErrorBoundaryCallout>
                </Suspense>
              </div>
            )}

            <div className="mb-10">
              <TokensSection />
            </div>

            <FundingCycles />
          </Col>
          <Col className="mt-10" xs={24} md={12}>
            <V1ProjectActivity />
          </Col>
        </Row>

        <div className="p-5 text-center">
          <ScrollToTopButton />
        </div>
      </div>
    </div>
  )
}
