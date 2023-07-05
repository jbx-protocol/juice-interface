import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useCartSummary } from '../hooks/useCartSummary'

export const SummaryPayButton = ({ className }: { className?: string }) => {
  const { payProject, walletConnected } = useCartSummary()
  return (
    <Button className={className} type="primary" onClick={payProject}>
      <span>
        {walletConnected ? (
          <Trans>Pay project</Trans>
        ) : (
          <Trans>Connect wallet</Trans>
        )}
      </span>
    </Button>
  )
}
