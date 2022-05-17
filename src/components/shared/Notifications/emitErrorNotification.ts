import { notification } from 'antd'

export const emitErrorNotification = (
  message: string,
  description?: string,
  duration?: number,
) => {
  const key = new Date().valueOf().toString()
  return notification.error({
    key,
    message,
    description,
    duration: duration || 3,
    onClick: () => {
      notification.close(key)
    },
  })
}
