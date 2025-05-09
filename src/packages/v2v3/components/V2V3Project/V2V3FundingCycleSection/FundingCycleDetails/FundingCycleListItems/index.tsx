import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { FundingCycleListItem } from 'components/FundingCycleListItem'
import {
  DISTRIBUTION_LIMIT_EXPLANATION,
  RECONFIG_RULES_EXPLANATION,
} from 'components/strings'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import { getBallotStrategyByAddress } from 'packages/v2v3/utils/ballotStrategies'
import { V2V3CurrencyName } from 'packages/v2v3/utils/currency'
import { getUnsafeV2V3FundingCycleProperties } from 'packages/v2v3/utils/fundingCycle'
import { useContext } from 'react'
import { formatDate, formatDateToUTC } from 'utils/format/formatDate'
import { BallotStrategyValue } from '../RulesListItems/BallotStrategyValue'
import { DistributionLimitValue } from './DistributionLimitValue'
import { DurationValue } from './DurationValue'

export function FundingCycleListItems({
  fundingCycle,
  fundingCycleMetadata,
  distributionLimit,
  distributionLimitCurrency,
  showDiffs,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
  showDiffs?: boolean
}) {
  const {
    fundingCycle: oldFundingCycle,
    distributionLimit: oldDistributionLimit,
    distributionLimitCurrency: oldDistributionLimitCurrency,
  } = useContext(V2V3ProjectContext)

  const formattedStartTime = fundingCycle.start
    ? formatDate(fundingCycle.start.mul(1000).toNumber())
    : undefined

  // show start if `start` is later than now
  const showStart = fundingCycle.start
    ? fundingCycle.start.mul(1000).gt(BigNumber.from(Date.now()))
    : false

  const formattedEndTime = showStart
    ? formatDate(
        fundingCycle.start?.add(fundingCycle.duration).mul(1000).toNumber(),
      )
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
    (oldDistributionLimit && !distributionLimit?.eq(oldDistributionLimit)) ||
    (oldDistributionLimitCurrency &&
      !distributionLimitCurrency?.eq(oldDistributionLimitCurrency))

  const ballotStrategy = getBallotStrategyByAddress(fundingCycle.ballot)
  const oldBallotStrategy = oldFundingCycle
    ? getBallotStrategyByAddress(oldFundingCycle.ballot)
    : undefined

  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  const unsafeFundingCycleProperties = getUnsafeV2V3FundingCycleProperties(
    fundingCycle,
    fundingCycleMetadata,
  )
  const ballotWarningText = unsafeFundingCycleProperties.noBallot
    ? riskWarningText.noBallot
    : unsafeFundingCycleProperties.customBallot
    ? riskWarningText.customBallot
    : undefined

  const ballotHasDiff =
    oldFundingCycle && oldFundingCycle.ballot !== fundingCycle.ballot

  return (
    <>
      {showStart ? (
        <FundingCycleListItem
          name={t`Start`}
          value={
            <Tooltip
              title={formatDateToUTC(fundingCycle.start.mul(1000).toNumber())}
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
                fundingCycle.start
                  .add(fundingCycle.duration)
                  .mul(1000)
                  .toNumber(),
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
      <FundingCycleListItem
        name={t`Edit deadline`}
        value={
          <BallotStrategyValue
            ballotStrategy={ballotStrategy}
            warningText={ballotWarningText}
          />
        }
        oldValue={
          showDiffs && oldBallotStrategy && ballotHasDiff ? (
            <BallotStrategyValue
              ballotStrategy={oldBallotStrategy}
              warningText={undefined}
            />
          ) : undefined
        }
        helperText={RECONFIG_RULES_EXPLANATION}
      />
    </>
  )
}
