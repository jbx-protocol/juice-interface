import { useContractReadValue } from 'hooks/ContractReader'
import { useJBDelegatesRegistry } from 'hooks/JBDelegatesRegistry/contracts/JBDelegatesRegistry'
import { isZeroAddress } from 'utils/address'

export function useIsJB721DelegateV1_1({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): { value: boolean; loading: boolean } {
  const JBDelegatesRegistry = useJBDelegatesRegistry()
  const { value: deployerAddress, loading } = useContractReadValue<
    string,
    string
  >({
    contract: JBDelegatesRegistry,
    functionName: 'deployerOf',
    args: dataSourceAddress ? [dataSourceAddress] : null,
  })

  const isJB721DelegateV1_1 =
    Boolean(deployerAddress) && !isZeroAddress(deployerAddress)

  return { value: isJB721DelegateV1_1, loading }
}
