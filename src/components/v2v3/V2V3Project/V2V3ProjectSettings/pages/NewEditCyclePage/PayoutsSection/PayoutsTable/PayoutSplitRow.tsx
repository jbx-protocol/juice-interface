import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { PopupMenu } from 'components/ui/PopupMenu'
import {
  AddEditAllocationModal,
  AddEditAllocationModalEntity,
} from 'components/v2v3/shared/Allocation/AddEditAllocationModal'
import round from 'lodash/round'
import { Split } from 'models/splits'
import { useState } from 'react'
import {
  V2V3_CURRENCY_METADATA,
  getV2V3CurrencyOption,
} from 'utils/v2v3/currency'
import { useEditCycleFormContext } from '../../EditCycleFormContext'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { PayoutTitle } from './PayoutTitle'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Cell = PayoutsTableCell

export function PayoutSplitRow({
  payoutSplit,
  onDeleteClick,
}: {
  payoutSplit: Split
  onDeleteClick: VoidFunction
}) {
  const [editModalOpen, setEditModalOpen] = useState<boolean>()
  const { editCycleForm } = useEditCycleFormContext()

  const {
    currency,
    derivePayoutAmount,
    roundingPrecision,
    handlePayoutSplitChanged,
    handlePayoutSplitAmountChanged,
    distributionLimitIsInfinite,
  } = usePayoutsTable()
  const amount = derivePayoutAmount({ payoutSplit })

  const formattedAmount = amount
    ? round(amount, roundingPrecision).toString()
    : 'N.A.'

  if (!editCycleForm) return null

  const onAmountPercentageInputChange = (val: string | undefined) => {
    const newAmount = parseFloat(val ?? '0')
    handlePayoutSplitAmountChanged({
      editingPayoutSplit: payoutSplit,
      newAmount,
    })
  }

  const handleEditModalOk = (allocation: AddEditAllocationModalEntity) => {
    handlePayoutSplitChanged({
      editedPayoutSplit: payoutSplit,
      newPayoutSplit: allocation,
    })
    setEditModalOpen(false)
  }

  const addEditAllocationModalEntity = {
    projectOwner: false,
    beneficiary: payoutSplit.beneficiary,
    projectId: payoutSplit.projectId,
    amount: {
      value: formattedAmount,
    },
    lockedUntil: payoutSplit.lockedUntil,
  } as AddEditAllocationModalEntity

  const menuItemsLabelClass = 'flex gap-2 items-center'
  const menuItemsIconClass = 'h-5 w-5'
  const menuItems = [
    {
      id: 'edit',
      label: (
        <div className={menuItemsLabelClass}>
          <PencilIcon className={menuItemsIconClass} />
          <Trans>Edit</Trans>
        </div>
      ),
      onClick: () => setEditModalOpen(true),
    },
    {
      id: 'delete',
      label: (
        <div className={menuItemsLabelClass}>
          <TrashIcon className={menuItemsIconClass} />
          <Trans>Delete</Trans>
        </div>
      ),
      onClick: onDeleteClick,
    },
  ]

  return (
    <>
      <PayoutsTableRow className="text-primary text-sm">
        <Cell className="py-6">
          <PayoutTitle payoutSplit={payoutSplit} />
        </Cell>
        <Cell className="py-6">
          <div className="flex items-center gap-3">
            <FormattedNumberInput
              accessory={
                <span className="text-sm">
                  {
                    V2V3_CURRENCY_METADATA[getV2V3CurrencyOption(currency)]
                      .symbol
                  }
                </span>
              }
              accessoryPosition="left"
              value={formattedAmount}
              onChange={onAmountPercentageInputChange}
              className="h-10"
            />
            <PopupMenu items={menuItems} />
          </div>
        </Cell>
      </PayoutsTableRow>
      <AddEditAllocationModal
        allocationName="payout"
        availableModes={
          new Set([distributionLimitIsInfinite ? 'percentage' : 'amount'])
        }
        editingData={addEditAllocationModalEntity}
        open={editModalOpen}
        onOk={handleEditModalOk}
        onCancel={() => setEditModalOpen(false)}
      />
    </>
  )
}
