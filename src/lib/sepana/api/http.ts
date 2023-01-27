import axios from 'axios'

type SepanaPermission = 'read' | 'read/write' | 'admin'

export const sepanaAxios = (permission: SepanaPermission) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEPANA_API_URL,
    headers: sepanaHeaders(permission),
  })

const sepanaHeaders = (permission: SepanaPermission) => {
  let key: string

  switch (permission) {
    case 'read':
      if (!process.env.SEPANA_READ_API_KEY) {
        throw new Error('Missing SEPANA_READ_API_KEY')
      }
      key = process.env.SEPANA_READ_API_KEY
      break
    case 'read/write':
      if (!process.env.SEPANA_READ_WRITE_API_KEY) {
        throw new Error('Missing SEPANA_READ_WRITE_API_KEY')
      }
      key = process.env.SEPANA_READ_WRITE_API_KEY
      break
    case 'admin':
      if (!process.env.SEPANA_ADMIN_API_KEY) {
        throw new Error('Missing SEPANA_ADMIN_API_KEY')
      }
      key = process.env.SEPANA_ADMIN_API_KEY
      break
  }

  return {
    'x-api-key': key,
    'Content-Type': 'application/json',
  }
}
