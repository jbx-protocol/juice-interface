import Modal from 'antd/lib/modal/Modal'
import { t } from '@lingui/macro'
import { FormInstance, Form, DatePicker } from 'antd'

import { FormItems } from 'components/shared/formItems'

import NumberSlider from 'components/shared/inputs/NumberSlider'
import { useState } from 'react'

type ModalMode = 'Add' | 'Edit' | undefined

export default function ReservedTokenReceiverModal({
  mode,
  visible,
  form,
  onOk,
  onCancel,
  validateReservedTokenReceiver,
  validateSlider,
  reservedRate,
}: {
  mode: ModalMode
  visible: boolean
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
      t`The percent this individual receives of the overall ${reservedRate}% reserved token allocation` +
      `${
        realTokenAllocation
          ? ' ' +
            t`(${realTokenAllocationPercent}% of all newly minted tokens).`
          : '.'
      }`
    return extra
  }

  return (
    <Modal
      title={mode === 'Add' ? t`Add token receiver` : t`Edit token receiver`} // Full sentences for translation purposes
      visible={visible}
      // Must reset the state in case user opens this modal for another receiver straight away
      onOk={() => {
        setPercent(undefined)
        onOk()
      }}
      okText={mode === 'Add' ? t`Add token receiver` : t`Save token receiver`}
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
        <FormItems.EthAddress
          name="beneficiary"
          defaultValue={form.getFieldValue('beneficiary')}
          formItemProps={{
            label: t`Beneficiary address`,
            extra: t`This address will receive the tokens minted from paying this project.`,
            rules: [
              {
                validator: validateReservedTokenReceiver,
              },
            ],
          }}
          onAddressChange={beneficiary => form.setFieldsValue({ beneficiary })}
        />

        <Form.Item label={t`Percent allocation`} rules={[{ required: true }]}>
          <NumberSlider
            onChange={(percent: number | undefined) => {
              setPercent(percent ?? form.getFieldValue('percent'))
              form.setFieldsValue({ percent })
            }}
            step={0.01}
            defaultValue={form.getFieldValue('percent') || 0}
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
          extra={t`If locked, this can't be edited or removed until the lock expires or the funding cycle is reconfigured.`}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  )
}
