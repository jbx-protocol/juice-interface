import { RuleObject } from 'antd/lib/form'
import { inputAlreadyExistsRule } from './inputAlreadyExistsRule'

/**
 * Rule is the same as {@link inputAlreadyExistsRule}, however will allow for
 * the same beneficiary, if supplied.
 */
export const allocationInputAlreadyExistsRule = (props: {
  inputs: string[]
  editingAddressBeneficiary: string | undefined
}) => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === undefined) return Promise.resolve()
    if (typeof value !== 'string')
      return Promise.reject('Invalid type - contact Juicebox Support')
    if (
      props.editingAddressBeneficiary &&
      value === props.editingAddressBeneficiary
    ) {
      return Promise.resolve()
    }
    return inputAlreadyExistsRule(props).validator(rule, value)
  },
})
