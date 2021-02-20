import { FormInstance } from 'antd'

import { BudgetFormFields } from '../../models/forms-fields/budget-form'
import { Step } from '../../models/step'
import BudgetForm from '../forms/BudgetForm'

export function contractStep({
  form,
}: {
  form: FormInstance<BudgetFormFields>
}): Step {
  return {
    title: 'Contract',
    validate: form.validateFields,
    content: (
      <BudgetForm
        props={{ form }}
        header={<h2>Your contract's terms</h2>}
      ></BudgetForm>
    ),
    info: [
      "Your contract will create a budgeting period that'll begin accepting payments right away, and up until the time frame runs out.",
      'A new budgeting period will be created automatically once the current one expires so that you can continue collecting money.',
      "You can make changes to your contract's specs for future budgeting periods under a certain condition – more on this in step 2.",
    ],
  }
}
