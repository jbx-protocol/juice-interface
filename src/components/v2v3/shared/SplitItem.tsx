import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'
import { Parenthesis } from 'components/Parenthesis'
import TooltipIcon from 'components/TooltipIcon'
import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import { formatDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import {
  feeForAmount,
  formatSplitPercent,
  SPLITS_TOTAL_PERCENT,
} from 'utils/v2v3/math'
import V2V3ProjectHandle from './V2V3ProjectHandle'

const LockedText = ({ lockedUntil }: { lockedUntil: number }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const lockedUntilFormatted = formatDate(lockedUntil * 1000, 'yyyy-MM-DD')

  return (
    <div style={{ fontSize: '.875rem', color: colors.text.secondary }}>
      <LockOutlined /> <Trans>locked until {lockedUntilFormatted}</Trans>
    </div>
  )
}

const JuiceboxProjectBeneficiary = ({
  projectOwnerAddress,
  split,
}: {
  split: Split
  projectOwnerAddress: string | undefined
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!split.projectId) return null

  const isProjectOwner = projectOwnerAddress === split.beneficiary

  return (
    <div>
      <V2V3ProjectHandle projectId={parseInt(split.projectId)} />

      <div
        style={{
          fontSize: '.8rem',
          color: colors.text.secondary,
          marginLeft: 10,
        }}
      >
        <TooltipLabel
          label={<Trans>Tokens:</Trans>}
          tip={
            <Trans>
              This address will receive any tokens minted when the recipient
              project gets paid.
            </Trans>
          }
        />{' '}
        <FormattedAddress address={split.beneficiary} />{' '}
        {isProjectOwner && (
          <Tooltip title={<Trans>Project owner</Trans>}>
            <CrownFilled />
          </Tooltip>
        )}
      </div>
    </div>
  )
}

const ETHAddressBeneficiary = ({
  projectOwnerAddress,
  split,
}: {
  split: Split
  projectOwnerAddress: string | undefined
}) => {
  const isProjectOwner = projectOwnerAddress === split.beneficiary

  return (
    <div
      style={{
        fontWeight: 500,
        display: 'flex',
        alignItems: 'baseline',
      }}
    >
      {split.beneficiary ? (
        <FormattedAddress address={split.beneficiary} />
      ) : null}
      {!split.beneficiary && isProjectOwner ? (
        <Trans>Project owner (you)</Trans>
      ) : null}
      {isProjectOwner && (
        <span style={{ marginLeft: 5 }}>
          <Tooltip title={<Trans>Project owner</Trans>}>
            <CrownFilled />
          </Tooltip>
        </span>
      )}
      :
    </div>
  )
}

const SplitValue = ({
  split,
  totalValue,
  valueSuffix,
  valueFormatProps,
  currency,
  showFees = false,
}: {
  split: Split
  totalValue: BigNumber | undefined
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: BigNumber
  showFees?: boolean
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const splitValue = totalValue?.mul(split.percent).div(SPLITS_TOTAL_PERCENT)
  const isJuiceboxProject = isJuiceboxProjectSplit(split)
  const feeAmount = !isJuiceboxProject
    ? feeForAmount(splitValue, ETHPaymentTerminalFee)
    : BigNumber.from(0)
  const splitValueFormatted =
    splitValue &&
    feeAmount &&
    formatWad(splitValue.sub(feeAmount), {
      ...valueFormatProps,
    })
  const feeAmountFormatted = formatWad(feeAmount, {
    ...valueFormatProps,
  })

  const curr = V2V3CurrencyName(
    currency?.toNumber() as V2V3CurrencyOption | undefined,
  )
  const tooltipTitle =
    curr === 'ETH' && splitValue?.gt(0) ? (
      <ETHToUSD ethAmount={splitValue} />
    ) : undefined

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        (
        <CurrencySymbol currency={curr} />
        {splitValueFormatted}
        {valueSuffix ? <span> {valueSuffix}</span> : null})
      </span>
      <div
        style={{
          fontSize: '.8rem',
          color: colors.text.secondary,
          marginLeft: 10,
        }}
      >
        {showFees && !isJuiceboxProject && (
          <Parenthesis>
            <Trans>
              <CurrencySymbol currency={curr} />
              {feeAmountFormatted} fee
            </Trans>
          </Parenthesis>
        )}
      </div>
    </Tooltip>
  )
}

export default function SplitItem({
  split,
  showSplitValue,
  showFees,
  totalValue,
  projectOwnerAddress,
  reservedRate,
  valueSuffix,
  valueFormatProps,
  currency,
}: {
  split: Split
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showSplitValue?: boolean
  reservedRate?: number
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: BigNumber
  showFees?: boolean
}) {
  const isJuiceboxProject = isJuiceboxProjectSplit(split)

  const formattedSplitPercent = formatSplitPercent(
    BigNumber.from(split.percent),
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 5,
      }}
    >
      <div style={{ lineHeight: 1.4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {isJuiceboxProject ? (
            <JuiceboxProjectBeneficiary
              projectOwnerAddress={projectOwnerAddress}
              split={split}
            />
          ) : (
            <ETHAddressBeneficiary
              projectOwnerAddress={projectOwnerAddress}
              split={split}
            />
          )}
        </div>

        {split.lockedUntil && split.lockedUntil > 0 ? (
          <LockedText lockedUntil={split.lockedUntil} />
        ) : null}
      </div>
      <div>
        <span>{formattedSplitPercent}%</span>
        {totalValue?.gt(0) && showSplitValue ? (
          <span style={{ marginLeft: '0.2rem' }}>
            {' '}
            <SplitValue
              split={split}
              totalValue={totalValue}
              valueSuffix={valueSuffix}
              valueFormatProps={valueFormatProps}
              currency={currency}
              showFees={showFees}
            />
          </span>
        ) : null}
        {reservedRate ? (
          <TooltipIcon
            iconStyle={{ marginLeft: 7 }}
            tip={
              <Trans>
                {(reservedRate * parseFloat(formattedSplitPercent)) / 100}% of
                all newly minted tokens.
              </Trans>
            }
          />
        ) : null}
      </div>
    </div>
  )
}
