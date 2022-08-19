import { t, Trans } from '@lingui/macro'
import { Button, Modal, Skeleton, Space } from 'antd'
import Callout from 'components/Callout'
import DistributionSplitCard from 'components/v2/shared/DistributionSplitsSection/DistributionSplitCard'
import DistributionSplitModal from 'components/v2/shared/DistributionSplitsSection/DistributionSplitModal'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useSetProjectSplits } from 'hooks/v2/transactor/SetProjectSplits'
import { filter, isEqual } from 'lodash'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { defaultSplit, Split } from 'models/v2/splits'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { formatWad } from 'utils/formatNumber'

import { V2CurrencyName } from 'utils/v2/currency'
import { getTotalSplitsPercentage } from 'utils/v2/distributions'
import { MAX_DISTRIBUTION_LIMIT, splitPercentFrom } from 'utils/v2/math'

import { SplitCsvUpload } from 'components/SplitCsvUpload/SplitCsvUpload'
import TooltipLabel from 'components/TooltipLabel'
import CurrencySymbol from 'components/CurrencySymbol'

import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/v2/splits'

const OwnerSplitCard = ({ splits }: { splits: Split[] }) => {
  const { userAddress } = useContext(NetworkContext)
  const { distributionLimit, distributionLimitCurrency } =
    useContext(V2ProjectContext)
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
    V2CurrencyName(
      distributionLimitCurrency?.toNumber() as V2CurrencyOption | undefined,
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

const DistributionLimitHeader = ({
  style,
}: {
  style?: React.CSSProperties
}) => {
  const {
    distributionLimit,
    distributionLimitCurrency,
    loading: { distributionLimitLoading, fundingCycleLoading },
  } = useContext(V2ProjectContext)

  const currency = V2CurrencyName(
    distributionLimitCurrency?.toNumber() as V2CurrencyOption,
  )
  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  )
  const projectLoading = distributionLimitLoading && fundingCycleLoading

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', ...style }}>
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
                    <CurrencySymbol currency={currency} />
                    {formatWad(distributionLimit)}
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

export const EditPayoutsModal = ({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const {
    payoutSplits: contextPayoutSplits,
    fundingCycle,
    distributionLimitCurrency,
    distributionLimit,
  } = useContext(V2ProjectContext)
  const setProjectSplits = useSetProjectSplits({
    domain: fundingCycle?.configuration?.toString(),
  })
  const [modalLoading, setModalLoading] = useState<boolean>(false)

  const currencyName =
    V2CurrencyName(
      distributionLimitCurrency?.toNumber() as V2CurrencyOption | undefined,
    ) ?? 'ETH'

  // Must differentiate between splits loaded from redux and
  // ones just added to be able to still edit splits you've
  // added with a lockedUntil
  const [editingSplits, setEditingSplits] = useState<Split[]>([])

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
  }, [contextPayoutSplits, visible])

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

  const onSplitsConfirmed = useCallback(
    async (splits: Split[]) => {
      if (totalSplitsPercentageInvalid) return
      setModalLoading(true)
      const tx = await setProjectSplits(
        {
          groupedSplits: {
            group: ETH_PAYOUT_SPLIT_GROUP,
            splits,
          },
        },
        {
          onConfirmed: () => {
            setModalLoading(false)
            onOk()
          },
          onError: () => setModalLoading(false),
        },
      )
      if (!tx) {
        setModalLoading(false)
      }
    },
    [onOk, setProjectSplits, totalSplitsPercentageInvalid],
  )

  const onSplitsChanged = useCallback((newSplits: Split[]) => {
    setEditingSplits(newSplits)
  }, [])

  const renderSplitCard = useCallback(
    (split: Split, index: number, isLocked?: boolean) => {
      const distributionLimitIsInfinite = distributionLimit?.eq(
        MAX_DISTRIBUTION_LIMIT,
      ) // hack to work around rounding error in parseWad in `DistributionSplitCard
      return (
        <DistributionSplitCard
          key={split.beneficiary ?? index}
          split={split}
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
      distributionLimit,
      editingSplits,
      currencyName,
      onSplitsChanged,
      editableSplits,
      lockedSplits,
    ],
  )

  return (
    <>
      <Modal
        visible={visible}
        confirmLoading={modalLoading}
        title={<Trans>Edit payouts</Trans>}
        okText={
          <span>
            <Trans>Save payouts</Trans>
          </span>
        }
        cancelText={modalLoading ? t`Close` : t`Cancel`}
        onOk={() => onSplitsConfirmed(editingSplits)}
        onCancel={onCancel}
        width={720}
        destroyOnClose
      >
        <Space
          direction="vertical"
          size="middle"
          style={{ width: '100%', marginBottom: '2rem' }}
        >
          <div>
            <Trans>
              Reconfigure payouts as percentages of your distribution limit.
            </Trans>
          </div>
          <Callout>
            <Trans>Changes to payouts will take effect immediately.</Trans>
          </Callout>
        </Space>

        <Space
          direction="vertical"
          style={{ width: '100%', minHeight: 0 }}
          size="middle"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <DistributionLimitHeader />

            <SplitCsvUpload onChange={onSplitsChanged} />
          </div>
          <Space style={{ width: '100%' }} direction="vertical" size="small">
            {editableSplits.map((split, index) =>
              renderSplitCard(split, index),
            )}
          </Space>
          {lockedSplits ? (
            <Space style={{ width: '100%' }} direction="vertical" size="small">
              {lockedSplits.map((split, index) =>
                renderSplitCard(split, index, true),
              )}
            </Space>
          ) : null}
          {ownerSplitCardVisible ? (
            <OwnerSplitCard splits={editingSplits} />
          ) : null}
          {totalSplitsPercentageInvalid && (
            <span style={{ color: colors.text.failure }}>
              <Trans>Sum of percentages cannot exceed 100%.</Trans>
            </span>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: colors.text.secondary,
            }}
          >
            <div
              style={{
                color:
                  totalSplitsPercentage > 100
                    ? colors.text.warn
                    : colors.text.secondary,
              }}
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
          >
            <Trans>Add payout</Trans>
          </Button>
        </Space>
      </Modal>
      <DistributionSplitModal
        visible={addSplitModalVisible}
        onSplitsChanged={onSplitsChanged}
        distributionLimit={
          distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)
            ? undefined
            : formatWad(distributionLimit, { thousandsSeparator: '' })
        }
        overrideDistTypeWithBoth={true}
        mode={'Add'}
        splits={editingSplits}
        currencyName={currencyName}
        onClose={() => setAddSplitModalVisible(false)}
      />
    </>
  )
}
