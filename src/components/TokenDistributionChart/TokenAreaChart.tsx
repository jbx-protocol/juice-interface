import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { BigNumber } from 'ethers'
import { ParticipantsQuery } from 'generated/graphql'
import tailwind from 'lib/tailwind'
import { useContext, useMemo } from 'react'
import {
  Area,
  AreaChart,
  Label,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { fromWad } from 'utils/format/formatNumber'

type Entry = {
  percent: number
}

export default function TokenAreaChart({
  tokenSupply,
  participants,
  height,
}: {
  tokenSupply: BigNumber | undefined
  participants: ParticipantsQuery['participants'] | undefined
  height: number
}) {
  const { themeOption } = useContext(ThemeContext)

  const groupCount = 8
  const groupSize = useMemo(
    () =>
      participants ? Math.floor(participants.length / groupCount) : undefined,
    [participants],
  )

  // Format participants for chart display
  const areaChartData = useMemo(() => {
    if (!tokenSupply || !participants || !groupSize) return []

    let tempTotalBalance = BigNumber.from(0)
    const participantGroups = participants.reduce((acc, curr, i) => {
      tempTotalBalance = tempTotalBalance.add(curr.balance)

      if (i && i % groupSize === 0) {
        const percent =
          (parseFloat(fromWad(tempTotalBalance)) /
            parseFloat(fromWad(tokenSupply))) *
          100
        tempTotalBalance = BigNumber.from(0)
        return [...acc, { percent }]
      }

      return acc
    }, [] as Entry[])

    return participantGroups
  }, [participants, tokenSupply, groupSize])

  const {
    theme: { colors },
  } = tailwind

  const textFill =
    themeOption === 'dark' ? colors.slate[200] : colors.slate[400]
  const chartFill =
    themeOption === 'dark' ? colors.bluebs[600] : colors.bluebs[500]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={areaChartData}
        margin={{
          top: 20,
          right: 60,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis tick={false} dataKey="percent" stroke={textFill}>
          <Label value={'Wallets'} fill={textFill} />
        </XAxis>
        <YAxis
          dataKey="percent"
          stroke={textFill}
          ticks={[100, 75, 50, 25, 0]}
          tick={({ payload, x, y }) => (
            <text
              fill={textFill}
              fontSize={12}
              transform={`translate(${
                x - 8 * (payload.value.toString().length + 1)
              },${y + 4})`}
            >
              {payload.value}%
            </text>
          )}
        >
          <Label
            value={'Tokens'}
            angle={-90}
            fill={textFill}
            // offset={20}
            position={{ x: 16, y: height / 2 - 50 }}
          />
        </YAxis>
        <Area
          type="monotone"
          dataKey="percent"
          stroke={chartFill}
          fill={chartFill}
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
