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
    sepanaAlert({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: typeof error === 'string' ? { error } : undefined,
    })

    res.status(500).send({
      message: 'Failed to delete Sepana docs',
      error,
    })
  }

  sepanaAlert({ type: 'alert', alert: 'DELETED_RECORDS' })

  res.status(200).send('Deleted all Sepana docs')
}

export default handler
