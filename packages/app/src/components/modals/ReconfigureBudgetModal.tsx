import { BigNumber } from '@ethersproject/bignumber'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { UserContext } from 'contexts/userContext'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { useContext, useEffect, useState } from 'react'
import {
  fromPermille,
  fromWad,
  parsePermille,
  parseWad,
} from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

export type ReconfigureBudgetFormFields = {
  target: string
  currency: CurrencyOption
  duration: string
  discountRate: string
  bondingCurveRate: string
  reserved: string
}

export default function ReconfigureBudgetModal({
  projectId,
  fundingCycle,
  visible,
  onDone,
}: {
  projectId: BigNumber
  fundingCycle: FundingCycle | undefined
  visible?: boolean
  onDone?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const [isRecurring, setIsRecurring] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<ReconfigureBudgetFormFields>()

  const metadata = decodeFCMetadata(fundingCycle?.metadata)

  useEffect(() => {
    if (!fundingCycle || !metadata) return

    form.setFieldsValue({
      duration: fundingCycle.duration.toString(),
      target: fromWad(fundingCycle.target),
      currency: fundingCycle.currency,
      discountRate: fromPermille(fundingCycle.discountRate),
      reserved: fromPermille(metadata.reserved),
      bondingCurveRate: fromPermille(metadata.bondingCurveRate),
    })

    setIsRecurring(fundingCycle.discountRate !== 0)
  }, [fundingCycle, form])

  if (!transactor || !contracts) return null

  async function saveBudget() {
    if (!transactor || !contracts?.Juicer || !fundingCycle) return

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
        parsePermille(fields.discountRate).toHexString(),
        parsePermille(fields.bondingCurveRate).toHexString(),
        parsePermille(fields.reserved).toHexString(),
        fundingCycle.ballot,
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
