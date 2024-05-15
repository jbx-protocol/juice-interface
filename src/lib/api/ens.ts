import axios from 'axios'
import { readNetwork } from 'constants/networks'
import { SiteBaseUrl } from 'constants/url'
import { resolveAddressEnsIdeas } from 'lib/ensIdeas'
import { NetworkName } from 'models/networkName'

/**
 * Try to resolve an ENS name or address.
 *
 * If mainnet, first tries ENSIdeas API. Then, falls back to our API.
 * @param addressOrEnsName - ens name or address
 * @returns
 */
export function resolveAddress(addressOrEnsName: string) {
  try {
    if (readNetwork.name !== NetworkName.mainnet) {
      throw new Error('Not mainnet, skipping to resolver fallback.')
    }

    return resolveAddressEnsIdeas(addressOrEnsName)
  } catch (e) {
    return axios
      .get<{ name: string; address: string }>(
        `${SiteBaseUrl}api/ens/resolve/${addressOrEnsName}`,
      )
      .then(data => data.data)
  }
}
