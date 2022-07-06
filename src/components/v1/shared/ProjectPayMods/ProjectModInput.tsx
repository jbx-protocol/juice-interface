import { Button, Col, Row, Space } from 'antd'
import { LockOutlined, CloseCircleOutlined } from '@ant-design/icons'
import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'

import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import {
  formatWad,
  parseWad,
  percentToPerbicent,
  permyriadToPercent,
} from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'

import { BigNumber } from '@ethersproject/bignumber'

import { CurrencyName } from 'constants/currency'
import V1ProjectHandle from '../V1ProjectHandle'
import { EditingPayoutMod } from './types'

const FormattedRow = ({
  label,
  children,
}: PropsWithChildren<{ label: string; disabled?: boolean }>) => {
  return (
    <Row gutter={10} style={{ width: '100%' }} align="middle">
      <Col span={7}>
        <label>{label}:</label>{' '}
      </Col>
      <Col span={17}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ cursor: 'default' }}>{children}</span>
        </div>
      </Col>
    </Row>
  )
}

const FormattedPercentageAmount = ({
  percent,
  targetIsInfinite,
  feePerbicent,
  target,
  currencyName,
}: {
  percent: number
  feePerbicent: BigNumber
  target: string
  targetIsInfinite: boolean | undefined
  currencyName: CurrencyName | undefined
}) => {
  return (
    <Space size="large">
      <span>{permyriadToPercent(percent)}%</span>
      {!targetIsInfinite && (
        <span>
          <CurrencySymbol currency={currencyName} />
          {formatWad(
            amountSubFee(parseWad(target), feePerbicent)
              ?.mul(percent)
              .div(10000),
            { precision: currencyName === 'USD' ? 2 : 4, padEnd: true },
          )}
        </span>
      )}
    </Space>
  )
}

export function ProjectModInput({
  mod,
  index,
  locked,
  target,
  targetIsInfinite,
  currencyName,
  feePercentage,
  onSelect,
  onDelete,
}: {
  mod: EditingPayoutMod
  index: number
  locked?: boolean
  target: string
  targetIsInfinite: boolean | undefined
  currencyName: CurrencyName | undefined
  feePercentage: string | undefined
  onSelect?: (index: number) => void
  onDelete?: (index: number) => void
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const feePerbicent = percentToPerbicent(feePercentage)

  return (
    <div
      style={{
        display: 'flex',
        padding: 10,
        border:
          '1px solid ' +
          (locked ? colors.stroke.disabled : colors.stroke.tertiary),
        borderRadius: radii.md,
      }}
      key={mod.beneficiary ?? '' + index}
    >
      <Space
        direction="vertical"
        style={{
          width: '100%',
          color: colors.text.primary,
          cursor: locked ? 'default' : 'pointer',
        }}
        onClick={() => onSelect?.(index)}
      >
        {mod.projectId?.gt(0) ? (
          <FormattedRow label={'Project'}>
            <V1ProjectHandle projectId={mod.projectId} />
          </FormattedRow>
        ) : (
          <FormattedRow label={'Address'}>
            <FormattedAddress address={mod.beneficiary} />
          </FormattedRow>
        )}
        {mod.projectId?.gt(0) && (
          <FormattedRow label="Beneficiary">
            <FormattedAddress address={mod.beneficiary} />
          </FormattedRow>
        )}
        <FormattedRow label="Percentage">
          <FormattedPercentageAmount
            percent={mod.percent}
            targetIsInfinite={targetIsInfinite}
            feePerbicent={feePerbicent}
            target={target}
            currencyName={currencyName}
          />
        </FormattedRow>
        {mod.lockedUntil ? (
          <FormattedRow label="Locked">
            until {formatDate(mod.lockedUntil * 1000, 'yyyy-MM-DD')}
          </FormattedRow>
        ) : null}
      </Space>

      {locked ? (
        <LockOutlined style={{ color: colors.icon.disabled }} />
      ) : (
        <Button
          type="text"
          onClick={() => onDelete?.(index)}
          icon={<CloseCircleOutlined />}
        />
      )}
    </div>
  )
}
