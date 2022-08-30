import { V2UserContext } from 'contexts/v2/userContext'
import { ContractReaderProps, useContractReader } from 'hooks/ContractReader'
import { V2ContractName } from 'models/v2/contracts'
import { useContext } from 'react'

export type ContractReadResult<V> = { data: V | undefined; loading: boolean }

export default function useV2ContractReader<V>(
  props: Omit<ContractReaderProps<V2ContractName, V>, 'contracts'>,
): ContractReadResult<V> {
  const { contracts } = useContext(V2UserContext)
  return useContractReader({ ...props, contracts })
}
