import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { NftFormFields } from './NftRewardTierModal'

export default function ContributionFloorFormItem({
  form,
}: {
  form: FormInstance<NftFormFields>
}) {
  const validateContributionFloorAmount = () => {
    const value = form.getFieldValue('contributionFloor')
    if (value === undefined || value <= 0) {
      return Promise.reject(t`Amount required`)
    }
    return Promise.resolve()
  }

  return (
    <Form.Item
      name={'contributionFloor'}
      label={<Trans>Minimum contribution</Trans>}
      extra={t`Your supporters will receive this NFT when they contribute this amount or more.`}
      rules={[{ required: true, validator: validateContributionFloorAmount }]}
    >
      <FormattedNumberInput
        accessory={<InputAccessoryButton content={'ETH'} disabled />}
      />
    </Form.Item>
  )
}
