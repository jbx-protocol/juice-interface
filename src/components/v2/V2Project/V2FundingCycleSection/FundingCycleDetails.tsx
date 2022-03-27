import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { Descriptions } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { V2CurrencyName } from 'utils/v2/currency'
import { weightedAmount } from 'utils/math'
import TooltipLabel from 'components/shared/TooltipLabel'

import FundingCycleDetailWarning from 'components/shared/Project/FundingCycleDetailWarning'

import { getUnsafeV2FundingCycleProperties } from 'utils/v2/fundingCycle'

import { detailedTimeString } from 'utils/formatTime'

import {
  formatDiscountRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2/math'

import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/v2/fundingWarningText'

export default function FundingCycleDetails({
  fundingCycle,
}: {
  fundingCycle: V2FundingCycle | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { tokenSymbol, distributionLimit, distributionLimitCurrency } =
    useContext(V2ProjectContext)

  if (!fundingCycle) return null

  const formattedDuration = detailedTimeString(fundingCycle.duration.toNumber())
  const formattedStartTime = formatDate(fundingCycle.start.mul(1000))
  const formattedEndTime = formatDate(
    fundingCycle.start.add(fundingCycle.duration).mul(1000),
  )

  const metadata = decodeV2FundingCycleMetadata(fundingCycle.metadata)
  const fcReservedRate = metadata?.reservedRate

  const ballotStrategy = getBallotStrategyByAddress(fundingCycle.ballot)
  const unsafeFundingCycleProperties =
    getUnsafeV2FundingCycleProperties(fundingCycle)

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const ReservedRateText = () => {
    const payerRate = formatWad(
      weightedAmount(
        fundingCycle?.weight,
        fcReservedRate.toNumber(),
        parseEther('1'),
        'payer',
      ),
      {
        precision: 0,
      },
    )

    const reservedRate = formatWad(
      weightedAmount(
        fundingCycle?.weight,
        fcReservedRate.toNumber(),
        parseEther('1'),
        'reserved',
      ),
      {
        precision: 0,
      },
    )

    const withReservedRate = (
      <Trans>
        {payerRate} (+ {reservedRate} reserved) {tokenSymbolPlural}/ETH
      </Trans>
    )
    const withoutReservedRate = (
      <Trans>
        {payerRate} {tokenSymbolPlural}/ETH
      </Trans>
    )

    return (
      <span>
        {fcReservedRate.gt(0) ? withReservedRate : withoutReservedRate}
      </span>
    )
  }

  return (
    <div>
      <Descriptions
        labelStyle={{ fontWeight: 600 }}
        size="small"
        column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }}
      >
        <Descriptions.Item label={<Trans>Target</Trans>}>
          {distributionLimit ? (
            <>
              <CurrencySymbol
                currency={V2CurrencyName(
                  distributionLimitCurrency?.toNumber() as
                    | V2CurrencyOption
                    | undefined,
                )}
              />
              {formatWad(distributionLimit)}
            </>
          ) : (
            <Trans>No target</Trans>
          )}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans>Duration</Trans>}>
          {fundingCycle.duration.gt(0) ? (
            formattedDuration
          ) : (
            <FundingCycleDetailWarning
              showWarning={true}
              tooltipTitle={FUNDING_CYCLE_WARNING_TEXT(fundingCycle).duration}
            >
              <Trans>Not set</Trans>
            </FundingCycleDetailWarning>
          )}
        </Descriptions.Item>

        {fundingCycle.duration.gt(0) && (
          <Descriptions.Item label={<Trans>Start</Trans>}>
            {formattedStartTime}
          </Descriptions.Item>
        )}

        {fundingCycle.duration.gt(0) && (
          <Descriptions.Item label={<Trans>End</Trans>}>
            {formattedEndTime}
          </Descriptions.Item>
        )}

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Discount rate</Trans>}
              tip={
                <Trans>
                  The ratio of tokens rewarded per payment amount will decrease
                  by this percentage with each new funding cycle. A higher
                  discount rate will incentivize supporters to pay your project
                  earlier than later.
                </Trans>
              }
            />
          }
        >
          {formatDiscountRate(fundingCycle.discountRate)}%
        </Descriptions.Item>

        <Descriptions.Item
          span={2}
          label={
            <TooltipLabel
              label={<Trans>Bonding curve rate</Trans>}
              tip={
                <Trans>
                  This rate determines the amount of overflow that each token
                  can be redeemed for at any given time. On a lower bonding
                  curve, redeeming a token increases the value of each remaining
                  token, creating an incentive to hodl tokens longer than
                  others. A bonding curve of 100% means all tokens will have
                  equal value regardless of when they are redeemed.
                </Trans>
              }
            />
          }
        >
          {formatRedemptionRate(metadata?.redemptionRate)}%
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Reserved {tokenSymbolPlural}</Trans>}
              tip={
                <Trans>
                  Whenever someone pays your project, this percentage of tokens
                  will be reserved and the rest will go to the payer. Reserve
                  tokens are reserved for the project owner by default, but can
                  also be allocated to other wallet addresses by the owner. Once
                  tokens are reserved, anyone can "mint" them, which distributes
                  them to their intended receivers.
                </Trans>
              }
            />
          }
        >
          <FundingCycleDetailWarning
            showWarning={unsafeFundingCycleProperties.metadataReservedRate}
            tooltipTitle={
              FUNDING_CYCLE_WARNING_TEXT(fundingCycle).metadataReservedRate
            }
          >
            {formatReservedRate(metadata?.reservedRate)}%
          </FundingCycleDetailWarning>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Issue rate</Trans>}
              tip={
                <Trans>
                  {tokenSymbolPlural} received per ETH paid to the treasury.
                  This can change over time according to the discount rate and
                  reserved tokens amount of future funding cycles.
                </Trans>
              }
            />
          }
          span={2}
          contentStyle={{ minWidth: '10em' }}
        >
          <ReservedRateText />
        </Descriptions.Item>

        <Descriptions.Item
          span={2}
          label={<TooltipLabel label={<Trans>Payments</Trans>} />}
        >
          {metadata?.pausePay ? <Trans>Paused</Trans> : <Trans>Enabled</Trans>}
        </Descriptions.Item>
      </Descriptions>

      <div>
        <span style={{ fontWeight: 600, color: colors.text.secondary }}>
          <TooltipLabel
            label={<Trans>Reconfiguration strategy</Trans>}
            tip={
              <Trans>
                Rules for determining how funding cycles can be reconfigured
              </Trans>
            }
          />
          :
        </span>{' '}
        <FundingCycleDetailWarning
          showWarning={unsafeFundingCycleProperties.ballot}
          tooltipTitle={FUNDING_CYCLE_WARNING_TEXT(fundingCycle).ballot}
        >
          {ballotStrategy.name}
        </FundingCycleDetailWarning>
        <div style={{ color: colors.text.secondary }}>
          <div style={{ fontSize: '0.7rem' }}>
            <Trans>Address: {ballotStrategy.address}</Trans>
            <br />
            {ballotStrategy.description}
          </div>
        </div>
      </div>
    </div>
  )
}
