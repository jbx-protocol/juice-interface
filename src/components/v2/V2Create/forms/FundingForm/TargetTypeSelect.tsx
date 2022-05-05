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
    <Select
      value={value}
      onChange={onChange}
      getPopupContainer={triggerNode => triggerNode.parentElement}
      style={{ width: '100%' }}
    >
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
