import { Trans, t } from '@lingui/macro'
import { handleConfirmationDeletion } from 'components/ProjectDashboard/utils/modals'
import useMobile from 'hooks/useMobile'
import { stopPropagation } from 'react-stop-propagation'
import { useCartSummary } from '../hooks/useCartSummary'
import { NftCartItem, PaymentCartItem } from './CartItem'
import { ProjectTokensCartItem } from './CartItem/ProjectTokensCartItem'
import { RewardEligibilityCallout } from './CartItem/RewardEligibilityCallout'
import { SummaryPayButton } from './SummaryPayButton'

export const SummaryExpandedView = () => {
  const { amountText, nftRewards, resetCart } = useCartSummary()
  const isMobile = useMobile()

  return (
    <div
      data-testid="cart-summary-open-view"
      className="flex h-full w-full min-w-0 flex-col justify-between gap-5"
    >
      <div className="relative px-8 pt-6 md:pt-12">
        <div className="flex justify-between gap-5">
          <span className="font-heading text-xl font-medium md:text-2xl">
            <Trans>Summary</Trans>
          </span>
        </div>
      </div>

      <div
        data-testid="cart-summary-open-view-summary"
        className="flex h-full min-h-0 cursor-auto flex-col justify-between gap-4 px-8 pb-14 md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex min-h-0 w-full min-w-0 flex-shrink flex-col gap-4 pb-5 md:max-w-xl md:pb-0">
          {!isMobile && (
            <div className="absolute -top-10 right-0">
              <a
                role="button"
                onClick={stopPropagation(
                  handleConfirmationDeletion({
                    type: t`payment`,
                    description: t`Removing the payment will remove all the items from the cart. Are you sure you want to remove the payment?`,
                    onConfirm: resetCart,
                  }),
                )}
              >
                <Trans>Clear all</Trans>
              </a>
            </div>
          )}
          <div className="flex w-full flex-shrink flex-col overflow-y-scroll md:block md:w-auto">
            <PaymentCartItem />
            {nftRewards.map(nft => (
              <NftCartItem key={nft.id} id={nft.id} quantity={nft.quantity} />
            ))}
            <ProjectTokensCartItem />
          </div>

          <RewardEligibilityCallout />
        </div>

        {isMobile ? (
          <div>
            <div className="flex items-center justify-between gap-5 rounded-lg border border-grey-200 py-3 px-5 dark:border-slate-500">
              <span className="text-sm text-grey-500 dark:text-slate-200">
                <Trans>Total to pay</Trans>
              </span>
              <span className="font-heading text-xl font-medium">
                {amountText}
              </span>
            </div>
            <SummaryPayButton className="mt-4 h-12 w-full" />
          </div>
        ) : (
          <div
            data-testid="cart-summary-open-view-total"
            className="flex cursor-auto items-center gap-8 self-end rounded-lg border border-grey-200 p-8 dark:border-slate-500 dark:bg-slate-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 whitespace-nowrap">
              <span className="text-sm text-grey-500 dark:text-slate-200">
                <Trans>Total to pay</Trans>
              </span>
              <span className="font-heading text-2xl font-medium">
                {amountText}
              </span>
            </div>
            <SummaryPayButton />
          </div>
        )}
      </div>
    </div>
  )
}
