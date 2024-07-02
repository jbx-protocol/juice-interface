import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Collapse, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { BallotState } from 'packages/v2v3/models/fundingCycle'
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
  fundingCycleNumber: bigint
  fundingCycleStartTime: bigint
  fundingCycleDurationSeconds: bigint
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

    if (!(fundingCycleDurationSeconds > 0n)) return null

    const endTimeSeconds = fundingCycleStartTime + fundingCycleDurationSeconds
    const formattedTimeLeft = detailedTimeUntil(endTimeSeconds)
    const fundingCycleDurationMilliseconds = Number(endTimeSeconds * 1000n)

    return (
      <Tooltip title={`${formatDateToUTC(fundingCycleDurationMilliseconds)}`}>
        <span className="ml-2 text-grey-500 dark:text-grey-300">
          {isFundingCycleRecurring ? (
            <Trans>
              {formattedTimeLeft} until #{(fundingCycleNumber + 1n).toString()}
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
              {fundingCycleDurationSeconds > 0n ||
              (fundingCycleDurationSeconds === 0n &&
                fundingCycleNumber > 0n) ? (
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
