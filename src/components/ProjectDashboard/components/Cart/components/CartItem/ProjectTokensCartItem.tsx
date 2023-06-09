import { ProjectHeaderLogo } from 'components/ProjectDashboard/components/ProjectHeader/components/ProjectHeaderLogo'
import {
  useProjectCart,
  useTokensPerEth,
} from 'components/ProjectDashboard/hooks'
import { useCallback } from 'react'
import { CartItem } from './CartItem'
import { CartItemBadge } from './CartItemBadge'

export const ProjectTokensCartItem = () => {
  const { payAmount, userIsReceivingTokens, dispatch } = useProjectCart()
  const { receivedTickets } = useTokensPerEth(payAmount)

  const removeTokens = useCallback(
    () => dispatch({ type: 'removeTokens' }),
    [dispatch],
  )

  if (!userIsReceivingTokens) {
    return null
  }

  return (
    <CartItem
      title={
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span>Project tokens</span>
            <CartItemBadge>Token</CartItemBadge>
          </span>
          <span>{receivedTickets}</span>
        </div>
      }
      icon={<ProjectHeaderLogo className="h-14 w-14 rounded-full" />}
      price={null}
      onRemove={removeTokens}
    />
  )
}
