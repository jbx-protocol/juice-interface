import { LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import { ErrorBoundaryCallout } from 'components/Callout/ErrorBoundaryCallout'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import ScrollToTopButton from 'components/buttons/ScrollToTopButton'
import { PayProjectForm } from 'components/v1/V1Project/PayProjectForm/PayProjectForm'
import { V1PayProjectFormProvider } from 'components/v1/V1Project/V1PayProjectFormProvider'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { Suspense, lazy, useContext } from 'react'
import FundingCycles from './FundingCycles'
import { V1ProjectActivity } from './ProjectActivity'
import { TokensSection } from './TokensSection'
import { TreasuryStatsSection } from './TreasuryStatsSection'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'

const VolumeChart = lazy(() => import('components/VolumeChart'))

const gutter = 40

export function V1Project() {
  const { createdAt, handle, owner } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <div>
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
