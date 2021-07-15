import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Space } from 'antd'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { ProjectMetadata } from 'models/project-metadata'
import { CSSProperties, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import FundingCycles from './FundingCycles'
import Paid from './Paid'
import Pay from './Pay'
import PayEvents from './PayEvents'
import PrintPremined from './PrintPremined'
import ProjectHeader from './ProjectHeader'
import Rewards from './Rewards'

export default function Project({
  handle,
  metadata,
  projectId,
  fundingCycle,
  payoutMods,
  ticketMods,
  showCurrentDetail,
  style,
  isOwner,
}: {
  handle: string
  metadata: ProjectMetadata
  projectId: BigNumber
  isOwner: boolean
  fundingCycle: FundingCycle | undefined
  payoutMods: PayoutMod[] | undefined
  ticketMods: TicketMod[] | undefined
  showCurrentDetail?: boolean
  style?: CSSProperties
}) {
  const converter = useCurrencyConverter()

  const balance = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'balanceOf',
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

  const balanceInCurrency = useMemo(
    () =>
      balance &&
      converter.wadToCurrency(
        balance,
        fundingCycle?.currency.toNumber() as CurrencyOption,
        0,
      ),
    [fundingCycle?.currency, balance, converter],
  )

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

  if (!projectId || !metadata) return null

  const gutter = 40

  return (
    <div style={style}>
      <ProjectHeader
        handle={handle}
        metadata={metadata}
        projectId={projectId}
        isOwner={isOwner}
      />

      <Row gutter={gutter} style={{ marginTop: gutter }} align="bottom">
        <Col xs={24} md={12}>
          <Paid
            projectId={projectId}
            fundingCycle={fundingCycle}
            balanceInCurrency={balanceInCurrency}
          />
        </Col>
        <Col xs={24} md={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {canPrintPreminedTickets && isOwner && (
              <PrintPremined projectId={projectId} />
            )}
            <Pay
              metadata={metadata}
              fundingCycle={fundingCycle}
              projectId={projectId}
            />
          </Space>
        </Col>
      </Row>

      <Row gutter={gutter} style={{ marginTop: gutter }}>
        <Col xs={24} md={12} style={{ marginBottom: gutter }}>
          <FundingCycles
            projectId={projectId}
            fundingCycle={fundingCycle}
            payoutMods={payoutMods}
            ticketMods={ticketMods}
            isOwner={isOwner}
            balanceInCurrency={balanceInCurrency}
            showCurrentDetail={showCurrentDetail}
          />
        </Col>

        <Col xs={24} md={12} style={{ paddingBottom: gutter }}>
          <div style={{ marginBottom: gutter }}>
            <Rewards
              projectId={projectId}
              currentCycle={fundingCycle}
              totalOverflow={totalOverflow}
              isOwner={isOwner}
            />
          </div>

          <PayEvents projectId={projectId} />
        </Col>
      </Row>
    </div>
  )
}
