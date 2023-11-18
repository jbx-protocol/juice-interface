import { DeleteOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { DeleteConfirmationModal } from 'components/modals/DeleteConfirmationModal'
import {
  Allocation,
  AllocationSplit,
} from 'components/v2v3/shared/Allocation/Allocation'
import { AllocationItemTitle } from 'components/v2v3/shared/Allocation/components/AllocationItemTitle'
import { useModal } from 'hooks/useModal'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useCallback } from 'react'
import { stopPropagation } from 'react-stop-propagation'
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
        title={<AllocationItemTitle allocation={allocation} />}
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
            <EthereumAddress address={allocation.beneficiary} />.
          </Trans>
        }
      />
    </>
  )
}
