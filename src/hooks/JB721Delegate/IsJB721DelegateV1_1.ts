import JB721TieredGovernanceJson from '@jbx-protocol/juice-721-delegate/out/JB721TieredGovernance.sol/JB721TieredGovernance.json'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

const IJB721TieredDelegate_V1_1_INTERFACE_ID = '0x82d4b284'

export function useIsJB721DelegateV1_1({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): { value: boolean; loading: boolean } {
  const contract = useLoadContractFromAddress({
    address: dataSourceAddress,
    abi: JB721TieredGovernanceJson.abi,
  })
  const { value: isJB721DelegateV1_1, loading } = useContractReadValue({
    contract,
    functionName: 'supportsInterface',
    args: [IJB721TieredDelegate_V1_1_INTERFACE_ID],
  })

  return { value: Boolean(isJB721DelegateV1_1), loading }
}
