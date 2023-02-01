import { Trans } from '@lingui/macro'

export function AllowSetControllerValue({
  allowSetController,
}: {
  allowSetController: boolean | undefined
}) {
  return allowSetController ? <Trans>Allowed</Trans> : <Trans>Disabled</Trans>
}
