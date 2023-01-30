import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Space } from 'antd'
import { parseEther } from 'ethers/lib/utils'
import { NftRewardTier } from 'models/nftRewardTier'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycle,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { formatDate } from 'utils/format/formatDate'

import { formattedNum } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { getDefaultFundAccessConstraint } from 'utils/v2v3/fundingCycle'
import {
  formatIssuanceRate,
  formatReservedRate,
  MAX_DISTRIBUTION_LIMIT,
  weightAmountPermyriad,
} from 'utils/v2v3/math'
import {
  AllowMintingStatistic,
  AllowSetTerminalsStatistic,
  DiscountRateStatistic,
  DistributionLimitStatistic,
  DistributionSplitsStatistic,
  DurationStatistic,
  InflationRateStatistic,
  IssuanceRateStatistic,
  PausePayStatistic,
  PauseTransfersStatistic,
  ReconfigurationStatistic,
  RedemptionRateStatistic,
  ReservedSplitsStatistic,
  ReservedTokensStatistic,
} from './FundingAttributes'
import NftSummarySection from './NftSummarySection'

const gutter = 20

export default function ReconfigurePreview({
  payoutSplits,
  reserveSplits,
  fundingCycleMetadata,
  fundingCycleData,
  fundAccessConstraints,
  nftRewards,
  projectOwnerAddress,
  mustStartAtOrAfter,
}: {
  payoutSplits: Split[]
  reserveSplits: Split[]
  fundingCycleMetadata: V2V3FundingCycleMetadata
  fundingCycleData: V2V3FundingCycleData
  fundAccessConstraints: V2V3FundAccessConstraint[]
  nftRewards?: NftRewardTier[]
  projectOwnerAddress?: string
  mustStartAtOrAfter?: string
}) {
  const fundingCycle: V2V3FundingCycle = {
    ...fundingCycleData,
    number: BigNumber.from(1),
    configuration: BigNumber.from(0),
    basedOn: BigNumber.from(0),
    start: mustStartAtOrAfter
      ? BigNumber.from(mustStartAtOrAfter)
      : BigNumber.from(Date.now()).div(1000),
    metadata: BigNumber.from(0),
  }

  const fundAccessConstraint = getDefaultFundAccessConstraint(
    fundAccessConstraints,
  )

  const currencyName = V2V3CurrencyName(
    fundAccessConstraint?.distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
  )

  const distributionLimit = fundAccessConstraint?.distributionLimit
  const hasDistributionLimit = Boolean(
    distributionLimit && !distributionLimit.gte(MAX_DISTRIBUTION_LIMIT),
  )

  const duration = fundingCycle.duration
  const hasDuration = duration?.gt(0)

  const issuanceRate =
    formattedNum(
      formatIssuanceRate(
        weightAmountPermyriad(
          fundingCycle?.weight,
          fundingCycleMetadata?.reservedRate.toNumber(),
          parseEther('1'),
          'payer',
        ),
      ),
    ) ?? '0'

  const reservedPercentage = parseFloat(
    formatReservedRate(fundingCycleMetadata?.reservedRate),
  )

  const secondRowColWidth = hasDuration && hasDistributionLimit ? 8 : 12

  const reservedRate =
    formattedNum(
      formatIssuanceRate(
        weightAmountPermyriad(
          fundingCycle?.weight,
          fundingCycleMetadata?.reservedRate.toNumber(),
          parseEther('1'),
          'reserved',
        ) ?? '',
      ),
    ) ?? '0'

  return (
    <Space direction="vertical" size="middle" className="w-full">
      <Row gutter={gutter}>
        <Col md={12} sm={12}>
          <DurationStatistic duration={fundingCycle.duration} />
          {!fundingCycle.start.eq(
            BigNumber.from(DEFAULT_MUST_START_AT_OR_AFTER),
          ) ? (
            <span>Starting at {formatDate(fundingCycle.start.mul(1000))}</span>
          ) : null}
        </Col>
        <Col md={12} sm={12}>
          <DistributionLimitStatistic
            distributionLimit={distributionLimit}
            currencyName={currencyName ?? 'ETH'}
          />
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col md={12} sm={12}>
          <InflationRateStatistic
            inflationRate={
              formattedNum(
                formatIssuanceRate(fundingCycle?.weight.toString()),
              ) ?? '0'
            }
          />
        </Col>
        <Col md={12} sm={12}>
          <IssuanceRateStatistic issuanceRate={issuanceRate} />
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col md={secondRowColWidth} sm={12}>
          <ReservedTokensStatistic
            reservedRate={reservedRate}
            reservedPercentage={reservedPercentage}
          />
        </Col>
        {hasDuration ? (
          <Col md={secondRowColWidth} sm={12}>
            <DiscountRateStatistic discountRate={fundingCycle.discountRate} />
          </Col>
        ) : null}
        {hasDistributionLimit ? (
          <Col md={secondRowColWidth} sm={12}>
            <RedemptionRateStatistic
              redemptionRate={fundingCycleMetadata.redemptionRate}
            />
          </Col>
        ) : null}
      </Row>
      <Row gutter={gutter}>
        <Col md={6}>
          <PausePayStatistic pausePay={fundingCycleMetadata.pausePay} />
        </Col>
        <Col md={6}>
          <AllowMintingStatistic
            allowMinting={fundingCycleMetadata.allowMinting}
          />
        </Col>
        <Col md={6}>
          <AllowSetTerminalsStatistic
            allowSetTerminals={fundingCycleMetadata.global.allowSetTerminals}
          />
        </Col>
        <Col md={6}>
          <PauseTransfersStatistic
            pauseTransfers={fundingCycleMetadata.global.pauseTransfers ?? false}
          />
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col span={24}>
          <ReconfigurationStatistic ballotAddress={fundingCycle.ballot} />
        </Col>
      </Row>

      {!distributionLimit?.eq(0) && (
        <DistributionSplitsStatistic
          splits={payoutSplits}
          currency={fundAccessConstraint?.distributionLimitCurrency}
          totalValue={distributionLimit}
          showAmounts={hasDistributionLimit}
          projectOwnerAddress={projectOwnerAddress}
          fundingCycleDuration={duration}
        />
      )}
      {fundingCycleMetadata?.reservedRate.gt(0) && (
        <ReservedSplitsStatistic
          splits={reserveSplits}
          reservedPercentage={reservedPercentage}
          projectOwnerAddress={projectOwnerAddress}
        />
      )}
      {nftRewards ? <NftSummarySection /> : null}
    </Space>
  )
}
