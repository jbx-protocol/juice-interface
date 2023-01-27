import { deleteAllRecords } from 'lib/sepana/api'
import { sepanaLog } from 'lib/sepana/log'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (_, res) => {
  try {
    await deleteAllRecords()

    await sepanaLog({ type: 'alert', alert: 'DELETED_ALL_RECORDS' })

    res.status(200).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      message: 'Deleted all Sepana records',
    })
  } catch (error) {
    await sepanaLog({
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
}

export default handler
