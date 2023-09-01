import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import { useContext } from 'react'
import useV2ContractReader from '../../v2v3/contractReader/useV2ContractReader'

export function useNftCollectionMetadataUri(
  dataSourceAddress: string | undefined,
) {
  const {
    contracts: { JB721TieredDelegateStore, JB721TieredDelegate },
    version,
  } = useContext(JB721DelegateContractsContext)

  // V3/3.1
  const v3response = useV2ContractReader<string>({
    contract: JB721TieredDelegateStore,
    functionName: 'contractUriOf',
    args:
      version === JB721DelegateVersion.JB721DELEGATE_V3 ||
      version === JB721DelegateVersion.JB721DELEGATE_V3_1
        ? [dataSourceAddress]
        : null,
  })

  const v3_2_response = useV2ContractReader<string>({
    contract: JB721TieredDelegate,
    functionName: 'contractURI',
    args:
      version === JB721DelegateVersion.JB721DELEGATE_V3_2 ||
      JB721DelegateVersion.JB721DELEGATE_V3_3 ||
      JB721DelegateVersion.JB721DELEGATE_V3_4
        ? undefined
        : null,
  })

  return version === JB721DelegateVersion.JB721DELEGATE_V3 ||
    version === JB721DelegateVersion.JB721DELEGATE_V3_1
    ? v3response
    : v3_2_response
}
