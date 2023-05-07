import { JB721_DELEGATE_V1 } from 'constants/delegateVersions'
import { useContractReadValue } from 'hooks/ContractReader'
import { useJB721TieredGovernance } from '../contracts/useJB721TieredGovernance'

const IJB721TieredDelegate_V1_INTERFACE_ID = '0xf34282c8'

export function useIsJB721DelegateV1({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): { value: boolean; loading: boolean } {
  const contract = useJB721TieredGovernance({
    address: dataSourceAddress,
    version: JB721_DELEGATE_V1,
  })
  const { value: isJB721DelegateV1, loading } = useContractReadValue({
    contract,
    functionName: 'supportsInterface',
    args: [IJB721TieredDelegate_V1_INTERFACE_ID],
  })

  return { value: Boolean(isJB721DelegateV1), loading }
}
