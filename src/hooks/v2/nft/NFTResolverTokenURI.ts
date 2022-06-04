import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import useV2ContractReader from '../contractReader/V2ContractReader'
import { useNFTResolverContract } from './NFTResolverContract'

export function useNFTResolverTokenURI(
  resolverAddress: string | undefined,
  // TODO: Change to bignumber, fix duration
  amount: number,
  duration: BigNumberish,
  lockDurationOptions: BigNumber[] | undefined,
) {
  return useV2ContractReader<string>({
    contract: useNFTResolverContract(resolverAddress),
    functionName: 'tokenURI',
    // TODO: Why are there dummy args here?
    args: [1, amount, duration, 1, lockDurationOptions],
  })
}
