import { deleteRecord } from 'lib/sepana'
import { sepanaAlert } from 'lib/sepana/log'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query

  if (typeof id !== 'string' || !id.length) {
    res.status(400).end()
    return
  }

  try {
    await deleteRecord(id).then(async _res => {
      await sepanaAlert({
        type: 'alert',
        alert: 'DELETED_RECORD',
        body: `ID: ${id}`,
      })

      res.status(200).json(_res.data)
    })
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
