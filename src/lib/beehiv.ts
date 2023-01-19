import axios from 'axios'

const BEEHIV_API_BASE_URL = `https://juicenews.beehiiv.com`
const axiosInstance = axios.create({
  baseURL: BEEHIV_API_BASE_URL,
  headers: { origin: BEEHIV_API_BASE_URL },
})

export function createSubscription(emailAddress: string) {
  return axiosInstance.post(`/create`, `email=${emailAddress}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}
