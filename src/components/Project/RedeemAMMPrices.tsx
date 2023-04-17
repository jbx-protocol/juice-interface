import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import Loading from 'components/Loading'
import { Suspense, lazy } from 'react'
const AMMPrices = lazy(() => import('components/AMMPrices'))

export const RedeemAMMPrices = ({
  className,
  tokenSymbol,
  tokenAddress,
}: {
  className?: string
  tokenSymbol: string
  tokenAddress: string
}) => {
  return (
    <span className={className}>
      <Trans>
        or{' '}
        <Tooltip
          overlayClassName="min-w-xs"
          title={
            <Suspense fallback={<Loading />}>
              <AMMPrices
                mode="redeem"
                tokenSymbol={tokenSymbol}
                tokenAddress={tokenAddress}
              />
            </Suspense>
          }
          placement="bottomLeft"
        >
          <span className="cursor-default border-0 border-b border-dashed border-b-grey-300 pt-2 dark:border-b-slate-200">
            sell {tokenSymbol} on exchange.
          </span>
        </Tooltip>
      </Trans>
    </span>
  )
}
