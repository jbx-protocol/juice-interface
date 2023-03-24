import axios from 'axios'
import { readNetwork } from 'constants/networks'
import { resolveAddressEnsIdeas } from 'lib/ensIdeas'
import { NetworkName } from 'models/networkName'

/**
 * Try to resolve an ENS name or address.
 *
 * If mainnet, first tries ENSIdeas API. Then, falls back to our API.
 * @param address - ens name or address
 * @returns
 */
export function resolveAddress(address: string) {
  try {
    if (readNetwork.name !== NetworkName.mainnet)
      throw new Error('Not mainnet, skipping to resolver fallback.')
    return resolveAddressEnsIdeas(address)
  } catch (e) {
    return axios
      .get<{ name: string; address: string }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/ens/resolve/${address}`,
      )
      .then(data => data.data)
  }
}
