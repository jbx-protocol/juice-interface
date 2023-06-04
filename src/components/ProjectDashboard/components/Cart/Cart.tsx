import { ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { CSSProperties, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { CurrencyIcon } from '../ui/CurrencyIcon'
import StackedComponents from '../ui/StackedComponents'
import { PaymentCartItem } from './components/CartItem/PaymentCartItem'
import { ProjectTokensCartItem } from './components/CartItem/ProjectTokensCartItem'

export const Cart = ({ className }: { className?: string }) => {
  const cart = useProjectCart()
  const toggleExpanded = () => cart.dispatch({ type: 'toggleExpanded' })

  return (
    <div
      data-testid="cart"
      className={twMerge(
        'fixed inset-x-0 bottom-0 z-20 h-full cursor-pointer items-center justify-center border-t border-grey-200 bg-white drop-shadow transition-all dark:border-slate-500 dark:bg-slate-900',
        cart.expanded ? 'max-h-[435px]' : 'max-h-20',
        cart.visible ? 'flex' : 'hidden',
        className,
      )}
      onClick={toggleExpanded}
    >
      <div className="flex h-full w-full max-w-6xl items-center">
        {cart.expanded ? <SummaryOpenView /> : <SummaryClosedView />}
        <ChevronUpIcon
          role="button"
          className={twMerge(
            'h-8 w-8',
            cart.expanded && 'mt-12 rotate-180 self-start',
          )}
        />
      </div>
    </div>
  )
}

const SummaryOpenView = () => {
  const cart = useProjectCart()
  const amountText = cart.payAmount
    ? formatCurrencyAmount(cart.payAmount)
    : undefined

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

const SummaryClosedView = () => {
  const cart = useProjectCart()
  const amountText = cart.payAmount
    ? formatCurrencyAmount(cart.payAmount)
    : undefined

  const removePay = useCallback(() => {
    cart.dispatch({ type: 'removePayment' })
  }, [cart])

  return (
    <div className="flex w-full items-center justify-between px-8 py-6">
      <div
        data-testid="cart-summary-closed-view-summary"
        className="flex cursor-auto items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        <span className="font-heading text-2xl font-medium">
          <Trans>Summary</Trans>
        </span>
        <StackedComponents
          components={[
            {
              Component: PlaceholderSquare,
              props: { className: 'bg-bluebs-400' },
            },
            {
              Component: PlaceholderSquare,
              props: { className: 'bg-juice-400' },
            },
            {
              Component: CurrencyIcon,
              props: {
                className:
                  'h-full w-full border-4 border-white dark:border-slate-950',
                currency: cart.payAmount?.currency ?? V2V3_CURRENCY_ETH,
              },
            },
          ]}
          size="48px"
        />
      </div>
      <div
        data-testid="cart-summary-closed-view-total"
        className="flex cursor-auto items-center gap-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-grey-500 dark:text-slate-200">
            <Trans>Total to pay</Trans>
          </span>
          <span className="text-2xl font-medium">{amountText}</span>
          <TrashIcon
            role="button"
            className="h-5 w-5 text-grey-400 dark:text-slate-300"
            onClick={removePay}
          />
        </div>
        <Button type="primary">
          <Trans>Pay project</Trans>
        </Button>
      </div>
    </div>
  )
}

const PlaceholderSquare = ({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) => {
  return (
    <div
      style={style}
      className={twMerge(
        'h-full w-full rounded-lg border-4 border-white bg-grey-400 dark:border-slate-950',
        className,
      )}
    ></div>
  )
}
