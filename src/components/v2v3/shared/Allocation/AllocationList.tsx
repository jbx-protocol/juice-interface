import { PlusCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { BigNumber } from 'ethers'
import { useModal } from 'hooks/useModal'
import { ReactNode, useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { roundIfCloseToNextInteger } from 'utils/math'
import { projectIdToHex } from 'utils/splits'
import { amountFromPercent } from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { CreateButton } from '../../../buttons/CreateButton/CreateButton'
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
        totalAllocationAmount.eq(MAX_DISTRIBUTION_LIMIT)
      ) {
        allocationInstance.removeAllocation(id)
        return
      }

      const totalAmount = parseFloat(fromWad(totalAllocationAmount))
      const removedAmount = (allocation.percent / 100) * totalAmount

      const totalAmountAfterRemoval = roundIfCloseToNextInteger(
        totalAmount - removedAmount,
      )

      const adjustedAllocations = allocations
        .filter(a => a.id !== allocation.id)
        .map(alloc => {
          const currentAmount = amountFromPercent({
            percent: alloc.percent,
            amount: totalAmount.toString(),
          })
          const newPercent = (currentAmount / totalAmountAfterRemoval) * 100
          return { ...alloc, percent: newPercent }
        })

      setAllocations(adjustedAllocations)
      setTotalAllocationAmount?.(parseWad(totalAmountAfterRemoval))
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
            percent: alloc.percent,
            amount: originalTotal.toString(),
          })
          const newPercent = (currentAmount / totalAmount) * 100
          return { ...alloc, percent: newPercent }
        })
        setAllocations(adjustedAllocations)
        setTotalAllocationAmount(parseWad(totalAmount))
      } else {
        if (result.amount.isPercent) {
          const allocation = entityToAllocation(result, undefined)
          upsertAllocation(allocation)
        } else {
          if (!totalAllocationAmount) {
            throw new Error(
              'Allocation amount passed but AllocationList has no totalAllocationAmount set',
            )
          }

          const originalTotal = parseFloat(
            fromWad(totalAllocationAmount ?? BigNumber.from(0)),
          )

          // checks original ID
          const existingAllocation = isEditing
            ? allocations.find(a => a.id === result.previousId)
            : undefined

          let totalAmount = originalTotal

          if (existingAllocation) {
            const existingAmount =
              (existingAllocation.percent / 100.0) * totalAmount
            totalAmount = Math.max(0, totalAmount - existingAmount)
          }
          const allocationAmount = parseWad(result.amount.value)

          // Only set new total if setTotalAllocationAmount available
          //   e.g. Edit payouts does not allow setting new total
          const newTotal = setTotalAllocationAmount
            ? parseWad(totalAmount).add(allocationAmount)
            : parseWad(originalTotal)

          const newOrEditedAllocation = entityToAllocation(result, newTotal)

          let newAllocationInserted = false
          const adjustedAllocations: AllocationSplit[] = allocations.map(
            allocation => {
              // skip if existing
              if (allocation.id === existingAllocation?.id) {
                newAllocationInserted = true
                return newOrEditedAllocation
              }
              const currentAmount = amountFromPercent({
                percent: allocation.percent,
                amount: originalTotal.toString(),
              })

              const newPercent =
                (currentAmount / parseFloat(fromWad(newTotal))) * 100
              return {
                ...allocation,
                percent: newPercent,
              }
            },
          )

          setAllocations([
            ...adjustedAllocations,
            // Only insert new if it wasn't added previously
            ...(newAllocationInserted ? [] : [newOrEditedAllocation]),
          ])
          setTotalAllocationAmount?.(newTotal)
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
            icon={<PlusCircleOutlined />}
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
  totalAllocationAmount: BigNumber | undefined,
): AllocationSplit => {
  const projectIdHex = projectIdToHex(entity.projectId)
  const allocationProps = {
    id: allocationId(entity.beneficiary!, projectIdHex),
    beneficiary: entity.beneficiary,
    projectId: projectIdHex,
    lockedUntil: entity.lockedUntil,
    percent: entity.amount.value ? parseFloat(entity.amount.value) : 0,
    preferClaimed: undefined,
    allocator: undefined,
  }
  let percent = allocationProps.percent
  if (!entity.amount.isPercent) {
    if (!totalAllocationAmount) {
      throw new Error(
        'Allocation amount passed but AllocationList has no totalAllocationAmount set',
      )
    }
    const allocationAmount = parseFloat(entity.amount.value)
    percent =
      (allocationAmount / parseFloat(fromWad(totalAllocationAmount))) * 100.0
  }

  return { ...allocationProps, percent }
}

const allocationToEntity = (
  alloc: AllocationSplit,
  totalAllocationAmount: BigNumber | undefined,
  availableModes: Set<'amount' | 'percentage'>,
): AddEditAllocationModalEntity & { projectOwner: false } => {
  const isPercent =
    !totalAllocationAmount ||
    totalAllocationAmount.eq(MAX_DISTRIBUTION_LIMIT) ||
    !availableModes.has('amount') // override if amount not available in the instance
  let amount = { value: alloc.percent.toString(), isPercent }

  if (!isPercent && totalAllocationAmount) {
    const total = parseFloat(fromWad(totalAllocationAmount))
    const a = (alloc.percent / 100.0) * total
    amount = { value: a.toString(), isPercent: false }
  }
  return {
    projectOwner: false,
    projectId: alloc.projectId,
    beneficiary: alloc.beneficiary,
    amount,
    lockedUntil: alloc.lockedUntil,
  }
}
