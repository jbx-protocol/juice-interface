import { Trans } from '@lingui/macro'
import { Form, Select } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { detailedTimeString } from 'utils/formatTime'

interface TokensStakedInputProps {
  form: FormInstance
  lockDurationOptionsInSeconds: number[]
}

const LockDurationSelectInput = ({
  form,
  lockDurationOptionsInSeconds,
}: TokensStakedInputProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Form.Item
      name="lockDuration"
      extra={
        <div
          style={{
            color: colors.text.primary,
            marginBottom: 10,
          }}
        >
          <Trans>Days Locked</Trans>
        </div>
      }
    >
      <Select onChange={val => form.setFieldsValue({ lockDuration: val })}>
        {lockDurationOptionsInSeconds.map((duration: number) => {
          return (
            <Select.Option key={duration} value={duration}>
              {detailedTimeString({
                timeSeconds: duration,
                fullWords: true,
              })}
            </Select.Option>
          )
        })}
      </Select>
    </Form.Item>
  )
}

export default LockDurationSelectInput
