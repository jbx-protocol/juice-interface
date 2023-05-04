import { providers } from 'ethers'
import { Signer } from 'ethers/lib/ethers'

export type SignerOrProvider = Signer | providers.JsonRpcProvider
