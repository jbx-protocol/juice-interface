import { Form } from 'antd'
import { colors } from 'constants/styles/colors'
import { CSSProperties, useEffect } from 'react'
import { useLayoutEffect, useMemo, useState } from 'react'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'
import { padding } from 'constants/styles/padding'

export default function ProjectBondingCurveRate({
  name,
  hideLabel,
  value,
  formItemProps,
  onChange,
}: {
  value: number | undefined
  onChange: (val?: number) => void
} & FormItemExt) {
  const [calculator, setCalculator] = useState<any>()

  const graphContainerId = 'graph-container'
  const bondingCurveId = 'bonding-curve'
  const baseCurveId = 'base-curve'

  useLayoutEffect(() => {
    if (calculator) return

    // https://www.desmos.com/api/v1.6/docs/index.html
    setCalculator(
      Desmos?.GraphingCalculator(document.getElementById(graphContainerId), {
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
  }, [])

  useEffect(() => graphCurve(value), [calculator])

  function graphCurve(_value?: number) {
    if (_value === undefined || !calculator) return

    const overflow = 10
    const supply = 10

    calculator.setMathBounds({
      left: 0,
      bottom: 0,
      right: 10,
      top: 10,
    })
    calculator.removeExpressions([{ id: bondingCurveId }, { id: baseCurveId }])
    calculator.setExpression({
      id: bondingCurveId,
      latex: `y=${overflow} * (x/${supply}) * (${_value / 100} + (x - x${
        _value / 100
      })/${supply})`,
      color: colors.juiceOrange,
    })
    calculator.setExpression({
      id: baseCurveId,
      latex: `y=x`,
      color: colors.grapeHint,
    })
  }

  const labelStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    textAlign: 'center',
    position: 'absolute',
  }

  const graphSize = 180
  const graphPad = 50

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Bonding curve rate'}
      extra={
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
                id={graphContainerId}
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
                borderLeft: '2px solid ' + colors.grapeHint,
                borderBottom: '2px solid ' + colors.grapeHint,
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
              % tickets redeemed
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
              Ticket redeem value
            </div>
          </div>

          <div>
            A lower bonding curve has the effect of increasing the redeem value
            of a ticket as the remaining ticket supply decreases, creating
            incentive to hodl tickets and not redeem them early. A bonding curve
            of 100% means all tickets will have the same value regardless of
            when they are redeemed.
          </div>
        </div>
      }
      {...formItemProps}
    >
      <NumberSlider
        min={0}
        max={100}
        step={0.1}
        value={value}
        onChange={val => {
          graphCurve(val)
          onChange(val)
        }}
        suffix="%"
      />
    </Form.Item>
  )
}
