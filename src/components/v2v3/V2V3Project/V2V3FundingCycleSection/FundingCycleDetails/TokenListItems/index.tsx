import { t } from '@lingui/macro'
import {
  CONTRIBUTOR_RATE_EXPLANATION,
  DISCOUNT_RATE_EXPLANATION,
  MINT_RATE_EXPLANATION,
  OWNER_MINTING_EXPLANATION,
  PAUSE_TRANSFERS_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
  RESERVED_RATE_EXPLANATION,
  RESERVED_TOKENS_EXPLANATION,
} from 'components/strings'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { FundingCycleListItem } from '../FundingCycleListItem'

import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  deriveNextIssuanceRate,
  getUnsafeV2V3FundingCycleProperties,
} from 'utils/v2v3/fundingCycle'
import {
  computeIssuanceRate,
  formatDiscountRate,
  formatRedemptionRate,
} from 'utils/v2v3/math'
import { AllowMintingValue } from '../RulesListItems/AllowMintingValue'
import { PauseTransfersValue } from '../RulesListItems/PauseTransfersValue'
import { MintRateValue } from './MintRateValue'
import { PayerOrReservedTokensValue } from './PayerOrReservedTokensValue'
import { ReservedRateValue } from './ReservedRateValue'

export function TokenListItems({
  fundingCycle,
  fundingCycleMetadata,
  showDiffs,
  mintRateZeroAsUnchanged,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  showDiffs?: boolean
  mintRateZeroAsUnchanged?: boolean
}) {
  const {
    tokenSymbol,
    fundingCycle: oldFundingCycle,
    fundingCycleMetadata: oldFundingCycleMetadata,
  } = useContext(V2V3ProjectContext)

  const unsafeFundingCycleProperties = getUnsafeV2V3FundingCycleProperties(
    fundingCycle,
    fundingCycleMetadata,
  )

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  // tokens received by user who pays the project
  const payerTokens =
    computeIssuanceRate(fundingCycle, fundingCycleMetadata, 'payer') ?? ''

  const oldPayerTokens =
    oldFundingCycle && oldFundingCycleMetadata
      ? computeIssuanceRate(oldFundingCycle, oldFundingCycleMetadata, 'payer')
      : undefined

  const reservedTokens =
    computeIssuanceRate(fundingCycle, fundingCycleMetadata, 'reserved') ?? ''

  const oldReservedTokens =
    oldFundingCycle && oldFundingCycleMetadata
      ? computeIssuanceRate(
          oldFundingCycle,
          oldFundingCycleMetadata,
          'reserved',
        )
      : undefined

  // Diffs in token issuance are only due to discount rate. i.e. A new token issuance was not set => NO DIFF
  const onlyDiscountRateApplied =
    oldFundingCycle &&
    fundingCycle.weight.eq(
      deriveNextIssuanceRate({
        weight: BigNumber.from(0),
        previousFC: oldFundingCycle,
      }),
    )

  const mintRateHasDiff =
    oldFundingCycle &&
    !fundingCycle.weight.eq(oldFundingCycle.weight) &&
    !onlyDiscountRateApplied
  const reservedRateHasDiff =
    oldFundingCycleMetadata &&
    !fundingCycleMetadata.reservedRate.eq(oldFundingCycleMetadata.reservedRate)

  const payerTokensHasDiff =
    oldPayerTokens && (mintRateHasDiff || reservedRateHasDiff)
  const reservedTokensHasDiff = oldReservedTokens && payerTokensHasDiff

  const discountRateHasDiff =
    oldFundingCycle &&
    !fundingCycle.discountRate.eq(oldFundingCycle.discountRate)
  const redemptionHasDiff =
    oldFundingCycleMetadata &&
    !fundingCycleMetadata.redemptionRate.eq(
      oldFundingCycleMetadata.redemptionRate,
    )

  const allowMintingHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.allowMinting !== fundingCycleMetadata.allowMinting
  const pauseTransfersHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.global.pauseTransfers !==
      fundingCycleMetadata.global.pauseTransfers

  return (
    <>
      <FundingCycleListItem
        name={t`Total issuance rate`}
        value={
          <MintRateValue
            value={fundingCycle.weight}
            tokenSymbol={tokenSymbolPlural}
            zeroAsUnchanged={mintRateZeroAsUnchanged}
          />
        }
        oldValue={
          showDiffs && mintRateHasDiff ? (
            <MintRateValue
              value={oldFundingCycle.weight}
              tokenSymbol={tokenSymbolPlural}
            />
          ) : undefined
        }
        helperText={MINT_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Payer issuance rate`}
        value={
          <PayerOrReservedTokensValue
            value={payerTokens}
            tokenSymbol={tokenSymbolPlural}
            zeroAsUnchanged={mintRateZeroAsUnchanged}
          />
        }
        oldValue={
          showDiffs && payerTokensHasDiff && oldPayerTokens ? (
            <PayerOrReservedTokensValue
              value={oldPayerTokens}
              tokenSymbol={tokenSymbolPlural}
            />
          ) : undefined
        }
        helperText={CONTRIBUTOR_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Reserved rate`}
        value={
          <ReservedRateValue
            value={fundingCycleMetadata.reservedRate}
            showWarning={unsafeFundingCycleProperties.metadataReservedRate}
          />
        }
        oldValue={
          showDiffs && reservedRateHasDiff ? (
            <ReservedRateValue value={oldFundingCycleMetadata.reservedRate} />
          ) : undefined
        }
        helperText={RESERVED_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Reserved issuance rate`}
        value={
          <PayerOrReservedTokensValue
            value={reservedTokens}
            tokenSymbol={tokenSymbolPlural}
          />
        }
        oldValue={
          showDiffs && reservedTokensHasDiff ? (
            <PayerOrReservedTokensValue
              value={oldReservedTokens}
              tokenSymbol={tokenSymbolPlural}
            />
          ) : undefined
        }
        helperText={RESERVED_TOKENS_EXPLANATION}
        subItem
      />
      <FundingCycleListItem
        name={t`Issuance reduction rate`}
        value={`${formatDiscountRate(fundingCycle.discountRate)}%`}
        oldValue={
          showDiffs && discountRateHasDiff
            ? `${formatDiscountRate(oldFundingCycle.discountRate)}%`
            : undefined
        }
        helperText={DISCOUNT_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Redemption rate`}
        value={`${formatRedemptionRate(fundingCycleMetadata?.redemptionRate)}%`}
        oldValue={
          showDiffs && redemptionHasDiff
            ? `${formatRedemptionRate(
                oldFundingCycleMetadata?.redemptionRate,
              )}%`
            : undefined
        }
        helperText={REDEMPTION_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Owner token minting`}
        value={
          <AllowMintingValue allowMinting={fundingCycleMetadata.allowMinting} />
        }
        oldValue={
          showDiffs && allowMintingHasDiff ? (
            <AllowMintingValue
              allowMinting={oldFundingCycleMetadata.allowMinting}
            />
          ) : undefined
        }
        helperText={OWNER_MINTING_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Token transfers`}
        value={
          <PauseTransfersValue
            pauseTransfers={fundingCycleMetadata.global.pauseTransfers ?? false}
          />
        }
        oldValue={
          showDiffs && pauseTransfersHasDiff ? (
            <PauseTransfersValue
              pauseTransfers={
                oldFundingCycleMetadata?.global.pauseTransfers ?? false
              }
            />
          ) : undefined
        }
        helperText={PAUSE_TRANSFERS_EXPLANATION}
      />
    </>
  )
}
