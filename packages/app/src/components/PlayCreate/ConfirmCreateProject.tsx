import { Space, Statistic } from 'antd'
import { useAppSelector, useEditingBudgetSelector } from 'hooks/AppSelector'
import { budgetCurrencyName } from 'utils/budgetCurrency'
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
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )

  const targetWithFee = () => {
    if (adminFeePercent === undefined) return

    const targetAmount = fromWad(editingBudget?.target)

    if (targetAmount === undefined) return

    const currency = budgetCurrencyName(editingBudget?.currency)

    return `${formattedNum(targetAmount)} (+${formatWad(
      editingBudget?.target.mul(adminFeePercent).div(100),
    )} ${currency})`
  }

  return (
    <Space size="large" direction="vertical">
      <h1 style={{ fontSize: '2rem' }}>Review your project</h1>
      <Space size="large">
        <Statistic title="Name" value={orEmpty(editingProject?.name)} />
        <Statistic
          title="Handle"
          value={'@' + orEmpty(editingProject?.handle)}
        />
      </Space>
      <Space size="large">
        <Statistic
          title="Duration"
          value={formattedNum(editingBudget?.duration)}
          suffix="days"
        />
        <Statistic title="Amount (+5% admin fee)" value={targetWithFee()} />
      </Space>
      <Statistic title="Link" value={orEmpty(editingProject?.link)} />
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
      </Space>
    </Space>
  )
}
