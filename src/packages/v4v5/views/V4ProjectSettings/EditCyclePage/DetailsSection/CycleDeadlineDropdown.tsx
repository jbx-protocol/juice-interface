import { Form, Select } from 'antd'

import { Trans } from '@lingui/macro'
import { BallotStrategy } from 'models/ballot'
import { getAvailableApprovalStrategies } from 'packages/v4/utils/approvalHooks'

export default function CycleDeadlineDropdown({
  className,
}: {
  className?: string
}) {
  const ballotStrategies = getAvailableApprovalStrategies()
  return (
    <Form.Item name="approvalHook" required>
      <Select className={className}>
        {ballotStrategies.map(
          (strategy: BallotStrategy) => (
            <Select.Option key={strategy.address} value={strategy.address}>
              <Trans>{strategy.name}</Trans>
            </Select.Option>
          ),
        )}
      </Select>
    </Form.Item>
  )
}
