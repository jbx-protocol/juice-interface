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
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2CurrencyName } from 'utils/v2/currency'
import TooltipLabel from 'components/shared/TooltipLabel'

import FundingCycleDetailWarning from 'components/shared/Project/FundingCycleDetailWarning'
import EtherscanLink from 'components/shared/EtherscanLink'

import {
  decodeV2FundingCycleMetadata,
  getUnsafeV2FundingCycleProperties,
} from 'utils/v2/fundingCycle'

import { detailedTimeString } from 'utils/formatTime'

import {
  formatDiscountRate,
  formatRedemptionRate,
  formatReservedRate,
  MAX_DISTRIBUTION_LIMIT,
  weightedAmount,
} from 'utils/v2/math'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'

import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import {
  DISCOUNT_RATE_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
} from './settingExplanations'

export default function FundingCycleDetails({
  fundingCycle,
}: {
  fundingCycle: V2FundingCycle | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { tokenSymbol, projectId, primaryTerminal } =
    useContext(V2ProjectContext)

  const { data: distributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: fundingCycle?.configuration?.toString(),
    terminal: primaryTerminal,
  })

  if (!fundingCycle) return null

  const fundingCycleMetadata = decodeV2FundingCycleMetadata(
    fundingCycle.metadata,
  )

  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? []

  const formattedDuration = detailedTimeString({
    timeSeconds: fundingCycle.duration.toNumber(),
  })
  const formattedStartTime = formatDate(fundingCycle.start.mul(1000))
  const formattedEndTime = formatDate(
    fundingCycle.start.add(fundingCycle.duration).mul(1000),
  )
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
        fundingCycleMetadata?.reservedRate.toNumber(),
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
        fundingCycleMetadata?.reservedRate.toNumber(),
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
        {fundingCycleMetadata?.reservedRate.gt(0)
          ? withReservedRate
          : withoutReservedRate}
      </span>
    )
  }

  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()

  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  )
  const distributionLimitIsZero = !distributionLimit || distributionLimit?.eq(0)

  return (
    <div>
      <Descriptions
        labelStyle={{ fontWeight: 600 }}
        size="small"
        column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }}
        contentStyle={{ marginRight: '0.5rem' }}
      >
        <Descriptions.Item label={<Trans>Distribution limit</Trans>}>
          <span style={{ whiteSpace: 'nowrap' }}>
            {distributionLimitIsInfinite ? (
              <Trans>Infinite</Trans>
            ) : distributionLimitIsZero ? (
              <>Zero</>
            ) : (
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
            )}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label={<Trans>Duration</Trans>}>
          {fundingCycle.duration.gt(0) ? (
            formattedDuration
          ) : (
            <FundingCycleDetailWarning
              showWarning={true}
              tooltipTitle={riskWarningText.duration}
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
              tip={DISCOUNT_RATE_EXPLANATION}
            />
          }
        >
          {formatDiscountRate(fundingCycle.discountRate)}%
        </Descriptions.Item>

        <Descriptions.Item
          span={2}
          label={
            <TooltipLabel
              label={<Trans>Redemption rate</Trans>}
              tip={REDEMPTION_RATE_EXPLANATION}
            />
          }
        >
          {fundingCycleMetadata?.redemptionRate ? (
            <span>
              {formatRedemptionRate(fundingCycleMetadata?.redemptionRate)}%
            </span>
          ) : null}
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
            tooltipTitle={riskWarningText.metadataReservedRate}
          >
            {formatReservedRate(fundingCycleMetadata?.reservedRate)}%
          </FundingCycleDetailWarning>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Issuance rate</Trans>}
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
          {fundingCycleMetadata?.pausePay ? (
            <Trans>Paused</Trans>
          ) : (
            <Trans>Enabled</Trans>
          )}
        </Descriptions.Item>
        <Descriptions.Item
          span={2}
          label={
            <TooltipLabel
              label={<Trans>Token minting</Trans>}
              tip={
                <Trans>
                  Token minting allows the project owner to mint project tokens
                  at any time.
                </Trans>
              }
            />
          }
        >
          <FundingCycleDetailWarning
            showWarning={fundingCycleMetadata?.allowMinting}
            tooltipTitle={FUNDING_CYCLE_WARNING_TEXT().allowMinting}
          >
            {fundingCycleMetadata?.allowMinting ? (
              <Trans>Allowed</Trans>
            ) : (
              <Trans>Disabled</Trans>
            )}
          </FundingCycleDetailWarning>
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
          tooltipTitle={riskWarningText.ballot}
        >
          {ballotStrategy.name}
        </FundingCycleDetailWarning>
        <div style={{ color: colors.text.secondary }}>
          <div style={{ fontSize: '0.7rem' }}>
            <Trans>
              Address:{' '}
              <EtherscanLink value={ballotStrategy.address} type="address" />
            </Trans>
            <br />
            {ballotStrategy.description}
          </div>
        </div>
      </div>
    </div>
  )
}
