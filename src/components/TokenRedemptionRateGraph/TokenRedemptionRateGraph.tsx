import { t } from '@lingui/macro'
import { DEFAULT_BONDING_CURVE_RATE_PERCENTAGE } from 'components/formItems/ProjectRedemptionRate'
import { JUICE_ORANGE } from 'constants/theme/colors'
import { useCallback, useMemo } from 'react'
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
  const axisProps = {
    domain: [0, 10],
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
      const y =
        _value > 0
          ? overflow * (i / supply) * (normValue + (i - i * normValue) / supply)
          : 0
      dataPoints.push({
        x: i,
        y,
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
          label={<Label className="text-sm" value={t`% tokens redeemed`} />}
        />
        <YAxis
          {...axisProps}
          dataKey="y"
          label={
            <Label
              className="text-sm"
              transform="rotate(-90)"
              value={t`Token redeem value`}
              angle={-90}
            />
          }
        />
        <Line
          type="monotone"
          data={initialDataPoints}
          dataKey="y"
          strokeWidth={2}
          stroke="#A3A3A3" // grey-400
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={JUICE_ORANGE}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </>
  )
}
