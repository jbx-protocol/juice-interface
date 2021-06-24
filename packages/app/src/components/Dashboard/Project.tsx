import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row } from 'antd'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { ModRef } from 'models/mods'
import { ProjectMetadata } from 'models/project-metadata'
import { CSSProperties, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import FundingCycles from './FundingCycles'
import Paid from './Paid'
import Pay from './Pay'
import PayEvents from './PayEvents'
import ProjectHeader from './ProjectHeader'
import Rewards from './Rewards'

export default function Project({
  handle,
  metadata,
  projectId,
  fundingCycle,
  paymentMods,
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
  paymentMods: ModRef[] | undefined
  ticketMods: ModRef[] | undefined
  showCurrentDetail?: boolean
  style?: CSSProperties
}) {
  const converter = useCurrencyConverter()

  const balance = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'balanceOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.Juicer,
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

  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.Juicer,
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
          <Pay
            metadata={metadata}
            fundingCycle={fundingCycle}
            projectId={projectId}
          />
        </Col>
      </Row>

      <Row gutter={gutter} style={{ marginTop: gutter }}>
        <Col xs={24} md={12}>
          <FundingCycles
            projectId={projectId}
            fundingCycle={fundingCycle}
            paymentMods={paymentMods}
            ticketMods={ticketMods}
            isOwner={isOwner}
            balanceInCurrency={balanceInCurrency}
            showCurrentDetail={showCurrentDetail}
          />
        </Col>

        <Col xs={24} md={12}>
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
