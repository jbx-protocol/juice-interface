import axios from 'axios'

export function createSubscription(emailAddress: string) {
  return axios.post(`/api/juicenews/subscription`, {
    email: emailAddress,
  })
}
