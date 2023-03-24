import axios from 'axios'
import { readNetwork } from 'constants/networks'
import { getLogger } from 'lib/logger'

const SEPANA_ALERTS = {
  DB_UPDATE_ERROR: 'Error updating database',
  BAD_DB_HEALTH: 'Errors in database',
}

const SEPANA_NOTIFS = {
  DB_UPDATED: 'Records updated',
  DB_OK: 'Database is OK',
}

const SEPANA_WEBHOOK_URL = process.env.SEPANA_WEBHOOK_URL

type SepanaLogOpts =
  | {
      type: 'alert'
      alert: keyof typeof SEPANA_ALERTS
    }
  | {
      type: 'notification'
      notif: keyof typeof SEPANA_NOTIFS
    }

const logger = getLogger('lib/sepana')

export async function sepanaLog(
  opts: SepanaLogOpts & {
    body?: string
  },
) {
  const { type, body } = opts

  // log the error to the console
  if (type === 'alert') {
    logger.error({ data: { type, message: SEPANA_ALERTS[opts.alert] } })
  } else {
    logger.info({ data: { type, message: SEPANA_NOTIFS[opts.notif] } })
  }

  const bodyText = body ? `\n${body}` : ''

  let discordNotificationContent
  if (type === 'alert') {
    discordNotificationContent = `🚨 **${SEPANA_ALERTS[opts.alert]}** (${
      readNetwork.name
    }) <@&1064689520848674888> ${bodyText}`
  } else {
    discordNotificationContent = `**${SEPANA_NOTIFS[opts.notif]}** (${
      readNetwork.name
    }) ${bodyText}`
  }

  if (!SEPANA_WEBHOOK_URL) {
    console.error('Missing .env var required to log Sepana Alert', {
      content: discordNotificationContent,
    })
    return Promise.resolve()
  }

  return await axios.post(SEPANA_WEBHOOK_URL, {
    content: discordNotificationContent.substring(0, 2000), // Max size of Discord message
  })
}
