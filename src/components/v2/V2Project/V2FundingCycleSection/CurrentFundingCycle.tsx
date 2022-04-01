import { CardSection } from 'components/shared/CardSection'
import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'

import SplitList from 'components/v2/shared/SplitList'

import { formatReservedRate } from 'utils/v2/math'

import { Trans } from '@lingui/macro'
import TooltipLabel from 'components/shared/TooltipLabel'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import FundingCycleDetails from './FundingCycleDetails'
import PayoutSplitsCard from './PayoutSplitsCard'

export default function CurrentFundingCycle({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const {
    fundingCycle,
    reserveTokenSplits,
    fundingCycleMetadata,
    tokenSymbol,
    distributionLimitCurrency,
    distributionLimit,
    projectOwnerAddress,
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

      <PayoutSplitsCard />

      <CardSection>
        <div>
          <TooltipLabel
            label={
              <h4 style={{ display: 'inline-block' }}>
                <Trans>
                  Reserved{' '}
                  {tokenSymbolText({
                    tokenSymbol,
                    capitalize: false,
                    plural: true,
                  })}
                </Trans>{' '}
                ({formatReservedRate(fundingCycleMetadata?.reservedRate)}%)
              </h4>
            }
            tip={
              <Trans>
                A project can reserve a percentage of tokens minted from every
                payment it receives. Reserved tokens can be distributed
                according to the allocation below at any time.
              </Trans>
            }
          />
        </div>
        {reserveTokenSplits ? (
          <SplitList
            splits={reserveTokenSplits}
            distributionLimitCurrency={distributionLimitCurrency}
            distributionLimit={distributionLimit}
            projectOwnerAddress={projectOwnerAddress}
          />
        ) : null}
      </CardSection>
    </div>
  )
}
