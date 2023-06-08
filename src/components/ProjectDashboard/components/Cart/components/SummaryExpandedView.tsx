import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useCartSummary } from '../hooks/useCartSummary'
import { NftCartItem, PaymentCartItem } from './CartItem'
import { ProjectTokensCartItem } from './CartItem/ProjectTokensCartItem'

export const SummaryExpandedView = () => {
  const { amountText, nftRewards } = useCartSummary()

  return (
    <div
      data-testid="cart-summary-open-view"
      className="flex h-full w-full justify-between px-8 pt-12 pb-14"
    >
      <div
        data-testid="cart-summary-open-view-summary"
        className="flex w-full max-w-xl cursor-auto flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <span className="font-heading text-2xl font-medium">
          <Trans>Summary</Trans>
        </span>
        <div>
          <PaymentCartItem />
          {nftRewards.map(nft => (
            <NftCartItem key={nft.id} id={nft.id} quantity={nft.quantity} />
          ))}
          <ProjectTokensCartItem />
        </div>
      </div>
      <div
        data-testid="cart-summary-open-view-total"
        className="flex cursor-auto items-center gap-8 self-end rounded-lg border border-grey-200 p-8 dark:border-slate-500 dark:bg-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2 whitespace-nowrap">
          <span className="text-sm text-grey-500 dark:text-slate-200">
            <Trans>Total to pay</Trans>
          </span>
          <span className="text-2xl font-medium">{amountText}</span>
        </div>
        <Button role="button" type="primary">
          <Trans>Pay project</Trans>
        </Button>
      </div>
    </div>
  )
}
