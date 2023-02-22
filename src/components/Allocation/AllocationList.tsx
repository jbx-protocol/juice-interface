import { PlusCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import useMobile from 'hooks/Mobile'
import { useModal } from 'hooks/Modal'
import { ReactNode, useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { amountFromPercent } from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { CreateButton } from '../buttons/CreateButton'
import {
  AddEditAllocationModal,
  AddEditAllocationModalEntity,
} from './AddEditAllocationModal'
import { Allocation, AllocationSplit } from './Allocation'

type AddButtonSize = 'small' | 'large'

const allocationId = (beneficiary: string, projectId: string | undefined) =>
  `${beneficiary}${projectId ? `-${projectId}` : ''}`

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
  const isMobile = useMobile()
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
        ? allocationToEntity(value, totalAllocationAmount)
        : undefined
      _setSelectedAllocation(entity)
    },
    [totalAllocationAmount],
  )

  const onModalOk = useCallback(
    (result: AddEditAllocationModalEntity) => {
      const isEditing = !!selectedAllocation
      if (result.amount.isPercent) {
        const allocation = entityToAllocation(result, undefined)
        upsertAllocation(allocation)
      } else {
        if (!setTotalAllocationAmount) {
          throw new Error(
            'Allocation amount passed but AllocationList has no totalAllocationAmount set',
          )
        }

        const originalTotal = parseFloat(
          fromWad(totalAllocationAmount ?? BigNumber.from(0)),
        )
        const id = allocationId(result.beneficiary!, result.projectId)
        const existingAllocation = isEditing
          ? allocations.find(a => a.id === id)
          : undefined

        let totalAmount = originalTotal

        if (existingAllocation) {
          const existingAmount =
            (existingAllocation.percent / 100.0) * totalAmount
          totalAmount = Math.max(0, totalAmount - existingAmount)
        }
        const allocationAmount = parseWad(result.amount.value)
        const newTotal = parseWad(totalAmount).add(allocationAmount)
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
        setTotalAllocationAmount(newTotal)
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
        {children(modal, { ...allocationInstance, setSelectedAllocation })}
        {isEditable && (
          <CreateButton
            size="large"
            className={twMerge(
              addButtonSize === 'large' ? 'mt-4 h-24' : undefined,
            )}
            icon={<PlusCircleOutlined />}
            onClick={modal.open}
          >
            {isMobile
              ? t`Add`
              : t`Add ${allocationName ? ` ${allocationName}` : ''}`}
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
  entity: AddEditAllocationModalEntity,
  totalAllocationAmount: BigNumber | undefined,
): AllocationSplit => {
  const allocationProps = {
    id: allocationId(entity.beneficiary!, entity.projectId),
    beneficiary: entity.beneficiary,
    projectId: entity.projectId,
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
): AddEditAllocationModalEntity => {
  const isPercent =
    !totalAllocationAmount || totalAllocationAmount.eq(MAX_DISTRIBUTION_LIMIT)
  let amount = { value: alloc.percent.toString(), isPercent }

  if (!isPercent && totalAllocationAmount) {
    const total = parseFloat(fromWad(totalAllocationAmount))
    const a = (alloc.percent / 100.0) * total
    amount = { value: a.toString(), isPercent: false }
  }
  return {
    projectId: alloc.projectId,
    beneficiary: alloc.beneficiary,
    amount,
    lockedUntil: alloc.lockedUntil,
  }
}
