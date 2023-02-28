import { RuleObject } from 'antd/lib/form'
import { isEqual } from 'lodash'

/**
 * Rule is the same as {@link inputAlreadyExistsRule}, however will allow for
 * the same beneficiary, if supplied.
 */
export const allocationInputAlreadyExistsRule = (props: {
  existingAllocations: { beneficiary: string; projectId: string | undefined }[]
  inputProjectId: string | undefined
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

    const currentInputToValidate = {
      beneficiary: value,
      projectId: props.inputProjectId?.toString(),
    }

    if (
      props.existingAllocations.find(v => isEqual(v, currentInputToValidate))
    ) {
      return Promise.reject(`Value has already been submitted`)
    }
    return Promise.resolve()
  },
})
