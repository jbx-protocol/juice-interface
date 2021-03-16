import { Button } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import BudgetForm, { BudgetFormFields } from 'components/forms/BudgetForm'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useEditingBudgetSelector,
  useUserBudgetSelector,
} from 'hooks/AppSelector'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useEffect, useMemo } from 'react'
import { editingBudgetActions } from 'redux/slices/editingBudget'
import { fromWad } from 'utils/formatCurrency'

export default function ConfigureBudget() {
  const { userAddress } = useContext(UserContext)
  const [budgetForm] = useForm<BudgetFormFields>()
  const userBudget = useUserBudgetSelector()
  const editingBudget = useEditingBudgetSelector()
  const dispatch = useAppDispatch()

  console.log({ userBudget, editingBudget })

  const budget = useMemo(() => userBudget ?? editingBudget, [
    userBudget,
    editingBudget,
  ])

  useEffect(
    () =>
      budgetForm.setFieldsValue({
        name: budget?.name ?? '',
        target: fromWad(budget?.target) ?? '0',
        duration:
          budget?.duration
            .div(process.env.NODE_ENV === 'production' ? SECONDS_IN_DAY : 1)
            .toString() ?? '0',
        currency: (budget?.currency.toString() ?? '0') as BudgetCurrency,
      }),
    [budget, budgetForm],
  )

  const goToReview = () => {
    if (userBudget && userAddress) {
      window.location.hash = userAddress
      return
    }

    const fields = budgetForm.getFieldsValue(true)
    dispatch(editingBudgetActions.setName(fields.name))
    dispatch(editingBudgetActions.setTarget(fields.target))
    dispatch(editingBudgetActions.setDuration(fields.duration))
    dispatch(editingBudgetActions.setCurrency(fields.currency))

    if (userAddress) dispatch(editingBudgetActions.setProject(userAddress))

    window.location.hash = 'create'
  }

  const disabled = !!userBudget

  return (
    <div
      style={{
        padding: padding.app,
        maxWidth: 600,
      }}
    >
      <BudgetForm form={budgetForm} disabled={disabled} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button type="primary" onClick={goToReview}>
          See your project
        </Button>
      </div>
    </div>
  )
}
