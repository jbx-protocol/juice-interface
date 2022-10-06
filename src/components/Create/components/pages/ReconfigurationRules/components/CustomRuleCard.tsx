import { t } from '@lingui/macro'
import { Form } from 'antd'
import { Selection } from 'components/Create/components/Selection'
import { CustomStrategyInput } from 'components/ReconfigurationStrategy/CustomStrategyInput'
import { inputMustExistRule } from '../../utils'

export const CustomRuleCard = () => {
  return (
    <Selection.Card
      checkPosition="left"
      name="custom"
      title={t`Custom strategy`}
      description={
        <Form.Item
          noStyle
          name="customAddress"
          rules={[inputMustExistRule({ label: t`Custom strategy` })]}
        >
          <CustomStrategyInput onClick={e => e.stopPropagation()} />
        </Form.Item>
      }
    />
  )
}
