import { Trans } from '@lingui/macro'
import { Form, Space } from 'antd'

import FormItemLabel from 'components/FormItemLabel'
import { useState } from 'react'

import ExternalLink from 'components/ExternalLink'
import { MinimalCollapse } from 'components/MinimalCollapse'

import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph/TokenRedemptionRateGraph'
import FormItemWarningText from '../FormItemWarningText'
import NumberSlider from '../inputs/NumberSlider'
import SwitchHeading from '../SwitchHeading'
import { FormItemExt } from './formItemExt'
import { Callout } from 'components/Callout'

export const DEFAULT_BONDING_CURVE_RATE_PERCENTAGE = 100

function BondingCurveRateExtra({
  disabled,
  value,
}: {
  disabled?: boolean
  value: string | undefined
}) {
  return (
    <Space className="text-sm" direction="vertical" size="large">
      <p className="m-0">
        <Trans>
          The redemption rate determines the amount of overflow each token can
          be redeemed for.
        </Trans>
      </p>

      {value === '0' ? (
        <Callout.Warning>
          <Trans>
            Token holders <strong>cannot redeem their tokens</strong> for any
            ETH when the redemption rate is 0.
          </Trans>
        </Callout.Warning>
      ) : null}

      <MinimalCollapse
        header={<Trans>How do I set the redemption rate?</Trans>}
      >
        <Trans>
          <p>
            On a lower redemption rate, redeeming a token increases the value of
            each remaining token, creating an incentive to hold tokens longer
            than other holders.
          </p>{' '}
          <p>
            A redemption rate of 100% means all tokens will have equal value
            regardless of when they are redeemed.
          </p>
          Learn more in this{' '}
          <ExternalLink href="https://youtu.be/dxqc3yMqi5M">
            short video
          </ExternalLink>
          .
        </Trans>
      </MinimalCollapse>

      {disabled && (
        <FormItemWarningText>
          <Trans>
            Disabled when your funding cycle's distribution limit is{' '}
            <strong>No limit</strong> (infinite)
          </Trans>
        </FormItemWarningText>
      )}
    </Space>
  )
}

export function ProjectRedemptionRate({
  className,
  name,
  hideLabel,
  value,
  label,
  formItemProps,
  onChange,
  checked,
  onToggled,
  disabled,
}: {
  className?: string
  value: string | undefined
  label?: string | JSX.Element
  onChange: (val?: number) => void
  checked?: boolean
  onToggled?: (checked: boolean) => void
  disabled?: boolean
} & FormItemExt) {
  const [graphValue, setGraphValue] = useState<number>()

  return (
    <div className={className}>
      <Form.Item
        name={name}
        label={
          hideLabel ? undefined : (
            <div className="flex">
              {onToggled ? (
                <SwitchHeading
                  checked={Boolean(checked)}
                  onChange={checked => {
                    onToggled(checked)
                    if (!checked)
                      onChange(DEFAULT_BONDING_CURVE_RATE_PERCENTAGE)
                  }}
                  disabled={disabled}
                >
                  {label ?? <Trans>Redemption rate</Trans>}
                </SwitchHeading>
              ) : (
                <FormItemLabel>
                  {label ?? <Trans>Redemption rate</Trans>}
                </FormItemLabel>
              )}
            </div>
          )
        }
        extra={<BondingCurveRateExtra disabled={disabled} value={value} />}
        {...formItemProps}
      >
        {!disabled && !(onToggled && !checked) && (
          <NumberSlider
            className="flex-grow"
            min={0}
            max={100}
            step={0.5}
            name={name}
            sliderValue={
              value ? parseFloat(value) : DEFAULT_BONDING_CURVE_RATE_PERCENTAGE
            }
            onChange={(val: number | undefined) => {
              setGraphValue(val)
              onChange(val)
            }}
            suffix="%"
          />
        )}
      </Form.Item>

      <TokenRedemptionRateGraph
        value={graphValue}
        graphPad={50}
        graphSize={300}
      />
    </div>
  )
}
