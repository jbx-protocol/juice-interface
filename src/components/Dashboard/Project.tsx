import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Space } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import useContractReader from 'hooks/ContractReader'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { CSSProperties, useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import BalanceTimeline from './BalanceTimeline'
import FundingCycles from './FundingCycles'
import Paid from './Paid'
import Pay from './Pay'
import PrintPremined from './PrintPremined'
import ProjectActivity from './ProjectActivity'
import ProjectHeader from './ProjectHeader'
import Rewards from './Rewards'

export default function Project({
  style,
  showCurrentDetail,
  column,
}: {
  style?: CSSProperties
  showCurrentDetail?: boolean
  column?: boolean
}) {
  const { projectId, currentFC, terminal } = useContext(ProjectContext)

  const hasPrintPreminePermission = useHasPermission(
    OperatorPermission.PrintTickets,
  )

  const totalOverflow = useContractReader<BigNumber>({
    contract: terminal?.name,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: terminal?.name,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: terminal?.name,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId, terminal?.name],
    ),
  })

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const gutter = 40

  if (!projectId || !fcMetadata) return null

  return (
    <div style={style}>
      <ProjectHeader />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Paid />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {(fcMetadata.ticketPrintingIsAllowed || fcMetadata.version === 0) &&
              hasPrintPreminePermission &&
              projectId.gt(0) && <PrintPremined projectId={projectId} />}
            <Pay />
          </Space>
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
            <Rewards totalOverflow={totalOverflow} />
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
