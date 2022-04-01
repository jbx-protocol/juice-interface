import { Col, Row } from 'antd'
import PayInputGroup from 'components/shared/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/shared/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useContext } from 'react'

import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'

import { weightedAmount } from 'utils/v2/math'

import V2PayButton from './V2PayButton'
import V2ProjectHeaderActions from '../V2ProjectHeaderActions'
import TreasuryStats from './TreasuryStats'
import V2FundingCycleSection from './V2FundingCycleSection'

export default function V2Project() {
  const { projectId, projectMetadata, fundingCycle } =
    useContext(V2ProjectContext)

  if (!projectId) return null

  const fundingCycleMetadata = fundingCycle
    ? decodeV2FundingCycleMetadata(fundingCycle?.metadata)
    : undefined

  return (
    <>
      <ProjectHeader
        metadata={projectMetadata}
        actions={<V2ProjectHeaderActions />}
      />
      <Row gutter={40}>
        <Col md={12} xs={24}>
          <TreasuryStats />
          {/* TODO volume chart */}
          {/* TODO token section */}
          <br />
          <V2FundingCycleSection />
        </Col>
        <Col md={12} xs={24}>
          <PayInputGroup
            PayButton={V2PayButton}
            reservedRate={fundingCycleMetadata?.reservedRate.toNumber()}
            weight={fundingCycle?.weight}
            weightingFn={weightedAmount}
          />
        </Col>
      </Row>
    </>
  )
}
