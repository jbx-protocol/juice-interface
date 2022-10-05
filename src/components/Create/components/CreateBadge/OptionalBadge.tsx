import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'

export const OptionalBadge = () => {
  return (
    <Badge variant="tertiary" upperCase>
      <Trans>Optional</Trans>
    </Badge>
  )
}
