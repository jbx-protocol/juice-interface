import { t } from '@lingui/macro'
import { ProjectHeaderLogo } from 'components/ProjectDashboard/components/ProjectHeader/components/ProjectHeaderLogo'
import { useProjectPaymentTokens } from 'components/ProjectDashboard/hooks/useProjectPaymentTokens'
import { handleConfirmationDeletion } from 'components/ProjectDashboard/utils/modals'
import { CartItem } from './CartItem'
import { CartItemBadge } from './CartItemBadge'

export const ProjectTokensCartItem = () => {
  const { receivedTickets, userIsReceivingTokens, removeTokens } =
    useProjectPaymentTokens()

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
      onRemove={handleConfirmationDeletion({
        type: t`tokens`,
        description: (
          <>
            <p>
              You will not receive any tokens for your payment and will not be
              able to redeem any treasury ETH.
            </p>
            <p>You will also not be able to mint any NFTs.</p>
          </>
        ),
        onConfirm: removeTokens,
      })}
    />
  )
}
