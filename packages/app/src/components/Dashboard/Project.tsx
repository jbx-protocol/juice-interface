import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Space } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

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

  if (!projectId) return null

  const gutter = 40

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
            {projectId.eq(7) ? (
              <div>
                SharkDAO's Juicebox is closed right now because we're planning
                for the future. Also don't pay directly to the contract! You
                won't receive any SHARK—all tokens will be sent to governance.{' '}
                <br />
                <br /> Join us on{' '}
                <a
                  href="https://discord.gg/sg5grtCV8s"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  our Discord server
                </a>{' '}
                and follow us on{' '}
                <a
                  href="https://twitter.com/sharkdao"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>{' '}
                to stay up to date on when memberships will be available.
              </div>
            ) : (
              <Pay />
            )}
          </Space>
        </Col>
      </Row>

      <Row gutter={gutter} style={{ marginTop: gutter }}>
        <Col xs={24} md={12} style={{ marginBottom: gutter }}>
          <FundingCycles showCurrentDetail={showCurrentDetail} />
        </Col>

        <Col xs={24} md={12} style={{ paddingBottom: gutter }}>
          <div style={{ marginBottom: gutter }}>
            <Rewards totalOverflow={totalOverflow} />
          </div>

          <ProjectActivity />
        </Col>
      </Row>
    </div>
  )
}
