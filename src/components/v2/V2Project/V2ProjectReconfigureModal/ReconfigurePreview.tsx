import { t } from '@lingui/macro'
import { Col, Row, Statistic } from 'antd'
import {
  AllowMintingStatistic,
  DiscountRateStatistic,
  DistributionLimitStatistic,
  DurationStatistic,
  IssuanceRateStatistic,
  PausePayStatistic,
  ReconfigurationStatistic,
  RedemptionRateStatistic,
  ReservedTokensStatistic,
} from 'components/v2/V2Create/tabs/ReviewDeployTab/FundingAttributes'
import {
  V2FundAccessConstraint,
  V2FundingCycle,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { NetworkContext } from 'contexts/networkContext'
import { getDefaultFundAccessConstraint } from 'utils/v2/fundingCycle'
import { V2CurrencyName } from 'utils/v2/currency'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import {
  formatReservedRate,
  MAX_DISTRIBUTION_LIMIT,
  weightedAmount,
} from 'utils/v2/math'
import { formatWad } from 'utils/formatNumber'
import { parseEther } from 'ethers/lib/utils'
import TooltipLabel from 'components/shared/TooltipLabel'
import SplitList from 'components/v2/shared/SplitList'
import { Split } from 'models/v2/splits'

export default function ReconfigurePreview({
  payoutSplits,
  reserveSplits,
  fundingCycleMetadata,
  fundingCycleData,
  fundAccessConstraints,
}: {
  payoutSplits: Split[]
  reserveSplits: Split[]
  fundingCycleMetadata: V2FundingCycleMetadata
  fundingCycleData: V2FundingCycleData
  fundAccessConstraints: V2FundAccessConstraint[]
}) {
  const { userAddress } = useContext(NetworkContext)

  const fundingCycle: V2FundingCycle = {
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

  const currencyName = V2CurrencyName(
    fundAccessConstraint?.distributionLimitCurrency.toNumber() as V2CurrencyOption,
  )

  const distributionLimit = fundAccessConstraint?.distributionLimit
  const hasDistributionLimit =
    distributionLimit && !distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)

  const duration = fundingCycle.duration
  const hasDuration = duration && duration.gt(0)

  const issuanceRate =
    formatWad(
      weightedAmount(
        fundingCycle?.weight,
        fundingCycleMetadata?.reservedRate.toNumber(),
        parseEther('1'),
        'payer',
      ),
      {
        precision: 0,
      },
    ) ?? ''

  const formattedReservedRate = parseFloat(
    formatReservedRate(fundingCycleMetadata?.reservedRate),
  )

  const gutter = 20
  const rowMargin = 20

  return (
    <div style={{ padding: '0 0px' }}>
      <Row gutter={gutter} style={{ marginBottom: rowMargin }}>
        <Col span={8}>
          <DurationStatistic duration={fundingCycle.duration} />
        </Col>
        <Col span={8}>
          <DistributionLimitStatistic
            distributionLimit={distributionLimit}
            currencyName={currencyName ?? 'ETH'}
          />
        </Col>
        <Col span={8}>
          <ReservedTokensStatistic
            formattedReservedRate={formattedReservedRate}
          />
        </Col>
      </Row>
      <Row gutter={gutter} style={{ marginBottom: rowMargin }}>
        <Col span={8}>
          <IssuanceRateStatistic issuanceRate={issuanceRate} />
        </Col>
        {hasDuration ? (
          <Col span={8}>
            <DiscountRateStatistic discountRate={fundingCycle.discountRate} />
          </Col>
        ) : null}
        {hasDistributionLimit ? (
          <Col span={8}>
            <RedemptionRateStatistic
              redemptionRate={fundingCycleMetadata.redemptionRate}
            />
          </Col>
        ) : null}
      </Row>
      <Row gutter={gutter} style={{ marginBottom: rowMargin }}>
        <Col span={8}>
          <PausePayStatistic pausePay={fundingCycleMetadata.pausePay} />
        </Col>
        <Col span={8}>
          <AllowMintingStatistic
            allowMinting={fundingCycleMetadata.allowMinting}
          />
        </Col>
      </Row>
      <Row gutter={gutter} style={{ marginBottom: rowMargin }}>
        {hasDuration ? (
          <Col span={24}>
            <ReconfigurationStatistic ballotAddress={fundingCycle.ballot} />
          </Col>
        ) : null}
      </Row>

      {!distributionLimit?.eq(0) && (
        <Statistic
          title={
            <TooltipLabel
              label={t`Distribution splits`}
              tip={t`Entities you will distribute to from your treasury each funding cycle.`}
            />
          }
          valueRender={() => (
            <SplitList
              splits={payoutSplits}
              currency={fundAccessConstraint?.distributionLimitCurrency}
              totalValue={distributionLimit}
              projectOwnerAddress={userAddress}
              showSplitValues={hasDistributionLimit}
            />
          )}
        />
      )}
      {fundingCycleMetadata?.reservedRate.gt(0) && (
        <Statistic
          title={
            <TooltipLabel
              label={t`Reserved token splits`}
              tip={t`How you will split your ${formattedReservedRate}% of reserved tokens.`}
            />
          }
          valueRender={() => (
            <SplitList
              splits={reserveSplits}
              projectOwnerAddress={userAddress}
              totalValue={undefined}
            />
          )}
        />
      )}
    </div>
  )
}
