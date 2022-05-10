import { notification } from 'antd'

export const emitErrorNotification = (message: string) => {
  notification.error({
    key: new Date().valueOf().toString(),
    message,
    duration: 0,
  })
}
