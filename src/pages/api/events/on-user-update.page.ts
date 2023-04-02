import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed.' })
  }

  console.info(req.body)
  res.status(200).json({ message: 'ok' })
}

export default handler
