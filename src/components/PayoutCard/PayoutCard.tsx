import { DeleteOutlined, LockFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import { Allocation, AllocationSplit } from 'components/Allocation'
import FormattedAddress from 'components/FormattedAddress'
import { DeleteConfirmationModal } from 'components/modals/DeleteConfirmationModal'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { useModal } from 'hooks/Modal'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useCallback } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { formatDate } from 'utils/format/formatDate'
import { isProjectSplit } from 'utils/splits'
import { Amount } from './Amount'

export const PayoutCard = ({
  allocation,
  payoutsSelection,
  onClick,
  onDeleteClick,
}: {
  allocation: AllocationSplit
  payoutsSelection: PayoutsSelection
  onClick?: VoidFunction
  onDeleteClick?: VoidFunction
}) => {
  const deleteConfirmationModal = useModal()

  const handleDeleteConfirmationModalOk = useCallback(() => {
    onDeleteClick?.()
    deleteConfirmationModal.close()
  }, [deleteConfirmationModal, onDeleteClick])
  return (
    <>
      <Allocation.Item
        title={
          <Space>
            {isProjectSplit(allocation) && allocation.projectId ? (
              <V2V3ProjectHandleLink
                projectId={parseInt(allocation.projectId)}
              />
            ) : (
              <FormattedAddress address={allocation.beneficiary} />
            )}

            {!!allocation.lockedUntil && (
              <Tooltip
                title={t`Locked until ${formatDate(
                  allocation.lockedUntil * 1000,
                  'yyyy-MM-DD',
                )}`}
              >
                <LockFilled />
              </Tooltip>
            )}
          </Space>
        }
        amount={
          <Amount
            allocationId={allocation.id}
            payoutsSelection={payoutsSelection}
          />
        }
        extra={
          onDeleteClick ? (
            <DeleteOutlined
              className="text-lg md:text-sm"
              onClick={stopPropagation(deleteConfirmationModal.open)}
            />
          ) : (
            <div className="w-[18px] md:w-[14px]" />
          )
        }
        onClick={onClick}
      />

      <DeleteConfirmationModal
        open={deleteConfirmationModal.visible}
        onOk={handleDeleteConfirmationModalOk}
        onCancel={deleteConfirmationModal.close}
        body={
          <Trans>
            This will delete the payout for{' '}
            <FormattedAddress address={allocation.beneficiary} />.
          </Trans>
        }
      />
    </>
  )
}
