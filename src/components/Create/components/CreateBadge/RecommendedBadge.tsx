import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import { ReactNode } from 'react'

export const RecommendedBadge = ({ tooltip }: { tooltip?: ReactNode }) => {
  return (
    <Tooltip title={tooltip}>
      {/* Span wrapper for tooltip */}
      <span>
        <Badge variant="info" upperCase>
          <Trans>Recommended</Trans>
        </Badge>
      </span>
    </Tooltip>
  )
}
