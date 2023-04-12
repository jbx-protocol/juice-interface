import { BellFilled, BellOutlined } from '@ant-design/icons'

export const SubscribeButtonIcon = ({
  isSubscribed,
}: {
  isSubscribed: boolean
}) => {
  return (
    <div className="flex items-center gap-x-2">
      {isSubscribed ? <BellFilled /> : <BellOutlined />}
    </div>
  )
}
