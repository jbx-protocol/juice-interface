import { getPublicClient } from '@wagmi/core'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { getLogger } from 'lib/logger'
import { NetworkName } from 'models/networkName'
import { NextApiRequest, NextApiResponse } from 'next'
import { wagmiConfig } from 'contexts/Para/Providers'
import { isAddress } from 'viem'

const logger = getLogger('api/ens/resolve/[address]')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    logger.error(`invalid method - ${req.method}`)
    return res.status(405).end()
  }

  try {
    const addressOrEnsName = req.query.address as string | undefined
    if (!addressOrEnsName) {
      logger.error('address is required')
      return res.status(400).json({ error: 'address is required' })
    }

    let response

    if (readNetwork.name === NetworkName.sepolia) {
      // wagmi client ens resolution
      response = await resolveUsingWagmiClient(addressOrEnsName)
    } else {
      // Legacy ethers v5 ens resolution
      if (isAddress(addressOrEnsName)) {
        const name = await readProvider.lookupAddress(addressOrEnsName)
        response = {
          address: addressOrEnsName,
          name,
        }
      }

      if (addressOrEnsName.endsWith('.eth')) {
        const address = await readProvider.resolveName(addressOrEnsName)
        if (!address) response = undefined

        response = {
          address,
          name: addressOrEnsName,
        }
      }
    }

    if (!response) {
      return res.status(404).json({ error: 'address or ens name not found' })
    }

    // cache for a day
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    logger.info(addressOrEnsName, response)

    return res.status(200).json(response)
  } catch (err) {
    logger.error({ error: err })

    return res.status(500).json({ error: 'failed to resolve ens name' })
  }
}

export default handler

// Minimise changing too much code but as ethers v5 doesn't support ens on sepolia, we can remove the check for sepolia and just use the wagmi client to resolve the address
const resolveUsingWagmiClient = async (addressOrEnsName: string) => {
  if (readNetwork.name !== NetworkName.sepolia) {
    throw new Error('wagmi resolution only supported for sepolia')
  }
  const client = getPublicClient(wagmiConfig, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chainId: readNetwork.chainId as any,
  })

  if (!client) {
    throw new Error('Failed to get public client')
  }

  let response

  if (isAddress(addressOrEnsName)) {
    const name = await client.getEnsName({ address: addressOrEnsName })
    response = {
      address: addressOrEnsName,
      name,
    }
  }

  if (addressOrEnsName.endsWith('.eth')) {
    const address = await client.getEnsAddress({ name: addressOrEnsName })
    if (!address) response = undefined

    response = {
      address,
      name: addressOrEnsName,
    }
  }

  return response
}
