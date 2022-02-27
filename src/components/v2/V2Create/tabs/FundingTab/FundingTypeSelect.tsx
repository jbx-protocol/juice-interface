import { Trans } from '@lingui/macro'
import { Select } from 'antd'
const { Option } = Select

export type FundingType = 'target' | 'no_target' | 'recurring'

export default function FundingTypeSelect({
  value,
  onChange,
}: {
  value: FundingType
  onChange: (value: FundingType) => void
}) {
  return (
    <Select value={value} onChange={onChange} style={{ fontSize: 17 }}>
      <Option value="target">
        <Trans>Specific target</Trans>
      </Option>
      <Option value="no_target">
        <Trans>No target (as much as possible)</Trans>
      </Option>
      <Option value="recurring">
        <Trans>Recurring target</Trans>
      </Option>
    </Select>
  )
}
