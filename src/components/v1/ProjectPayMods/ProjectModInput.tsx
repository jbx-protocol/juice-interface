import { Button, Col, Row, Space } from 'antd'
import { LockOutlined, CloseCircleOutlined } from '@ant-design/icons'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import {
  formatWad,
  parseWad,
  percentToPerbicent,
  permyriadToPercent,
} from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'

import { CurrencyName } from 'constants/currency'
import V1ProjectHandle from '../shared/V1ProjectHandle'
import { EditingPayoutMod } from './types'

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

  const gutter = 10

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
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={7}>
              <label>Project:</label>{' '}
            </Col>
            <Col span={17}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ cursor: 'pointer' }}>
                  <V1ProjectHandle projectId={mod.projectId} />
                </span>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={7}>
              <label>Address:</label>{' '}
            </Col>
            <Col span={17}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ cursor: 'pointer' }}>
                  <FormattedAddress address={mod.beneficiary} />
                </span>
              </div>
            </Col>
          </Row>
        )}

        {mod.projectId?.gt(0) ? (
          <Row>
            <Col span={7}>
              <label>Beneficiary:</label>
            </Col>
            <Col span={17}>
              <span style={{ cursor: 'pointer' }}>
                <FormattedAddress address={mod.beneficiary} />
              </span>
            </Col>
          </Row>
        ) : null}

        <Row gutter={gutter} style={{ width: '100%' }} align="middle">
          <Col span={7}>
            <label>Percentage:</label>
          </Col>
          <Col span={17}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  marginRight: 10,
                  width: 100,
                  maxWidth: 100,
                }}
              >
                <Space size="large">
                  <span>{permyriadToPercent(mod.percent)}%</span>
                  {!targetIsInfinite && (
                    <span>
                      <CurrencySymbol currency={currencyName} />
                      {formatWad(
                        amountSubFee(parseWad(target), feePerbicent)
                          ?.mul(mod.percent)
                          .div(10000),
                        { precision: 4, padEnd: true },
                      )}
                    </span>
                  )}
                </Space>
              </span>
            </div>
          </Col>
        </Row>

        {mod.lockedUntil ? (
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={7}>
              <label>Locked</label>
            </Col>
            <Col span={17}>
              until {formatDate(mod.lockedUntil * 1000, 'yyyy-MM-DD')}
            </Col>
          </Row>
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
