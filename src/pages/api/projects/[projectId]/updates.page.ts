import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { NextApiRequest, NextApiResponse } from 'next'
import { authenticateUserApiCall } from 'server/auth'
import { isEqualAddress } from 'utils/address'
import * as Yup from 'yup'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await sudoPublicDbClient.auth.getSession()
  if (!session) return res.status(401).json({ message: 'Unauthorized.' })

  try {
    switch (req.method) {
      case 'POST':
        return await POST(req, res)
    }
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
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
