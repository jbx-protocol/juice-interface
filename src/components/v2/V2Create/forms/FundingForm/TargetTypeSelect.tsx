import { Trans } from '@lingui/macro'
import { Select } from 'antd'
const { Option } = Select

export type TargetType = 'none' | 'specific' | 'infinite'

export default function TargetTypeSelect({
  value,
  onChange,
}: {
  value: TargetType
  onChange: (value: TargetType) => void
}) {
  return (
    <Select value={value} onChange={onChange} style={{ width: '100%' }}>
      <Option value="specific">
        <Trans>Specific target</Trans>
      </Option>
      <Option value="infinite">
        <Trans>Unlimited, as much as possible</Trans>
      </Option>
      <Option value="none">
        <Trans>None</Trans>
      </Option>
    </Select>
  )
}
