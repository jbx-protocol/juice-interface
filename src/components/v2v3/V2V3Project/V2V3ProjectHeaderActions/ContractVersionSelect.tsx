import { Select } from 'antd'
import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2CVType, V3CVType } from 'models/cv'
import { useContext } from 'react'

export function ContractVersionSelect() {
  const { setVersion, cv } = useContext(V2V3ContractsContext)

  return (
    <Select
      defaultValue={cv}
      bordered={false}
      className="ant-select-color-secondary"
      onSelect={(value: V2CVType | V3CVType) => setVersion?.(value)}
    >
      <Select.Option value={CV_V2}>V2</Select.Option>
      <Select.Option value={CV_V3}>V3</Select.Option>
    </Select>
  )
}
