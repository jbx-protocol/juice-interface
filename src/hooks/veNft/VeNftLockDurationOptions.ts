import { BigNumber } from '@ethersproject/bignumber'

import { useVeNftContract } from 'hooks/veNft/VeNftContract'
import useV2ContractReader from 'hooks/v2/contractReader/V2ContractReader'

import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

export function useVeNftLockDurationOptions() {
  return useV2ContractReader<BigNumber[]>({
    contract: useVeNftContract(VENFT_CONTRACT_ADDRESS),
    functionName: 'lockDurationOptions',
  })
}
