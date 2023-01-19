import axios from 'axios'

const BEEHIV_API_BASE_URL = `https://api.beehiiv.com/v2`
const axiosInstance = axios.create({
  baseURL: BEEHIV_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.BEEHIV_API_KEY}`,
  },
})

const JUICENEWS_PUBLICATION_ID = 'TODO'

export function createSubscription(
  emailAddress: string,
  publicationId: string = JUICENEWS_PUBLICATION_ID,
) {
  return axiosInstance.post(`/publications/${publicationId}/subscriptions`, {
    email: emailAddress,
    utm_source: 'juicebox-money-homepage',
    referring_site: 'https://juicebox.money',
  })
}
