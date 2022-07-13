import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { NftFormFields } from './NftRewardTierModal'

export default function PaymentThresholdFormItem({
  form,
}: {
  form: FormInstance<NftFormFields>
}) {
  const validatePaymentThresholdAmount = () => {
    const value = form.getFieldValue('paymentThreshold')
    if (value === undefined || value <= 0) {
      return Promise.reject(t`Amount required`)
    }
    return Promise.resolve()
  }

  return (
    <Form.Item
      name={'paymentThreshold'}
      label={<Trans>Contribution threshold</Trans>}
      extra={t`Contributors receive the NFT when they contribute at least this amount.`}
      rules={[{ required: true, validator: validatePaymentThresholdAmount }]}
    >
      <FormattedNumberInput
        accessory={<InputAccessoryButton content={'ETH'} disabled />}
      />
    </Form.Item>
  )
}
