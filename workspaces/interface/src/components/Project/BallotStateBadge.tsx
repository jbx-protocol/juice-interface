import { ClockCircleOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { BallotState } from 'models/v2/fundingCycle'

import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
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
    0: t`This proposed reconfiguration hasn't passed the ${
      ballotStrategy?.durationSeconds && ballotStrategy?.name
        ? ballotStrategy.name
        : 'delay'
    } period. It's not guaranteed to take effect in the upcoming funding cycle.`,
  }

  const ballotStateIcons: { [k in BallotState]?: JSX.Element } = {
    0: <ClockCircleOutlined />,
  }

  const variant = ballotStateVariantMap[ballotState]

  if (!variant) return null

  return (
    <Badge
      variant={variant}
      style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}
    >
      <Tooltip title={ballotStateTooltips[ballotState]}>
        {ballotStateIcons[ballotState]} {ballotStateLabelMap[ballotState]}
      </Tooltip>
    </Badge>
  )
}
