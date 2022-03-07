import { Form, Switch } from 'antd'
import { Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import FormItemLabel from 'components/v2/V2Create/FormItemLabel'

import ExternalLink from 'components/shared/ExternalLink'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

const GRAPH_CONTAINER_ID = 'graph-container'

function BondingCurveRateExtra({ disabled }: { disabled?: boolean }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const labelStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    textAlign: 'center',
    position: 'absolute',
  }

  const graphSize = 180
  const graphPad = 50

  return (
    <div>
      {disabled && (
        <p>
          <Trans>
            <i style={{ color: colors.text.warn }}>
              Disabled when funding target has not been set.
            </i>
          </Trans>
        </p>
      )}
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
        <p>
          <Trans>
            This rate determines the amount of overflow that each token can be
            redeemed for at any given time. On a lower bonding curve, redeeming
            a token increases the value of each remaining token, creating an
            incentive to hodl tokens longer than others. The default bonding
            curve of 100% means all tokens will have equal value regardless of
            when they are redeemed. Learn more in this{' '}
            <ExternalLink href="https://youtu.be/dxqc3yMqi5M">
              short video
            </ExternalLink>
            .
          </Trans>
        </p>
      </div>
    </div>
  )
}

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
  const { colors } = useContext(ThemeContext).theme
  const [calculator, setCalculator] = useState<any>()

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
        id: bondingCurveId,
        latex: `y=${overflow} * (x/${supply}) * (${_value / 100} + (x - x${
          _value / 100
        })/${supply})`,
        color: colors.text.brand.primary,
      })
      calculator.setExpression({
        id: baseCurveId,
        latex: `y=x`,
        color: colors.stroke.secondary,
      })
    },
    [calculator, colors.stroke.secondary, colors.text.brand.primary],
  )

  useEffect(
    () => graphCurve(parseFloat(value ?? '100')),
    [calculator, graphCurve, value],
  )

  // When toggle is disabled and can't be changed, the whole item is unavailable
  const unavailable = !Boolean(toggleDisabled) && disabled

  return (
    <Form.Item
      name={name}
      label={
        hideLabel ? undefined : (
          <div style={{ display: 'flex' }}>
            <FormItemLabel>
              {label ?? <Trans>Bonding curve rate</Trans>}
            </FormItemLabel>
            {toggleDisabled ? (
              <>
                <Switch checked={!disabled} onChange={toggleDisabled} />{' '}
                {disabled ? (
                  <span style={{ color: colors.text.tertiary, marginLeft: 10 }}>
                    <Trans>(100%)</Trans>
                  </span>
                ) : null}
              </>
            ) : null}
          </div>
        )
      }
      style={style}
      extra={<BondingCurveRateExtra disabled={unavailable} />}
      {...formItemProps}
    >
      {!disabled ? (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          <NumberSlider
            min={0}
            max={100}
            step={0.5}
            name={name}
            defaultValue={100}
            sliderValue={parseFloat(value ?? '100')}
            disabled={disabled}
            onChange={(val: number | undefined) => {
              graphCurve(val)
              onChange(val)
            }}
            suffix="%"
            style={{ flexGrow: 1 }}
          />
        </div>
      ) : null}
    </Form.Item>
  )
}
