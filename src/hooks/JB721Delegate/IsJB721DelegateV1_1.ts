import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import JB721TieredGovernanceJson from '@jbx-protocol/juice-721-delegate/out/JB721TieredGovernance.sol/JB721TieredGovernance.json'

const IJB721TieredDelegate_V1_1_INTERFACE_ID = '0x8b1f9b1c'

export function useIsJB721DelegateV1_1({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): boolean {
  const contract = useLoadContractFromAddress({
    address: dataSourceAddress,
    abi: JB721TieredGovernanceJson.abi,
  })
  const { value: isJB721DelegateV1 } = useContractReadValue({
    contract,
    functionName: 'supportsInterface',
    args: [IJB721TieredDelegate_V1_1_INTERFACE_ID],
  })

  return Boolean(isJB721DelegateV1)
}
