import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'

export const RecommendedBadge = () => {
  return (
    <Badge variant="info" upperCase>
      <Trans>Recommended</Trans>
    </Badge>
  )
}
