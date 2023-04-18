import { NextApiRequest, NextApiResponse } from 'next'

const JUICE_API_BEARER_TOKEN = process.env.JUICE_API_BEARER_TOKEN

/**
 * Checks if the request is authorized.
 *  If not, it will return a 401 response.
 *
 * @param req The request object.
 * @param res The response object.
 * @returns True if the request is authorized, undefined otherwise.
 */
export const authCheck = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!JUICE_API_BEARER_TOKEN) return true
  const { authorization } = req.headers
  if (!authorization) {
    res.status(401).json({ message: 'Unauthorized.' })
    return
  }
  const token = authorization.replace('Bearer ', '')
  if (token !== JUICE_API_BEARER_TOKEN) {
    res.status(401).json({ message: 'Unauthorized.' })
    return
  }

  return true
}
