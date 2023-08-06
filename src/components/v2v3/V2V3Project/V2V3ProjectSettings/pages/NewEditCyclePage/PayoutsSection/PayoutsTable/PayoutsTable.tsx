import { Trans, t } from '@lingui/macro'
import { Form } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { Allocation } from 'components/v2v3/shared/Allocation'
import round from 'lodash/round'
import { getV2V3CurrencyOption } from 'utils/v2v3/currency'
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
    currency,
    handleDeletePayoutSplit,
  } = usePayoutsTable()

  const formattedDistributionLimit = distributionLimit
    ? round(distributionLimit, roundingPrecision)
    : 'X'

  if (!editCycleForm || !initialFormData) return null

  return (
    <>
      <div className="rounded-lg border border-smoke-200 dark:border-grey-600">
        <Allocation allocationCurrency={getV2V3CurrencyOption(currency)}>
          <table className="w-full text-left">
            <HeaderRows />
            <tbody>
              {payoutSplits.map((payoutSplit, index) => (
                <PayoutSplitRow
                  key={index}
                  payoutSplit={payoutSplit}
                  onDeleteClick={() => handleDeletePayoutSplit({ payoutSplit })}
                />
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
        </Allocation>
      </div>
      {/* Empty form items just to keep AntD useWatch happy */}
      <Form.Item name="payoutSplits" />
      <Form.Item name="distributionLimit" />
      <Form.Item name="distributionLimitCurrency" />
    </>
  )
}
