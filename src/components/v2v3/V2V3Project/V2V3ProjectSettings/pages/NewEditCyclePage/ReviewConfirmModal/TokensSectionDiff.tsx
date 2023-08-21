import { Trans, t } from '@lingui/macro'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { FundingCycleListItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/FundingCycleListItem'
import { AllowMintingValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/RulesListItems/AllowMintingValue'
import { PauseTransfersValue } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/RulesListItems/PauseTransfersValue'
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

  const content = (
    <div className="mb-5 flex flex-col gap-3 text-sm">
      <FundingCycleListItem
        name={t`Total issuance rate`}
        value={
          <MintRateValue
            value={newMintRate}
            tokenSymbol={tokenSymbolPlural}
            zeroAsUnchanged={true}
          />
        }
        oldValue={
          mintRateHasDiff && currentMintRate ? (
            <MintRateValue
              value={currentMintRate}
              tokenSymbol={tokenSymbolPlural}
            />
          ) : undefined
        }
      />
      <FundingCycleListItem
        name={t`Reserved tokens`}
        value={
          <ReservedRateValue
            value={newReservedRate}
            showWarning={unsafeFundingCycleProperties?.metadataReservedRate}
          />
        }
        oldValue={
          reservedRateHasDiff && currentReservedRate ? (
            <ReservedRateValue value={currentReservedRate} />
          ) : undefined
        }
      />
      {newReservedRate?.gt(0) && reservedSplitsHasDiff ? (
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
      ) : null}

      <FundingCycleListItem
        name={t`Issuance reduction rate`}
        value={`${formatDiscountRate(newDiscountRate)}%`}
        oldValue={
          discountRateHasDiff && currentDiscountRate
            ? `${formatDiscountRate(currentDiscountRate)}%`
            : undefined
        }
      />
      <FundingCycleListItem
        name={t`Redemption rate`}
        value={`${formatRedemptionRate(newRedemptionRate)}%`}
        oldValue={
          redemptionHasDiff && currentRedemptionRate
            ? `${formatRedemptionRate(currentRedemptionRate)}%`
            : undefined
        }
      />
      <FundingCycleListItem
        name={t`Project owner token minting`}
        value={<AllowMintingValue allowMinting={newAllowMinting} />}
        oldValue={
          allowMintingHasDiff ? (
            <AllowMintingValue allowMinting={currentAllowMinting} />
          ) : undefined
        }
      />
      <FundingCycleListItem
        name={t`Token transfers`}
        value={<PauseTransfersValue pauseTransfers={newPauseTransfers} />}
        oldValue={
          pauseTransfersHasDiff ? (
            <PauseTransfersValue pauseTransfers={currentPauseTransfers} />
          ) : undefined
        }
      />
    </div>
  )

  return <DiffSection content={content} />
}
