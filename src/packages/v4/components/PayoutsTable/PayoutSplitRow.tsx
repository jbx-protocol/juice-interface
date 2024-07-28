import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { PayoutsTableCell } from 'components/PayoutsTable/PayoutsTableCell'
import { PayoutsTableRow } from 'components/PayoutsTable/PayoutsTableRow'
import { JBSplit as Split } from 'juice-sdk-core'
import round from 'lodash/round'
import { useState } from 'react'
import { AddEditAllocationModal, AddEditAllocationModalEntity } from '../Allocation/AddEditAllocationModal'
import { usePayoutsTableContext } from './context/PayoutsTableContext'
import { usePayoutsTable } from './hooks/usePayoutsTable'
import { PayoutSplitRowMenu } from './PayoutSplitRowMenu'
import { PayoutTitle } from './PayoutTitle'

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

  const { setPayoutSplits } = usePayoutsTableContext()
  const canEditSplits = Boolean(setPayoutSplits)

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
  const isPercent = distributionLimitIsInfinite

  let formattedAmountOrPercentage = isPercent
    ? formattedPayoutPercent({ payoutSplitPercent: Number(payoutSplit.percent.value) })
    : round(amount, roundingPrecision).toString()

  if (!canEditSplits) {
    formattedAmountOrPercentage = `${currencyOrPercentSymbol}${formattedAmountOrPercentage}`
  }

  const onAmountPercentageInputChange = (val: string | undefined) => {
    setAmountPercentFieldHasEndingDecimal(Boolean(val?.endsWith('.')))

    const newAmount = parseFloat(val ?? '0')
    if (isPercent) {
      handlePayoutSplitChanged({
        editedPayoutSplit: payoutSplit,
        newPayoutSplit: {
          ...payoutSplit,
          projectId: payoutSplit.projectId.toString(),
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
    projectId: payoutSplit.projectId.toString(),
    amount: {
      value: formattedAmountOrPercentage,
      isPercent,
    },
    lockedUntil: payoutSplit.lockedUntil,
  } as AddEditAllocationModalEntity

  const _value = `${formattedAmountOrPercentage}${
    amountPercentFieldHasEndingDecimal ? '.' : ''
  }`

  const paddingY = canEditSplits ? 'py-6' : 'py-3'

  return (
    <>
      <PayoutsTableRow className="text-primary text-sm">
        <Cell className={paddingY}>
          <PayoutTitle payoutSplit={payoutSplit} />
        </Cell>
        <Cell className={paddingY}>
          {setPayoutSplits ? (
            <div className="flex items-center gap-3">
              <FormattedNumberInput
                accessory={
                  <span className="text-sm">{currencyOrPercentSymbol}</span>
                }
                accessoryPosition="left"
                value={_value}
                onChange={onAmountPercentageInputChange}
                className="h-10 w-28 md:w-full"
              />
              <PayoutSplitRowMenu
                onEditClick={() => setEditModalOpen(true)}
                onDeleteClick={onDeleteClick}
              />
            </div>
          ) : (
            _value
          )}
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
        hideFee
      />
    </>
  )
}
