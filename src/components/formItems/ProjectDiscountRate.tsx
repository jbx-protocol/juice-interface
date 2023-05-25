import { Trans } from '@lingui/macro'
import { Form, Switch } from 'antd'
import FormItemLabel from 'components/FormItemLabel'
import FormItemWarningText from 'components/FormItemWarningText'
import { DISCOUNT_RATE_EXPLANATION } from 'components/strings'
import { DEFAULT_FUNDING_CYCLE_DATA } from 'redux/slices/editingV2Project'
import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

function DiscountRateExtra({ disabled }: { disabled?: boolean }) {
  return (
    <div>
      {disabled && (
        <FormItemWarningText>
          <Trans>Disabled when your project's cycle isn't locked.</Trans>
        </FormItemWarningText>
      )}
      {DISCOUNT_RATE_EXPLANATION}
    </div>
  )
}

export default function ProjectDiscountRate({
  name,
  hideLabel,
  formItemProps,
  value,
  onChange,
  checked,
  disabled,
  onToggle,
}: {
  value: string | undefined
  onChange: (val?: number) => void
  checked?: boolean
  disabled?: boolean
  onToggle?: (checked: boolean) => void
} & FormItemExt) {
  return (
    <Form.Item
      extra={<DiscountRateExtra disabled={disabled} />}
      name={name}
      label={
        hideLabel ? undefined : (
          <div className="flex">
            <FormItemLabel>
              <Trans>Issuance reduction rate</Trans>
            </FormItemLabel>
            {onToggle ? (
              <>
                <Switch checked={checked} onChange={onToggle} />{' '}
                {!checked ? (
                  <span className="ml-2 text-grey-400 dark:text-slate-200">
                    ({DEFAULT_FUNDING_CYCLE_DATA.discountRate}%)
                  </span>
                ) : null}
              </>
            ) : null}
          </div>
        )
      }
      {...formItemProps}
    >
      <NumberSlider
        max={20}
        defaultValue={0}
        sliderValue={parseFloat(value ?? '0')}
        suffix="%"
        name={name}
        onChange={onChange}
        step={0.1}
        disabled={disabled}
      />
    </Form.Item>
  )
}
