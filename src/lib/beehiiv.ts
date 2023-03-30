import axios from 'axios'

const BEEHIIV_API_BASE_URL = `https://juicenews.beehiiv.com`
const axiosInstance = axios.create({
  baseURL: BEEHIIV_API_BASE_URL,
  headers: {
    origin: BEEHIIV_API_BASE_URL,
    referer: BEEHIIV_API_BASE_URL,
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  },
})

export function createSubscription(emailAddress: string) {
  return axiosInstance.post<{ toast: { message: string; status: string } }>(
    `/create?_data=routes/__actions/create`,
    `email=${encodeURIComponent(emailAddress)}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
}
