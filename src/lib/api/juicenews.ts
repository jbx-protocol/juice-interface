import axios from 'axios'

export function createJuicenewsSubscription(emailAddress: string) {
  return axios.post(`/api/juicenews/subscription`, {
    email: emailAddress,
  })
}
