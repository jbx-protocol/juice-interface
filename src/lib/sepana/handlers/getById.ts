import { NextApiHandler } from 'next'

import { getRecord } from '../api'
import { SPEngine } from '../api/engines'

export const getByIdHandler =
  (
    engine: SPEngine,
    opts?: {
      idValidator?: (x: string) => boolean
    },
  ): NextApiHandler =>
  async (req, res) => {
    const { id } = req.query

    if (typeof id === 'string') {
      if (opts?.idValidator && !opts.idValidator(id)) {
        res.status(400).send('Incorrect ID format')
        return
      }

      try {
        const record = await getRecord(id, engine)

        res.status(200).json(record)
      } catch (e) {
        res.status(500).send(e)
      }

      return
    }

    res.status(400)
    return
  }
