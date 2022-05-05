import { Form, Switch } from 'antd'
import { Trans } from '@lingui/macro'

import { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import FormItemLabel from 'components/v2/V2Create/FormItemLabel'
import { defaultFundingCycleData } from 'redux/slices/editingV2Project'

import { DISCOUNT_RATE_EXPLANATION } from 'components/v2/V2Project/V2FundingCycleSection/settingExplanations'

import { FormItemExt } from './formItemExt'
import NumberSlider from '../inputs/NumberSlider'
import FormItemWarningText from '../FormItemWarningText'

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
  style = {},
  onChange,
  checked,
  disabled,
  onToggle,
}: {
  value: string | undefined
  style?: CSSProperties
  onChange: (val?: number) => void
  checked?: boolean
  disabled?: boolean
  onToggle?: (checked: boolean) => void
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Form.Item
      extra={<DiscountRateExtra disabled={disabled} />}
      name={name}
      label={
        hideLabel ? undefined : (
          <div style={{ display: 'flex' }}>
            <FormItemLabel>
              <Trans>Discount rate</Trans>
            </FormItemLabel>
            {onToggle ? (
              <>
                <Switch checked={checked} onChange={onToggle} />{' '}
                {!checked ? (
                  <span style={{ color: colors.text.tertiary, marginLeft: 10 }}>
                    <Trans>({defaultFundingCycleData.discountRate}%)</Trans>
                  </span>
                ) : null}
              </>
            ) : null}
          </div>
        )
      }
      style={style}
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
