import { t, Trans } from '@lingui/macro'
import { Form, Input } from 'antd'

interface VotingPowerDisplayInputProps {
  votingPower: number
}

const VotingPowerDisplayInput = ({
  votingPower,
}: VotingPowerDisplayInputProps) => {
  return (
    <Form.Item
      label={
        <h3 className="mb-0 text-black dark:text-slate-100">
          <Trans>Your voting power</Trans>
        </h3>
      }
    >
      <Input disabled value={votingPower} suffix={t`VotePWR`} />
    </Form.Item>
  )
}

export default VotingPowerDisplayInput
