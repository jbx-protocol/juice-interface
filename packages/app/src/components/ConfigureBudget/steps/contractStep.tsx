import { FormInstance } from 'antd/lib/form/Form'
import { Step } from 'models/step'

export const contractStep = ({ form }: { form: FormInstance }): Step => ({
  title: 'Contract',
  validate: () => form.validateFields(),
  content: (
    <div></div>
    // <BudgetForm
    //   props={{ form }}
    //   header={<h2>Your contract's terms</h2>}
    // ></BudgetForm>
  ),
  info: [
    "Your contract will create a budget that'll begin accepting payments right away, and up until the time frame runs out.",
    'A new budgeting time frame will be created automatically once the current one expires so that you can continue collecting money.',
    "You can make changes to your contract's specs for future budgeting time frames under a certain condition – more on this in step 2.",
  ],
})
