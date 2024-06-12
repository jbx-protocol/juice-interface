import { Trans } from '@lingui/macro'
import { Form, Select } from 'antd'
import { BallotStrategy } from 'models/ballot'
import { ballotStrategiesFn } from 'packages/v2v3/constants/ballotStrategies'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

export default function CycleDeadlineDropdown({
  className,
}: {
  className?: string
}) {
  const { cv } = useContext(V2V3ContractsContext)
  const ballotStrategies = ballotStrategiesFn({ cv })
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
