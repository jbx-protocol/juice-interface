import { queryDBProjects } from 'lib/api/supabase/projects'
import { DBProjectQueryOpts } from 'models/dbProject'
import { ProjectTagName } from 'models/project-tags'
import { NextApiHandler } from 'next'

/**
 * Queries database projects using sort and filter options.
 * @returns Raw SQL query response
 */
const handler: NextApiHandler = async (req, res) => {
  const { text, tags, page, pageSize, archived, pv, orderDirection, orderBy } =
    req.query

  // https://vercel.com/guides/how-to-enable-cors#enabling-cors-in-a-next.js-app
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  if (text && typeof text !== 'string') {
    res.status(400).send('Text is not a string')
    return
  }

  if (tags && typeof tags !== 'string') {
    res.status(400).send('Tags is not a string')
    return
  }

  if (pageSize && (Array.isArray(pageSize) || isNaN(parseInt(pageSize)))) {
    res.status(400).send('PageSize is not a number')
    return
  }

  if (page && (Array.isArray(page) || isNaN(parseInt(page)))) {
    res.status(400).send('Page is not a number')
    return
  }

  if (archived && archived !== 'true' && archived !== 'false') {
    res.status(400).send('Archived is not a boolean')
    return
  }

  if (pv && typeof pv !== 'string') {
    res.status(400).send('Invalid PV')
    return
  }

  if (
    orderDirection &&
    (Array.isArray(orderDirection) || !['asc', 'desc'].includes(orderDirection))
  ) {
    res.status(400).send('Invalid orderDirection')
    return
  }

  if (orderBy && Array.isArray(orderBy)) {
    res.status(400).send('Invalid orderBy')
    return
  }

  const _pageSize =
    typeof pageSize === 'string' && typeof parseInt(pageSize) === 'number'
      ? parseInt(pageSize)
      : undefined

  const _page =
    typeof page === 'string' && typeof parseInt(page) === 'number'
      ? parseInt(page)
      : undefined

  try {
    const { data: results } = await queryDBProjects(req, res, {
      text,
      tags: tags?.split(',') as ProjectTagName[],
      pageSize: _pageSize,
      page: _page,
      archived:
        archived === 'true' ? true : archived === 'false' ? false : undefined,
      pv: pv?.split(',') as DBProjectQueryOpts['pv'],
      orderDirection: orderDirection as DBProjectQueryOpts['orderDirection'],
      orderBy: orderBy as DBProjectQueryOpts['orderBy'],
    })

    res.status(200).json(results)
    return
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
