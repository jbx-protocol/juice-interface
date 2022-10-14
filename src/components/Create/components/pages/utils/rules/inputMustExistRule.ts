import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'

/**
 * Rule to be used in an Ant Design Form.Item object.
 *
 * This rule checks if the input exists, otherwise rejects with an invalid
 * message.
 */
export const inputMustExistRule = (props?: { label?: string }) => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return Promise.reject(
        props?.label ? t`${props.label} is required` : 'Required',
      )
    }
    return Promise.resolve()
  },
})
