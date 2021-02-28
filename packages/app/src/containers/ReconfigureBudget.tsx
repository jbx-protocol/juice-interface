import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Form, Modal } from 'antd'

import BudgetAdvancedForm from '../components/forms/BudgetAdvancedForm'
import BudgetForm from '../components/forms/BudgetForm'
import { ContractName } from '../constants/contract-name'
import { emptyAddress } from '../constants/empty-address'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { AdvancedBudgetFormFields } from '../models/forms-fields/advanced-budget-form'
import { BudgetFormFields } from '../models/forms-fields/budget-form'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'

export default function ReconfigureBudget({
  transactor,
  contracts,
  currentValue,
  visible,
  onCancel,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
  currentValue?: Budget
  visible?: boolean
  onCancel?: VoidFunction
}) {
  const [budgetForm] = Form.useForm<BudgetFormFields>()
  const [budgetAdvancedForm] = Form.useForm<AdvancedBudgetFormFields>()

  const wantToken = useContractReader<string>({
    contract: ContractName.Juicer,
    functionName: 'stablecoin',
  })

  if (!transactor || !contracts) return null

  if (currentValue) {
    budgetForm.setFieldsValue({
      name: currentValue.name,
      duration: currentValue.duration.toNumber(),
      target: currentValue.target.toNumber(),
      link: currentValue.link,
    })
    budgetAdvancedForm.setFieldsValue({
      discountRate: currentValue.discountRate.toNumber(),
      beneficiaryAddress: addressExists(currentValue.bAddress)
        ? currentValue.bAddress
        : '',
      beneficiaryAllocation: currentValue.b.toNumber(),
      projectAllocation: currentValue.p.toNumber(),
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
      BigNumber.from(fields.target).toHexString(),
      BigNumber.from(fields.duration).toHexString(),
      wantToken,
      fields.name,
      fields.link,
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
