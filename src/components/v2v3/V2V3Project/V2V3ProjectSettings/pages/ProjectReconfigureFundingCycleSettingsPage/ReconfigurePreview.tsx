import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Space } from 'antd'
import { parseEther } from 'ethers/lib/utils'
import { useWallet } from 'hooks/Wallet'
import { Split } from 'models/splits'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycle,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'

import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
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
  ReconfigurationStatistic,
  RedemptionRateStatistic,
  ReservedSplitsStatistic,
  ReservedTokensStatistic,
} from 'pages/create/tabs/ReviewDeployTab/FundingAttributes'
import { formattedNum } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { getDefaultFundAccessConstraint } from 'utils/v2v3/fundingCycle'
import {
  formatIssuanceRate,
  formatReservedRate,
  MAX_DISTRIBUTION_LIMIT,
  weightedAmount,
} from 'utils/v2v3/math'

const gutter = 20

export default function ReconfigurePreview({
  payoutSplits,
  reserveSplits,
  fundingCycleMetadata,
  fundingCycleData,
  fundAccessConstraints,
}: {
  payoutSplits: Split[]
  reserveSplits: Split[]
  fundingCycleMetadata: V2V3FundingCycleMetadata
  fundingCycleData: V2V3FundingCycleData
  fundAccessConstraints: V2V3FundAccessConstraint[]
}) {
  const { userAddress } = useWallet()

  const fundingCycle: V2V3FundingCycle = {
    ...fundingCycleData,
    number: BigNumber.from(1),
    configuration: BigNumber.from(0),
    basedOn: BigNumber.from(0),
    start: BigNumber.from(Date.now()).div(1000),
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
        weightedAmount(
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
        weightedAmount(
          fundingCycle?.weight,
          fundingCycleMetadata?.reservedRate.toNumber(),
          parseEther('1'),
          'reserved',
        ) ?? '',
      ),
    ) ?? '0'

  return (
    <Space direction="vertical" size="middle">
      <Row gutter={gutter}>
        <Col md={12} sm={12}>
          <DurationStatistic duration={fundingCycle.duration} />
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
        <Col md={8}>
          <PausePayStatistic pausePay={fundingCycleMetadata.pausePay} />
        </Col>
        <Col md={8}>
          <AllowMintingStatistic
            allowMinting={fundingCycleMetadata.allowMinting}
          />
        </Col>
        <Col md={8}>
          <AllowSetTerminalsStatistic
            allowSetTerminals={fundingCycleMetadata.global.allowSetTerminals}
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
          projectOwnerAddress={userAddress}
          showSplitValues={hasDistributionLimit}
          fundingCycleDuration={duration}
        />
      )}
      {fundingCycleMetadata?.reservedRate.gt(0) && (
        <ReservedSplitsStatistic
          splits={reserveSplits}
          reservedPercentage={reservedPercentage}
          projectOwnerAddress={userAddress}
        />
      )}
    </Space>
  )
}
