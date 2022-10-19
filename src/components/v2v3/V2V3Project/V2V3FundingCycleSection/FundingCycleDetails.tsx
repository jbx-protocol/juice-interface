import { Trans } from '@lingui/macro'
import { Descriptions, Tooltip } from 'antd'

import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { formatDate, formatDateToUTC } from 'utils/format/formatDate'
import { formattedNum } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2V3CurrencyName } from 'utils/v2v3/currency'

import EtherscanLink from 'components/EtherscanLink'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'

import {
  deriveNextIssuanceRate,
  getUnsafeV2V3FundingCycleProperties,
} from 'utils/v2v3/fundingCycle'

import { detailedTimeString } from 'utils/format/formatTime'

import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
  weightAmountPermyriad,
} from 'utils/v2v3/math'

import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from 'ethers/lib/utils'

import ETHToUSD from 'components/currency/ETHToUSD'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import DistributionLimit from '../../shared/DistributionLimit'
import {
  DISCOUNT_RATE_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
} from './settingExplanations'

export default function FundingCycleDetails({
  fundingCycle,
  fundingCycleMetadata,
  distributionLimit,
  distributionLimitCurrency,
  isOutgoingData, // data being used in transactions such as reconfig and being displayed on Safe page
}: {
  fundingCycle: V2V3FundingCycle | undefined
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
  isOutgoingData?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { tokenSymbol, fundingCycle: currentFC } =
    useContext(V2V3ProjectContext)

  if (!fundingCycle || !fundingCycleMetadata) return null

  const formattedDuration = detailedTimeString({
    timeSeconds: fundingCycle.duration.toNumber(),
    fullWords: true,
  })
  const formattedStartTime = fundingCycle.start
    ? formatDate(fundingCycle.start.mul(1000))
    : undefined
  const formattedEndTime = fundingCycle.start
    ? formatDate(fundingCycle.start?.add(fundingCycle.duration).mul(1000))
    : undefined
  const ballotStrategy = getBallotStrategyByAddress(fundingCycle.ballot)
  const unsafeFundingCycleProperties = getUnsafeV2V3FundingCycleProperties(
    fundingCycle,
    fundingCycleMetadata,
  )

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const currency = V2V3CurrencyName(
    distributionLimitCurrency?.toNumber() as V2V3CurrencyOption | undefined,
  )

  const ReservedTokensText = () => {
    const reservedRate = formattedNum(
      formatIssuanceRate(
        weightAmountPermyriad(
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
        weightAmountPermyriad(
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

  const ballotWarningText = unsafeFundingCycleProperties.noBallot
    ? riskWarningText.noBallot
    : riskWarningText.customBallot

  const issuanceRate = isOutgoingData
    ? deriveNextIssuanceRate({
        weight: fundingCycle?.weight,
        previousFC: currentFC,
      })
    : fundingCycle?.weight

  const formattedIssuanceRate = formattedNum(
    formatIssuanceRate(issuanceRate?.toString() ?? ''),
  )

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
            <Tooltip
              title={
                currency === 'ETH' && distributionLimit?.gt(0) ? (
                  <ETHToUSD ethAmount={distributionLimit} />
                ) : undefined
              }
            >
              {''}
              <DistributionLimit
                distributionLimit={distributionLimit}
                currencyName={currency}
              />
            </Tooltip>
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

        {fundingCycle.duration.gt(0) && formattedStartTime && (
          <Descriptions.Item label={<Trans>Start</Trans>}>
            <Tooltip title={formatDateToUTC(fundingCycle.start.mul(1000))}>
              {formattedStartTime}
            </Tooltip>
          </Descriptions.Item>
        )}

        {fundingCycle.duration.gt(0) && formattedEndTime && (
          <Descriptions.Item label={<Trans>End</Trans>}>
            <Tooltip
              title={formatDateToUTC(
                fundingCycle.start.add(fundingCycle.duration).mul(1000),
              )}
            >
              {formattedEndTime}
            </Tooltip>
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
          <Trans>{formattedIssuanceRate} tokens/ETH</Trans>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Contributor rate</Trans>}
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
          span={2}
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
        <Descriptions.Item
          span={2}
          label={
            <TooltipLabel
              label={<Trans>Terminal configuration</Trans>}
              tip={
                <Trans>
                  The project owner can add and remove payment terminals.
                </Trans>
              }
            />
          }
        >
          {fundingCycleMetadata?.global.allowSetTerminals ? (
            <Trans>Allowed</Trans>
          ) : (
            <Trans>Disabled</Trans>
          )}
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
          showWarning={
            unsafeFundingCycleProperties.noBallot ||
            unsafeFundingCycleProperties.customBallot
          }
          tooltipTitle={ballotWarningText}
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
