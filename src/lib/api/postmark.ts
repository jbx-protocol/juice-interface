import { ServerClient } from 'postmark'

let client: ServerClient | undefined

// Lazy initialization
export const emailServerClient = () => {
  if (!client) {
    client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN)
  }
  return client
}
