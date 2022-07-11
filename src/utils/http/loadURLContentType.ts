import axios from 'axios'

export async function loadURLContentType(url: string | undefined) {
  if (url === undefined) return undefined

  try {
    return await axios.get(url).then(res => res.headers['content-type'])
  } catch (e) {
    return undefined
  }
}
