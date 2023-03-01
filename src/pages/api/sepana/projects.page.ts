import { searchSepanaProjects, searchSepanaProjectTags } from 'lib/sepana/api'
import { ProjectTag } from 'models/project-tags'
import { NextApiHandler } from 'next'

// Searches Juicebox projects matching text query param
const handler: NextApiHandler = async (req, res) => {
  const { text, tags, pageSize } = req.query

  if (text && typeof text !== 'string') {
    res.status(400).send('Query is not a string')
    return
  }

  if (tags && typeof tags !== 'string') {
    res.status(400).send('Tags is not a string')
    return
  }

  const _pageSize =
    typeof pageSize === 'string' && typeof parseInt(pageSize) === 'number'
      ? parseInt(pageSize)
      : undefined

  try {
    if (text) {
      const results = await searchSepanaProjects(text, _pageSize)
      res.status(200).json(results)
      return
    }

    if (tags?.length) {
      const results = await searchSepanaProjectTags(
        tags.split(',') as ProjectTag[],
        _pageSize,
      )
      res.status(200).json(results)
      return
    }
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
