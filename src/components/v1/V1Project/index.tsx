import { LoadingOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import ProjectHeader from 'components/Project/ProjectHeader'
import { CV_V1 } from 'constants/cv'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1PayProjectFormProvider } from 'providers/v1/V1PayProjectFormProvider'
import { CSSProperties, lazy, Suspense, useContext } from 'react'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import FundingCycles from './FundingCycles'
import Paid from './Paid'
import ProjectActivity from './ProjectActivity'
import Rewards from './Rewards'
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
  const {
    createdAt,
    currentFC,
    projectId,
    handle,
    metadata,
    isArchived,
    isPreviewMode,
    owner,
  } = useContext(V1ProjectContext)

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  if (projectId === undefined || !fcMetadata) return null

  return (
    <div style={style}>
      <ProjectHeader
        metadata={metadata}
        handle={handle}
        isArchived={isArchived}
        projectOwnerAddress={owner}
        actions={<V1ProjectHeaderActions />}
        projectId={projectId}
      />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Paid />
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
                  cv={CV_V1}
                />
              </Suspense>
            </div>
          )}

          <div style={{ marginBottom: gutter }}>
            <Rewards />
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
