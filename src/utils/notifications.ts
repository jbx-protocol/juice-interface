import { notification } from 'antd'
import ErrorNotificationButtons from 'components/buttons/ErrorNotificationButtons'

/**
 * @param message Title of notification
 * @param description Message to include in notification
 * @param duration in seconds for how long the notification should persist. Pass `null` to persist indefinitely
 */
export const emitErrorNotification = (
  message: string,
  opts?: {
    description?: string
    duration?: number | null
  },
) => {
  const key = new Date().valueOf().toString()
  return notification.error({
    key,
    btn: ErrorNotificationButtons(),
    message,
    ...opts,
    duration: opts?.duration ?? null,
  })
}

export const emitInfoNotification = (
  message: string,
  opts?: {
    description?: string
    duration?: number | null
  },
) => {
  const key = new Date().valueOf().toString()
  return notification.info({
    key,
    message,
    ...opts,
    duration: opts?.duration ?? 5,
  })
}
