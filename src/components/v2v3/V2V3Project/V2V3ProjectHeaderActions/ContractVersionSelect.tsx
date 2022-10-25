import { Select } from 'antd'
import { BaseOptionType } from 'antd/lib/select'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { CV2V3 } from 'models/cv'
import { useContext } from 'react'

const CV_LABELS = {
  [CV_V2]: 'V2',
  [CV_V3]: 'V3',
}

/**
 * A Select component to switch between V2 and V3 contracts.
 */
export function ContractVersionSelect() {
  const { setVersion, cv, cvs } = useContext(V2V3ContractsContext)

  const SELECT_OPTIONS: BaseOptionType[] =
    cvs?.map(cv => ({
      label: CV_LABELS[cv],
      value: cv,
    })) ?? []

  if (SELECT_OPTIONS.length < 2) {
    return <ProjectVersionBadge versionText={`V${cv}`} />
  }

  return (
    <Select
      defaultValue={cv}
      bordered={false}
      className="ant-select-color-secondary"
      onSelect={(value: CV2V3) => setVersion?.(value)}
      options={SELECT_OPTIONS}
    />
  )
}
