import { Col, Row } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { CSSProperties, useContext } from 'react'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

import ProjectHeader from 'components/shared/ProjectHeader'
import PayInputGroup from 'components/shared/inputs/Pay/PayInputGroup'

import BalanceTimeline from './BalanceTimeline'
import FundingCycles from './FundingCycles'
import Paid from './Paid'
import ProjectActivity from './ProjectActivity'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'
import Rewards from './Rewards'
import V1PayButton from './V1PayButton'

export default function V1Project({
  style,
  showCurrentDetail,
  column,
}: {
  style?: CSSProperties
  showCurrentDetail?: boolean
  column?: boolean
}) {
  const {
    currentFC,
    projectId,
    handle,
    metadata,
    isArchived,
    tokenSymbol,
    tokenAddress,
  } = useContext(V1ProjectContext)

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)
  const reservedRate = fcMetadata?.reservedRate

  const gutter = 40

  if (!projectId || !fcMetadata) return null

  return (
    <div style={style}>
      <ProjectHeader
        metadata={metadata}
        handle={handle}
        isArchived={isArchived}
        actions={<V1ProjectHeaderActions />}
      />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Paid />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <PayInputGroup
            PayButton={V1PayButton}
            reservedRate={reservedRate}
            weight={currentFC?.weight}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
          />
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
