import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import ExternalLink from 'components/ExternalLink'
import {
  DATASOURCE_EXPLANATION,
  NFT_DATASOURCE_EXPLANATION,
  USE_DATASOURCE_FOR_PAY_EXPLANATION,
  USE_DATASOURCE_FOR_REDEEM_EXPLANATION,
  USE_NFT_DATASOURCE_FOR_PAY_EXPLANATION,
  USE_NFT_DATASOURCE_FOR_REDEEM_EXPLANATION,
} from 'components/strings'
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
      <EthereumAddress address={address} />{' '}
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
        <Tooltip title={<Trans>Unknown extension</Trans>}>
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
  const { version } = useContext(JB721DelegateContractsContext)
  return (
    <>
      <FundingCycleListItem
        name={t`Contract`}
        value={
          <DataSourceAddressValue address={fundingCycleMetadata.dataSource} />
        }
        helperText={
          version ? NFT_DATASOURCE_EXPLANATION : DATASOURCE_EXPLANATION
        }
      />
      <FundingCycleListItem
        name={t`Use for payments`}
        value={formatBoolean(fundingCycleMetadata.useDataSourceForPay)}
        helperText={
          version
            ? USE_NFT_DATASOURCE_FOR_PAY_EXPLANATION
            : USE_DATASOURCE_FOR_PAY_EXPLANATION
        }
      />
      <FundingCycleListItem
        name={t`Use for redemptions`}
        value={formatBoolean(fundingCycleMetadata.useDataSourceForRedeem)}
        helperText={
          version
            ? USE_NFT_DATASOURCE_FOR_REDEEM_EXPLANATION
            : USE_DATASOURCE_FOR_REDEEM_EXPLANATION
        }
      />
    </>
  )
}
