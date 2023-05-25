import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { usePayProjectCard } from 'components/ProjectDashboard/hooks'
import { twMerge } from 'tailwind-merge'
import { formatAmount } from 'utils/format/formatAmount'
import { DisplayCard } from '../ui'
import { PayInput } from './components/PayInput'

export const PayProjectCard = ({ className }: { className?: string }) => {
  const { tokensPerCurrentPay } = usePayProjectCard()
  return (
    <DisplayCard className={twMerge('flex flex-col gap-2 pr-9', className)}>
      <div className="font-medium">
        <Trans>Pay Project</Trans>
      </div>
      {/* // TODO: Formik */}
      <div className="flex gap-2">
        <PayInput className="flex-1" />
        <Button className="h-full" type="primary">
          <Trans>Add payment</Trans>
        </Button>
      </div>
      <div className="text-xs text-smoke-500">
        <Trans>Receive {formatAmount(tokensPerCurrentPay)} tokens/1 ETH</Trans>
      </div>
    </DisplayCard>
  )
}
