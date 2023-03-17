import axios from 'axios'
import { resolveAddress as resolveAddressFromInfura } from './api/ens'

const ENS_IDEAS_BASE_URL = 'https://api.ensideas.com'

/**
 * Try to resolve an Eth address to an ENS name using ENS Ideas API.
 *
 * Fall back to Infura (via ethers.js).
 */
export async function resolveAddress(address: string) {
  try {
    const response = await axios.get<{ name: string; address: string }>(
      `${ENS_IDEAS_BASE_URL}/ens/resolve/${address}`,
    )

    return response.data
  } catch {
    return resolveAddressFromInfura(address)
  }
}
