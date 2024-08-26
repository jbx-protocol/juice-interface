import { Trans } from '@lingui/macro'
import { Form, Select } from 'antd'
import { BallotStrategy } from 'models/ballot'

export default function CycleDeadlineDropdown({
  className,
}: {
  className?: string
}) {
  // const ballotStrategies = ballotStrategiesFn({ cv })
  return (
    <Form.Item name="approvalHook" required>
      <Select className={className}>
        {[{ name: '1 day @todo', address: '0x00'}].map((strategy: BallotStrategy) => (
          <Select.Option key={strategy.address} value={strategy.address}>
            <Trans>{strategy.name}</Trans>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}
