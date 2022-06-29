import { t } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import TooltipLabel from 'components/shared/TooltipLabel'

import { NFTFormFields } from './NFTRewardTierModal'

export default function PaymentThresholdFormItem({
  form,
}: {
  form: FormInstance<NFTFormFields>
}) {
  const validatePaymentThresholdAmount = () => {
    const value = form.getFieldValue('paymentThreshold')
    if (value === undefined || value <= 0) {
      return Promise.reject(t`Amount required`)
    }
    return Promise.resolve()
  }

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={'paymentThreshold'}
        label={
          <TooltipLabel
            label={t`Contribution threshold`}
            tip={t`The contribution threshold above which you will reward contributors this NFT.`}
          />
        }
        extra={t`Contributors will receive the NFT when they contribute at least this amount.`}
        rules={[{ required: true, validator: validatePaymentThresholdAmount }]}
      >
        <FormattedNumberInput
          placeholder={'0.5'}
          accessory={<InputAccessoryButton content={'ETH'} disabled />}
        />
      </Form.Item>
    </div>
  )
}
