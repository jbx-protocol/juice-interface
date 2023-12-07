import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { usePayProjectDisabled } from 'hooks/v2v3/usePayProjectDisabled'
import { useCartSummary } from '../hooks/useCartSummary'

export const SummaryPayButton = ({ className }: { className?: string }) => {
  const { payProject, walletConnected } = useCartSummary()
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
          {walletConnected ? (
            <Trans>Pay project</Trans>
          ) : (
            <Trans>Connect wallet to pay</Trans>
          )}
        </span>
      </Button>
    </Tooltip>
  )
}
