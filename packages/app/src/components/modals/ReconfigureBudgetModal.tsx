import { BigNumber } from '@ethersproject/bignumber'
import { formatBytes32String } from '@ethersproject/strings'
import { Form, Modal } from 'antd'
import { emptyAddress } from 'constants/empty-address'
import { UserContext } from 'contexts/userContext'
import { BudgetCurrency } from 'models/budget-currency'
import { AdvancedBudgetFormFields } from 'models/forms-fields/advanced-budget-form'
import { BudgetFormFields } from 'models/forms-fields/budget-form'
import { useContext } from 'react'
import { addressExists } from 'utils/addressExists'

import { fromWad, parseWad } from '../../utils/formatCurrency'
import BudgetAdvancedForm from '../forms/BudgetAdvancedForm'
import BudgetForm from '../forms/BudgetForm'

export default function ReconfigureBudgetModal({
  visible,
  onCancel,
}: {
  visible?: boolean
  onCancel?: VoidFunction
}) {
  const { transactor, contracts, currentBudget } = useContext(UserContext)

  const [budgetForm] = Form.useForm<BudgetFormFields>()
  const [budgetAdvancedForm] = Form.useForm<AdvancedBudgetFormFields>()

  if (!transactor || !contracts) return null

  if (currentBudget) {
    budgetForm.setFieldsValue({
      name: currentBudget.name,
      duration: currentBudget.duration.toNumber(),
      target: fromWad(currentBudget.target),
      currency: currentBudget.currency.toString() as BudgetCurrency,
      link: currentBudget.link,
    })
    budgetAdvancedForm.setFieldsValue({
      discountRate: currentBudget.discountRate.toNumber(),
      beneficiaryAddress: addressExists(currentBudget.bAddress)
        ? currentBudget.bAddress
        : '',
      beneficiaryAllocation: currentBudget.b.toNumber(),
      projectAllocation: currentBudget.p.toNumber(),
    })
  }

  async function submitBudget() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    const valid =
      (await budgetForm.validateFields()) &&
      (await budgetAdvancedForm.validateFields())

    if (!valid) return

    const fields = {
      ...budgetForm.getFieldsValue(true),
      ...budgetAdvancedForm.getFieldsValue(true),
    }

    transactor(contracts.BudgetStore, 'configure', [
      parseWad(fields.target)?.toHexString(),
      BigNumber.from(fields.duration).toHexString(),
      BigNumber.from(fields.currency).toHexString(),
      formatBytes32String(fields.name),
      formatBytes32String(fields.link),
      BigNumber.from(fields.discountRate).toHexString(),
      BigNumber.from(fields.projectAllocation).toHexString(),
      BigNumber.from(fields.beneficiaryAllocation).toHexString(),
      fields.beneficiaryAddress ?? emptyAddress,
    ])
  }

  return (
    <Modal
      title="Reconfigure budget"
      visible={visible}
      okText="Save changes"
      onOk={submitBudget}
      onCancel={onCancel}
      width={800}
    >
      <BudgetForm
        props={{
          form: budgetForm,
          labelCol: { span: 8 },
        }}
      />
      <BudgetAdvancedForm
        props={{
          form: budgetAdvancedForm,
          labelCol: { span: 8 },
        }}
      />
    </Modal>
  )
}
