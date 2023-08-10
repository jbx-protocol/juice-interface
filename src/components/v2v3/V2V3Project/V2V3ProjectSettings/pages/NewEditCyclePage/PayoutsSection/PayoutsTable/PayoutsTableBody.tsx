import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { Allocation } from 'components/v2v3/shared/Allocation'
import { getV2V3CurrencyOption } from 'utils/v2v3/currency'
import { useEditCycleFormContext } from '../../EditCycleFormContext'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { HeaderRows } from './HeaderRows'
import { PayoutSplitRow } from './PayoutSplitRow'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'
import { TotalRows } from './TotalRows'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function PayoutsTableBody() {
  const { editCycleForm, initialFormData } = useEditCycleFormContext()

  const { payoutSplits, currency, handleDeletePayoutSplit, setCurrency } =
    usePayoutsTable()

  if (!editCycleForm || !initialFormData) return null

  const emptyState = payoutSplits.length === 0

  return (
    <>
      <div className="rounded-lg border border-smoke-200 dark:border-grey-600">
        <Allocation
          allocationCurrency={getV2V3CurrencyOption(currency)}
          setAllocationCurrency={setCurrency}
        >
          <div className="w-full text-left">
            <HeaderRows />
            <div>
              {emptyState ? (
                <Row className="border-0 text-center">
                  <Cell colSpan={4} className="text-tertiary py-32">
                    <Trans>No payout recipients</Trans>
                  </Cell>
                </Row>
              ) : (
                <>
                  <Row className="font-medium" highlighted>
                    <Cell>
                      <Trans>Address or ID</Trans>
                    </Cell>
                    <Cell>
                      <Trans>Amount</Trans>
                    </Cell>
                  </Row>
                  {payoutSplits.map((payoutSplit, index) => (
                    <PayoutSplitRow
                      key={index}
                      payoutSplit={payoutSplit}
                      onDeleteClick={() =>
                        handleDeletePayoutSplit({ payoutSplit })
                      }
                    />
                  ))}
                  <TotalRows />
                </>
              )}
            </div>
          </div>
        </Allocation>
      </div>
      {/* Empty form items just to keep AntD useWatch happy */}
      <Form.Item name="payoutSplits" className="mb-0" />
      <Form.Item name="distributionLimit" className="mb-0" />
      <Form.Item name="distributionLimitCurrency" className="mb-0" />
    </>
  )
}
