import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'

/**
 * Rule to determine if the input already matches other `inputs`.
 */
export const inputIsValidUrlRule = (props: {
  label?: string
  prefix?: string
  validateTrigger?: string
}) => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === undefined) return Promise.resolve()
    if (typeof value !== 'string')
      return Promise.reject(t`Invalid type - contact Juicebox Support`)
    let string = value
    if (props.prefix) {
      string = props.prefix + value
    }
    try {
      new URL(string)
      return Promise.resolve()
    } catch {
      return Promise.reject(
        props.label ? t`${props.label} is not valid URL` : `Is not valid URL`,
      )
    }
  },
  validateTrigger: props.validateTrigger,
})
