import { BigNumber } from '@ethersproject/bignumber'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { FCMetadata, FundingCycle } from 'models/funding-cycle'
import { FCProperties } from 'models/funding-cycle-properties'
import { useContext, useEffect, useState } from 'react'
import {
  fromPerbicent,
  fromPermille,
  fromWad,
  parsePerbicent,
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
      target: fundingCycle.target.lt(constants.MaxUint256)
        ? fromWad(fundingCycle.target)
        : '0',
      currency: fundingCycle.currency.toNumber() as CurrencyOption,
      discountRate: fromPermille(fundingCycle.discountRate),
      reserved: fromPerbicent(metadata.reservedRate),
      bondingCurveRate: fromPerbicent(metadata.bondingCurveRate),
    })

    setIsRecurring(!fundingCycle.discountRate.eq(0))
  }, [fundingCycle, form])

  if (!transactor || !contracts) return null

  async function saveBudget() {
    if (!transactor || !contracts?.Juicer || !fundingCycle) return

    const valid = await form.validateFields()

    if (!valid) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    const properties: Record<keyof FCProperties, string> = {
      target: parseWad(fields.target)?.toHexString(),
      currency: BigNumber.from(fields.currency).toHexString(),
      duration: BigNumber.from(fields.duration).toHexString(),
      discountRate: parsePermille(fields.discountRate).toHexString(),
      cycleLimit: BigNumber.from(0).toHexString(),
      ballot: fundingCycle.ballot,
    }

    const metadata: Omit<FCMetadata, 'version'> = {
      reservedRate: fields.reserved,
      bondingCurveRate: fields.bondingCurveRate,
      reconfigurationBondingCurveRate: parsePerbicent(100).toNumber(),
    }

    transactor(
      contracts.Juicer,
      'configure',
      [projectId.toHexString(), properties, metadata, [], []],
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
          onValueChange={duration => form.setFieldsValue({ duration })}
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
