import axios from 'axios'
import { ContactMessageMetadata } from 'lib/discord'

export function createContactMessage(
  props: {
    message: string
  } & ContactMessageMetadata,
) {
  return axios.post(`/api/discord/contact`, props)
}
