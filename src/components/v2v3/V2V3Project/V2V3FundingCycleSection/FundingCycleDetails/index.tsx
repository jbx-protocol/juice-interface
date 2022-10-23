import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { FundingCycleDetailsRow } from './FundingCycleDetailsRow'
import { FundingCycleListItems } from './FundingCycleListItems'
import { RulesListItems } from './RulesListItems'
import { TokenListItems } from './TokenListItems'

export default function FundingCycleDetails({
  fundingCycle,
  fundingCycleMetadata,
  distributionLimit,
  distributionLimitCurrency,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
}) {
  return (
    <>
      <FundingCycleDetailsRow
        header={t`Funding cycle`}
        items={
          <FundingCycleListItems
            fundingCycle={fundingCycle}
            distributionLimit={distributionLimit}
            distributionLimitCurrency={distributionLimitCurrency}
          />
        }
      />
      <FundingCycleDetailsRow
        header={t`Token`}
        items={
          <TokenListItems
            fundingCycle={fundingCycle}
            fundingCycleMetadata={fundingCycleMetadata}
          />
        }
      />
      <FundingCycleDetailsRow
        header={t`Rules`}
        style={{ paddingBottom: 0 }}
        items={
          <RulesListItems
            fundingCycle={fundingCycle}
            fundingCycleMetadata={fundingCycleMetadata}
          />
        }
      />
    </>
  )
}
