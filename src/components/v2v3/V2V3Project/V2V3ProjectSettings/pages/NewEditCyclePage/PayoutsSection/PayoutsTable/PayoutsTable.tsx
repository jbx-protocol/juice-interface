import { Trans, t } from '@lingui/macro'
import { Form } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import round from 'lodash/round'
import { useEditCycleFormContext } from '../../EditCycleFormContext'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { HeaderRows } from './HeaderRows'
import { PayoutSplitRow } from './PayoutSplitRow'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function PayoutsTable() {
  const { editCycleForm, initialFormData } = useEditCycleFormContext()

  const {
    payoutSplits,
    distributionLimit,
    totalFeeAmount,
    subTotal,
    roundingPrecision,
    ownerRemainderValue,
  } = usePayoutsTable()

  const formattedDistributionLimit = distributionLimit
    ? round(distributionLimit, roundingPrecision)
    : 'X'

  if (!editCycleForm || !initialFormData) return null

  return (
    <div className="rounded-lg border border-smoke-200 dark:border-grey-600">
      <Form.Item name="payoutSplits" />
      <Form.Item name="distributionLimit" />
      <table className="w-full text-left">
        <HeaderRows />
        <tbody>
          {payoutSplits?.map((payoutSplit, index) => (
            <PayoutSplitRow key={index} payoutSplit={payoutSplit} />
          ))}
          <Row>
            <Cell>Sub-total</Cell>
            <Cell>{round(subTotal, roundingPrecision)}</Cell>
          </Row>
          {ownerRemainderValue ? (
            <Row>
              <Cell>
                <TooltipLabel
                  tip={t`The unallocated portion of your total will go to the wallet that owns the project by default.`}
                  label={<Trans>Remaining balance</Trans>}
                />
              </Cell>
              <Cell>{ownerRemainderValue}</Cell>
            </Row>
          ) : null}
          <Row>
            <Cell>Fees</Cell>
            <Cell>{round(totalFeeAmount, roundingPrecision)}</Cell>
          </Row>
          <Row className="border-none font-medium" highlighted>
            <Cell>Total</Cell>
            <Cell>{formattedDistributionLimit}</Cell>
          </Row>
        </tbody>
      </table>
    </div>
  )
}
