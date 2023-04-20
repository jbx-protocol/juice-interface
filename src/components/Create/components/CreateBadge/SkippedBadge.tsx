import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'

export const SkippedBadge = () => {
  return (
    <Badge variant="default" upperCase className="text-xs">
      <Trans>Skipped</Trans>
    </Badge>
  )
}
