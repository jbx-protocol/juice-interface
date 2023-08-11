import { Trans, t } from '@lingui/macro'
import TooltipLabel from 'components/TooltipLabel'
import round from 'lodash/round'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

/* Bottom few rows of the payouts table which show total amounts and fees */
export function TotalRows() {
  const {
    distributionLimit,
    distributionLimitIsInfinite,
    totalFeeAmount,
    subTotal,
    roundingPrecision,
    ownerRemainderValue,
    currencyOrPercentSymbol,
  } = usePayoutsTable()

  const formattedDistributionLimit =
    distributionLimit && !distributionLimitIsInfinite
      ? round(distributionLimit, roundingPrecision)
      : t`Unlimited`

  return (
    <>
      <Row>
        <Cell>Sub-total</Cell>
        <Cell>
          {currencyOrPercentSymbol} {round(subTotal, roundingPrecision)}
        </Cell>
      </Row>
      {ownerRemainderValue ? (
        <Row>
          <Cell>
            <TooltipLabel
              tip={t`The unallocated portion of your total will go to the wallet that owns the project by default.`}
              label={<Trans>Remaining balance</Trans>}
            />
          </Cell>
          <Cell className={ownerRemainderValue < 0 ? 'text-error-500' : ''}>
            {currencyOrPercentSymbol} {ownerRemainderValue}
          </Cell>
        </Row>
      ) : null}
      <Row>
        <Cell>Fees</Cell>
        <Cell>
          {currencyOrPercentSymbol} {round(totalFeeAmount, roundingPrecision)}
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
