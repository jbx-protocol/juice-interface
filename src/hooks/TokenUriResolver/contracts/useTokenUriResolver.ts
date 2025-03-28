import { Contract } from '@ethersproject/contracts'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import useTokenUriResolverAddress from 'packages/v2v3/hooks/contractReader/TokenUriResolverAddress'
import JBTokenUriResolverJson from './JBTokenUriResolver.json'

export function useTokenUriResolver(): Contract | undefined {
  // the address of the current tokenUriResolver
  const { data } = useTokenUriResolverAddress()

  return useLoadContractFromAddress({
    address: data,
    abi: JBTokenUriResolverJson.abi,
  })
}
