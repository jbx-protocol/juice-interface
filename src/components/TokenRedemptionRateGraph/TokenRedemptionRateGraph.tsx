import { t } from '@lingui/macro'
import { DEFAULT_BONDING_CURVE_RATE_PERCENTAGE } from 'components/formItems/ProjectRedemptionRate'
import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext, useMemo } from 'react'
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from 'recharts'

const NUM_POINTS = 10

export const TokenRedemptionRateGraph = ({
  graphSize,
  value,
}: {
  value?: number | undefined
  graphSize: number
  graphPad: number
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const axisProps = {
    domain: [0, 10],
    stroke: colors.stroke.secondary,
    tick: false,
  }

  // Calculate the redemption rate using the below formula:
  // Formula: https://www.desmos.com/calculator/sp9ru6zbpk
  const calculateRedemptionDataPoints = useCallback((_value?: number) => {
    if (_value === undefined) return
    const overflow = NUM_POINTS
    const supply = NUM_POINTS
    const normValue = _value / 100

    const dataPoints = []
    for (let i = 0; i <= supply; i++) {
      dataPoints.push({
        x: i,
        y: overflow * (i / supply) * (normValue + (i - i * normValue) / supply),
      })
    }
    return dataPoints
  }, [])

  const initialDataPoints = useMemo(
    () => calculateRedemptionDataPoints(DEFAULT_BONDING_CURVE_RATE_PERCENTAGE),
    [calculateRedemptionDataPoints],
  )

  const dataPoints = calculateRedemptionDataPoints(value)

  return (
    <>
      <LineChart width={graphSize} height={graphSize} data={dataPoints}>
        <CartesianGrid stroke="1" />
        <XAxis
          {...axisProps}
          dataKey="x"
          label={
            <Label
              className="text-sm font-medium"
              value={t`% tokens redeemed`}
              fill={colors.text.primary}
            />
          }
        />
        <YAxis
          {...axisProps}
          dataKey="y"
          label={
            <Label
              className="text-sm font-medium"
              transform="rotate(-90)"
              value={t`Token redeem value`}
              angle={-90}
              fill={colors.text.primary}
            />
          }
        />
        <Line
          type="monotone"
          data={initialDataPoints}
          dataKey="y"
          stroke={colors.stroke.secondary}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={colors.text.brand.primary}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </>
  )
}
