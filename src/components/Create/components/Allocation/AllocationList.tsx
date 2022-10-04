import { PlusCircleOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Space } from 'antd'
import { ReactNode, useCallback, useState } from 'react'
import { AddEditAllocationModal } from './AddEditAllocationModal'
import { Allocation, AllocationSplit } from './Allocation'

const useModal = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const open = useCallback(() => setVisible(true), [setVisible])
  const close = useCallback(() => setVisible(false), [setVisible])

  return { visible, open, close }
}

export const AllocationList = ({
  addText,
  children,
}: {
  addText?: ReactNode
  children: (
    modalOperations: ReturnType<typeof useModal>,
    allocationOperations: ReturnType<
      typeof Allocation.useAllocationInstance
    > & { setSelectedAllocation: (a: AllocationSplit | undefined) => void },
  ) => ReactNode
}) => {
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
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {children(modal, { ...allocations, setSelectedAllocation })}
        <Button
          size="large"
          style={{
            width: '100%',
            textAlign: 'left',
          }}
          icon={<PlusCircleOutlined />}
          onClick={modal.open}
        >
          {addText ?? t`Add`}
        </Button>
      </Space>
      <AddEditAllocationModal
        editingData={selectedAllocation}
        visible={modal.visible}
        onOk={onModalOk}
        onCancel={onModalCancel}
      />
    </>
  )
}
