import { ClockCircleOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { BallotState } from 'packages/v2v3/models/fundingCycle'

import { getBallotStrategyByAddress } from 'packages/v2v3/utils/ballotStrategies'
import { Badge, BadgeVariant } from '../Badge'

export function BallotStateBadge({
  ballotState,
  ballotStrategyAddress,
}: {
  ballotState: BallotState
  ballotStrategyAddress?: string
}) {
  const ballotStrategy = ballotStrategyAddress
    ? getBallotStrategyByAddress(ballotStrategyAddress)
    : undefined

  // only show badge for ballot states 0 and 2 (don't show if ballot is 'approved'.)
  const ballotStateVariantMap: { [k in BallotState]?: BadgeVariant } = {
    0: 'warning',
  }

  const ballotStateLabelMap: { [k in BallotState]?: string } = {
    0: 'Pending',
  }

  const ballotStateTooltips: { [k in BallotState]?: string } = {
    0: t`These edits were not approved by the ${
      ballotStrategy?.durationSeconds && ballotStrategy?.name
        ? ballotStrategy.name
        : 'edit deadline'
    } contract. The edits are not guaranteed to take effect in the next cycle.`,
  }

  const ballotStateIcons: { [k in BallotState]?: JSX.Element } = {
    0: <ClockCircleOutlined />,
  }

  const variant = ballotStateVariantMap[ballotState]

  if (!variant) return null

  return (
    <Badge variant={variant} className="ml-2 capitalize">
      <Tooltip title={ballotStateTooltips[ballotState]} className="truncate">
        {ballotStateIcons[ballotState]} {ballotStateLabelMap[ballotState]}
      </Tooltip>
    </Badge>
  )
}
