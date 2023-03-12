import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .max(320, 'Invalid email'),
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const supabase = createServerSupabaseClient({ req, res })
    const session = await supabase.auth.getSession()
    if (!session.data.session) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed.' })
    }
    let email
    try {
      const result = await Schema.validate(req.body)
      email = result.email
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.info('Error occurred', e)
      return res
        .status(400)
        .json({ message: e?.errors?.[0] ?? 'Unexpected error.' })
    }

    const result = await supabase.auth.updateUser({ email })
    if (result.error) {
      if (result.error.status === 422) {
        return res.status(409).json({ message: 'Email is already registered.' })
      }
      throw result.error
    }
    return res.status(200).json('Success')
  } catch (e) {
    console.error('Error occurred', e)
    return res.status(500).json({ message: 'Internal server error occurred.' })
  }
}

export default handler
