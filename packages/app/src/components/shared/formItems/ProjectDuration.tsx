import { Form } from 'antd'

import InputAccessoryButton from '../InputAccessoryButton'
import FormattedNumberInput from '../inputs/FormattedNumberInput'
import { FormItemExt } from './formItemExt'

export default function ProjectDuration({
  name,
  formItemProps,
  value,
  isRecurring,
  hideLabel,
  onToggleRecurring,
}: {
  value: string | undefined
  isRecurring: boolean | undefined
  onToggleRecurring: VoidFunction
} & FormItemExt) {
  return (
    <Form.Item
      extra="How long one funding cycle will last."
      name={name}
      label={hideLabel ? undefined : 'Funding period'}
      {...formItemProps}
    >
      <FormattedNumberInput
        placeholder="30"
        value={value}
        suffix="days"
        accessory={
          <InputAccessoryButton
            content={isRecurring ? 'recurring' : 'one-time'}
            withArrow={true}
            onClick={onToggleRecurring}
          />
        }
      />
    </Form.Item>
  )
}
