import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3FundingCycle } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { formatDate, formatDateToUTC } from 'utils/format/formatDate'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { DISTRIBUTION_LIMIT_EXPLANATION } from '../../settingExplanations'
import { FundingCycleListItem } from '../FundingCycleListItem'
import { DistributionLimitValue } from './DistributionLimitValue'
import { DurationValue } from './DurationValue'

export function FundingCycleListItems({
  fundingCycle,
  distributionLimit,
  distributionLimitCurrency,
  showDiffs,
}: {
  fundingCycle: V2V3FundingCycle
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
  showDiffs?: boolean
}) {
  const {
    fundingCycle: oldFundingCycle,
    distributionLimit: oldDistributionLimit,
    distributionLimitCurrency: oldDistributionLimitCurrency,
  } = useContext(V2V3ProjectContext)

  // Required for reconfigure review
  const wouldStartImmediately =
    !oldFundingCycle || oldFundingCycle.duration.eq(0)

  const formattedStartTime = wouldStartImmediately
    ? t`Immediately`
    : fundingCycle.start
    ? formatDate(fundingCycle.start.mul(1000))
    : undefined

  // show start if `start` is later than now
  const showStart = fundingCycle.start
    ? fundingCycle.start.mul(1000).gt(BigNumber.from(Date.now()))
    : false

  const formattedEndTime = showStart
    ? formatDate(fundingCycle.start?.add(fundingCycle.duration).mul(1000))
    : undefined

  const currency = V2V3CurrencyName(
    distributionLimitCurrency?.toNumber() as V2V3CurrencyOption | undefined,
  )
  const oldCurrency = showDiffs
    ? V2V3CurrencyName(
        oldDistributionLimitCurrency?.toNumber() as
          | V2V3CurrencyOption
          | undefined,
      )
    : undefined

  const durationHasDiff =
    oldFundingCycle && !fundingCycle.duration.eq(oldFundingCycle.duration)
  const distributionLimitHasDiff =
    oldDistributionLimit &&
    !distributionLimit?.eq(oldDistributionLimit) &&
    oldDistributionLimitCurrency &&
    !distributionLimitCurrency?.eq(oldDistributionLimitCurrency)

  return (
    <>
      {showStart ? (
        <FundingCycleListItem
          name={t`Start`}
          value={
            <Tooltip
              title={
                wouldStartImmediately
                  ? undefined
                  : formatDateToUTC(fundingCycle.start.mul(1000))
              }
            >
              {formattedStartTime}
            </Tooltip>
          }
        />
      ) : null}
      {fundingCycle.duration.gt(0) && formattedEndTime ? (
        <FundingCycleListItem
          name={t`End`}
          value={
            <Tooltip
              title={formatDateToUTC(
                fundingCycle.start.add(fundingCycle.duration).mul(1000),
              )}
            >
              {formattedEndTime}
            </Tooltip>
          }
        />
      ) : null}
      <FundingCycleListItem
        name={t`Duration`}
        value={<DurationValue duration={fundingCycle.duration} />}
        oldValue={
          showDiffs && durationHasDiff ? (
            <DurationValue duration={oldFundingCycle?.duration} />
          ) : undefined
        }
      />
      {distributionLimit && (
        <FundingCycleListItem
          name={t`Payouts`}
          value={
            <DistributionLimitValue
              distributionLimit={distributionLimit}
              currency={currency}
            />
          }
          oldValue={
            showDiffs && distributionLimitHasDiff ? (
              <DistributionLimitValue
                distributionLimit={oldDistributionLimit}
                currency={oldCurrency}
              />
            ) : undefined
          }
          helperText={DISTRIBUTION_LIMIT_EXPLANATION}
        />
      )}
    </>
  )
}
