import { CloseCircleOutlined, LockOutlined } from '@ant-design/icons'
import { Button, Col, Row, Space } from 'antd'
import { AllocatorBadge } from 'components/AllocatorBadge'
import EthereumAddress from 'components/EthereumAddress'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import {
  NULL_ALLOCATOR_ADDRESS,
  V1_V3_ALLOCATOR_ADDRESS,
} from 'constants/contracts/mainnet/Allocators'
import { CurrencyName } from 'constants/currency'
import { PropsWithChildren, useMemo } from 'react'
import { isEqualAddress, isZeroAddress } from 'utils/address'
import { classNames } from 'utils/classNames'
import { formatDate } from 'utils/format/formatDate'
import {
  formatWad,
  parseWad,
  percentToPerbicent,
  permyriadToPercent,
} from 'utils/format/formatNumber'
import { amountSubFee } from 'utils/v1/math'
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
  feePerbicent: bigint
  target: string
  targetIsInfinite: boolean | undefined
  currencyName: CurrencyName | undefined
}) => {
  const formatted = useMemo(() => {
    const asf = amountSubFee(parseWad(target), feePerbicent)
    return asf ? (asf * BigInt(percent)) / 10000n : undefined
  }, [percent, target, feePerbicent])

  return (
    <Space size="large">
      <span>{permyriadToPercent(percent)}%</span>
      {!targetIsInfinite && (
        <span>
          <CurrencySymbol currency={currencyName} />
          {formatWad(formatted, {
            precision: currencyName === 'USD' ? 2 : 4,
            padEnd: true,
          })}
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

  const isV1Project =
    mod.projectId && mod.projectId > 0n && isZeroAddress(mod.allocator)
  const isV3Project =
    mod.projectId &&
    mod.projectId > 0n &&
    isEqualAddress(mod.allocator, V1_V3_ALLOCATOR_ADDRESS)

  return (
    <div
      className={classNames(
        'flex rounded-sm border p-2',
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
        {mod.projectId && isV1Project ? (
          <FormattedRow label={'Project'}>
            <V1ProjectHandle projectId={mod.projectId} />
          </FormattedRow>
        ) : isV3Project ? (
          <FormattedRow label={'Project ID'}>
            <Space size="small">
              <span>{Number(mod.projectId)}</span>
              <AllocatorBadge allocator={mod.allocator} />
            </Space>
          </FormattedRow>
        ) : (
          <FormattedRow label={'Address'}>
            <EthereumAddress address={mod.beneficiary} />
          </FormattedRow>
        )}
        {!!mod.projectId &&
          mod.projectId > 0n &&
          mod.allocator === NULL_ALLOCATOR_ADDRESS && (
            <FormattedRow label="Beneficiary">
              <EthereumAddress address={mod.beneficiary} />
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
