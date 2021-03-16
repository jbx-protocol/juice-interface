import { Space, Statistic } from 'antd'
import { useEditingBudgetSelector } from 'hooks/AppSelector'
import { addressExists } from 'utils/addressExists'
import { formatBudgetCurrency } from 'utils/budgetCurrency'
import {
  formattedNum,
  formatWad,
  fromPerMille,
  fromWad,
} from 'utils/formatCurrency'
import { orEmpty } from 'utils/orEmpty'

export default function ConfirmCreateProject({
  adminFeePercent,
}: {
  adminFeePercent: number | undefined
}) {
  const editingBudget = useEditingBudgetSelector()

  const targetWithFee = () => {
    if (adminFeePercent === undefined) return

    const targetAmount = fromWad(editingBudget?.target)

    if (targetAmount === undefined) return

    const currency = formatBudgetCurrency(editingBudget?.currency)

    return `${formattedNum(targetAmount)} (+${formatWad(
      editingBudget?.target.mul(adminFeePercent).div(100),
    )} ${currency})`
  }

  return (
    <Space size="large" direction="vertical">
      <h1 style={{ fontSize: '2rem' }}>Review your contract</h1>
      <Statistic title="Name" value={orEmpty(editingBudget?.name)} />
      <div>
        <Space size="large">
          <Statistic
            title="Duration"
            value={formattedNum(editingBudget?.duration)}
            suffix="days"
          />
          <Statistic title="Amount (+5% admin fee)" value={targetWithFee()} />
        </Space>
      </div>
      <Statistic title="Link" value={orEmpty(editingBudget?.link)} />
      <Space size="large" align="end">
        <Statistic
          style={{
            minWidth: 100,
          }}
          title="Discount rate"
          value={fromPerMille(editingBudget?.discountRate)}
          suffix="%"
        />
        <Statistic
          title="Reserved tickets"
          value={fromPerMille(editingBudget?.reserved)}
          suffix="%"
        />
        <Statistic
          title="Overflow donation"
          value={fromPerMille(editingBudget?.donationAmount)}
          suffix="%"
        />
      </Space>
      <Statistic
        title="Donation address"
        valueStyle={{ lineBreak: 'anywhere' }}
        value={
          addressExists(editingBudget?.donationRecipient)
            ? editingBudget?.donationRecipient
            : '--'
        }
      />
    </Space>
  )
}
