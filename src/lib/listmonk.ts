import axios from 'axios'
import { PV } from 'models/pv'

const url = process.env.LISTMONK_URL
const user = process.env.LISTMONK_USER
const pass = process.env.LISTMONK_PASS
const lists = [process.env.LISTMONK_LIST_ID]

export function broadcastMessage({
  body,
  subject,
  send_at,
  pv,
  projectId,
}: ListmonkMessageData) {
  const messageBody = {
    name: `v${pv}p${projectId}: ${subject}`,
    type: 'regular',
    content_type: 'markdown',
    lists,
    send_at,
    subject,
    body,
  }

  if (!url || !user || !pass || !lists) {
    console.error(
      'Missing a Listmonk .env var. Double check LISTMONK_URL, LISTMONK_USER, and LISTMONK_PASS. Message body: ',
      JSON.stringify(messageBody),
    )
    throw new Error(
      'Missing a Listmonk .env var. Double check LISTMONK_URL, LISTMONK_USER, and LISTMONK_PASS.',
    )
  }

  return axios.post(url + '/api/campaigns', JSON.stringify(messageBody), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${user}:${pass}`, 'utf8').toString(
        'base64',
      )}`,
    },
  })
}

export interface ListmonkMessageData {
  body: string
  subject: string
  send_at: Date
  projectId: number
  pv: PV
}
