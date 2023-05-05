import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Collapse, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { BigNumber } from 'ethers'
import { BallotState } from 'models/v2v3/fundingCycle'
import { formatDateToUTC } from 'utils/format/formatDate'
import { detailedTimeUntil } from 'utils/format/formatTime'
import { BallotStateBadge } from './BallotStateBadge'

const COLLAPSE_PANEL_KEY = 'funding-cycle-details'

export default function FundingCycleDetailsCard({
  fundingCycleNumber,
  fundingCycleStartTime,
  fundingCycleDurationSeconds,
  fundingCycleRiskCount,
  isFundingCycleRecurring,
  fundingCycleDetails,
  ballotState,
  ballotStrategyAddress,
}: {
  fundingCycleNumber: BigNumber
  fundingCycleStartTime: BigNumber
  fundingCycleDurationSeconds: BigNumber
  fundingCycleRiskCount: number
  fundingCycleDetails: JSX.Element
  isFundingCycleRecurring: boolean
  ballotState?: BallotState
  ballotStrategyAddress?: string
}) {
  const HeaderText = () => {
    if (ballotState !== undefined) {
      return (
        <BallotStateBadge
          ballotState={ballotState}
          ballotStrategyAddress={ballotStrategyAddress}
        />
      )
    }

    if (!fundingCycleDurationSeconds.gt(0)) return null

    const endTimeSeconds = fundingCycleStartTime.add(
      fundingCycleDurationSeconds,
    )
    const formattedTimeLeft = detailedTimeUntil(endTimeSeconds)
    const fundingCycleDurationMilliseconds = endTimeSeconds.mul(1000).toNumber()

    return (
      <Tooltip title={`${formatDateToUTC(fundingCycleDurationMilliseconds)}`}>
        <span className="ml-2 text-grey-500 dark:text-grey-300">
          {isFundingCycleRecurring ? (
            <Trans>
              {formattedTimeLeft} until #{fundingCycleNumber.add(1).toString()}
            </Trans>
          ) : (
            <Trans>{formattedTimeLeft} left</Trans>
          )}
        </span>
      </Tooltip>
    )
  }

  return (
    <Collapse
      // minimal is needed for antd overrides
      className="minimal border-none bg-transparent"
    >
      <CollapsePanel
        key={COLLAPSE_PANEL_KEY}
        className="border-none"
        header={
          <div className="flex w-full cursor-pointer items-center justify-between">
            <div className="flex items-center gap-2">
              {fundingCycleDurationSeconds.gt(0) ||
              (fundingCycleDurationSeconds.eq(0) &&
                fundingCycleNumber.gt(0)) ? (
                <Trans>Cycle #{fundingCycleNumber.toString()}</Trans>
              ) : (
                <Trans>Details</Trans>
              )}

              {fundingCycleRiskCount > 0 && (
                <Tooltip
                  title={
                    <Trans>
                      This cycle's rules may lead to unexpected behavior or
                      other risks.
                    </Trans>
                  }
                >
                  <ExclamationCircleOutlined className="text-warning-600 dark:text-warning-300" />
                </Tooltip>
              )}
            </div>

            <HeaderText />
          </div>
        }
      >
        {fundingCycleDetails}
      </CollapsePanel>
    </Collapse>
  )
}
