import { BellFilled, BellOutlined } from '@ant-design/icons'
import { Badge } from 'components/Badge'

export const SubscribeButtonIcon = ({
  isSubscribed,
}: {
  isSubscribed: boolean
}) => {
  return (
    <div className="flex items-center gap-x-2">
      {isSubscribed ? <BellFilled /> : <BellOutlined />}
      <Badge variant="info">New</Badge>
    </div>
  )
}
