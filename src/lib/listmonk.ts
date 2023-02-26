import axios from 'axios'
import { PV } from 'models/pv'

const url = process.env.LISTMONK_URL
const user = process.env.LISTMONK_USER
const pass = process.env.LISTMONK_PASS
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from(`${user}:${pass}`, 'utf8').toString(
    'base64',
  )}`,
}
const network = process.env.NEXT_PUBLIC_INFURA_NETWORK

function checkEnv() {
  if (!network) {
    console.error(
      'Could not find network. Double check NEXT_PUBLIC_INFURA_NETWORK.',
    )
    throw new Error(
      'Could not find network. Double check NEXT_PUBLIC_INFURA_NETWORK.',
    )
  }

  if (!url || !user || !pass) {
    console.error(
      'Missing a Listmonk .env var. Double check LISTMONK_URL, LISTMONK_USER, and LISTMONK_PASS.',
    )
    throw new Error(
      'Missing a Listmonk .env var. Double check LISTMONK_URL, LISTMONK_USER, and LISTMONK_PASS.',
    )
  }
}

export function broadcastMessage(
  lists: number[],
  { body, subject, send_at, pv, projectId }: ListmonkMessageData,
) {
  checkEnv()

  const requestBody = {
    name: `${network} v${pv}p${projectId}: ${subject}`,
    type: 'regular',
    content_type: 'markdown',
    lists,
    send_at,
    subject,
    body,
  }

  return axios.post(url + '/api/campaigns', JSON.stringify(requestBody), {
    headers,
  })
}

function getLists() {
  checkEnv()
  return axios.get(url + '/api/lists?per_page=all', { headers })
}

export async function getListId(projectId: number, pv: PV) {
  const lists = await getLists()
  return lists.data.results.find((v: { tags: unknown[] }) =>
    v.tags.find(w => w === `${network}-v${pv}p${projectId}`),
  ).id
}

export async function getUserId(email: string) {
  checkEnv()
  const search = await axios.get(
    url + `/api/subscribers?query=subscribers.email = ${email}"`,
    { headers },
  )
  return search.data.results[0].id
}

export function createList({ name, projectId, pv }: ListmonkListData) {
  checkEnv()
  const requestBody = {
    name,
    description: `Updates from Juicebox v${pv} project #${projectId} on ${network}.`,
    type: 'public',
    optin: 'double',
    tags: ['project', `${network}-v${pv}p${projectId}`],
  }

  return axios.post(url + '/api/lists', JSON.stringify(requestBody), {
    headers,
  })
}

// Create new subscription
export function createSubscription(
  lists: number[],
  { name, email }: ListmonkSubscriptionData,
) {
  checkEnv()

  const requestBody = {
    status: 'enabled',
    name,
    email,
    lists,
  }

  return axios.post(url + '/api/subscribers', JSON.stringify(requestBody), {
    headers,
  })
}

// Add list to existing subscription
export function addToList(lists: number[], users: number[]) {
  checkEnv()

  const requestBody = {
    ids: users,
    target_list_ids: lists,
    action: 'add',
    status: 'unconfirmed',
  }

  return axios.put(
    url + '/api/subscribers/lists',
    JSON.stringify(requestBody),
    { headers },
  )
}

export interface ListmonkMessageData {
  body: string
  subject: string
  send_at: Date
  projectId: number
  pv: PV
}

export interface ListmonkListData {
  name: string
  projectId: number
  pv: PV
}

export interface ListmonkSubscriptionData {
  name: string
  email: string
  projectId: number
  pv: PV
}
