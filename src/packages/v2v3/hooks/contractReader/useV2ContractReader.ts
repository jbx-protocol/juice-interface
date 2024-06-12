import { ContractReaderProps, useContractReader } from 'hooks/ContractReader'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { useContext } from 'react'

export type ContractReadResult<V> = {
  data: V | undefined
  loading: boolean
  refetchValue: () => void
}

export default function useV2ContractReader<V>(
  props: Omit<ContractReaderProps<V2V3ContractName, V>, 'contracts'>,
): ContractReadResult<V> {
  const { contracts } = useContext(V2V3ContractsContext)
  return useContractReader({ ...props, contracts })
}
