import { ProjectHeaderLogo } from 'components/ProjectDashboard/components/ProjectHeader/components/ProjectHeaderLogo'
import { useProjectTokensCartItem } from '../../hooks/useProjectTokensCartItem'
import { CartItem } from './CartItem'
import { CartItemBadge } from './CartItemBadge'

export const ProjectTokensCartItem = () => {
  const { receivedTickets, userIsReceivingTokens, removeTokens } =
    useProjectTokensCartItem()

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
