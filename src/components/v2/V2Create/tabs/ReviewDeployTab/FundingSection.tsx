import { t, Trans } from '@lingui/macro'
import { Col, Row, Space, Statistic } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { BigNumber } from '@ethersproject/bignumber'

import FundingCycleDetailWarning from 'components/shared/Project/FundingCycleDetailWarning'

import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { detailedTimeString } from 'utils/formatTime'
import { V2CurrencyName } from 'utils/v2/currency'
import {
  getDefaultFundAccessConstraint,
  getUnsafeV2FundingCycleProperties,
} from 'utils/v2/fundingCycle'
import {
  formatDiscountRate,
  formatRedemptionRate,
  formatReservedRate,
  MAX_DISTRIBUTION_LIMIT,
  weightedAmount,
} from 'utils/v2/math'
import SplitList from 'components/v2/shared/SplitList'
import { NetworkContext } from 'contexts/networkContext'
import TooltipLabel from 'components/shared/TooltipLabel'

import { V2FundingCycle } from 'models/v2/fundingCycle'
import { parseEther } from 'ethers/lib/utils'
import {
  DISCOUNT_RATE_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
} from 'components/v2/V2Project/V2FundingCycleSection/settingExplanations'

import { rowGutter } from '.'
import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
import {
  FUNDING_CYCLE_WARNING_TEXT,
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
} from 'constants/fundingWarningText'

export default function FundingSection() {
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
  const formattedDuration = detailedTimeString({
    timeSeconds: duration.toNumber(),
  })

  const initialIssuanceRate = formatWad(
    weightedAmount(
      fundingCycle?.weight,
      fundingCycleMetadata?.reservedRate.toNumber(),
      parseEther('1'),
      'payer',
    ),
    {
      precision: 0,
    },
  )
  const formattedReservedRate = parseFloat(
    formatReservedRate(fundingCycleMetadata?.reservedRate),
  )

  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()

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
        <Statistic
          title={
            <TooltipLabel
              label={t`Distribution limit`}
              tip={t`The maximum amount of funds allowed to be distributed from your treasury each funding cycle.`}
            />
          }
          valueRender={() =>
            hasDistributionLimit ? (
              distributionLimit.eq(0) ? (
                <span>
                  <Trans>
                    Distribution limit is 0: All funds will be considered
                    overflow and can be redeemed by token holders.
                  </Trans>
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
                  Distribution limit is infinite: The project will control how
                  all funds are distributed, and none can be redeemed by token
                  holders.
                </Trans>
              </span>
            )
          }
        />
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          <Col md={6} xs={24}>
            <Statistic
              title={t`Duration`}
              valueRender={() => (
                <FundingCycleDetailWarning
                  showWarning={unsafeFundingCycleProperties.duration}
                  tooltipTitle={riskWarningText.duration}
                >
                  {hasDuration ? formattedDuration : t`Not set`}
                </FundingCycleDetailWarning>
              )}
            />
          </Col>
          <Col md={6} xs={24}>
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
                    formattedReservedRate >
                    RESERVED_RATE_WARNING_THRESHOLD_PERCENT
                  }
                  tooltipTitle={riskWarningText.metadataReservedRate}
                >
                  %
                </FundingCycleDetailWarning>
              }
            />
          </Col>
          <Col md={7} xs={24}>
            <Statistic
              title={
                <TooltipLabel
                  label={t`Initial issuance rate`}
                  tip={t`Contributors will be rewarded this amount of your project's tokens per ETH contributed.`}
                />
              }
              value={t`${initialIssuanceRate} tokens / ETH`}
            />
          </Col>
          {fundingCycle && hasDuration && (
            <Col md={5} xs={24}>
              <Statistic
                title={
                  <TooltipLabel
                    label={t`Discount rate`}
                    tip={DISCOUNT_RATE_EXPLANATION}
                  />
                }
                value={formatDiscountRate(fundingCycle.discountRate)}
                suffix="%"
              />
            </Col>
          )}
        </Row>
        <Row gutter={rowGutter} style={{ width: '100%' }}>
          {fundingCycleMetadata && hasDistributionLimit && (
            <Col md={6} xs={24}>
              <Statistic
                title={
                  <TooltipLabel
                    label={t`Redemption rate`}
                    tip={REDEMPTION_RATE_EXPLANATION}
                  />
                }
                value={formatRedemptionRate(
                  fundingCycleMetadata.redemptionRate,
                )}
                suffix="%"
              />
            </Col>
          )}
          <Col md={6} xs={24}>
            <Statistic
              title={
                <TooltipLabel
                  label={t`Payments paused`}
                  tip={
                    !fundingCycleMetadata?.pausePay
                      ? t`Project is accepting payments this funding cycle.`
                      : t`Project is not accepting payments this funding cycle.`
                  }
                />
              }
              value={fundingCycleMetadata?.pausePay ? t`Yes` : t`No`}
            />
          </Col>
          <Col md={6} xs={24}>
            <Statistic
              title={
                <TooltipLabel
                  label={t`Allow token minting`}
                  tip={
                    fundingCycleMetadata?.allowMinting
                      ? t`Owner can mint tokens at any time.`
                      : t`Owner is not allowed to mint tokens.`
                  }
                />
              }
              valueRender={() => (
                <FundingCycleDetailWarning
                  showWarning={fundingCycleMetadata?.allowMinting}
                  tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().allowMinting}
                >
                  {fundingCycleMetadata?.allowMinting
                    ? t`Allowed`
                    : t`Disabled`}
                  {` `}
                </FundingCycleDetailWarning>
              )}
            />
          </Col>
          <Col md={6} xs={24}>
            {hasDuration && (
              <Statistic
                title={
                  <TooltipLabel
                    label={t`Reconfiguration rules`}
                    tip={t`How long before your next funding cycle must you reconfigure in order for changes to take effect.`}
                  />
                }
                valueRender={() => {
                  const ballot = getBallotStrategyByAddress(fundingCycle.ballot)
                  return (
                    <div>
                      {ballot.name}{' '}
                      <div style={{ fontSize: '0.7rem' }}>{ballot.address}</div>
                    </div>
                  )
                }}
              />
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
