import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'
import { Parenthesis } from 'components/Parenthesis'
import TooltipIcon from 'components/TooltipIcon'
import TooltipLabel from 'components/TooltipLabel'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { featureFlagEnabled } from 'utils/featureFlags'
import { formatDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import {
  feeForAmount,
  formatSplitPercent,
  SPLITS_TOTAL_PERCENT,
} from 'utils/v2v3/math'
import { AllocatorBadge } from './FundingCycleConfigurationDrawers/AllocatorBadge'
import V2V3ProjectHandleLink from './V2V3ProjectHandleLink'

const LockedText = ({ lockedUntil }: { lockedUntil: number }) => {
  const lockedUntilFormatted = formatDate(lockedUntil * 1000, 'yyyy-MM-DD')

  return (
    <div className="text-sm text-grey-500 dark:text-grey-300">
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
  if (!split.projectId) return null

  const isProjectOwner = projectOwnerAddress === split.beneficiary
  const allocatorsEnabled = featureFlagEnabled(FEATURE_FLAGS.SPLIT_ALLOCATORS)
  return (
    <div>
      <Space size="middle">
        <V2V3ProjectHandleLink projectId={parseInt(split.projectId)} />
        {allocatorsEnabled ? (
          <AllocatorBadge allocator={split.allocator} />
        ) : null}
      </Space>
      {split.allocator === NULL_ALLOCATOR_ADDRESS ? (
        <div className="ml-2 text-sm text-grey-500 dark:text-grey-300">
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
      ) : null}
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
    <div className="flex items-baseline font-medium">
      {split.beneficiary ? (
        <FormattedAddress address={split.beneficiary} />
      ) : null}
      {!split.beneficiary && isProjectOwner ? (
        <Trans>Project owner (you)</Trans>
      ) : null}
      {isProjectOwner && (
        <span className="ml-1">
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
      <div className="ml-2 text-sm text-grey-500 dark:text-grey-300">
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

export function SplitItem({
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
    <div className="flex flex-wrap items-baseline justify-between">
      <div className="leading-6">
        <div className="flex items-baseline">
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
      <div className="whitespace-nowrap">
        {formattedSplitPercent}%
        {totalValue?.gt(0) && showSplitValue ? (
          <>
            {' '}
            <SplitValue
              split={split}
              totalValue={totalValue}
              valueSuffix={valueSuffix}
              valueFormatProps={valueFormatProps}
              currency={currency}
              showFees={showFees}
            />
          </>
        ) : null}
        {reservedRate ? (
          <TooltipIcon
            iconClassName="ml-2"
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
