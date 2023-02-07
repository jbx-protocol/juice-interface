import { Trans } from '@lingui/macro'
import { Form, Switch } from 'antd'
import FormItemLabel from 'components/FormItemLabel'
import { DISCOUNT_RATE_EXPLANATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { DEFAULT_FUNDING_CYCLE_DATA } from 'redux/slices/editingV2Project'
import FormItemWarningText from '../FormItemWarningText'
import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

function DiscountRateExtra({ disabled }: { disabled?: boolean }) {
  return (
    <div>
      {disabled && (
        <FormItemWarningText>
          <Trans>
            Disabled when your project's funding cycle duration is 0.
          </Trans>
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
              <Trans>Discount rate</Trans>
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
