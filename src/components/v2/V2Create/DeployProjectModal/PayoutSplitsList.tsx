import CurrencySymbol from 'components/shared/CurrencySymbol'
import Mod from 'components/shared/Mod'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { Split } from 'models/v2/splits'
import { formatWad, permyriadToPercent, parseWad } from 'utils/formatNumber'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'
import { hasFundingTarget } from 'utils/v2/fundingCycle'
import { toMod } from 'utils/v2/splits'

import { V2CurrencyName, V2_CURRENCY_ETH } from 'utils/v2/currency'

function SplitItem({
  split,
  key,
  fundAccessConstraint,
  distributionCurrency,
}: {
  split: Split
  key: string
  fundAccessConstraint?: SerializedV2FundAccessConstraint
  distributionCurrency: V2CurrencyOption
}) {
  const mod = toMod(split)
  const modValue = (
    <span style={{ fontWeight: 400 }}>
      {permyriadToPercent(split.percent)}%
      {hasFundingTarget(fundAccessConstraint) && (
        <>
          {' '}
          (
          <CurrencySymbol currency={V2CurrencyName(distributionCurrency)} />
          {formatWad(
            parseWad(fundAccessConstraint?.distributionLimit)
              ?.mul(split.percent)
              .div(10000),
            {
              precision: distributionCurrency === V2_CURRENCY_ETH ? 4 : 0,
              padEnd: true,
            },
          )}
          )
        </>
      )}
    </span>
  )

  return (
    <div style={{ marginBottom: 5 }} key={key}>
      <Mod mod={mod} value={modValue} />
    </div>
  )
}

// Lists payouts splits for a project (no edit functionality)
export default function PayoutSplitsList({
  splits,
  fundAccessConstraint,
}: {
  splits: Split[] | undefined
  fundAccessConstraint?: SerializedV2FundAccessConstraint
}) {
  const distributionCurrency = parseInt(
    fundAccessConstraint?.distributionLimitCurrency ?? `${V2_CURRENCY_ETH}`,
  ) as V2CurrencyOption

  if (!splits?.length) return null

  return (
    <div>
      {splits
        .sort((a, b) => (a.percent < b.percent ? 1 : -1))
        .map((split, idx) => (
          <SplitItem
            split={split}
            key={`${split.beneficiary ?? split.percent}-${idx}`}
            distributionCurrency={distributionCurrency}
            fundAccessConstraint={fundAccessConstraint}
          />
        ))}
    </div>
  )
}
