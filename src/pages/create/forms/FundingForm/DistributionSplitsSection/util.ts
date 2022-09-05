import { RuleObject } from 'antd/lib/form'
import { StoreValue } from 'antd/lib/form/interface'
import { validatePercentage } from 'components/formItems/formHelpers'
import { preciseFormatSplitPercent } from 'utils/v2/math'

export function percentageValidator(_rule: RuleObject, value: StoreValue) {
  return validatePercentage(preciseFormatSplitPercent(value ?? 0))
}
