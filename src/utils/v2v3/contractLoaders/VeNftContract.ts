import { Contract } from '@ethersproject/contracts'
import { SignerOrProvider } from 'models/signerOrProvider'

export const loadVeNftContract = async (
  signerOrProvider: SignerOrProvider,
  address: string,
) => {
  const contractJson = {
    abi: (await import(`@jbx-protocol/ve-nft/out/JBVeNft.sol/JBVeNft.json`))
      .abi,
    address,
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
