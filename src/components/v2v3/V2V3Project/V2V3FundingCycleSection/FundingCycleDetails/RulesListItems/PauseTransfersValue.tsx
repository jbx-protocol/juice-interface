import { Trans } from '@lingui/macro'

export function PauseTransfersValue({
  pauseTransfers,
}: {
  pauseTransfers: boolean
}) {
  return pauseTransfers ? <Trans>Allowed</Trans> : <Trans>Disabled</Trans>
}
