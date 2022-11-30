import { LoadingOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1PayProjectFormProvider } from 'providers/v1/V1PayProjectFormProvider'
import { lazy, Suspense, useContext } from 'react'
import FundingCycles from './FundingCycles'
import ProjectActivity from './ProjectActivity'
import { TokensSection } from './TokensSection'
import { TreasuryStatsSection } from './TreasuryStatsSection'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'

const VolumeChart = lazy(() => import('components/VolumeChart'))

const gutter = 40

export function V1Project({ column }: { column?: boolean }) {
  const { createdAt, handle, isPreviewMode, owner } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <>
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
