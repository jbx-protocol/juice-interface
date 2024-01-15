import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { usePayProjectDisabled } from 'hooks/v2v3/usePayProjectDisabled'
import { useCartSummary } from '../hooks/useCartSummary'

export const SummaryPayButton = ({ className }: { className?: string }) => {
  const { payProject } = useCartSummary()
  const {
    payDisabled,
    message,
    loading: payDisabledLoading,
  } = usePayProjectDisabled()

  return (
    <Tooltip open={payDisabled ? undefined : false} title={message}>
      <Button
        disabled={payDisabled}
        loading={payDisabledLoading}
        className={className}
        type="primary"
        onClick={payProject}
      >
        <span>
          <Trans>Pay project</Trans>
        </span>
      </Button>
    </Tooltip>
  )
}
