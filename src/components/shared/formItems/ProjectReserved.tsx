import { Form, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

export default function ProjectReserved({
  name,
  hideLabel,
  formItemProps,
  value,
  onChange,
  disabled,
  toggleDisabled,
}: {
  value: number | undefined
  onChange: (val?: number) => void
  disabled?: boolean
  toggleDisabled?: (checked: boolean) => void
} & FormItemExt) {
  return (
    <Form.Item
      extra={t`Whenever someone pays your project, this percentage of tokens will be reserved and the rest will go to the payer. Reserve tokens are reserved for the project owner by default, but can also be allocated to other wallet addresses by the owner. Once tokens are reserved, anyone can "mint" them, which distributes them to their intended receivers.`}
      name={name}
      label={
        hideLabel ? undefined : (
          <div>
            <Trans>Reserved rate</Trans>{' '}
            {toggleDisabled ? (
              <Switch checked={!disabled} onChange={toggleDisabled} />
            ) : null}
          </div>
        )
      }
      {...formItemProps}
    >
      {!disabled ? (
        <NumberSlider
          sliderValue={value}
          defaultValue={value ?? 0}
          suffix="%"
          onChange={onChange}
          name={name}
          step={0.5}
        />
      ) : null}
    </Form.Item>
  )
}
