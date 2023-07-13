import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { NextApiRequest, NextApiResponse } from 'next'
import { authenticateUserApiCall } from 'server/auth'
import { isEqualAddress } from 'utils/address'

/**
 * Authenticate project update operation.
 * Not be confused with updating a project - this is explicitly for CUD operations on project updates.
 *
 * Checks if the user is authenticated, and if the user is the owner of the project.
 */
export const authenticateProjectUpdateOperation = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await authenticateUserApiCall(req, res)
  if (!session) return false

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

  return session
}
