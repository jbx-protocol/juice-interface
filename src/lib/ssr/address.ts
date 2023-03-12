import { readProvider } from 'constants/readProvider'
import { isAddress } from 'ethers/lib/utils'

export const resolveEnsNameAddressPair = async (addressOrEnsName: string) => {
  if (isAddress(addressOrEnsName)) {
    const ensName = await readProvider.lookupAddress(addressOrEnsName)
    return {
      address: addressOrEnsName,
      ensName,
    }
  }

  if (addressOrEnsName.endsWith('.eth')) {
    const address = await readProvider.resolveName(addressOrEnsName)
    if (!address) return undefined
    return {
      address,
      ensName: addressOrEnsName,
    }
  }

  return undefined
}
