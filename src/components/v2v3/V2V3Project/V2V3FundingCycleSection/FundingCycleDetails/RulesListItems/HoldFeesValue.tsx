import { Trans } from '@lingui/macro'

export function HoldFeesValue({ holdFees }: { holdFees: boolean }) {
  return holdFees ? <Trans>Enabled</Trans> : <Trans>Disabled</Trans>
}
