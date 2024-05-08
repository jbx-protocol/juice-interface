import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { isAddress } from 'ethers/lib/utils'
import { getLogger } from 'lib/logger'
import { NetworkName } from 'models/networkName'
import { NextApiRequest, NextApiResponse } from 'next'

const logger = getLogger('api/ens/resolve/[address]')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404)
  }

  try {
    const addressOrEnsName = req.query.address as string | undefined
    if (!addressOrEnsName) {
      return res.status(400).json({ error: 'address is required' })
    }

    if (readNetwork.name === NetworkName.sepolia) {
      // ethers v5 doesn't support ens on sepolia
      return res.status(404).json({ error: 'ens not supported on sepolia' })
    }

    let response

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
