import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { useWatch } from 'antd/lib/form/Form'
import { DropdownMenu } from 'components/Navbar/components/DropdownMenu'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { CURRENCY_METADATA } from 'constants/currency'
import { ONE_BILLION } from 'constants/numbers'
import round from 'lodash/round'
import { Split } from 'models/splits'
import {
  adjustedSplitPercents,
  getNewDistributionLimit,
} from 'utils/v2v3/distributions'
import { useEditCycleFormContext } from '../../EditCycleFormContext'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Cell = PayoutsTableCell

export function PayoutSplitRow({ payoutSplit }: { payoutSplit: Split }) {
  const { editCycleForm } = useEditCycleFormContext()

  // useWatch not loading
  const distributionLimit = useWatch('distributionLimit', editCycleForm) ?? 0 // TODO: make component work for infinite DL (DL==undefined)
  const currency = useWatch('distributionLimitCurrency', editCycleForm)
  const payoutSplits = useWatch('payoutSplits', editCycleForm) ?? []

  // Derive payout amount from % of distributionLimit
  const amount = round(
    (payoutSplit.percent / ONE_BILLION) * distributionLimit,
    4,
  )

  if (!editCycleForm) return null

  const onChange = (val: string | undefined) => {
    const _val = parseFloat(val ?? '0')

    // Convert the input value to its percentage of the DL in parts-per-bill
    const updatedPercentage = (_val / distributionLimit) * ONE_BILLION

    const newDistributionLimit = distributionLimit
      ? getNewDistributionLimit({
          currentDistributionLimit: distributionLimit.toString(),
          newSplitAmount: _val,
          editingSplitPercent: payoutSplit.percent,
        })
      : undefined // undefined means DL is infinite

    let adjustedSplits: Split[] = payoutSplits
    // If an amount and therefore the distribution limit has been changed,
    // recalculate all split percents based on newly added split amount
    if (newDistributionLimit && !distributionLimit) {
      adjustedSplits = adjustedSplitPercents({
        splits: payoutSplits,
        oldDistributionLimit: distributionLimit.toString() ?? '0',
        newDistributionLimit: newDistributionLimit.toString(),
      })
    }

    const newPayoutSplit = {
      ...payoutSplit,
      percent: updatedPercentage,
    } as Split

    const newPayoutSplits = adjustedSplits.map(m =>
      m.beneficiary === newPayoutSplit?.beneficiary &&
      m.projectId === newPayoutSplit?.projectId
        ? {
            ...m,
            ...newPayoutSplit,
          }
        : m,
    )

    editCycleForm.setFieldsValue({
      distributionLimit: newDistributionLimit,
      payoutSplits: newPayoutSplits,
    })
  }

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
    <PayoutsTableRow className="text-primary text-sm">
      <Cell className="py-6">{addressOrId}</Cell>
      <Cell className="py-6">
        <FormattedNumberInput
          prefix={CURRENCY_METADATA[currency ?? 'ETH'].symbol}
          value={amount.toString()}
          onChange={onChange}
        />
      </Cell>
      <Cell className="py-6">
        <DropdownMenu
          className="..."
          dropdownClassName="..."
          heading={<EllipsisVerticalIcon className="h-6 w-6" />}
          items={menuItems}
        />
      </Cell>
    </PayoutsTableRow>
  )
}
