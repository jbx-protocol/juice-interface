import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'

import { FundingCycleDetailsRow } from 'components/FundingCycleDetailsRow'
import { isZeroAddress } from 'utils/address'
import { DataSourceListItems } from './DataSourceListItems'
import { FundingCycleListItems } from './FundingCycleListItems'
import { RulesListItems } from './RulesListItems'
import { TokenListItems } from './TokenListItems'

export default function FundingCycleDetails({
  fundingCycle,
  fundingCycleMetadata,
  distributionLimit,
  distributionLimitCurrency,
  showDiffs,
  mintRateZeroAsUnchanged,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
  showDiffs?: boolean
  mintRateZeroAsUnchanged?: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <FundingCycleDetailsRow
        header={t`Cycle`}
        items={
          <FundingCycleListItems
            fundingCycle={fundingCycle}
            fundingCycleMetadata={fundingCycleMetadata}
            distributionLimit={distributionLimit}
            distributionLimitCurrency={distributionLimitCurrency}
            showDiffs={showDiffs}
          />
        }
      />
      <FundingCycleDetailsRow
        header={t`Token`}
        items={
          <TokenListItems
            fundingCycle={fundingCycle}
            fundingCycleMetadata={fundingCycleMetadata}
            showDiffs={showDiffs}
            mintRateZeroAsUnchanged={mintRateZeroAsUnchanged}
          />
        }
      />
      <FundingCycleDetailsRow
        header={t`Other rules`}
        items={
          <RulesListItems
            fundingCycleMetadata={fundingCycleMetadata}
            showDiffs={showDiffs}
          />
        }
      />
      {!isZeroAddress(fundingCycleMetadata.dataSource) ? (
        <FundingCycleDetailsRow
          header={t`Extension`}
          items={
            <DataSourceListItems fundingCycleMetadata={fundingCycleMetadata} />
          }
        />
      ) : null}
    </div>
  )
}
