import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from '../v2v3/contractReader/V2ContractReader'

export function useVeNftResolverTokenUri(
  amount: BigNumber,
  duration: BigNumberish,
  lockDurationOptions: BigNumber[] | undefined,
) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBVeTokenUriResolver,
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
