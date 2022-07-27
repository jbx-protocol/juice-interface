import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { useVeNftResolverContract } from 'hooks/veNft/VeNftResolverContract'

import useV2ContractReader from '../v2/contractReader/V2ContractReader'

export function useVeNftResolverTokenUri(
  resolverAddress: string | undefined,
  amount: BigNumber,
  duration: BigNumberish,
  lockDurationOptions: BigNumber[] | undefined,
) {
  return useV2ContractReader<string>({
    contract: useVeNftResolverContract(resolverAddress),
    functionName: 'tokenURI',
    args: [
      1, // _tokenId
      amount, // _amount
      duration, // _duration
      1, // _lockEndTime
      lockDurationOptions, // _lockDurationOptions
    ],
  })
}
