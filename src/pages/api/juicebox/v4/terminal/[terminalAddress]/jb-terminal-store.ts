import { readJbMultiTerminalStore } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import { enableCors } from 'lib/api/nextjs'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { getWagmiConfig } from '@getpara/evm-wallet-connectors';
import { Address } from 'viem'

const logger = getLogger('api/v4/terminal/[terminalAddress]/jb-terminal-store')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  enableCors(res)

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const { terminalAddress } = req.query
    const chainId = Number(req.query.chainId as string) as JBChainId

    if (!terminalAddress || !chainId) {
      return res
        .status(400)
        .json({ error: 'terminalAddress and chainId is required' })
    }
    const wagmiConfig = getWagmiConfig();
    const terminalStoreAddress = await readJbMultiTerminalStore(wagmiConfig, {
      chainId,
      address: terminalAddress as Address,
    })

    // cache for 1 week
    res.setHeader(
      'Cache-Control',
      `s-maxage=${86400 * 7}, stale-while-revalidate`,
    )
    const data = { terminalStoreAddress }
    logger.info({ data })
    return res.status(200).json(data)
  } catch (err) {
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to resolve terminal store' })
  }
}

export default handler
