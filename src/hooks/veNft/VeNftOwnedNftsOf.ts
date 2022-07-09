import { BigNumber } from '@ethersproject/bignumber'

import useContractReader from 'hooks/v2/contractReader/V2ContractReader'

import { VENFT_CONTRACT_ADDRESS } from 'constants/v2/veNft/veNftProject'
import { useNFTContract } from './VeNftContract'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useOwnedNFTsOf(userAddress: string | undefined) {
  return useContractReader<BigNumber>({
    contract: useNFTContract(VENFT_CONTRACT_ADDRESS),
    functionName: 'balanceOf',
    args: [userAddress],
  })
}
