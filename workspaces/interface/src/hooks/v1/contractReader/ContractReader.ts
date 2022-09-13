import { V1UserContext } from 'contexts/v1/userContext'
import {
  ContractReaderProps,
  useContractReader as useNewContractReader,
} from 'hooks/ContractReader'
import { V1ContractName } from 'models/v1/contracts'
import { useContext } from 'react'

export default function useContractReader<V>(
  props: Omit<ContractReaderProps<V1ContractName, V>, 'contracts'>,
): V | undefined {
  const { contracts } = useContext(V1UserContext)
  const { data: value } = useNewContractReader({ ...props, contracts })
  return value
}
