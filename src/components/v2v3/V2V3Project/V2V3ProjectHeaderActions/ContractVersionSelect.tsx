import { Select } from 'antd'
import { BaseOptionType } from 'antd/lib/select'
import { CV_V2, CV_V3 } from 'constants/cv'
import { readNetwork } from 'constants/networks'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2CVType, V3CVType } from 'models/cv'
import { NetworkName } from 'models/network-name'
import { useContext } from 'react'

/**
 * Note:
 * - V2 isn't available on goerli.
 * - V3 isn't available on rinkeby.
 */
const SELECT_OPTIONS: BaseOptionType[] = [
  readNetwork.name !== NetworkName.goerli && {
    value: CV_V2,
    label: 'V2',
  },
  readNetwork.name !== NetworkName.rinkeby && {
    value: CV_V3,
    label: 'V3',
  },
].filter(Boolean) as BaseOptionType[]

/**
 * A Select component that allows the user to switch between V2 and V3 contracts.
 */
export function ContractVersionSelect() {
  const { setVersion, cv } = useContext(V2V3ContractsContext)

  return (
    <Select
      defaultValue={cv}
      bordered={false}
      className="ant-select-color-secondary"
      onSelect={(value: V2CVType | V3CVType) => setVersion?.(value)}
      options={SELECT_OPTIONS}
    />
  )
}
