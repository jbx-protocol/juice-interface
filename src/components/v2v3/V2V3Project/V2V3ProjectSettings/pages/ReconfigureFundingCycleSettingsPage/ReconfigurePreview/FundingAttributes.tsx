import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Statistic } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import CurrencySymbol from 'components/CurrencySymbol'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2v3/shared/SplitList'
import {
  CONTRIBUTOR_RATE_EXPLAINATION,
  DISCOUNT_RATE_EXPLANATION,
  DISTRIBUTION_LIMIT_EXPLANATION,
  MINT_RATE_EXPLANATION,
  RECONFIG_RULES_EXPLAINATION,
  REDEMPTION_RATE_EXPLANATION,
  RESERVED_TOKENS_EXPLAINATION,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { CurrencyName } from 'constants/currency'
import {
  FUNDING_CYCLE_WARNING_TEXT,
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
} from 'constants/fundingWarningText'
import { Split } from 'models/splits'
import { formatWad } from 'utils/format/formatNumber'
import { detailedTimeString } from 'utils/format/formatTime'
import {
  formatAllowed,
  formatBoolean,
  formatPaused,
} from 'utils/format/formatBoolean'
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
        <TooltipLabel label={t`Payouts`} tip={DISTRIBUTION_LIMIT_EXPLANATION} />
      }
      valueRender={() =>
        hasDistributionLimit ? (
          distributionLimit.eq(0) ? (
            <span>
              {showDetail ? (
                <Trans>
                  No payouts: All funds will be available for token redeeming.
                </Trans>
              ) : (
                <Trans>Zero</Trans>
              )}
            </span>
          ) : (
            <span>
              {currencyName === 'ETH' ? (
                <ETHAmount amount={distributionLimit} />
              ) : (
                <>
                  <CurrencySymbol currency={currencyName} />
                  {formatWad(distributionLimit)}
                </>
              )}
            </span>
          )
        ) : (
          <span>
            {showDetail ? (
              <Trans>
                Unlimited payouts.{' '}
                <p className="text-base">
                  The project will control how all funds are distributed. Token
                  holders cannot redeem their tokens for ETH.
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
          tip={RESERVED_TOKENS_EXPLAINATION}
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
}: {
  issuanceRate: string
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Payment issuance rate`}
          tip={CONTRIBUTOR_RATE_EXPLAINATION}
        />
      }
      value={t`${issuanceRate} tokens / ETH`}
    />
  )
}

export function InflationRateStatistic({
  inflationRate,
}: {
  inflationRate: string
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Token Issuance Rate`}
          tip={MINT_RATE_EXPLANATION}
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
          label={t`Issuance reduction rate`}
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
              ? t`Project is accepting payments this cycle.`
              : t`Project is not accepting payments this cycle.`
          }
        />
      }
      value={formatBoolean(pausePay)}
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
          label={t`Owner token minting`}
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
          {formatAllowed(allowMinting)}
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
          label={t`Payment Terminal configuration`}
          tip={
            allowSetTerminals
              ? t`Owner can set the project's Payment Terminals.`
              : t`Owner isn't allowed to set the project's Payment Terminals.`
          }
        />
      }
      valueRender={() => formatAllowed(allowSetTerminals)}
    />
  )
}

export function AllowSetControllerStatistic({
  allowSetController,
}: {
  allowSetController: boolean
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Controller configuration`}
          tip={
            allowSetController
              ? t`Owner can change the project's Controller.`
              : t`Owner isn't allowed to change the project's Controller.`
          }
        />
      }
      valueRender={() => formatAllowed(allowSetController)}
    />
  )
}

export function AllowTerminalMigrationStatistic({
  allowTerminalMigration,
}: {
  allowTerminalMigration: boolean
}) {
  return (
    <Statistic
      title={t`Payment Terminal migration`}
      valueRender={() => formatAllowed(allowTerminalMigration)}
    />
  )
}

export function AllowControllerMigrationStatistic({
  allowControllerMigration,
}: {
  allowControllerMigration: boolean
}) {
  return (
    <Statistic
      title={t`Controller migration`}
      valueRender={() => formatAllowed(allowControllerMigration)}
    />
  )
}

export function PauseTransfersStatistic({
  pauseTransfers,
}: {
  pauseTransfers: boolean
}) {
  return (
    <Statistic
      title={
        <TooltipLabel
          label={t`Project token transfers`}
          tip={t`Project token transfers are ${
            pauseTransfers ? 'paused' : 'unpaused'
          }. This does not apply to ERC-20 tokens if issued.`}
        />
      }
      valueRender={() => formatPaused(pauseTransfers)}
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
          label={t`Edit deadline`}
          tip={RECONFIG_RULES_EXPLAINATION}
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
  showAmounts,
  fundingCycleDuration,
}: {
  splits: Split[]
  currency: BigNumber | undefined
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showAmounts: boolean
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
              ETH can be paid out from the project according to the list below
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
            showAmounts={showAmounts}
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
          label={t`Reserved token recipients`}
          tip={t`Where the ${reservedPercentage}% of your project's tokens which are being reserved will be sent.`}
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
