import CurrencySymbol from 'components/shared/CurrencySymbol'
import Mod from 'components/shared/Mod'

import { V2CurrencyOption } from 'models/v2/currencyOption'
import { Split } from 'models/v2/splits'

import { formatWad, fromPermyriad, parseWad } from 'utils/formatNumber'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'
import { hasFundingTarget } from 'utils/fundingCycleV2'
import { toV1Currency } from 'utils/v1/currency'

import { V2_CURRENCY_ETH } from 'constants/v2/currency'

// Lists payouts splits for a project (no edit functionality)
export default function PayoutModsList({
  splits,
  fundAccessConstraint,
}: {
  splits: Split[] | undefined
  fundAccessConstraint?: SerializedV2FundAccessConstraint
}) {
  const distributionCurrency = parseInt(
    fundAccessConstraint?.distributionLimitCurrency ?? `${V2_CURRENCY_ETH}`,
  ) as V2CurrencyOption

  return (
    <div>
      {splits?.length
        ? [...splits]
            .sort((a, b) => (a.percent < b.percent ? 1 : -1))
            .map((mod, i) => (
              <div
                key={`${mod.beneficiary ?? mod.percent}-${i}`}
                style={{ marginBottom: 5 }}
              >
                <Mod
                  mod={mod}
                  value={
                    <span style={{ fontWeight: 400 }}>
                      {fromPermyriad(mod.percent)}%
                      {hasFundingTarget(fundAccessConstraint) && (
                        <>
                          {' '}
                          (
                          <CurrencySymbol
                            currency={toV1Currency(distributionCurrency)}
                          />
                          {formatWad(
                            parseWad(fundAccessConstraint?.distributionLimit)
                              ?.mul(mod.percent)
                              .div(10000),
                            {
                              precision:
                                distributionCurrency === V2_CURRENCY_ETH
                                  ? 4
                                  : 0,
                              padEnd: true,
                            },
                          )}
                          )
                        </>
                      )}
                    </span>
                  }
                />
              </div>
            ))
        : null}
    </div>
  )
}
