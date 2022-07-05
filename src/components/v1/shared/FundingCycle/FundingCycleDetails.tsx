import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { Descriptions } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import {
  formatWad,
  perbicentToPercent,
  permilleToPercent,
} from 'utils/formatNumber'
import {
  decodeFundingCycleMetadata,
  getUnsafeV1FundingCycleProperties,
  hasFundingTarget,
  isRecurring,
} from 'utils/v1/fundingCycle'
import { weightedRate } from 'utils/math'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { V1CurrencyName } from 'utils/v1/currency'

import TooltipLabel from 'components/TooltipLabel'

import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import EtherscanLink from 'components/EtherscanLink'

import { getBallotStrategyByAddress } from 'constants/v1/ballotStrategies/getBallotStrategiesByAddress'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { SECONDS_IN_DAY } from 'constants/numbers'

export default function FundingCycleDetails({
  fundingCycle,
}: {
  fundingCycle: V1FundingCycle | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { tokenSymbol } = useContext(V1ProjectContext)

  if (!fundingCycle) return null

  const formattedStartTime = formatDate(fundingCycle.start.mul(1000))

  const formattedEndTime = formatDate(
    fundingCycle.start.add(fundingCycle.duration.mul(SECONDS_IN_DAY)).mul(1000),
  )

  const metadata = decodeFundingCycleMetadata(fundingCycle.metadata)
  const fcReservedRate = metadata?.reservedRate

  const ballotStrategy = getBallotStrategyByAddress(fundingCycle.ballot)
  const unsafeFundingCycleProperties =
    getUnsafeV1FundingCycleProperties(fundingCycle)

  const tokenSymbolPluralCap = tokenSymbolText({
    tokenSymbol,
    capitalize: true,
    plural: true,
  })

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const ReservedRateText = () => {
    const payerRate = formatWad(
      weightedRate(
        fundingCycle?.weight,
        fcReservedRate,
        parseEther('1'),
        'payer',
      ),
      {
        precision: 0,
      },
    )

    const reservedRate = formatWad(
      weightedRate(
        fundingCycle?.weight,
        fcReservedRate,
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
      <span>{fcReservedRate ? withReservedRate : withoutReservedRate}</span>
    )
  }

  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()

  return (
    <div>
      <Descriptions
        labelStyle={{ fontWeight: 600 }}
        size="small"
        column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }}
      >
        <Descriptions.Item label={<Trans>Target</Trans>}>
          {hasFundingTarget(fundingCycle) ? (
            <>
              <CurrencySymbol
                currency={V1CurrencyName(
                  fundingCycle.currency.toNumber() as V1CurrencyOption,
                )}
              />
              {formatWad(fundingCycle.target)}
            </>
          ) : (
            <Trans>No target</Trans>
          )}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans>Duration</Trans>}>
          {fundingCycle.duration.gt(0) ? (
            <Trans>{fundingCycle.duration.toString()} days</Trans>
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

        {isRecurring(fundingCycle) && (
          <Descriptions.Item
            label={
              <TooltipLabel
                label={<Trans>Discount rate</Trans>}
                tip={
                  <Trans>
                    The ratio of tokens rewarded per payment amount will
                    decrease by this percentage with each new funding cycle. A
                    higher discount rate will incentivize supporters to pay your
                    project earlier than later.
                  </Trans>
                }
              />
            }
          >
            {permilleToPercent(fundingCycle.discountRate)}%
          </Descriptions.Item>
        )}

        {isRecurring(fundingCycle) && (
          <Descriptions.Item
            span={2}
            label={
              <TooltipLabel
                label={<Trans>Bonding curve rate</Trans>}
                tip={
                  <Trans>
                    This rate determines the amount of overflow that each token
                    can be redeemed for at any given time. On a lower bonding
                    curve, redeeming a token increases the value of each
                    remaining token, creating an incentive to hold tokens longer
                    than others. A bonding curve of 100% means all tokens will
                    have equal value regardless of when they are redeemed.
                  </Trans>
                }
              />
            }
          >
            {perbicentToPercent(metadata?.bondingCurveRate)}%
          </Descriptions.Item>
        )}

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Reserved {tokenSymbolPlural}</Trans>}
              tip={
                <Trans>
                  Whenever someone pays your project, this percentage of the
                  newly minted tokens will be reserved and the rest will go to
                  the payer. Reserve tokens are reserved for the project owner
                  by default, but can also be allocated to other wallet
                  addresses by the owner. Once tokens are reserved, anyone can
                  "mint" them, which distributes them to their intended
                  receivers.
                </Trans>
              }
            />
          }
        >
          <FundingCycleDetailWarning
            showWarning={unsafeFundingCycleProperties.metadataReservedRate}
            tooltipTitle={riskWarningText.metadataReservedRate}
          >
            {perbicentToPercent(metadata?.reservedRate)}%
          </FundingCycleDetailWarning>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <TooltipLabel
              label={<Trans>Contributor rate</Trans>}
              tip={
                <Trans>
                  {tokenSymbolPluralCap} received per ETH paid to the treasury.
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
          label={
            <TooltipLabel
              label={<Trans>Token minting</Trans>}
              tip={
                <Trans>
                  When token minting is allowed, the owner of this project has
                  permission to mint any number of tokens to any address at
                  their discretion. This has the effect of diluting all current
                  token holders, without increasing the project's treasury
                  balance. The project owner can reconfigure this along with all
                  other properties of the funding cycle.
                </Trans>
              }
            />
          }
        >
          {metadata?.ticketPrintingIsAllowed ? (
            <FundingCycleDetailWarning
              showWarning={true}
              tooltipTitle={riskWarningText.allowMinting}
            >
              <Trans>Allowed</Trans>
            </FundingCycleDetailWarning>
          ) : (
            <Trans>Disabled</Trans>
          )}
        </Descriptions.Item>

        <Descriptions.Item
          span={2}
          label={<TooltipLabel label={<Trans>Payments</Trans>} />}
        >
          {metadata?.payIsPaused ? (
            <Trans>Paused</Trans>
          ) : (
            <Trans>Enabled</Trans>
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
