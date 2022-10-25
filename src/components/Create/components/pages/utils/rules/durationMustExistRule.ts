import { t } from '@lingui/macro'
import { RuleObject } from 'antd/lib/form'
import { DurationInputValue } from 'components/Create/components/DurationInput'

/**
 * Rule to be used in an Ant Design Form.Item object.
 *
 * This rule checks if the DurationInput exists, otherwise rejects with an
 * invalid message.
 */
export const durationMustExistRule = (props?: { label?: string }) => ({
  validator: (rule: RuleObject, value: unknown | DurationInputValue) => {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value as any).duration === undefined
    ) {
      return Promise.reject(
        props?.label ? t`${props.label} is required` : 'Required',
      )
    }

    return Promise.resolve()
  },
})
