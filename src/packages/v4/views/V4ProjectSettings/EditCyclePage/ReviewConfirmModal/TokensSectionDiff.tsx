import { Trans, t } from '@lingui/macro'
import { FundingCycleListItem } from 'components/FundingCycleListItem'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { emptySectionClasses } from './DetailsSectionDiff'
import DiffedSplitList from './DiffedSplits/DiffedSplitList'
import { DiffSection } from './DiffSection'
import { AllowedValue } from './FormattedRulesetValues/AllowedValue'
import { IssuanceRateValue } from './FormattedRulesetValues/Tokens/IssuanceRateValue'
import { useTokensSectionValues } from './hooks/useTokensSectionValues'

export function TokensSectionDiff() {
  const {
    sectionHasDiff,

    newMintRate,
    mintRateHasDiff,

    newReservedRate,
    currentReservedRate,
    reservedRateHasDiff,

    newReservedSplits,
    currentReservedSplits,
    reservedSplitsHasDiff,

    newDiscountRate,
    currentDiscountRate,
    discountRateHasDiff,

    newRedemptionRate,
    currentRedemptionRate,
    redemptionHasDiff,

    newAllowMinting,
    currentAllowMinting,
    allowMintingHasDiff,

    newTokenTransfers,
    currentTokenTransfers,
    tokenTransfersHasDiff,

    // unsafeFundingCycleProperties,
    tokenSymbolPlural,
  } = useTokensSectionValues()

  const { 
    ruleset: upcomingRuleset, 
  } = useJBUpcomingRuleset()

  if (!sectionHasDiff) {
    return (
      <div className={emptySectionClasses}>
        <Trans>No edits were made to tokens for this cycle.</Trans>
      </div>
    )
  }

  const currentMintRateAfterDiscountRateApplied = upcomingRuleset?.weight.toFloat()

  return (
    <DiffSection
      content={
        <div className="mb-5 flex flex-col gap-3 text-sm">
          {mintRateHasDiff && currentMintRateAfterDiscountRateApplied ? (
            <FundingCycleListItem
              name={t`Total issuance rate`}
              value={
                <IssuanceRateValue
                  value={newMintRate}
                  tokenSymbol={tokenSymbolPlural}
                />
              }
              oldValue={
                <IssuanceRateValue
                  value={currentMintRateAfterDiscountRateApplied}
                  tokenSymbol={tokenSymbolPlural}
                />
              }
            />
          ) : null}

          {discountRateHasDiff && currentDiscountRate ? (
            <FundingCycleListItem
              name={t`Decay rate`}
              value={`${newDiscountRate}%`}
              oldValue={`${currentDiscountRate}%`}
            />
          ) : null}

          {redemptionHasDiff && currentRedemptionRate ? (
            <FundingCycleListItem
              name={t`Redemption rate`}
              value={`${newRedemptionRate}%`}
              oldValue={`${currentRedemptionRate}%`}
            />
          ) : null}

          {allowMintingHasDiff ? (
            <FundingCycleListItem
              name={t`Owner token minting`}
              value={
                <AllowedValue value={newAllowMinting} />
              }
              oldValue={
                <AllowedValue value={currentAllowMinting} />
              }
            />
          ) : null}

          {tokenTransfersHasDiff ? (
            <FundingCycleListItem
              name={t`Token transfers`}
              value={
                <AllowedValue value={newTokenTransfers} />
              }
              oldValue={
                <AllowedValue value={currentTokenTransfers} />
              }
            />
          ) : null}

          {reservedRateHasDiff && currentReservedRate ? (
            <FundingCycleListItem
              name={t`Reserved rate`}
              value={
                <span>{newReservedRate}%</span>
              }
              oldValue={<span>{currentReservedRate}%</span>}
            />
          ) : null}

          {reservedSplitsHasDiff ? (
            <div className="pb-4">
              <div className="mb-3 text-sm font-semibold">
                <Trans>Reserved recipients:</Trans>
              </div>
              <DiffedSplitList
                splits={newReservedSplits}
                diffSplits={currentReservedSplits}
                totalValue={undefined}
                reservedPercent={newReservedRate}
                showDiffs
              />
            </div>
          ) : null}
        </div>
      }
    />
  )
}
