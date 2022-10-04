import { Trans } from '@lingui/macro'
import { DEFAULT_BONDING_CURVE_RATE_PERCENTAGE } from 'components/formItems/ProjectRedemptionRate'
import { ThemeContext } from 'contexts/themeContext'
import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export const TokenRedemptionRateGraph = ({
  graphSize,
  graphPad,
  value,
}: {
  value?: number | undefined
  graphSize: number
  graphPad: number
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const graphRef = useRef<HTMLDivElement | null>(null)

  const [calculator, setCalculator] = useState<any>() // eslint-disable-line @typescript-eslint/no-explicit-any

  const bondingCurveId = 'bonding-curve'
  const baseCurveId = 'base-curve'

  const labelStyle: CSSProperties = {
    fontSize: '.9rem',
    fontWeight: 500,
  }

  useLayoutEffect(() => {
    try {
      // https://www.desmos.com/api/v1.6/docs/index.html
      setCalculator(
        Desmos.GraphingCalculator(graphRef.current, {
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
    () => graphCurve(value ?? DEFAULT_BONDING_CURVE_RATE_PERCENTAGE),
    [calculator, graphCurve, value],
  )

  return (
    <table
      style={{ tableLayout: 'fixed', width: graphSize, height: graphSize }}
    >
      <tr>
        <td style={{ ...labelStyle }}>
          <div style={{ display: 'table' }}>
            <div style={{ padding: '50% 0.5rem', height: 0 }}>
              <div
                style={{
                  display: 'block',
                  transformOrigin: 'top left',
                  transform: 'rotate(-90deg) translate(-100%)',
                  marginTop: '-50%',
                  whiteSpace: 'nowrap',
                }}
              >
                <Trans>Token redeem value</Trans>
              </div>
            </div>
          </div>
        </td>
        <td
          style={{
            width: graphSize - graphPad,
            borderLeft: '1px solid',
            borderBottom: '1px solid',
            borderColor: colors.stroke.secondary,
          }}
        >
          <div
            ref={graphRef}
            style={{
              width: graphSize - graphPad,
              height: graphSize - graphPad,
            }}
          />
        </td>
      </tr>
      <tr
        style={{
          height: graphPad,
          width: '100%',
          textAlign: 'center',
          ...labelStyle,
        }}
      >
        <td style={{ width: graphPad }} />
        <td
          style={{
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          <Trans>% tokens redeemed</Trans>
        </td>
      </tr>
    </table>
  )
}
