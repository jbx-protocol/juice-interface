import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'
import { authenticateProjectUpdateOperation } from '../authenticateProjectUpdateOperation'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await sudoPublicDbClient.auth.getSession()
  if (!session) return res.status(401).json({ message: 'Unauthorized.' })

  try {
    switch (req.method) {
      case 'GET':
        return await GET(req, res)
      case 'DELETE':
        return await DELETE(req, res)
      default: {
        return res.status(405).json({ message: 'Method not allowed.' })
      }
    }
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })
  const result = await supabase
    .from('project_updates')
    .select('*,users (wallet)')
    .eq('project', req.query.projectId)
    .eq('id', req.query.projectUpdateId)
    .maybeSingle()
  if (result.error) {
    console.error('Error occurred', result.error)
    if (result.error.code === '42P01') {
      return res.status(404).json({ message: 'Project not found.' })
    }
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
  if (!result.data) {
    return res.status(404).json({ message: 'Project update not found.' })
  }
  return res.status(200).json({
    createdAt: result.data.created_at,
    id: result.data.id,
    imageUrl: result.data.image_url,
    message: result.data.message,
    posterWallet: (result.data.users as { wallet: string }).wallet,
    project: result.data.project,
    title: result.data.title,
  })
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await authenticateProjectUpdateOperation(req, res)
  if (!session) return

  const { error } = await sudoPublicDbClient
    .from('project_updates')
    .delete()
    .eq('id', req.query.projectUpdateId)
    .eq('project', req.query.projectId)

  if (error) {
    console.error('Error occurred', error)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }

  return res.status(200).json({ message: 'Success.' })
}

export default handler
