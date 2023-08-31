import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { ConnectKitButton } from 'connectkit'
import { useCartSummary } from '../hooks/useCartSummary'

export const SummaryPayButton = ({ className }: { className?: string }) => {
  const { payProject, walletConnected } = useCartSummary()

  return (
    <ConnectKitButton.Custom>
      {({ show }) => (
        <Button
          className={className}
          type="primary"
          onClick={walletConnected ? payProject : show}
        >
          <span>
            {walletConnected ? (
              <Trans>Pay project</Trans>
            ) : (
              <Trans>Connect wallet</Trans>
            )}
          </span>
        </Button>
      )}
    </ConnectKitButton.Custom>
  )
}
