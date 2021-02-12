import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Form, Modal } from 'antd'
import Web3 from 'web3'

import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { useAllowedTokens } from '../hooks/AllowedTokens'
import { Budget } from '../models/budget'
import { Transactor } from '../models/transactor'
import BudgetAdvancedForm from './forms/BudgetAdvancedForm'
import BudgetForm from './forms/BudgetForm'

export default function ReconfigureBudget({
  transactor,
  contracts,
  currentValue,
  visible,
  onCancel,
  provider,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
  currentValue?: Budget
  visible?: boolean
  onCancel?: VoidFunction
  provider?: JsonRpcProvider
}) {
  const [budgetForm] = Form.useForm<{
    duration: number
    target: number
    link: string
    want: string
  }>()
  const [budgetAdvancedForm] = Form.useForm<{
    discountRate: number
    beneficiaryAddress: string
    beneficiaryAllocation: number
    ownerAllocation: number
  }>()

  const tokenOptions = useAllowedTokens(contracts, provider)

  if (!transactor || !contracts) return null

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
    const _want = currentValue?.want
    const _link = fields.link
    const _discountRate = eth.abi.encodeParameter(
      'uint256',
      fields.discountRate,
    )
    const _ownerAllocation = eth.abi.encodeParameter(
      'uint256',
      fields.ownerAllocation,
    )
    const _beneficiaryAllocation = eth.abi.encodeParameter(
      'uint256',
      fields.beneficiaryAllocation,
    )
    const _beneficiaryAddress = fields.beneficiaryAddress ?? '0'

    console.log('🧃 Calling Juicer.configureBudget(...)', {
      _target,
      _duration,
      _want,
      _link,
      _discountRate,
      _ownerAllocation,
      _beneficiaryAllocation,
      _beneficiaryAddress,
    })

    transactor(
      contracts.Juicer.configureBudget(
        _target,
        _duration,
        _want,
        _link,
        _discountRate,
        _ownerAllocation,
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
          initialValues: {
            duration: currentValue?.duration.toString(),
            target: currentValue?.target.toString(),
            link: currentValue?.link,
          },
        }}
        tokenOptions={tokenOptions}
      />
      <BudgetAdvancedForm
        props={{
          form: budgetAdvancedForm,
          labelCol: { span: 8 },
          initialValues: {
            ownerAllocation: currentValue?.o.toString(),
            beneficiaryAddress: currentValue?.bAddress,
            beneficiaryAllocation: currentValue?.b.toString(),
            discountRate: currentValue?.discountRate.toString(),
          },
        }}
      />
    </Modal>
  )
}
