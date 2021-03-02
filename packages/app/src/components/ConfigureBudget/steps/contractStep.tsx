import { FormInstance } from 'antd'
import { BudgetFormFields } from 'models/forms-fields/budget-form'
import { Step } from 'models/step'

import BudgetForm from '../../forms/BudgetForm'

export function contractStep({
  form,
  budgetActivated,
  wantTokenName,
}: {
  form: FormInstance<BudgetFormFields>
  budgetActivated?: boolean
  wantTokenName?: string
}): Step {
  return {
    title: 'Contract',
    validate: () =>
      budgetActivated ? Promise.resolve(true) : form.validateFields(),
    content: (
      <BudgetForm
        props={{ form }}
        disabled={budgetActivated}
        header={<h2>Your contract's terms</h2>}
        wantTokenName={wantTokenName}
      ></BudgetForm>
    ),
    info: [
      "Your contract will create a budget that'll begin accepting payments right away, and up until the time frame runs out.",
      'A new budgeting time frame will be created automatically once the current one expires so that you can continue collecting money.',
      "You can make changes to your contract's specs for future budgeting time frames under a certain condition – more on this in step 2.",
    ],
  }
}
