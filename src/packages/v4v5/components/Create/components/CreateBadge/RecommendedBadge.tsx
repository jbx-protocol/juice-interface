import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import { ReactNode } from 'react'

export const RecommendedBadge = ({ tooltip }: { tooltip?: ReactNode }) => {
  return (
    <Tooltip title={tooltip}>
      <Badge variant="info" upperCase className="text-xs">
        <Trans>Recommended</Trans>
      </Badge>
    </Tooltip>
  )
}
