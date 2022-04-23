import { Button, Col, Row, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { Split } from 'models/v2/splits'
import { useContext, useState } from 'react'
import { permyriadToPercent } from 'utils/formatNumber'
import FormattedAddress from 'components/shared/FormattedAddress'
import { formatDate } from 'utils/formatDate'
import {
  CrownFilled,
  LockOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import DistributionSplitModal from './DistributionSplitModal'
import { CurrencyName } from 'constants/currency'

export default function DistributionSplitCard({
  split,
  splitIndex,
  splits,
  onSplitsChanged,
  distributionLimit,
  currencyName,
}: {
  split: Split
  splits: Split[]
  splitIndex: number
  onSplitsChanged: (splits: Split[]) => void
  distributionLimit: string | undefined
  currencyName: CurrencyName
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)
  const { projectOwnerAddress } = useContext(V2ProjectContext)

  const [editSplitModalOpen, setEditSplitModalOpen] = useState<boolean>(false)

  const gutter = 10

  const isLocked = Boolean(split.lockedUntil)
  const isProject = parseInt(split.projectId ?? '0') > 0

  // !isProject added here because we don't want to show the crown next to
  // a project recipient whose token benefiary is the owner of this project
  const isOwner = projectOwnerAddress === split.beneficiary && !isProject

  return (
    <div
      style={{
        display: 'flex',
        padding: 10,
        border:
          '1px solid ' +
          (isLocked ? colors.stroke.disabled : colors.stroke.tertiary),
        borderRadius: radii.md,
      }}
      key={split.beneficiary ?? '' + splitIndex}
    >
      <Space
        direction="vertical"
        style={{
          width: '100%',
          color: colors.text.primary,
          cursor: isLocked ? 'default' : 'pointer',
        }}
        onClick={() => setEditSplitModalOpen(true)}
      >
        {/* TODO: allow for project handles */}
        {split.projectId && parseInt(split.projectId) > 0 ? (
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={7}>
              <label>Project ID:</label>{' '}
            </Col>
            <Col span={17}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ cursor: 'pointer' }}>{split.projectId}</span>
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
                  <FormattedAddress address={split.beneficiary} />
                </span>
                {isOwner && <CrownFilled />}
              </div>
            </Col>
          </Row>
        )}

        {parseInt(split.projectId ?? '0') > 0 ? (
          <Row>
            <Col span={7}>
              <label>Beneficiary:</label>
            </Col>
            <Col span={17}>
              <span style={{ cursor: 'pointer' }}>
                <FormattedAddress address={split.beneficiary} />
              </span>
            </Col>
          </Row>
        ) : null}

        <Row gutter={gutter} style={{ width: '100%' }} align="middle">
          <Col span={7}>
            <label>Percentage / Amount:</label>
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
                  <span>{permyriadToPercent(split.percent)}%</span>
                  {/* {!targetIsInfinite && (
                    <span>
                      <CurrencySymbol currency={currencyName} />
                      {formatWad(
                        amountSubFee(parseWad(target), feePerbicent)
                          ?.mul(split.percent)
                          .div(10000),
                        { precision: 4, padEnd: true },
                      )}
                    </span>
                  )} */}
                </Space>
              </span>
            </div>
          </Col>
        </Row>

        {isLocked && (
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={7}>
              <label>Locked: </label>
            </Col>
            <Col span={17}>
              until {formatDate((split.lockedUntil ?? 0) * 1000, 'yyyy-MM-DD')}
            </Col>
          </Row>
        )}
      </Space>

      {isLocked ? (
        <LockOutlined style={{ color: colors.icon.disabled }} />
      ) : (
        <Button
          type="text"
          onClick={e => {
            onSplitsChanged([
              ...splits.slice(0, splitIndex),
              ...splits.slice(splitIndex + 1),
            ])
            e.stopPropagation()
          }}
          icon={<CloseCircleOutlined />}
        />
      )}
      <DistributionSplitModal
        visible={editSplitModalOpen}
        onSplitsChanged={onSplitsChanged}
        mode={'Edit'}
        splits={splits}
        distributionLimit={distributionLimit}
        onClose={() => setEditSplitModalOpen(false)}
        currencyName={currencyName}
      />
    </div>
  )
}
