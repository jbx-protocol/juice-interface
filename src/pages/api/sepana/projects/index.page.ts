import { searchSepanaProjects } from 'lib/sepana/api'
import { NextApiHandler } from 'next'

// Searches Juicebox projects matching text query param
const handler: NextApiHandler = async (req, res) => {
  const { text, pageSize } = req.query

  if (typeof text !== 'string' || !text.length) {
    res.status(400).send('Invalid text param')
    return
  }

  try {
    const results = await searchSepanaProjects(
      text,
      typeof pageSize === 'string' && !isNaN(parseInt(pageSize))
        ? parseInt(pageSize)
        : undefined,
    )

    res.status(200).json(results)
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
