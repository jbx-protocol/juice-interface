import { JBChainId } from 'juice-sdk-core'
import { enableCors } from 'lib/api/nextjs'
import { queryDBProjectsAggregates } from 'lib/api/supabase/projects'
import { DBProjectQueryOpts } from 'models/dbProject'
import { ProjectTagName } from 'models/project-tags'
import { NextApiHandler } from 'next'

/**
 * Queries database projects using sort and filter options.
 * @returns Raw SQL query response
 */
const handler: NextApiHandler = async (req, res) => {
  enableCors(res)

  const {
    text,
    tags,
    page,
    pageSize,
    archived,
    pv,
    orderDirection,
    orderBy,
    owner,
    creator,
    chainIds,
    ids,
  } = req.query

  if (text && typeof text !== 'string') {
    res.status(400).send('Text is not a string')
    return
  }

  if (owner && typeof owner !== 'string') {
    res.status(400).send('Owner is not a string')
    return
  }

  if (creator && typeof creator !== 'string') {
    res.status(400).send('Creator is not a string')
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

  if (chainIds && typeof chainIds !== 'string') {
    res.status(400).send('Invalid chainIds')
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

  if (ids && typeof ids !== 'string') {
    res.status(400).send('Invalid ids')
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

  const _chainIds = chainIds?.split(',').map(i => parseInt(i) as JBChainId)

  const _pageSize = pageSize ? parseInt(pageSize) : undefined

  const _page = page ? parseInt(page) : undefined

  try {
    const { data: results } = await queryDBProjectsAggregates(req, res, {
      text,
      tags: tags?.split(',') as ProjectTagName[],
      pageSize: _pageSize,
      page: _page,
      archived:
        archived === 'true' ? true : archived === 'false' ? false : undefined,
      pv: pv?.split(',') as DBProjectQueryOpts['pv'],
      orderDirection: orderDirection as DBProjectQueryOpts['orderDirection'],
      orderBy: orderBy as DBProjectQueryOpts['orderBy'],
      owner,
      creator,
      chainIds: _chainIds,
      ids: ids?.split(','),
    })

    res.status(200).json(results)
    return
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
