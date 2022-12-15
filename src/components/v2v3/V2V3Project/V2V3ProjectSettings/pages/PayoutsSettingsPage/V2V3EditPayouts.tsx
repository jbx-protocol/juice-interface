import { PlusCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space } from 'antd'
import { CsvUpload } from 'components/CsvUpload/CsvUpload'
import TooltipLabel from 'components/TooltipLabel'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import filter from 'lodash/filter'
import isEqual from 'lodash/isEqual'
import { defaultSplit, Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { getTotalSplitsPercentage } from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT, splitPercentFrom } from 'utils/v2v3/math'

import { Callout } from 'components/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import CurrencySymbol from 'components/CurrencySymbol'
import { DistributionSplitCard } from 'components/v2v3/shared/DistributionSplitCard'
import { DistributionSplitModal } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/DistributionSplitModal'
import { useUserAddress } from 'hooks/Wallet/hooks'
import { classNames } from 'utils/classNames'
import { parseV2SplitsCsv } from 'utils/csv'

const OwnerSplitCard = ({ splits }: { splits: Split[] }) => {
  const userAddress = useUserAddress()
  const { distributionLimit, distributionLimitCurrency } =
    useContext(V2V3ProjectContext)
  const remainingSplitsPercentage = 100 - getTotalSplitsPercentage(splits)
  const ownerSplit = useMemo<Split>(
    () => ({
      ...defaultSplit,
      beneficiary: userAddress,
      percent: splitPercentFrom(remainingSplitsPercentage).toNumber(),
    }),
    [remainingSplitsPercentage, userAddress],
  )
  const currencyName =
    V2V3CurrencyName(
      distributionLimitCurrency?.toNumber() as V2V3CurrencyOption | undefined,
    ) ?? 'ETH'
  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  ) // hack to work around rounding error in parseWad in `DistributionSplitCard
  return (
    <DistributionSplitCard
      split={ownerSplit}
      splits={splits}
      distributionLimit={
        distributionLimitIsInfinite
          ? undefined
          : formatWad(distributionLimit, { thousandsSeparator: '' })
      }
      currencyName={currencyName}
      isLocked
      isProjectOwner
    />
  )
}

const DistributionLimitHeader = () => {
  const {
    distributionLimit,
    distributionLimitCurrency,
    loading: { distributionLimitLoading, fundingCycleLoading },
  } = useContext(V2V3ProjectContext)

  const currency = V2V3CurrencyName(
    distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
  )
  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  )
  const projectLoading = distributionLimitLoading && fundingCycleLoading

  return (
    <div className="flex justify-between">
      <Skeleton
        loading={projectLoading}
        paragraph={{ rows: 1, width: ['80%'] }}
        title={false}
        active
      >
        <TooltipLabel
          tip={<Trans>This funding cycle's distribution limit.</Trans>}
          label={
            <>
              {distributionLimitIsInfinite ? (
                <Trans>No limit (infinite)</Trans>
              ) : distributionLimit?.eq(0) ? (
                <Trans>
                  <strong>Zero</strong> Distribution Limit
                </Trans>
              ) : (
                <Trans>
                  <strong>
                    {currency === 'ETH' ? (
                      <ETHAmount amount={distributionLimit} />
                    ) : (
                      <>
                        <CurrencySymbol currency={currency} />
                        {formatWad(distributionLimit)}
                      </>
                    )}
                  </strong>{' '}
                  Distribution Limit
                </Trans>
              )}
            </>
          }
        />
      </Skeleton>
    </div>
  )
}

