import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { DISTRIBUTION_LIMIT_EXPLANATION } from 'components/strings'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { DistributionLimitValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItems/DistributionLimitValue'
import DiffedSplitList from 'components/v2v3/shared/DiffedSplits/DiffedSplitList'
import { getV2V3CurrencyOption } from 'utils/v2v3/currency'
import { DiffSection } from './DiffSection'
import { usePayoutsSectionValues } from './hooks/usePayoutsSectionValues'

export function PayoutsSectionDiff() {
  const {
    newCurrency,
    currentCurrency,

    currentDistributionLimit,
    newDistributionLimit,
    distributionLimitHasDiff,
    distributionLimitIsInfinite,

    currentPayoutSplits,
    newPayoutSplits,

    newHoldFees,
    currentHoldFees,
    holdFeesHasDiff,
  } = usePayoutsSectionValues()

  const roundingPrecision = newCurrency === 'ETH' ? 4 : 2

  const content = (
    <div className="mb-5 flex flex-col gap-3 text-sm">
      <FundingCycleListItem
        name={t`Total payouts`}
        value={
          <DistributionLimitValue
            distributionLimit={newDistributionLimit}
            currency={newCurrency}
          />
        }
        oldValue={
          distributionLimitHasDiff ? (
            <DistributionLimitValue
              distributionLimit={currentDistributionLimit}
              currency={currentCurrency}
            />
          ) : undefined
        }
        helperText={DISTRIBUTION_LIMIT_EXPLANATION}
      />
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
  )
  const advancedOptions = (
    <FundingCycleListItem
      name={t`Hold fees`}
      value={<span className="capitalize">{newHoldFees.toString()}</span>}
      oldValue={
        holdFeesHasDiff ? (
          <span className="capitalize">{currentHoldFees.toString()}</span>
        ) : undefined
      }
      className="text-xs"
    />
  )
  return <DiffSection content={content} advancedOptions={advancedOptions} />
}
