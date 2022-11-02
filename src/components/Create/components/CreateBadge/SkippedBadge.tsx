import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'

export const SkippedBadge = () => {
  return (
    <Badge variant="tertiary" upperCase>
      <Trans>Skipped</Trans>
    </Badge>
  )
}
