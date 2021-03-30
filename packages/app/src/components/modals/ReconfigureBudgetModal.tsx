import { BigNumber } from '@ethersproject/bignumber'
import { Checkbox, Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import NumberSlider from 'components/shared/inputs/NumberSlider'
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
      bondingCurveRate: budget.bondingCurveRate.toString(),
    })

    setIsRecurring(!budget.discountRate.eq(0))
  }, [budget])

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
        fields.bondingCurveRate,
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
      title="Reconfigure budget"
      visible={visible}
      okText="Save changes"
      onOk={saveBudget}
      onCancel={onDone}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          extra="The amount of money you want/need in order to absolutely crush your mission statement."
          name="target"
          label="Operating cost"
          rules={[{ required: true }]}
        >
          <BudgetTargetInput
            value={form.getFieldValue('target')}
            onValueChange={val => form.setFieldsValue({ target: val })}
            currency={form.getFieldValue('currency')}
            onCurrencyChange={currency => form.setFieldsValue({ currency })}
          />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex' }}>
            <Checkbox
              defaultChecked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
            ></Checkbox>
            <div style={{ marginLeft: 10 }}>Use a recurring funding target</div>
          </div>
        </Form.Item>
        {isRecurring ? (
          <Form.Item
            extra="The time period of this recurring budget"
            name="duration"
          >
            <FormattedNumberInput
              placeholder="30"
              value={form.getFieldValue('duration')}
              suffix="days"
              onChange={val => form.setFieldsValue({ duration: val })}
            />
          </Form.Item>
        ) : null}
        <Form.Item
          extra="The rate (95%-100%) at which payments to future budgeting time frames are valued compared to payments to the current one."
          name="discountRate"
          label="Discount rate"
        >
          <NumberSlider
            min={95}
            value={form.getFieldValue('discountRate')}
            suffix="%"
            onChange={(val?: number) =>
              form.setFieldsValue({ discountRate: val?.toString() })
            }
          />
        </Form.Item>
        <Form.Item
          extra="The percentage of your project's overflow that you'd like to reserve for yourself. In practice, you'll just receive some of your own tickets whenever someone pays you."
          name="reserved"
          label="Reserved tickets"
        >
          <NumberSlider
            value={form.getFieldValue('reserved')}
            suffix="%"
            onChange={(val?: number) =>
              form.setFieldsValue({ reserved: val?.toString() })
            }
          />
        </Form.Item>
        <Form.Item name="bondingCurveRate" label="Bonding curve rate">
          <NumberSlider
            min={0}
            max={1000}
            step={1}
            value={form.getFieldValue('bondingCurveRate')}
            onChange={(val?: number) =>
              form.setFieldsValue({ bondingCurveRate: val?.toString() })
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
