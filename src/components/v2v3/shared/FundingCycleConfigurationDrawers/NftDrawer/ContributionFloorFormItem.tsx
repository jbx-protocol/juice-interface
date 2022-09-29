import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { NftFormFields } from './NftRewardTierModal'

export default function ContributionFloorFormItem({
  form,
  validateDuplicate,
  initialValue,
}: {
  form: FormInstance<NftFormFields>
  validateDuplicate: (floor: number) => boolean
  initialValue?: number
}) {
  const validateContributionFloorAmount = () => {
    const value = form.getFieldValue('contributionFloor')
    if (value === undefined || value <= 0) {
      return Promise.reject(t`Amount required`)
    }
    const isInitialValue = initialValue == value
    // Check this `contributionFloor` isn't already in another tier
    // - But allow if tier is being edited and its `contributionFloor` hasn't changed
    if (!validateDuplicate(value) && !isInitialValue) {
      return Promise.reject(t`A tier at this amount already exists.`)
    }
    return Promise.resolve()
  }

  return (
    <Form.Item
      name={'contributionFloor'}
      label={<Trans>Contribution threshold</Trans>}
      extra={t`Contributors receive the NFT when they contribute at least this amount.`}
      rules={[{ required: true, validator: validateContributionFloorAmount }]}
    >
      <FormattedNumberInput
        accessory={<InputAccessoryButton content={'ETH'} disabled />}
      />
    </Form.Item>
  )
}
