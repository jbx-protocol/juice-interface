import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { Space } from 'antd'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import * as constants from '@ethersproject/constants'

import { DataSourceListItems } from './DataSourceListItems'
import { FundingCycleDetailsRow } from './FundingCycleDetailsRow'
import { FundingCycleListItems } from './FundingCycleListItems'
import { RulesListItems } from './RulesListItems'
import { TokenListItems } from './TokenListItems'

export default function FundingCycleDetails({
  fundingCycle,
  fundingCycleMetadata,
  distributionLimit,
  distributionLimitCurrency,
  showDiffs,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
  showDiffs?: boolean
}) {
  return (
    <Space className="w-full" direction="vertical" size="middle">
      <FundingCycleDetailsRow
        header={t`Funding cycle`}
        items={
          <FundingCycleListItems
            fundingCycle={fundingCycle}
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
          />
        }
      />
      <FundingCycleDetailsRow
        header={t`Rules`}
        items={
          <RulesListItems
            fundingCycle={fundingCycle}
            fundingCycleMetadata={fundingCycleMetadata}
            showDiffs={showDiffs}
          />
        }
      />
      {fundingCycleMetadata.dataSource !== constants.AddressZero ? (
        <FundingCycleDetailsRow
          header={t`Data source`}
          items={
            <DataSourceListItems fundingCycleMetadata={fundingCycleMetadata} />
          }
        />
      ) : null}
    </Space>
  )
}
