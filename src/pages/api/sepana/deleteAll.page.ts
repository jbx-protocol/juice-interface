import { NextApiHandler } from 'next'
import { deleteAllSepanaDocs, sepanaAlert } from './utils'

/**
 * Synchronizes the Sepana engine with the latest Juicebox Subgraph/IPFS data
 * TODO: REMOVE. Currently only needed for testing
 */
const handler: NextApiHandler = async (_, res) => {
  try {
    await deleteAllSepanaDocs()
  } catch (error) {
    await sepanaAlert({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: JSON.stringify(error),
    })

    res.status(500).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      message: 'Failed to delete Sepana records',
      error,
    })
  }

  await sepanaAlert({ type: 'alert', alert: 'DELETED_ALL_RECORDS' })

  res.status(200).json({
    network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
    message: 'Deleted all Sepana records',
  })
}

export default handler
