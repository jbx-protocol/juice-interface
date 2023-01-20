import { CrownFilled, DeleteOutlined, LockOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space, Tooltip } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'
import TooltipIcon from 'components/TooltipIcon'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { CurrencyName } from 'constants/currency'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import round from 'lodash/round'
import { Split } from 'models/splits'
import { PropsWithChildren, useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import { formatDate } from 'utils/format/formatDate'
import { parseWad } from 'utils/format/formatNumber'
import { isProjectSplit } from 'utils/splits'
import { amountFromPercent } from 'utils/v2v3/distributions'
import {
  formatSplitPercent,
  MAX_DISTRIBUTION_LIMIT,
  preciseFormatSplitPercent,
  SPLITS_TOTAL_PERCENT,
} from 'utils/v2v3/math'
import { AllocatorBadge } from './FundingCycleConfigurationDrawers/AllocatorBadge'
import { DistributionSplitModal } from './FundingCycleConfigurationDrawers/DistributionSplitModal/DistributionSplitModal'

const Parens = ({
  withParens = false,
  children,
}: PropsWithChildren<{ withParens: boolean }>) => {
  if (withParens) return <>({children})</>
  return <>{children}</>
}

const gutter = 10
const labelColSpan = 9
const dataColSpan = 15

export function DistributionSplitCard({
  split,
  splits,
  distributionLimit,
  currencyName,
  isLocked,
  isProjectOwner,
  isEditPayoutPage,
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
  isEditPayoutPage?: boolean
  onSplitsChanged?: (splits: Split[]) => void
  onSplitDelete?: (split: Split) => void
  setDistributionLimit?: (distributionLimit: string) => void
  onCurrencyChange?: (currencyName: CurrencyName) => void
}) {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const [editSplitModalOpen, setEditSplitModalOpen] = useState<boolean>(false)

  const isProject = isProjectSplit(split)

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

  const amountFromPerc = round(
    amountFromPercent({
      percent: preciseFormatSplitPercent(split.percent),
      amount: distributionLimit ?? '0',
    }),
    currencyName === 'USD' ? 4 : 2,
  )

  return (
    <div
      className={classNames(
        'flex rounded-sm  border border-solid  p-2 transition-colors hover:border-smoke-500 dark:hover:border-slate-100',
        !isLocked
          ? 'border-smoke-300 dark:border-slate-300'
          : 'border-grey-200 dark:border-grey-700',
      )}
      role="button"
    >
      <Space
        className={classNames(
          'w-full text-black dark:text-slate-100',
          isLocked ? 'cursor-default' : 'cursor-pointer',
        )}
        direction="vertical"
        onClick={!isLocked ? () => setEditSplitModalOpen(true) : undefined}
      >
        {split.projectId && parseInt(split.projectId) > 0 ? (
          <Row gutter={gutter} className="w-full" align="middle">
            <Col span={labelColSpan}>
              <label
                className={classNames(
                  isLocked ? 'cursor-default' : 'cursor-pointer',
                )}
              >
                <Trans>Project:</Trans>
              </label>{' '}
            </Col>
            <Col span={dataColSpan}>
              <Space size="small">
                <V2V3ProjectHandleLink projectId={parseInt(split.projectId)} />
                <AllocatorBadge allocator={split.allocator} />
              </Space>
            </Col>
          </Row>
        ) : (
          <Row gutter={gutter} className="w-full" align="middle">
            <Col span={labelColSpan}>
              <label
                className={classNames(
                  isLocked ? 'cursor-default' : 'cursor-pointer',
                )}
              >
                <Trans>Address:</Trans>
              </label>{' '}
            </Col>
            <Col span={dataColSpan}>
              <div className="flex items-center justify-between">
                {isOwner && !split.beneficiary ? (
                  <span
                    className={classNames(
                      isLocked ? 'cursor-default' : 'cursor-pointer',
                    )}
                  >
                    <Trans>Project owner (you)</Trans>
                  </span>
                ) : (
                  <span className="cursor-pointer">
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

        {parseInt(split.projectId ?? '0') > 0 &&
        split.allocator === NULL_ALLOCATOR_ADDRESS ? (
          <Row>
            <Col span={labelColSpan}>
              <label
                className={classNames(
                  isLocked ? 'cursor-default' : 'cursor-pointer',
                )}
              >
                <Trans>Token beneficiary:</Trans>
              </label>
            </Col>
            <Col span={dataColSpan}>
              <span className="cursor-pointer">
                <FormattedAddress address={split.beneficiary} />
              </span>
            </Col>
          </Row>
        ) : null}

        <Row gutter={gutter} className="w-full" align="middle">
          <Col span={labelColSpan}>
            <label
              className={classNames(
                isLocked ? 'cursor-default' : 'cursor-pointer',
              )}
            >
              {distributionLimitIsInfinite ? (
                <Trans>Percentage:</Trans>
              ) : (
                <Trans>Amount:</Trans>
              )}
            </label>
          </Col>
          <Col span={dataColSpan}>
            <div className="flex w-full items-center justify-between">
              <span className="mr-2 w-[100px] max-w-[100px]">
                <Space size="small" direction="horizontal">
                  {!distributionLimitIsInfinite && (
                    <span>
                      {currencyName === 'ETH' ? (
                        <ETHAmount amount={parseWad(amountFromPerc)} />
                      ) : (
                        <>
                          <CurrencySymbol currency={currencyName} />
                          {amountFromPerc}
                        </>
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
          <Row gutter={gutter} className="w-full" align="middle">
            <Col span={labelColSpan}>
              <label
                className={classNames(
                  isLocked ? 'cursor-default' : 'cursor-pointer',
                )}
              >
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
              <LockOutlined className="pt-1 text-grey-400 dark:text-grey-400" />
            </Tooltip>
          ) : (
            <TooltipIcon
              iconClassName="pt-1"
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
            className="h-4"
            type="text"
            onClick={e => {
              onSplitDelete?.(split)
              e.stopPropagation()
            }}
            icon={<DeleteOutlined />}
          />
        </Tooltip>
      )}
      {!isLocked ? (
        <DistributionSplitModal
          open={editSplitModalOpen}
          onSplitsChanged={onSplitsChanged}
          mode={'Edit'}
          isEditPayoutPage={isEditPayoutPage}
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
