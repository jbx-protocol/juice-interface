import { Form, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useState } from 'react'

import ExternalLink from 'components/shared/ExternalLink'

import NumberSlider from '../../inputs/NumberSlider'
import { FormItemExt } from '../formItemExt'
import BondingCurveGraph from './BondingCurveGraph'

const DEFAULT_BONDING_CURVE_RATE = 100

export default function ProjectBondingCurveRate({
  name,
  hideLabel,
  value,
  style = {},
  label,
  formItemProps,
  onChange,
  disabled,
  toggleDisabled,
}: {
  value: string | undefined
  style?: CSSProperties
  label?: string
  onChange: (val?: number) => void
  toggleDisabled?: (checked: boolean) => void
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [bondingCurveRate, setBondingCurveRate] = useState<number | undefined>(
    value ? parseFloat(value) : DEFAULT_BONDING_CURVE_RATE,
  )

  const FormItemLabel = () => {
    return (
      <div>
        <span>{label ?? t`Bonding curve rate`}</span>{' '}
        {toggleDisabled ? (
          <>
            <Switch checked={!disabled} onChange={toggleDisabled} />{' '}
            {disabled ? (
              <span style={{ color: colors.text.tertiary }}>
                <Trans>(100%)</Trans>
              </span>
            ) : null}
          </>
        ) : null}
      </div>
    )
  }

  return (
    <Form.Item
      name={name}
      label={!hideLabel && <FormItemLabel />}
      style={style}
      extra={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BondingCurveGraph
            value={bondingCurveRate ?? DEFAULT_BONDING_CURVE_RATE}
          />
          <p>
            <Trans>
              This rate determines the amount of overflow that each token can be
              redeemed for at any given time. On a lower bonding curve,
              redeeming a token increases the value of each remaining token,
              creating an incentive to hodl tokens longer than others. A bonding
              curve of 100% means all tokens will have equal value regardless of
              when they are redeemed.
            </Trans>
            <Trans>
              Learn more in this{' '}
              <ExternalLink href="https://youtu.be/dxqc3yMqi5M">
                short video
              </ExternalLink>
              .
            </Trans>
          </p>
        </div>
      }
      {...formItemProps}
    >
      <NumberSlider
        min={0}
        max={100}
        step={0.5}
        name={name}
        defaultValue={100}
        sliderValue={value ? parseFloat(value) : DEFAULT_BONDING_CURVE_RATE}
        disabled={disabled}
        onChange={(val: number | undefined) => {
          onChange(val)
          setBondingCurveRate(val)
        }}
        suffix="%"
        style={{ flexGrow: 1 }}
      />
    </Form.Item>
  )
}
