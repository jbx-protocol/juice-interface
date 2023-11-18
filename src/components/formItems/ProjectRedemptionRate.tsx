import { Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { Callout } from 'components/Callout/Callout'
import FormItemLabel from 'components/FormItemLabel'
import FormItemWarningText from 'components/FormItemWarningText'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph/TokenRedemptionRateGraph'
import { REDEMPTION_RATE_EXPLANATION } from 'components/strings'
import { useState } from 'react'
import SwitchHeading from '../SwitchHeading'
import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

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
          The redemption rate determines how token holders can burn their tokens
          to reclaim a portion of the ETH not needed for payouts.
        </Trans>
      </p>

      {value === '0' ? (
        <Callout.Warning>
          <Trans>
            Token holders <strong>cannot redeem their tokens</strong> for ETH
            when the redemption rate is 0%.
          </Trans>
        </Callout.Warning>
      ) : null}

      <MinimalCollapse
        header={<Trans>How do I set the redemption rate?</Trans>}
      >
        {REDEMPTION_RATE_EXPLANATION}
      </MinimalCollapse>

      {disabled && (
        <FormItemWarningText>
          <Trans>
            Redemptions aren't possible when all of a project's ETH is being
            used for payouts.
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
