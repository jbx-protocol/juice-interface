import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { ContractReaderProps, useContractReader } from 'hooks/ContractReader'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'

export type ContractReadResult<V> = { data: V | undefined; loading: boolean }

export default function useV2ContractReader<V>(
  props: Omit<ContractReaderProps<V2V3ContractName, V>, 'contracts'>,
): ContractReadResult<V> {
  const { contracts } = useContext(V2V3ContractsContext)
  return useContractReader({ ...props, contracts })
}
