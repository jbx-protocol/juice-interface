import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'
import { isInteger } from 'lodash'

/**
 * Rule to determine that the input is an integer.
 */
export const inputIsIntegerRule = (props: { label?: string }) => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === undefined) return Promise.resolve()
    if (typeof value !== 'number')
      return Promise.reject(
        props.label
          ? t`${props.label} must be numeric`
          : t`Is not a valid integer`,
      )
    if (!isInteger(value)) {
      return Promise.reject(
        props.label
          ? t`${props.label} is not a valid integer`
          : t`Is not a valid integer`,
      )
    }
    return Promise.resolve()
  },
})
