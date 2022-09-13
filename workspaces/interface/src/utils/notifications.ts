import { notification } from 'antd'

const DEFAULT_ERROR_NOTIFICATION_DURATION_SECONDS = 3

export const emitErrorNotification = (
  message: string,
  {
    description,
    duration,
  }: {
    description?: string
    duration?: number
  } = { duration: DEFAULT_ERROR_NOTIFICATION_DURATION_SECONDS },
) => {
  const key = new Date().valueOf().toString()
  return notification.error({
    key,
    message,
    description,
    duration,
    onClick() {
      notification.close(key)
    },
  })
}

export const emitSuccessNotification = (
  message: string,
  {
    description,
    duration,
  }: {
    description?: string
    duration?: number
  } = { duration: DEFAULT_ERROR_NOTIFICATION_DURATION_SECONDS },
) => {
  const key = new Date().valueOf().toString()
  return notification.success({
    key,
    message,
    description,
    duration,
    onClick() {
      notification.close(key)
    },
  })
}
