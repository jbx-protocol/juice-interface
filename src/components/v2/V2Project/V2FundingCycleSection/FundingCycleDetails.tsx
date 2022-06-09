import { Trans } from '@lingui/macro'
import { Descriptions } from 'antd'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formattedNum } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2CurrencyName } from 'utils/v2/currency'
import TooltipLabel from 'components/shared/TooltipLabel'

import FundingCycleDetailWarning from 'components/shared/Project/FundingCycleDetailWarning'
import EtherscanLink from 'components/shared/EtherscanLink'

import { getUnsafeV2FundingCycleProperties } from 'utils/v2/fundingCycle'

import { detailedTimeString } from 'utils/formatTime'

import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
  weightedAmount,
} from 'utils/v2/math'

import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from 'ethers/lib/utils'

import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import {
  DISCOUNT_RATE_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
} from './settingExplanations'
import DistributionLimit from '../DistributionLimit'

export default function FundingCycleDetails({
  fundingCycle,
  fundingCycleMetadata,
  distributionLimit,
  distributionLimitCurrency,
}: {
  fundingCycle: V2FundingCycle | undefined
  fundingCycleMetadata: V2FundingCycleMetadata | undefined
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { tokenSymbol } = useContext(V2ProjectContext)

  if (!fundingCycle) return null

  const formattedDuration = detailedTimeString({
    timeSeconds: fundingCycle.duration.toNumber(),
    fullWords: true,
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

  const ReservedTokensText = () => {
    const reservedRate = formattedNum(
      formatIssuanceRate(
        weightedAmount(
          fundingCycle?.weight,
          fundingCycleMetadata?.reservedRate.toNumber(),
          parseEther('1'),
          'reserved',
        ) ?? '',
      ),
    )

    return (
      <span>
        <Trans>
          {reservedRate} {tokenSymbolPlural}/ETH (
          {formatReservedRate(fundingCycleMetadata?.reservedRate)}%)
        </Trans>
      </span>
    )
  }

  const IssuanceRateText = () => {
    const payerRate = formattedNum(
      formatIssuanceRate(
        weightedAmount(
          fundingCycle?.weight,
          fundingCycleMetadata?.reservedRate.toNumber(),
          parseEther('1'),
          'payer',
        ) ?? '',
      ),
    )

    return (
      <span>
        <Trans>
          {payerRate} {tokenSymbolPlural}/ETH
        </Trans>
      </span>
    )
  }

  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()

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
            <DistributionLimit
              distributionLimit={distributionLimit}
              currencyName={V2CurrencyName(
                distributionLimitCurrency?.toNumber() as
                  | V2CurrencyOption
                  | undefined,
              )}
            />
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
              label={<Trans>Mint rate</Trans>}
              tip={
                <Trans>
                  <strong>Total project tokens minted</strong> when 1 ETH is
                  contributed. This can change over time according to the
                  discount rate and reserved tokens amount of future funding
                  cycles.
                </Trans>
              }
            />
          }
          span={2}
          contentStyle={{ minWidth: '10em' }}
        >
          <Trans>
            {formattedNum(formatIssuanceRate(fundingCycle?.weight.toString()))}{' '}
            tokens/ETH
          </Trans>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Issuance rate</Trans>}
              tip={
                <Trans>
                  Newly minted {tokenSymbolPlural}{' '}
                  <strong>received by contributors</strong> per ETH they
                  contribute to the treasury.
                </Trans>
              }
            />
          }
          span={2}
          contentStyle={{ minWidth: '10em' }}
        >
          <IssuanceRateText />
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Reserved {tokenSymbolPlural}</Trans>}
              tip={
                <Trans>
                  Amount of newly minted project tokens{' '}
                  <strong>reserved for the project</strong> when 1 ETH is
                  contributed. The project owner is allocated all reserved
                  tokens by default, but they can also be allocated to other
                  wallet addresses.
                </Trans>
              }
            />
          }
        >
          <FundingCycleDetailWarning
            showWarning={unsafeFundingCycleProperties.metadataReservedRate}
            tooltipTitle={riskWarningText.metadataReservedRate}
          >
            <ReservedTokensText />
          </FundingCycleDetailWarning>
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
              label={<Trans>Owner token minting</Trans>}
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
