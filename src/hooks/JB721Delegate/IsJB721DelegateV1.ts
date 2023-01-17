import { useContractReadValue } from 'hooks/ContractReader'
import { useJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useJB721TieredDelegate'

const IJB721TieredDelegate_V1_INTERFACE_ID = '0xf34282c8'
// const IJB721TieredDelegate_V1_1_INTERFACE_ID = '0x8b1f9b1c'

export function useIsJB721DelegateV1({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): boolean {
  const contract = useJB721TieredDelegate({ address: dataSourceAddress })
  const { value: isJB721DelegateV1 } = useContractReadValue({
    contract,
    functionName: 'supportsInterface',
    args: [IJB721TieredDelegate_V1_INTERFACE_ID],
  })

  return Boolean(isJB721DelegateV1)
}
