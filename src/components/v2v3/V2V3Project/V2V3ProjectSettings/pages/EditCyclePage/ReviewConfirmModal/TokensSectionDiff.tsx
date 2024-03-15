import { BigNumber } from '@ethersproject/bignumber'
import { Trans, t } from '@lingui/macro'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { MintRateValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/TokenListItems/MintRateValue'
import { ReservedRateValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/TokenListItems/ReservedRateValue'
import DiffedSplitList from 'components/v2v3/shared/DiffedSplits/DiffedSplitList'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { deriveNextIssuanceRate } from 'utils/v2v3/fundingCycle'
import {
  formatDiscountRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import { emptySectionClasses } from './DetailsSectionDiff'
import { DiffSection } from './DiffSection'
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

    newPauseTransfers,
    currentPauseTransfers,
    pauseTransfersHasDiff,

    unsafeFundingCycleProperties,
    tokenSymbolPlural,
  } = useTokensSectionValues()

  const { fundingCycle: currentFundingCycle } = useContext(V2V3ProjectContext)

  if (!sectionHasDiff) {
    return (
      <div className={emptySectionClasses}>
        <Trans>No edits were made to tokens for this cycle.</Trans>
      </div>
    )
  }

  const formattedReservedRate = parseFloat(formatReservedRate(newReservedRate))

  const currentMintRateAfterDiscountRateApplied = deriveNextIssuanceRate({
    weight: BigNumber.from(0),
    previousFC: currentFundingCycle,
  })

  return (
    <DiffSection
      content={
        <div className="mb-5 flex flex-col gap-3 text-sm">
          {mintRateHasDiff && currentMintRateAfterDiscountRateApplied && (
            <FundingCycleListItem
              name={t`Total issuance`}
              value={
                <MintRateValue
                  value={newMintRate}
                  tokenSymbol={tokenSymbolPlural}
                />
              }
              oldValue={
                <MintRateValue
                  value={currentMintRateAfterDiscountRateApplied}
                  tokenSymbol={tokenSymbolPlural}
                />
              }
            />
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
                totalValue={undefined}
                reservedRate={formattedReservedRate}
                showDiffs
              />
            </div>
          )}
        </div>
      }
    />
  )
}
