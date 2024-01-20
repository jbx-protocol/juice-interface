import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import TooltipLabel from 'components/TooltipLabel'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import round from 'lodash/round'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'
import { usePayoutsTable } from './hooks/usePayoutsTable'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

const SMALL_FEE_PRECISION_BUFFER = 2

/* Bottom few rows of the payouts table which show total amounts and fees */
export function TotalRows() {
  const {
    distributionLimit,
    distributionLimitIsInfinite,
    totalFeeAmount,
    subTotal,
    roundingPrecision,
    payoutSplits,
    ownerRemainderValue,
    currencyOrPercentSymbol,
  } = usePayoutsTable()

  const formattedDistributionLimit =
    distributionLimit !== undefined && !distributionLimitIsInfinite
      ? round(distributionLimit, roundingPrecision)
      : t`Unlimited`

  const { projectOwnerAddress } = useProjectContext()

  const subTotalExceedsMax = distributionLimitIsInfinite && subTotal > 100

  // Make fee more precise when it is very small
  const feeRoundingPrecision =
    totalFeeAmount >= 1
      ? roundingPrecision
      : roundingPrecision + SMALL_FEE_PRECISION_BUFFER

  const wholePayoutToRemainingOwner =
    distributionLimit && distributionLimit > 0 && payoutSplits.length === 0
  const remainingOwnerLabel = wholePayoutToRemainingOwner ? (
    <EthereumAddress address={projectOwnerAddress} />
  ) : (
    <TooltipLabel
      tip={t`The unallocated portion of your total will go to the wallet that owns the project by default.`}
      label={<Trans>Remaining (to project owner)</Trans>}
    />
  )
  return (
    <>
      {wholePayoutToRemainingOwner ? null : (
        <Row>
          <Cell>Sub-total</Cell>
          <Cell className={subTotalExceedsMax ? 'text-error-500' : ''}>
            <Tooltip
              title={
                subTotalExceedsMax ? (
                  <Trans>Sub-total cannot exceed 100%</Trans>
                ) : undefined
              }
            >
              {currencyOrPercentSymbol} {round(subTotal, roundingPrecision)}
            </Tooltip>
          </Cell>
        </Row>
      )}
      {ownerRemainderValue > 0 ? (
        <Row>
          <Cell>{remainingOwnerLabel}</Cell>
          <Cell>
            {currencyOrPercentSymbol} {ownerRemainderValue}
          </Cell>
        </Row>
      ) : null}
      <Row>
        <Cell>Fees</Cell>
        <Cell>
          {currencyOrPercentSymbol}{' '}
          {round(totalFeeAmount, feeRoundingPrecision)}
        </Cell>
      </Row>
      <Row className="rounded-b-lg font-medium" highlighted>
        <Cell>Total</Cell>
        <Cell>
          <>
            {distributionLimitIsInfinite ? null : (
              <>{currencyOrPercentSymbol} </>
            )}
            {formattedDistributionLimit}
          </>
        </Cell>
      </Row>
    </>
  )
}
