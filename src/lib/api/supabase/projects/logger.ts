import axios from 'axios'
import { readNetwork } from 'constants/networks'
import { getLogger } from 'lib/logger'

const SBP_ALERTS = {
  DB_UPDATE_ERROR: 'Error updating database',
  BAD_DB_HEALTH: 'Errors in database',
}

const SBP_NOTIFS = {
  DB_UPDATED: 'Records updated',
  DB_OK: 'Database is OK',
}

const SB_PROJECTS_WEBHOOK_URL = process.env.SB_PROJECTS_WEBHOOK_URL

type SBPLogOpts =
  | {
      type: 'alert'
      alert: keyof typeof SBP_ALERTS
    }
  | {
      type: 'notification'
      notif: keyof typeof SBP_NOTIFS
    }

const logger = getLogger('lib/sepana')

export async function sbpLog(
  opts: SBPLogOpts & {
    body?: string
  },
) {
  const { type, body } = opts

  // log the error to the console
  if (type === 'alert') {
    logger.error({ data: { type, message: SBP_ALERTS[opts.alert] } })
  } else {
    logger.info({ data: { type, message: SBP_NOTIFS[opts.notif] } })
  }

  const bodyText = body ? `\n${body}` : ''

  let discordNotificationContent
  if (type === 'alert') {
    discordNotificationContent = `🚨 **${SBP_ALERTS[opts.alert]}** (${
      readNetwork.name
    }) <@&1064689520848674888> ${bodyText}`
  } else {
    discordNotificationContent = `**${SBP_NOTIFS[opts.notif]}** (${
      readNetwork.name
    }) ${bodyText}`
  }

  if (!SB_PROJECTS_WEBHOOK_URL) return Promise.resolve()

  return await axios.post(SB_PROJECTS_WEBHOOK_URL, {
    content: discordNotificationContent.substring(0, 2000), // Max size of Discord message
  })
}
