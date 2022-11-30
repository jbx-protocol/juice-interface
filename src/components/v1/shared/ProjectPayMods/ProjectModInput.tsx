import { CloseCircleOutlined, LockOutlined } from '@ant-design/icons'
import { Button, Col, Row, Space } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'
import { PropsWithChildren } from 'react'
import { formatDate } from 'utils/format/formatDate'
import {
  formatWad,
  parseWad,
  percentToPerbicent,
  permyriadToPercent,
} from 'utils/format/formatNumber'
import { amountSubFee } from 'utils/v1/math'
import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyName } from 'constants/currency'
import { classNames } from 'utils/classNames'
import V1ProjectHandle from '../V1ProjectHandle'
import { EditingPayoutMod } from './types'

const FormattedRow = ({
  label,
  children,
}: PropsWithChildren<{ label: string; disabled?: boolean }>) => {
  return (
    <Row gutter={10} className="w-full" align="middle">
      <Col span={7}>
        <label>{label}:</label>{' '}
      </Col>
      <Col span={17}>
        <div className="flex items-center justify-between">
          <span className="cursor-default">{children}</span>
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
  const feePerbicent = percentToPerbicent(feePercentage)

  return (
    <div
      className={classNames(
        'flex rounded-sm border border-solid p-2',
        locked
          ? 'border-grey-200 dark:border-grey-700'
          : 'border-smoke-200 dark:border-grey-600',
      )}
      key={mod.beneficiary ?? '' + index}
    >
      <Space
        direction="vertical"
        className={classNames(
          'w-full text-black dark:text-slate-100',
          locked ? 'cursor-default' : 'cursor-pointer',
        )}
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
        <LockOutlined className="text-grey-400 dark:text-grey-400" />
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
