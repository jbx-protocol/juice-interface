import Modal from 'antd/lib/modal/Modal'
import { t } from '@lingui/macro'
import { FormInstance, Form, DatePicker } from 'antd'

import { FormItems } from 'components/shared/formItems'

import NumberSlider from 'components/shared/inputs/NumberSlider'
import { useEffect, useState } from 'react'

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
  const [percent, setPercent] = useState<number>(form.getFieldValue('percent'))
  const [sliderExtra, setSliderExtra] = useState<string>()

  useEffect(() => {
    // Clarifies that the slider percentage is of the overall reserved allocation
    // and shows the percentage of all newly minted tokens only if percent != 0
    let extra =
      t`The percent this individual receives of the overall ${reservedRate}% 
      reserved token allocation` +
      `${
        percent
          ? ' ' +
            t`(${(((reservedRate ?? 0) * 1.0 * (percent ?? 0)) / 100).toFixed(
              2,
            )}%
          of all newly minted tokens).`
          : '.'
      }`
    setSliderExtra(extra)
  }, [percent, reservedRate])

  return (
    <Modal
      title={mode === 'Add' ? t`Add token receiver` : t`Edit token receiver`} // Full sentences for translation purposes
      visible={visible}
      onOk={onOk}
      okText={mode === 'Add' ? t`Add token receiver` : t`Save token receiver`}
      onCancel={onCancel}
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
            label: t`Beneficiary`,
            extra: t`The address that should receive the tokens.`,
            rules: [
              {
                validator: validateReservedTokenReceiver,
              },
            ],
          }}
          onAddressChange={beneficiary => form.setFieldsValue({ beneficiary })}
        />

        <Form.Item label={t`Percent`} rules={[{ required: true }]}>
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
              extra: sliderExtra,
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
