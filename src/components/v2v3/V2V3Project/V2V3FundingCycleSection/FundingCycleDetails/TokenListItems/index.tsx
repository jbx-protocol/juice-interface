import { t } from '@lingui/macro'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import {
  CONTRIBUTOR_RATE_EXPLAINATION,
  DISCOUNT_RATE_EXPLANATION,
  MINT_RATE_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
  RESERVED_RATE_EXPLAINATION,
  RESERVED_TOKENS_EXPLAINATION,
} from '../../settingExplanations'
import { FundingCycleListItem } from '../FundingCycleListItem'

import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { getUnsafeV2V3FundingCycleProperties } from 'utils/v2v3/fundingCycle'
import {
  computeIssuanceRate,
  formatDiscountRate,
  formatRedemptionRate,
} from 'utils/v2v3/math'
import { MintRateValue } from './MintRateValue'
import { ReservedRateValue } from './ReservedRateValue'
import { PayerOrReservedTokensValue } from './PayerOrReservedTokensValue'

export function TokenListItems({
  fundingCycle,
  fundingCycleMetadata,
  showDiffs,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  showDiffs?: boolean
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

  const mintRateHasDiff =
    oldFundingCycle && !fundingCycle.weight.eq(oldFundingCycle.weight)
  const reservedRateHasDiff =
    oldFundingCycleMetadata &&
    !fundingCycleMetadata.reservedRate.eq(oldFundingCycleMetadata.reservedRate)

  const payerTokensHasDiff = oldPayerTokens && !(payerTokens === oldPayerTokens)
  const reservedTokensHasDiff =
    oldReservedTokens && !(reservedTokens === oldReservedTokens)

  const discountRateHasDiff =
    oldFundingCycle &&
    !fundingCycle.discountRate.eq(oldFundingCycle.discountRate)
  const redemptionHasDiff =
    oldFundingCycleMetadata &&
    !fundingCycleMetadata.redemptionRate.eq(
      oldFundingCycleMetadata.redemptionRate,
    )

  return (
    <>
      <FundingCycleListItem
        name={t`Mint rate`}
        value={<MintRateValue value={fundingCycle.weight} />}
        oldValue={
          showDiffs && mintRateHasDiff ? (
            <MintRateValue value={oldFundingCycle.weight} />
          ) : undefined
        }
        helperText={MINT_RATE_EXPLANATION}
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
        helperText={RESERVED_RATE_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Reserved tokens`}
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
        helperText={RESERVED_TOKENS_EXPLAINATION}
        subItem
      />
      <FundingCycleListItem
        name={t`Payment issuance rate`}
        value={
          <PayerOrReservedTokensValue
            value={payerTokens}
            tokenSymbol={tokenSymbolPlural}
          />
        }
        oldValue={
          showDiffs && payerTokensHasDiff ? (
            <PayerOrReservedTokensValue
              value={oldPayerTokens}
              tokenSymbol={tokenSymbolPlural}
            />
          ) : undefined
        }
        helperText={CONTRIBUTOR_RATE_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Discount rate`}
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
    </>
  )
}
