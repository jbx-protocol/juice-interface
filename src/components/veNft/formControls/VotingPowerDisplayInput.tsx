import { Trans } from '@lingui/macro'
import { Form, Input } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

interface VotingPowerDisplayInputProps {
  votingPower: number
}

const VotingPowerDisplayInput = ({
  votingPower,
}: VotingPowerDisplayInputProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Form.Item
      extra={
        <div
          style={{
            color: colors.text.primary,
            marginBottom: 10,
            textAlign: 'right',
          }}
        >
          <Trans>Voting Power</Trans>
        </div>
      }
    >
      <Input disabled={true} value={`${votingPower} VotePWR`} />
    </Form.Item>
  )
}

export default VotingPowerDisplayInput
