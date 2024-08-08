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
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fromWad } from 'utils/format/formatNumber'

type Entry = {
  percent: number
  groupIndex: number
}

export default function TokenAreaChart({
  tokenSupply,
  participants,
}: {
  tokenSupply: BigNumber | undefined
  participants: ParticipantsQuery['participants'] | undefined
}) {
  const { themeOption } = useContext(ThemeContext)

  const groupCount = 12
  const groupSize = useMemo(
    () =>
      participants
        ? Math.floor(participants.length / groupCount) || 1 // Use floor for groupSize, unless floor is 0
        : undefined,
    [participants],
  )

  // Format participants into groups for chart display
  const chartData = useMemo(() => {
    if (!tokenSupply || !participants || !groupSize) return []

    let tempTotalBalance = BigNumber.from(0)
    let groupIndex = 0

    const participantGroups = participants.reduce((acc, curr, i) => {
      tempTotalBalance = tempTotalBalance.add(curr.balance)

      if (i >= groupSize - 1 && i % groupSize === 0) {
        // Add group
        const percent =
          (parseFloat(fromWad(tempTotalBalance)) /
            parseFloat(fromWad(tokenSupply))) *
          100
        tempTotalBalance = BigNumber.from(0)
        groupIndex = groupIndex + 1

        return [...acc, { percent, groupIndex: groupIndex - 1 }]
      } else if (i === participants.length - 1) {
        // Add incomplete group from remainder participants
        const percent =
          (parseFloat(fromWad(tempTotalBalance)) /
            parseFloat(fromWad(tokenSupply))) *
          100

        return [...acc, { percent, groupIndex }]
      }

      return acc
    }, [] as Entry[])

    return participantGroups
  }, [participants, tokenSupply, groupSize])

  const {
    theme: { colors },
  } = tailwind

  const chartFill = colors.bluebs[500]
  const textFill = themeOption === 'dark' ? colors.slate[200] : colors.grey[500]

  if (!chartData.length) return null

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 12,
          right: 74, // right margin visually centers chart area, accounting for left axis ticks
          left: 12,
        }}
      >
        <XAxis
          stroke={textFill}
          tick={false}
          style={{
            fontSize: 12,
            fill: textFill,
          }}
        >
          <Label value={'Wallets'} fill={textFill} position={'insideBottom'} />
        </XAxis>
        <YAxis
          dataKey="percent"
          stroke={textFill}
          tickFormatter={value => value + '%'}
          tickMargin={6}
          style={{
            fontSize: 12,
            fill: textFill,
          }}
        >
          <Label
            value={'Share'}
            angle={-90}
            fill={textFill}
            position={'left'}
          />
        </YAxis>
        <Area
          type="monotone"
          dataKey="percent"
          stroke={chartFill}
          fill={chartFill}
          fillOpacity={1}
        />
        <Tooltip
          cursor={{ stroke: textFill }}
          content={({ active, payload }) => {
            if (!active || !payload?.length || !groupSize) return null

            const { percent, groupIndex } = payload[0].payload

            const walletRange = `${groupSize * groupIndex}-
            ${
              groupIndex + 1 > groupCount
                ? participants?.length
                : groupSize * (groupIndex + 1)
            }`

            return (
              <div className="bg-smoke-100 p-2 text-sm dark:bg-slate-600">
                <div>
                  {percent >= 0.001 ? percent.toFixed(3) : '<0.001'}% of supply
                </div>
                <div className="text-grey-400 dark:text-slate-200">
                  Wallets {walletRange}
                </div>
              </div>
            )
          }}
          animationDuration={50}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
