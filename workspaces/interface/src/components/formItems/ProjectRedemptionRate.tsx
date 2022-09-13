import { Trans } from '@lingui/macro'
import { Form, Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import FormItemLabel from 'pages/create/FormItemLabel'
import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

import ExternalLink from 'components/ExternalLink'
import { MinimalCollapse } from 'components/MinimalCollapse'

import FormItemWarningText from '../FormItemWarningText'
import NumberSlider from '../inputs/NumberSlider'
import SwitchHeading from '../SwitchHeading'
import { FormItemExt } from './formItemExt'

const GRAPH_CONTAINER_ID = 'graph-container'
export const DEFAULT_BONDING_CURVE_RATE_PERCENTAGE = '100'

function BondingCurveRateExtra({
  disabled,
  value,
}: {
  disabled?: boolean
  value: string | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Space style={{ fontSize: '0.9rem' }} direction="vertical" size="large">
      <p style={{ margin: 0 }}>
        <Trans>
          The redemption rate determines the amount of overflow each token can
          be redeemed for.
        </Trans>
      </p>

      {value === '0' ? (
        <span style={{ color: colors.text.warn }}>
          <Trans>
            Token holders <strong>cannot redeem their tokens</strong> for any
            ETH when the redemption rate is 0.
          </Trans>
        </span>
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
  name,
  hideLabel,
  value,
  style = {},
  label,
  formItemProps,
  onChange,
  checked,
  onToggled,
  disabled,
}: {
  value: string | undefined
  style?: CSSProperties
  label?: string | JSX.Element
  onChange: (val?: number) => void
  checked?: boolean
  onToggled?: (checked: boolean) => void
  disabled?: boolean
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const labelStyle: CSSProperties = {
    fontSize: '.9rem',
    fontWeight: 500,
    textAlign: 'center',
    position: 'absolute',
  }

  const graphSize = 300
  const graphPad = 50
  const [calculator, setCalculator] = useState<any>() // eslint-disable-line @typescript-eslint/no-explicit-any

  const bondingCurveId = 'bonding-curve'
  const baseCurveId = 'base-curve'

  useLayoutEffect(() => {
    try {
      // https://www.desmos.com/api/v1.6/docs/index.html
      setCalculator(
        Desmos.GraphingCalculator(document.getElementById(GRAPH_CONTAINER_ID), {
          keypad: false,
          expressions: false,
          settingsMenu: false,
          zoomButtons: false,
          expressionsTopbar: false,
          pointsOfInterest: false,
          trace: false,
          border: false,
          lockViewport: true,
          images: false,
          folders: false,
          notes: false,
          sliders: false,
          links: false,
          distributions: false,
          pasteTableData: false,
          showGrid: false,
          showXAxis: false,
          showYAxis: false,
          xAxisNumbers: false,
          yAxisNumbers: false,
          polarNumbers: false,
        }),
      )
    } catch (e) {
      console.error('Error setting calculator', e)
    }
  }, [])

  const graphCurve = useCallback(
    (_value?: number) => {
      if (_value === undefined || !calculator) return

      const overflow = 10
      const supply = 10

      calculator.setMathBounds({
        left: 0,
        bottom: 0,
        right: 10,
        top: 10,
      })
      calculator.removeExpressions([
        { id: bondingCurveId },
        { id: baseCurveId },
      ])
      calculator.setExpression({
        id: baseCurveId,
        latex: `y=x`,
        color: colors.stroke.secondary,
      })
      if (_value === 0) {
        calculator.setExpression({
          id: bondingCurveId,
          latex: `y=0`,
          color: colors.text.brand.primary,
        })
        return
      }
      calculator.setExpression({
        id: bondingCurveId,
        latex: `y=${overflow} * (x/${supply}) * (${_value / 100} + (x - x${
          _value / 100
        })/${supply})`,
        color: colors.text.brand.primary,
      })
    },
    [calculator, colors.stroke.secondary, colors.text.brand.primary],
  )

  useEffect(
    () =>
      graphCurve(parseFloat(value ?? DEFAULT_BONDING_CURVE_RATE_PERCENTAGE)),
    [calculator, graphCurve, value],
  )

  return (
    <div style={style}>
      <Form.Item
        name={name}
        label={
          hideLabel ? undefined : (
            <div style={{ display: 'flex' }}>
              {onToggled ? (
                <SwitchHeading
                  checked={Boolean(checked)}
                  onChange={checked => {
                    onToggled(checked)
                    if (!checked)
                      onChange(parseInt(DEFAULT_BONDING_CURVE_RATE_PERCENTAGE))
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
            min={0}
            max={100}
            step={0.5}
            name={name}
            sliderValue={parseFloat(
              value ?? DEFAULT_BONDING_CURVE_RATE_PERCENTAGE,
            )}
            onChange={(val: number | undefined) => {
              graphCurve(val)
              onChange(val)
            }}
            suffix="%"
            style={{ flexGrow: 1 }}
          />
        )}
      </Form.Item>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: graphSize,
              width: graphSize,
            }}
          >
            <div
              id={GRAPH_CONTAINER_ID}
              style={{
                width: graphSize - graphPad,
                height: graphSize - graphPad,
              }}
            ></div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: graphPad / 2,
              left: graphPad / 2,
              width: graphSize - graphPad,
              height: graphSize - graphPad,
              borderLeft: '2px solid ' + colors.stroke.secondary,
              borderBottom: '2px solid ' + colors.stroke.secondary,
            }}
          ></div>

          <div
            style={{
              ...labelStyle,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            % <Trans>tokens redeemed</Trans>
          </div>

          <div
            style={{
              ...labelStyle,
              transform: 'rotate(-90deg)',
              bottom: 0,
              top: 0,
              left: 0,
              width: graphSize,
            }}
          >
            <Trans>Token redeem value</Trans>
          </div>
        </div>
      </div>
    </div>
  )
}
