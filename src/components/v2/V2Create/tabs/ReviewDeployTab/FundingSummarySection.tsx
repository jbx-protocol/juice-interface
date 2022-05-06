import { t, Trans } from '@lingui/macro'
import { Col, Row, Space, Statistic } from 'antd'
import { BigNumber } from '@ethersproject/bignumber'

import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { V2CurrencyName } from 'utils/v2/currency'
import {
  getDefaultFundAccessConstraint,
  getUnsafeV2FundingCycleProperties,
} from 'utils/v2/fundingCycle'
import {
  formatReservedRate,
  MAX_DISTRIBUTION_LIMIT,
  weightedAmount,
} from 'utils/v2/math'
import SplitList from 'components/v2/shared/SplitList'
import { NetworkContext } from 'contexts/networkContext'
import TooltipLabel from 'components/shared/TooltipLabel'

import { V2FundingCycle } from 'models/v2/fundingCycle'
import { parseEther } from 'ethers/lib/utils'

import { rowGutter } from '.'

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
} from './FundingAttributes'

export default function FundingSummarySection() {
  const { payoutGroupedSplits, reservedTokensGroupedSplits } = useAppSelector(
    state => state.editingV2Project,
  )

  const { userAddress } = useContext(NetworkContext)

  const fundingCycleData = useEditingV2FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2FundAccessConstraintsSelector()

  const fundingCycle: V2FundingCycle = {
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
    fundAccessConstraint?.distributionLimitCurrency.toNumber() as V2CurrencyOption,
  )

  const distributionLimit = fundAccessConstraint?.distributionLimit
  const hasDistributionLimit =
    distributionLimit && !distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)

  const unsafeFundingCycleProperties =
    getUnsafeV2FundingCycleProperties(fundingCycle)

  const duration = fundingCycle.duration
  const hasDuration = duration && duration.gt(0)

  const initialIssuanceRate =
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

  return (
    <div style={{ marginTop: 20 }}>
      <h2 style={{ marginBottom: 0 }}>
        <Trans>Funding cycle details</Trans>
      </h2>
      <p style={{ marginBottom: 15 }}>
        {hasDuration ? (
          <Trans>
            These settings will <strong>not</strong> be editable immediately
            within a funding cycle. They can only be changed for{' '}
            <strong>upcoming</strong> funding cycles according to your{' '}
            <strong>reconfiguration rules</strong>.
          </Trans>
        ) : (
          <Trans>
            Since you have not set a funding duration, changes to these settings
            will be applied immediately.
          </Trans>
        )}
      </p>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <DistributionLimitStatistic
          distributionLimit={distributionLimit}
          currencyName={currencyName ?? 'ETH'}
          showDetail
        />
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          <Col md={6} xs={24}>
            <DurationStatistic
              showWarning={unsafeFundingCycleProperties.duration}
              duration={duration}
            />
          </Col>
          <Col md={6} xs={24}>
            <ReservedTokensStatistic
              formattedReservedRate={formattedReservedRate}
            />
          </Col>
          <Col md={7} xs={24}>
            <IssuanceRateStatistic
              issuanceRate={initialIssuanceRate}
              isInitial
            />
          </Col>
          {fundingCycle && hasDuration && (
            <Col md={5} xs={24}>
              <DiscountRateStatistic discountRate={fundingCycle.discountRate} />
            </Col>
          )}
        </Row>
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          {fundingCycleMetadata && hasDistributionLimit && (
            <Col md={6} xs={24}>
              <RedemptionRateStatistic
                redemptionRate={fundingCycleMetadata.redemptionRate}
              />
            </Col>
          )}
          <Col md={6} xs={24}>
            <PausePayStatistic pausePay={fundingCycleMetadata?.pausePay} />
          </Col>
          <Col md={6} xs={24}>
            <AllowMintingStatistic
              allowMinting={fundingCycleMetadata?.allowMinting}
            />
          </Col>
          <Col md={6} xs={24}>
            {hasDuration && (
              <ReconfigurationStatistic ballotAddress={fundingCycle.ballot} />
            )}
          </Col>
        </Row>
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          {!distributionLimit?.eq(0) && (
            <>
              <Col md={10} xs={24}>
                <Statistic
                  title={
                    <TooltipLabel
                      label={t`Distribution splits`}
                      tip={t`Entities you will distribute to from your treasury each funding cycle.`}
                    />
                  }
                  valueRender={() => (
                    <SplitList
                      splits={payoutGroupedSplits.splits}
                      currency={fundAccessConstraint?.distributionLimitCurrency}
                      totalValue={distributionLimit}
                      projectOwnerAddress={userAddress}
                      showSplitValues={hasDistributionLimit}
                    />
                  )}
                />
              </Col>
              <Col md={2} xs={0}></Col>
            </>
          )}
          {fundingCycleMetadata?.reservedRate.gt(0) && (
            <Col md={10} xs={24}>
              <Statistic
                title={
                  <TooltipLabel
                    label={t`Reserved token splits`}
                    tip={t`How you will split your ${formattedReservedRate}% of reserved tokens.`}
                  />
                }
                valueRender={() => (
                  <SplitList
                    splits={reservedTokensGroupedSplits.splits}
                    projectOwnerAddress={userAddress}
                    totalValue={undefined}
                  />
                )}
              />
            </Col>
          )}
        </Row>
      </Space>
    </div>
  )
}
