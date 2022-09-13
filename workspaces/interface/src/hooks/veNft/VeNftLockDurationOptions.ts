import { BigNumber } from '@ethersproject/bignumber'

import useV2ContractReader from 'hooks/v2/contractReader/V2ContractReader'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export function useVeNftLockDurationOptions() {
  return useV2ContractReader<BigNumber[]>({
    contract: useVeNftContract(),
    functionName: 'lockDurationOptions',
  })
}
