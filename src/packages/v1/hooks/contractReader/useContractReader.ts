import {
  ContractReaderProps,
  useContractReader as useNewContractReader,
} from 'hooks/ContractReader'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'
import { V1ContractName } from 'packages/v1/models/contracts'
import { useContext } from 'react'

export default function useContractReader<V>(
  props: Omit<ContractReaderProps<V1ContractName, V>, 'contracts'>,
): V | undefined {
  const { contracts } = useContext(V1UserContext)
  const { data: value } = useNewContractReader({ ...props, contracts })
  return value
}
