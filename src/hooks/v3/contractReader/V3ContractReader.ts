import { V3UserContext } from 'contexts/v3/userContext'
import { ContractReaderProps, useContractReader } from 'hooks/ContractReader'
import { V3ContractName } from 'models/v3/contracts'
import { useContext } from 'react'

export type ContractReadResult<V> = { data: V | undefined; loading: boolean }

export default function useV3ContractReader<V>(
  props: Omit<ContractReaderProps<V3ContractName, V>, 'contracts'>,
): ContractReadResult<V> {
  const { contracts } = useContext(V3UserContext)
  return useContractReader({ ...props, contracts })
}
