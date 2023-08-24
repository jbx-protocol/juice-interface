import { Trans } from '@lingui/macro'
import { Descriptions, Tooltip } from 'antd'
import EtherscanLink from 'components/EtherscanLink'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import TooltipLabel from 'components/TooltipLabel'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import {
  CONTRIBUTOR_RATE_EXPLANATION,
  DISCOUNT_RATE_EXPLANATION,
  OWNER_MINTING_EXPLANATION,
  RECONFIG_RULES_EXPLANATION,
  REDEMPTION_RATE_EXPLANATION,
  RESERVED_RATE_EXPLANATION,
} from 'components/strings'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { getBallotStrategyByAddress } from 'constants/v1/ballotStrategies/getBallotStrategiesByAddress'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { utils } from 'ethers'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { useContext } from 'react'
import { formatPaused } from 'utils/format/formatBoolean'
import { formatDate, formatDateToUTC } from 'utils/format/formatDate'
import {
  formatWad,
  perbicentToPercent,
  permilleToPercent,
} from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V1CurrencyName } from 'utils/v1/currency'
import {
  decodeFundingCycleMetadata,
  getUnsafeV1FundingCycleProperties,
  hasFundingTarget,
  isRecurring,
} from 'utils/v1/fundingCycle'
import { weightAmountPerbicent } from 'utils/v1/math'

export default function FundingCycleDetails({
  fundingCycle,
}: {
  fundingCycle: V1FundingCycle | undefined
}) {
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

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const ReservedRateText = () => {
    const payerRate = formatWad(
      weightAmountPerbicent(
        fundingCycle?.weight,
        fcReservedRate,
        utils.parseEther('1'),
        'payer',
      ),
      {
        precision: 0,
      },
    )

    const reservedRate = formatWad(
      weightAmountPerbicent(
        fundingCycle?.weight,
        fcReservedRate,
        utils.parseEther('1'),
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

  const ballotWarningText = unsafeFundingCycleProperties.noBallot
    ? riskWarningText.noBallot
    : riskWarningText.customBallot

  return (
    <div>
      <Descriptions
        size="small"
        column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }}
      >
        <Descriptions.Item label={<Trans>Payouts</Trans>}>
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
            <Trans>Unlimited payouts</Trans>
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
            <Tooltip title={formatDateToUTC(fundingCycle.start.mul(1000))}>
              {formattedStartTime}
            </Tooltip>
          </Descriptions.Item>
        )}

        {fundingCycle.duration.gt(0) && (
          <Descriptions.Item label={<Trans>End</Trans>}>
            <Tooltip
              title={formatDateToUTC(
                fundingCycle.start
                  .add(fundingCycle.duration.mul(SECONDS_IN_DAY))
                  .mul(1000),
              )}
            >
              {formattedEndTime}
            </Tooltip>
          </Descriptions.Item>
        )}

        {isRecurring(fundingCycle) && (
          <Descriptions.Item
            label={
              <TooltipLabel
                label={<Trans>Issuance reduction rate</Trans>}
                tip={DISCOUNT_RATE_EXPLANATION}
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
                label={<Trans>Redemption rate</Trans>}
                tip={REDEMPTION_RATE_EXPLANATION}
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
              tip={RESERVED_RATE_EXPLANATION}
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
              label={<Trans>Payer issuance rate</Trans>}
              tip={CONTRIBUTOR_RATE_EXPLANATION}
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
              label={<Trans>Owner token minting</Trans>}
              tip={OWNER_MINTING_EXPLANATION}
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
          {formatPaused(metadata?.payIsPaused)}
        </Descriptions.Item>
      </Descriptions>

      <div>
        <span className="font-medium text-grey-500 dark:text-grey-300">
          <TooltipLabel
            label={<Trans>Edit deadline</Trans>}
            tip={RECONFIG_RULES_EXPLANATION}
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
        <div className="text-grey-500 dark:text-grey-300">
          <div className="text-xs">
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
