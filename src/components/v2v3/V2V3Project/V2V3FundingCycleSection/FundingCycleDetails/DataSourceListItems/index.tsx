import { t } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { formatBoolean } from 'utils/format/formatBoolean'
import { FundingCycleListItem } from '../FundingCycleListItem'

export function DataSourceListItems({
  fundingCycleMetadata,
}: {
  fundingCycleMetadata: V2V3FundingCycleMetadata
}) {
  return (
    <>
      <FundingCycleListItem
        name={t`Contract`}
        value={<FormattedAddress address={fundingCycleMetadata.dataSource} />}
      />
      <FundingCycleListItem
        name={t`Use for payments`}
        value={formatBoolean(fundingCycleMetadata.useDataSourceForPay)}
      />
      <FundingCycleListItem
        name={t`Use for redemptions`}
        value={formatBoolean(fundingCycleMetadata.useDataSourceForRedeem)}
      />
    </>
  )
}
