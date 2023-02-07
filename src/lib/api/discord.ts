import axios from 'axios'
import { ContactMessageMetadata } from 'lib/discord'

export function createContactMessage(
  message: string,
  metadata: ContactMessageMetadata,
) {
  return axios.post(`/api/discord/contact`, {
    message,
    metadata,
  })
}
