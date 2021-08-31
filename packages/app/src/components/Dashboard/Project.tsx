import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Space } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

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
}: {
  style?: CSSProperties
  showCurrentDetail?: boolean
}) {
  const [height, setHeight] = useState<CSSProperties['height']>()
  const { projectId, isOwner } = useContext(ProjectContext)

  const canPrintPreminedTickets = useContractReader<boolean>({
    contract: ContractName.TerminalV1,
    functionName: 'canPrintPreminedTickets',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.TerminalV1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const gutter = 40

  if (!projectId) return null

  return (
    <div style={style}>
      <ProjectHeader />

      <Row gutter={gutter} style={{ marginTop: gutter }} align="bottom">
        <Col xs={24} md={12}>
          <Paid />
        </Col>

        <Col xs={24} md={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {canPrintPreminedTickets && isOwner && (
              <PrintPremined projectId={projectId} />
            )}
            <Pay />
          </Space>
        </Col>
      </Row>

      <Row gutter={gutter} style={{ marginTop: gutter, paddingBottom: gutter }}>
        <Col xs={24} md={12}>
          <div id="col-content">
            <div style={{ marginBottom: gutter }}>
              <BalanceTimeline height={240} />
            </div>

            <div style={{ marginBottom: gutter }}>
              <Rewards totalOverflow={totalOverflow} />
            </div>

            <FundingCycles showCurrentDetail={showCurrentDetail} />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <ProjectActivity />
        </Col>
      </Row>
    </div>
  )
}
