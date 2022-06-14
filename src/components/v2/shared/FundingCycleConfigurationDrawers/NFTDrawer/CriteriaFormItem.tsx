import { t } from '@lingui/macro'
import { Form, FormInstance, Input } from 'antd'
import TooltipLabel from 'components/shared/TooltipLabel'

import { NFTFormFields } from './NFTRewardTierModal'

export default function CriteriaFormItem({
  form,
}: {
  form: FormInstance<NFTFormFields>
}) {
  const validateCriteriaAmount = () => {
    const value = form.getFieldValue('criteria')
    if (value === undefined || value <= 0) {
      return Promise.reject(t`Amount required`)
    }
    return Promise.resolve()
  }

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        name={'criteria'}
        label={
          <TooltipLabel
            label={t`Contribution threshold`}
            tip={t`The contribution threshold above which you will reward contributors this NFT.`}
          />
        }
        extra={t`Contributors will receive the NFT when they contribute at least this amount.`}
        rules={[{ required: true, validator: validateCriteriaAmount }]}
      >
        <Input
          placeholder={'0.5'}
          type="string"
          autoComplete="off"
          suffix={t`ETH`}
        />
      </Form.Item>
    </div>
  )
}
