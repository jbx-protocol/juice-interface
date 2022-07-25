import { t, Trans } from '@lingui/macro'
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
      label={
        <h3 style={{ marginBottom: 0, color: colors.text.primary }}>
          <Trans>Your voting power</Trans>
        </h3>
      }
    >
      <Input disabled value={votingPower} suffix={t`VotePWR`} />
    </Form.Item>
  )
}

export default VotingPowerDisplayInput
