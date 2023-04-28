import { t, Trans } from '@lingui/macro'
import { Form, Radio } from 'antd'
import { FormItemExt } from 'components/formItems/formItemExt'
import TooltipIcon from 'components/TooltipIcon'
import { Allocation, AllocationSplit } from 'components/v2v3/shared/Allocation'
import DistributionLimit from 'components/v2v3/shared/DistributionLimit'
import { OwnerPayoutCard } from 'components/v2v3/shared/PayoutCard'
import { PayoutCard } from 'components/v2v3/shared/PayoutCard/PayoutCard'
import { FEES_EXPLANATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { CurrencyName } from 'constants/currency'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { PayoutsSelection } from 'models/payoutsSelection'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { classNames } from 'utils/classNames'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { ceilIfCloseToNextInteger } from 'utils/math'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { getTotalSplitsPercentage } from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT, splitPercentFrom } from 'utils/v2v3/math'
import { DistributionSplitModal } from '../../../DistributionSplitModal'
import { PayoutConfigurationExplainerCollapse } from './PayoutConfigurationExplainerCollapse'
import SpecificLimitModal from './SpecificLimitModal'

type DistributionType = 'amount' | 'percent'

export function DistributionSplitsSection({
  distributionLimit,
  setDistributionLimit,
  currencyName,
  onCurrencyChange,
  editableSplits,
  lockedSplits,
  projectOwnerAddress,
  onSplitsChanged,
  formItemProps,
}: {
  distributionLimit: string | undefined
  setDistributionLimit: (distributionLimit: string) => void
  currencyName: CurrencyName
  onCurrencyChange: (currencyName: CurrencyName) => void
  editableSplits: Split[]
  lockedSplits: Split[]
  projectOwnerAddress: string | undefined
  onSplitsChanged: (splits: Split[]) => void
} & FormItemExt) {
  const {
    payoutSplits: contextPayoutSplits,
    distributionLimitCurrency: distributionLimitCurrencyBigNumber,
  } = useContext(V2V3ProjectContext)
  const distributionLimitIsInfinite =
    !distributionLimit || parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT)

  const [addSplitModalVisible, setAddSplitModalVisible] =
    useState<boolean>(false)

  const [distributionType, setDistributionType] = useState<DistributionType>(
    distributionLimitIsInfinite ? 'percent' : 'amount',
  )

  const [specificLimitModalOpen, setSpecificLimitModalOpen] =
    useState<boolean>(false)

  const allSplits = lockedSplits.concat(editableSplits)

  const payoutsSelection: PayoutsSelection = useMemo(() => {
    // As we dont have control of amounts/percentage out of create, always use
    // amounts, and fall back to percentages when amounts is unavailable.
    if (
      !distributionLimit ||
      parseWad(distributionLimit).eq(0) ||
      parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT)
    ) {
      return 'percentages'
    }
    return 'amounts'
  }, [distributionLimit])

  const distributionLimitCurrency = useMemo(
    () => distributionLimitCurrencyBigNumber?.toNumber() as V2V3CurrencyOption,
    [distributionLimitCurrencyBigNumber],
  )

  const onAllocationsChanged = useCallback(
    (allocations: AllocationSplit[]) =>
      onSplitsChanged(allocations.map(allocationToSplit)),
    [onSplitsChanged],
  )

  useEffect(() => {
    setDistributionType(distributionLimitIsInfinite ? 'percent' : 'amount')
  }, [distributionLimitIsInfinite])

  if (!allSplits) return null

  const totalSplitsPercentage = getTotalSplitsPercentage(allSplits)
  const totalSplitsPercentageInvalid = totalSplitsPercentage > 100
  const remainingSplitsPercentage = 100 - getTotalSplitsPercentage(allSplits) // this amount goes to the project owner
  let ownerSplit: Split | undefined
  if (remainingSplitsPercentage) {
    ownerSplit = {
      beneficiary: projectOwnerAddress,
      percent: splitPercentFrom(remainingSplitsPercentage).toNumber(),
    } as Split
  }

  const isLockedAllocation = useCallback(
    (allocation: AllocationSplit) => {
      const now = new Date().valueOf() / 1000
      if (!allocation.lockedUntil || allocation.lockedUntil < now) return false

      // Checks if the given split exists in the projectContext splits.
      // If it doesn't, then it means it was just added or edited is which case
      // we want to still be able to edit it
      const contextMatch = contextPayoutSplits
        ?.map(splitToAllocation)
        .find(confirmed => confirmed.id === allocation.id)
      if (contextMatch && contextMatch.lockedUntil) {
        // Check to make sure that the original allocation is actually still locked
        return contextMatch.lockedUntil > now
      }
      return false
    },
    [contextPayoutSplits],
  )

  return (
    <Form.Item
      {...formItemProps}
      className={classNames('mb-0 block', formItemProps?.className)}
    >
      <div className="flex min-h-0 flex-col gap-6">
        <Form.Item className="mb-0">
          <p className="text-black dark:text-slate-100">
            <Trans>Choose how you would like to set up payouts.</Trans>
          </p>
          <PayoutConfigurationExplainerCollapse className="mb-4" />
          <Radio.Group
            onChange={e => {
              const newType = e.target.value
              if (newType === 'percent') {
                setDistributionLimit(fromWad(MAX_DISTRIBUTION_LIMIT))
                setDistributionType(newType)
              } else if (newType === 'amount') {
                if (editableSplits.length) {
                  setSpecificLimitModalOpen(true)
                } else {
                  setDistributionLimit('0')
                  setDistributionType(newType)
                }
                if (
                  remainingSplitsPercentage &&
                  remainingSplitsPercentage !== 100 &&
                  ownerSplit
                ) {
                  editableSplits.push(ownerSplit)
                }
              }
            }}
            value={distributionType}
          >
            <div className="flex flex-col gap-2">
              <Radio value="amount">
                <Trans>Amounts</Trans>
                <p className="text-sm font-normal">
                  <Trans>
                    Pay out specific amounts of ETH to addresses and projects
                    each cycle. Any remaining ETH will stay in the project for
                    future cycles.
                  </Trans>
                </p>
              </Radio>
              <Radio value="percent">
                <Trans>Percentages</Trans>
                <p className="text-sm font-normal">
                  <Trans>
                    Pay out percentages of your project's total ETH balance to
                    addresses or projects. No ETH will stay in the project,
                    making token redemption impossible.
                  </Trans>
                </p>
              </Radio>
            </div>
          </Radio.Group>
        </Form.Item>

        <Allocation
          value={editableSplits.map(splitToAllocation)}
          onChange={onAllocationsChanged}
          totalAllocationAmount={parseWad(distributionLimit)}
          allocationCurrency={distributionLimitCurrency}
        >
          <div className="flex flex-col gap-4">
            {payoutsSelection === 'percentages' ||
              (ceilIfCloseToNextInteger(totalSplitsPercentage) < 100 && (
                <OwnerPayoutCard payoutsSelection={payoutsSelection} />
              ))}
            <Allocation.List
              allocationName={t`payout`}
              availableModes={new Set(['percentage'])}
            >
              {(
                modal,
                { allocations, removeAllocation, setSelectedAllocation },
              ) => (
                <>
                  {allocations
                    .filter(alloc => !isLockedAllocation(alloc))
                    .map(allocation => (
                      <PayoutCard
                        payoutsSelection={payoutsSelection}
                        key={allocation.id}
                        allocation={allocation}
                        onDeleteClick={() => removeAllocation(allocation.id)}
                        onClick={() => {
                          setSelectedAllocation(allocation)
                          modal.open()
                        }}
                      />
                    ))}

                  {allocations.filter(isLockedAllocation).map(allocation => (
                    <PayoutCard
                      payoutsSelection={payoutsSelection}
                      key={allocation.id}
                      allocation={allocation}
                    />
                  ))}
                </>
              )}
            </Allocation.List>
          </div>
        </Allocation>

        {totalSplitsPercentageInvalid && (
          <span className="font-medium text-error-500 dark:text-error-400">
            <Trans>Sum of percentages cannot exceed 100%.</Trans>
          </span>
        )}

        <p className="text-secondary text-xs">
          <Trans>
            Payouts to Ethereum addresses incur a 2.5% JBX membership fee
          </Trans>{' '}
          <TooltipIcon tip={FEES_EXPLANATION} />
        </p>

        <div className="flex justify-between">
          <span className="text-black dark:text-slate-100">
            <Trans>
              Payouts{' '}
              <TooltipIcon
                tip={t`The total amount of payouts each cycle.`}
                placement={'topLeft'}
                iconClassName="mr-1"
              />
              :
            </Trans>
          </span>
          <span>
            <strong>
              <DistributionLimit
                distributionLimit={parseWad(distributionLimit)}
                currencyName={currencyName}
                showTooltip
              />
            </strong>
          </span>
        </div>
      </div>
      <DistributionSplitModal
        open={addSplitModalVisible}
        onSplitsChanged={onSplitsChanged}
        mode={'Add'}
        splits={allSplits}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimit}
        currencyName={currencyName}
        onCurrencyChange={onCurrencyChange}
        onClose={() => setAddSplitModalVisible(false)}
      />
      <SpecificLimitModal
        open={specificLimitModalOpen}
        onClose={() => setSpecificLimitModalOpen(false)}
        setDistributionLimit={setDistributionLimit}
        currencyName={currencyName}
        onCurrencyChange={onCurrencyChange}
      />
    </Form.Item>
  )
}
