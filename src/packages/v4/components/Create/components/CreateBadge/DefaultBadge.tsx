import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'

export const DefaultBadge = () => {
  return (
    <Badge variant="info" upperCase className="text-xs">
      <Trans>Default</Trans>
    </Badge>
  )
}
