import { useWatch } from 'antd/lib/form/Form'
import { Split } from 'models/splits'
import { useEditCycleFormContext } from '../../EditCycleFormContext'
import { HeaderRows } from './HeaderRows'
import { PayoutSplitRow } from './PayoutSplitRow'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function PayoutsTable() {
  const { editCycleForm, initialFormData } = useEditCycleFormContext()

  // useWatch is always undefined. Goal was have these update and trigger re-render when the field is updated in another component
  const payoutSplits = useWatch('payoutSplits', editCycleForm)
  const distributionLimit = useWatch('distributionLimit', editCycleForm)
  console.info('!! useWatch("payoutSplits"): ', payoutSplits)
  console.info('!! useWatch("distributionLimit"): ', distributionLimit)

  // These load but not instantly, only on abritrary component re-render
  const getFieldValueSplit = editCycleForm?.getFieldValue(
    'payoutSplits',
  ) as Split[]
  const getFieldValueDL = editCycleForm?.getFieldValue('distributionLimit')
  console.info('!! getFieldValue("payoutSplits"): ', getFieldValueSplit)
  console.info('!! getFieldValue("distributionLimit"): ', getFieldValueDL)

  if (!editCycleForm || !initialFormData) return null

  return (
    <div className="rounded-lg border border-smoke-200 dark:border-grey-600">
      <table className="w-full text-left">
        <HeaderRows />
        <tbody>
          {getFieldValueSplit?.map((payoutSplit, index) => (
            <PayoutSplitRow key={index} payoutSplit={payoutSplit} />
          ))}
          <Row>
            <Cell>Sub-total</Cell>
            {/* TODO: Add sub-total computation */}
            <Cell />
          </Row>
          <Row className="h-11">
            <Cell>Fees</Cell>
            {/* TODO: Add fees computation */}
            <Cell />
          </Row>
          <Row className="h-11 border-none font-medium" highlighted>
            <Cell>Total</Cell>
            <Cell>{getFieldValueDL}</Cell>
            <Cell />
          </Row>
        </tbody>
      </table>
    </div>
  )
}
