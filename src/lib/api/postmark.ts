import { ServerClient } from 'postmark'

export const emailServerClient = new ServerClient(
  process.env.POSTMARK_SERVER_TOKEN,
)
