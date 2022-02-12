import { Col, Row } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { CSSProperties, useContext } from 'react'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import BalanceTimeline from './BalanceTimeline'
import FundingCycles from './FundingCycles'
import Paid from './Paid'
import Pay from './Pay'
import ProjectActivity from './ProjectActivity'
import ProjectHeader from '../../shared/ProjectHeader'
import V1HeaderActions from './V1HeaderActions'
import Rewards from './Rewards'

export default function V1Project({
  style,
  showCurrentDetail,
  column,
}: {
  style?: CSSProperties
  showCurrentDetail?: boolean
  column?: boolean
}) {
  const { currentFC, projectId, handle, metadata, isArchived } =
    useContext(V1ProjectContext)

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const gutter = 40

  if (!projectId || !fcMetadata) return null

  return (
    <div style={style}>
      <ProjectHeader
        projectId={projectId}
        metadata={metadata}
        handle={handle}
        isArchived={isArchived}
        actions={<V1HeaderActions />}
      />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Paid />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Pay />
        </Col>
      </Row>

      <Row gutter={gutter} style={{ paddingBottom: gutter }}>
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          {projectId.gt(0) && (
            <div style={{ marginBottom: gutter }}>
              <BalanceTimeline height={240} />
            </div>
          )}

          <div style={{ marginBottom: gutter }}>
            <Rewards />
          </div>

          <FundingCycles showCurrentDetail={showCurrentDetail} />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <ProjectActivity />
        </Col>
      </Row>
    </div>
  )
}
