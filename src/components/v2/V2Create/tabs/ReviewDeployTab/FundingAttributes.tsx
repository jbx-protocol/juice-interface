import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Statistic } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import TooltipLabel from 'components/shared/TooltipLabel'
import { formatWad } from 'utils/formatNumber'
import {
  formatDiscountRate,
  formatRedemptionRate,
  MAX_DISTRIBUTION_LIMIT,
} from 'utils/v2/math'

import FundingCycleDetailWarning from 'components/shared/Project/FundingCycleDetailWarning'
import { detailedTimeString } from 'utils/formatTime'
import {
  DISCOUNT_RATE_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
} from 'components/v2/V2Project/V2FundingCycleSection/settingExplanations'
import SplitList from 'components/v2/shared/SplitList'
import { Split } from 'models/v2/splits'

import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
import {
  FUNDING_CYCLE_WARNING_TEXT,
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
} from 'constants/fundingWarningText'
import { CurrencyName } from 'constants/currency'

export function DistributionLimitStatistic({
  distributionLimit,
  currencyName,
  showDetail,
}: {
  distributionLimit: BigNumber | undefined
  currencyName: CurrencyName
  showDetail?: boolean
}) {
  const hasDistributionLimit =
    distributionLimit && !distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Distribution limit`}
          tip={t`The maximum amount of funds allowed to be distributed from the project's treasury each funding cycle.`}
        />
      }
      valueRender={() =>
        hasDistributionLimit ? (
          distributionLimit.eq(0) ? (
            <span>
              {showDetail ? (
                <Trans>
                  Distribution limit is 0: All funds will be considered overflow
                  and can be redeemed by token holders.
                </Trans>
              ) : (
                <Trans>No limit (infinite)</Trans>
              )}
            </span>
          ) : (
            <span>
              <CurrencySymbol currency={currencyName} />
              {formatWad(distributionLimit)}{' '}
            </span>
          )
        ) : (
          <span>
            <Trans>
              Distribution limit is infinite.{' '}
              <p style={{ fontSize: '1rem' }}>
                The project will control how all funds are distributed, and none
                can be redeemed by token holders.
              </p>
            </Trans>
          </span>
        )
      }
    />
  )
}

export function DurationStatistic({
  duration,
  showWarning,
}: {
  duration: BigNumber | undefined
  showWarning?: boolean
}) {
  const formattedDuration = detailedTimeString({
    timeSeconds: duration?.toNumber(),
  })
  const hasDuration = duration?.gt(0)

  return (
    <Statistic
      title={t`Duration`}
      valueRender={() => (
        <FundingCycleDetailWarning
          showWarning={showWarning}
          tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().duration}
        >
          {hasDuration ? formattedDuration : t`Not set`}
        </FundingCycleDetailWarning>
      )}
    />
  )
}

export function ReservedTokensStatistic({
  formattedReservedRate,
}: {
  formattedReservedRate: number
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Reserved tokens`}
          tip={t`Percentage of newly minted tokens reserved for the project.`}
        />
      }
      value={formattedReservedRate}
      suffix={
        <FundingCycleDetailWarning
          showWarning={
            formattedReservedRate > RESERVED_RATE_WARNING_THRESHOLD_PERCENT
          }
          tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().metadataReservedRate}
        >
          %
        </FundingCycleDetailWarning>
      }
    />
  )
}

export function IssuanceRateStatistic({
  issuanceRate,
  isInitial,
}: {
  issuanceRate: string
  isInitial?: boolean
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={isInitial ? t`Initial issuance rate` : t`Issuance rate`}
          tip={t`Contributors will be rewarded this amount of your project's tokens per ETH contributed.`}
        />
      }
      value={t`${issuanceRate} tokens / ETH`}
    />
  )
}

export function DiscountRateStatistic({
  discountRate,
}: {
  discountRate: BigNumber
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Discount rate`}
          tip={DISCOUNT_RATE_EXPLANATION}
        />
      }
      value={formatDiscountRate(discountRate)}
      suffix="%"
    />
  )
}

export function RedemptionRateStatistic({
  redemptionRate,
}: {
  redemptionRate: BigNumber
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Redemption rate`}
          tip={REDEMPTION_RATE_EXPLANATION}
        />
      }
      value={formatRedemptionRate(redemptionRate)}
      suffix="%"
    />
  )
}

export function PausePayStatistic({ pausePay }: { pausePay: boolean }) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Payments paused`}
          tip={
            !pausePay
              ? t`Project is accepting payments this funding cycle.`
              : t`Project is not accepting payments this funding cycle.`
          }
        />
      }
      value={pausePay ? t`Yes` : t`No`}
    />
  )
}

export function AllowMintingStatistic({
  allowMinting,
}: {
  allowMinting: boolean
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Allow token minting`}
          tip={
            allowMinting
              ? t`Owner can mint tokens at any time.`
              : t`Owner is not allowed to mint tokens.`
          }
        />
      }
      valueRender={() => (
        <FundingCycleDetailWarning
          showWarning={allowMinting}
          tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().allowMinting}
        >
          {allowMinting ? t`Allowed` : t`Disabled`}
          {` `}
        </FundingCycleDetailWarning>
      )}
    />
  )
}

export function ReconfigurationStatistic({
  ballotAddress,
}: {
  ballotAddress: string
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Reconfiguration rules`}
          tip={t`How long before your next funding cycle must you reconfigure in order for changes to take effect.`}
        />
      }
      valueRender={() => {
        const ballot = getBallotStrategyByAddress(ballotAddress)
        return (
          <FundingCycleDetailWarning
            showWarning={
              !ballot.durationSeconds || ballot.durationSeconds === 0
            }
            tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().ballot}
          >
            <div>
              {ballot.name}{' '}
              <div style={{ fontSize: '0.7rem' }}>{ballot.address}</div>
            </div>
          </FundingCycleDetailWarning>
        )
      }}
    />
  )
}

export function DistributionSplitsStatistic({
  splits,
  currency,
  totalValue,
  projectOwnerAddress,
  showSplitValues,
  fundingCycleDuration,
}: {
  splits: Split[]
  currency: BigNumber | undefined
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showSplitValues: boolean
  fundingCycleDuration: BigNumber | undefined
}) {
  const formattedDuration = detailedTimeString({
    timeSeconds: fundingCycleDuration?.toNumber(),
    fullWords: true,
  })
  const hasDuration = fundingCycleDuration?.gt(0)

  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Payouts`}
          tip={
            <Trans>
              Available funds will be distributed according to the payouts below
              {hasDuration ? ` every ${formattedDuration}` : null}.
            </Trans>
          }
        />
      }
      valueRender={() => (
        <SplitList
          splits={splits}
          currency={currency}
          totalValue={totalValue}
          projectOwnerAddress={projectOwnerAddress}
          showSplitValues={showSplitValues}
        />
      )}
    />
  )
}

export function ReservedSplitsStatistic({
  splits,
  formattedReservedRate,
  projectOwnerAddress,
}: {
  splits: Split[]
  formattedReservedRate: number
  projectOwnerAddress: string | undefined
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Reserved token splits`}
          tip={t`How the ${formattedReservedRate}% of your project's reserved tokens will be split.`}
        />
      }
      valueRender={() => (
        <SplitList
          splits={splits}
          projectOwnerAddress={projectOwnerAddress}
          totalValue={undefined}
        />
      )}
    />
  )
}
