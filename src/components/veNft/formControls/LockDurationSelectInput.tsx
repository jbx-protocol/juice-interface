import { Trans } from '@lingui/macro'
import { Form, Select } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { detailedTimeString } from 'utils/format/formatTime'

interface TokensStakedInputProps {
  form: FormInstance
  lockDurationOptionsInSeconds: number[]
}

const LockDurationSelectInput = ({
  form,
  lockDurationOptionsInSeconds,
}: TokensStakedInputProps) => {
  return (
    <Form.Item name="lockDuration" label={<Trans>Lock duration</Trans>}>
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
