import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { DropdownMenu } from 'components/Navbar/components/DropdownMenu'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { Split } from 'models/splits'
import { useEditCycleForm } from '../EditCycleFormContext'

// TableRow component
export function PayoutsTableRow({ payoutSplit }: { payoutSplit: Split }) {
  const { editCycleForm } = useEditCycleForm()
  if (!editCycleForm) return null

  const menuItems = [
    {
      id: '1',
      label: (
        <>
          <PencilIcon className="mr-2" />
          Edit
        </>
      ),
      onClick: () => console.info('Edit clicked'),
    },
    {
      id: '2',
      label: (
        <>
          <TrashIcon className="mr-2" />
          Delete
        </>
      ),
      onClick: () => console.info('Delete clicked'),
    },
  ]

  const addressOrId =
    !payoutSplit.projectId || payoutSplit.projectId === '0x00'
      ? payoutSplit.beneficiary
      : payoutSplit.projectId

  return (
    <tr className="text-gray-600">
      <td>{addressOrId}</td>
      <td>
        <FormattedNumberInput
          prefix={
            <CurrencySymbol
              currency={editCycleForm.getFieldValue(
                'distributionLimitCurrency',
              )}
            />
          }
        />
      </td>
      <td>
        <DropdownMenu
          className="..."
          dropdownClassName="..."
          heading={<EllipsisVerticalIcon />}
          items={menuItems}
        />
      </td>
    </tr>
  )
}
