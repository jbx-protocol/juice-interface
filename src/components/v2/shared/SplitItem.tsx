import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'
import TooltipIcon from 'components/TooltipIcon'
import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { Split } from 'models/v2/splits'
import Link from 'next/link'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { v2ProjectRoute } from 'utils/routes'
import { V2CurrencyName } from 'utils/v2/currency'
import { formatSplitPercent, SPLITS_TOTAL_PERCENT } from 'utils/v2/math'

const LockedText = ({ lockedUntil }: { lockedUntil: number }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const lockedUntilFormatted = formatDate(lockedUntil * 1000, 'yyyy-MM-DD')

  return (
    <div style={{ fontSize: '.8rem', color: colors.text.secondary }}>
      <LockOutlined /> <Trans>locked until {lockedUntilFormatted}</Trans>
    </div>
  )
}

export default function SplitItem({
  split,
  showSplitValue,
  currency,
  totalValue,
  projectOwnerAddress,
  valueSuffix,
  valueFormatProps,
  reservedRate,
}: {
  split: Split
  currency?: BigNumber
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showSplitValue: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const isMobile = useMobile()

  const { data: handle } = split.projectId
    ? useProjectHandle({ projectId: parseInt(split.projectId) })
    : { data: undefined }

  const isProjectOwner = projectOwnerAddress === split.beneficiary
  const isJuiceboxProject = split.projectId
    ? BigNumber.from(split.projectId).gt(0)
    : false
  const itemFontSize = isMobile ? '0.9rem' : 'unset'

  const JuiceboxProjectBeneficiary = () => {
    const getProjectLabel = () => {
      if (handle) {
        return `@${handle}`
      }
      if (split.projectId) {
        return t`Project ${parseInt(split.projectId)}`
      }
      return t`Unknown Project`
    }

    return (
      <div>
        <div>
          <Link href={v2ProjectRoute({ projectId: split.projectId, handle })}>
            <a
              className="text-primary hover-text-action-primary hover-text-decoration-underline"
              style={{ fontWeight: 500 }}
              target="_blank"
            >
              {getProjectLabel()}
            </a>
          </Link>
        </div>

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
          fontSize: itemFontSize,
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

  const SplitValue = () => {
    const splitValue = totalValue?.mul(split.percent).div(SPLITS_TOTAL_PERCENT)
    const splitValueFormatted = formatWad(splitValue, { ...valueFormatProps })

    return (
      <span style={{ fontSize: itemFontSize }}>
        (
        <CurrencySymbol
          currency={V2CurrencyName(
            currency?.toNumber() as V2CurrencyOption | undefined,
          )}
        />
        {splitValueFormatted}
        {valueSuffix ? <span> {valueSuffix}</span> : null})
      </span>
    )
  }

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
        <span>{formattedSplitPercent}%</span>
        {totalValue?.gt(0) && showSplitValue ? (
          <span style={{ marginLeft: '0.2rem' }}>
            {' '}
            <SplitValue />
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
