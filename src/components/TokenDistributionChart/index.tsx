import { ChartBarSquareIcon, ChartPieIcon } from '@heroicons/react/24/outline'
import Loading from 'components/Loading'
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
import { PV } from 'models/pv'
import { useState } from 'react'
import { useQuery } from 'react-query'
import TokenAreaChart from './TokenAreaChart'
import TokenPieChart from './TokenPieChart'

export default function TokenDistributionChart({
  projectId,
  pv,
  tokenSupply,
}: {
  projectId: number | undefined
  pv: PV | undefined
  tokenSupply: BigNumber | undefined
}) {
  const [viewMode, setViewMode] = useState<'pie' | 'area'>('pie')

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

  let content
  switch (viewMode) {
    case 'pie':
      content = (
        <TokenPieChart
          participants={allParticipants}
          tokenSupply={tokenSupply}
          size={size}
        />
      )
      break
    case 'area':
      content = (
        <TokenAreaChart
          participants={allParticipants}
          tokenSupply={tokenSupply}
          height={size}
        />
      )
      break
  }

  return (
    <div className="w-full">
      <div
        style={{ height: size, width: '100%' }}
        className="flex items-center justify-center"
      >
        {content}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <div
          onClick={() => setViewMode('pie')}
          className={viewMode === 'pie' ? 'opacity-100' : 'opacity-50'}
        >
          <ChartPieIcon className="h-5 w-5" />
        </div>
        <div
          onClick={() => setViewMode('area')}
          className={viewMode === 'area' ? 'opacity-100' : 'opacity-50'}
        >
          <ChartBarSquareIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
