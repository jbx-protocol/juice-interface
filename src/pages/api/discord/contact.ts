import { createContactMessage } from 'lib/discord'
import { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'

const Schema = Yup.object().shape({
  message: Yup.string().required(),
  name: Yup.string().required(),
  contact: Yup.string().required(),
  contactPlatform: Yup.string().required(),
  subject: Yup.string().required(),
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed.' })
  }
  let request
  try {
    request = await Schema.validate(req.body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('api::discord::contact::validation', e.errors)
    return res.status(400).json({ error: e.errors })
  }

  try {
    await createContactMessage(request.message, request)
    return res.status(201).json(request)
  } catch (e) {
    console.error('api::discord::contact::error', e)
    return res.status(500).json({ error: 'failed to send contact message' })
  }
}

export default handler
