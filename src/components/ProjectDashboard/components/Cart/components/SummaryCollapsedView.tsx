import { TrashIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { handleConfirmationDeletion } from 'components/ProjectDashboard/utils/modals'
import useMobile from 'hooks/useMobile'
import { useMemo } from 'react'
import useResizeObserver from 'use-resize-observer'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { SmallNftSquare } from '../../NftRewardsCard/SmallNftSquare'
import { CurrencyIcon } from '../../ui/CurrencyIcon'
import StackedComponents, {
  StackComponentItem,
} from '../../ui/StackedComponents'
import { useCartSummary } from '../hooks/useCartSummary'
import { SummaryPayButton } from './SummaryPayButton'

const STACK_COMPONENT_SIZE = '48px'
const STACK_COMPONENT_OFFSET = '20px'
const SUMMARY_GAP = '16px'

export const SummaryCollapsedView = () => {
  const {
    amountText,
    currency,
    nftRewards,
    showCurrencyOnCollapse,
    resetCart,
  } = useCartSummary()
  const isMobile = useMobile()
  const { ref: containerRef, width: containerWidth = 1 } = useResizeObserver()
  const { ref: totalToPayRef, width: totalToPayWidth = 1 } = useResizeObserver()
  const { ref: internalSummaryRef, width: internalSummaryWidth = 1 } =
    useResizeObserver()

  const maxItems = useMemo(() => {
    const stackComponentSize = parseInt(STACK_COMPONENT_SIZE, 10)
    const stackComponentOffset = parseInt(STACK_COMPONENT_OFFSET, 10)
    const summaryGap = parseInt(SUMMARY_GAP, 10)
    const workableWidth =
      containerWidth -
      internalSummaryWidth -
      totalToPayWidth -
      summaryGap -
      (32 + 16) * 2 // Chevron padding

    return Math.max(
      Math.floor(workableWidth / (stackComponentSize - stackComponentOffset)),
      0,
    )
  }, [containerWidth, internalSummaryWidth, totalToPayWidth])

  const CurrencyIconComponent = useMemo(() => {
    if (!showCurrencyOnCollapse) return null
    return {
      Component: CurrencyIcon,
      props: {
        className: 'h-full w-full border-4 border-white dark:border-slate-950',
        currency: currency ?? V2V3_CURRENCY_ETH,
      },
    }
  }, [currency, showCurrencyOnCollapse])

  const NftComponents = useMemo(
    () =>
      nftRewards.map(nft => ({
        Component: SmallNftSquare,
        props: {
          border: true,
          nftReward: nft,
          className: 'h-full w-full',
        },
      })),
    [nftRewards],
  )

  const StackComponents: StackComponentItem[] = useMemo(
    () =>
      (
        [CurrencyIconComponent, ...NftComponents].filter(
          Boolean,
        ) as StackComponentItem[]
      ).slice(0, maxItems),
    [CurrencyIconComponent, NftComponents, maxItems],
  )

  const omittedItemCount = useMemo(() => {
    const potentialCount = nftRewards.length + (showCurrencyOnCollapse ? 1 : 0)
    return Math.max(potentialCount - maxItems, 0)
  }, [maxItems, nftRewards.length, showCurrencyOnCollapse])

  return (
    <div
      className="flex w-full items-center justify-between px-8 py-6"
      ref={containerRef}
    >
      <div
        data-testid="cart-summary-closed-view-summary"
        className="flex min-w-0 items-center gap-4"
      >
        <span
          className="font-heading text-xl font-medium md:text-2xl"
          ref={internalSummaryRef}
        >
          <Trans>Summary</Trans>
        </span>
        <StackedComponents
          components={StackComponents}
          size={STACK_COMPONENT_SIZE}
          offset={STACK_COMPONENT_OFFSET}
        />
        {omittedItemCount > 0 && (
          <span className="flex h-fit items-center justify-center gap-1 rounded-2xl bg-grey-100 py-0.5 pl-1.5 pr-2 text-xs font-medium text-grey-700 dark:bg-slate-600 dark:text-slate-200">
            <PlusIcon className="h-3 w-3 text-grey-500 dark:text-grey-300" />
            {omittedItemCount}
          </span>
        )}
      </div>
      {isMobile ? (
        <span ref={totalToPayRef} className="text-xl font-medium">
          {amountText}
        </span>
      ) : (
        <div
          ref={totalToPayRef}
          data-testid="cart-summary-closed-view-total"
          className="flex cursor-auto items-center gap-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap text-sm text-grey-500 dark:text-slate-200">
              <Trans>Total to pay</Trans>
            </span>
            <span className="text-2xl font-medium">{amountText}</span>
            <TrashIcon
              data-testid="cart-summary-closed-view-trash-icon"
              role="button"
              className="h-5 w-5 text-grey-400 dark:text-slate-300"
              onClick={handleConfirmationDeletion({
                type: t`payment`,
                description: t`Removing the payment will remove all the items from the cart. Are you sure you want to remove the payment?`,
                onConfirm: resetCart,
              })}
            />
          </div>
          <SummaryPayButton />
        </div>
      )}
    </div>
  )
}
