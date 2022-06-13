import { BigNumber } from '@ethersproject/bignumber'

import useContractReader from 'hooks/v2/contractReader/V2ContractReader'

import { VEBANNY_CONTRACT_ADDRESS } from 'constants/v2/nft/nftProject'
import { useNFTContract } from './VeNftContract'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useOwnedNFTsOf(userAddress: string | undefined) {
  return useContractReader<BigNumber>({
    contract: useNFTContract(VEBANNY_CONTRACT_ADDRESS),
    functionName: 'balanceOf',
    args: [userAddress],
  })
}
