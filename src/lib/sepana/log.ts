import axios from 'axios'
import { SPEngine } from './api/engines'

const SEPANA_ALERTS = {
  DB_UPDATE_ERROR: 'Error updating database',
  BAD_DB_HEALTH: 'Errors in database',
}

const SEPANA_NOTIFS = {
  DB_UPDATED: 'Records updated',
  DB_OK: 'Database is OK',
}

export async function sepanaLog(
  opts: (
    | {
        type: 'alert'
        alert: keyof typeof SEPANA_ALERTS
      }
    | {
        type: 'notification'
        notif: keyof typeof SEPANA_NOTIFS
      }
  ) & {
    engine?: SPEngine
    body?: string
  },
) {
  const network = process.env.NEXT_PUBLIC_INFURA_NETWORK
  const url = process.env.SEPANA_WEBHOOK_URL

  const { type, engine, body } = opts

  const content = `${opts.type === 'alert' ? '🚨' : ''} **${
    type === 'alert' ? SEPANA_ALERTS[opts.alert] : SEPANA_NOTIFS[opts.notif]
  }** (${network}${engine ? `- ${engine}` : ''})${
    type === 'alert' ? ' <@&1064689520848674888>' : '' // @dev discord role id
  }${body ? `\n${body}` : ''}`

  if (!url || !network) {
    console.error('Missing .env var required to log Sepana Alert', { content })
    return Promise.resolve()
  }

  return await axios.post(url, {
    content: content.substring(0, 2000), // Max size of Discord message
  })
}
