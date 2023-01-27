import { searchSepanaProjects } from 'lib/sepana/api'
import { NextApiHandler } from 'next'

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
      typeof pageSize === 'string' && typeof parseInt(pageSize) === 'number'
        ? parseInt(pageSize)
        : undefined,
    )

    res.status(200).json(results)
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
