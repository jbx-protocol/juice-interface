import { Trans } from '@lingui/macro'
import { Form, Select } from 'antd'
import { ballotStrategiesFn } from 'constants/v2v3/ballotStrategies'
import { BallotStrategy } from 'models/ballot'

export default function CycleDeadlineDropdown({
  className,
}: {
  className?: string
}) {
  const ballotStrategies = ballotStrategiesFn()
  return (
    <Form.Item name="ballot" required>
      <Select className={className}>
        {ballotStrategies.map((strategy: BallotStrategy) => (
          <Select.Option key={strategy.address} value={strategy.address}>
            <Trans>{strategy.name}</Trans>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}
