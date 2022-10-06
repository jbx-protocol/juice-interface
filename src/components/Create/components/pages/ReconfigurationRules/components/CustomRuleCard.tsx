import { t } from '@lingui/macro'
import { Form } from 'antd'
import { Selection } from 'components/Create/components/Selection'
import { CustomStrategyInput } from 'components/ReconfigurationStrategy/CustomStrategyInput'
import { inputMustBeEthAddressRule, inputMustExistRule } from '../../utils'

export const CustomRuleCard = () => {
  return (
    <Selection.Card
      checkPosition="left"
      name="custom"
      title={t`Custom strategy`}
      description={
        <Form.Item
          // Can't use noStyle, so remove margin
          // noStyle causes rule errors to disappear :(
          style={{ margin: 0 }}
          name="customAddress"
          rules={[
            inputMustExistRule({ label: t`Custom strategy` }),
            inputMustBeEthAddressRule({
              label: t`Custom strategy`,
              validateTrigger: 'onSubmit',
            }),
          ]}
        >
          <CustomStrategyInput onClick={e => e.stopPropagation()} />
        </Form.Item>
      }
    />
  )
}
