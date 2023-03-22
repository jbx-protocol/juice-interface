import { Trans } from '@lingui/macro'
import { Select } from 'antd'
import Loading from 'components/Loading'
import WalletCard from 'components/WalletCard'
import { useLeaderboard } from 'hooks/Leaderboard'
import { useWalletsQuery } from 'hooks/Wallets'
import { useState } from 'react'

const COUNT = 10

export function Leaderboard() {
  const [timeWindow, setTimeWindow] = useState<30 | 'allTime'>(30)

  const { data: allTimeWallets, isLoading } = useWalletsQuery({
    orderBy: 'totalPaid',
    pageSize: COUNT
  })

  const windowWallets = useLeaderboard({
    count: COUNT,
    windowDays: typeof timeWindow === 'number' ? timeWindow : null,
  })

  const wallets = timeWindow === 'allTime' ? allTimeWallets : windowWallets

  console.log('asdf', wallets)

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="flex flex-wrap items-start justify-between">
        <h1>Top Contributors</h1>{' '}
        <div>
          <Select
            className="small w-[200px]"
            value={timeWindow}
            onChange={val => setTimeWindow(val)}
          >
            <Select.Option value={30}>
              <Trans>30 days</Trans>
            </Select.Option>
            <Select.Option value={'allTime'}>
              <Trans>All time</Trans>
            </Select.Option>
          </Select>
        </div>
      </header>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-2">
          {wallets?.map((w, i) => (
            <WalletCard key={w.id} wallet={w} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
