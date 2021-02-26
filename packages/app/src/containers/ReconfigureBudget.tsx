import { Contract } from '@ethersproject/contracts'
import { Form, Modal } from 'antd'
import Web3 from 'web3'

import BudgetAdvancedForm from '../components/forms/BudgetAdvancedForm'
import BudgetForm from '../components/forms/BudgetForm'
import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
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
    contract: contracts?.Juicer,
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

  const eth = new Web3(Web3.givenProvider).eth

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

    const _target = eth.abi.encodeParameter('uint256', fields.target)
    const _duration = eth.abi.encodeParameter(
      'uint256',
      fields.duration * SECONDS_IN_DAY,
    )
    const _name = fields.name
    const _link = fields.link
    const _discountRate = eth.abi.encodeParameter(
      'uint256',
      fields.discountRate,
    )
    const _projectAllocation = eth.abi.encodeParameter(
      'uint256',
      fields.projectAllocation,
    )
    const _beneficiaryAllocation = eth.abi.encodeParameter(
      'uint256',
      fields.beneficiaryAllocation,
    )
    const _beneficiaryAddress = fields.beneficiaryAddress.length
      ? fields.beneficiaryAddress
      : '0x0000000000000000000000000000000000000000'
    const _want = wantToken

    console.log('🧃 Calling BudgetStore.configure(...)', {
      _target,
      _duration,
      _want,
      _name,
      _link,
      _discountRate,
      _projectAllocation,
      _beneficiaryAllocation,
      _beneficiaryAddress,
    })

    transactor(
      contracts.BudgetStore.configure(
        _target,
        _duration,
        _want,
        _name,
        _link,
        _discountRate,
        _projectAllocation,
        _beneficiaryAllocation,
        _beneficiaryAddress,
      ),
    )
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
