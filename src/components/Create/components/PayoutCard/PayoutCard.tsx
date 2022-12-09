import { DeleteOutlined, LockFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import useMobile from 'hooks/Mobile'
import { useModal } from 'hooks/Modal'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useCallback } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { classNames } from 'utils/classNames'
import { formatDate } from 'utils/format/formatDate'
import { Allocation, AllocationSplit } from '../Allocation'
import { DeleteConfirmationModal } from '../DeleteConfirmationModal'
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
  const isMobile = useMobile()
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
            <FormattedAddress address={allocation.beneficiary} />
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
          <DeleteOutlined
            className={classNames(isMobile ? 'text-lg' : 'text-sm')}
            onClick={stopPropagation(deleteConfirmationModal.open)}
          />
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
