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

const graphContainerId = 'graph-container'
const bondingCurveId = 'bonding-curve'
const baseCurveId = 'base-curve'

export default function BondingCurveGraph({ value }: { value: number }) {
  const { colors } = useContext(ThemeContext).theme
  const [calculator, setCalculator] = useState<any>()

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

  useEffect(() => graphCurve(value), [calculator, graphCurve, value])

  const labelStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    textAlign: 'center',
    position: 'absolute',
  }

  const graphSize = 180
  const graphPad = 50
  return (
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
  )
}
