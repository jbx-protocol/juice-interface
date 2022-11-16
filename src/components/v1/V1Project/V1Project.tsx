import { LoadingOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1PayProjectFormProvider } from 'providers/v1/V1PayProjectFormProvider'
import { CSSProperties, lazy, Suspense, useContext } from 'react'
import FundingCycles from './FundingCycles'
import ProjectActivity from './ProjectActivity'
import { TokensSection } from './TokensSection'
import { TreasuryStatsSection } from './TreasuryStatsSection'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'

const VolumeChart = lazy(() => import('components/VolumeChart'))

const gutter = 40

export function V1Project({
  style,
  column,
}: {
  style?: CSSProperties
  column?: boolean
}) {
  const { createdAt, handle, isPreviewMode, owner } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <div style={style}>
      <ProjectHeader
        handle={handle}
        projectOwnerAddress={owner}
        actions={<V1ProjectHeaderActions />}
      />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <TreasuryStatsSection />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <V1PayProjectFormProvider>
            <PayProjectForm />
          </V1PayProjectFormProvider>
        </Col>
      </Row>

      <Row gutter={gutter} style={{ paddingBottom: gutter }}>
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          {projectId && (
            <div style={{ marginBottom: gutter }}>
              <Suspense fallback={<LoadingOutlined />}>
                <VolumeChart
                  style={{ height: 240 }}
                  projectId={projectId}
                  createdAt={createdAt}
                  pv={PV_V1}
                />
              </Suspense>
            </div>
          )}

          <div style={{ marginBottom: gutter }}>
            <TokensSection />
          </div>

          <FundingCycles />
        </Col>
        {!isPreviewMode ? (
          <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
            <ProjectActivity />
          </Col>
        ) : null}
      </Row>
    </div>
  )
}
