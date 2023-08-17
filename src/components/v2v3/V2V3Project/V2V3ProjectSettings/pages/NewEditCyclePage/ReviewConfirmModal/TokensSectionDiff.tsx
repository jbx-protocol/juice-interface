import { t } from '@lingui/macro'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import {
  DISCOUNT_RATE_EXPLANATION,
  MINT_RATE_EXPLANATION,
  OWNER_MINTING_EXPLANATION,
  PAUSE_TRANSFERS_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
  RESERVED_RATE_EXPLANATION,
} from 'components/strings'
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
import { DiffSection } from './DiffSection'
import { useTokensSectionValues } from './hooks/useTokensSectionValues'

export function TokensSectionDiff() {
  const { projectOwnerAddress } = useProjectContext()
  const {
    newMintRate,
    currentMintRate,
    mintRateHasDiff,

    newReservedRate,
    currentReservedRate,
    reservedRateHasDiff,

    newReservedSplits,
    currentReservedSplits,
    //reservedSplitsHasDiff,

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
        helperText={MINT_RATE_EXPLANATION}
      />
    </div>
  )

  const advancedOptions = (
    <>
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
        helperText={RESERVED_RATE_EXPLANATION}
      />
      {newReservedRate?.gt(0) ? (
        <DiffedSplitList
          splits={newReservedSplits}
          diffSplits={currentReservedSplits}
          projectOwnerAddress={projectOwnerAddress}
          totalValue={undefined}
          reservedRate={formattedReservedRate}
          showDiffs
        />
      ) : null}

      <FundingCycleListItem
        name={t`Issuance reduction rate`}
        value={`${formatDiscountRate(newDiscountRate)}%`}
        oldValue={
          discountRateHasDiff && currentDiscountRate
            ? `${formatDiscountRate(currentDiscountRate)}%`
            : undefined
        }
        helperText={DISCOUNT_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Redemption rate`}
        value={`${formatRedemptionRate(newRedemptionRate)}%`}
        oldValue={
          redemptionHasDiff && currentRedemptionRate
            ? `${formatRedemptionRate(currentRedemptionRate)}%`
            : undefined
        }
        helperText={REDEMPTION_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Project owner token minting`}
        value={<AllowMintingValue allowMinting={newAllowMinting} />}
        oldValue={
          allowMintingHasDiff ? (
            <AllowMintingValue allowMinting={currentAllowMinting} />
          ) : undefined
        }
        helperText={OWNER_MINTING_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Token transfers`}
        value={<PauseTransfersValue pauseTransfers={newPauseTransfers} />}
        oldValue={
          pauseTransfersHasDiff ? (
            <PauseTransfersValue pauseTransfers={currentPauseTransfers} />
          ) : undefined
        }
        helperText={PAUSE_TRANSFERS_EXPLANATION}
      />
    </>
  )

  return <DiffSection content={content} advancedOptions={advancedOptions} />
}
