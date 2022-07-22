import { BigNumber } from '@ethersproject/bignumber'

import { useVeNftContract } from 'hooks/veNft/VeNftContract'
import useV2ContractReader from 'hooks/v2/contractReader/V2ContractReader'

export function useVeNftLockDurationOptions() {
  return useV2ContractReader<BigNumber[]>({
    contract: useVeNftContract(),
    functionName: 'lockDurationOptions',
  })
}
