import axios from 'axios'

const BEEHIIV_API_BASE_URL = `https://juicenews.beehiiv.com`
const axiosInstance = axios.create({
  baseURL: BEEHIIV_API_BASE_URL,
  headers: { origin: BEEHIIV_API_BASE_URL },
})

export function createSubscription(emailAddress: string) {
  return axiosInstance.post(`/create`, `email=${emailAddress}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}
