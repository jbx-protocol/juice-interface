import { Contract } from '@ethersproject/contracts'
import { readProvider } from 'constants/readProvider'
import { useWallet } from 'hooks/Wallet'

export const loadJBTiered721DelegateContract = async (
  address: string,
): Promise<Contract> => {
  const { signer } = useWallet()

  const signerOrProvider = signer ?? readProvider

  const nftDelegateContractJson = {
    address: address,
    abi: (
      await import(
        `@jbx-protocol/juice-nft-rewards/out/IJBTiered721Delegate.sol/IJBTiered721Delegate.json`
      )
    ).abi,
  }

  return new Contract(address, nftDelegateContractJson.abi, signerOrProvider)
}
