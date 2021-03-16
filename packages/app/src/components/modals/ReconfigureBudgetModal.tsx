import { BigNumber } from '@ethersproject/bignumber'
import { Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import BudgetAdvancedForm, {
  BudgetAdvancedFormFields,
} from 'components/forms/BudgetAdvancedForm'
import BudgetForm, { BudgetFormFields } from 'components/forms/BudgetForm'
import { emptyAddress } from 'constants/empty-address'
import { UserContext } from 'contexts/userContext'
import { useUserBudgetSelector } from 'hooks/AppSelector'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useEffect, useState } from 'react'
import { addressExists } from 'utils/addressExists'
import {
  fromPerMille,
  fromWad,
  parsePerMille,
  parseWad,
} from 'utils/formatCurrency'

export default function ReconfigureBudgetModal({
  visible,
  onDone,
}: {
  visible?: boolean
  onDone?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const userBudget = useUserBudgetSelector()
  const [loading, setLoading] = useState<boolean>()
  const [budgetForm] = useForm<BudgetFormFields>()
  const [budgetAdvancedForm] = useForm<BudgetAdvancedFormFields>()

  useEffect(() => {
    if (!userBudget) return

    budgetForm.setFieldsValue({
      name: userBudget.name,
      duration: userBudget.duration.toString(),
      target: fromWad(userBudget.target),
      currency: userBudget.currency.toString() as BudgetCurrency,
    })
    budgetAdvancedForm.setFieldsValue({
      link: userBudget.link,
      discountRate: fromPerMille(userBudget.discountRate),
      donationRecipient: addressExists(userBudget.donationRecipient)
        ? userBudget.donationRecipient
        : '',
      donationAmount: fromPerMille(userBudget.donationAmount),
      reserved: fromPerMille(userBudget.reserved),
    })
  }, [])

  if (!transactor || !contracts) return null

  async function saveBudget() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    const valid =
      (await budgetForm.validateFields()) &&
      (await budgetAdvancedForm.validateFields())

    if (!valid) return

    setLoading(true)

    const fields = {
      ...budgetForm.getFieldsValue(true),
      ...budgetAdvancedForm.getFieldsValue(true),
    }

    transactor(
      contracts.BudgetStore,
      'configure',
      [
        parseWad(fields.target)?.toHexString(),
        BigNumber.from(fields.currency).toHexString(),
        BigNumber.from(fields.duration).toHexString(),
        fields.name,
        fields.link,
        parsePerMille(fields.discountRate).toHexString(),
        parsePerMille(fields.reserved).toHexString(),
        addressExists(fields.donationRecipient)
          ? fields.donationRecipient
          : emptyAddress,
        parsePerMille(fields.donationAmount).toHexString(),
      ],
      {
        onDone: () => {
          setLoading(false)
          if (onDone) onDone()
        },
      },
    )
  }

  return (
    <Modal
      title="Reconfigure budget"
      visible={visible}
      okText="Save changes"
      onOk={saveBudget}
      onCancel={onDone}
      confirmLoading={loading}
      width={800}
    >
      <BudgetForm form={budgetForm} />
      <BudgetAdvancedForm form={budgetAdvancedForm} />
    </Modal>
  )
}
