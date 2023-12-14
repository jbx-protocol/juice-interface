import { ChartBarSquareIcon, ChartPieIcon } from '@heroicons/react/24/outline'
import Loading from 'components/Loading'
import { BigNumber } from 'ethers'
import { ParticipantsQuery } from 'generated/graphql'
import { useState } from 'react'
import TokenAreaChart from './TokenAreaChart'
import TokenPieChart from './TokenPieChart'

export default function TokenDistributionChart({
  participants,
  isLoading,
  tokenSupply,
}: {
  participants: ParticipantsQuery['participants'] | undefined
  isLoading?: boolean
  tokenSupply: BigNumber | undefined
}) {
  const [viewMode, setViewMode] = useState<'pie' | 'area'>('pie')

  // Don't render chart for projects with no token supply
  if (tokenSupply?.eq(0) || !participants?.length) return null

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
          participants={participants}
          tokenSupply={tokenSupply}
          size={size}
        />
      )
      break
    case 'area':
      content = (
        <TokenAreaChart participants={participants} tokenSupply={tokenSupply} />
      )
      break
  }

  return (
    <div className="w-full">
      <div style={{ height: size, width: '100%' }}>{content}</div>

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
