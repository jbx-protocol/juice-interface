import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { parseWad } from 'utils/formatNumber'

import { useNFTResolverContract } from 'hooks/veNft/VeNftResolverContract'

import useV2ContractReader from '../v2/contractReader/V2ContractReader'

export function useNFTResolverTokenURI(
  resolverAddress: string | undefined,
  amount: number,
  duration: BigNumberish,
  lockDurationOptions: BigNumber[] | undefined,
) {
  return useV2ContractReader<string>({
    contract: useNFTResolverContract(resolverAddress),
    functionName: 'tokenURI',
    // TODO: Why are there dummy args here?
    args: [1, parseWad(amount), duration, 1, lockDurationOptions],
  })
}
