import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'

/**
 * Rule to be used in an Ant Design Form.Item object.
 *
 * This rule checks if the input exists, otherwise rejects with an invalid
 * message.
 */
export const inputIsLengthRule = (props?: { label?: string; max: number }) => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === undefined) return Promise.resolve()
    if (typeof value !== 'string')
      return Promise.reject(t`Invalid type - contact Juicebox Support`)
    if (value === '') return Promise.resolve()
    if (value && props?.max && value.length > props.max)
      return Promise.reject(t`Must be less than ${props?.max} characters`)
    return Promise.resolve()
  },
})
