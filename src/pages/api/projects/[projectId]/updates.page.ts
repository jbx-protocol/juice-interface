import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { NextApiRequest, NextApiResponse } from 'next'
import { authenticateUserApiCall } from 'server/auth'
import { Database } from 'types/database.types'
import { isEqualAddress } from 'utils/address'
import * as Yup from 'yup'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await sudoPublicDbClient.auth.getSession()
  if (!session) return res.status(401).json({ message: 'Unauthorized.' })

  try {
    switch (req.method) {
      case 'POST':
        return await POST(req, res)
      case 'GET':
        return await GET(req, res)
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
    .order('created_at', { ascending: false })
  if (result.error) {
    console.error('Error occurred', result.error)
    if (result.error.code === '42P01') {
      return res.status(404).json({ message: 'Project not found.' })
    }
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
  return res.status(200).json(
    result.data.map(d => ({
      createdAt: d.created_at,
      id: d.id,
      imageUrl: d.image_url,
      message: d.message,
      posterWallet: (d.users as { wallet: string }).wallet,
      project: d.project,
      title: d.title,
    })),
  )
}

const POSTSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(100, 'Too long'),
  message: Yup.string().required('Message is required').max(3000, 'Too long'),
  imageUrl: Yup.string().url('Invalid URL'),
})

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await authenticateUserApiCall(req, res)
  if (!session) return

  const projectResult = await sudoPublicDbClient
    .from('projects')
    .select()
    .eq('id', req.query.projectId)
    .single()

  if (projectResult.error) {
    console.error('Error occurred', projectResult.error)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }

  const userResult = await sudoPublicDbClient
    .from('users')
    .select()
    .eq('id', session.user.id)
    .single()
  if (userResult.error) {
    console.error('Error occurred', userResult.error)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }

  if (!isEqualAddress(userResult.data.wallet, projectResult.data.owner)) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const result = await POSTSchema.validate(req.body)
  const { title, message, imageUrl } = result
  const { projectId } = req.query as { projectId: string }
  if (!projectId)
    return res.status(400).json({ message: 'Project ID is required' })

  const { error } = await sudoPublicDbClient.from('project_updates').insert({
    title,
    message,
    image_url: imageUrl,
    project: projectId,
    poster_user_id: session.user.id,
  })
  if (error) {
    console.error('Error occurred', error)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }

  return res.status(200).json('Success')
}

export default handler
