import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ProjectHeaderLogo } from 'components/ProjectDashboard/components/ProjectHeader/components/ProjectHeaderLogo'
import { useProjectPaymentTokens } from 'components/ProjectDashboard/hooks/useProjectPaymentTokens'
import { CartItem } from './CartItem'
import { CartItemBadge } from './CartItemBadge'

export const ProjectTokensCartItem = () => {
  const { receivedTickets } = useProjectPaymentTokens()

  return (
    <CartItem
      title={
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span>Project tokens</span>
            <Tooltip
              title={t`Payments to Juicebox projects automatically mint tokens`}
            >
              <InformationCircleIcon className="h-4 w-4 text-grey-400 dark:text-slate-200" />
            </Tooltip>
            <CartItemBadge>Token</CartItemBadge>
          </span>
          <span>{receivedTickets}</span>
        </div>
      }
      icon={<ProjectHeaderLogo className="h-14 w-14 rounded-full" />}
      price={null}
    />
  )
}
