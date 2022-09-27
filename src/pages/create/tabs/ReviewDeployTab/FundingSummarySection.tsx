import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'

import {
  useAppSelector,
  useEditingV2FundingCycleMetadataSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
} from 'hooks/AppSelector'
import { useWallet } from 'hooks/Wallet'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { formattedNum } from 'utils/format/formatNumber'
import { V2CurrencyName } from 'utils/v2v3/currency'
import {
  getDefaultFundAccessConstraint,
  getUnsafeV2V3FundingCycleProperties,
} from 'utils/v2v3/fundingCycle'
import {
  formatIssuanceRate,
  formatReservedRate,
  MAX_DISTRIBUTION_LIMIT,
  weightedAmount,
} from 'utils/v2v3/math'

import Callout from 'components/Callout'
import { V2V3FundingCycle } from 'models/v2/fundingCycle'

import { rowGutter } from '.'

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
} from './FundingAttributes'

export default function FundingSummarySection() {
  const { payoutGroupedSplits, reservedTokensGroupedSplits } = useAppSelector(
    state => state.editingV2Project,
  )

  const { userAddress } = useWallet()

  const fundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2V3FundAccessConstraintsSelector()

  const fundingCycle: V2V3FundingCycle = {
    ...fundingCycleData,
    number: BigNumber.from(1),
    configuration: BigNumber.from(0),
    basedOn: BigNumber.from(0),
    start: BigNumber.from(Date.now()).div(1000),
    metadata: BigNumber.from(0),
  }

  const fundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()

  const fundAccessConstraint = getDefaultFundAccessConstraint(
    fundAccessConstraints,
  )

  const currencyName = V2CurrencyName(
    fundAccessConstraint?.distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
  )

  const distributionLimit =
    fundAccessConstraint?.distributionLimit ?? BigNumber.from(0)
  const hasDistributionLimit = Boolean(
    distributionLimit && !distributionLimit.gte(MAX_DISTRIBUTION_LIMIT),
  )

  const unsafeFundingCycleProperties = getUnsafeV2V3FundingCycleProperties(
    fundingCycle,
    fundingCycleMetadata,
  )

  const duration = fundingCycle.duration
  const hasDuration = duration?.gt(0)

  const initialIssuanceRate =
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
    <div>
      <h2>
        <Trans>Funding cycle details</Trans>
      </h2>
      <Callout style={{ marginBottom: 15 }}>
        {hasDuration ? (
          <Trans>
            Once launched, your first funding cycle{' '}
            <strong>can't be changed</strong>. You can reconfigure upcoming
            funding cycles according to the project's{' '}
            <strong>reconfiguration rules</strong>.
          </Trans>
        ) : (
          <Trans>
            Since you have not set a funding duration, changes to these settings
            will be applied immediately.
          </Trans>
        )}
      </Callout>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <DistributionLimitStatistic
          distributionLimit={distributionLimit}
          currencyName={currencyName ?? 'ETH'}
          showDetail
        />
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          <Col md={8} xs={24}>
            <DurationStatistic
              showWarning={unsafeFundingCycleProperties.duration}
              duration={duration}
            />
          </Col>
          <Col md={8} xs={24}>
            <InflationRateStatistic
              isInitial
              inflationRate={
                formattedNum(
                  formatIssuanceRate(fundingCycle?.weight.toString()),
                ) ?? '0'
              }
            />
          </Col>
          <Col md={8} xs={24}>
            <IssuanceRateStatistic
              issuanceRate={initialIssuanceRate}
              isInitial
            />
          </Col>
        </Row>
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          <Col md={8} xs={24}>
            <ReservedTokensStatistic
              reservedRate={reservedRate}
              reservedPercentage={reservedPercentage}
            />
          </Col>
          {fundingCycle && hasDuration && (
            <Col md={8} xs={24}>
              <DiscountRateStatistic discountRate={fundingCycle.discountRate} />
            </Col>
          )}
          {fundingCycleMetadata && hasDistributionLimit && (
            <Col md={8} xs={24}>
              <RedemptionRateStatistic
                redemptionRate={fundingCycleMetadata.redemptionRate}
              />
            </Col>
          )}
          <Col md={8} xs={24}>
            <PausePayStatistic pausePay={fundingCycleMetadata?.pausePay} />
          </Col>
          <Col md={8} xs={24}>
            <AllowMintingStatistic
              allowMinting={fundingCycleMetadata?.allowMinting}
            />
          </Col>
          <Col md={8} xs={24}>
            <AllowSetTerminalsStatistic
              allowSetTerminals={fundingCycleMetadata.global.allowSetTerminals}
            />
          </Col>
          <Col md={8} xs={24}>
            <ReconfigurationStatistic ballotAddress={fundingCycle.ballot} />
          </Col>
        </Row>
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          {!distributionLimit?.eq(0) && (
            <>
              <Col md={10} xs={24}>
                <DistributionSplitsStatistic
                  splits={payoutGroupedSplits.splits}
                  currency={fundAccessConstraint?.distributionLimitCurrency}
                  totalValue={distributionLimit}
                  projectOwnerAddress={userAddress}
                  showSplitValues={hasDistributionLimit}
                  fundingCycleDuration={duration}
                />
              </Col>
              <Col md={2} xs={0}></Col>
            </>
          )}
          {fundingCycleMetadata?.reservedRate.gt(0) && (
            <Col md={10} xs={24}>
              <ReservedSplitsStatistic
                splits={reservedTokensGroupedSplits.splits}
                reservedPercentage={reservedPercentage}
                projectOwnerAddress={userAddress}
              />
            </Col>
          )}
        </Row>
      </Space>
    </div>
  )
}
