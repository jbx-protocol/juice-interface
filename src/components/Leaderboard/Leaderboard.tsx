import { Trans } from '@lingui/macro'
import { Select } from 'antd'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import WalletCard from 'components/WalletCard'
import { useWalletsQuery } from 'hooks/Wallets'
import { useState } from 'react'

export function Leaderboard() {
  const [orderBy, setOrderBy] = useState<'totalPaid' | 'lastPaidTimestamp'>(
    'totalPaid',
  )
  const { data: wallets, isLoading } = useWalletsQuery({ orderBy })

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="flex flex-wrap items-start justify-between">
        <h1>Top Contributors</h1>{' '}
        <div>
          <Select
            className="small w-[200px]"
            value={orderBy}
            onChange={val => setOrderBy(val)}
          >
            <Select.Option value="totalPaid">
              <Trans>Total paid</Trans>
            </Select.Option>
            <Select.Option value="lastPaidTimestamp">
              <Trans>Last paid</Trans>
            </Select.Option>
          </Select>
        </div>
      </header>

      {isLoading ? (
        <Loading />
      ) : (
        <Grid>
          {wallets?.map(w => (
            <WalletCard key={w.id} wallet={w} />
          ))}
        </Grid>
      )}
    </div>
  )
}
