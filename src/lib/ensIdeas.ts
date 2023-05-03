import axios from 'axios'

const ENS_IDEAS_BASE_URL = 'https://api.ensideas.com'

/**
 * Try to resolve an Eth address to an ENS name using ENS Ideas API.
 *
 * NOTE: only works on mainnet.
 */
export async function resolveAddressEnsIdeas(addressOrEnsName: string) {
  const response = await axios.get<{ name: string | null; address: string }>(
    `${ENS_IDEAS_BASE_URL}/ens/resolve/${addressOrEnsName}`,
  )

  return response.data
}
