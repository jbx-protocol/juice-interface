import { Form, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

import NumberSlider from '../../inputs/NumberSlider'
import { FormItemExt } from '../formItemExt'
import BondingCurveGraph from './BondingCurveGraph'

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

  const graphContainerId = 'graph-container'
  const bondingCurveId = 'bonding-curve'
  const baseCurveId = 'base-curve'

  useLayoutEffect(() => {
    try {
      // https://www.desmos.com/api/v1.6/docs/index.html
      setCalculator(
        Desmos.GraphingCalculator(document.getElementById(graphContainerId), {
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

  return (
    <Form.Item
      name={name}
      label={
        hideLabel ? undefined : (
          <div>
            <span>{label ? label : t`Bonding curve rate`}</span>{' '}
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
      style={style}
      extra={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BondingCurveGraph />
          <p>
            <Trans>
              This rate determines the amount of overflow that each token can be
              redeemed for at any given time. On a lower bonding curve,
              redeeming a token increases the value of each remaining token,
              creating an incentive to hodl tokens longer than others. The
              default bonding curve of 100% means all tokens will have equal
              value regardless of when they are redeemed. Learn more in this{' '}
              <a
                href="https://www.youtube.com/watch?v=dxqc3yMqi5M&ab_channel=JuiceboxDAO"
                rel="noreferrer"
                target="_blank"
              >
                short video
              </a>
              .
            </Trans>
          </p>
        </div>
      }
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
