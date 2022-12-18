import { Trans } from '@lingui/macro'

export function PausePayValue({ pausePay }: { pausePay: boolean }) {
  return pausePay ? <Trans>Paused</Trans> : <Trans>Enabled</Trans>
}
