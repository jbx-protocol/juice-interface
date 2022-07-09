import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { NFTFormFields } from './NFTRewardTierModal'

export default function MaxSupplyFormItem({
  form,
}: {
  form: FormInstance<NFTFormFields>
}) {
  const validateMaxSupply = () => {
    const value = form.getFieldValue('maxSupply')
    if (value === undefined || value <= 0) {
      return Promise.reject(t`Maximum supply required`)
    }
    return Promise.resolve()
  }

  return (
    <Form.Item
      name={'maxSupply'}
      label={<Trans>Maximum supply</Trans>}
      style={{ width: '100%' }}
      extra={t`The maximum quantity of this NFT that can ever be minted.`}
      rules={[{ required: true, validator: validateMaxSupply }]}
    >
      <FormattedNumberInput
        max={1000}
        accessory={
          <InputAccessoryButton
            content={t`MAX`}
            onClick={() => form.setFieldsValue({ maxSupply: 1000 })}
          />
        }
        isInteger
      />
    </Form.Item>
  )
}
