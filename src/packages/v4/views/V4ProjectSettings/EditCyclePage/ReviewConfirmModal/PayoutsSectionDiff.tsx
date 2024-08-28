import { Trans, t } from '@lingui/macro'
import { FundingCycleListItem } from 'components/FundingCycleListItem'
import { getV4CurrencyOption } from 'packages/v4/utils/currency'
import { emptySectionClasses } from './DetailsSectionDiff'
import DiffedSplitList from './DiffedSplits/DiffedSplitList'
import { DiffSection } from './DiffSection'
import { PayoutLimitValue } from './FormattedRulesetValues/DetailsSection/PayoutLimitValue'
import { usePayoutsSectionValues } from './hooks/usePayoutsSectionValues'

export function PayoutsSectionDiff() {
  const {
    sectionHasDiff,
    advancedOptionsHasDiff,

    newCurrency,
    currentCurrency,

    currentDistributionLimit,
    newDistributionLimit,
    distributionLimitHasDiff,

    currentPayoutSplits,
    newPayoutSplits,
    payoutSplitsHasDiff,

    newHoldFees,
    currentHoldFees,
  } = usePayoutsSectionValues()

  if (!sectionHasDiff) {
    return (
      <div className={emptySectionClasses}>
        <Trans>No edits were made to payouts for this cycle.</Trans>
      </div>
    )
  }

  const roundingPrecision = newCurrency === 'ETH' ? 4 : 2

  return (
    <DiffSection
      content={
        <div className="mb-5 flex flex-col gap-3 text-sm">
          {distributionLimitHasDiff && (
            <FundingCycleListItem
              name={t`Total payouts`}
              value={
                <PayoutLimitValue
                  payoutLimit={newDistributionLimit}
                  currencyName={newCurrency}
                  shortName
                />
              }
              oldValue={
                <PayoutLimitValue
                  payoutLimit={currentDistributionLimit}
                  currencyName={currentCurrency}
                  shortName
                />
              }
            />
          )}
          {payoutSplitsHasDiff && (
            <div className="pb-4">
              <div className="mb-3 mt-2 text-sm font-semibold">
                <Trans>Payout recipients:</Trans>
              </div>
              <DiffedSplitList
                splits={newPayoutSplits}
                diffSplits={currentPayoutSplits}
                currency={BigInt(getV4CurrencyOption(newCurrency))}
                oldCurrency={BigInt(
                  getV4CurrencyOption(currentCurrency),
                )}
                totalValue={newDistributionLimit}
                previousTotalValue={currentDistributionLimit}
                valueFormatProps={{ precision: roundingPrecision }}
                showDiffs
              />
            </div>
          )}
        </div>
      }
      advancedOptions={
        advancedOptionsHasDiff && (
          <FundingCycleListItem
            name={t`Hold fees`}
            value={<span className="capitalize">{newHoldFees.toString()}</span>}
            oldValue={
              <span className="capitalize">{currentHoldFees.toString()}</span>
            }
          />
        )
      }
    />
  )
}
