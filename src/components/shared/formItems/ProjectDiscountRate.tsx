import { Form, Switch } from 'antd'
import { Trans } from '@lingui/macro'

import React, { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import FormItemLabel from 'components/v2/V2Create/FormItemLabel'

import { FormItemExt } from './formItemExt'
import NumberSlider from '../inputs/NumberSlider'

function DiscountRateExtra({ disabled }: { disabled?: boolean }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div>
      {disabled && (
        <p>
          <Trans>
            <i style={{ color: colors.text.warn }}>
              Discount rate disabled when funding cycle duration has not been
              set.
            </i>
          </Trans>
        </p>
      )}
      <Trans>
        The ratio of tokens rewarded per payment amount will decrease by this
        percentage with each new funding cycle. A higher discount rate will
        incentivize supporters to pay your project earlier than later.
      </Trans>
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
  disabled,
  toggleDisabled,
}: {
  value: string | undefined
  style?: CSSProperties
  onChange: (val?: number) => void
  disabled?: boolean
  toggleDisabled?: (checked: boolean) => void
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  // When toggle is disabled and can't be changed, the whole item is unavailable
  const unavailable = !Boolean(toggleDisabled) && disabled

  return (
    <Form.Item
      extra={<DiscountRateExtra disabled={unavailable} />}
      name={name}
      label={
        hideLabel ? undefined : (
          <div style={{ display: 'flex' }}>
            <FormItemLabel>
              <Trans>Discount rate</Trans>
            </FormItemLabel>
            {toggleDisabled ? (
              <React.Fragment>
                <Switch checked={!disabled} onChange={toggleDisabled} />{' '}
                {disabled ? (
                  <span style={{ color: colors.text.tertiary, marginLeft: 10 }}>
                    <Trans>(0%)</Trans>
                  </span>
                ) : null}
              </React.Fragment>
            ) : null}
          </div>
        )
      }
      style={style}
      {...formItemProps}
    >
      {!disabled ? (
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
      ) : null}
    </Form.Item>
  )
}
