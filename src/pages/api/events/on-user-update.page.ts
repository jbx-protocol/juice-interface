import { emailServerClient } from 'lib/api/postmark'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { welcomeEmailTemplate } from 'templates/email/welcome-email'
import * as Yup from 'yup'

const logger = getLogger('api/events/on-user-update')

const Schema = Yup.object().shape({
  type: Yup.string().required(),
  table: Yup.string().required(),
  schema: Yup.string().required(),
  // Record contains email_verified boolean
  record: Yup.object().shape({
    email_verified: Yup.boolean(),
    email: Yup.string().email(),
  }),
  old_record: Yup.object().shape({
    email_verified: Yup.boolean(),
  }),
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed.' })
  }

  try {
    let result
    try {
      result = await Schema.validate(req.body)
    } catch {
      return res.status(400).json({ error: 'invalid request' })
    }
    if (
      !(
        result.type === 'UPDATE' &&
        result.table === 'users' &&
        result.schema === 'public'
      )
    ) {
      return res.status(400).json({ error: 'invalid request' })
    }

    const { email_verified: newEmailVerified } = result.record
    const { email_verified: oldEmailVerified } = result.old_record

    const eventIsNewEmailVerification =
      newEmailVerified !== oldEmailVerified && newEmailVerified === true

    if (eventIsNewEmailVerification) {
      const { email } = result.record
      // Send welcome email using postmark
      const welcomeEmail = welcomeEmailTemplate()
      const res = await emailServerClient().sendEmail({
        From: 'noreply@juicebox.money',
        To: email,
        Subject: welcomeEmail.subject,
        HtmlBody: welcomeEmail.htmlBody,
      })
      logger.info('api::events::on-user-update::email', res)
    }

    return res.status(200).json({ message: 'ok' })
  } catch (e) {
    logger.error('api::events::on-user-update::error', e)
    return res.status(500).json({ error: 'internal server error' })
  }
}

export default handler
