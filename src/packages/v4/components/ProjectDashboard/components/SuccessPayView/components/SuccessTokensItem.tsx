import { Trans, t } from '@lingui/macro'

import { CartItemBadge } from 'components/CartItemBadge'
import { ProjectHeaderLogo } from 'components/Project/ProjectHeader/ProjectHeaderLogo'
import { useProjectPageQueries } from 'packages/v4/views/V4ProjectDashboard/hooks/useProjectPageQueries'
import { useV4TokensPanel } from 'packages/v4/views/V4ProjectDashboard/V4ProjectTabs/V4TokensPanel/hooks/useV4TokensPanel'

export const SuccessTokensItem = () => {
  const { projectPayReceipt } = useProjectPageQueries()

  const {
      projectToken,
      projectHasErc20Token,
    } = useV4TokensPanel()

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
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm text-grey-500 dark:text-slate-200">
              {projectPayReceipt.tokensReceived}
            </span>
            <CartItemBadge className="w-fit">{projectHasErc20Token ? projectToken : t`Token`}</CartItemBadge>
          </div>
        </div>
      </div>
    </div>
  )
}
