import { t } from '@lingui/macro'
import { Form, Switch } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipLabel from 'components/TooltipLabel'

import { NftFormFields } from './NftRewardTierModal'

export default function MaxSupplyFormItem() {
  const form = Form.useFormInstance<NftFormFields>()
  const value = useWatch('maxSupply', form)
  const hasLimitedSupply = value !== undefined

  return (
    <>
      <Form.Item
        label={
          <div className="flex">
            <Switch
              className="mr-2"
              checked={hasLimitedSupply}
              onChange={() => {
                form.setFieldsValue({ maxSupply: value ? undefined : 1 })
              }}
            />
            <TooltipLabel
              label={t`Limited supply`}
              tip={t`Set a limit on how many of these NFTs can be minted.`}
            />
          </div>
        }
        name="maxSupply"
        className="w-full"
      >
        <div className="flex">
          {hasLimitedSupply ? (
            <Form.Item
              className="mb-0 w-full"
              extra={
                hasLimitedSupply
                  ? t`The maximum supply of this NFT in circulation.`
                  : null
              }
              name={'maxSupply'}
            >
              <FormattedNumberInput isInteger />
            </Form.Item>
          ) : null}
        </div>
      </Form.Item>
    </>
  )
}
