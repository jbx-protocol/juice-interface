import { notification } from 'antd'

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
    message,
    ...opts,
    duration: opts?.duration ?? null,
  })
}

export const emitSuccessNotification = (
  message: string,
  opts?: {
    description?: string
    duration?: number | null
  },
) => {
  const key = new Date().valueOf().toString()
  return notification.success({
    key,
    message,
    ...opts,
    duration: opts?.duration ?? 5,
  })
}
