import { isAddress } from '@ethersproject/address'
import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'

/**
 * Rule to be used in an Ant Design Form.Item object.
 *
 * This rule checks if the input is an eth address.
 */
export const inputMustBeEthAddressRule = (props?: {
  label?: string
  validateTrigger?: string
}) => ({
  validator: (rule: RuleObject, value: unknown) => {
    const label = props?.label ?? t`Address`

    if (value === undefined) return Promise.resolve()
    if (typeof value !== 'string')
      return Promise.reject(t`Invalid type - contact Juicebox Support`)

    if (!isAddress(value)) {
      return Promise.reject(t`${label} is not a valid ETH Address`)
    }
    if (value === constants.AddressZero) {
      return Promise.reject(t`Zero address cannot be used`)
    }
    return Promise.resolve()
  },
  validateTrigger: props?.validateTrigger,
})
