import * as providers from '@ethersproject/providers'
import { Signer } from 'ethers/lib/ethers'

export type SignerOrProvider = Signer | providers.JsonRpcProvider
