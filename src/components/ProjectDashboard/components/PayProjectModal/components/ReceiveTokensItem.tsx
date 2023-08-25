import { Trans } from '@lingui/macro'
import { useProjectHasErc20Token } from 'components/ProjectDashboard/hooks/useProjectHasErc20Token'
import { useProjectPaymentTokens } from 'components/ProjectDashboard/hooks/useProjectPaymentTokens'
import { twMerge } from 'tailwind-merge'
import { CartItemBadge } from '../../Cart/components/CartItem/CartItemBadge'
import { ProjectHeaderLogo } from '../../ProjectHeader/components/ProjectHeaderLogo'

export const ReceiveTokensItem = ({ className }: { className?: string }) => {
  const { receivedTickets, receivedTokenSymbolText } = useProjectPaymentTokens()
  const projectHasErc20Token = useProjectHasErc20Token()

  const badgeTitle = projectHasErc20Token ? (
    'ERC-20'
  ) : (
    <Trans>Juicebox Native</Trans>
  )

  if (receivedTickets === '0') {
    return null
  }

  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <ProjectHeaderLogo className="h-12 w-12 rounded-full" />
          <span className="ml-3">
            <Trans>{receivedTokenSymbolText} Token</Trans>
          </span>
          <CartItemBadge className="ml-2">
            <Trans>{badgeTitle} Token</Trans>
          </CartItemBadge>
        </div>
        <div>{receivedTickets}</div>
      </div>
    </div>
  )
}
