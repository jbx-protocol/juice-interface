import { Form, InputNumber, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'

import React, { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { FormItemExt } from './formItemExt'

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

  return (
    <Form.Item
      extra={t`The ratio of tokens rewarded per payment amount will decrease by this percentage with each new funding cycle. A higher discount rate will incentivize supporters to pay your project earlier than later.`}
      name={name}
      label={
        hideLabel ? undefined : (
          <div>
            <Trans>Discount rate</Trans>{' '}
            {toggleDisabled ? (
              <React.Fragment>
                <Switch checked={!disabled} onChange={toggleDisabled} />{' '}
                {disabled ? (
                  <span style={{ color: colors.text.tertiary }}>
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
        <div>
          <InputNumber
            onChange={val => onChange(parseFloat(val))}
            defaultValue={value ?? '0'}
            formatter={(val?: string | number | undefined) => {
              let _val = val?.toString() ?? '0'
              return `${_val ?? ''}%`
            }}
          />
        </div>
      ) : null}
    </Form.Item>
  )
}
