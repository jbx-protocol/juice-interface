import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'

/**
 * Rule to determine if the input already matches other `inputs`.
 */
export const inputAlreadyExistsRule = (props: { inputs: string[] }) => ({
  validator: (rule: RuleObject, value: unknown) => {
    if (value === undefined) return Promise.resolve()
    if (typeof value !== 'string')
      return Promise.reject(t`Invalid type - contact Juicebox Support`)
    if (props.inputs.includes(value)) {
      return Promise.reject(t`Value has already been submitted`)
    }

    return Promise.resolve()
  },
})
