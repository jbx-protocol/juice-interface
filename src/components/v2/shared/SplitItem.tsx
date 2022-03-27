import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'

import { Split } from 'models/v2/splits'
import TooltipLabel from 'components/shared/TooltipLabel'
import FormattedAddress from 'components/shared/FormattedAddress'
import { formatWad } from 'utils/formatNumber'
import { BigNumber } from '@ethersproject/bignumber'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2CurrencyName } from 'utils/v2/currency'
import { formatSplitPercent, SPLITS_TOTAL_PERCENT } from 'utils/v2/math'

export default function SplitItem({
  split,
  showValue,
  distributionLimitCurrency,
  distributionLimit,
  projectOwnerAddress,
}: {
  split: Split
  distributionLimitCurrency: BigNumber | undefined
  distributionLimit: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showValue: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const isProjectOwner = projectOwnerAddress === split.beneficiary
  const isJuiceboxProject = BigNumber.from(split.projectId).gt(0)

  const LockedText = ({ lockedUntil }: { lockedUntil: number }) => {
    const lockedUntilFormatted = formatDate(lockedUntil * 1000, 'yyyy-MM-DD')

    return (
      <div style={{ fontSize: '.8rem', color: colors.text.secondary }}>
        <LockOutlined /> <Trans>locked until {lockedUntilFormatted}</Trans>
      </div>
    )
  }

  const JuiceboxProjectBeneficiary = () => {
    return (
      <div>
        {/* TODO figure out project "handles" with ENS resolution */}
        <div style={{ fontWeight: 500 }}>@{split.projectId}:</div>
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

  const ETHAddressBeneficiary = () => {
    return (
      <div
        style={{
          fontWeight: 500,
          display: 'flex',
          alignItems: 'baseline',
        }}
      >
        <FormattedAddress address={split.beneficiary} />
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

  const SplitValue = () => {
    const splitValue = distributionLimit
      ?.mul(split.percent)
      .div(SPLITS_TOTAL_PERCENT)
    const splitValueFormatted = formatWad(splitValue)

    return (
      <>
        (
        <CurrencySymbol
          currency={V2CurrencyName(
            distributionLimitCurrency?.toNumber() as
              | V2CurrencyOption
              | undefined,
          )}
        />
        {splitValueFormatted})
      </>
    )
  }

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
            <JuiceboxProjectBeneficiary />
          ) : (
            <ETHAddressBeneficiary />
          )}
        </div>

        {split.lockedUntil ? (
          <LockedText lockedUntil={split.lockedUntil} />
        ) : null}
      </div>
      <div>
        <span>{formatSplitPercent(BigNumber.from(split.percent))}%</span>
        {distributionLimit?.gt(0) && showValue ? (
          <span style={{ marginLeft: '0.2rem' }}>
            <SplitValue />
          </span>
        ) : null}
      </div>
    </div>
  )
}
