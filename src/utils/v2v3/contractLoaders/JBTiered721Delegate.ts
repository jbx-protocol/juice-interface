import { Contract } from '@ethersproject/contracts'
import { SignerOrProvider } from 'models/signerOrProvider'

export const loadJBTiered721DelegateContract = async (
  address: string,
  signerOrProvider: SignerOrProvider,
): Promise<Contract> => {
  const nftDelegateContractJson = {
    address: address,
    abi: (
      await import(
        `@jbx-protocol/juice-721-delegate/out/IJBTiered721Delegate.sol/IJBTiered721Delegate.json`
      )
    ).abi,
  }

  return new Contract(address, nftDelegateContractJson.abi, signerOrProvider)
}
