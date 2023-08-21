import { BigNumber } from '@ethersproject/bignumber'
import { Trans, t } from '@lingui/macro'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { DistributionLimitValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItems/DistributionLimitValue'
import DiffedSplitList from 'components/v2v3/shared/DiffedSplits/DiffedSplitList'
import { getV2V3CurrencyOption } from 'utils/v2v3/currency'
import { emptySectionClasses } from './DetailsSectionDiff'
import { DiffSection } from './DiffSection'
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
    distributionLimitIsInfinite,

    currentPayoutSplits,
    newPayoutSplits,
    payoutSplitsHasDiff,

    newHoldFees,
    currentHoldFees,
    holdFeesHasDiff,
  } = usePayoutsSectionValues()

  if (!sectionHasDiff) {
    return (
      <div className={emptySectionClasses}>
        <Trans>No edits were made to payouts for this cycle.</Trans>
      </div>
    )
  }

  const roundingPrecision = newCurrency === 'ETH' ? 4 : 2

  const content = (
    <div className="mb-5 flex flex-col gap-3 text-sm">
      <FundingCycleListItem
        name={t`Total payouts`}
        value={
          <DistributionLimitValue
            distributionLimit={newDistributionLimit}
            currency={newCurrency}
            shortName
          />
        }
        oldValue={
          distributionLimitHasDiff ? (
            <DistributionLimitValue
              distributionLimit={currentDistributionLimit}
              currency={currentCurrency}
              shortName
            />
          ) : undefined
        }
      />
      {payoutSplitsHasDiff ? (
        <div className="pb-4">
          <div className="mb-3 text-sm font-semibold">
            <Trans>Payout recipients:</Trans>
          </div>
          <DiffedSplitList
            splits={newPayoutSplits}
            diffSplits={currentPayoutSplits}
            currency={BigNumber.from(getV2V3CurrencyOption(newCurrency))}
            projectOwnerAddress={undefined}
            totalValue={newDistributionLimit}
            showAmounts={!distributionLimitIsInfinite}
            valueFormatProps={{ precision: roundingPrecision }}
            showDiffs
          />
        </div>
      ) : null}
    </div>
  )

  const advancedOptions = advancedOptionsHasDiff ? (
    <FundingCycleListItem
      name={t`Hold fees`}
      value={<span className="capitalize">{newHoldFees.toString()}</span>}
      oldValue={
        holdFeesHasDiff ? (
          <span className="capitalize">{currentHoldFees.toString()}</span>
        ) : undefined
      }
    />
  ) : undefined

  return <DiffSection content={content} advancedOptions={advancedOptions} />
}
