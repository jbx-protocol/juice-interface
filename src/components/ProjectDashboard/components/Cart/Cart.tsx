import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { twMerge } from 'tailwind-merge'
import { PayProjectModal } from '../PayProjectModal'
import { SummaryCollapsedView, SummaryExpandedView } from './components'

export const Cart = ({ className }: { className?: string }) => {
  const cart = useProjectCart()
  const toggleExpanded = () => cart.dispatch({ type: 'toggleExpanded' })

  return (
    <>
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
          {cart.expanded ? <SummaryExpandedView /> : <SummaryCollapsedView />}
          <ChevronUpIcon
            role="button"
            className={twMerge(
              'h-8 w-8',
              cart.expanded && 'mt-12 rotate-180 self-start',
            )}
          />
        </div>
      </div>
      <PayProjectModal />
    </>
  )
}
