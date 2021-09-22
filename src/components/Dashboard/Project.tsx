import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Space } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import useContractReader from 'hooks/ContractReader'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import BalancesModal from '../modals/BalancesModal'

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
  const { projectId } = useContext(ProjectContext)

  const canPrintPreminedTickets = useContractReader<boolean>({
    contract: ContractName.TerminalV1,
    functionName: 'canPrintPreminedTickets',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const hasPrintPreminePermission = useHasPermission(
    OperatorPermission.PrintPreminedTickets,
  )

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

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={12} style={{ marginTop: gutter }}>
          <Paid />
        </Col>

        <Col xs={24} md={12} style={{ marginTop: gutter }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {canPrintPreminedTickets && hasPrintPreminePermission && (
              <PrintPremined projectId={projectId} />
            )}
            <Pay />
          </Space>
        </Col>
      </Row>

      <Row gutter={gutter} style={{ paddingBottom: gutter }}>
        <Col xs={24} md={12} style={{ marginTop: gutter }}>
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

        <Col xs={24} md={12} style={{ marginTop: gutter }}>
          <ProjectActivity />
        </Col>
      </Row>
    </div>
  )
}
