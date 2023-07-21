import { Split } from 'models/splits'
import { useEditCycleForm } from '../EditCycleFormContext'
import { PayoutsTableRow } from './PayoutsTableRow'

export function PayoutsTable() {
  const { editCycleForm, initialFormData } = useEditCycleForm()

  if (!editCycleForm || !initialFormData) return null

  const payoutSplits = editCycleForm?.getFieldValue('payoutSplits') as Split[]

  return (
    <table className="w-full">
      <thead className="bg-gray-200">
        <tr>
          <th>Address or ID</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {payoutSplits?.map((payoutSplit, index) => (
          <PayoutsTableRow key={index} payoutSplit={payoutSplit} />
        ))}
        <tr>
          <td>Sub-total</td>
          {/* Add your sub-total computation here */}
          <td></td>
        </tr>
        <tr>
          <td>Fees</td>
          {/* Add your fees computation here */}
          <td></td>
        </tr>
        <tr className="bg-gray-200">
          <td>Total</td>
          <td>{editCycleForm.getFieldsValue('distributionLimit')}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default PayoutsTable
