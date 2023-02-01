import axios from 'axios'

export function createContactMessage(
  name: string,
  contact: string,
  contactPlatform: string,
  subject: string,
  message: string,
) {
  return axios.post(`/api/discord/contact`, {
    name,
    contact,
    contactPlatform,
    subject,
    message,
  })
}
