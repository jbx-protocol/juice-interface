import { PropsWithChildren, useCallback } from 'react'
import { Trans, t } from '@lingui/macro'

import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { BigNumber } from 'ethers'
import { ProjectHeaderStat } from 'components/Project/ProjectHeader/ProjectHeaderStat'
import { TRENDING_WINDOW_DAYS } from 'components/Projects/RankingExplanation'
import USDAmount from 'components/currency/USDAmount'
import { twMerge } from 'tailwind-merge'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectPageQueries } from './hooks/useProjectPageQueries'
import { useV4V5ProjectHeader } from './hooks/useV4V5ProjectHeader'
import { USDC_ADDRESSES } from 'juice-sdk-core'
import { ETH_TOKEN_ADDRESS } from 'constants/juiceboxTokens'

// Build currency mapping from SDK constants
const CURRENCY_SYMBOLS: Record<string, string> = {
  [ETH_TOKEN_ADDRESS.toLowerCase()]: 'ETH',
  ...Object.values(USDC_ADDRESSES).reduce((acc, address) => {
    acc[address.toLowerCase()] = 'USDC'
    return acc
  }, {} as Record<string, string>),
}

/**
 * Get currency symbol from currency address (hex string)
 */
function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return 'ETH'
  // Normalize to lowercase for lookup
  const symbol = CURRENCY_SYMBOLS[currency.toLowerCase()]
  return symbol || 'ETH'
}

export function ProjectHeaderStats() {
  const { payments, totalVolume, last7DaysPercent, projectToken, projectDecimals } = useV4V5ProjectHeader()
  const { setProjectPageTab } = useProjectPageQueries()

  const openActivityTab = useCallback(
    () => setProjectPageTab('activity'),
    [setProjectPageTab],
  )

  const converter = useCurrencyConverter()
  const currencySymbol = getCurrencySymbol(projectToken)

  // Volume from Bendystraw is stored in the token's native decimals
  // For USDC (decimals=6): divide by 10^6, then treat as USD (1 USDC ≈ $1)
  // For ETH: volume is in wei (18 decimals), use currency converter
  let usdTotalAmount: BigNumber | undefined
  if (currencySymbol === 'USDC' && projectDecimals) {
    // Convert from token decimals (6) to WAD (18) for USDAmount display
    // volume is in token decimals, so we multiply by 10^(18 - decimals)
    const volumeBN = BigNumber.from(totalVolume ?? 0)
    const decimalDiff = 18 - projectDecimals
    usdTotalAmount = volumeBN.mul(BigNumber.from(10).pow(decimalDiff))
  } else {
    // For ETH, volume is already in wei (18 decimals)
    usdTotalAmount = converter.wadToCurrency(totalVolume, 'USD', 'ETH')
  }

  return (
    <div className="flex min-w-0 gap-12 md:shrink-0">
      <a role="button" onClick={openActivityTab}>
        <ProjectHeaderStat label={t`Payments`} stat={payments ?? 0} />
      </a>
      <ProjectHeaderStat
        label={t`Total raised`}
        stat={
          <USDAmount amount={usdTotalAmount ?? BigNumber.from(0)} precision={2} />
        }
      />
      {last7DaysPercent !== Infinity ? (
        <ProjectHeaderStat
          label={<Trans>last {TRENDING_WINDOW_DAYS} days</Trans>}
          stat={
            <StatBadge type={last7DaysPercent > 0 ? 'trending' : 'stagnant'}>
              {last7DaysPercent}%
            </StatBadge>
          }
          data-testid="project-header-trending-perc"
        />
      ) : null}
    </div>
  )
}

type StatBadgeProps = {
  type: 'trending' | 'stagnant'
}

const StatBadge: React.FC<PropsWithChildren<StatBadgeProps>> = ({
  type,
  children,
}) => {
  return (
    <div
      className={twMerge(
        'ml-auto flex w-fit items-center gap-0.5 rounded-2xl border py-1.5 pl-2.5 pr-3 text-base font-medium leading-none',
        type === 'trending'
          ? 'border-melon-100 bg-melon-50 text-melon-700 dark:border-melon-800 dark:bg-melon-950 dark:text-melon-400'
          : 'border-split-100 bg-split-50 text-split-800 dark:border-split-800 dark:bg-split-950 dark:text-split-400',
      )}
    >
      <ArrowTrendingUpIcon className="h-4 w-4 stroke-2" />
      {children}
    </div>
  )
}
