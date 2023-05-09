import { Contract } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import useTokenUriResolverAddress from 'hooks/v2v3/contractReader/TokenUriResolverAddress'
import JBTokenUriResolverJson from './JBTokenUriResolver.json'

export function useTokenUriResolver(): Contract | undefined {
  // the address of the current tokenUriResolver
  const { data } = useTokenUriResolverAddress()

  return useLoadContractFromAddress({
    address: data,
    abi: JBTokenUriResolverJson.abi,
  })
}
