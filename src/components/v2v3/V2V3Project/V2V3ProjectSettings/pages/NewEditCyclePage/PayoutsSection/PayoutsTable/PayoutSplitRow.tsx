import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import {
  AddEditAllocationModal,
  AddEditAllocationModalEntity,
} from 'components/v2v3/shared/Allocation/AddEditAllocationModal'
import round from 'lodash/round'
import { Split } from 'models/splits'
import { useState } from 'react'
import { useEditCycleFormContext } from '../../EditCycleFormContext'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { PayoutSplitRowMenu } from './PayoutSplitRowMenu'
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
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [
    amountPercentFieldHasEndingDecimal,
    setAmountPercentFieldHasEndingDecimal,
  ] = useState<boolean>(false)

  const { editCycleForm } = useEditCycleFormContext()

  const {
    currencyOrPercentSymbol,
    derivePayoutAmount,
    formattedPayoutPercent,
    roundingPrecision,
    handlePayoutSplitChanged,
    handlePayoutSplitAmountChanged,
    distributionLimitIsInfinite,
  } = usePayoutsTable()
  const amount = derivePayoutAmount({ payoutSplit })
  const isPercent = !amount

  const formattedAmountOrPercentage = isPercent
    ? formattedPayoutPercent({ payoutSplitPercent: payoutSplit.percent })
    : round(amount, roundingPrecision).toString()

  if (!editCycleForm) return null

  const onAmountPercentageInputChange = (val: string | undefined) => {
    setAmountPercentFieldHasEndingDecimal(Boolean(val?.endsWith('.')))

    const newAmount = parseFloat(val ?? '0')
    if (isPercent) {
      handlePayoutSplitChanged({
        editedPayoutSplit: payoutSplit,
        newPayoutSplit: {
          ...payoutSplit,
          projectOwner: false,
          amount: {
            value: newAmount.toString(),
            isPercent,
          },
        },
      })
    } else {
      handlePayoutSplitAmountChanged({
        editingPayoutSplit: payoutSplit,
        newAmount,
      })
    }
  }

  const handleEditModalOk = (allocation: AddEditAllocationModalEntity) => {
    if (allocation.projectOwner) {
      console.error(
        'Not supporting manually adding project owner splits in Edit cycle form',
      )
      return
    }
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
      value: formattedAmountOrPercentage,
      isPercent,
    },
    lockedUntil: payoutSplit.lockedUntil,
  } as AddEditAllocationModalEntity

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
                <span className="text-sm">{currencyOrPercentSymbol}</span>
              }
              accessoryPosition="left"
              value={`${formattedAmountOrPercentage}${
                amountPercentFieldHasEndingDecimal ? '.' : ''
              }`}
              onChange={onAmountPercentageInputChange}
              className="md:unset h-10 w-28"
            />
            <PayoutSplitRowMenu
              onEditClick={() => setEditModalOpen(true)}
              onDeleteClick={onDeleteClick}
            />
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
        hideProjectOwnerOption
      />
    </>
  )
}
