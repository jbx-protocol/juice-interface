import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import DistributionLimit from 'components/v2v3/shared/DistributionLimit'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3FundingCycle } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { formatDate, formatDateToUTC } from 'utils/format/formatDate'
import { detailedTimeString } from 'utils/format/formatTime'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { DISTRIBUTION_LIMIT_EXPLANATION } from '../settingExplanations'
import { FundingCycleListItem } from './FundingCycleListItem'

export function FundingCycleListItems({
  fundingCycle,
  distributionLimit,
  distributionLimitCurrency,
}: {
  fundingCycle: V2V3FundingCycle
  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const formattedStartTime = fundingCycle.start
    ? formatDate(fundingCycle.start.mul(1000))
    : undefined
  const formattedEndTime = fundingCycle.start
    ? formatDate(fundingCycle.start?.add(fundingCycle.duration).mul(1000))
    : undefined
  const formattedDuration = detailedTimeString({
    timeSeconds: fundingCycle.duration.toNumber(),
    fullWords: true,
  })
  const currency = V2V3CurrencyName(
    distributionLimitCurrency?.toNumber() as V2V3CurrencyOption | undefined,
  )

  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  return (
    <>
      {fundingCycle.duration.gt(0) && formattedStartTime ? (
        <FundingCycleListItem
          name={t`Start`}
          value={
            <Tooltip title={formatDateToUTC(fundingCycle.start.mul(1000))}>
              {formattedStartTime}
            </Tooltip>
          }
        />
      ) : null}
      {fundingCycle.duration.gt(0) && formattedEndTime ? (
        <FundingCycleListItem
          name={t`End`}
          value={
            <Tooltip
              title={formatDateToUTC(
                fundingCycle.start.add(fundingCycle.duration).mul(1000),
              )}
            >
              {formattedEndTime}
            </Tooltip>
          }
        />
      ) : null}
      <FundingCycleListItem
        name={t`Duration`}
        value={
          <>
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
          </>
        }
      />
      <FundingCycleListItem
        name={t`Distribution limit`}
        value={
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
                style={{ color: colors.text.secondary }}
              />
            </Tooltip>
          </span>
        }
        helperText={DISTRIBUTION_LIMIT_EXPLANATION}
      />
    </>
  )
}
