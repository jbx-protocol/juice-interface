import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Statistic } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2v3/shared/SplitList'
import {
  DISCOUNT_RATE_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { CurrencyName } from 'constants/currency'
import {
  FUNDING_CYCLE_WARNING_TEXT,
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
} from 'constants/fundingWarningText'
import { Split } from 'models/splits'
import { formatWad } from 'utils/format/formatNumber'
import { detailedTimeString } from 'utils/format/formatTime'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import {
  formatDiscountRate,
  formatRedemptionRate,
  MAX_DISTRIBUTION_LIMIT,
} from 'utils/v2v3/math'

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
                <Trans>Zero</Trans>
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
            {showDetail ? (
              <Trans>
                Distribution limit is infinite.{' '}
                <p className="text-base">
                  The project will control how all funds are distributed. Token
                  holders cannot redeem any funds raised.
                </p>
              </Trans>
            ) : (
              <Trans>Infinite (no limit)</Trans>
            )}
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
  reservedRate,
  reservedPercentage,
}: {
  reservedRate: string
  reservedPercentage: number
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Reserved tokens`}
          tip={
            <Trans>
              Amount of newly minted project tokens{' '}
              <strong>reserved for the project</strong> when 1 ETH is
              contributed. Reserve tokens are reserved for the project owner by
              default, but can also be allocated to other wallet addresses by
              the owner.
            </Trans>
          }
        />
      }
      value={`${reservedRate} (${reservedPercentage}`}
      suffix={
        <FundingCycleDetailWarning
          showWarning={
            reservedPercentage > RESERVED_RATE_WARNING_THRESHOLD_PERCENT
          }
          tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().metadataReservedRate}
        >
          %)
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
          label={isInitial ? t`Initial issuance rate` : t`Contributor rate`}
          tip={t`Contributors will be rewarded this amount of your project's tokens per ETH contributed.`}
        />
      }
      value={t`${issuanceRate} tokens / ETH`}
    />
  )
}

export function InflationRateStatistic({
  inflationRate,
  isInitial,
}: {
  inflationRate: string
  isInitial?: boolean
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={isInitial ? t`Initial mint rate` : t`Mint rate`}
          tip={
            <Trans>
              <strong>Total project tokens minted</strong> when 1 ETH is
              contributed. This can change over time according to the discount
              rate and reserved tokens amount of future funding cycles.
            </Trans>
          }
        />
      }
      value={t`${inflationRate} tokens / ETH`}
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

export function AllowSetTerminalsStatistic({
  allowSetTerminals,
}: {
  allowSetTerminals: boolean
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Allow terminal configuration`}
          tip={
            allowSetTerminals
              ? t`Owner can set the project's payment terminals.`
              : t`Owner isn't allowed to set the project's payment terminals.`
          }
        />
      }
      valueRender={() => (allowSetTerminals ? t`Allowed` : t`Disabled`)}
    />
  )
}

export function ReconfigurationStatistic({
  ballotAddress,
}: {
  ballotAddress: string
}) {
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  const ballot = getBallotStrategyByAddress(ballotAddress)

  const noBallot = ballot.durationSeconds === 0
  const customBallot = ballot.unknown

  const ballotWarningText = customBallot
    ? riskWarningText.customBallot
    : riskWarningText.noBallot

  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Reconfiguration strategy`}
          tip={t`How long before your next funding cycle must you reconfigure in order for changes to take effect.`}
        />
      }
      valueRender={() => {
        return (
          <FundingCycleDetailWarning
            showWarning={noBallot || customBallot}
            tooltipTitle={ballotWarningText}
          >
            <div>
              {ballot.name} <div className="text-xs">{ballot.address}</div>
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
              Available funds can be distributed according to the payouts below
              {hasDuration ? ` every ${formattedDuration}` : null}.
            </Trans>
          }
        />
      }
      valueRender={() => (
        <div className="text-sm">
          <SplitList
            splits={splits}
            currency={currency}
            totalValue={totalValue}
            projectOwnerAddress={projectOwnerAddress}
            showSplitValues={showSplitValues}
            valueFormatProps={{ precision: 2 }}
          />
        </div>
      )}
    />
  )
}

export function ReservedSplitsStatistic({
  splits,
  reservedPercentage,
  projectOwnerAddress,
}: {
  splits: Split[]
  reservedPercentage: number
  projectOwnerAddress: string | undefined
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Reserved token allocation`}
          tip={t`How the ${reservedPercentage}% of your project's reserved tokens will be split.`}
        />
      }
      valueRender={() => (
        <div className="text-sm">
          <SplitList
            splits={splits}
            projectOwnerAddress={projectOwnerAddress}
            totalValue={undefined}
          />
        </div>
      )}
    />
  )
}
