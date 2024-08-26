import { t, Trans } from '@lingui/macro'
import { CreateButton } from 'components/buttons/CreateButton/CreateButton'
import { BigNumber } from 'ethers'
import { useModal } from 'hooks/useModal'

import { SplitPortion, SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import round from 'lodash/round'
import { amountFromPercent } from 'packages/v4/utils/distributions'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { ReactNode, useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { fromWad } from 'utils/format/formatNumber'
import { roundIfCloseToNextInteger } from 'utils/math'
import { zeroAddress } from 'viem'
import {
  AddEditAllocationModal,
  AddEditAllocationModalEntity,
} from './AddEditAllocationModal'
import { Allocation, AllocationSplit } from './Allocation'

type AddButtonSize = 'small' | 'large'

export const allocationId = (
  beneficiary: string,
  projectIdHex: string | undefined,
) => {
  const hasProjectId = Boolean(projectIdHex && projectIdHex !== '0x00')
  return `${beneficiary}${hasProjectId ? `-${projectIdHex}` : ''}`
}

export const AllocationList = ({
  allocationName = t`allocation`,
  isEditable = true,
  addButtonSize,
  availableModes,
  children,
}: {
  allocationName?: string
  isEditable?: boolean
  addButtonSize?: AddButtonSize
  availableModes: Set<'amount' | 'percentage'>
  children: (
    modalOperations: ReturnType<typeof useModal>,
    allocationOperations: ReturnType<
      typeof Allocation.useAllocationInstance
    > & { setSelectedAllocation: (a: AllocationSplit | undefined) => void },
  ) => ReactNode
}) => {
  const allocationInstance = Allocation.useAllocationInstance()
  const {
    setAllocations,
    upsertAllocation,
    setTotalAllocationAmount,
    totalAllocationAmount,
    allocations,
  } = allocationInstance

  const [selectedAllocation, _setSelectedAllocation] =
    useState<AddEditAllocationModalEntity>()
  const modal = useModal()

  const setSelectedAllocation = useCallback(
    (value: AllocationSplit | undefined) => {
      const entity = value
        ? allocationToEntity(value, totalAllocationAmount, availableModes)
        : undefined
      _setSelectedAllocation(entity)
    },
    [totalAllocationAmount, availableModes],
  )

  const removeAllocation = useCallback(
    (id: string) => {
      const allocation = allocations.find(a => a.id === id)
      if (!allocation) return

      if (
        !totalAllocationAmount ||
        totalAllocationAmount === MAX_PAYOUT_LIMIT
      ) {
        allocationInstance.removeAllocation(id)
        return
      }

      const totalAmount = parseFloat(fromWad(totalAllocationAmount))
      const removedAmount = (allocation.percent.formatPercentage() / 100) * totalAmount

      const totalAmountAfterRemoval = roundIfCloseToNextInteger(
        totalAmount - removedAmount,
      )

      const adjustedAllocations = allocations
        .filter(a => a.id !== allocation.id)
        .map(alloc => {
          const currentAmount = amountFromPercent({
            percent: alloc.percent.formatPercentage(),
            amount: totalAmount.toString(),
          })
          const newPercent = (currentAmount / totalAmountAfterRemoval) * 100
          return { ...alloc, percent: new SplitPortion(newPercent) }
        })

      setAllocations(adjustedAllocations)
      setTotalAllocationAmount?.(BigInt(totalAmountAfterRemoval))
    },
    [
      allocationInstance,
      allocations,
      setAllocations,
      setTotalAllocationAmount,
      totalAllocationAmount,
    ],
  )

  const onModalOk = useCallback(
    (result: AddEditAllocationModalEntity) => {
      const isEditing = !!selectedAllocation
      if (result.projectOwner) {
        if (!setTotalAllocationAmount) {
          throw new Error(
            'Allocation amount passed but AllocationList has no totalAllocationAmount set',
          )
        }

        const originalTotal = parseFloat(
          fromWad(totalAllocationAmount ?? BigNumber.from(0)),
        )
        let totalAmount = originalTotal

        if (isEditing) {
          if (!selectedAllocation.projectOwner)
            throw new Error('selected allocation is not owner')
          totalAmount = Math.max(
            0,
            totalAmount - parseFloat(selectedAllocation.amount),
          )
        }

        totalAmount += parseFloat(result.amount)

        const adjustedAllocations = allocations.map(alloc => {
          const currentAmount = amountFromPercent({
            percent: alloc.percent.formatPercentage(),
            amount: originalTotal.toString(),
          })
          const newPercent = (currentAmount / totalAmount) * 100
          return { ...alloc, percent: new SplitPortion(newPercent) }
        })
        setAllocations(adjustedAllocations)
        setTotalAllocationAmount(BigInt(totalAmount))
      } else {
        if (result.amount.isPercent) {
          const allocation = entityToAllocation(result)
          upsertAllocation(allocation)
        } else {
          if (!totalAllocationAmount) {
            throw new Error(
              'Allocation amount passed but AllocationList has no totalAllocationAmount set',
            )
          }

          let total = Number(totalAllocationAmount)

          // checks original ID
          const existingAllocation = isEditing
            ? allocations.find(a => a.id === result.previousId)
            : undefined


          if (existingAllocation) {
            const existingAmount =
              (existingAllocation.percent.formatPercentage() / 100.0) * total
              total = Math.max(0, total - existingAmount)
          }

          const newOrEditedAllocation = entityToAllocation(result)

          let newAllocationInserted = false
          const adjustedAllocations: AllocationSplit[] = allocations.map(
            allocation => {
              // skip if existing
              if (allocation.id === existingAllocation?.id) {
                newAllocationInserted = true
                return newOrEditedAllocation
              }
              const currentAmount = amountFromPercent({
                percent: allocation.percent.formatPercentage(),
                amount: total.toString(),
              })

              const newPercent =
                (currentAmount / total) * 100
              return {
                ...allocation,
                percent: new SplitPortion(newPercent),
              }
            },
          )

          setAllocations([
            ...adjustedAllocations,
            // Only insert new if it wasn't added previously
            ...(newAllocationInserted ? [] : [newOrEditedAllocation]),
          ])
          setTotalAllocationAmount?.(BigInt(total))
        }
      }

      modal.close()
      setSelectedAllocation(undefined)
    },
    [
      allocations,
      modal,
      selectedAllocation,
      setAllocations,
      setSelectedAllocation,
      setTotalAllocationAmount,
      totalAllocationAmount,
      upsertAllocation,
    ],
  )
  const onModalCancel = useCallback(() => {
    modal.close()
    setSelectedAllocation(undefined)
  }, [modal, setSelectedAllocation])

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {children(modal, {
          ...allocationInstance,
          setSelectedAllocation,
          removeAllocation,
        })}
        {isEditable && (
          <CreateButton
            size="large"
            className={twMerge(
              'overflow-hidden text-ellipsis',
              addButtonSize === 'large' ? 'mt-4 h-24' : undefined,
            )}
            onClick={modal.open}
          >
            <Trans>Add {allocationName ? allocationName : ''}</Trans>
          </CreateButton>
        )}
      </div>
      <AddEditAllocationModal
        allocationName={allocationName}
        availableModes={availableModes}
        editingData={selectedAllocation}
        open={modal.visible}
        onOk={onModalOk}
        onCancel={onModalCancel}
      />
    </>
  )
}

const entityToAllocation = (
  entity: AddEditAllocationModalEntity & { projectOwner: false },
): AllocationSplit => {
  const allocationProps = {
    id: allocationId(entity.beneficiary!, entity.projectId ? `pid-${entity.projectId}` : undefined),
    beneficiary: entity.beneficiary ?? zeroAddress,
    projectId: BigInt(entity.projectId ?? 0),
    lockedUntil: entity.lockedUntil ?? 0,
    percent: entity.amount.value ? parseFloat(entity.amount.value) : 0,
    preferAddToBalance: false,
    hook: zeroAddress,
  }
  const percent = allocationProps.percent
  const percentPPB = round((percent / 100) * SPLITS_TOTAL_PERCENT)

  return { ...allocationProps, percent: new SplitPortion(percentPPB) }
}

const allocationToEntity = (
  alloc: AllocationSplit,
  totalAllocationAmount: bigint | undefined,
  availableModes: Set<'amount' | 'percentage'>,
): AddEditAllocationModalEntity & { projectOwner: false } => {
  const isPercent =
    !totalAllocationAmount ||
    totalAllocationAmount === MAX_PAYOUT_LIMIT ||
    !availableModes.has('amount') // override if amount not available in the instance
  let amount = { value: alloc.percent.formatPercentage().toString(), isPercent }

  if (!isPercent && totalAllocationAmount) {
    const total = parseFloat(fromWad(totalAllocationAmount))
    const a = (alloc.percent.formatPercentage() / 100.0) * total
    amount = { value: a.toString(), isPercent: false }
  }
  return {
    projectOwner: false,
    projectId: alloc.projectId.toString(),
    beneficiary: alloc.beneficiary,
    amount,
    lockedUntil: alloc.lockedUntil,
  }
}
