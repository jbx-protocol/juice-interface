import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { PopupMenu } from 'components/ui/PopupMenu'
import round from 'lodash/round'
import { Split } from 'models/splits'
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

export function PayoutSplitRow({ payoutSplit }: { payoutSplit: Split }) {
  const { editCycleForm } = useEditCycleFormContext()

  const {
    currency,
    derivePayoutAmount,
    roundingPrecision,
    handlePayoutSplitAmountChanged,
  } = usePayoutsTable()

  const amount = derivePayoutAmount({ payoutSplit })

  const formattedAmount = amount
    ? round(amount, roundingPrecision).toString()
    : 'N.A.'

  if (!editCycleForm) return null

  const onChange = (val: string | undefined) => {
    const newAmount = parseFloat(val ?? '0')
    handlePayoutSplitAmountChanged({
      editingPayoutSplit: payoutSplit,
      newAmount,
    })
  }
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
      onClick: () => console.info('Edit clicked'),
    },
    {
      id: 'delete',
      label: (
        <div className={menuItemsLabelClass}>
          <TrashIcon className={menuItemsIconClass} />
          <Trans>Delete</Trans>
        </div>
      ),
      onClick: () => console.info('Delete clicked'),
    },
  ]

  return (
    <PayoutsTableRow className="text-primary text-sm">
      <Cell className="py-6">
        <PayoutTitle payoutSplit={payoutSplit} />
      </Cell>
      <Cell className="py-6">
        <div className="flex items-center gap-3">
          <FormattedNumberInput
            accessory={
              <span className="text-sm">
                {V2V3_CURRENCY_METADATA[getV2V3CurrencyOption(currency)].symbol}
              </span>
            }
            accessoryPosition="left"
            value={formattedAmount}
            onChange={onChange}
            className="h-10"
          />
          <PopupMenu items={menuItems} />
        </div>
      </Cell>
    </PayoutsTableRow>
  )
}
