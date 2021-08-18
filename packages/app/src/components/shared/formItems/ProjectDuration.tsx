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
  onValueChange,
}: {
  value: string | undefined
  isRecurring: boolean | undefined
  onToggleRecurring: VoidFunction
  onValueChange: (val?: string) => void
} & FormItemExt) {
  return (
    <Form.Item
      extra="How long one funding cycle will last. Changes to upcoming funding cycles will only take effect once the current cycle has ended."
      name={name}
      label={hideLabel ? undefined : 'Funding period'}
      {...formItemProps}
    >
      <FormattedNumberInput
        placeholder="30"
        value={value}
        suffix="days"
        onChange={onValueChange}
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
