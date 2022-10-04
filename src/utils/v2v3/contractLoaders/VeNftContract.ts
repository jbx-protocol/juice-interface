import { Contract } from '@ethersproject/contracts'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { SignerOrProvider } from 'models/signerOrProvider'
import { featureFlagEnabled } from 'utils/featureFlags'

export const loadVeNftContract = async (
  signerOrProvider: SignerOrProvider,
  address: string,
) => {
  if (!featureFlagEnabled(FEATURE_FLAGS.VENFT)) return

  const contractJson = {
    abi: (await import(`@jbx-protocol/ve-nft/out/JBVeNft.sol/JBVeNft.json`))
      .abi,
    address,
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
