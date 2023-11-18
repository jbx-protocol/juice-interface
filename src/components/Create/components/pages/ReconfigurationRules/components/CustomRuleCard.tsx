import { t } from '@lingui/macro'
import { Form } from 'antd'
import { Selection } from 'components/Create/components/Selection/Selection'
import { CustomStrategyInput } from 'components/inputs/ReconfigurationStrategy/CustomStrategyInput'
import { inputMustBeEthAddressRule, inputMustExistRule } from 'utils/antdRules'

export const CustomRuleCard = () => {
  return (
    <Selection.Card
      checkPosition="left"
      name="custom"
      title={t`Custom deadline contract`}
      description={
        <Form.Item
          // Can't use noStyle, so remove margin
          // noStyle causes rule errors to disappear :(
          className="m-0"
          name="customAddress"
          rules={[
            inputMustExistRule({ label: t`An address` }),
            inputMustBeEthAddressRule({
              label: t`This custom deadline contract`,
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
