import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'

export const OptionalBadge = () => {
  return (
    <Badge variant="default" upperCase className="text-xs">
      <Trans>Optional</Trans>
    </Badge>
  )
}
