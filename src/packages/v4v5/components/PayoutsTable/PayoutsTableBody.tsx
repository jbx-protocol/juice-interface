import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { PayoutsTableCell } from 'components/PayoutsTable/PayoutsTableCell'
import { PayoutsTableRow } from 'components/PayoutsTable/PayoutsTableRow'
import { getV4V5CurrencyOption } from 'packages/v4v5/utils/currency'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { twMerge } from 'tailwind-merge'
import { Allocation } from '../Allocation/Allocation'
import { usePayoutsTableContext } from './context/PayoutsTableContext'
import { CurrencySwitcher } from './CurrencySwitcher'
import { HeaderRows } from './HeaderRows'
import { usePayoutsTable } from './hooks/usePayoutsTable'
import { PayoutSplitRow } from './PayoutSplitRow'
import { TotalRows } from './TotalRows'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function PayoutsTableBody() {
  const { version } = useV4V5Version()
  const { topAccessory, hideHeader, createTreasurySelection } =
    usePayoutsTableContext()
  const {
    payoutSplits,
    currency,
    handleDeletePayoutSplit,
    setCurrency,
    distributionLimit,
  } = usePayoutsTable()
  const emptyState = distributionLimit === 0 && !payoutSplits?.length

  const hasDistributionLimit = distributionLimit && distributionLimit > 0

  if (createTreasurySelection === 'zero') {
    // TODO: This feels like a hack, this should not be coupled here.
    return <>{topAccessory}</>
  }

  return (
    <>
      {topAccessory}
      <div className="rounded-lg border border-smoke-200 dark:border-slate-600">
        <Allocation
          allocationCurrency={getV4V5CurrencyOption(currency, version)}
          setAllocationCurrency={setCurrency}
        >
          <div className="w-full text-left">
            {hideHeader ? null : <HeaderRows />}
            <div>
              {emptyState ? (
                <Row className="text-center">
                  <Cell colSpan={4} className="text-tertiary py-8">
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
                      <Cell>
                        {hasDistributionLimit ? (
                          <CurrencySwitcher />
                        ) : (
                          <Trans>Percent</Trans>
                        )}
                      </Cell>
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
      <Form.Item name="payoutLimit" className="mb-0" />
      <Form.Item name="payoutLimitCurrency" className="mb-0" />
    </>
  )
}
