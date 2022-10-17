import { LoadingOutlined } from '@ant-design/icons'
import { Image, ImageProps } from 'antd'
import { stopPropagation } from 'react-stop-propagation'

interface RewardImageProps extends ImageProps {
  size: string | number
}

export const RewardImage = (props: RewardImageProps) => {
  return (
    <Image
      {...props}
      placeholder={<LoadingOutlined />}
      style={{
        width: props.size,
        height: props.size,
        objectFit: 'cover',
        objectPosition: 'center',
      }}
      onClick={stopPropagation(props.onClick)}
    />
  )
}
