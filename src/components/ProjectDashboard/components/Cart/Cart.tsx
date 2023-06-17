import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { useCallback, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { PayProjectModal } from '../PayProjectModal'
import { SummaryCollapsedView, SummaryExpandedView } from './components'

export const Cart = ({ className }: { className?: string }) => {
  const cart = useProjectCart()
  const cartRef = useRef<HTMLDivElement>(null)

  const toggleExpanded = useCallback(
    () => cart.dispatch({ type: 'toggleExpanded' }),
    [cart],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        event.target &&
        !cartRef.current.contains(event.target as Node)
      ) {
        if (cart.expanded) {
          toggleExpanded()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [cart, toggleExpanded])

  return (
    <>
      <div
        data-testid="cart"
        className={twMerge(
          'fixed inset-x-0 bottom-0 z-20 h-full cursor-pointer items-center justify-center border-t border-grey-200 bg-white drop-shadow transition-all dark:border-slate-500 dark:bg-slate-900',
          cart.expanded ? 'max-h-[90vh] md:max-h-[435px]' : 'max-h-20',
          cart.visible ? 'flex' : 'hidden',
          className,
        )}
        ref={cartRef}
        onClick={toggleExpanded}
      >
        <div className="flex h-full w-full max-w-6xl items-center">
          {cart.expanded ? <SummaryExpandedView /> : <SummaryCollapsedView />}
          {!cart.expanded && (
            <ChevronUpIcon
              role="button"
              className={twMerge(
                'mr-4 h-8 w-8 flex-shrink-0',
                cart.expanded && 'mt-12 rotate-180 self-start',
              )}
            />
          )}
        </div>

        {cart.expanded && (
          <ChevronUpIcon
            role="button"
            className={twMerge(
              'absolute right-8 h-8 w-8 flex-shrink-0',
              cart.expanded && 'top-6 rotate-180 md:top-12',
            )}
          />
        )}
      </div>
      <PayProjectModal />
    </>
  )
}
