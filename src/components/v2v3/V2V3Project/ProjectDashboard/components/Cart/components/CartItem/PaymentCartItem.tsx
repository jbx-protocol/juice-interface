import { CurrencyIcon } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ui/CurrencyIcon'
import { useProjectCart } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectCart'
import { handleConfirmationDeletion } from 'components/v2v3/V2V3Project/ProjectDashboard/utils/modals'
import { useCallback } from 'react'
import { CartItem } from './CartItem'

export const PaymentCartItem = () => {
  const { payAmount, dispatch } = useProjectCart()

  const removePayment = useCallback(() => {
    dispatch({ type: 'removePayment' })
  }, [dispatch])

  if (!payAmount || payAmount.amount === 0) {
    return null
  }

  return (
    <CartItem
      title={
        <span className="flex items-center gap-2">
          <span>Payment</span>
        </span>
      }
      icon={
        <CurrencyIcon
          innerIconClassName="h-8 w-8"
          className="h-14 w-14"
          currency={payAmount.currency}
        />
      }
      price={payAmount}
      onRemove={handleConfirmationDeletion({
        type: 'payment',
        onConfirm: removePayment,
      })}
    />
  )
}
