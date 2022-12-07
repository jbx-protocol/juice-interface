import { t } from '@lingui/macro'
import { Form, InputNumber } from 'antd'
import { stringIsDigit } from 'utils/math'
import { AllocatorFormItem } from './AllocatorFormItem'

export function V2ProjectPayoutFormItem({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (projectId: string | undefined) => void
}) {
  const validateProjectId = () => {
    if (!stringIsDigit(value ?? '')) {
      return Promise.reject(t`Project ID must be a number.`)
    }
    // TODO: check if projectId exists
    return Promise.resolve()
  }

  return (
    <>
      <AllocatorFormItem />
      <Form.Item
        name={'projectId'}
        rules={[{ validator: validateProjectId }]}
        label={t`Juicebox Project ID`}
        required
      >
        <InputNumber
          value={parseInt(value ?? '')}
          className="w-full"
          onChange={(projectId: number | null) => {
            onChange(projectId?.toString())
          }}
        />
      </Form.Item>
    </>
  )
}
