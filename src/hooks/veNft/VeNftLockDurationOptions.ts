import { BigNumber } from '@ethersproject/bignumber'

import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

import useV2ContractReader from '../v2/contractReader/V2ContractReader'
import { useNFTContract } from './VeNftContract'

export function useNFTLockDurationOptions() {
  return useV2ContractReader<BigNumber[]>({
    contract: useNFTContract(VENFT_CONTRACT_ADDRESS),
    functionName: 'lockDurationOptions',
  })
}
