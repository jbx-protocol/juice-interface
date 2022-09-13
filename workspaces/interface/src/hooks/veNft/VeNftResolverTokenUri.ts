import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from '../v2/contractReader/V2ContractReader'

export function useVeNftResolverTokenUri(
  amount: BigNumber,
  duration: BigNumberish,
  lockDurationOptions: BigNumber[] | undefined,
) {
  return useV2ContractReader<string>({
    contract: V2ContractName.JBVeTokenUriResolver,
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
