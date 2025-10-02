import { Trans } from '@lingui/macro'
import { CartItemBadge } from 'components/CartItemBadge'
import { ProjectHeaderLogo } from 'components/Project/ProjectHeader/ProjectHeaderLogo'
import { twMerge } from 'tailwind-merge'
// import { BUYBACK_DELEGATE_ENABLED_PROJECT_IDS } from 'packages/v2v3/constants/buybackDelegateEnabledProjectIds'
import { useProjectHasErc20Token } from 'packages/v4v5/hooks/useProjectHasErc20Token'
import { useProjectPaymentTokens } from '../hooks/useProjectPaymentTokens'

export const ReceiveTokensItem = ({ className }: { className?: string }) => {
  const { receivedTickets, receivedTokenSymbolText } = useProjectPaymentTokens()
  const projectHasErc20Token = useProjectHasErc20Token()

  if (!receivedTickets || receivedTickets === '0') {
    return null
  }

  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <ProjectHeaderLogo className="h-12 w-12 rounded-full" />
          <span className="ml-3">
            <Trans>{receivedTokenSymbolText}</Trans>
          </span>
          {projectHasErc20Token ? (
            <CartItemBadge className="ml-2">
              <Trans>ERC-20</Trans>
            </CartItemBadge>
          ) : null}
        </div>
        <div>{receivedTickets}</div>
      </div>
    </div>
  )
}
