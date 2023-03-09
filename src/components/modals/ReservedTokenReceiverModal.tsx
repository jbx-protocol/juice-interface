import { t } from '@lingui/macro'
import { DatePicker, Form, FormInstance } from 'antd'
import Modal from 'antd/lib/modal/Modal'

import NumberSlider from 'components/inputs/NumberSlider'
import { useState } from 'react'

import { EthAddressInput } from '../inputs/EthAddressInput'

type ModalMode = 'Add' | 'Edit' | undefined

export default function ReservedTokenReceiverModal({
  mode,
  open,
  form,
  onOk,
  onCancel,
  validateReservedTokenReceiver,
  validateSlider,
  reservedRate,
}: {
  mode: ModalMode
  open: boolean
  form: FormInstance
  onOk: VoidFunction
  onCancel: VoidFunction
  validateReservedTokenReceiver: VoidFunction
  validateSlider: VoidFunction
  reservedRate: number
}) {
  const [percent, setPercent] = useState<number | undefined>(
    form.getFieldValue('percent'),
  )

  // Clarifies that the slider percentage is of the overall reserved allocation
  // and shows the percentage of all newly minted tokens only if percent != 0
  function generateExtra() {
    // Initially the state (percent) is not loaded, so we fall back on the form.
    // But then subsequently, since the form does not update the UI immediately, we use the state
    const percentOfReserved = percent ?? form.getFieldValue('percent')

    const realTokenAllocation = (reservedRate ?? 0) * percentOfReserved
    const realTokenAllocationPercent = (realTokenAllocation / 100).toFixed(2)
    const extra =
      t`The portion this recipient will receive out of the ${reservedRate}% of the project's reserved token issuance.` +
      `${
        realTokenAllocation
          ? ' ' + t`(${realTokenAllocationPercent}% of total token issuance).`
          : '.'
      }`
    return extra
  }

  return (
    <Modal
      title={mode === 'Add' ? t`Add recipient` : t`Edit recipient`} // Full sentences for translation purposes
      open={open}
      // Must reset the state in case user opens this modal for another receiver straight away
      onOk={() => {
        setPercent(undefined)
        onOk()
      }}
      okText={mode === 'Add' ? t`Add recipient` : t`Save recipient`}
      onCancel={() => {
        setPercent(undefined)
        onCancel()
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onKeyDown={e => {
          if (e.key === 'Enter') onOk()
        }}
      >
        <Form.Item
          name="beneficiary"
          label={t`Beneficiary address`}
          extra={t`This address will receive any tokens minted when this project is paid.`}
          rules={[
            {
              validator: validateReservedTokenReceiver,
              validateTrigger: 'onCreate',
              required: true,
            },
          ]}
        >
          <EthAddressInput />
        </Form.Item>

        <Form.Item label={t`Percentage to reserve`} required={true}>
          <NumberSlider
            onChange={(percent: number | undefined) => {
              setPercent(percent ?? form.getFieldValue('percent'))
              form.setFieldsValue({ percent })
            }}
            step={0.01}
            defaultValue={0}
            sliderValue={form.getFieldValue('percent') ?? 0}
            suffix="%"
            name="percent"
            formItemProps={{
              rules: [{ validator: validateSlider }],
              extra: generateExtra(),
            }}
          />
        </Form.Item>

        <Form.Item
          name="lockedUntil"
          label={t`Lock until`}
          extra={t`If locked, this percentage can't be edited or removed until the lock expires or the cycle is edited.`}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  )
}
