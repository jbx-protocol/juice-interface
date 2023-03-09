import { JB721_DELEGATE_V1_1 } from 'constants/delegateVersions'
import { useContractReadValue } from 'hooks/ContractReader'
import { useJB721TieredGovernance } from '../contracts/JB721TieredGovernance'

const IJB721TieredDelegate_V1_1_INTERFACE_ID = '0x82d4b284'

export function useIsJB721DelegateV1_1({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): { value: boolean; loading: boolean } {
  const contract = useJB721TieredGovernance({
    address: dataSourceAddress,
    version: JB721_DELEGATE_V1_1,
  })
  const { value: isJB721DelegateV1_1, loading } = useContractReadValue({
    contract,
    functionName: 'supportsInterface',
    args: [IJB721TieredDelegate_V1_1_INTERFACE_ID],
  })

  return { value: Boolean(isJB721DelegateV1_1), loading }
}
