import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'

const nonNumericRejection = (label: string | undefined) => {
  return Promise.reject(
    label ? t`${label} must be numeric` : t`Is not a valid number`,
  )
}

const zeroRejection = (label: string | undefined) => {
  return Promise.reject(
    label ? t`${label} must be greater than zero` : t`Is not greater than zero`,
  )
}

/**
 * Rule to determine that the input is an integer.
 */
export const inputNonZeroRule = (props: { label?: string }) => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === undefined || value === null) return Promise.resolve()
    if (typeof value === 'string') {
      const num = parseFloat(value)
      if (isNaN(num)) {
        return nonNumericRejection(props.label)
      }
      if (num <= 0) {
        return zeroRejection(props.label)
      }
      return Promise.resolve()
    }

    if (typeof value !== 'number') return nonNumericRejection(props.label)
    if (value <= 0) {
      return zeroRejection(props.label)
    }
    return Promise.resolve()
  },
})
