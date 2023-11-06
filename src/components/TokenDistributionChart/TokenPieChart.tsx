import EthereumAddress from 'components/EthereumAddress'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { BigNumber } from 'ethers'
import { ParticipantsQuery } from 'generated/graphql'
import tailwind from 'lib/tailwind'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { formattedNum, fromWad } from 'utils/format/formatNumber'

type Entry = {
  wallet?: string
  walletsCount?: number
  balance: number | undefined
  percent: number
}

export default function TokenPieChart({
  tokenSupply,
  participants,
  size,
}: {
  tokenSupply: BigNumber | undefined
  participants: ParticipantsQuery['participants'] | undefined
  size: number
}) {
  const { themeOption } = useContext(ThemeContext)

  const [activeWallet, setActiveWallet] = useState<Entry>()

  // Format participants for chart display
  const pieChartData = useMemo(() => {
    if (!tokenSupply || !participants) return []

    // Only show (arbitrary) max number of wallets to avoid chart clutter
    const maxVisibleWallets = 80

    const visibleWallets: typeof participants = []
    const remainderWallets: typeof participants = []

    participants.forEach((p, i) =>
      (i < maxVisibleWallets ? visibleWallets : remainderWallets).push(p),
    )

    const _chartData = visibleWallets.reduce(
      (acc, curr) => [
        ...acc,
        {
          wallet: curr.wallet.id,
          balance: parseFloat(fromWad(curr.balance)),
          percent:
            parseFloat(fromWad(curr.balance)) /
            parseFloat(fromWad(tokenSupply)),
        },
      ],
      [] as Entry[],
    )

    // If any remainder wallets, include them as a single entry
    if (remainderWallets.length) {
      // Calculate total tokens held by remainder participants
      const remainderBalance = remainderWallets.reduce(
        (acc, curr) => acc.add(curr.balance),
        BigNumber.from(0),
      )

      _chartData.push({
        walletsCount: remainderWallets.length,
        balance: parseFloat(fromWad(remainderBalance)),
        percent:
          parseFloat(fromWad(remainderBalance)) /
          parseFloat(fromWad(tokenSupply)),
      })
    }

    return _chartData
  }, [participants, tokenSupply])

  // Default activate first pieChart entry
  useEffect(() => {
    if (pieChartData) setActiveWallet(a => (a ? a : pieChartData[0]))
  }, [pieChartData])

  const {
    theme: { colors },
  } = tailwind

  const inactiveFill = colors.bluebs[500]
  const activeFill = colors.bluebs[300]
  const remainderInactiveFill = colors.grey[500]
  const remainderActiveFill = colors.grey[300]
  const stroke = themeOption === 'dark' ? colors.slate[800] : colors.smoke[25]

  return (
    <div className="relative flex items-center justify-center">
      <PieChart
        width={size}
        height={size}
        onMouseLeave={() => {
          setActiveWallet(undefined)
        }}
      >
        <Pie
          data={pieChartData}
          dataKey="balance"
          nameKey="wallet"
          cx="50%"
          cy="50%"
          outerRadius={size / 2}
          innerRadius={size / 2 - 60}
          stroke={stroke}
          minAngle={1.5}
          startAngle={0}
          endAngle={345}
        >
          {pieChartData.map((entry, index) => {
            let fill: string
            if (activeWallet && activeWallet.wallet === entry.wallet) {
              fill = entry.wallet ? activeFill : remainderActiveFill
            } else {
              fill = entry.wallet ? inactiveFill : remainderInactiveFill
            }

            return (
              <Cell
                key={`cell-${index}`}
                fill={fill}
                onMouseEnter={() => setActiveWallet(entry)}
              />
            )
          })}
        </Pie>
      </PieChart>

      <div className="absolute overflow-visible whitespace-pre text-center text-sm">
        {activeWallet && (
          <>
            <div className={activeWallet.walletsCount ? '' : 'font-medium'}>
              {activeWallet.wallet ? (
                <EthereumAddress address={activeWallet.wallet} />
              ) : (
                `${formattedNum(activeWallet.walletsCount)} wallets`
              )}
            </div>
            <div className="text-xs">
              {formattedNum(Math.round(activeWallet.balance ?? 0))}
            </div>
            <div className="text-xs font-medium" style={{ color: activeFill }}>
              {(activeWallet.percent * 100).toFixed(2)}%
            </div>
          </>
        )}
      </div>
    </div>
  )
}
