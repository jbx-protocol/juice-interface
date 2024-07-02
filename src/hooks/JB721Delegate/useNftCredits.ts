import { BigNumber } from 'ethers'
import { JB721DelegateContractsContext } from 'packages/v2v3/contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import useV2ContractReader from 'packages/v2v3/hooks/contractReader/useV2ContractReader'
import { useContext } from 'react'

/**
 * Return the wei amount of unused credits for a given address.
 * @example If the user paid 1 ETH and didnt mint a 1 ETH NFT, then they have 1 ETH of unused credits.
 * @param address
 * @returns
 */
export function useNftCredits(address: string | undefined) {
  const {
    contracts: { JB721TieredDelegate },
  } = useContext(JB721DelegateContractsContext)

  return useV2ContractReader<BigNumber>({
    contract: JB721TieredDelegate,
    functionName: 'creditsOf',
    args: address ? [address] : null,
  })
}
