import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import FormattedAddress from 'components/FormattedAddress'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { formatBoolean } from 'utils/format/formatBoolean'
import { helpPagePath } from 'utils/routes'
import { FundingCycleListItem } from '../FundingCycleListItem'

function DataSourceAddressValue({ address }: { address: string | undefined }) {
  const { version } = useContext(JB721DelegateContractsContext)

  return (
    <span>
      <FormattedAddress address={address} />{' '}
      {version ? (
        <Tooltip
          title={
            <ExternalLink
              href={helpPagePath(
                `/dev/api/extensions/juice-721-delegate/contracts/JBTiered721Delegate/`,
              )}
            >
              <Trans>JB721Delegate v{version}</Trans>
            </ExternalLink>
          }
        >
          <CheckCircleOutlined />
        </Tooltip>
      ) : (
        <Tooltip title={<Trans>Unknown datasource</Trans>}>
          <WarningOutlined className="text-warning-600 dark:text-warning-300" />
        </Tooltip>
      )}
    </span>
  )
}

export function DataSourceListItems({
  fundingCycleMetadata,
}: {
  fundingCycleMetadata: V2V3FundingCycleMetadata
}) {
  return (
    <>
      <FundingCycleListItem
        name={t`Contract`}
        value={
          <DataSourceAddressValue address={fundingCycleMetadata.dataSource} />
        }
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
