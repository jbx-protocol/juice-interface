import { Form, Switch } from 'antd'
import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import React, { CSSProperties, useContext } from 'react'
import FormItemLabel from 'components/v2/V2Create/FormItemLabel'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

export default function ProjectReserved({
  name,
  hideLabel,
  formItemProps,
  value,
  style = {},
  onChange,
  disabled,
  toggleDisabled,
}: {
  value: number | undefined
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
      extra={
        <Trans>
          Whenever someone pays your project, this percentage of tokens will be
          reserved and the rest will go to the payer. By default, these tokens
          are reserved for the project owner, but you can also allocate portions
          to other wallet addresses. Anyone can submit the transaction to
          distribute reserved tokens according to the allocation.
        </Trans>
      }
      name={name}
      label={
        hideLabel ? undefined : (
          <div style={{ display: 'flex' }}>
            <FormItemLabel>
              <Trans>Reserved rate</Trans>
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
