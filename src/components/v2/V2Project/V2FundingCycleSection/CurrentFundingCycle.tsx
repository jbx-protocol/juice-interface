import { CardSection } from 'components/shared/CardSection'
import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'

import SplitList from 'components/v2/shared/SplitList'

import { formatReservedRate } from 'utils/v2/math'

import FundingCycleDetails from './FundingCycleDetails'

export default function CurrentFundingCycle({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const {
    fundingCycle,
    payoutSplits,
    reserveTokenSplits,
    fundingCycleMetadata,
  } = useContext(V2ProjectContext)

  if (!fundingCycle) return <LoadingOutlined />

  return (
    <div>
      <CardSection>
        <FundingCycleDetailsCard
          fundingCycleNumber={fundingCycle.number}
          fundingCycleDetails={
            <FundingCycleDetails fundingCycle={fundingCycle} />
          }
          fundingCycleDurationSeconds={fundingCycle.duration}
          fundingCycleStartTime={fundingCycle.start}
          isFundingCycleRecurring={true}
          fundingCycleRiskCount={V2FundingCycleRiskCount(fundingCycle)}
          showDetail={showCurrentDetail}
        />
      </CardSection>

      <CardSection>
        <h4>Funding distribution</h4>
        {payoutSplits ? <SplitList splits={payoutSplits} /> : null}
      </CardSection>
      <CardSection>
        <h4>Reserved tokens</h4>
        <span>
          Reserved rate:{' '}
          {formatReservedRate(fundingCycleMetadata?.reservedRate)}%
        </span>
        <ul>
          {reserveTokenSplits?.map(split => (
            <li>{split.beneficiary}</li>
          ))}
        </ul>
      </CardSection>
    </div>
  )
}
