import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row } from 'antd'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { CSSProperties, useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import FundingCycles from './FundingCycles'
import Paid from './Paid'
import Pay from './Pay'
import PayEvents from './PayEvents'
import ProjectHeader from './ProjectHeader'
import Rewards from './Rewards'

export default function Project({
  project,
  projectId,
  fundingCycle,
  showCurrentDetail,
  style,
  isOwner,
}: {
  project: ProjectIdentifier | undefined
  projectId: BigNumber
  isOwner: boolean
  fundingCycle: FundingCycle | undefined
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
      balance && converter.wadToCurrency(balance, fundingCycle?.currency, 0),
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

  if (!projectId || !project) return null

  const gutter = 40

  return (
    <div style={style}>
      <ProjectHeader
        project={project}
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
            fundingCycle={fundingCycle}
            projectId={projectId}
            project={project}
          />
        </Col>
      </Row>

      <Row gutter={gutter} style={{ marginTop: gutter }}>
        <Col xs={24} md={12}>
          <FundingCycles
            projectId={projectId}
            fundingCycle={fundingCycle}
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
