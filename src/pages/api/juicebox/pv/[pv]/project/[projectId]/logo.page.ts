import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import axios from 'axios'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'
import {
  cidFromUrl,
  ipfsGatewayUrl,
  ipfsUriToGatewayUrl,
  isIpfsUri,
} from 'utils/ipfs'

const logger = getLogger('api/juicebox/pv/[pv]/project/[projectId]/logo')

async function findLogoFromDb(
  req: NextApiRequest,
  res: NextApiResponse,
  projectId: string,
  pv: string,
) {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const query = await supabase
    .from('projects')
    .select('logo_uri')
    .eq('project_id', projectId)
    .eq('pv', pv)

  if (query.error) throw query.error

  return query.data?.[0]?.logo_uri as string | undefined
}

/**
 *
 * @dev 2 sync ops happening here:
 * 1. query the project logo URI from DB
 * 2. fetch the project logo image data
 *
 * Thus this endpoint should be cached.
 * However, the ideal duration is TBD.
 * Please consider changing (lowering) if it causes issues with users.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const { projectId, pv } = req.query
    if (!projectId || !pv) {
      return res.status(400).json({ error: 'projectId is required' })
    }

    const logoUri = await findLogoFromDb(
      req,
      res,
      projectId as string,
      pv as string,
    )
    if (!logoUri) {
      return res.status(404).json({ error: 'project logo not found' })
    }

    const imageUrl = isIpfsUri(logoUri)
      ? ipfsUriToGatewayUrl(logoUri)
      : // Some older JB projects have a logo URI hardcoded to use Pinata.
        // JBM no longer uses Pinata.
        // This rewrites those URLs to use the Infura gateway.
        ipfsGatewayUrl(cidFromUrl(logoUri))

    const logoImageRes = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    })

    const contentType = logoImageRes.headers['content-type'] ?? 'image/png'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', logoImageRes.data.length)
    // cache for 5 minutes
    res.setHeader('Cache-Control', `s-maxage=${60 * 5}, stale-while-revalidate`)

    return res.end(logoImageRes.data, 'binary')
  } catch (err) {
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to resolve project logo' })
  }
}

export default handler
