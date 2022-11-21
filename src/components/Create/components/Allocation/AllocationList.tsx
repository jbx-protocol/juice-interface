import { PlusCircleOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import useMobile from 'hooks/Mobile'
import { useModal } from 'hooks/Modal'
import { ReactNode, useCallback, useState } from 'react'
import { CreateButton } from '../CreateButton'
import { AddEditAllocationModal } from './AddEditAllocationModal'
import { Allocation, AllocationSplit } from './Allocation'

export const AllocationList = ({
  allocationName = t`allocation`,
  isEditable = true,
  availableModes,
  children,
}: {
  allocationName?: string
  isEditable?: boolean
  availableModes: Set<'amount' | 'percentage'>
  children: (
    modalOperations: ReturnType<typeof useModal>,
    allocationOperations: ReturnType<
      typeof Allocation.useAllocationInstance
    > & { setSelectedAllocation: (a: AllocationSplit | undefined) => void },
  ) => ReactNode
}) => {
  const isMobile = useMobile()
  const allocations = Allocation.useAllocationInstance()
  const { upsertAllocation } = allocations

  const [selectedAllocation, setSelectedAllocation] =
    useState<AllocationSplit>()
  const modal = useModal()

  const onModalOk = useCallback(
    (allocation: AllocationSplit) => {
      upsertAllocation(allocation)
      modal.close()
      setSelectedAllocation(undefined)
    },
    [modal, upsertAllocation],
  )

  const onModalCancel = useCallback(() => {
    modal.close()
    setSelectedAllocation(undefined)
  }, [modal])

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {children(modal, { ...allocations, setSelectedAllocation })}
        {isEditable && (
          <CreateButton
            size="large"
            className="mt-4"
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
