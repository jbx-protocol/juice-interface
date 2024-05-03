import { Trans, t } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { useProjectHasErc20Token } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectHasErc20Token'
import { useProjectPaymentTokens } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectPaymentTokens'
import { BUYBACK_DELEGATE_ENABLED_PROJECT_IDS } from 'constants/buybackDelegateEnabledProjectIds'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { CartItemBadge } from '../../CartItemBadge'
import { ProjectHeaderLogo } from '../../ProjectHeader/components/ProjectHeaderLogo'

export const ReceiveTokensItem = ({ className }: { className?: string }) => {
  const { projectId } = useContext(ProjectMetadataContext)
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

  const buybackDelegateEnabled =
    projectId && BUYBACK_DELEGATE_ENABLED_PROJECT_IDS.includes(projectId)

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
        {buybackDelegateEnabled ? (
          <div>
            ≥ {receivedTickets}{' '}
            <TooltipIcon
              tip={t`Your payment may purchase tokens from a secondary market instead of minting new tokens. You might receive more tokens depending on the swap price.`}
            />
          </div>
        ) : (
          <div>{receivedTickets}</div>
        )}
      </div>
    </div>
  )
}