export const V2V3EditPayouts = ({
  editingSplits,
  setEditingSplits,
  open,
}: {
  editingSplits: Split[]
  setEditingSplits: (splits: Split[]) => void
  open?: boolean
}) => {
  const {
    payoutSplits: contextPayoutSplits,
    distributionLimitCurrency,
    distributionLimit,
  } = useContext(V2V3ProjectContext)

  const currencyName =
    V2V3CurrencyName(
      distributionLimitCurrency?.toNumber() as V2V3CurrencyOption | undefined,
    ) ?? 'ETH'

  // Must differentiate between splits loaded from redux and
  // ones just added to be able to still edit splits you've
  // added with a lockedUntil

  const isLockedSplit = useCallback(
    ({ split }: { split: Split }) => {
      const now = new Date().valueOf() / 1000
      // Checks if the given split exists in the projectContext splits.
      // If it doesn't, then it means it was just added or edited is which case
      // we want to still be able to edit it
      const confirmedSplitsIncludesSplit =
        contextPayoutSplits?.find(confirmedSplit =>
          isEqual(confirmedSplit, split),
        ) !== undefined
      return (
        split.lockedUntil &&
        split.lockedUntil > now &&
        confirmedSplitsIncludesSplit
      )
    },
    [contextPayoutSplits],
  )

  // Load original splits from context into editing splits.
  useEffect(() => {
    setEditingSplits(contextPayoutSplits ?? [])
  }, [contextPayoutSplits, setEditingSplits, open])

  const lockedSplits = useMemo(
    () => editingSplits.filter(split => isLockedSplit({ split })),
    [editingSplits, isLockedSplit],
  )

  const editableSplits = useMemo(
    () => editingSplits.filter(split => !isLockedSplit({ split })),
    [editingSplits, isLockedSplit],
  )

  const [addSplitModalVisible, setAddSplitModalVisible] =
    useState<boolean>(false)

  const totalSplitsPercentage = useMemo(
    () => getTotalSplitsPercentage(editingSplits),
    [editingSplits],
  )
  const totalSplitsPercentageInvalid = totalSplitsPercentage > 100
  const remainingSplitsPercentage = 100 - totalSplitsPercentage
  const ownerSplitCardVisible =
    remainingSplitsPercentage > 0 && distributionLimit?.gt(0)
  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  )

  const onSplitsChanged = useCallback(
    (newSplits: Split[]) => {
      setEditingSplits(newSplits)
    },
    [setEditingSplits],
  )

  const renderSplitCard = useCallback(
    (split: Split, index: number, isLocked?: boolean) => {
      return (
        <DistributionSplitCard
          key={split.beneficiary ?? index}
          split={split}
          isEditPayoutPage
          splits={editingSplits}
          distributionLimit={
            distributionLimitIsInfinite
              ? undefined
              : formatWad(distributionLimit, { thousandsSeparator: '' })
          }
          currencyName={currencyName}
          isLocked={isLocked}
          onSplitsChanged={onSplitsChanged}
          onSplitDelete={deletedSplit => {
            const newEdited = filter(
              editableSplits,
              s => s.beneficiary !== deletedSplit.beneficiary,
            )
            onSplitsChanged(newEdited.concat(lockedSplits))
          }}
        />
      )
    },
    [
      editingSplits,
      distributionLimitIsInfinite,
      distributionLimit,
      currencyName,
      onSplitsChanged,
      editableSplits,
      lockedSplits,
    ],
  )

  return (
    <>
      <Space className="mb-8 w-full" direction="vertical" size="middle">
        <div>
          <Trans>
            Reconfigure payouts as percentages of your distribution limit.
          </Trans>
        </div>
        <Callout.Info>
          <Trans>Changes to payouts will take effect immediately.</Trans>
        </Callout.Info>
      </Space>

      <Space className="min-h-0 w-full" direction="vertical" size="middle">
        <div className="flex justify-between">
          <DistributionLimitHeader />

          <CsvUpload
            onChange={onSplitsChanged}
            templateUrl={'/assets/csv/v2-splits-template.csv'}
            parser={parseV2SplitsCsv}
          />
        </div>
        <Space className="w-full" direction="vertical" size="small">
          {editableSplits.map((split, index) => renderSplitCard(split, index))}
        </Space>
        {lockedSplits ? (
          <Space className="w-full" direction="vertical" size="small">
            {lockedSplits.map((split, index) =>
              renderSplitCard(split, index, true),
            )}
          </Space>
        ) : null}
        {ownerSplitCardVisible ? (
          <OwnerSplitCard splits={editingSplits} />
        ) : null}
        {totalSplitsPercentageInvalid && (
          <span className="text-error-500 dark:text-error-400">
            <Trans>Sum of percentages cannot exceed 100%.</Trans>
          </span>
        )}

        <div className="flex justify-between text-grey-500 dark:text-grey-300">
          <div
            className={classNames(
              totalSplitsPercentage > 100
                ? 'text-warning-800 dark:text-warning-100'
                : 'text-grey-900 dark:text-slate-100',
            )}
          >
            <Trans>Total: {totalSplitsPercentage.toFixed(2)}%</Trans>
          </div>
        </div>
        <Button
          type="dashed"
          onClick={() => {
            setAddSplitModalVisible(true)
          }}
          block
          icon={<PlusCircleOutlined />}
        >
          <span>
            <Trans>Add payout recipient</Trans>
          </span>
        </Button>
      </Space>
      <DistributionSplitModal
        isEditPayoutPage
        open={addSplitModalVisible}
        distributionLimit={
          distributionLimitIsInfinite
            ? undefined
            : formatWad(distributionLimit, { thousandsSeparator: '' })
        }
        onSplitsChanged={onSplitsChanged}
        mode={'Add'}
        splits={editingSplits}
        currencyName={currencyName}
        onClose={() => setAddSplitModalVisible(false)}
      />
    </>
  )
}
