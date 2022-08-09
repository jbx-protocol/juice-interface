import { Button, Col, Row, Space, Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { Split } from 'models/v2/splits'
import { PropsWithChildren, useContext, useState } from 'react'
import { parseWad } from 'utils/formatNumber'
import FormattedAddress from 'components/FormattedAddress'
import { BigNumber } from '@ethersproject/bignumber'

import { formatDate } from 'utils/formatDate'
import { CrownFilled, LockOutlined, DeleteOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import {
  formatSplitPercent,
  MAX_DISTRIBUTION_LIMIT,
  preciseFormatSplitPercent,
  SPLITS_TOTAL_PERCENT,
} from 'utils/v2/math'
import CurrencySymbol from 'components/CurrencySymbol'
import { amountFromPercent } from 'utils/v2/distributions'
import { t, Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { round } from 'lodash'

import DistributionSplitModal from './DistributionSplitModal'
import { CurrencyName } from 'constants/currency'

const Parens = ({
  withParens = false,
  children,
}: PropsWithChildren<{ withParens: boolean }>) => {
  if (withParens) return <>({children})</>
  return <>{children}</>
}

export default function DistributionSplitCard({
  split,
  splits,
  distributionLimit,
  currencyName,
  isLocked,
  isProjectOwner,
  onSplitsChanged,
  onSplitDelete,
  setDistributionLimit,
  onCurrencyChange,
}: {
  split: Split
  splits: Split[]
  distributionLimit?: string
  currencyName: CurrencyName
  isLocked?: boolean
  isProjectOwner?: boolean
  onSplitsChanged?: (splits: Split[]) => void
  onSplitDelete?: (split: Split) => void
  setDistributionLimit?: (distributionLimit: string) => void
  onCurrencyChange?: (currencyName: CurrencyName) => void
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)
  const { projectOwnerAddress } = useContext(V2ProjectContext)

  const [editSplitModalOpen, setEditSplitModalOpen] = useState<boolean>(false)

  const gutter = 10

  const labelColSpan = 9
  const dataColSpan = 15

  const isProject = parseInt(split.projectId ?? '0') > 0

  // !isProject added here because we don't want to show the crown next to
  // a project recipient whose token benefiary is the owner of this project
  const isOwner =
    (projectOwnerAddress === split.beneficiary && !isProject) || isProjectOwner

  const distributionLimitIsInfinite =
    !distributionLimit || parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT)

  // If percentage has greater than 2 dp it will be rounded in the UI
  const percentIsRounded =
    split.percent !== SPLITS_TOTAL_PERCENT &&
    (split.percent / SPLITS_TOTAL_PERCENT).toString().split('.')[1]?.length > 4

  const cursor = isLocked ? 'default' : 'pointer'

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
    >
      <Space
        direction="vertical"
        style={{
          width: '100%',
          color: colors.text.primary,
          cursor,
        }}
        onClick={!isLocked ? () => setEditSplitModalOpen(true) : undefined}
      >
        {split.projectId && parseInt(split.projectId) > 0 ? (
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={labelColSpan}>
              <label style={{ cursor }}>
                <Trans>Project ID:</Trans>
              </label>{' '}
            </Col>
            <Col span={dataColSpan}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ cursor }}>{split.projectId}</span>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={labelColSpan}>
              <label style={{ cursor }}>
                <Trans>Address:</Trans>
              </label>{' '}
            </Col>
            <Col span={dataColSpan}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {isOwner && !split.beneficiary ? (
                  <span style={{ cursor }}>
                    <Trans>Project owner (you)</Trans>
                  </span>
                ) : (
                  <span style={{ cursor: 'pointer' }}>
                    <FormattedAddress address={split.beneficiary} />
                  </span>
                )}
                {isOwner && (
                  <Tooltip title={t`Project owner`}>
                    <CrownFilled />
                  </Tooltip>
                )}
              </div>
            </Col>
          </Row>
        )}

        {parseInt(split.projectId ?? '0') > 0 ? (
          <Row>
            <Col span={labelColSpan}>
              <label style={{ cursor }}>
                <Trans>Token beneficiary:</Trans>
              </label>
            </Col>
            <Col span={dataColSpan}>
              <span style={{ cursor: 'pointer' }}>
                <FormattedAddress address={split.beneficiary} />
              </span>
            </Col>
          </Row>
        ) : null}

        <Row gutter={gutter} style={{ width: '100%' }} align="middle">
          <Col span={labelColSpan}>
            <label style={{ cursor }}>
              {distributionLimitIsInfinite ? (
                <Trans>Percentage:</Trans>
              ) : (
                <Trans>Amount:</Trans>
              )}
            </label>
          </Col>
          <Col span={dataColSpan}>
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
                <Space size="small" direction="horizontal">
                  {!distributionLimitIsInfinite && (
                    <span>
                      <CurrencySymbol currency={currencyName} />
                      {round(
                        amountFromPercent({
                          percent: preciseFormatSplitPercent(split.percent),
                          amount: distributionLimit,
                        }),
                        currencyName === 'USD' ? 4 : 2,
                      )}
                    </span>
                  )}
                  <span>
                    <Parens withParens={!distributionLimitIsInfinite}>
                      {percentIsRounded ? '~' : null}
                      {formatSplitPercent(BigNumber.from(split.percent))}%
                    </Parens>
                  </span>
                </Space>
              </span>
            </div>
          </Col>
        </Row>

        {split.lockedUntil ? (
          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={labelColSpan}>
              <label style={{ cursor }}>
                <Trans>Locked:</Trans>
              </label>
            </Col>
            <Col span={dataColSpan}>
              until {formatDate((split.lockedUntil ?? 0) * 1000, 'yyyy-MM-DD')}
            </Col>
          </Row>
        ) : null}
      </Space>

      {isLocked ? (
        <>
          {!isOwner ? (
            <Tooltip title={<Trans>Payout is locked</Trans>}>
              <LockOutlined
                style={{ color: colors.icon.disabled, paddingTop: '4px' }}
              />
            </Tooltip>
          ) : (
            <TooltipIcon
              iconStyle={{ paddingTop: '4px' }}
              tip={
                <Trans>
                  You have configured for all funds to be distributed from the
                  treasury. Your current payouts do not sum to 100%, so the
                  remainder will go to the project owner.
                </Trans>
              }
            />
          )}
        </>
      ) : (
        <Tooltip title={<Trans>Delete payout</Trans>}>
          <Button
            type="text"
            onClick={e => {
              onSplitDelete?.(split)
              e.stopPropagation()
            }}
            icon={<DeleteOutlined />}
            style={{ height: 16 }}
          />
        </Tooltip>
      )}
      {!isLocked ? (
        <DistributionSplitModal
          visible={editSplitModalOpen}
          onSplitsChanged={onSplitsChanged}
          mode={'Edit'}
          splits={splits}
          editingSplit={split}
          distributionLimit={distributionLimit}
          setDistributionLimit={setDistributionLimit}
          onClose={() => setEditSplitModalOpen(false)}
          currencyName={currencyName}
          onCurrencyChange={onCurrencyChange}
        />
      ) : null}
    </div>
  )
}
