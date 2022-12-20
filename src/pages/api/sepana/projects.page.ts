import { NextApiHandler } from 'next'

import { searchSepanaProjects } from './utils'

// Searches Juicebox projects matching text query param
const handler: NextApiHandler = async (req, res) => {
  const { text, pageSize } = req.query

  if (typeof text !== 'string') {
    res.status(400).send('Query is not a string')
    return
  }

  try {
    const results = await searchSepanaProjects(
      text,
      typeof pageSize === 'number' ? pageSize : undefined,
    )

    res.status(200).json(results.data.hits)
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
