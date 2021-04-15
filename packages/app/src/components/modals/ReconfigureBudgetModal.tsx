import { BigNumber } from '@ethersproject/bignumber'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { UserContext } from 'contexts/userContext'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useEffect, useState } from 'react'
import {
  fromPerMille,
  fromWad,
  parsePerMille,
  parseWad,
} from 'utils/formatCurrency'

export type ReconfigureBudgetFormFields = {
  target: string
  currency: BudgetCurrency
  duration: string
  discountRate: string
  bondingCurveRate: string
  reserved: string
}

export default function ReconfigureBudgetModal({
  projectId,
  budget,
  visible,
  onDone,
}: {
  projectId: BigNumber
  budget: Budget | null | undefined
  visible?: boolean
  onDone?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const [isRecurring, setIsRecurring] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<ReconfigureBudgetFormFields>()

  useEffect(() => {
    if (!budget) return

    form.setFieldsValue({
      duration: budget.duration.toString(),
      target: fromWad(budget.target),
      currency: budget.currency.toString() as BudgetCurrency,
      discountRate: fromPerMille(budget.discountRate),
      reserved: fromPerMille(budget.reserved),
      bondingCurveRate: fromPerMille(budget.bondingCurveRate),
    })

    setIsRecurring(!budget.discountRate.eq(0))
  }, [budget, form])

  if (!transactor || !contracts) return null

  async function saveBudget() {
    if (!transactor || !contracts?.Juicer || !budget) return

    const valid = await form.validateFields()

    if (!valid) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    transactor(
      contracts.Juicer,
      'reconfigure',
      [
        projectId.toHexString(),
        parseWad(fields.target)?.toHexString(),
        BigNumber.from(fields.currency).toHexString(),
        BigNumber.from(fields.duration).toHexString(),
        parsePerMille(fields.discountRate).toHexString(),
        parsePerMille(fields.bondingCurveRate).toHexString(),
        parsePerMille(fields.reserved).toHexString(),
        budget.ballot,
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
      title="Reconfigure funding"
      visible={visible}
      okText="Save changes"
      onOk={saveBudget}
      onCancel={onDone}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <FormItems.ProjectTarget
          name="target"
          value={form.getFieldValue('target')}
          onValueChange={val => form.setFieldsValue({ target: val })}
          currency={form.getFieldValue('currency')}
          onCurrencyChange={currency => form.setFieldsValue({ currency })}
          formItemProps={{ rules: [{ required: true }] }}
        />
        <FormItems.ProjectDuration
          name="duration"
          value={form.getFieldValue('duration')}
          onChange={val => form.setFieldsValue({ duration: val })}
          isRecurring={isRecurring}
          onToggleRecurring={() => setIsRecurring(!isRecurring)}
        />
        <FormItems.ProjectDiscountRate
          name="discountRate"
          value={form.getFieldValue('discountRate')}
          onChange={(val?: number) =>
            form.setFieldsValue({ discountRate: val?.toString() })
          }
        />
        <FormItems.ProjectReserved
          name="reserved"
          value={form.getFieldValue('reserved')}
          onChange={(val?: number) =>
            form.setFieldsValue({ reserved: val?.toString() })
          }
        />
        <FormItems.ProjectBondingCurveRate
          name="bondingCurveRate"
          value={form.getFieldValue('bondingCurveRate')}
          onChange={(val?: number) =>
            form.setFieldsValue({ bondingCurveRate: val?.toString() })
          }
        />
      </Form>
    </Modal>
  )
}
