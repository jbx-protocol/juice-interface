import { readProvider } from 'constants/readProvider'
import { isAddress } from 'ethers/lib/utils'
import { resolveAddress } from 'lib/ensIdeas'

export const resolveEnsNameAddressPair = async (
  addressOrEnsName: string,
): Promise<{ name: string; address: string } | undefined> => {
  try {
    return await resolveAddress(addressOrEnsName)
  } catch (e) {
    if (isAddress(addressOrEnsName)) {
      const { name } = await resolveAddress(addressOrEnsName)
      return {
        address: addressOrEnsName,
        name,
      }
    }

    if (addressOrEnsName.endsWith('.eth')) {
      const address = await readProvider.resolveName(addressOrEnsName)
      if (!address) return undefined
      return {
        address,
        name: addressOrEnsName,
      }
    }

    return undefined
  }
}
