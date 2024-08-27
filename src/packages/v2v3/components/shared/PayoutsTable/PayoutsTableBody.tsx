import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { PayoutsTableCell } from 'components/PayoutsTable/PayoutsTableCell'
import { PayoutsTableRow } from 'components/PayoutsTable/PayoutsTableRow'
import { Allocation } from 'packages/v2v3/components/shared/Allocation/Allocation'
import { getV2V3CurrencyOption } from 'packages/v2v3/utils/currency'
import { twMerge } from 'tailwind-merge'
import { CurrencySwitcher } from './CurrencySwitcher'
import { HeaderRows } from './HeaderRows'
import { PayoutSplitRow } from './PayoutSplitRow'
import { TotalRows } from './TotalRows'
import { usePayoutsTableContext } from './context/PayoutsTableContext'
import { usePayoutsTable } from './hooks/usePayoutsTable'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function PayoutsTableBody() {
  const { topAccessory, hideHeader } = usePayoutsTableContext()
  const {
    payoutSplits,
    currency,
    handleDeletePayoutSplit,
    setCurrency,
    distributionLimit,
  } = usePayoutsTable()
  const emptyState = distributionLimit === 0 && !payoutSplits?.length

  const hasDistributionLimit = distributionLimit && distributionLimit > 0

  return (
    <>
      {topAccessory}
      <div className="rounded-lg border border-smoke-200 dark:border-slate-600">
        <Allocation
          allocationCurrency={getV2V3CurrencyOption(currency)}
          setAllocationCurrency={setCurrency}
        >
          <div className="w-full text-left">
            {hideHeader ? null : <HeaderRows />}
            <div>
              {emptyState ? (
                <Row className="text-center">
                  <Cell colSpan={4} className="text-tertiary py-32">
                    <Trans>No payout recipients</Trans>
                  </Cell>
                </Row>
              ) : (
                <>
                  {/* `|| hasDistributionLimit` to account for old projects whose payout is only the "remaining project owner" split, but still have a distributionLimit.  */}
                  {payoutSplits.length > 0 || hasDistributionLimit ? (
                    <Row
                      className={twMerge(
                        'font-medium',
                        hideHeader ? 'rounded-t-lg border-t-0' : null,
                      )}
                      highlighted
                    >
                      <Cell>
                        <Trans>Address or ID</Trans>
                      </Cell>
                      {hasDistributionLimit ?
                          <CurrencySwitcher />
                      : <Trans>Percent</Trans>}
                    </Row>
                  ) : null}
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
