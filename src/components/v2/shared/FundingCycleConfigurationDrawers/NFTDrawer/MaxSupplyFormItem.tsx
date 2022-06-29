import { t } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import TooltipLabel from 'components/shared/TooltipLabel'

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
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={'maxSupply'}
        label={
          <TooltipLabel
            label={t`Maximum supply`}
            tip={t`Set an upper limit on the total quantity of this NFT in circulation.`}
          />
        }
        style={{ width: '100%' }}
        extra={t`The maximum quantity of this NFT that can ever be minted.`}
        rules={[{ required: true, validator: validateMaxSupply }]}
      >
        <FormattedNumberInput
          placeholder={'100'}
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
    </div>
  )
}
