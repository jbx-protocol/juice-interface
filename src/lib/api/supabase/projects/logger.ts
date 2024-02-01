import axios from 'axios'
import { readNetwork } from 'constants/networks'
import { getLogger } from 'lib/logger'

const DBP_ALERTS = {
  DB_UPDATE_ERROR: 'Error updating database',
  BAD_DB_HEALTH: 'Errors in database',
}

const DBP_NOTIFS = {
  DB_UPDATED: 'Records updated',
  DB_OK: 'Database is OK',
}

const DB_PROJECTS_WEBHOOK_URL = process.env.DB_PROJECTS_WEBHOOK_URL

type DBPLogOpts =
  | {
      type: 'alert'
      alert: keyof typeof DBP_ALERTS
    }
  | {
      type: 'notification'
      notif: keyof typeof DBP_NOTIFS
    }

const logger = getLogger('lib/dbProjects')

export async function dbpLog(
  opts: DBPLogOpts & {
    body?: string
  },
) {
  const { type, body } = opts

  // log the error to the console
  if (type === 'alert') {
    logger.error({ data: { type, message: DBP_ALERTS[opts.alert], body } })
  } else {
    logger.info({ data: { type, message: DBP_NOTIFS[opts.notif] } })
  }

  const bodyText = body ? `\n${body}` : ''

  let discordNotificationContent
  if (type === 'alert') {
    discordNotificationContent = `🚨 **${DBP_ALERTS[opts.alert]}** (${
      readNetwork.name
    }) <@&1064689520848674888> ${bodyText}`
  } else {
    discordNotificationContent = `**${DBP_NOTIFS[opts.notif]}** (${
      readNetwork.name
    }) ${bodyText}`
  }

  if (!DB_PROJECTS_WEBHOOK_URL) return Promise.resolve()

  return await axios.post(DB_PROJECTS_WEBHOOK_URL, {
    content: discordNotificationContent.substring(0, 2000), // Max size of Discord message
  })
}
