import { t, Trans } from '@lingui/macro'
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
} from '../settingExplanations'
import { FundingCycleListItem } from './FundingCycleListItem'

import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { parseEther } from 'ethers/lib/utils'
import { useContext } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { getUnsafeV2V3FundingCycleProperties } from 'utils/v2v3/fundingCycle'
import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
  weightAmountPermyriad,
} from 'utils/v2v3/math'

export function TokenListItems({
  fundingCycle,
  fundingCycleMetadata,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
}) {
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const unsafeFundingCycleProperties = getUnsafeV2V3FundingCycleProperties(
    fundingCycle,
    fundingCycleMetadata,
  )
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const ContributorRateText = () => {
    const payerRate = formattedNum(
      formatIssuanceRate(
        weightAmountPermyriad(
          fundingCycle?.weight,
          fundingCycleMetadata?.reservedRate.toNumber(),
          parseEther('1'),
          'payer',
        ) ?? '',
      ),
    )

    return (
      <span>
        <Trans>
          {payerRate} {tokenSymbolPlural}/ETH
        </Trans>
      </span>
    )
  }

  const reservedRate = formattedNum(
    formatIssuanceRate(
      weightAmountPermyriad(
        fundingCycle?.weight,
        fundingCycleMetadata?.reservedRate.toNumber(),
        parseEther('1'),
        'reserved',
      ) ?? '',
    ),
  )

  return (
    <>
      <FundingCycleListItem
        name={t`Discount rate`}
        value={`${formatDiscountRate(fundingCycle.discountRate)}%`}
        helperText={DISCOUNT_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Redemption rate`}
        value={`${formatRedemptionRate(fundingCycleMetadata?.redemptionRate)}%`}
        helperText={REDEMPTION_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Mint rate`}
        value={
          <Trans>
            {formattedNum(formatIssuanceRate(fundingCycle?.weight.toString()))}{' '}
            tokens/ETH
          </Trans>
        }
        helperText={MINT_RATE_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Reserved rate`}
        value={
          <FundingCycleDetailWarning
            showWarning={unsafeFundingCycleProperties.metadataReservedRate}
            tooltipTitle={riskWarningText.metadataReservedRate}
          >
            {formatReservedRate(fundingCycleMetadata?.reservedRate)}%
          </FundingCycleDetailWarning>
        }
        helperText={RESERVED_RATE_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Reserved tokens`}
        value={
          <span>
            {reservedRate} {tokenSymbolPlural}/ETH
          </span>
        }
        helperText={RESERVED_TOKENS_EXPLAINATION}
        subItem
      />
      <FundingCycleListItem
        name={t`Payment issuance rate`}
        value={<ContributorRateText />}
        helperText={CONTRIBUTOR_RATE_EXPLAINATION}
      />
    </>
  )
}
