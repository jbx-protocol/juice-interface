import { LoadingOutlined } from '@ant-design/icons'
import { Image, ImageProps } from 'antd'
import { stopPropagation } from 'react-stop-propagation'
import { classNames } from 'utils/classNames'

export const RewardImage = (props: ImageProps) => {
  return (
    <Image
      {...props}
      className={classNames('object-cover object-center', props.className)}
      placeholder={<LoadingOutlined />}
      onClick={stopPropagation(props.onClick)}
    />
  )
}
