import { Trans, t } from '@lingui/macro'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { MintRateValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/TokenListItems/MintRateValue'
import { ReservedRateValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/TokenListItems/ReservedRateValue'
import DiffedSplitList from 'components/v2v3/shared/DiffedSplits/DiffedSplitList'
import {
  formatDiscountRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import { emptySectionClasses } from './DetailsSectionDiff'
import { DiffSection } from './DiffSection'
import { useTokensSectionValues } from './hooks/useTokensSectionValues'

export function TokensSectionDiff() {
  const { projectOwnerAddress } = useProjectContext()
  const {
    sectionHasDiff,

    newMintRate,
    currentMintRate,
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

    newPauseTransfers,
    currentPauseTransfers,
    pauseTransfersHasDiff,

    unsafeFundingCycleProperties,
    tokenSymbolPlural,
  } = useTokensSectionValues()

  if (!sectionHasDiff) {
    return (
      <div className={emptySectionClasses}>
        <Trans>No edits were made to tokens for this cycle.</Trans>
      </div>
    )
  }

  const formattedReservedRate = parseFloat(formatReservedRate(newReservedRate))

  return (
    <DiffSection
      content={
        <div className="mb-5 flex flex-col gap-3 text-sm">
          {mintRateHasDiff && currentMintRate && (
            <FundingCycleListItem
              name={t`Total issuance rate`}
              value={
                <MintRateValue
                  value={newMintRate}
                  tokenSymbol={tokenSymbolPlural}
                  zeroAsUnchanged
                />
              }
              oldValue={
                <MintRateValue
                  value={currentMintRate}
                  tokenSymbol={tokenSymbolPlural}
                />
              }
            />
          )}
          {reservedRateHasDiff && currentReservedRate && (
            <FundingCycleListItem
              name={t`Reserved tokens`}
              value={
                <ReservedRateValue
                  value={newReservedRate}
                  showWarning={
                    unsafeFundingCycleProperties?.metadataReservedRate
                  }
                />
              }
              oldValue={<ReservedRateValue value={currentReservedRate} />}
            />
          )}
          {reservedSplitsHasDiff && (
            <div className="pb-4">
              <div className="mb-3 text-sm font-semibold">
                <Trans>Reserved recipients:</Trans>
              </div>
              <DiffedSplitList
                splits={newReservedSplits}
                diffSplits={currentReservedSplits}
                projectOwnerAddress={projectOwnerAddress}
                totalValue={undefined}
                reservedRate={formattedReservedRate}
                showDiffs
              />
            </div>
          )}
          {discountRateHasDiff && currentDiscountRate && (
            <FundingCycleListItem
              name={t`Issuance reduction rate`}
              value={`${formatDiscountRate(newDiscountRate)}%`}
              oldValue={`${formatDiscountRate(currentDiscountRate)}%`}
            />
          )}
          {redemptionHasDiff && currentRedemptionRate && (
            <FundingCycleListItem
              name={t`Redemption rate`}
              value={`${formatRedemptionRate(newRedemptionRate)}%`}
              oldValue={`${formatRedemptionRate(currentRedemptionRate)}%`}
            />
          )}
          {allowMintingHasDiff && (
            <FundingCycleListItem
              name={t`Project owner token minting`}
              value={
                <span className="capitalize">{newAllowMinting.toString()}</span>
              }
              oldValue={
                <span className="capitalize">
                  {currentAllowMinting.toString()}
                </span>
              }
            />
          )}
          {pauseTransfersHasDiff && (
            <FundingCycleListItem
              name={t`Token transfers`}
              value={
                <span className="capitalize">
                  {newPauseTransfers.toString()}
                </span>
              }
              oldValue={
                <span className="capitalize">
                  {currentPauseTransfers.toString()}
                </span>
              }
            />
          )}
        </div>
      }
    />
  )
}
