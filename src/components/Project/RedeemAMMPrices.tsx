import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import AMMPrices from 'components/AMMPrices'

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
          overlayClassName="min-w-[300px]"
          title={
            <AMMPrices
              mode="redeem"
              tokenSymbol={tokenSymbol}
              tokenAddress={tokenAddress}
            />
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
