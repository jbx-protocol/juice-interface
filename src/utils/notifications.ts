import { notification } from 'antd'

/**
 * @param message Title of notification
 * @param description Message to include in notification
 * @param duration in seconds for how long the notification should persist. Pass `null` to persist indefinitely
 */
export const emitErrorNotification = (
  message: string,
  {
    description,
    duration = null,
  }: {
    description?: string
    duration?: number | null
  },
) => {
  const key = new Date().valueOf().toString()
  return notification.error({
    key,
    message,
    description,
    duration,
  })
}

export const emitSuccessNotification = (
  message: string,
  {
    description,
    duration = 5,
  }: {
    description?: string
    duration?: number | null
  },
) => {
  const key = new Date().valueOf().toString()
  return notification.success({
    key,
    message,
    description,
    duration,
  })
}
