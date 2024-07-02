import { BigNumber, utils } from 'ethers'
import { useContractReader } from 'hooks/ContractReader'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'
import { V1ContractName } from 'packages/v1/models/contracts'
import { useContext } from 'react'
import { normalizeHandle } from 'utils/format/formatHandle'

/** Returns ID of project with `handle`. */
export default function useProjectIdForHandle(handle: string | undefined) {
  const { contracts } = useContext(V1UserContext)
  return useContractReader<V1ContractName.Projects, BigNumber>({
    contracts,
    contract: V1ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [utils.formatBytes32String(normalizeHandle(handle))] : null,
  })
}
