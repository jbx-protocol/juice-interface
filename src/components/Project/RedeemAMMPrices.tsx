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
          <span className="cursor-default pt-2 pb-4 underline decoration-dashed">
            sell {tokenSymbol} on exchange.
          </span>
        </Tooltip>
      </Trans>
    </span>
  )
}
