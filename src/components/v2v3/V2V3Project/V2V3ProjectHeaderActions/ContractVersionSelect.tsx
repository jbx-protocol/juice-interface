import { CheckboxOptionType, Radio } from 'antd'
import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { CV2V3 } from 'models/v2v3/cv'
import { useContext } from 'react'

const CV_LABELS: Record<CV2V3, string> = {
  [CV_V2]: 'V2',
  [CV_V3]: 'V3',
}

/**
 * A Select component to switch between V2 and V3 contracts.
 */
export function ContractVersionSelect() {
  const { setCv, cv, cvs } = useContext(V2V3ContractsContext)

  const SELECT_OPTIONS: CheckboxOptionType[] =
    cvs?.map(cv => ({
      label: CV_LABELS[cv],
      value: cv,
    })) ?? []

  return (
    <Radio.Group
      options={SELECT_OPTIONS}
      onChange={e => setCv?.(e.target.value)}
      value={cv}
      optionType="button"
      size="small"
    />
  )
}
