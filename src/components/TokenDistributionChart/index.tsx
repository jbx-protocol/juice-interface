import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { BigNumber, constants } from 'ethers'
import {
  OrderDirection,
  Participant_OrderBy,
  ParticipantsDocument,
  ParticipantsQuery,
  QueryParticipantsArgs,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
import tailwind from 'lib/tailwind'
import { PV } from 'models/pv'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Cell, Pie, PieChart } from 'recharts'
import { formattedNum, fromWad } from 'utils/format/formatNumber'

type Entry = {
  wallet?: string
  walletsCount?: number
  balance: number | undefined
  percent: number
}

export default function TokenDistributionChart({
  projectId,
  pv,
  tokenSupply,
}: {
  projectId: number | undefined
  pv: PV | undefined
  tokenSupply: BigNumber | undefined
}) {
  const [activeWallet, setActiveWallet] = useState<Entry>()

  const { themeOption } = useContext(ThemeContext)

  const { data: allParticipants, isLoading } = useQuery(
    [`token-holders-${projectId}-${pv}`],
    () =>
      paginateDepleteQuery<ParticipantsQuery, QueryParticipantsArgs>({
        client,
        document: ParticipantsDocument,
        variables: {
          orderDirection: OrderDirection.desc,
          orderBy: Participant_OrderBy.balance,
          where: {
            projectId,
            pv,
            balance_gt: BigNumber.from(0),
            wallet_not: constants.AddressZero,
          },
        },
      }),
    {
      staleTime: 5 * 60 * 1000, // 5 min
      enabled: !!(projectId && pv),
    },
  )

  // Format participants for chart display
  const chartData = useMemo(() => {
    if (!tokenSupply || !allParticipants) return []

    // Only show wallets with a minimum (arbitrary) balance to avoid chart clutter
    const minBalanceThreshold = tokenSupply.div(400) // 0.25% of token supply

    const visibleWallets: typeof allParticipants = []
    const remainderWallets: typeof allParticipants = []

    allParticipants.forEach(p =>
      (p.balance.gte(minBalanceThreshold)
        ? visibleWallets
        : remainderWallets
      ).push(p),
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
  }, [allParticipants, tokenSupply])

  // Default activate first chartData entry
  useEffect(() => {
    if (chartData) setActiveWallet(a => (a ? a : chartData[0]))
  }, [chartData])

  // Don't render chart for projects with no token supply
  if (tokenSupply?.eq(0)) return null

  const size = 320

  if (isLoading) {
    return (
      <div style={{ height: size, width: size }}>
        <Loading />
      </div>
    )
  }

  const {
    theme: { colors },
  } = tailwind

  const inactiveFill =
    themeOption === 'dark' ? colors.bluebs[600] : colors.bluebs[300]
  const activeFill =
    themeOption === 'dark' ? colors.bluebs[300] : colors.bluebs[500]
  const remainderInactiveFill =
    themeOption === 'dark' ? colors.grey[400] : colors.grey[300]
  const remainderActiveFill =
    themeOption === 'dark' ? colors.grey[300] : colors.grey[400]
  const stroke = themeOption === 'dark' ? colors.slate[800] : colors.smoke[25]

  return (
    <div
      className="flex items-center justify-center"
      onMouseLeave={() => {
        setActiveWallet(undefined)
      }}
    >
      <PieChart width={size} height={size}>
        <Pie
          data={chartData}
          dataKey="balance"
          nameKey="wallet"
          cx="50%"
          cy="50%"
          outerRadius={size / 2}
          innerRadius={size / 2 - 60}
          stroke={stroke}
          minAngle={1}
          startAngle={0}
          endAngle={345}
        >
          {chartData.map((entry, index) => {
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
