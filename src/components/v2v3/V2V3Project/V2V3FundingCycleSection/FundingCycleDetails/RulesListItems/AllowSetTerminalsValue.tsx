import { Trans } from '@lingui/macro'

export function AllowSetTerminalsValue({
  allowSetTerminals,
}: {
  allowSetTerminals: boolean
}) {
  return allowSetTerminals ? <Trans>Allowed</Trans> : <Trans>Disabled</Trans>
}
