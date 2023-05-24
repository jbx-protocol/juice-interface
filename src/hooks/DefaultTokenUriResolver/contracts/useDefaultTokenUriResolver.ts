import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import DefaultTokenUriResolverJson from './DefaultTokenUriResolver.json'
import { Contract } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { useTokenUriResolver } from 'hooks/TokenUriResolver/contracts/useTokenUriResolver'

// Reading addresses from contracts because `juice-token-resolver` is not published on NPM and has irregular naming patterns.
export function useDefaultTokenUriResolver(): Contract | undefined {
  const { value } = useContractReadValue<string, string>({
    contract: useTokenUriResolver(),
    functionName: 'defaultTokenUriResolver',
    args: [],
  })

  return useLoadContractFromAddress({
    address: value,
    abi: DefaultTokenUriResolverJson.abi,
  })
}
