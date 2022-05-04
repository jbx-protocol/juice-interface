import { Trans } from '@lingui/macro'
import { BigNumber } from '@ethersproject/bignumber'
import { Select } from 'antd'
import { formatWad } from 'utils/formatNumber'

const { Option } = Select

export type DistributionLimitType = 'none' | 'specific' | 'infinite' | 'sum'

export default function DistributionLimitTypeSelect({
  value,
  onChange,
  distributionLimit,
}: {
  value: DistributionLimitType
  onChange: (value: DistributionLimitType) => void
  distributionLimit: BigNumber | undefined
}) {
  return (
    <Select
      value={value}
      onChange={onChange}
      getPopupContainer={triggerNode => triggerNode.parentElement}
      style={{ width: '100%' }}
    >
      {/* Can't go from infinite to sum of payouts */}
      {value !== 'infinite' && (
        <Option value="sum">
          <Trans>
            Sum of payout splits
            {value === 'sum' ? `(${formatWad(distributionLimit)})` : null}
          </Trans>
        </Option>
      )}
      <Option value="specific">
        <Trans>Specific limit</Trans>
      </Option>
      <Option value="infinite">
        <Trans>No limit (infinite)</Trans>
      </Option>
      <Option value="none">
        <Trans>Zero, no funds can be distributed</Trans>
      </Option>
    </Select>
  )
}
