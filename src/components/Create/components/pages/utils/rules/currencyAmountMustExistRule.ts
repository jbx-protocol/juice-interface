import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'
import { CurrencySelectInputValue } from 'components/Create/components/CurrencySelectInput'

/**
 * Rule to be used in an Ant Design Form.Item object.
 *
 * This rule checks if the Currency Amount exists, otherwise rejects with an
 * invalid message.
 */
export const currencyAmountMustExistRuleionMustExistRule = (props?: {
  label?: string
}) => ({
  validator: (rule: RuleObject, value: unknown | CurrencySelectInputValue) => {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value as any).amount === undefined
    ) {
      return Promise.reject(
        props?.label ? t`${props.label} is required` : 'Required',
      )
    }

    return Promise.resolve()
  },
})
