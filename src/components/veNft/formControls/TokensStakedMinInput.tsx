import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { VeNftFormFields } from 'components/veNft/VeNftRewardTierModal'

export default function ContributionFloorFormItem({
  form,
}: {
  form: FormInstance<VeNftFormFields>
}) {
  const validatecontributionFloorAmount = () => {
    const value = form.getFieldValue('tokensStakedMin')
    if (value === undefined || value <= 0) {
      return Promise.reject(t`Amount required`)
    }
    return Promise.resolve()
  }

  return (
    <Form.Item
      name={'tokensStakedMin'}
      label={<Trans>Contribution threshold</Trans>}
      extra={t`Contributors receive the NFT when they contribute at least this amount.`}
      rules={[{ required: true, validator: validatecontributionFloorAmount }]}
    >
      <FormattedNumberInput
        accessory={<InputAccessoryButton content={'ETH'} disabled />}
      />
    </Form.Item>
  )
}
