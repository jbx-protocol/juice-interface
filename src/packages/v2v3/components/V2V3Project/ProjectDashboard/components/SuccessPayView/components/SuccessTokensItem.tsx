import { Trans } from '@lingui/macro'
import { ProjectHeaderLogo } from 'components/Project/ProjectHeader/ProjectHeaderLogo'
import { useProjectPageQueries } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries'
import { CartItemBadge } from '../../CartItemBadge'

export const SuccessTokensItem = () => {
  const { projectPayReceipt } = useProjectPageQueries()

  if (
    !projectPayReceipt ||
    !projectPayReceipt.tokensReceived.length ||
    projectPayReceipt.tokensReceived === '0'
  )
    return null

  return (
    <div className="flex items-center py-5">
      <ProjectHeaderLogo className="h-14 w-14 rounded-full" />
      <div className="ml-3">
        <div>
          <span className="text-sm font-medium">
            <Trans>Project tokens</Trans>
          </span>
          <CartItemBadge className="ml-2">Token</CartItemBadge>
        </div>
        <span className="text-sm text-grey-500 dark:text-slate-200">
          {projectPayReceipt.tokensReceived}
        </span>
      </div>
    </div>
  )
}
