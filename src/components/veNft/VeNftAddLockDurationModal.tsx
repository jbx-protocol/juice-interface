import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { SECONDS_IN_DAY } from 'constants/numbers'

export type FormFields = {
  lockDuration: string
}

export default function VeNftAddLockDurationModal({
  open,
  onClose,
  onChange,
}: {
  open: boolean
  onClose: VoidFunction
  onChange: (lockDurationOption: number) => void
}) {
  const [nftForm] = useForm<FormFields>()

  const onFormSaved = async () => {
    await nftForm.validateFields()

    const lockDurationOptionInSeconds =
      parseInt(nftForm.getFieldValue('lockDuration').split(' ')[0]) *
      SECONDS_IN_DAY

    onChange(lockDurationOptionInSeconds)
    onClose()
  }

  return (
    <Modal
      open={open}
      okText={t`Save Option`}
      onOk={onFormSaved}
      onCancel={onClose}
      title={t`Add Lock Duration Option`}
    >
      <Form layout="vertical" form={nftForm}>
        <Form.Item
          name="lockDuration"
          required
          label={<Trans>Days to lock tokens</Trans>}
        >
          <FormattedNumberInput suffix={t` days`} min={1} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
